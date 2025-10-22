import { openDB, DBSchema, IDBPDatabase } from "idb";
import { TimeSession } from "../../types/timeTracking";

/**
 * Define database schema with TypeScript
 * This provides type safety for all IndexedDB operations
 */
interface TimeTrackingDB extends DBSchema {
  sessions: {
    key: string; // session.id
    value: TimeSession;
    indexes: {
      by_domain: string; // domain for aggregation
      by_startTime: number; // startTime for sorting and date filtering
    };
  };
}

const DB_NAME = "TimeTrackingDB";
const DB_VERSION = 1;

/**
 * Cached database promise to avoid repeated openDB() calls
 * Lazily initialized on first access
 */
let dbPromise: Promise<IDBPDatabase<TimeTrackingDB>> | null = null;

/**
 * Returns the cached database promise
 * The connection is opened once per service worker lifecycle
 *
 * @returns Promise resolving to the database instance
 */
export const getDatabase = (): Promise<IDBPDatabase<TimeTrackingDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<TimeTrackingDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`Upgrading database from v${oldVersion} to v${newVersion}`);

        // Version 1: Initial schema
        if (oldVersion < 1) {
          // Create sessions object store
          const sessionStore = db.createObjectStore("sessions", {
            keyPath: "id", // Use session.id as primary key
          });

          // Create indexes for efficient queries
          sessionStore.createIndex("by_domain", "domain", { unique: false });
          sessionStore.createIndex("by_startTime", "startTime", {
            unique: false,
          });

          console.log("Created sessions store with indexes");
        }

        // Future versions can add migration logic here
        // if (oldVersion < 2) { ... }
      },
      blocked() {
        console.warn("Database blocked - another tab may be open");
      },
      blocking() {
        console.warn("This connection is blocking a newer version");
      },
    });
  }
  return dbPromise;
};

/**
 * Closes the database connection and resets the cache
 * Call during service worker shutdown if needed
 */
export const closeDatabase = async (): Promise<void> => {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  }
};

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
 * Opens or creates the TimeTracking IndexedDB database
 * Handles schema creation and versioning
 *
 * @returns Promise resolving to the database instance
 */
export const getDatabase = async (): Promise<IDBPDatabase<TimeTrackingDB>> => {
  return openDB<TimeTrackingDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
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
};

/**
 * Closes the database connection
 * Call during service worker shutdown if needed
 */
export const closeDatabase = async (): Promise<void> => {
  const db = await getDatabase();
  db.close();
};

import { getDatabase } from "./database";
import { TimeSession } from "../../types/timeTracking";
import { isToday } from "../../utils/isToday";

export const saveSession = async (session: TimeSession): Promise<void> => {
  try {
    const db = await getDatabase();
    await db.add("sessions", session);
    console.log(`Saved session ${session.id} to IndexedDB`);
  } catch (error) {
    console.error("Failed to save session:", error);
    throw error;
  }
};

export const saveSessions = async (sessions: TimeSession[]): Promise<void> => {
  try {
    const db = await getDatabase();
    const tx = db.transaction("sessions", "readwrite");

    await Promise.all([
      ...sessions.map((session) => tx.store.add(session)),
      tx.done, // Wait for transaction to complete
    ]);

    console.log(`Saved ${sessions.length} sessions to IndexedDB`);
  } catch (error) {
    console.error("Failed to save sessions batch:", error);
    throw error;
  }
};

// TODO: P2 Optimize to use IDBKeyRange
export const getTodaySessions = async (): Promise<TimeSession[]> => {
  try {
    const db = await getDatabase();

    const allSessions = await db.getAllFromIndex("sessions", "by_startTime");
    const todaySessions = allSessions.filter((session) =>
      isToday(session.startTime)
    );

    console.log(`Retrieved ${todaySessions.length} sessions from today`);
    return todaySessions;
  } catch (error) {
    console.error("Failed to get today sessions:", error);
    return [];
  }
};

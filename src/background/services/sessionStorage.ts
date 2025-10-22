import { getDatabase } from "./database";
import { TimeSession } from "../../types/timeTracking";
import { getEndOfToday, getStartOfToday } from "../../utils/todayUtils";

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

export const getTodaySessions = async (): Promise<TimeSession[]> => {
  try {
    const db = await getDatabase();

    const range = IDBKeyRange.bound(
      getStartOfToday().getTime(),
      getEndOfToday().getTime()
    );

    const todaySessions = await db.getAllFromIndex(
      "sessions",
      "by_startTime",
      range
    );

    console.log(`Retrieved ${todaySessions.length} sessions from today`);
    return todaySessions;
  } catch (error) {
    console.error("Failed to get today sessions:", error);
    return [];
  }
};

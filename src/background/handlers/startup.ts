import { cleanupStaleSessions } from "../services/timeTracking";

export const handleStartup = async () => {
  // Clean up any stale sessions from previous run (crash/force-quit)
  await cleanupStaleSessions();
};

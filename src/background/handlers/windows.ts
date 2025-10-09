import { stopAllActiveSessions } from "../services/timeTracking";

export const handleWindowRemoved = async (windowId: number) => {
  console.log(`Window ${windowId} removed, checking if any windows remain`);

  // Check if any windows remain
  const windows = await chrome.windows.getAll();

  if (windows.length === 0) {
    console.log("No windows remain, stopping all active sessions");
    await stopAllActiveSessions();
  } else {
    console.log(`${windows.length} window(s) still open`);
  }
};

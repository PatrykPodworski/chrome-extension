import { stopAllActiveSessions } from "../services/timeTracking";

export const handleWindowRemoved = async (windowId: number) => {
  console.log(`Window ${windowId} removed, checking if any windows remain`);

  // Check if any normal browser windows remain (exclude devtools, popups, panels, etc.)
  const windows = await chrome.windows.getAll({
    windowTypes: ["normal"],
  });

  if (windows.length === 0) {
    console.log("No normal windows remain, stopping all active sessions");
    await stopAllActiveSessions();
  } else {
    console.log(`${windows.length} normal window(s) still open`);
  }
};

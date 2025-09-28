import {
  startTrackingTab,
  stopTrackingTab,
  switchActiveTab,
} from "../services/timeTracking";

export const handleTabUpdate = async (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  // Handle URL changes (navigation within the same tab) - this takes priority
  if (changeInfo.url && tab.url) {
    // Stop tracking current session for this tab
    await stopTrackingTab(tabId);

    // Start new session if it's a valid active tab
    if (tab.active) {
      await startTrackingTab(tabId, tab.url, tab.title || "");
    }
    return; // Exit early to avoid duplicate processing
  }

  // Only act when page is fully loaded, has a URL, and no URL change was processed
  if (changeInfo.status === "complete" && tab.active && tab.url && !changeInfo.url) {
    // Check if we already have an active session to prevent duplicates
    const { getActiveSession } = await import("../services/stateManager");
    const existingSession = await getActiveSession(tabId);

    if (!existingSession) {
      await startTrackingTab(tabId, tab.url, tab.title || "");
    }
  }
};

export const handleTabRemoval = async (
  tabId: number,
  _removeInfo: chrome.tabs.TabRemoveInfo
) => {
  await stopTrackingTab(tabId);
};

export const handleTabActivation = async (
  activeInfo: chrome.tabs.TabActiveInfo
) => {
  await switchActiveTab(activeInfo.tabId);
};

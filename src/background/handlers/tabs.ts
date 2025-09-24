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

  // Only act when page is fully loaded and has a URL (and we haven't already handled URL change)
  if (changeInfo.status === "complete" && tab.active && tab.url) {
    await startTrackingTab(tabId, tab.url, tab.title || "");
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

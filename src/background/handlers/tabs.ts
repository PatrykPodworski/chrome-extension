import {
  startTrackingTab,
  stopTrackingTab,
  switchActiveTab,
  updateActiveSessionUrl,
} from "../services/timeTracking";
import { isSameDomain } from "../../utils/domainUtils";
import { getActiveSession } from "../services/stateManager";

export const handleTabUpdate = async (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  // Handle URL changes (navigation within the same tab) - this takes priority
  if (changeInfo.url && tab.url) {
    // Get existing session for this tab
    const existingSession = await getActiveSession(tabId);

    // If we have an existing session and the domain hasn't changed, just update URL
    if (existingSession && isSameDomain(existingSession.url, tab.url)) {
      await updateActiveSessionUrl(tabId, tab.url, tab.title || "");
      return; // Exit early - session updated, no need to stop/start
    }

    // Different domain or no existing session - stop tracking current session for this tab
    await stopTrackingTab(tabId);

    // Start new session if it's a valid active tab
    if (tab.active) {
      await startTrackingTab(tabId, tab.url, tab.title || "");
    }
    return; // Exit early to avoid duplicate processing
  }

  // Only act when page is fully loaded, has a URL, and no URL change was processed
  if (
    changeInfo.status === "complete" &&
    tab.active &&
    tab.url &&
    !changeInfo.url
  ) {
    // Check if we already have an active session to prevent duplicates
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

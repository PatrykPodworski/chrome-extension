import { getSessions, getTodaySessions } from "../services/stateManager";
import {
  getCurrentTimeSpent,
  stopTrackingTab,
  startTrackingTab,
} from "../services/timeTracking";

// TODO: P2 Better action types
export const CURRENT_TIME_SPENT_REQUESTED = "currentTimeSpentRequested";
export const SESSIONS_REQUESTED = "sessionsRequested";
export const TODAY_SESSIONS_REQUESTED = "todaySessionsRequested";
export const TRACKING_STOPPED = "trackingStopped";
export const TRACKING_STARTED = "trackingStarted";

export const handleMessage = (
  request: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => {
  console.log("Message received in background:", request);

  if (request.action === CURRENT_TIME_SPENT_REQUESTED) {
    getCurrentTimeSpent().then((timeSpent) => {
      sendResponse({ timeSpent });
    });
    return true;
  }

  if (request.action === SESSIONS_REQUESTED) {
    getSessions().then((sessions) => {
      sendResponse({ sessions });
    });
    return true;
  }

  if (request.action === TODAY_SESSIONS_REQUESTED) {
    getTodaySessions()
      .then((sessions) => {
        sendResponse({ sessions });
      })
      .catch((error) => {
        console.error("Error getting today sessions:", error);
        sendResponse({ error: error.message, sessions: [] });
      });
    return true;
  }

  // When page becomes hidden or is unloading, we should pause tracking for that tab
  if (request.action === TRACKING_STOPPED) {
    chrome.tabs.query({}, async (tabs) => {
      const matchingTab = tabs.find((tab) => tab.url === request.url);
      if (matchingTab && matchingTab.id) {
        await stopTrackingTab(matchingTab.id);
      }
    });
    return true;
  }

  // When page becomes visible, start tracking again
  if (request.action === TRACKING_STARTED) {
    chrome.tabs.query({}, async (tabs) => {
      const matchingTab = tabs.find(
        (tab) => tab.url === request.url && tab.active
      );
      if (matchingTab && matchingTab.id) {
        await startTrackingTab(
          matchingTab.id,
          matchingTab.url || "",
          matchingTab.title || ""
        );
      }
    });
    return true;
  }

  // Return false for unhandled actions
  return false;
};

type Message = {
  action: string;
  data?: unknown;
  url?: string;
  timestamp?: number;
};

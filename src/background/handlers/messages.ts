import { getSessions, getTodaySessions } from "../services/stateManager";
import { getCurrentTimeSpent } from "../services/timeTracking";

// TODO: P2 Better action types
export const CURRENT_TIME_SPENT_REQUESTED = "currentTimeSpentRequested";
export const SESSIONS_REQUESTED = "sessionsRequested";
export const TODAY_SESSIONS_REQUESTED = "todaySessionsRequested";

export const handleMessage = (
  request: Message,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
) => {
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

  // Return false for unhandled actions
  return false;
};

type Message = {
  action: string;
  data?: unknown;
  url?: string;
  timestamp?: number;
};

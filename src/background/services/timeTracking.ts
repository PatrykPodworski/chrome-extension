import { TimeSession } from "../../types/timeTracking";
import { isTrackableUrl } from "../../utils/isTrackableUrl";
import { ActiveSession } from "./activeSession";
import { getCurrentTime } from "../../utils/getCurrentTime";
import { getDomainFromUrl } from "../../utils/domainUtils";
import {
  setActiveSession,
  setCurrentActiveTabId,
  getActiveSession,
  saveSession,
  removeActiveSession,
  getCurrentActiveTabId,
} from "./stateManager";

export const startTrackingTab = async (
  tabId: number,
  url: string | undefined,
  title: string
) => {
  if (!isTrackableUrl(url)) {
    return;
  }

  const domain = getDomainFromUrl(url) || "unknown";
  const startTime = getCurrentTime();

  const activeSession: ActiveSession = {
    tabId,
    url,
    title,
    domain,
    startTime,
  };

  await setActiveSession(tabId, activeSession);
  await setCurrentActiveTabId(tabId);

  console.log(`Started tracking tab ${tabId}: ${url}`);
};

export const stopTrackingTab = async (tabId: number) => {
  const activeSession = await getActiveSession(tabId);
  if (!activeSession) {
    return;
  }

  const endTime = getCurrentTime();
  const duration = endTime - activeSession.startTime;

  // Create completed session
  const completedSession: TimeSession = {
    id: crypto.randomUUID(),
    url: activeSession.url,
    title: activeSession.title,
    domain: activeSession.domain,
    startTime: activeSession.startTime,
    endTime,
    duration,
    tabId,
  };

  // Save session to storage
  await saveSession(completedSession);

  // Remove from active sessions
  await removeActiveSession(tabId);

  console.log(
    `Stopped tracking tab ${tabId}: ${duration}ms on ${activeSession.url}`
  );
};

export const switchActiveTab = async (newTabId: number) => {
  // Stop tracking current active tab (if any)
  const currentActiveTabId = await getCurrentActiveTabId();
  if (currentActiveTabId && currentActiveTabId !== newTabId) {
    const currentSession = await getActiveSession(currentActiveTabId);
    if (currentSession) {
      await stopTrackingTab(currentActiveTabId);
    }
  }

  // Start tracking new active tab (if it exists and has a session)
  const newSession = await getActiveSession(newTabId);
  if (newSession) {
    await setCurrentActiveTabId(newTabId);
  } else {
    // Get tab info and start tracking
    try {
      const tab = await chrome.tabs.get(newTabId);
      if (tab.url) {
        await startTrackingTab(newTabId, tab.url, tab.title || "");
      }
    } catch (error) {
      console.log("Could not get tab info:", error);
    }
  }
};

export const updateActiveSessionUrl = async (
  tabId: number,
  newUrl: string,
  newTitle: string
): Promise<void> => {
  try {
    // Get the existing active session for this tab
    const activeSession = await getActiveSession(tabId);

    // If no active session exists, we can't update it
    if (!activeSession) {
      console.log(
        `No active session found for tab ${tabId}, cannot update URL`
      );
      return;
    }

    // Extract domain from new URL
    const newDomain = getDomainFromUrl(newUrl) || "unknown";

    // Create updated session with new URL and title, preserving start time
    const updatedSession: ActiveSession = {
      ...activeSession,
      url: newUrl,
      title: newTitle,
      domain: newDomain,
      // Preserve original startTime
    };

    // Save the updated session
    await setActiveSession(tabId, updatedSession);

    console.log(`Updated session URL for tab ${tabId}: ${newUrl}`);
  } catch (error) {
    console.error(`Failed to update session URL for tab ${tabId}:`, error);
    // Don't throw the error to prevent breaking the calling code
  }
};

export const getCurrentTimeSpent = async () => {
  const currentActiveTabId = await getCurrentActiveTabId();
  if (!currentActiveTabId) {
    return 0;
  }

  const activeSession = await getActiveSession(currentActiveTabId);
  if (!activeSession) {
    return 0;
  }

  return getCurrentTime() - activeSession.startTime;
};

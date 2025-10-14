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
  getAllActiveSessions,
} from "./stateManager";

export const startTrackingTab = async (
  tabId: number,
  url: string | undefined,
  title: string
) => {
  if (!isTrackableUrl(url)) {
    return;
  }

  // Check if we're already tracking this tab
  const existingSession = await getActiveSession(tabId);
  if (existingSession) {
    // If we're already tracking this tab with the same URL, don't create a duplicate
    if (existingSession.url === url) {
      console.log(`Already tracking tab ${tabId} with same URL: ${url}`);
      await setCurrentActiveTabId(tabId);
      return;
    }
    // If URL changed, stop the existing session first
    console.log(
      `URL changed for tab ${tabId}: ${existingSession.url} -> ${url}`
    );
    await stopTrackingTab(tabId);
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

  console.log(`Started tracking tab ${tabId}: ${url} (${domain})`);
};

export const stopTrackingTab = async (tabId: number) => {
  const activeSession = await getActiveSession(tabId);
  if (!activeSession) {
    console.log(`No active session found for tab ${tabId} to stop`);
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

  await removeActiveSession(tabId);
  await saveSession(completedSession);

  console.log(
    `Stopped tracking tab ${tabId}: ${Math.round(duration / 1000)}s on ${
      activeSession.domain
    } (${activeSession.url})`
  );
};

export const switchActiveTab = async (newTabId: number) => {
  const currentActiveTabId = await getCurrentActiveTabId();
  console.log(`Switching active tab from ${currentActiveTabId} to ${newTabId}`);

  // Stop tracking current active tab (if any)
  if (currentActiveTabId && currentActiveTabId !== newTabId) {
    const currentSession = await getActiveSession(currentActiveTabId);
    if (currentSession) {
      console.log(
        `Stopping current active session for tab ${currentActiveTabId}`
      );
      await stopTrackingTab(currentActiveTabId);
    }
  }

  // Start tracking new active tab (if it exists and has a session)
  const newSession = await getActiveSession(newTabId);
  if (newSession) {
    console.log(
      `Tab ${newTabId} already has active session, setting as current active`
    );
    await setCurrentActiveTabId(newTabId);
  } else {
    try {
      const tab = await chrome.tabs.get(newTabId);
      if (tab.url) {
        await startTrackingTab(newTabId, tab.url, tab.title || "");
      }
    } catch (error) {
      console.log(`Could not get tab info for ${newTabId}:`, error);
    }
  }
};

export const updateActiveSessionUrl = async (
  tabId: number,
  newUrl: string,
  newTitle: string
): Promise<void> => {
  // Validate URL before proceeding
  if (!isTrackableUrl(newUrl)) {
    console.log(
      `URL ${newUrl} is not trackable, stopping session for tab ${tabId} instead`
    );
    await stopTrackingTab(tabId);
    return;
  }

  // Get the existing active session for this tab
  const activeSession = await getActiveSession(tabId);

  // If no active session exists, we can't update it
  if (!activeSession) {
    console.log(
      `No active session found for tab ${tabId}, cannot update URL to ${newUrl}`
    );
    return;
  }

  const oldUrl = activeSession.url;
  const oldDomain = activeSession.domain;

  // Extract domain from new URL
  const newDomain = getDomainFromUrl(newUrl) || "unknown";

  console.log(
    `Same-domain URL transition for tab ${tabId}: ${oldUrl} -> ${newUrl} (domain: ${oldDomain} -> ${newDomain})`
  );

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

  console.log(
    `Successfully updated session for tab ${tabId}: ${newUrl} (${newDomain})`
  );
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

export const stopAllActiveSessions = async () => {
  const activeSessions = await getAllActiveSessions();
  const tabIds = Object.keys(activeSessions).map(Number);

  console.log(`Stopping ${tabIds.length} active sessions`);

  for (const tabId of tabIds) {
    await stopTrackingTab(tabId);
  }
};

export const cleanupStaleSessions = async () => {
  const activeSessions = await getAllActiveSessions();
  const tabIds = Object.keys(activeSessions).map(Number);

  if (tabIds.length === 0) {
    console.log("No stale sessions to clean up");
    return;
  }

  console.log(`Cleaning up ${tabIds.length} stale sessions from previous run`);

  for (const tabId of tabIds) {
    const activeSession = activeSessions[tabId];
    if (!activeSession) {
      continue;
    }

    // Create a zero-duration session (endTime = startTime)
    const staleSession: TimeSession = {
      id: crypto.randomUUID(),
      url: activeSession.url,
      title: activeSession.title,
      domain: activeSession.domain,
      startTime: activeSession.startTime,
      endTime: activeSession.startTime,
      duration: 0,
      tabId,
    };

    await saveSession(staleSession);
    await removeActiveSession(tabId);

    console.log(
      `Cleaned up stale session for tab ${tabId}: ${activeSession.domain}`
    );
  }
};

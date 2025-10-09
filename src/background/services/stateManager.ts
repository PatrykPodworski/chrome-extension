import { TimeSession } from "../../types/timeTracking";
import { ActiveSession } from "./activeSession";
import { TimeTrackingState } from "./timeTrackingState";
import { isToday } from "../../utils/isToday";

// TODO: P1 Change the sessions storage solution to avoid quota exceeded error
export const getActiveSession = async (tabId: number) => {
  const state = await getTimeTrackingState();
  return state.activeSessions[tabId];
};

export const getCurrentActiveTabId = async () => {
  const state = await getTimeTrackingState();
  return state.currentActiveTabId;
};

export const getAllActiveSessions = async () => {
  const state = await getTimeTrackingState();
  return state.activeSessions;
};

export const setActiveSession = async (
  tabId: number,
  session: ActiveSession
) => {
  const state = await getTimeTrackingState();
  state.activeSessions[tabId] = session;
  await setTimeTrackingState(state);
};

export const removeActiveSession = async (tabId: number) => {
  const state = await getTimeTrackingState();
  delete state.activeSessions[tabId];

  // Clear current active tab if it was the removed tab
  if (state.currentActiveTabId === tabId) {
    state.currentActiveTabId = undefined;
  }

  await setTimeTrackingState(state);
};

export const setCurrentActiveTabId = async (tabId: number | undefined) => {
  const state = await getTimeTrackingState();
  if (tabId === undefined) {
    state.currentActiveTabId = undefined;
  } else {
    state.currentActiveTabId = tabId;
  }
  await setTimeTrackingState(state);
};

/**
 * Get all completed sessions from storage
 */
export const getSessions = async () => {
  try {
    const result = await chrome.storage.local.get(["sessions"]);
    const sessions: TimeSession[] = result.sessions || [];
    return sessions;
  } catch (error) {
    console.error("Failed to get sessions:", error);
    return [];
  }
};

/**
 * Save a completed session to storage
 */
export const saveSession = async (session: TimeSession) => {
  try {
    const sessions = await getSessions();
    sessions.push(session);
    await chrome.storage.local.set({ sessions });
  } catch (error) {
    console.error("Failed to save session:", error);
  }
};

export const getTodaySessions = async (): Promise<TimeSession[]> => {
  try {
    const allSessions = await getSessions();
    return allSessions.filter((session) => isToday(session.startTime));
  } catch (error) {
    console.error("Error filtering today sessions:", error);
    throw new Error("Failed to filter today sessions");
  }
};

const INITIAL_STATE: TimeTrackingState = {
  activeSessions: {},
  currentActiveTabId: undefined,
};

const getTimeTrackingState = async () => {
  try {
    const result = await chrome.storage.local.get(["timeTrackingState"]);
    const timeTrackingState: TimeTrackingState =
      result.timeTrackingState || INITIAL_STATE;
    return timeTrackingState;
  } catch (error) {
    console.error("Failed to get time tracking state:", error);
    return INITIAL_STATE;
  }
};

const setTimeTrackingState = async (state: TimeTrackingState) => {
  try {
    await chrome.storage.local.set({ timeTrackingState: state });
  } catch (error) {
    console.error("Failed to set time tracking state:", error);
  }
};

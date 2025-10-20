import { ActiveSession } from "./activeSession";
import { TimeTrackingState } from "./timeTrackingState";

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

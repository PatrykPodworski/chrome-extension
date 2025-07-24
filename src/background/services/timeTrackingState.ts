import { ActiveSession } from "./activeSession";

export type TimeTrackingState = {
  activeSessions: { [tabId: number]: ActiveSession };
  currentActiveTabId: number | undefined;
};

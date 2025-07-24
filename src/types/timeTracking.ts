export interface TimeSession {
  id: string;
  url: string;
  title: string;
  domain: string;
  startTime: number;
  endTime?: number;
  duration?: number; // in milliseconds
  tabId: number;
}

export interface ActiveSession {
  tabId: number;
  url: string;
  title: string;
  domain: string;
  startTime: number;
}

export interface TimeTrackingState {
  activeSessions: { [tabId: number]: ActiveSession };
  currentActiveTabId?: number | undefined;
}

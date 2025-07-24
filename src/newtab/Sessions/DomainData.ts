import { TimeSession } from "../../types/timeTracking";

export type DomainData = {
  domain: string;
  totalTime: number;
  sessions: TimeSession[];
};

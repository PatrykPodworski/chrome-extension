import { useMemo } from "react";
import { TimeSession } from "../../../types/timeTracking";
import { DomainData } from "../DomainData";

export const useStatsData = (sessions: TimeSession[]) => {
  const { domainStats, totalTime } = useMemo(() => {
    return sessions.reduce(
      (acc, session) => {
        const domain = session.domain;
        const duration = session.duration;

        // Update domain stats
        if (!acc.domainStats[domain]) {
          acc.domainStats[domain] = {
            domain,
            totalTime: 0,
            sessions: [],
          };
        }
        acc.domainStats[domain].totalTime += duration;
        acc.domainStats[domain].sessions.push(session);

        // Update total time
        acc.totalTime += duration;

        return acc;
      },
      {
        domainStats: {} as Record<string, DomainData>,
        totalTime: 0,
      }
    );
  }, [sessions]);

  const uniqueSitesCount = useMemo(() => {
    return Object.keys(domainStats).length;
  }, [domainStats]);

  return {
    totalSessionsCount: sessions.length,
    totalTime,
    uniqueSitesCount,
    domainStats,
  };
};

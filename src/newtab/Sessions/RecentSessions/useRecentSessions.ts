import { useState, useMemo } from "react";
import { TimeSession } from "../../../types/timeTracking";

export const useRecentSessions = (sessions: TimeSession[]) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const sortedSessions = useMemo(() => {
    return sessions.sort((a, b) => b.startTime - a.startTime);
  }, [sessions]);

  const visibleSessions = useMemo(() => {
    return sortedSessions.slice(0, visibleCount);
  }, [sortedSessions, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, sortedSessions.length));
  };

  return {
    visibleSessions,
    loadMore,
    hasMore: visibleCount < sortedSessions.length,
    remainingCount: sortedSessions.length - visibleCount,
  };
};

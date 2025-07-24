import { useState, useMemo } from "react";
import { DomainData } from "../DomainData";

export const useTopSites = (domainStats: Record<string, DomainData>) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const sortedDomains = useMemo(() => {
    return Object.values(domainStats).sort((a, b) => b.totalTime - a.totalTime);
  }, [domainStats]);

  const visibleDomains = useMemo(() => {
    return sortedDomains.slice(0, visibleCount);
  }, [sortedDomains, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, sortedDomains.length));
  };

  return {
    visibleDomains,
    loadMore,
    hasMore: visibleCount < sortedDomains.length,
    remainingCount: sortedDomains.length - visibleCount,
  };
};

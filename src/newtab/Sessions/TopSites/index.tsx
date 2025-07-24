import { formatDuration } from "../../../utils/timeFormatters";
import { useTopSites } from "./useTopSites";
import { DomainData } from "../DomainData";

const TopSites = ({ domainStats }: TopSitesProps) => {
  const { visibleDomains, loadMore, hasMore, remainingCount } =
    useTopSites(domainStats);

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Top Sites Today</h3>
      <div className="flex flex-col gap-2">
        {visibleDomains.length > 0 ? (
          <>
            {visibleDomains.map((domainData) => (
              <div
                key={domainData.domain}
                className="bg-slate-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium truncate">
                    {domainData.domain}
                  </span>
                  <span className="text-blue-300 text-sm font-mono">
                    {formatDuration(domainData.totalTime)}
                  </span>
                </div>
                <span className="text-slate-400 text-xs mt-1">
                  {domainData.sessions.length} sessions
                </span>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors cursor-pointer"
              >
                Show 5 More ({remainingCount} remaining)
              </button>
            )}
          </>
        ) : (
          <div className="text-slate-400 text-sm">No sessions yet</div>
        )}
      </div>
    </div>
  );
};

type TopSitesProps = {
  domainStats: Record<string, DomainData>;
};

export default TopSites;

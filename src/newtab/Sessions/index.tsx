import { useSessions } from "./useSessions";
import { useStatsData } from "./Stats/useStatsData";
import TopSites from "./TopSites";
import RecentSessions from "./RecentSessions";
import { Stats } from "./Stats";

// TODO: P1 Extract the wrapping component
export const Sessions = () => {
  const { sessions, isLoading, error, refetch } = useSessions();
  const { domainStats } = useStatsData(sessions);

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <h2 className={headerClasses}>Time Tracking</h2>
        <div className="text-white/60">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <h2 className={headerClasses}>Time Tracking</h2>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-400">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h2 className={headerClasses}>Time Tracking</h2>
      <div className="flex flex-col gap-6 overflow-y-auto flex-1">
        <Stats sessions={sessions} />
        <TopSites domainStats={domainStats} />
        <RecentSessions sessions={sessions} />
      </div>
    </div>
  );
};

const containerClasses = "w-96 bg-slate-800 p-6 h-full flex flex-col";
const headerClasses = "text-2xl font-bold text-white mb-6 flex-shrink-0";

import { formatDuration } from "../../../utils/timeFormatters";
import { TimeSession } from "../../../types/timeTracking";
import { useRecentSessions } from "./useRecentSessions";

const RecentSessions = ({ sessions }: RecentSessionsProps) => {
  const { visibleSessions, loadMore, hasMore, remainingCount } =
    useRecentSessions(sessions);

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Recent Sessions</h3>
      <div className="flex flex-col gap-2">
        {visibleSessions.length > 0 ? (
          <>
            {visibleSessions.map((session) => (
              <div key={session.id} className="bg-slate-700 rounded-lg p-3">
                <div className="text-white text-sm font-medium truncate">
                  {session.title}
                </div>
                <div className="text-slate-400 text-xs truncate mt-1">
                  {session.domain} • Tab {session.tabId}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-slate-400 text-xs">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </div>
                  <div className="text-green-300 text-xs font-mono">
                    {formatDuration(session.duration)}
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                className="mt-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors"
              >
                Show 5 More ({remainingCount} remaining)
              </button>
            )}
          </>
        ) : (
          <div className="text-slate-400 text-sm">No recent sessions</div>
        )}
      </div>
    </div>
  );
};

type RecentSessionsProps = {
  sessions: TimeSession[];
};

export default RecentSessions;

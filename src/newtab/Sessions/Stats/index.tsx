import { formatDuration } from "../../../utils/timeFormatters";
import { TimeSession } from "../../../types/timeTracking";
import { useStatsData } from "./useStatsData";

export const Stats = ({ sessions }: StatsProps) => {
  const { totalSessionsCount, totalTime, uniqueSitesCount } =
    useStatsData(sessions);

  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-2">Today's Stats</h3>
      <div className="text-slate-300 text-sm">
        <div>Sessions: {totalSessionsCount}</div>
        <div>Total Time: {formatDuration(totalTime)}</div>
        <div>Unique Sites: {uniqueSitesCount}</div>
      </div>
    </div>
  );
};

type StatsProps = {
  sessions: TimeSession[];
};

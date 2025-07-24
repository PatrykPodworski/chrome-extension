import { formatDuration } from "../utils/timeFormatters";
import useTimeTracking from "./useTimeTracking";

export const App = () => {
  const { currentTimeSpent, currentTab, isLoading, isTrackableUrl } =
    useTimeTracking();

  if (isLoading) {
    console.log("Loading current tab and time spent...");
    return (
      <div className={containerClasses}>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h1 className="text-xl font-bold text-neutral-800 mb-4">Time Tracker</h1>
      <div className="bg-neutral-100 p-4 rounded-lg">
        <h2 className="text-sm font-semibold text-neutral-800">Current Page</h2>
        <div className="text-sm text-neutral-700 break-words text-nowrap overflow-hidden text-ellipsis">
          {currentTab?.title || "No title"}
        </div>
        <div className="text-xs text-neutral-500 text-nowrap overflow-hidden text-ellipsis">
          {currentTab?.url || "No URL"}
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-sm font-semibold text-blue-500">Time Spent</h2>
        <div className="text-2xl font-bold text-blue-800">
          {isTrackableUrl ? formatDuration(currentTimeSpent) : "Not tracked"}
        </div>
        {!isTrackableUrl && (
          <div className="text-xs text-neutral-500">
            Chrome internal pages are not tracked
          </div>
        )}
      </div>
    </div>
  );
};

const containerClasses = "w-xs p-4 bg-neutral-50 shadow-lg flex flex-col gap-2";

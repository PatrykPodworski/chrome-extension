import { useEffect, useState } from "react";
import { formatTime, formatDate } from "../utils/timeUtils";

export const useCurrentTime = () => {
  const [timeData, setTimeData] = useState<TimeData>({
    time: "00:00",
    date: "",
  });

  useEffect(() => {
    const updateTimeData = () => {
      const now = new Date();
      setTimeData({
        time: formatTime(now),
        date: formatDate(now),
      });
    };

    // Update immediately
    updateTimeData();

    // Update every second
    const interval = setInterval(updateTimeData, 1000);

    // Update time when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTimeData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return timeData;
};

type TimeData = {
  time: string;
  date: string;
};

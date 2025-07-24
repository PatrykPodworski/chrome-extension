import { useEffect, useState } from "react";
import { TimeSession } from "../../types/timeTracking";
import { SESSIONS_REQUESTED } from "../../background/handlers/messages";

export const useSessions = () => {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          action: SESSIONS_REQUESTED,
        });
        setSessions(response.sessions || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();

    // Refresh sessions every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return { sessions, isLoading };
};

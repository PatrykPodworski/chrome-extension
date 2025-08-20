import { useEffect, useState } from "react";
import { TimeSession } from "../../types/timeTracking";
import { TODAY_SESSIONS_REQUESTED } from "../../background/handlers/messages";

export const useSessions = () => {
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setError(null); // Clear previous errors
      const response = await chrome.runtime.sendMessage({
        action: TODAY_SESSIONS_REQUESTED,
      });

      if (!response) {
        setError(
          "Extension background script is not responding. Please reload the extension."
        );
        setSessions([]);
        return;
      }

      if (response.error) {
        setError("Unable to load today's sessions. Please try again.");
        setSessions([]);
      } else {
        setSessions(response.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Unable to load today's sessions. Please try again.");
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    // Refresh sessions every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return { sessions, isLoading, error, refetch: fetchSessions };
};

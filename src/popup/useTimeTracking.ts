import { useState, useEffect } from "react";
import { isTrackableUrl } from "../utils/isTrackableUrl";
import { CURRENT_TIME_SPENT_REQUESTED } from "../background/handlers/messages";

const useTimeTracking = () => {
  const [currentTimeSpent, setCurrentTimeSpent] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentTimeSpent = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        action: CURRENT_TIME_SPENT_REQUESTED,
      });
      setCurrentTimeSpent(response.timeSpent || 0);
    } catch (error) {
      console.error("Error updating time:", error);
    }
  };

  const fetchCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setCurrentTab(tab);
    } catch (error) {
      console.error("Error fetching current tab:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchCurrentTab(), fetchCurrentTimeSpent()]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
    const interval = setInterval(fetchCurrentTimeSpent, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentTimeSpent,
    currentTab,
    isLoading,
    isTrackableUrl: isTrackableUrl(currentTab?.url),
  };
};

export default useTimeTracking;

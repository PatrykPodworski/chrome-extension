import {
  TRACKING_STARTED,
  TRACKING_STOPPED,
} from "./background/handlers/messages";
import { getCurrentTime } from "./utils/getCurrentTime";

// Track page visibility changes for more accurate time tracking
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    chrome.runtime.sendMessage({
      action: TRACKING_STOPPED,
      url: window.location.href,
      timestamp: getCurrentTime(),
    });
  } else {
    chrome.runtime.sendMessage({
      action: TRACKING_STARTED,
      url: window.location.href,
      timestamp: getCurrentTime(),
    });
  }
});

// Track beforeunload to save time when leaving page
window.addEventListener("beforeunload", () => {
  chrome.runtime.sendMessage({
    action: TRACKING_STOPPED,
    url: window.location.href,
    timestamp: getCurrentTime(),
  });
});

export {};

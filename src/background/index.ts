import { handleStartup } from "./handlers/startup";
import { handleMessage } from "./handlers/messages";
import {
  handleTabUpdate,
  handleTabRemoval,
  handleTabActivation,
} from "./handlers/tabs";
import { handleWindowRemoved } from "./handlers/windows";
import { closeDatabase } from "./services/database";

// Listen for extension startup (both install and browser restart)
chrome.runtime.onStartup.addListener(handleStartup);

// Also listen for installation to handle fresh installs
chrome.runtime.onInstalled.addListener(handleStartup);

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(handleMessage);

// Listen for tab updates
chrome.tabs.onUpdated.addListener(handleTabUpdate);

// Listen for tab removal
chrome.tabs.onRemoved.addListener(handleTabRemoval);

// Listen for tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener(handleTabActivation);

// Listen for window removal (browser close)
chrome.windows.onRemoved.addListener(handleWindowRemoved);

// Listen for service worker suspension to cleanup resources
chrome.runtime.onSuspend.addListener(async () => {
  console.log("Service worker suspending, closing database connection");
  await closeDatabase();
});

export {};

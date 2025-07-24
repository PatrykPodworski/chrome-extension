import { handleInstallation } from "./handlers/installation";
import { handleMessage } from "./handlers/messages";
import {
  handleTabUpdate,
  handleTabRemoval,
  handleTabActivation,
} from "./handlers/tabs";

// Listen for extension installation
chrome.runtime.onInstalled.addListener(handleInstallation);

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(handleMessage);

// Listen for tab updates
chrome.tabs.onUpdated.addListener(handleTabUpdate);

// Listen for tab removal
chrome.tabs.onRemoved.addListener(handleTabRemoval);

// Listen for tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener(handleTabActivation);

export {};

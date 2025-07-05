// Background script (Service Worker)
console.log("Background script loaded");

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Define message types
interface Message {
  action: string;
  data?: any;
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(
  (request: Message, _sender, sendResponse: (response?: any) => void) => {
    console.log("Message received in background:", request);

    if (request.action === "getData") {
      // Example: Get data from storage
      chrome.storage.sync.get(["data"], (result: { [key: string]: any }) => {
        sendResponse({ data: result.data || "No data found" });
      });
      return true; // Will respond asynchronously
    }

    if (request.action === "saveData") {
      // Example: Save data to storage
      chrome.storage.sync.set({ data: request.data }, () => {
        sendResponse({ success: true });
      });
      return true; // Will respond asynchronously
    }

    // Return false for unhandled actions
    return false;
  }
);

// Listen for tab updates
chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    console.log("Tab update event:", { tabId, changeInfo, url: tab.url });

    // Handle different types of changes
    if (changeInfo.status) {
      console.log(`Tab ${tabId} status changed to: ${changeInfo.status}`);
    }

    if (changeInfo.url) {
      console.log(`Tab ${tabId} URL changed to: ${changeInfo.url}`);
    }

    if (changeInfo.title) {
      console.log(`Tab ${tabId} title changed to: ${changeInfo.title}`);
    }

    // Only act when page is fully loaded
    if (changeInfo.status === "complete" && tab.url) {
      console.log("Page fully loaded:", tab.url);
      // Your custom logic here
    }
  }
);

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab: chrome.tabs.Tab) => {
  console.log("New tab created:", tab.id, tab.url);
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId: number, removeInfo) => {
  console.log("Tab removed:", tabId, removeInfo);
});

// Listen for tab activation (when user switches tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log("Tab activated:", activeInfo.tabId);
});

export {};

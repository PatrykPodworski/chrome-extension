// Content script - runs on web pages
console.log("Content script loaded");

// Example: Add a visual indicator to the page
function addExtensionIndicator(): void {
  const indicator = document.createElement("div");
  indicator.id = "chrome-extension-indicator";
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `;
  indicator.textContent = "Tracking Active";
  document.body.appendChild(indicator);

  // Remove after 3 seconds
  setTimeout(() => {
    indicator.remove();
  }, 3000);
}

// Add indicator when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addExtensionIndicator);
} else {
  addExtensionIndicator();
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener(
  (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log("Message received in content script:", request);

    if (request.action === "getPageInfo") {
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };
      sendResponse(pageInfo);
    }

    return true;
  }
);

export {};

// Popup script
console.log("Popup script loaded - Development Mode Active!");

interface PageInfo {
  title: string;
  url: string;
  timestamp: string;
}

document.addEventListener("DOMContentLoaded", () => {
  const actionButton = document.getElementById(
    "actionButton"
  ) as HTMLButtonElement;
  const statusDiv = document.getElementById("status") as HTMLDivElement;

  if (actionButton && statusDiv) {
    actionButton.addEventListener("click", async () => {
      statusDiv.textContent = "Processing...";

      try {
        // Get current active tab
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab?.id) {
          // Send message to content script
          const response = await chrome.tabs.sendMessage<any, PageInfo>(
            tab.id,
            {
              action: "getPageInfo",
            }
          );

          statusDiv.innerHTML = `
            <strong>Page Info:</strong><br>
            Title: ${response.title}<br>
            URL: ${response.url}<br>
            Time: ${new Date(response.timestamp).toLocaleTimeString()}
          `;

          // Save to storage via background script
          chrome.runtime.sendMessage({
            action: "saveData",
            data: response,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        statusDiv.textContent = "Error occurred";
      }
    });
  }
});

export {};

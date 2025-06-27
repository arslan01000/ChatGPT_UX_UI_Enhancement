chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectSidebar" && sender.tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ["sidebar.js"],
    });
  }
});

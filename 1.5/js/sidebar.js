console.log("✅ Sidebar script running...");

const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round gpt-toc-icon"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot gpt-toc-icon"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

const alignRightIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-right-icon lucide-align-right">
    <path d="M21 12H9"/><path d="M21 18H7"/><path d="M21 6H3"/>
  </svg>`;

const sidebar = document.createElement("div");
sidebar.id = "gpt-navigator-sidebar";
sidebar.className = "gpt-navigator-sidebar";

sidebar.innerHTML = `
  <div class="gpt-sidebar-header">
  ChatFlow Navigator
  <div style="display: flex; gap: 8px;">
    <button id="gpt-nav-refresh" class="gpt-icon-button" title="Refresh">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-refresh-cw gpt-toc-icon">
        <path d="M21 2v6h-6"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      </svg>
    </button>
    <button id="gpt-nav-close" class="gpt-icon-button" title="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-panel-right-close gpt-toc-icon">
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="M15 3v18"/>
        <path d="m8 9 3 3-3 3"/>
      </svg>
    </button>
  </div>
</div>

  <div class="gpt-topic-scroll">
  <div id="gpt-topic-list">Loading topics...</div>
  </div>

`;
document.body.appendChild(sidebar);

const navTriggerBtn = document.createElement("button");
navTriggerBtn.id = "gpt-nav-trigger";
navTriggerBtn.title = "Open ChatFlow Navigator";
navTriggerBtn.className = "gpt-nav-trigger";
navTriggerBtn.innerHTML = alignRightIcon;

document.body.appendChild(navTriggerBtn);

const topicList = document.getElementById("gpt-topic-list");
if (topicList) {
  topicList.innerHTML = `<div class="gpt-loading-spinner">Loading topics...</div>`;
}
setTimeout(generateTOC, 1500);

const MAIN_CONTENT_SELECTOR = "main.relative.h-full.w-full.flex.flex-col";
const sidebarWidth = 320;
// Removed HIGHLIGHT_DURATION and HIGHLIGHT_FADE_OUT_DURATION constants

function shiftMainContent(shiftAmount) {
  const mainContent = document.querySelector(MAIN_CONTENT_SELECTOR);
  if (mainContent) {
    mainContent.style.marginRight = `${shiftAmount}px`;
    mainContent.style.width = `calc(100% - ${shiftAmount}px)`;
    mainContent.style.transition = `margin-right 0.3s ease-in-out, width 0.3s ease-in-out`;
  }
}

let isSidebarOpen = false;
// Removed currentHighlightTimeout variable as it's no longer needed

function hideSidebar() {
  sidebar.style.transform = "translateX(100%)";
  navTriggerBtn.style.display = "block";
  shiftMainContent(0);
  isSidebarOpen = false;
}

function showSidebar() {
  sidebar.style.transform = "translateX(0)";
  navTriggerBtn.style.display = "none";
  shiftMainContent(sidebarWidth);
  isSidebarOpen = true;
}

// Initial state: sidebar hidden, trigger visible
hideSidebar();

// Auto-close on mouse out from sidebar
document.addEventListener("mousemove", (e) => {
  if (isSidebarOpen) {
    if (e.clientX < window.innerWidth - sidebarWidth - 100) {
      hideSidebar();
    }
  }
});

navTriggerBtn.onclick = showSidebar;

document.getElementById("gpt-nav-close").onclick = hideSidebar;

let isManualRefresh = false;

document.getElementById("gpt-nav-refresh").onclick = () => {
  isManualRefresh = true;
  generateTOC();
};

function generateTOC() {
  const messages = document.querySelectorAll(
    "div.markdown.prose, div.markdown.prose.dark\\:prose-invert, div.whitespace-pre-wrap"
  );
  const topicList = document.getElementById("gpt-topic-list");
  if (!topicList) return;

  topicList.innerHTML = `<div class="gpt-loading-spinner">${
    isManualRefresh ? "Refreshing..." : "Loading topics..."
  }</div>`;

  const seen = new Set();
  const anchors = [];

  messages.forEach((msg, index) => {
    const text = msg?.textContent?.trim().replace(/\s+/g, " ");
    if (
      !text ||
      text.length < 1 ||
      text.includes("window.__oai_logHTML") ||
      seen.has(text)
    )
      return;

    seen.add(text);
    const short = text.slice(0, 60) + "...";
    const anchorId = `gpt-toc-anchor-${index}`;
    msg.setAttribute("id", anchorId);

    const anchor = document.createElement("div");
    anchor.className = "gpt-toc-anchor";

    const iconContainer = document.createElement("div");
    iconContainer.innerHTML = msg.classList.contains("whitespace-pre-wrap")
      ? userIcon
      : botIcon;

    const textNode = document.createElement("span");
    textNode.textContent = short;

    anchor.appendChild(iconContainer);
    anchor.appendChild(textNode);

    anchor.onclick = () => {
      // Sidebar topic highlight logic (remains permanent until another clicked)
      document.querySelectorAll(".gpt-toc-anchor").forEach((item) => {
        item.classList.remove("selected");
      });
      anchor.classList.add("selected");

      // Actual content highlight logic (remains permanent until another clicked)
      const targetMessage = document.getElementById(anchorId);
      if (targetMessage) {
        // Removed highlight timeout logic
        // Remove highlight from all other messages
        document
          .querySelectorAll("div.markdown.prose, div.whitespace-pre-wrap")
          .forEach((message) => {
            message.classList.remove("gpt-message-highlight");
          });

        // Add highlight to the clicked message
        targetMessage.classList.add("gpt-message-highlight");

        // Scroll into view
        targetMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    anchors.push(anchor);
  });

  setTimeout(() => {
    topicList.innerHTML = "";
    anchors.forEach((a) => topicList.appendChild(a));
    console.log(
      "🧠 ChatFlow Navigator: Found",
      anchors.length,
      "unique messages"
    );
    isManualRefresh = false;
  }, 400);
}

setTimeout(() => {
  generateTOC();
}, 1500);

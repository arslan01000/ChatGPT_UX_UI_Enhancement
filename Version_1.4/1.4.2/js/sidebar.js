console.log("✅ Sidebar script running...");

const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="margin-right:8px;vertical-align:middle;">
  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
</svg>`;
const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="margin-right:8px;vertical-align:middle;">
  <path d="M6 0a.5.5 0 0 1 .5.5V1h3V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v3H3V3a2 2 0 0 1 2-2h1V.5A.5.5 0 0 1 6 0z"/>
  <path d="M3 7h10v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zm2 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
</svg>`;


const sidebar = document.createElement("div");
sidebar.id = "gpt-navigator-sidebar";
sidebar.className = "gpt-navigator-sidebar";

sidebar.innerHTML = `
  <div class="gpt-sidebar-header">
    GPT Navigator
    <button id="gpt-nav-close" class="gpt-nav-close">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </button>
  </div>
  <div id="gpt-topic-list" class="gpt-sidebar-content">Loading topics...</div>
`;
document.body.appendChild(sidebar);

const reopenBtn = document.createElement("button");
reopenBtn.id = "gpt-nav-reopen";
reopenBtn.title = "Open GPT Navigator";
reopenBtn.className = "gpt-nav-reopen";
reopenBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
`;
document.body.appendChild(reopenBtn);

const MAIN_CONTENT_SELECTOR = "main.relative.h-full.w-full.flex.flex-col";
const sidebarWidth = 336;

function shiftMainContent(shiftAmount) {
  const mainContent = document.querySelector(MAIN_CONTENT_SELECTOR);
  if (mainContent) {
    mainContent.style.marginRight = `${shiftAmount}px`;
    mainContent.style.width = `calc(100% - ${shiftAmount}px)`;
    mainContent.style.transition = `margin-right 0.3s ease-in-out, width 0.3s ease-in-out`;
  }
}

function hideSidebar() {
  sidebar.style.transform = "translateX(100%)";
  reopenBtn.style.display = "block";
  shiftMainContent(0);
}

function showSidebar() {
  sidebar.style.transform = "translateX(0)";
  reopenBtn.style.display = "none";
  shiftMainContent(sidebarWidth);
}

// Auto-hide logic on mouse
document.addEventListener("mousemove", (e) => {
  if (e.clientX > window.innerWidth - 20) {
    showSidebar();
  } else if (e.clientX < window.innerWidth - sidebarWidth - 100) {
    hideSidebar();
  }
});

document.getElementById("gpt-nav-close").onclick = hideSidebar;
reopenBtn.onclick = showSidebar;

function generateTOC() {
  const messages = document.querySelectorAll(
    "div.markdown.prose, div.markdown.prose.dark\\:prose-invert, div.whitespace-pre-wrap"
  );
  const topicList = document.getElementById("gpt-topic-list");
  if (!topicList) return;
  topicList.innerHTML = "";

  const seen = new Set();

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
    const isUser = msg.classList.contains("whitespace-pre-wrap");
    const icon = isUser ? userIcon : botIcon;
    anchor.innerHTML = icon + short;
    anchor.className = "gpt-toc-anchor";
    anchor.onclick = () => {
      const target = document.getElementById(anchorId);
      if (target)
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    topicList.appendChild(anchor);
  });

  console.log("🧠 GPT Navigator: Found", seen.size, "unique messages");
}

setTimeout(generateTOC, 1500);

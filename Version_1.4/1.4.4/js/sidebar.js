console.log("✅ Sidebar script running...");

const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round gpt-toc-icon"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

const botIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot gpt-toc-icon"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

const sidebar = document.createElement("div");
sidebar.id = "gpt-navigator-sidebar";
sidebar.className = "gpt-navigator-sidebar";

sidebar.innerHTML = `
  <div class="gpt-sidebar-header">
  ChatFlow Navigator
  <div style="display: flex; gap: 8px;">
    <button id="gpt-nav-refresh" class="gpt-icon-button" title="Refresh">
      <!-- Refresh icon here -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" 
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
        class="lucide lucide-refresh-cw gpt-toc-icon">
        <path d="M21 2v6h-6"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      </svg>
    </button>
    <button id="gpt-nav-close" class="gpt-icon-button" title="Close">
      <!-- X icon already here -->
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

const reopenBtn = document.createElement("button");
reopenBtn.id = "gpt-nav-reopen";
reopenBtn.title = "Open GPT Navigator";
reopenBtn.className = "gpt-nav-reopen";
reopenBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-align-right-icon lucide-align-right">
    <path d="M21 12H9"/><path d="M21 18H7"/><path d="M21 6H3"/>
  </svg>
`;


document.body.appendChild(reopenBtn);

// Показываем спиннер при первом появлении
const topicList = document.getElementById("gpt-topic-list");
if (topicList) {
  topicList.innerHTML = `<div class="gpt-loading-spinner">Loading topics...</div>`;
}
setTimeout(generateTOC, 1500);

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

document.addEventListener("mousemove", (e) => {
  if (e.clientX > window.innerWidth - 20) {
    showSidebar();
  } else if (e.clientX < window.innerWidth - sidebarWidth - 100) {
    hideSidebar();
  }
});

document.getElementById("gpt-nav-close").onclick = hideSidebar;
reopenBtn.onclick = showSidebar;

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

  // Показываем правильный лоадер в зависимости от ситуации
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
      const target = document.getElementById(anchorId);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    anchors.push(anchor);
  });

  // После небольшой задержки заменяем спиннер на реальные данные
  setTimeout(() => {
    topicList.innerHTML = "";
    anchors.forEach((a) => topicList.appendChild(a));
    console.log(
      "🧠 ChatFlow Navigator: Found",
      anchors.length,
      "unique messages"
    );
    isManualRefresh = false; // сбрасываем флаг
  }, 400);
}

// Инициализирующий вызов при загрузке (авто-refresh через 1.5 сек)
setTimeout(() => {
  generateTOC();
}, 1500);

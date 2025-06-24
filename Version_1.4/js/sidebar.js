console.log("✅ Sidebar script running...");

// Create the sidebar container
const sidebar = document.createElement("div");
sidebar.id = "gpt-navigator-sidebar";
sidebar.style.position = "fixed";
sidebar.style.top = "0";
sidebar.style.right = "0";
sidebar.style.width = "250px";
sidebar.style.height = "100%";
sidebar.style.backgroundColor = "#111";
sidebar.style.color = "#fff";
sidebar.style.zIndex = "9999";
sidebar.style.padding = "10px";
sidebar.style.overflowY = "auto";
sidebar.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
sidebar.innerHTML = `
  <div style="font-weight:bold; font-size:16px; margin-bottom:10px; color:#0f9d58;">
    GPT Navigator
  </div>
  <div id="gpt-topic-list" style="font-size:13px;">Loading topics...</div>
`;

document.body.appendChild(sidebar);

// Generate TOC
function generateTOC() {
  // Broad and reliable selector for all user & GPT messages
  const messages = document.querySelectorAll(
    "div.markdown, div.prose, div.whitespace-pre-wrap"
    // "div.markdown, div.prose, div.break-words"
  );

  const topicList = document.getElementById("gpt-topic-list");
  topicList.innerHTML = "";

  console.log(`🧠 GPT Navigator: Found ${messages.length} message(s)`);

  if (messages.length === 0) {
    topicList.innerHTML = "<div style='padding: 8px;'>No messages found.</div>";
    return;
  }

  messages.forEach((msg, index) => {
    const text = msg.textContent.trim();
    if (text.length > 30) {
      const short = text.slice(0, 60) + "...";
      const anchor = document.createElement("div");
      anchor.textContent = `• ${short}`;
      anchor.style.cursor = "pointer";
      anchor.style.margin = "6px 0";
      anchor.style.fontSize = "13px";
      anchor.style.color = "#ccc";
      anchor.style.lineHeight = "1.4";

      anchor.onclick = () => {
        msg.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      topicList.appendChild(anchor);
    }
  });
}

// Wait for DOM to stabilize, then generate TOC
setTimeout(generateTOC, 1500);

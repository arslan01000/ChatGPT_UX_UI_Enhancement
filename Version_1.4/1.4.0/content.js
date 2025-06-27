console.log("✅ GPT Hello Extension Injected");

const banner = document.createElement("div");
banner.textContent = "✅ Injected by Extension!";
banner.style.cssText = `
  position: fixed;
  top: 40px;
  left: 65px;
  background: lime;
  color: black;
  padding: 10px;
  z-index: 99999;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 4px;
`;
document.body.appendChild(banner);

// Inject sidebar.js as a script
const script = document.createElement("script");
script.src = chrome.runtime.getURL("js/sidebar.js");
(document.head || document.documentElement).appendChild(script);

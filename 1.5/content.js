const script = document.createElement("script");

script.src = chrome.runtime.getURL("js/sidebar.js");
(document.head || document.documentElement).appendChild(script);

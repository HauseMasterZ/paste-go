chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'run') {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    // Inject script into active tab to read clipboard
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: async () => {
        let text = await navigator.clipboard.readText();
        chrome.runtime.sendMessage({text: text});
      }
    }).catch(() => console.log("Cannot run on this specific page."));
  }
});

// Receive text and open new tab
chrome.runtime.onMessage.addListener((request) => {
  if (request.text) {
    let url = request.text.startsWith('http') ? request.text : `https://google.com/search?q=${encodeURIComponent(request.text)}`;
    chrome.tabs.create({ url });
  }
});
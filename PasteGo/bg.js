chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'run') return;
  let [{ id }] = await chrome.tabs.query({ active: true, currentWindow: true });

  try {
    // Execute script and instantly grab the returned result
    let [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: id },
      func: () => navigator.clipboard.readText()
    });

    if (result) {
      let url = result.startsWith('http') ? result : `https://google.com/search?q=${encodeURIComponent(result)}`;
      chrome.tabs.create({ url });
    }
  } catch (err) {
    // Fails silently if used on a restricted page like chrome://
  }
});
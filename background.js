// Vectorizer.io SVG Downloader - Background Service Worker

// Handle download requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: false // Auto-save to Downloads folder
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('[Vectorizer Downloader] Download error:', chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log('[Vectorizer Downloader] Download started:', downloadId);
        sendResponse({ success: true, downloadId: downloadId });
      }
    });
    
    // Return true to indicate async response
    return true;
  }
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'download-svg') {
    // Send message to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('vectorizer.io')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'download-svg-shortcut' });
      }
    });
  }
});

console.log('[Vectorizer Downloader] Background service worker initialized! 🎯');

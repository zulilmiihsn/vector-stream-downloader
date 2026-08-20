document.addEventListener('DOMContentLoaded', () => {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');

  // Check if we're on vectorizer.io
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    if (currentTab && currentTab.url && currentTab.url.includes('vectorizer.io')) {
      statusDot.classList.add('active');
      statusText.textContent = 'Active on site';
      statusText.style.color = '#059669';
    } else {
      statusDot.classList.remove('active');
      statusText.textContent = 'Not active here';
    }
  });
});

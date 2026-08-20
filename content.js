// Vectorizer.io SVG Downloader - Content Script (Smart Draggable)
// This script runs on vectorizer.io pages and extracts SVG data

(function() {
  'use strict';

  let downloadButton = null;
  let observer = null;
  
  function isResultPage() {
    return window.location.pathname.includes('/images/');
  }

  function getSVGElement() {
    return document.getElementById('outputsvg');
  }

  function extractSVG() {
    const svg = getSVGElement();
    if (!svg) {
      console.error('[Vectorizer Downloader] SVG element not found');
      return null;
    }
    
    // Check if SVG is just a placeholder (no paths yet)
    if (svg.querySelectorAll('path').length === 0) return null;

    const svgData = svg.outerHTML;
    const titleElement = document.querySelector('title');
    const pageTitle = titleElement ? titleElement.textContent : 'vectorized';
    
    const filename = pageTitle
      .replace(/Online Image Vectorizer\s*:\s*/i, '')
      .replace(/[^a-z0-9-_]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    return { data: svgData, filename: filename || 'vectorized-image' };
  }

  function downloadSVG() {
    const svgData = extractSVG();
    
    if (!svgData) {
      showNotification('SVG Not Ready', 'Please wait...', 'error');
      return;
    }

    const blob = new Blob([svgData.data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const filename = `${svgData.filename}.svg`;

    showNotification('Preparing Download...', `Getting ${filename}`, 'info');

    chrome.runtime.sendMessage({
      action: 'download',
      url: url,
      filename: filename
    }, (response) => {
      if (response && response.success) {
        showNotification('Download Started', 'Saved to Downloads', 'success');
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        showNotification('Download Failed', 'Check permissions', 'error');
      }
    });
  }

  function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `vectorizer-notification vectorizer-notification-${type}`;
    
    const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const alertIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    notification.innerHTML = `
      <div class="vectorizer-notification-icon">
        ${type === 'success' ? checkIcon : alertIcon}
      </div>
      <div class="vectorizer-notification-content">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
    `;

    document.body.appendChild(notification);
    void notification.offsetWidth; // Force Reflow
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 2500);
  }

  function createDownloadButton() {
    if (downloadButton) return; 

    downloadButton = document.createElement('div');
    downloadButton.id = 'vectorizer-svg-downloader-btn';
    downloadButton.className = 'vectorizer-download-btn';
    
    // Prevent default drag behaviors on image/text
    downloadButton.ondragstart = function() { return false; };

    downloadButton.innerHTML = `
      <div class="vectorizer-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
      <span>Download SVG</span>
    `;

    document.body.appendChild(downloadButton);

    // --- SMART DRAGGABLE LOGIC ---
    let isDragging = false;
    let hasMoved = false; // Key flag to separate click vs drag
    let startX, startY;
    let initialX, initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Load saved position
    const savedPos = localStorage.getItem('vectorizer_btn_pos');
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        xOffset = pos.x;
        yOffset = pos.y;
        setTranslate(xOffset, yOffset, downloadButton);
      } catch(e) {}
    }

    function dragStart(e) {
      const touch = e.type === "touchstart" ? e.touches[0] : e;
      initialX = touch.clientX - xOffset;
      initialY = touch.clientY - yOffset;
      startX = touch.clientX;
      startY = touch.clientY;

      if (downloadButton.contains(e.target)) {
        isDragging = true;
        hasMoved = false; // Reset flag
        downloadButton.classList.add('is-dragging');
      }
    }

    function dragEnd(e) {
      if (!isDragging) return;
      
      isDragging = false;
      downloadButton.classList.remove('is-dragging');
      
      if (hasMoved) {
        localStorage.setItem('vectorizer_btn_pos', JSON.stringify({ x: xOffset, y: yOffset }));
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        
        const touch = e.type === "touchmove" ? e.touches[0] : e;
        const currentX = touch.clientX - initialX;
        const currentY = touch.clientY - initialY;
        
        // Calculate Distance Moved
        const moveX = Math.abs(touch.clientX - startX);
        const moveY = Math.abs(touch.clientY - startY);
        
        // Threshold check (5px)
        if (!hasMoved && (moveX > 5 || moveY > 5)) {
            hasMoved = true;
        }

        if (hasMoved) {
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, downloadButton);
        }
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Attach Events
    downloadButton.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);
    
    downloadButton.addEventListener("touchstart", dragStart, {passive: false});
    downloadButton.addEventListener("touchend", dragEnd);
    downloadButton.addEventListener("touchmove", drag, {passive: false});

    // --- CLICK HANDLER WITH GUARD ---
    downloadButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop bubbling
      e.preventDefault(); 
      
      // ONLY download if user NOT moved the button
      if (!hasMoved) {
         downloadSVG();
      }
    });
  }

  function removeDownloadButton() {
    if (downloadButton) {
      downloadButton.remove();
      downloadButton = null;
    }
  }

  function checkSVGStatus() {
    const svg = getSVGElement();
    if (svg && svg.querySelectorAll('path').length > 0) {
      createDownloadButton();
    } else {
      removeDownloadButton();
    }
  }

  function initObserver() {
    if (!isResultPage()) return;
    checkSVGStatus();
    observer = new MutationObserver((mutations) => checkSVGStatus());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['id', 'class'] });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'download-svg-shortcut') {
      downloadSVG();
      sendResponse({ success: true });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }

  // SPA Navigation Check
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (observer) observer.disconnect();
      setTimeout(initObserver, 1000);
    }
  }, 1000);

  console.log('[Vectorizer Downloader] Smart Draggable Logic Loaded v2 🚀');
})();

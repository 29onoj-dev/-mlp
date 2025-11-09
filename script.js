// script.js — modal + iframe injection with fallback handling

(function(){
const playBtn = document.getElementById('play-button');
const playSmall = document.getElementById('play-embed-small');
const modal = document.getElementById('game-modal');
const iframeWrapper = document.getElementById('iframe-wrapper');
const closeBtn = document.getElementById('close-modal');
const modalFallback = document.getElementById('modal-fallback');
const fallbackLink = document.getElementById('fallback-link');

// The official web build URL (change if you prefer another mirror)
const GAME_URL = 'https://mindustrygame.github.io/';

// Helper to open modal and inject iframe
function openModal() {
// clear previous content
iframeWrapper.innerHTML = '';
modalFallback.hidden = true;

// Create the iframe
const iframe = document.createElement('iframe');
iframe.src = GAME_URL;
iframe.title = 'Mindustry web build';
// sandbox attribute omitted because the web build may require scripts; we rely on browser security
iframe.allow = 'autoplay; fullscreen; accelerometer; clipboard-read; clipboard-write; gamepad;';
iframe.loading = 'lazy';
iframeWrapper.appendChild(iframe);

// show modal
modal.setAttribute('aria-hidden', 'false');

// After a short timeout, check whether iframe loaded content (very simplified check)
// If the iframe ends up blocked by X-Frame-Options, its contentWindow may be inaccessible.
setTimeout(() => {
try {
// Accessing contentDocument may throw if cross-origin blocked or iframe blocked completely.
const doc = iframe.contentDocument || iframe.contentWindow.document;
// If doc exists and has body content, assume okay
if (!doc || !doc.body || doc.body.childElementCount === 0) {
showFallback();
}
} catch (err) {
// Likely blocked by X-Frame-Options or cross-origin; show fallback UI
showFallback();
}
}, 1400); // short delay to allow the remote to respond
}

function showFallback() {
iframeWrapper.innerHTML = '';
modalFallback.hidden = false;
// ensure fallback link uses same URL
fallbackLink.href = GAME_URL;
}

function closeModal() {
// remove iframe to stop any audio/CPU
iframeWrapper.innerHTML = '';
modal.setAttribute('aria-hidden', 'true');
}

// event listeners
playBtn && playBtn.addEventListener('click', openModal);
playSmall && playSmall.addEventListener('click', openModal);
closeBtn && closeBtn.addEventListener('click', closeModal);

// close on Escape
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeModal();
});

// Close when clicking outside the modal content
modal.addEventListener('click', (e) => {
if (e.target === modal) closeModal();
});

})();

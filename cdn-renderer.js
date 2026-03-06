/**
 * INSECURE - For XSS demo (VF Case C) only.
 * Uses innerHTML with caller-provided HTML. Do not use with untrusted data.
 * Host this on GitHub Pages (or any URL) and set that URL in Custom Label CdnScriptUrl.
 */
window.CdnRenderer = {
    render: function (el, html) {
        if (el && typeof html === 'string') {
            el.innerHTML = html;
        }
    }
};

/* جلب فيديوهات القناة تلقائياً من يوتيوب:
   - القصيرة (Shorts) تظهر بصفحة تصاميم CSS
   - الطويلة تظهر بالرئيسية وصفحة الفيديوهات
   - شريط "نزل فيديو جديد" بالرئيسية (يتعمل بـ script.js) */
(function () {
  var C = window.SITE || {};
  var SHORT_MAX = 180;        /* أي فيديو مدته 3 دقائق أو أقل بيُعتبر Short */
  var TTL = 10 * 60 * 1000;   /* بيحفظ النتيجة 10 دقائق عشان ما يخلص رصيد يوتيوب */

  /* تنسيقات إضافية: شريط الفيديو الجديد + شكل رسالة "موافق" */
  var st = document.createElement('style');
  st.textContent =
    '.newbar{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:10px 5%;background:linear-gradient(90deg,#ff6a2b,#ec4899);color:#fff;font-weight:600;text-align:center}' +
    '.newbar b{font-weight:800}' +
    '.newbar .btn{background:#fff;color:#1b0d04;border-radius:999px;padding:6px 18px}' +
    '.nb-x{background:none;border:0;color:#fff;font-size:1.1rem;cursor:pointer}' +
    '.cbox{text-align:center;border:2px solid var(--accent);box-shadow:0 0 40px rgba(255,106,43,.3)}' +
    '.cbox h3{font-size:1.6rem;padding-inline-end:0}' +
    '.cbox .actions{justify-content:center}';
  document.head.appendChild(st);

  function secs(d) {
    var m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(d || '');
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }
  async function get(u) {
    var r = await fetch(u);
    if (!r.ok) throw 0;
    return r.json();
  }

  var pr = null;
  function load() {
    if (pr) return pr;
    pr = (async function () {
      if (!C.ytApiKey || !C.channelId || /ضع_/.test(C.ytApiKey)) return null;
      try {
        var c = JSON.parse(localStorage.getItem('abd-yt') || 'null');
        if (c && Date.now() - c.t < TTL) return c.items;
      } catch (e) {}
      try {
        var base = 'https://www.googleapis.com/youtube/v3/';
        var a = await get(base + 'playlistItems?part=contentDetails&maxResults=50&playlistId=UU' + C.channelId.slice(2) + '&key=' + C.ytApiKey);
        var ids = (a.items || []).map(function (i) { return i.contentDetails.videoId; });
        if (!ids.length) return [];
        var b = await get(base + 'videos?part=snippet,contentDetails&id=' + ids.join(',') + '&key=' + C.ytApiKey);
        var items = (b.items || []).map(function (v) {
          var s = secs(v.contentDetails.duration);
          var line = (v.snippet.description || '').split('\n').filter(function (l) { return l.trim() && !/https?:/.test(l); })[0] || '';
          return { id: v.id, title: v.snippet.title, desc: line.slice(0, 110), published: Date.parse(v.snippet.publishedAt), secs: s, short: s <= SHORT_MAX, up: v.snippet.liveBroadcastContent === 'upcoming' };
        }).filter(function (v) { return !v.up && v.secs > 0; })
          .sort(function (x, y) { return y.published - x.published; });
        try { localStorage.setItem('abd-yt', JSON.stringify({ t: Date.now(), items: items })); } catch (e) {}
        return items;
      } catch (e) { return null; }
    })();
    return pr;
  }
  window.YTAUTO = { load: load, SHORT_MAX: SHORT_MAX };

  /* صفحة تصاميم CSS: أي Short جديد بينضاف فوق لحاله */
  function shortsPage() {
    var grid = document.getElementById('grid');
    if (!grid || typeof designs === 'undefined') return;
    load().then(function (all) {
      if (!all) return;
      var known = {};
      designs.forEach(function (d) { known[d.id] = 1; });
      all.filter(function (v) { return v.short && !known[v.id]; }).reverse().forEach(function (v) {
        var card = document.createElement('div');
        card.className = 'card';
        card.id = 'v-' + v.id;
        var h = document.createElement('h2');
        h.textContent = (Date.now() - v.published < 7 * 864e5 ? '🆕 ' : '') + v.title;
        card.appendChild(h);
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube.com/embed/' + v.id;
        f.loading = 'lazy';
        f.allowFullscreen = true;
        card.appendChild(f);
        grid.insertBefore(card, grid.firstChild);
      });
      if (location.hash.length > 1) {
        var t = document.getElementById(location.hash.slice(1));
        if (t) t.scrollIntoView();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shortsPage);
  else shortsPage();
})();

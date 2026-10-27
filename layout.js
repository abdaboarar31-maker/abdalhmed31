/* layout.js — النافبار والفوتر المشتركين لكل صفحات Abd Code
   التعديل هون مرة وحدة بيتغير بكل الصفحات.

   الاستخدام بكل صفحة:
     1) مكان النافبار:   <div id="site-header"></div>   (أول شي داخل <body>)
     2) مكان الفوتر:     <div id="site-footer"></div>
     3) <script src="layout.js?v=1"></script>  قبل سكربتات الصفحة

   اختياري — نافبار خاص بصفحة (حط السطر قبل layout.js):
     <script>window.LAYOUT = { links: ['home','academy','studio'] };</script>
   لصفحة إلها CSS خاص وبدون أزرار ثيم/لغة (مثل الستوديو):
     <script>window.LAYOUT = { variant: 'plain', links: ['home','academy','studio','codes'] };</script>
   وللأكاديمية (تصميمها الخاص):
     <script>window.LAYOUT = { variant: 'academy', links: ['home','academy','studio'] };</script>
*/
(function () {
  'use strict';

  var cfg = window.LAYOUT || {};
  var variant = cfg.variant || 'site';

  /* ===== روابط النافبار — عدّل هون بس ===== */
  /* i18n = مفتاح ترجمة صفحة الموقع الرئيسية، ai = مفتاح ترجمة الأكاديمية */
  var LINKS = [
    { key: 'home',    hash: '#home',      label: 'الرئيسية',     i18n: 'nav_home',   ai: 'n_home' },
    { key: 'academy', file: 'academy',    label: 'الأكاديمية',   badge: 'جديد',       ai: 'n_acad' },
    { key: 'studio',  file: 'studio',     label: 'ستوديو الكود',                      ai: 'n_studio' },
    { key: 'videos',  hash: '#videos',    label: 'الفيديوهات',   i18n: 'nav_videos' },
    { key: 'codes',   file: 'codes',      label: 'أكواد جاهزة',                       ai: 'n_codes' },
    { key: 'css',     file: 'css-designs', label: 'تصاميم CSS',  badge: 'جديد' },
    { key: 'store',   file: 'store',      label: 'المتجر',       i18n: 'nav_store',  ai: 'n_store' }
  ];

  /* ===== أي صفحة نحن فيها؟ ===== */
  var seg = location.pathname.split('/').pop().replace(/\.html$/i, '');
  var isIndex = (seg === '' || seg === 'index');
  var base = isIndex ? '' : 'index.html'; // روابط الرئيسية الداخلية (#videos) من الصفحات الثانية

  function hrefOf(l) {
    if (l.file) return l.file + '.html';
    if (l.key === 'home' && !isIndex) return 'index.html';
    return base + l.hash;
  }
  function isActive(l) {
    if (l.file) return seg === l.file;
    return isIndex && l.key === 'home';
  }

  var shown = LINKS.filter(function (l) {
    if (cfg.links && cfg.links.indexOf(l.key) === -1) return false;
    if (variant === 'academy' && !l.ai) return false; // الأكاديمية بتترجم بس الروابط اللي إلها مفتاح
    return true;
  });

  /* ===== النافبار ===== */
  var nav = shown.map(function (l) {
    var a = '';
    if (variant === 'academy') {
      a += ' data-i="' + l.ai + '"';
      if (isActive(l)) a += ' class="on"';
      return '<a href="' + hrefOf(l) + '"' + a + '>' + l.label + '</a>';
    }
    if (variant === 'plain') {
      return '<a href="' + hrefOf(l) + '"' + (isActive(l) ? ' class="on"' : '') + '>' + l.label + '</a>';
    }
    if (l.i18n) a += ' data-i18n="' + l.i18n + '"';
    if (isActive(l)) a += ' class="active" aria-current="page"';
    var badge = l.badge ? ' <span class="new-b">' + l.badge + '</span>' : '';
    return '<a href="' + hrefOf(l) + '"' + a + '>' + l.label + badge + '</a>';
  }).join('\n    ');

  var headerHTML;
  if (variant === 'academy') {
    headerHTML =
      '<header class="top">\n' +
      '  <a class="brand" href="index.html"><img src="logo.svg" alt="" width="24" height="24"><span>Abd Code</span></a>\n' +
      '  <nav class="nav" id="nav">' + nav + '</nav>\n' +
      '  <div class="lw"><button id="lang" class="ib lg" type="button" aria-haspopup="true" aria-expanded="false">🌐 <span id="lgn">العربية</span></button>\n' +
      '    <div id="lmenu" class="lmenu" hidden><button type="button" data-l="ar">العربية</button><button type="button" data-l="en">English</button></div></div>\n' +
      '  <button id="theme" class="ib" type="button" aria-label="Theme">🌙</button>\n' +
      '  <button id="burger" class="ib burger" type="button" aria-label="Menu">☰</button>\n' +
      '</header>';
  } else if (variant === 'plain') {
    /* صفحات إلها CSS خاص (ستوديو...): نفس كلاسات .top .brand .nav بدون أزرار تحتاج سكربت */
    headerHTML =
      '<header class="top">\n' +
      '  <a class="brand" href="index.html"><img src="logo.svg" alt="" width="32" height="32"><span>Abd Code</span></a>\n' +
      '  <nav class="nav">' + nav + '</nav>\n' +
      '</header>';
  } else {
    headerHTML =
      '<header class="top">\n' +
      '  <a class="brand" href="' + (isIndex ? '#home' : 'index.html') + '"><img src="logo.svg" alt="" width="40" height="40"><span>Abd Code</span></a>\n' +
      '  <nav id="nav" class="nav">\n    ' + nav + '\n  </nav>\n' +
      '  <div class="lg"><button id="langBtn" class="icon-btn" type="button" aria-label="Language">🌐</button><div id="langMenu" class="lg-menu" hidden></div></div>\n' +
      '  <button id="theme" class="icon-btn" aria-label="تبديل الوضع">🌙</button>\n' +
      '  <button id="burger" class="icon-btn burger" aria-label="القائمة">☰</button>\n' +
      '</header>';
  }

  /* ===== الفوتر (نفس المحتوى والحقوق بكل الصفحات، عربي/إنجليزي) ===== */
  var TXT = {
    ar: { tag: 'تعلّم HTML بالعربي', credit: 'تصميم وتطوير: <b>عبد أبو عرار</b>', about: 'من أنا', privacy: 'سياسة الخصوصية', codes: 'أكواد جاهزة', contact: 'تواصل معي', rights: 'جميع الحقوق محفوظة' },
    en: { tag: 'Learn HTML in Arabic', credit: 'Design & development: <b>Abd Abu Arar</b>', about: 'About', privacy: 'Privacy policy', codes: 'Ready codes', contact: 'Contact', rights: 'All rights reserved' }
  };
  function footInner(lang, i18n) {
    var t = TXT[lang] || TXT.ar, y = new Date().getFullYear();
    return '\n  <div class="foot-brand"><img src="logo.svg" alt="" width="34" height="34"><b>Abd Code</b></div>\n' +
      '  <p' + (i18n ? ' data-i18n="foot_tag"' : '') + '>' + t.tag + '</p>\n' +
      '  <p class="credit"' + (i18n ? ' data-i18n-html="credit"' : '') + '>' + t.credit + '</p>\n' +
      '  <p class="credit"><a href="about.html">' + t.about + '</a> · <a href="privacy.html">' + t.privacy + '</a> · <a href="codes.html">' + t.codes + '</a> · <a href="' + base + '#contact">' + t.contact + '</a></p>\n' +
      '  <p class="rights"' + (i18n ? ' data-i18n-html="rights"' : '') + '>© ' + y + ' Abd Code — ' + t.rights + '</p>\n';
  }

  var startLang = 'ar';
  if (variant === 'academy') {
    try { if (localStorage.getItem('abd-lang') === 'en') startLang = 'en'; } catch (e) {}
  }
  function footLine(lang) {
    var t = TXT[lang] || TXT.ar;
    return '© ' + new Date().getFullYear() + ' Abd Code — ' + t.rights + ' · <a href="about.html">' + t.about + '</a> · <a href="privacy.html">' + t.privacy + '</a> · <a href="' + base + '#contact">' + t.contact + '</a>';
  }
  var footerHTML = variant === 'plain'
    ? '<footer id="layout-foot" class="compact">' + footLine('ar') + '</footer>'
    : '<footer id="layout-foot">' + footInner(startLang, variant !== 'academy') + '</footer>';

  /* ===== ستايل ===== */
  var css;
  if (variant === 'plain') {
    css = '#layout-foot.compact{flex:none;text-align:center;font-size:.8rem;padding:6px 12px 10px;color:inherit;opacity:.75}' +
          '#layout-foot.compact a{color:inherit;text-decoration:underline}';
  } else if (variant === 'academy') {
    css = 'footer .foot-brand{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:6px;color:var(--tx)}' +
          'footer p{margin:2px 0}footer .rights{font-size:.85rem;margin-top:8px}';
  } else {
    css =
      '.lg{position:relative}' +
      '.lg-menu{position:absolute;top:calc(100% + 8px);inset-inline-end:0;min-width:130px;background:#1e293b;border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:6px;z-index:60;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
      '.lg-menu[hidden]{display:none}' +
      '.lg-menu button{display:block;width:100%;text-align:start;background:none;border:0;color:#fff;padding:10px 12px;border-radius:8px;font:inherit;cursor:pointer}' +
      '.lg-menu button:hover,.lg-menu button.on{background:rgba(255,255,255,.14)}' +
      '.new-b{display:inline-block;margin-inline-start:4px;padding:2px 8px;border-radius:50px;background:linear-gradient(90deg,#ff6a2b,#ec4899);color:#fff;font-size:11px;font-weight:800;vertical-align:middle;animation:newpulse 1.6s ease-in-out infinite}' +
      '@keyframes newpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +
      '.nav a.active{font-weight:800}';
  }
  var st = document.createElement('style');
  st.setAttribute('data-layout', '');
  st.textContent = css;
  document.head.appendChild(st);

  /* ===== حطّهم مكان الـ placeholders ===== */
  function put(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }
  put('site-header', headerHTML);
  put('site-footer', footerHTML);

  /* الأكاديمية: لما تتغير اللغة (lang على <html>) بنبدّل لغة الفوتر */
  if (variant === 'academy' && window.MutationObserver) {
    new MutationObserver(function () {
      var f = document.getElementById('layout-foot');
      if (f) f.innerHTML = footInner(document.documentElement.lang === 'en' ? 'en' : 'ar', false);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
})();

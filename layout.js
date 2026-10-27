/* layout.js — النافبار والفوتر المشتركين لكل صفحات Abd Code
   التعديل هون مرة وحدة بيتغير بكل الصفحات.

   الاستخدام بكل صفحة:
     1) مكان النافبار:   <div id="site-header"></div>   (أول شي داخل <body>)
     2) مكان الفوتر:     <div id="site-footer"></div>
     3) بآخر الصفحة، قبل باقي السكربتات:  <script src="layout.js?v=1"></script>

   اختياري — نافبار خاص بصفحة معينة (حط هاد السطر قبل layout.js):
     <script>window.LAYOUT = { links: ['home','academy','studio'] };</script>
*/
(function () {
  'use strict';

  /* ===== روابط النافبار — عدّل هون بس ===== */
  var LINKS = [
    { key: 'home',    hash: '#home',   label: 'الرئيسية',     i18n: 'nav_home' },
    { key: 'academy', file: 'academy',  label: 'الأكاديمية',   badge: 'جديد' },
    { key: 'studio',  file: 'studio',   label: 'ستوديو الكود' },
    { key: 'videos',  hash: '#videos', label: 'الفيديوهات',   i18n: 'nav_videos' },
    { key: 'codes',   file: 'codes',    label: 'أكواد جاهزة' },
    { key: 'css',     file: 'css-designs', label: 'تصاميم CSS', badge: 'جديد' },
    { key: 'store',   file: 'store',    label: 'المتجر',       i18n: 'nav_store' }
  ];

  /* ===== أي صفحة نحن فيها؟ ===== */
  var seg = location.pathname.split('/').pop().replace(/\.html$/i, '');
  var isIndex = (seg === '' || seg === 'index');
  var base = isIndex ? '' : 'index.html'; // الروابط الداخلية (#videos) على الصفحات الثانية بتروح للرئيسية

  function hrefOf(l) {
    if (l.file) return l.file + '.html';
    return base + l.hash;
  }
  function isActive(l) {
    if (l.file) return seg === l.file;
    return isIndex && l.key === 'home'; // بالرئيسية بس "الرئيسية" مفعّلة
  }

  /* ===== اختيار الروابط (لو الصفحة حددت نافبار خاص) ===== */
  var cfg = window.LAYOUT || {};
  var shown = LINKS.filter(function (l) {
    return !cfg.links || cfg.links.indexOf(l.key) !== -1;
  });

  var nav = shown.map(function (l) {
    var attrs = '';
    if (l.i18n) attrs += ' data-i18n="' + l.i18n + '"';
    if (isActive(l)) attrs += ' class="active" aria-current="page"';
    var badge = l.badge ? ' <span class="new-b">' + l.badge + '</span>' : '';
    return '<a href="' + hrefOf(l) + '"' + attrs + '>' + l.label + badge + '</a>';
  }).join('\n    ');

  /* ===== النافبار ===== */
  var headerHTML =
    '<header class="top">\n' +
    '  <a class="brand" href="' + (isIndex ? '#home' : 'index.html') + '"><img src="logo.svg" alt="" width="40" height="40"><span>Abd Code</span></a>\n' +
    '  <nav id="nav" class="nav">\n    ' + nav + '\n  </nav>\n' +
    '  <div class="lg"><button id="langBtn" class="icon-btn" type="button" aria-label="Language">🌐</button><div id="langMenu" class="lg-menu" hidden></div></div>\n' +
    '  <button id="theme" class="icon-btn" aria-label="تبديل الوضع">🌙</button>\n' +
    '  <button id="burger" class="icon-btn burger" aria-label="القائمة">☰</button>\n' +
    '</header>';

  /* ===== الفوتر (ونفس الحقوق بكل الصفحات) ===== */
  var year = new Date().getFullYear();
  var footerHTML =
    '<footer>\n' +
    '  <div class="foot-brand"><img src="logo.svg" alt="" width="34" height="34"><b>Abd Code</b></div>\n' +
    '  <p data-i18n="foot_tag">تعلّم HTML بالعربي</p>\n' +
    '  <p class="credit" data-i18n-html="credit">تصميم وتطوير: <b>عبد أبو عرار</b></p>\n' +
    '  <p class="credit"><a href="about.html">من أنا</a> · <a href="privacy.html">سياسة الخصوصية</a> · <a href="codes.html">أكواد جاهزة</a> · <a href="' + base + '#contact">تواصل معي</a></p>\n' +
    '  <p class="rights" data-i18n-html="rights">© ' + year + ' Abd Code — جميع الحقوق محفوظة</p>\n' +
    '</footer>';

  /* ===== ستايل النافبار المشترك (كان داخل index.html) ===== */
  var css =
    '.lg{position:relative}' +
    '.lg-menu{position:absolute;top:calc(100% + 8px);inset-inline-end:0;min-width:130px;background:#1e293b;border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:6px;z-index:60;box-shadow:0 10px 30px rgba(0,0,0,.4)}' +
    '.lg-menu[hidden]{display:none}' +
    '.lg-menu button{display:block;width:100%;text-align:start;background:none;border:0;color:#fff;padding:10px 12px;border-radius:8px;font:inherit;cursor:pointer}' +
    '.lg-menu button:hover,.lg-menu button.on{background:rgba(255,255,255,.14)}' +
    '.new-b{display:inline-block;margin-inline-start:4px;padding:2px 8px;border-radius:50px;background:linear-gradient(90deg,#ff6a2b,#ec4899);color:#fff;font-size:11px;font-weight:800;vertical-align:middle;animation:newpulse 1.6s ease-in-out infinite}' +
    '@keyframes newpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +
    '.nav a.active{font-weight:800}';
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
})();

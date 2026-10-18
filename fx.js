/* ===== fx.js — حركات وتأثيرات التصميم الفخم (ما بيلمس أي وظيفة بالموقع) ===== */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var b = document.body;
  function mk(cls, html) { var d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); if (html) d.innerHTML = html; b.appendChild(d); return d; }

  /* خلفية */
  mk('fx-bg', '<i class="b1"></i><i class="b2"></i><i class="b3"></i>');
  mk('fx-grid'); mk('fx-grain');
  var prog = mk('fx-prog');
  var spot = fine && !reduce ? mk('fx-spot') : null;

  /* منصة نافذة الكود: قوس + شارات + ميلان */
  var win = document.querySelector('.hero .win');
  if (win) {
    var stage = document.createElement('div'); stage.className = 'fx-stage';
    win.parentNode.insertBefore(stage, win);
    var arc = document.createElement('div'); arc.className = 'fx-arc';
    stage.appendChild(arc); stage.appendChild(win);
    stage.insertAdjacentHTML('beforeend', '<span class="fx-chip h">&lt;HTML&gt;</span><span class="fx-chip c">{ CSS }</span><span class="fx-chip j">JS()</span>');
    if (fine && !reduce) {
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        win.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 7) + 'deg)';
      });
      stage.addEventListener('pointerleave', function () { win.style.transform = ''; });
    }
  }

  /* شريط التقنيات بعد الهيرو */
  var home = document.getElementById('home');
  if (home) {
    var w = ['HTML', 'CSS', 'JAVASCRIPT', 'GIT', 'GITHUB', 'RESPONSIVE', 'FLEXBOX', 'GRID', 'ANIMATION'];
    var row = w.concat(w).map(function (x) { return '<span>' + x + '</span>'; }).join('');
    var mq = document.createElement('div'); mq.className = 'fx-mq'; mq.setAttribute('aria-hidden', 'true');
    mq.innerHTML = '<div>' + row + '</div>';
    home.insertAdjacentElement('afterend', mq);
  }

  /* ظهور الأقسام عند التمرير */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-on'); io.unobserve(e.target); } });
    }, { threshold: .08 });
    document.querySelectorAll('main > section:not(.hero), main > .social-section-clean').forEach(function (s) {
      s.classList.add('fx-rv'); io.observe(s);
    });
  }

  /* تأثيرات المؤشر على الكروت (تشتغل حتى على الكروت المرسومة بالـ JS) */
  var last = null;
  function resetLast() { if (last) { last.style.transform = ''; last = null; } }
  if (fine) {
    document.addEventListener('pointermove', function (e) {
      if (spot) spot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      var c = e.target.closest && e.target.closest('.vcard,.panel,.step,.wc');
      if (!c) { resetLast(); return; }
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (!reduce && c.classList.contains('vcard') && !c.classList.contains('soon')) {
        if (last && last !== c) resetLast();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(800px) rotateY(' + (x * 9) + 'deg) rotateX(' + (-y * 9) + 'deg) translateY(-5px)';
        last = c;
      } else resetLast();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetLast);
  }

  /* شريط التقدم + ظل الهيدر */
  var top = document.querySelector('.top');
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
    if (top) top.classList.toggle('fx-s', h.scrollTop > 20);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ===== حركات إضافية ===== */

  /* رموز برمجة طايرة بالهيرو */
  if (home && !reduce) {
    var sy = ['</>', '{ }', '#', '( )', ';', '</', '/*', '=>', '%', 'JS', '[]', '!='];
    var sym = document.createElement('div'); sym.className = 'fx-sym'; sym.setAttribute('aria-hidden', 'true');
    var n = innerWidth < 700 ? 8 : 16, h = '';
    for (var k = 0; k < n; k++) {
      h += '<span style="left:' + (Math.random() * 94 + 2).toFixed(1) + '%;--s:' + (14 + Math.random() * 22).toFixed(0) + 'px;--d:' + (9 + Math.random() * 10).toFixed(1) + 's;--dl:-' + (Math.random() * 16).toFixed(1) + 's">' + sy[k % sy.length] + '</span>';
    }
    sym.innerHTML = h; home.insertBefore(sym, home.firstChild);
  }

  /* انفجار شرارات عند الضغط على الأزرار */
  if (!reduce && Element.prototype.animate) {
    var cols = ['#ffc23c', '#ff6a2b', '#ec4899', '#4d8dff'];
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest || !e.target.closest('.btn,.icon-btn,.chip,.social-icon,.opt,.mini')) return;
      for (var i = 0; i < 12; i++) {
        var p = document.createElement('i'); p.className = 'fx-p';
        p.style.background = cols[i % cols.length];
        document.body.appendChild(p);
        var a = Math.PI * 2 * i / 12 + Math.random() * .5, d = 40 + Math.random() * 50;
        var an = p.animate([
          { transform: 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 4) + 'px) scale(1)', opacity: 1 },
          { transform: 'translate(' + (e.clientX - 4 + Math.cos(a) * d) + 'px,' + (e.clientY - 4 + Math.sin(a) * d) + 'px) scale(0)', opacity: 0 }
        ], { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.2,.8,.2,1)' });
        an.onfinish = (function (el) { return function () { el.remove(); }; })(p);
      }
    });
  }

  /* أزرار مغناطيسية */
  if (fine && !reduce) {
    document.querySelectorAll('.yt-btn,.hero .btn,.more .btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .22) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* زر الرجوع للأعلى + بارالاكس عند التمرير */
  var up = document.createElement('button');
  up.className = 'fx-top'; up.type = 'button'; up.setAttribute('aria-label', 'Top');
  up.innerHTML = '<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/></svg><span>↑</span>';
  up.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  b.appendChild(up);
  var hs = document.getElementById('hs'), hsFill = document.getElementById('hsFill'), hsItems = hs ? [].slice.call(hs.querySelectorAll('.hs-i')) : [];
  var ring = up.querySelector('circle'), bgEl = document.querySelector('.fx-bg'), gridEl = document.querySelector('.fx-grid'), ticking = false;
  function par() {
    ticking = false;
    var h = document.documentElement, y = h.scrollTop, max = h.scrollHeight - h.clientHeight;
    up.classList.toggle('show', y > 500);
    ring.style.strokeDashoffset = 151 - (max > 0 ? y / max : 0) * 151;
    if (hs) {
      var r = hs.getBoundingClientRect(), pp = Math.min(1, Math.max(0, (innerHeight * .7 - r.top) / r.height));
      hsFill.style.height = (pp * (r.height - 24)) + 'px';
      hsItems.forEach(function (it, k) { it.classList.toggle('on', pp >= k / hsItems.length + .04); });
    }
    if (reduce) return;
    if (bgEl) bgEl.style.transform = 'translateY(' + (-y * .12) + 'px)';
    if (gridEl) gridEl.style.backgroundPosition = '0 ' + (-y * .25) + 'px';
    if (typeof arc !== 'undefined' && arc && y < 1000) arc.style.transform = 'translateX(-50%) translateY(' + (y * .12) + 'px)';
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
  par();

  /* ===== منع تحديد ونسخ النصوص (ما عدا الحقول وبيانات الدفع) ===== */
  function okEl(t) { if (t && t.nodeType === 3) t = t.parentNode; return !!(t && t.closest && t.closest('input,textarea,[contenteditable],.pay')); }
  document.addEventListener('selectstart', function (e) { if (!okEl(e.target)) e.preventDefault(); });
  ['copy', 'cut'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var a = document.activeElement;
      if (okEl(e.target) || (a && /^(INPUT|TEXTAREA)$/.test(a.tagName))) return;
      e.preventDefault();
    });
  });
  document.addEventListener('dragstart', function (e) { var t = e.target; if (t && (t.tagName === 'IMG' || t.tagName === 'A')) e.preventDefault(); });
})();

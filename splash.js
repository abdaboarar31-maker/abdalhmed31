/* Abd Code - شاشة افتتاحية | splash.js
   - الشعار (logo.svg) بيمشي ويكتب اسم الموقع حرف حرف
   - بتظهر مرة وحدة بالجلسة، وبتفتح الموقع لحالها بدون ضغطة
   - شبكة أمان: بتسكّر لحالها بعد 7 ثواني بالكثير */
(function(){
  var KEY = 'abdSplashSeen', NAME = 'Abd Code', LOGO = 'logo.svg';
  var de = document.documentElement;
  try{ if(sessionStorage.getItem(KEY)) return; }catch(e){}

  // الوضع الفاتح أو الداكن: بنقرأه من الموقع نفسه
  function isLight(){
    var t = de.getAttribute('data-theme');
    if(t) return t === 'light';
    try{
      for(var i = 0; i < localStorage.length; i++){
        var k = localStorage.key(i);
        if(/theme|mode/i.test(k)){
          var v = localStorage.getItem(k);
          if(v === 'light' || v === 'dark') return v === 'light';
        }
      }
    }catch(e){}
    return false;
  }
  function syncTheme(){ de.classList.toggle('asp-light', isLight()); }

  de.classList.add('asp-run');
  syncTheme();
  var finished = false;
  var failsafe = setTimeout(done, 7000);

  // نحمّل خط الكود بدري
  var fontReady = new Promise(function(res){
    try{
      var lk = document.createElement('link');
      lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&display=swap';
      lk.onload = lk.onerror = function(){ res(); };
      document.head.appendChild(lk);
    }catch(e){ res(); }
  });

  function done(){
    if(finished) return;
    finished = true;
    clearTimeout(failsafe);
    try{ sessionStorage.setItem(KEY, '1'); }catch(e){}
    var el = document.getElementById('asp');
    de.classList.remove('asp-run', 'asp-ready', 'asp-light');
    if(el){
      el.classList.add('asp-out');
      setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 1100);
    }
  }

  var wait = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };

  async function start(){
    var splash = document.createElement('div');
    splash.id = 'asp';
    splash.setAttribute('role', 'status');
    splash.setAttribute('aria-label', 'Abd Code');
    splash.innerHTML = '<div class="asp-content"><div class="asp-stage" id="asp-stage"></div></div>';
    document.body.appendChild(splash);
    de.classList.add('asp-ready');
    syncTheme();
    if(de.classList.contains('asp-light')) splash.classList.add('lt');

    var stage = document.getElementById('asp-stage');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // رموز كود خفيفة بالخلفية
    ['{ }','</>',';','( )','=>','[ ]','//','&&'].forEach(function(t, i){
      var s = document.createElement('span');
      s.className = 'asp-fl';
      s.textContent = t;
      s.style.left = (6 + (i * 37) % 86) + '%';
      s.style.top = (8 + (i * 53) % 80) + '%';
      s.style.fontSize = (1 + (i % 3) * .5) + 'rem';
      s.style.animationDelay = (i * .55) + 's';
      splash.appendChild(s);
    });

    var letters = NAME.split('').map(function(ch, i){
      var s = document.createElement('span');
      s.className = 'asp-l' + (i >= 4 ? ' code' : '');
      s.textContent = ch;
      stage.appendChild(s);
      return s;
    });

    // الشعار الحقيقي للموقع، وإذا ما انحمل بنحط بديل
    var pen = document.createElement('div');
    pen.className = 'asp-pen';
    var img = new Image();
    img.alt = '';
    img.src = LOGO;
    img.onerror = function(){
      var fb = document.createElement('span');
      fb.className = 'asp-fb';
      fb.textContent = '</>';
      if(img.parentNode) img.parentNode.replaceChild(fb, img);
    };
    pen.appendChild(img);
    stage.appendChild(pen);

    try{
      await Promise.race([
        fontReady.then(function(){ return document.fonts.load('800 40px "JetBrains Mono"'); }),
        wait(1800)
      ]);
      if(img.decode) await Promise.race([img.decode().catch(function(){}), wait(600)]);
    }catch(e){}

    var place = function(l){ return l.offsetLeft + l.offsetWidth + 3; };

    if(reduce){
      letters.forEach(function(l){ l.classList.add('on'); });
      pen.style.transform = 'translate(' + place(letters[letters.length - 1]) + 'px,0)';
      pen.style.opacity = 1;
      pen.classList.add('rest');
      await wait(700);
      return done();
    }

    // الشعار بيظهر عند بداية السطر
    pen.style.transition = 'none';
    pen.style.transform = 'translate(' + (letters[0].offsetLeft - 2) + 'px,0)';
    void pen.offsetWidth;
    pen.style.transition = '';
    pen.style.opacity = 1;
    await wait(450);

    // بيكتب حرف حرف، والشعار بيمشي وراء كل حرف
    for(var i = 0; i < letters.length; i++){
      letters[i].classList.add('on', 'wave');
      pen.style.transform = 'translate(' + place(letters[i]) + 'px,0)';
      await wait(letters[i].textContent === ' ' ? 190 : 95 + Math.random() * 70);
    }

    // نبضة صغيرة بالنهاية وبعدها يفتح الموقع
    pen.classList.add('rest');
    await pen.animate([{scale:1},{scale:1.28},{scale:1}], {duration:420, easing:'ease-out'}).finished;
    await wait(450);
    done();
  }

  function init(){ start().catch(done); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

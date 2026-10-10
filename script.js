/* ===== إعداداتك (عدّل هون) ===== */
const CONFIG = {
  channelUrl: 'https://www.youtube.com/channel/UC6V8FpZwiLoSbL07uwB2TAg',   // رابط قناتك
  email: 'abdaboarar31@gmail.com',        //  إيميلك لاستقبال الرسائل
  subsNow: 50,       //  عدد المشتركين الحالي
  subsGoal: 1000    // الهدف
};

// الفيديوهات بملف videos-data.js
const VIDEOS = VIDEO_LIST;
const HOME_COUNT = 3;   // كم فيديو يظهر بالرئيسية

const TAGS = { all: 'الكل', full: 'شرح كامل', quick: 'سريع' };

const PATH = [
  { t: 'HTML', d: 'هيكل الصفحة والوسوم الأساسية', ok: true },
  { t: 'CSS', d: 'الألوان والتنسيق والتصميم', ok: false },
  { t: 'JavaScript', d: 'التفاعل والحركة', ok: false },
  { t: 'انشر موقعك', d: 'ارفعه على الإنترنت مجاناً', ok: false }
];

const QUIZ = [
  { q: 'أي وسم بنستخدمه للعنوان الرئيسي بالصفحة؟', o: ['<h1>', '<p>', '<a>'], a: 0 },
  { q: 'أي وسم بيعمل رابط؟', o: ['<img>', '<a>', '<div>'], a: 1 },
  { q: 'شو هي HTML؟', o: ['لغة ترميز بتبني هيكل صفحات الويب', 'لغة لإدارة قواعد البيانات', 'برنامج لتعديل الصور'], a: 0 }
];

const STARTER = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
  body{font-family:sans-serif;text-align:center;padding:30px;background:#fff7f0}
  h1{color:#ff6a2b}
  button{padding:10px 22px;border:0;border-radius:10px;background:#ff6a2b;color:#fff;font-size:1rem;cursor:pointer}
</style>
</head>
<body>
  <h1>أهلاً يا عالم!</h1>
  <p>هذا أول موقع إلي بـ HTML</p>
  <button onclick="alert('برافو!')">اضغط هنا</button>
</body>
</html>`;

/* ===== أدوات ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ===== الوضع الفاتح والداكن ===== */
function setTheme(mode) {
  document.documentElement.dataset.theme = mode;
  $('#theme').textContent = mode === 'light' ? '☀️' : '🌙';
  try { localStorage.setItem('abd-theme', mode); } catch (e) {}
}
let saved = 'dark';
try { saved = localStorage.getItem('abd-theme') || 'dark'; } catch (e) {}
setTheme(saved);
$('#theme').addEventListener('click', () =>
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));

/* ===== القائمة ===== */
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      $$('#nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => io.observe(s));

/* ===== روابط القناة ===== */
const channelLink = CONFIG.channelUrl
  ? CONFIG.channelUrl + (CONFIG.channelUrl.includes('?') ? '&' : '?') + 'sub_confirmation=1' : '';
$$('[data-channel]').forEach(a => {
  if (channelLink) { a.href = channelLink; a.target = '_blank'; a.rel = 'noopener'; }
  else a.addEventListener('click', e => { e.preventDefault(); toast('حط رابط قناتك بأول ملف script.js'); });
});

/* ===== الكود اللي بينكتب ===== */
const TYPED = `<!DOCTYPE html>
<html>
<body>
  <h1>موقعي الأول</h1>
  <p>تعلّمت HTML!</p>
  <a href="#">اضغط هنا</a>
</body>
</html>`;
const hl = s => esc(s).replace(/(&lt;\/?[a-z0-9!]+)/gi, '<span class="t">$1</span>');
const CUR = '<span class="cur"></span>';
if (reduced) $('#typed').innerHTML = hl(TYPED);
else {
  let i = 0;
  const timer = setInterval(() => {
    i++;
    $('#typed').innerHTML = hl(TYPED.slice(0, i)) + CUR;
    if (i >= TYPED.length) clearInterval(timer);
  }, 38);
}

/* ===== الفيديوهات ===== */
let tag = 'all';
function renderChips() {}   // الفلاتر صارت بصفحة جميع الفيديوهات
function renderVideos() {
  $('#vgrid').innerHTML = VIDEOS.slice(0, HOME_COUNT).map((v, i) => isSoon(v) ? `
    <article class="vcard soon">
      <div class="thumb"><span class="ph">⏳</span><span class="soon-b">${t('soon')}</span></div>
      <div class="vinfo"><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p>
        <span class="btn small dl off">${t('premieres')} ${esc(soonWhen(v, LANG))}</span></div>
    </article>` : `
    <article class="vcard">
      <button class="thumbbtn" data-v="${i}" type="button" aria-label="${esc(v.title)}">
        <div class="thumb">${v.id
          ? `<img src="https://i.ytimg.com/vi/${esc(v.id)}/maxresdefault.jpg" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg'">`
          : `<span class="ph">&lt;/&gt;</span>`}
          <span class="play-b">▶</span>${v.dur ? `<em>${esc(v.dur)}</em>` : ''}
        </div>
      </button>
      <div class="vinfo"><h3>${esc(v.title)}</h3><p>${esc(v.desc)}</p>
        ${v.code ? `<a class="btn small dl" href="${esc(v.code)}" ${/^https?:/.test(v.code) ? 'target="_blank" rel="noopener"' : 'download'}>${t('dl')}</a>` : ''}</div>
    </article>`).join('');
}
$('#vgrid').addEventListener('click', e => {
  const c = e.target.closest('[data-v]'); if (c) openVideo(+c.dataset.v);
});
$('#watchFirst').addEventListener('click', () => openVideo(Math.max(0, VIDEOS.findIndex(v => v.first))));

function openVideo(i) {
  const v = VIDEOS[i]; if (!v) return;
  $('#mt').textContent = v.title;
  $('#md').textContent = v.desc;
  $('#mplayer').innerHTML = v.id
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?autoplay=1&rel=0" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
    : `<div class="noid">...</div>`;
  $('#ml').innerHTML = v.id
    ? `<a class="btn small" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}" target="_blank" rel="noopener">افتح على يوتيوب</a>` : '';
  if (v.code) $('#ml').innerHTML += ` <a class="btn small ghost" href="${esc(v.code)}" ${/^https?:/.test(v.code) ? 'target="_blank" rel="noopener"' : 'download'}>${t('dl')}</a>`;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeVideo() {
  $('#modal').hidden = true;
  $('#mplayer').innerHTML = '';
  document.body.style.overflow = '';
}
$('#mclose').addEventListener('click', closeVideo);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeVideo(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeVideo(); $('#nav').classList.remove('open'); }
});

/* ===== المحرر الحي ===== */
const code = $('#code'), prev = $('#preview');
code.value = STARTER;
let pt;
const run = () => { prev.srcdoc = code.value; };
code.addEventListener('input', () => { clearTimeout(pt); pt = setTimeout(run, 250); });
$('#reset').addEventListener('click', () => { code.value = STARTER; run(); toast('رجع الكود الأصلي'); });
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(code.value); }
  catch (e) { code.select(); document.execCommand('copy'); }
  toast('تم نسخ الكود');
});
run();

/* ===== الاختبار (العرض بالأسفل مع اللغات) ===== */
let qi = 0, score = 0, locked = false;
$('#quizBox').addEventListener('click', e => {
  const opt = e.target.closest('.opt');
  if (opt && !locked) {
    locked = true;
    const pick = +opt.dataset.i, right = QUIZ[qi].a;
    if (pick === right) score++;
    $$('.opt').forEach((b, i) => { if (i === right) b.classList.add('ok'); else if (i === pick) b.classList.add('bad'); });
    $('#qnext').hidden = false;
    return;
  }
  if (e.target.id === 'qnext') { qi++; renderQuiz(); }
  if (e.target.id === 'qre') { qi = 0; score = 0; renderQuiz(); }
});


/* ===== إضافات: اللغات، عدّاد الزوار، إحصائيات يوتيوب، المتجر والدفع، رسائل التواصل ===== */
/* ===== إعدادات (عدّل هون) ===== */
const X = {
  ytApiKey: 'AIzaSyC2Z0mIJHVFuUtuPQ1pOiJ6cTZ_ohHpVIg',                          // مفتاح YouTube Data API (للأرقام الحقيقية)
  channelId: 'UC6V8FpZwiLoSbL07uwB2TAg', // رقم قناتك
  visitorGoal: 1000,                     // هدف الزوار
  counterKey: 'abd-abu-arar-site',       // اسم فريد لعدّاد موقعك (غيّره لأي اسم)
  email: (CONFIG.email || '').trim()     // الرسائل بتوصل لهاد الإيميل
};

/* ===== الترجمات (لإضافة لغة: انسخ كتلة en وترجمها) ===== */
const T = {
ar: { name: 'العربية', dir: 'rtl', title: 'عبد أبو عرار — تعلّم HTML بالعربي',
  nav_videos: 'الفيديوهات', nav_play: 'جرّب بنفسك', nav_path: 'المسار', nav_store: 'المتجر', nav_quiz: 'اختبار', nav_about: 'عنّي', nav_contact: 'تواصل',
  subscribe: '▶ اشترك', h1: 'تعلّم تصميم المواقع بـ HTML من الصفر', lead: 'شرح بسيط وبالعربي، خطوة بخطوة، مع تجارب حيّة بتعملها بنفسك.',
  watch: '▶ شاهد أول فيديو', tryit: 'جرّب الكود الآن', goal: '🎯 هدفنا: زوّار حقيقيون', visitor: 'زائر',
  st_subs: 'مشترك', st_views: 'مشاهدة', st_vids: 'فيديو', sec_videos: 'الفيديوهات', sec_play: 'جرّب بنفسك',
  play_hint: 'عدّل على الكود وشوف النتيجة فوراً. ما في شي بينحفظ، جرّب براحتك.', code: 'الكود', result: 'النتيجة', copy: 'نسخ', reset: 'إعادة',
  sec_path: 'مسار التعلّم', sec_store: 'المتجر', store_hint: 'كتب ومستندات PDF من إعدادي. اختر الكتاب وبعدها طريقة الدفع.',
  sec_quiz: 'اختبر نفسك', sec_about: 'عنّي', about: 'أنا <b>عبد أبو عرار</b>. بشرح تصميم المواقع بـ HTML بالعربي وبطريقة بسيطة، عشان أي حدا يبدأ من الصفر ويبني موقعه الأول.',
  sec_contact: 'تواصل معي', lbl_name: 'اسمك', lbl_msg: 'رسالتك', send: 'إرسال', ytbtn: '▶ قناتي على يوتيوب', foot_tag: 'تعلّم HTML بالعربي',
  credit: 'تصميم وتطوير: <b>عبد أبو عرار</b>', rights: '© {y} عبد أبو عرار. جميع الحقوق محفوظة. يُمنع نسخ أو إعادة نشر المحتوى (الشروحات والكتب والتصاميم) دون إذن خطي.',
  c_title: 'أهلاً فيك 👋', c_text: 'باستخدامك الموقع بتوافق على تعليماته وشروطه. الموافقة بتنحسب كزيارة وحدة بس لعدّاد الزوار، وما بنجمع أي بيانات شخصية.',
  c_ok: 'موافق', c_no: 'لا، شكراً', thanks: 'شكراً لك! انحسبت زيارتك 🙌', buy: 'اشترِ الآن', pay_title: 'اختر طريقة الدفع:', pay_soon: 'قريباً',
  pay_note: 'بعد الدفع ابعتلي إثبات الدفع من نموذج «تواصل» وبوصلك الملف على إيميلك.',
  sent: 'وصلت رسالتك، شكراً!', fill: 'اكتب اسمك ورسالتك أول', fail: 'ما انبعتت الرسالة، جرّب كمان شوي', yt_open: 'افتح على يوتيوب', dl: '⬇️ حمّل ملف الكود', all_videos: 'شاهد جميع الفيديوهات', soon: 'قريباً', premieres: 'ينزل',
  avail: 'متوفر', soon: 'قريباً', q_n: 'سؤال {a} من {b}', q_next: 'السؤال التالي', q_res: 'شوف النتيجة', q_again: 'أعد الاختبار',
  q_best: 'ممتاز! أنت جاهز للدرس الجاي 🔥', q_mid: 'قريب جداً. راجع الفيديو وجرّب تاني.', q_low: 'ولا يهمك، ابدأ من أول فيديو وبتتعلّم.',
  toast_reset: 'رجع الكود الأصلي', toast_copy: 'تم نسخ الكود', tags: { all: 'الكل', full: 'شرح كامل', quick: 'سريع' } },
en: { name: 'English', dir: 'ltr', title: 'Abd Abu Arar — Learn HTML',
  nav_videos: 'Videos', nav_play: 'Playground', nav_path: 'Roadmap', nav_store: 'Store', nav_quiz: 'Quiz', nav_about: 'About', nav_contact: 'Contact',
  subscribe: '▶ Subscribe', h1: 'Learn web design with HTML from scratch', lead: 'Simple, step-by-step lessons with live experiments you try yourself.',
  watch: '▶ Watch the first video', tryit: 'Try the code now', goal: '🎯 Our goal: real visitors', visitor: 'visitors',
  st_subs: 'subscribers', st_views: 'views', st_vids: 'videos', sec_videos: 'Videos', sec_play: 'Try it yourself',
  play_hint: 'Edit the code and see the result instantly. Nothing is saved, so experiment freely.', code: 'Code', result: 'Result', copy: 'Copy', reset: 'Reset',
  sec_path: 'Learning roadmap', sec_store: 'Store', store_hint: 'PDF books and documents I made. Pick one, then choose how to pay.',
  sec_quiz: 'Test yourself', sec_about: 'About', about: "I'm <b>Abd Abu Arar</b>. I teach web design with HTML in a simple way, so anyone can start from zero and build their first site.",
  sec_contact: 'Contact me', lbl_name: 'Your name', lbl_msg: 'Your message', send: 'Send', ytbtn: '▶ My YouTube channel', foot_tag: 'Learn HTML',
  credit: 'Designed & developed by <b>Abd Abu Arar</b>', rights: '© {y} Abd Abu Arar. All rights reserved. Copying or republishing the content (tutorials, books, designs) without written permission is prohibited.',
  c_title: 'Welcome 👋', c_text: 'By using this site you agree to its terms. Your agreement counts as one visit in the visitor counter, and we collect no personal data.',
  c_ok: 'I agree', c_no: 'No, thanks', thanks: 'Thank you! Your visit was counted 🙌', buy: 'Buy now', pay_title: 'Choose a payment method:', pay_soon: 'soon',
  pay_note: 'After paying, send me the payment proof via the Contact form and I will email you the file.',
  sent: 'Message sent, thank you!', fill: 'Please enter your name and message', fail: "Couldn't send, please try again soon", yt_open: 'Open on YouTube', dl: '⬇️ Download the code', all_videos: 'Watch all videos', soon: 'Coming soon', premieres: 'Premieres',
  avail: 'Available', soon: 'Soon', q_n: 'Question {a} of {b}', q_next: 'Next question', q_res: 'See result', q_again: 'Retake quiz',
  q_best: "Excellent! You're ready for the next lesson 🔥", q_mid: 'Very close. Rewatch the video and try again.', q_low: 'No worries, start from the first video and you will learn.',
  toast_reset: 'Original code restored', toast_copy: 'Code copied', tags: { all: 'All', full: 'Full course', quick: 'Quick' } }
};
const EN = {
  path: [{ t: 'HTML', d: 'Page structure and core tags' }, { t: 'CSS', d: 'Colors, styling and layout' },
         { t: 'JavaScript', d: 'Interaction and motion' }, { t: 'Publish your site', d: 'Put it online for free' }],
  quiz: [{ q: 'Which tag is used for the main heading?', o: ['<h1>', '<p>', '<a>'] }, { q: 'Which tag creates a link?', o: ['<img>', '<a>', '<div>'] },
         { q: 'What is HTML?', o: ['A markup language that builds the structure of web pages', 'A language for managing databases', 'A photo editing program'] }]
};

let LANG = 'ar';
try { LANG = localStorage.getItem('abd-lang') || 'ar'; } catch (e) {}
if (!T[LANG]) LANG = 'ar';
const t = k => (T[LANG] && T[LANG][k]) || T.ar[k] || k;

PATH.forEach((p, i) => p.L = { ar: { t: p.t, d: p.d }, en: EN.path[i] });
QUIZ.forEach((q, i) => q.L = { ar: { q: q.q, o: q.o }, en: EN.quiz[i] });

/* ===== المسار (متوفر بكل اللغات) ===== */
function renderPath() {
  $('#pathList').innerHTML = PATH.map((p, i) => `
    <li class="step ${p.ok ? 'done' : ''}"><b class="n">${i + 1}</b>
      <div><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>
      <span class="state">${p.ok ? t('avail') : t('soon')}</span></li>`).join('');
}

/* ===== الاختبار ===== */
function renderQuiz() {
  const box = $('#quizBox');
  if (qi >= QUIZ.length) {
    const m = score === QUIZ.length ? t('q_best') : score >= 2 ? t('q_mid') : t('q_low');
    box.innerHTML = `<div class="result"><div class="big">${score}/${QUIZ.length}</div><p>${m}</p><button class="btn" id="qre" type="button">${t('q_again')}</button></div>`;
    return;
  }
  const q = QUIZ[qi]; locked = false;
  box.innerHTML = `<div class="qmeta">${t('q_n').replace('{a}', qi + 1).replace('{b}', QUIZ.length)}</div><h3>${esc(q.q)}</h3>
    <div class="opts">${q.o.map((o, i) => `<button class="opt" data-i="${i}" type="button" dir="auto">${esc(o)}</button>`).join('')}</div>
    <div class="qfoot"><button class="btn small" id="qnext" type="button" hidden>${qi === QUIZ.length - 1 ? t('q_res') : t('q_next')}</button></div>`;
}

/* ===== عدّاد الزوار الحقيقي (بعد الموافقة) ===== */
let visitors = null;
function renderGoal() {
  $('#goalTxt').textContent = (visitors == null ? '…' : visitors) + ' / ' + X.visitorGoal + ' ' + t('visitor');
  $('#goalBar').style.width = Math.max(3, Math.min(100, (visitors || 0) / X.visitorGoal * 100)) + '%';
}
async function counter(op) {
  try {
    const r = await fetch('https://abacus.jasoncameron.dev/' + op + '/' + X.counterKey + '/visits');
    visitors = r.ok ? (await r.json()).value : (r.status === 404 ? 0 : null);
  } catch (e) {}
  renderGoal();
}
function accept() {
  try { localStorage.setItem('abd-consent', '1'); } catch (e) {}
  $('#cmodal').hidden = true; counter('hit'); toast(t('thanks'));
}
function decline() {
  try { sessionStorage.setItem('abd-skip', '1'); } catch (e) {}
  $('#cmodal').hidden = true;
}
$('#cok').addEventListener('click', accept);
$('#cno').addEventListener('click', decline);
{
  let c = null, s = null;
  try { c = localStorage.getItem('abd-consent'); s = sessionStorage.getItem('abd-skip'); } catch (e) {}
  counter('get');
  if (c !== '1' && !s) setTimeout(() => $('#cmodal').hidden = false, 700);
}

/* ===== إحصائيات يوتيوب الحقيقية ===== */
let ST = {};
function renderStats() {
  const f = n => n == null ? '—' : new Intl.NumberFormat(LANG === 'ar' ? 'ar-u-nu-latn' : LANG).format(n);
  $('#stSubs').textContent = f(ST.subs); $('#stViews').textContent = f(ST.views); $('#stVids').textContent = f(ST.vids);
}
async function loadStats() {
  if (!X.ytApiKey) return;
  try {
    const r = await fetch('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + X.channelId + '&key=' + X.ytApiKey);
    const s = (await r.json()).items[0].statistics;
    ST = { subs: s.hiddenSubscriberCount ? null : +s.subscriberCount, views: +s.viewCount, vids: +s.videoCount };
  } catch (e) {}
  renderStats();
}

/* ===== رسائل التواصل بتوصل لإيميلك ===== */
$('#cform').addEventListener('submit', async e => {
  e.preventDefault(); e.stopImmediatePropagation();
  const name = $('#cname').value.trim(), msg = $('#cmsg').value.trim();
  if (!name || !msg) return toast(t('fill'));
  try {
    const r = await fetch('https://formsubmit.co/ajax/' + X.email, { method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, message: msg, _subject: 'رسالة جديدة من موقعك: ' + name }) });
    if (!r.ok) throw 0;
    $('#cform').reset(); toast(t('sent'));
  } catch (err) { toast(t('fail')); }
}, true);

/* ===== تعريب رسائل الكود الأصلي ===== */
const _toast = toast;
toast = m => _toast(m === 'رجع الكود الأصلي' ? t('toast_reset') : m === 'تم نسخ الكود' ? t('toast_copy') : m);
const _ov = openVideo;
openVideo = i => { _ov(i); const a = $('#ml a'); if (a) a.textContent = t('yt_open'); };

/* ===== تطبيق اللغة ===== */
function applyLang(l) {
  LANG = l; try { localStorage.setItem('abd-lang', l); } catch (e) {}
  const d = document.documentElement; d.lang = l; d.dir = T[l].dir; document.title = T[l].title;
  $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
  $$('[data-i18n-html]').forEach(el => el.innerHTML = t(el.dataset.i18nHtml).replace('{y}', new Date().getFullYear()));
  VIDEOS.forEach(v => Object.assign(v, v.L[l] || v.L.ar));
  PATH.forEach(p => Object.assign(p, p.L[l] || p.L.ar));
  QUIZ.forEach(q => Object.assign(q, q.L[l] || q.L.ar));
  Object.assign(TAGS, T[l].tags);
  qi = 0; score = 0;
  renderChips(); renderVideos(); renderPath(); renderQuiz(); renderGoal(); renderStats();
  $('#lang').value = l;
}
$('#lang').innerHTML = Object.keys(T).map(k => `<option value="${k}">${T[k].name}</option>`).join('');
$('#lang').addEventListener('change', e => applyLang(e.target.value));
applyLang(LANG);
loadStats();

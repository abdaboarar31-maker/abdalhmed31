/* ===== قائمة الفيديوهات (الملف الي بتعدل فيه عند كل فيديو جديد) =====
   - الفيديو الجديد بتحطو أول القائمة (الأحدث أول واحد) وبيطلع لحالو بالرئيسية.
   - id  = الجزء بعد v= برابط الفيديو
   - code = مسار ملف الكود المجاني (حط الملف بمجلد codes)
   - tag = full (شرح كامل) أو quick (سريع)
   - first: true = الفيديو الي بيفتحو زر "شاهد أول فيديو"
   - date = (اختياري) موعد نزول الفيديو، مثال: '2026-10-15 10:00'
       قبل هالموعد بيبين الكرت "قريباً" مع اليوم والساعة، وبدون زر تحميل.
       وبعد الموعد بيتحول لحالو لفيديو عادي وبيظهر زر التحميل (بدون ما تعدل شي).

   قالب فيديو قادم (انسخه وحطه أول القائمة قبل ما ينزل الفيديو):
  { id: 'رقم_الفيديو', tag: 'full', date: '2026-10-15 10:00', code: 'codes/اسم-الملف.zip', L: {
    ar: { title: 'عنوان الفيديو', desc: 'وصف قصير.', dur: '10 دقائق' },
    en: { title: 'Video title', desc: 'Short description.', dur: '10 min' } } },
*/

/* توقيت النشر: الساعة 10 بتوقيت هالمنطقة (غيّرها إذا بلدك مختلفة) */
const RELEASE_TZ = 'Asia/Jerusalem';
const VIDEO_LIST = [
  { id: 'YndzGRSOXD8', tag: 'full', date: '2026-10-15 10:00', code: 'codes/home-html.zip.zip', L: {
    ar: { title: 'تصميم واجهة موقع مع شريط علوي مميز باستخدام HTML & CSS', desc: 'نصمم واجهة موقع بشريط علوي مميز خطوة بخطوة.', dur: 'فيديو جديد' },
    en: { title: 'Website interface with a custom top bar using HTML & CSS', desc: 'Design a website interface with a custom top bar, step by step.', dur: 'New video' } } },
  { id: 'wivKzfT0RjY', tag: 'full', date: '2026-10-12 10:00', code: 'codes/login-ui.zip', L: {
    ar: { title: 'تصميم واجهة تسجيل دخول احترافية باستخدام HTML و CSS', desc: 'مشروع عملي للمبتدئين من الصفر.', dur: 'فيديو جديد' },
    en: { title: 'Professional login page design with HTML & CSS', desc: 'A hands-on beginner project from scratch.', dur: 'New video' } } },
  { id: 'Zxascnw-MoQ', tag: 'full', code: 'codes/login-page.zip.zip', L: {
    ar: { title: 'كيف تبني صفحة تسجيل دخول احترافية', desc: 'HTML و CSS و JS خطوة بخطوة.', dur: '5 دقائق و40 ثانية' },
    en: { title: 'Build a pro login page', desc: 'HTML, CSS and JS step by step.', dur: '5 min 40 sec' } } },
  { id: '-VvEYwXMX_8', tag: 'full', first: true, code: , L: {
    ar: { title: 'شرح HTML من الصفر وبناء أول موقع', desc: 'شرح كامل من البداية: الوسوم الأساسية وبناء صفحة موقع كاملة.', dur: '35 دقيقة' },
    en: { title: 'HTML from scratch: build your first website', desc: 'Full lesson: core tags and building a complete page.', dur: '35 min' } } },
  { id: 'n_17dEUPCo0', tag: 'quick', code: 'codes/html-basics.zip.zip', L: {
    ar: { title: 'أساسيات HTML بسرعة', desc: 'ملخص سريع لأهم أساسيات HTML.', dur: '3 دقائق ونص' },
    en: { title: 'HTML basics in a flash', desc: 'A quick summary of the most important HTML basics.', dur: '3.5 min' } } }
];

/* ===== دوال "قريباً" (ما بتحتاج تعدل عليها) ===== */
function releaseMs(v) {
  if (!v.date) return 0;
  const [dd, tt] = v.date.split(' '), [y, mo, da] = dd.split('-').map(Number), [h, mi] = (tt || '00:00').split(':').map(Number);
  const guess = Date.UTC(y, mo - 1, da, h, mi);
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: RELEASE_TZ, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    .formatToParts(new Date(guess)).map(x => [x.type, x.value]));
  return guess - (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - guess);
}
const isSoon = v => !!v.date && Date.now() < releaseMs(v);
const soonWhen = (v, lang) => new Intl.DateTimeFormat(lang === 'en' ? 'en' : 'ar-u-nu-latn', { weekday: 'long', hour: 'numeric', minute: '2-digit' }).format(new Date(releaseMs(v)));

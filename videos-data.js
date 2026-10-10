/* ===== قائمة الفيديوهات (الملف الي بتعدل فيه عند كل فيديو جديد) =====
   - الفيديو الجديد بتحطو أول القائمة (الأحدث أول واحد) وبيطلع لحالو بالرئيسية.
   - id  = الجزء بعد v= برابط الفيديو
   - code = مسار ملف الكود المجاني (حط الملف بمجلد codes)
   - tag = full (شرح كامل) أو quick (سريع)
   - first: true = الفيديو الي بيفتحو زر "شاهد أول فيديو" */
const VIDEO_LIST = [
  { id: 'Zxascnw-MoQ', tag: 'full', code: 'codes/login-page.zip', L: {
    ar: { title: 'كيف تبني صفحة تسجيل دخول احترافية', desc: 'HTML و CSS و JS خطوة بخطوة.', dur: '5 دقائق و40 ثانية' },
    en: { title: 'Build a pro login page', desc: 'HTML, CSS and JS step by step.', dur: '5 min 40 sec' } } },
  { id: '-VvEYwXMX_8', tag: 'full', first: true, code: 'codes/html-website.zip', L: {
    ar: { title: 'شرح HTML من الصفر وبناء أول موقع', desc: 'شرح كامل من البداية: الوسوم الأساسية وبناء صفحة موقع كاملة.', dur: '35 دقيقة' },
    en: { title: 'HTML from scratch: build your first website', desc: 'Full lesson: core tags and building a complete page.', dur: '35 min' } } },
  { id: 'n_17dEUPCo0', tag: 'quick', code: 'codes/html-basics.zip', L: {
    ar: { title: 'أساسيات HTML بسرعة', desc: 'ملخص سريع لأهم أساسيات HTML.', dur: '3 دقائق ونص' },
    en: { title: 'HTML basics in a flash', desc: 'A quick summary of the most important HTML basics.', dur: '3.5 min' } } }
];

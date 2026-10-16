// ضعه بهالمسار داخل مشروعك: functions/api/stats.js
// يحتاج KV باسم VISITS (مربوط بالمشروع)
const clean = s => (s || 'home').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30) || 'home';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const page = clean(url.searchParams.get('page'));
  const get = async k => parseInt((await env.VISITS.get(k)) || '0', 10);

  if (request.method === 'POST') {
    let isNew = false, isStudent = false;
    try { const j = await request.json(); isNew = !!j.new; isStudent = !!j.student; } catch (e) {}
    await env.VISITS.put('views', String((await get('views')) + 1));
    await env.VISITS.put('page_' + page, String((await get('page_' + page)) + 1));
    if (isNew) await env.VISITS.put('visitors', String((await get('visitors')) + 1));
    if (isStudent) await env.VISITS.put('students', String((await get('students')) + 1));
  }

  const body = {
    visitors: await get('visitors'),
    views: await get('views'),
    students: await get('students'),
    academy: await get('page_academy')
  };
  return new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}

// functions/api/reviews.js — يستخدم نفس KV (VISITS) + متغير سري ADMIN_KEY
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const read = async (env, k) => { try { return JSON.parse((await env.VISITS.get(k)) || '[]'); } catch (e) { return []; } };
const write = (env, k, v) => env.VISITS.put(k, JSON.stringify(v));
const nh = (env, t) => { const h = { Title: t }; if (env.NTFY_TOKEN) h.Authorization = 'Bearer ' + env.NTFY_TOKEN; return h; };
const isAdmin = (env, key) => key === 'Aa123456aa';
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    if (url.searchParams.has('admin')) {
      if (!isAdmin(env, url.searchParams.get('admin'))) return J({ error: 'no' }, 403);
      if (url.searchParams.has('notify')) { // فحص الإشعار
        if (!env.NTFY_TOPIC) return J({ ntfy: 'NTFY_TOPIC missing' });
        try {
          const r = await fetch('https://ntfy.sh/' + encodeURIComponent(env.NTFY_TOPIC), { method: 'POST', headers: nh(env, 'Test'), body: 'test from site' });
          const t = (await r.text()).slice(0, 300);
          return J({ ntfy: 'status ' + r.status, token_found: !!env.NTFY_TOKEN, token_length: env.NTFY_TOKEN ? env.NTFY_TOKEN.length : 0, reason: t });
        } catch (e) { return J({ ntfy: 'error ' + e.message }); }
      }
      return J({ pending: await read(env, 'pending') });
    }
    const list = await read(env, 'reviews');
    const avg = list.length ? list.reduce((a, r) => a + r.rating, 0) / list.length : 0;
    return J({ reviews: list.slice(0, 30), count: list.length, avg: Math.round(avg * 10) / 10 });
  }
  if (request.method !== 'POST') return J({ error: 'method' }, 405);

  let b; try { b = await request.json(); } catch (e) { return J({ error: 'bad' }, 400); }

  // إدارة: قبول أو حذف
  if (b.action) {
    if (!isAdmin(env, b.key)) return J({ error: 'no' }, 403);
    const pending = await read(env, 'pending');
    const item = pending.find(r => r.id === b.id);
    if (!item) return J({ error: 'notfound' }, 404);
    await write(env, 'pending', pending.filter(r => r.id !== b.id));
    if (b.action === 'approve') {
      const reviews = await read(env, 'reviews');
      reviews.unshift(item);
      await write(env, 'reviews', reviews.slice(0, 100));
    }
    return J({ ok: true });
  }

  // رأي جديد من طالب
  if (b.website) return J({ ok: true }); // فخ للبوتات
  const text = String(b.text || '').trim().slice(0, 400);
  const rating = Math.round(Number(b.rating));
  if (text.length < 5 || !(rating >= 1 && rating <= 5)) return J({ error: 'invalid' }, 400);
  const ip = request.headers.get('CF-Connecting-IP') || 'x';
  if (await env.VISITS.get('rl_' + ip)) return J({ error: 'wait' }, 429);
  await env.VISITS.put('rl_' + ip, '1', { expirationTtl: 120 });
  const pending = await read(env, 'pending');
  pending.unshift({ id: Date.now() + '' + Math.floor(Math.random() * 1000), name: String(b.name || '').trim().slice(0, 30) || 'طالب', rating, text, at: new Date().toISOString().slice(0, 10) });
  await write(env, 'pending', pending.slice(0, 100));
  // إشعار على تلفونك (اختياري): يحتاج متغير NTFY_TOPIC
  if (env.NTFY_TOPIC) {
    try {
      const n = pending[0];
      const msg = 'رأي جديد من ' + n.name + ' (' + n.rating + ' نجوم). افتح صفحة المراجعة للموافقة.';
      await fetch('https://ntfy.sh/' + encodeURIComponent(env.NTFY_TOPIC), { method: 'POST', headers: nh(env, 'New review'), body: msg });
    } catch (e) {}
  }
  return J({ ok: true });
}

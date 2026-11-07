// Cloudflare Worker: serves the static site (wrangler.jsonc "assets"), translates admin
// text Thai -> English (POST /api/translate, Workers AI, logged-in staff only), and once a
// day pings Supabase so the free project sees activity and never gets auto-paused.
const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

export default {
  // pages and files are answered by the assets layer first; anything else (e.g. a
  // missing page) falls through to here and gets the assets' normal 404
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/translate') return translate(request, env);
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    console.log(`keepalive: Supabase answered ${r.status}`);
  },
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

// Body: { texts: ["ไทย...", ...] } -> { texts: ["English...", ...] }
// Only staff signed in to the admin page may call it (their Supabase token is checked),
// so strangers can't use up the free Workers AI quota.
async function translate(request, env) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  const auth = request.headers.get('Authorization') || '';
  const who = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: auth },
  });
  if (!who.ok) return json({ error: 'Please log in again' }, 401);

  let texts;
  try { ({ texts } = await request.json()); } catch { return json({ error: 'Bad request' }, 400); }
  if (!Array.isArray(texts) || texts.length > 10 || texts.some(t => typeof t !== 'string' || t.length > 6000)) {
    return json({ error: 'Bad request' }, 400);
  }

  const out = [];
  for (const text of texts) {
    if (!text.trim()) { out.push(''); continue; }
    out.push(await translateOne(text, env));
  }
  return json({ texts: out });
}

// One Thai text -> English. The text goes inside <thai> tags and the model is told it is
// only translating: titles are often questions ("ควรเปลี่ยนตอนไหน?") and must not be answered.
// If the reply is far longer than the original (the model answered or added notes),
// fall back to the plain translation model m2m100, which can only translate.
async function translateOne(text, env) {
  try {
    const r = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      max_tokens: Math.min(4096, 200 + text.length * 2),
      temperature: 0.2,
      messages: [
        { role: 'system', content:
          'You are a translator for a car tire, wheel and suspension shop website. ' +
          'Translate the Thai text inside <thai></thai> into natural, simple English. ' +
          'The text may be a title or a question: translate it, NEVER answer it or add information. ' +
          'Keep every line break, blank line, list mark (•, 1), 2)...), number, price, brand and model ' +
          'name exactly as in the original. Reply with the English translation only: no tags, notes or quotes.' },
        { role: 'user', content: `<thai>${text}</thai>` },
      ],
    });
    const en = String(r.response || '').replace(/<\/?(thai|english)>/g, '').trim();
    if (en && en.length <= text.length * 3 + 40) return en;
  } catch (err) {
    console.log('translate (llama) failed:', err.message);
  }
  const lines = await Promise.all(text.split(/\r?\n/).map(async line => {
    if (!line.trim()) return line;
    const r = await env.AI.run('@cf/meta/m2m100-1.2b', { text: line, source_lang: 'th', target_lang: 'en' });
    return r.translated_text || line;
  }));
  return lines.join(String.fromCharCode(10));
}

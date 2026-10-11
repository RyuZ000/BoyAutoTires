// Cloudflare Worker: serves the static site (wrangler.jsonc "assets") and, once a day,
// pings Supabase so the free project sees activity and never gets auto-paused.
// Same job as api/keepalive.js on Vercel.
const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

export default {
  // pages and files are answered by the assets layer first; anything else (e.g. a
  // missing page) falls through to here and gets the assets' normal 404
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    console.log(`keepalive: Supabase answered ${r.status}`);
  },
};

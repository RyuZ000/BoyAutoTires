// Vercel Cron calls this once a day so the free Supabase project
// sees activity and never gets auto-paused.
const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

module.exports = async (req, res) => {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, supabaseStatus: r.status, at: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
};

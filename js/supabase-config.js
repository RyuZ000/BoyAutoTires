/* ============================================================
   Supabase Configuration
   ------------------------------------------------------------
   1. Go to https://supabase.com -> create a free project
   2. Project Settings -> API
   3. Copy "Project URL" and "anon / public" key below
   4. This file is safe to be public (the anon key is meant to
      be used in the browser). Real security comes from the
      Row Level Security policies in supabase-schema.sql
   ============================================================ */

const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

// Shared Supabase client used by every page (auth.js, products.js, admin.html)
// If the library failed to load, sb stays null and sbLoad() reports it instead of
// the page waiting on "Loading..." forever.
const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Runs a Supabase query with a time limit. Resolves to { data, error } like a normal
// query; a missing library, a thrown error or a timeout all come back as error.
function sbLoad(makeQuery, ms = 12000) {
  if (!sb) return Promise.resolve({ data: null, error: { message: 'supabase library not loaded' } });
  let timer;
  const timeout = new Promise(resolve => {
    timer = setTimeout(() => resolve({ data: null, error: { message: 'timeout ' + ms / 1000 + 's' } }), ms);
  });
  const run = Promise.resolve()
    .then(makeQuery)
    .catch(e => ({ data: null, error: { message: (e && (e.name + ': ' + e.message)) || String(e) } }));
  return Promise.race([run, timeout]).finally(() => clearTimeout(timer));
}

// Error text for a product/portfolio grid: message, a retry button, and the reason in
// small print so a screenshot shows what went wrong.
function loadErrorHtml(error, retryCall) {
  const reason = String((error && error.message) || '').replace(/[<>&"]/g, '');
  return `<div class="products-status">
    <p>${t('products_error')}</p>
    <button type="button" class="load-retry" onclick="${retryCall}">${t('load_retry')}</button>
    <small class="load-reason">${reason}</small>
  </div>`;
}

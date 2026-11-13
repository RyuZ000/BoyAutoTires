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
// Photos and videos in Supabase Storage are shown through /img/... (worker.js), which
// keeps a copy in Cloudflare's cache, so Supabase sends each file out about once instead
// of on every page view (saves the free "Cached Egress" quota).
// Display only: never save the returned URL back to the database.
function cdnMedia(url) {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/`;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return url; // local preview has no /img
  return typeof url === 'string' && url.startsWith(prefix) && /\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i.test(url)
    ? '/img/' + url.slice(prefix.length)
    : url;
}

// Small copy of an uploaded photo for cards and lists (see uploadThumb in
// image-compress.js). Videos and site files are returned as cdnMedia gives them.
function cdnThumb(url) {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/`;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return url; // no worker to fall back locally
  return typeof url === 'string' && url.startsWith(prefix) && /\.(jpe?g|png|webp)$/i.test(url)
    ? cdnMedia(url.replace(/(\.[a-z0-9]+)$/i, '.thumb$1'))
    : cdnMedia(url);
}

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

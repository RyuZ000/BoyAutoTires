// Cloudflare Worker: serves the static site (wrangler.jsonc "assets"), translates admin
// text Thai -> English (POST /api/translate, Workers AI, logged-in staff only), serves
// Supabase photos and videos through Cloudflare's cache (/img/...), gives each blog article
// (/blog?a=<id>) and product (/tires?p=<id>, ...) its own canonical URL, title and
// description, lists them all in /sitemap.xml, and once a day pings Supabase so the
// free project sees activity and never gets auto-paused.
const SUPABASE_URL = "https://bseywzhzmeiqwpdpdfei.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bqtnkrjt0Do78-7k06NY5Q_NPiaJ8Em";

export default {
  // pages and files are answered by the assets layer first; anything else (e.g. a
  // missing page) falls through to here and gets the assets' normal 404.
  // /img/*, /blog, the product pages and /sitemap.xml come here first (wrangler.jsonc "run_worker_first").
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/translate') return translate(request, env);
    if (url.pathname.startsWith('/img/')) return cachedImage(request, url, ctx);
    if (url.pathname === '/blog' && url.searchParams.get('a')) return blogArticle(request, env, url);
    if (CATEGORY_BY_PATH[url.pathname] && url.searchParams.get('p')) return productPage(request, env, url);
    if (url.pathname === '/sitemap.xml') return sitemap(request, env, url);
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

// ---------- blog articles for search engines ----------
// Without this, every /blog?a=<id> carried blog.html's canonical "/blog", so Google
// treated each article as a duplicate of the list page and did not index it.

// Reads public rows; Cloudflare keeps each answer for 10 minutes, so search engine
// crawls don't turn into many Supabase reads (an admin edit shows up within 10 minutes).
async function supabaseRows(query) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    cf: { cacheTtl: 600, cacheEverything: true },
  });
  return r.ok ? r.json() : [];
}

const ORIGIN = 'https://boyautotires.com';
const oneLine = (text, max) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
};

// /blog?a=<id>: blog.html with the article's canonical URL, <title>, description and
// share image, plus BlogPosting data. The page itself still renders the article in JS.
async function blogArticle(request, env, url) {
  const page = await env.ASSETS.fetch(new Request(new URL('/blog', url), request));
  const id = url.searchParams.get('a');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return page;
  const [post] = await supabaseRows(
    `posts?select=id,title,body,image_urls,created_at&type=eq.blog&id=eq.${id}`);
  if (!post) return page;

  const link = `${ORIGIN}/blog?a=${post.id}`;
  const title = `${post.title} - BoyAutoTires`;
  const desc = oneLine(post.body, 155) || post.title;
  const image = (post.image_urls || [])[0];
  const ld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: post.title, description: desc, url: link,
    datePublished: post.created_at, ...(image ? { image } : {}),
    author: { '@type': 'Organization', name: 'BoyAutoTires', url: ORIGIN },
    publisher: { '@type': 'Organization', name: 'BoyAutoTires', url: ORIGIN },
  }).replace(/</g, '\\u003c'); // keep a </script> in a title from closing the tag

  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element: e => e.setAttribute('href', link) })
    .on('meta[property="og:url"]', { element: e => e.setAttribute('content', link) })
    .on('meta[property="og:type"]', { element: e => e.setAttribute('content', 'article') })
    .on('meta[property="og:title"]', { element: e => e.setAttribute('content', title) })
    .on('meta[name="description"]', { element: e => e.setAttribute('content', desc) })
    .on('meta[property="og:description"]', { element: e => e.setAttribute('content', desc) })
    .on('meta[property="og:image"]', { element: e => { if (image) e.setAttribute('content', image); } })
    .on('title', { element: e => e.setInnerContent(title) })
    .on('head', { element: e => e.append(`<script type="application/ld+json">${ld}</script>`, { html: true }) })
    .transform(page);
}

// /sitemap.xml: the static sitemap plus one entry per blog article and per product
async function sitemap(request, env, url) {
  const res = await env.ASSETS.fetch(request);
  const xml = await res.text();
  const [posts, products] = await Promise.all([
    supabaseRows('posts?select=id,created_at&type=eq.blog&order=created_at.desc'),
    supabaseRows('products?select=id,category,created_at&order=created_at.desc'),
  ]);
  const productEntries = products.filter(p => PATH_BY_CATEGORY[p.category]).map(p =>
    `  <url><loc>${ORIGIN}${PATH_BY_CATEGORY[p.category]}?p=${p.id}</loc><lastmod>${String(p.created_at).slice(0, 10)}</lastmod></url>\n`).join('');
  const entries = productEntries + posts.map(p =>
    `  <url><loc>${ORIGIN}/blog?a=${p.id}</loc><lastmod>${String(p.created_at).slice(0, 10)}</lastmod></url>
`).join('');
  return new Response(xml.replace('</urlset>', entries + '</urlset>'), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

// ---------- photos and videos through Cloudflare's cache ----------
// /img/<bucket>/<file> = Supabase public storage file. Upload names are never reused
// (admin gives every upload a new name), so a copy can be kept for a year.
// Videos are asked for in pieces (Range: bytes=...) so people can seek; the whole file
// is cached once and each piece is cut from that copy (portfolio videos are <= 20 MB).
const MEDIA_RE = /^[\w.\-\/%]+\.(jpe?g|png|webp|gif|avif|mp4|webm|mov|m4v)$/i;

async function cachedImage(request, url, ctx) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('GET only', { status: 405 });
  const path = url.pathname.slice('/img/'.length);
  if (!MEDIA_RE.test(path) || path.includes('..')) return new Response('Not found', { status: 404 });

  const cache = caches.default;
  const key = new Request(`${ORIGIN}/img/${path}`);
  let full = await cache.match(key);
  if (!full) {
    const upstream = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${path}`);
    if (!upstream.ok) return new Response('Not found', { status: upstream.status === 404 ? 404 : 502 });
    full = new Response(upstream.body, upstream);
    full.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    full.headers.set('Accept-Ranges', 'bytes');
    full.headers.delete('Set-Cookie');
    ctx.waitUntil(cache.put(key, full.clone()));
  }

  const range = request.headers.get('Range');
  if (!range) return request.method === 'HEAD' ? new Response(null, full) : full;

  // serve just the asked-for piece of the cached copy
  const body = await full.arrayBuffer();
  const size = body.byteLength;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  let start, end;
  if (m && m[1] !== '') { start = Number(m[1]); end = m[2] !== '' ? Math.min(Number(m[2]), size - 1) : size - 1; }
  else if (m && m[2] !== '') { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  if (start === undefined || start > end || start >= size) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  const headers = new Headers(full.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(request.method === 'HEAD' ? null : body.slice(start, end + 1), { status: 206, headers });
}

// ---------- product pages for search engines ----------
const CATEGORY_BY_PATH = { '/tires': 'tires', '/alloywheel': 'wheels', '/shock': 'shock', '/brake': 'brake', '/other': 'other' };
const PATH_BY_CATEGORY = Object.fromEntries(Object.entries(CATEGORY_BY_PATH).map(([path, cat]) => [cat, path]));
const CATEGORY_TH = { tires: 'ยางรถยนต์', wheels: 'ล้อแม็ก', shock: 'โช้คอัพ', brake: 'เบรก', other: 'อุปกรณ์รถยนต์' };
const STORAGE_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/`;
const imgUrl = u => (u && u.startsWith(STORAGE_PREFIX) ? `${ORIGIN}/img/${u.slice(STORAGE_PREFIX.length)}` : u);

// /tires?p=<id>: the category page with the product's canonical URL, title,
// description, share image and Product data (name, photo, price, stock).
async function productPage(request, env, url) {
  const page = await env.ASSETS.fetch(new Request(new URL(url.pathname, url), request));
  const id = url.searchParams.get('p');
  const category = CATEGORY_BY_PATH[url.pathname];
  if (!/^[0-9a-f-]{36}$/i.test(id)) return page;
  const [p] = await supabaseRows(
    `products?select=id,category,name,series,model,size,color,description,price,in_stock,image_url,image_urls&id=eq.${id}`);
  if (!p || p.category !== category) return page;

  const link = `${ORIGIN}${url.pathname}?p=${p.id}`;
  const name = [p.name, p.series, p.model, p.size].filter(Boolean).join(' ');
  const title = `${name} - ${CATEGORY_TH[category]} บางใหญ่ | BoyAutoTires`;
  const priceText = p.price != null ? `ราคา ${Number(p.price).toLocaleString('en-US')} บาท` : 'สอบถามราคา';
  const desc = oneLine(`${name} ${priceText} ${p.description || ''} ที่ร้าน BoyAutoTires ถ.กาญจนาภิเษก บางใหญ่ นนทบุรี`, 155);
  const images = (p.image_urls && p.image_urls.length ? p.image_urls : [p.image_url]).filter(Boolean).map(imgUrl);
  const ld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product',
    name, url: link, ...(images.length ? { image: images } : {}),
    ...(p.description ? { description: oneLine(p.description, 500) } : {}),
    brand: { '@type': 'Brand', name: p.name.split(' ')[0] },
    category: CATEGORY_TH[category],
    ...(p.price != null ? { offers: {
      '@type': 'Offer', url: link, priceCurrency: 'THB', price: Number(p.price),
      availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'BoyAutoTires' },
    } } : {}),
  }).replace(/</g, '\\u003c');

  return new HTMLRewriter()
    .on('link[rel="canonical"]', { element: e => e.setAttribute('href', link) })
    .on('meta[property="og:url"]', { element: e => e.setAttribute('content', link) })
    .on('meta[property="og:type"]', { element: e => e.setAttribute('content', 'product') })
    .on('meta[property="og:title"]', { element: e => e.setAttribute('content', title) })
    .on('meta[name="description"]', { element: e => e.setAttribute('content', desc) })
    .on('meta[property="og:description"]', { element: e => e.setAttribute('content', desc) })
    .on('meta[property="og:image"]', { element: e => { if (images[0]) e.setAttribute('content', images[0]); } })
    .on('title', { element: e => e.setInnerContent(title) })
    .on('head', { element: e => e.append(`<script type="application/ld+json">${ld}</script>`, { html: true }) })
    .transform(page);
}

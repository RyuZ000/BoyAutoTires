/* ============================================================
   Promotions (/promotions) and blog articles (/blog), table "posts"
   (supabase-add-posts.sql). Shared by those pages and the admin page.
   ============================================================ */

// a promotion with an end date stops showing the day after it (Bangkok time)
function postIsLive(p) {
  if (!p.ends_on) return true;
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }); // YYYY-MM-DD
  return p.ends_on >= today;
}

// the order staff set by dragging in admin (sort_order); newest first otherwise
function sortPosts(list) {
  return [...list].sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity)
    || String(b.created_at || '').localeCompare(String(a.created_at || '')));
}

// "10 ต.ค. 2569" / "10 Oct 2026"; takes a timestamp or a YYYY-MM-DD date
function formatPostDate(value) {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00+07:00`) : new Date(value);
  return d.toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'th-TH',
    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' });
}

// Public page: fills #posts-list with the posts of one type, or shows #posts-empty.
// Photos open in the lightbox from js/products.js.
function initPostsPage(type) {
  let posts = null;

  function render() {
    const listEl = document.getElementById('posts-list');
    const live = sortPosts((posts || []).filter(postIsLive));
    document.getElementById('posts-empty').hidden = posts === null || live.length > 0;
    listEl.innerHTML = live.map(p => {
      const images = p.image_urls || [];
      galleryData[p.id] = { name: p.title, images };
      return `
      <article class="post-card">
        ${images.length ? `
        <button type="button" class="post-cover" onclick="openLightbox('${p.id}')">
          <img src="${escapeHtml(images[0])}" alt="${escapeHtml(p.title)}" loading="lazy">
          ${images.length > 1 ? `<span class="product-img-count">📷 ${images.length}</span>` : ''}
        </button>` : ''}
        <div class="post-content">
          <div class="post-meta">
            <time>${formatPostDate(p.created_at)}</time>
            ${p.ends_on ? `<span class="post-until">⏰ ${t('post_until')} ${formatPostDate(p.ends_on)}</span>` : ''}
          </div>
          <h2>${escapeHtml(p.title)}</h2>
          ${p.body ? `<p class="post-text">${escapeHtml(p.body)}</p>` : ''}
          ${images.length > 1 ? `<span class="post-photos-hint">📷 ${t('post_photos_hint').replace('{n}', images.length)}</span>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  window.onLanguageChange = render;
  document.addEventListener('DOMContentLoaded', async () => {
    const { data, error } = await sb.from('posts').select('*').eq('type', type);
    if (error) console.error('posts error:', error);
    posts = data || []; // on an error the page just shows its "nothing yet" box
    render();
  });
}

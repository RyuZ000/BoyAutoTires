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

// Blog card: cover, date, title and a short teaser; the whole card links to the article
function blogCardHtml(p) {
  const cover = (p.image_urls || [])[0];
  return `
      <a class="blog-card" href="/blog?a=${encodeURIComponent(p.id)}">
        <div class="blog-card-img">${cover ? `<img src="${escapeHtml(cover)}" alt="" loading="lazy">` : '<span>📝</span>'}</div>
        <div class="blog-card-body">
          <time>${formatPostDate(p.created_at)}</time>
          <h2>${escapeHtml(p.title)}</h2>
          ${p.body ? `<p>${escapeHtml(p.body)}</p>` : ''}
          <span class="blog-card-more">${t('blog_read_more')}</span>
        </div>
      </a>`;
}

// Blog article page (/blog?a=<id>): back link, cover, full text, every photo, contact buttons
function blogArticleHtml(p) {
  const images = p.image_urls || [];
  galleryData[p.id] = { name: p.title, images };
  return `
      <a class="blog-back" href="/blog">${t('blog_back')}</a>
      <article class="blog-article">
        ${images.length ? `
        <button type="button" class="post-cover" onclick="openLightbox('${p.id}')">
          <img src="${escapeHtml(images[0])}" alt="${escapeHtml(p.title)}">
        </button>` : ''}
        <div class="post-content">
          <div class="post-meta"><time>${formatPostDate(p.created_at)}</time></div>
          <h1>${escapeHtml(p.title)}</h1>
          ${p.body ? `<p class="post-text">${escapeHtml(p.body)}</p>` : ''}
          ${images.length ? `
          <div class="blog-photos">
            ${images.map((src, i) => `<button type="button" onclick="openLightbox('${p.id}', ${i})"><img src="${escapeHtml(src)}" alt="" loading="lazy"></button>`).join('')}
          </div>
          <span class="post-photos-hint">📷 ${t('blog_photos_hint')}</span>` : ''}
        </div>
      </article>
      <div class="blog-cta">
        <div>
          <h2>${t('cta_band_title')}</h2>
          <p>${t('cta_band_sub')}</p>
        </div>
        <div class="blog-cta-btns">
          <a class="blog-cta-call" href="tel:${SITE_CONTACT.phoneTel}">${t('cta_call')}</a>
          <a class="blog-cta-line" href="${SITE_CONTACT.line}" target="_blank" rel="noopener">${t('cta_line')}</a>
        </div>
      </div>`;
}

// Public page: fills #posts-list with the posts of one type, or shows #posts-empty.
// Promotions are listed in full; the blog shows a card grid and one article per ?a=<id>.
// Photos open in the lightbox from js/products.js.
function initPostsPage(type) {
  let posts = null;
  const articleId = type === 'blog' ? new URLSearchParams(location.search).get('a') : null;

  function render() {
    const listEl = document.getElementById('posts-list');
    if (type === 'blog' && posts !== null) {
      const live = sortPosts(posts.filter(postIsLive));
      const article = articleId && live.find(p => String(p.id) === articleId);
      document.querySelector('.page-hero').hidden = !!article;
      document.getElementById('posts-empty').hidden = !!article || live.length > 0;
      listEl.className = article ? 'blog-article-wrap' : 'blog-grid';
      listEl.innerHTML = article ? blogArticleHtml(article) : live.map(blogCardHtml).join('');
      document.title = (article ? article.title : t('menu_blog')) + ' - BoyAutoTires';
      return;
    }
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

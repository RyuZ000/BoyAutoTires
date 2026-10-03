/* ============================================================
   Loads and renders products for a given category on the
   public-facing pages (tires.html, alloywheel.html, ...)
   Requires supabase-config.js to be loaded first (defines `sb`)
   ============================================================ */

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// older rows only have image_url; newer rows have image_urls
function getProductImages(p) {
  if (p.image_urls && p.image_urls.length) return p.image_urls;
  return p.image_url ? [p.image_url] : [];
}

// product id -> { name, images }, filled on render, read by the lightbox
const galleryData = {};

function renderProductCards(data, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!data || data.length === 0) {
    grid.innerHTML = `<p class="products-status">${t('products_empty')}</p>`;
    return;
  }

  grid.innerHTML = data.map(p => {
    const images = getProductImages(p);
    galleryData[p.id] = { name: p.name, images };
    return `
    <div class="product-card ${p.in_stock ? '' : 'out-of-stock'}">
      ${images.length
        ? `<button type="button" class="product-img-btn" onclick="openLightbox('${p.id}')">
             <img src="${escapeHtml(images[0])}" alt="${escapeHtml(p.name)}" loading="lazy">
             ${images.length > 1 ? `<span class="product-img-count">📷 ${images.length}</span>` : ''}
           </button>`
        : `<div class="product-noimg">ไม่มีรูป</div>`}
      <div class="product-body">
        <h3>${escapeHtml(p.name)}</h3>
        ${p.size ? `<span class="product-size-badge">${escapeHtml(p.size)}</span>` : ''}
        ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ''}
        <div class="product-footer">
          ${p.price !== null && p.price !== '' ? `<span class="product-price">฿${Number(p.price).toLocaleString()}</span>` : '<span></span>'}
          <span class="product-stock ${p.in_stock ? '' : 'stock-out'}">${p.in_stock ? t('in_stock') : t('out_of_stock')}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

/* ---------------- Lightbox (full-screen image viewer) ---------------- */

let lbImages = [];
let lbIndex = 0;
let lbTouchX = null;

function ensureLightbox() {
  let lb = document.getElementById('lightbox');
  if (lb) return lb;

  lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button type="button" class="lb-btn lb-close" onclick="closeLightbox()">×</button>
    <button type="button" class="lb-btn lb-prev" onclick="stepLightbox(-1)">‹</button>
    <img class="lb-img" alt="">
    <button type="button" class="lb-btn lb-next" onclick="stepLightbox(1)">›</button>
    <div class="lb-caption"></div>
  `;
  // click on the dark background (not the image/buttons) closes it
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (lbTouchX === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchX;
    lbTouchX = null;
    if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
  });
  document.body.appendChild(lb);
  return lb;
}

function openLightbox(productId) {
  const product = galleryData[productId];
  if (!product || !product.images.length) return;
  lbImages = product.images;
  lbIndex = 0;

  const lb = ensureLightbox();
  lb.querySelector('.lb-close').setAttribute('aria-label', t('lb_close'));
  lb.querySelector('.lb-prev').setAttribute('aria-label', t('lb_prev'));
  lb.querySelector('.lb-next').setAttribute('aria-label', t('lb_next'));
  lb.querySelector('.lb-img').alt = product.name || '';
  lb.dataset.name = product.name || '';
  lb.classList.toggle('single', lbImages.length < 2);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  showLightboxImage();
}

function showLightboxImage() {
  const lb = document.getElementById('lightbox');
  lb.querySelector('.lb-img').src = lbImages[lbIndex];
  const counter = lbImages.length > 1 ? ` · ${lbIndex + 1} / ${lbImages.length}` : '';
  lb.querySelector('.lb-caption').textContent = lb.dataset.name + counter;
}

function stepLightbox(dir) {
  if (lbImages.length < 2) return;
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  showLightboxImage();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') stepLightbox(-1);
  else if (e.key === 'ArrowRight') stepLightbox(1);
});

async function loadProducts(category, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = `<p class="products-status">${t('products_loading')}</p>`;

  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    grid.innerHTML = `<p class="products-status">${t('products_error')}</p>`;
    console.error('loadProducts error:', error);
    return;
  }

  renderProductCards(data, gridId);
}

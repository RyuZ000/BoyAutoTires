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

function renderProductCards(data, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!data || data.length === 0) {
    grid.innerHTML = `<p class="products-status">${t('products_empty')}</p>`;
    return;
  }

  grid.innerHTML = data.map(p => `
    <div class="product-card ${p.in_stock ? '' : 'out-of-stock'}">
      ${p.image_url
        ? `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">`
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
  `).join('');
}

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

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

async function loadProducts(category, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = '<p class="products-status">กำลังโหลดสินค้า...</p>';

  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    grid.innerHTML = '<p class="products-status">โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่ภายหลัง</p>';
    console.error('loadProducts error:', error);
    return;
  }

  if (!data || data.length === 0) {
    grid.innerHTML = '<p class="products-status">ยังไม่มีสินค้าในหมวดนี้</p>';
    return;
  }

  grid.innerHTML = data.map(p => `
    <div class="product-card ${p.in_stock ? '' : 'out-of-stock'}">
      ${p.image_url
        ? `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">`
        : `<div class="product-noimg">ไม่มีรูป</div>`}
      <div class="product-body">
        <h3>${escapeHtml(p.name)}</h3>
        ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ''}
        <div class="product-footer">
          ${p.price !== null && p.price !== '' ? `<span class="product-price">฿${Number(p.price).toLocaleString()}</span>` : '<span></span>'}
          <span class="product-stock ${p.in_stock ? '' : 'stock-out'}">${p.in_stock ? 'มีสินค้า' : 'สินค้าหมด'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

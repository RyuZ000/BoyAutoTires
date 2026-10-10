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

// wheels: "Series · Model" under the brand name (either may be empty)
function wheelLine(p) {
  return [p.series, p.model].filter(Boolean).join(' · ');
}

// older rows only have image_url; newer rows have image_urls
function getProductImages(p) {
  if (p.image_urls && p.image_urls.length) return p.image_urls;
  return p.image_url ? [p.image_url] : [];
}

// query is already trimmed + lowercased. A query of only digits, spaces, "/", "-"
// or "r" (e.g. "2656018", "265 60 18", "265/60r18") is also matched against the
// size's digits, so "2656018" finds "265/60R18" and "265/60/R18".
function productMatches(p, query) {
  if (!query) return true;
  // textMatches (js/search.js) also ignores spaces: "bfgoodrich" finds "BF Goodrich"
  if (textMatches(p.name, query) || textMatches(p.size, query) || textMatches(p.model, query) || textMatches(p.series, query) || textMatches(p.color, query)) return true;
  if (!/^[\d\s\/\-r.]+$/.test(query)) return false;
  const digits = query.replace(/\D/g, '');
  return digits !== '' && (p.size || '').replace(/\D/g, '').includes(digits);
}

// While the customer types only digits, shows them as a tire size:
// "2656018" -> "265/60/R18". Anything with letters (a product name) is left alone.
// Separators are only added once the next digit is typed, so backspace still works.
// isActive (optional) turns the mask off, e.g. when another category is selected.
function attachTireSizeMask(input, isActive = () => true) {
  if (!input) return;
  input.addEventListener('input', () => {
    if (!isActive()) return;
    if (input.selectionStart !== input.value.length) return; // editing mid-text: don't move the caret
    if (!/^[\d\s\/r]*$/i.test(input.value)) return;
    const d = input.value.replace(/\D/g, '').slice(0, 7);
    let out = d.slice(0, 3);
    if (d.length > 3) out += '/' + d.slice(3, 5);
    if (d.length > 5) out += '/R' + d.slice(5, 7);
    if (out !== input.value) input.value = out;
  });
}

// product id -> { name, images }, filled on render, read by the lightbox
const galleryData = {};

// options.link: the whole card links to the product on its category page
// (/shock?p=<id>) instead of opening the photo viewer - used on the home page
function renderProductCards(data, gridId, options = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!data || data.length === 0) {
    grid.innerHTML = `<p class="products-status">${t('products_empty')}</p>`;
    return;
  }

  grid.innerHTML = data.map(p => {
    const images = getProductImages(p);
    const hasPrice = p.price !== null && p.price !== undefined && p.price !== '';
    galleryData[p.id] = { name: p.name, images };
    // SITE_NAV comes from js/layout.js; its page names match products.category
    const page = options.link && SITE_NAV.find(n => n.page === p.category);
    const tag = page ? 'a' : 'article';
    const imgInner = images.length
      ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(p.name)}" loading="lazy">
         ${images.length > 1 ? `<span class="product-img-count">📷 ${images.length}</span>` : ''}`
      : '';
    return `
    <${tag} id="product-${p.id}" class="product-card ${p.in_stock ? '' : 'out-of-stock'}"${page ? ` href="${page.href}?p=${encodeURIComponent(p.id)}"` : ''}>
      ${!images.length
        ? `<div class="product-noimg"><span>📷</span>${escapeHtml(t('no_image'))}</div>`
        : page
          ? `<div class="product-img-btn">${imgInner}</div>`
          : `<button type="button" class="product-img-btn" onclick="openLightbox('${p.id}')">${imgInner}</button>`}
      <div class="product-body">
        ${p.size ? `<span class="product-size-badge">${escapeHtml(p.size)}</span>` : ''}
        <h3>${escapeHtml(p.name)}</h3>
        ${wheelLine(p) ? `<p class="product-model">${escapeHtml(wheelLine(p))}</p>` : ''}
        ${p.color ? `<p class="product-color">${escapeHtml(t('field_color'))}: ${escapeHtml(p.color)}</p>` : ''}
        ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ''}
        <div class="product-footer">
          ${hasPrice
            ? `<span class="product-price">฿${Number(p.price).toLocaleString()}</span>`
            : `<span class="product-price ask">${t('price_ask')}</span>`}
          <span class="product-stock ${p.in_stock ? '' : 'stock-out'}">${p.in_stock ? t('in_stock') : t('out_of_stock')}</span>
        </div>
        ${page ? `<span class="product-view">${t('view_product')}</span>` : ''}
      </div>
    </${tag}>
  `;
  }).join('');
}

/* ---------------- Category page: chips + search + sort ---------------- */

// Wires up a category page (tires / wheels / shock / brake / other). The page needs
// #cat-chips, #shop-search, #shop-count and #products-grid.
// Products follow the order staff set by dragging in admin (products.sort_order);
// defaultSort ('newest', 'size_asc', ...) only orders products without one.
// options.filter(p)       extra filter on top of search (e.g. the shock sidebar)
// options.onLoad(products) called once products are fetched
// Returns { render } so the page can re-render when its own filters change.
function initProductPage(category, defaultSort, options = {}) {
  const searchEl = document.getElementById('shop-search');
  let allProducts = [];
  let loaded = false;

  function renderChips() {
    // SITE_NAV comes from js/layout.js
    document.getElementById('cat-chips').innerHTML = SITE_NAV
      .filter(n => n.product)
      .map(n => `<a href="${n.href}" class="cat-chip ${n.page === document.body.dataset.page ? 'active' : ''}">${t(n.key)}</a>`)
      .join('');
  }

  function compare(a, b, field, dir) {
    const ao = a.sort_order ?? null;
    const bo = b.sort_order ?? null;
    if (ao !== null || bo !== null) {
      if (ao === null) return 1;
      if (bo === null) return -1;
      if (ao !== bo) return ao - bo;
    }
    if (field === 'newest') {
      return String(b.created_at || '').localeCompare(String(a.created_at || ''));
    }
    if (field === 'price') {
      // products with no price set are always pushed to the end
      const ap = a.price;
      const bp = b.price;
      if (ap == null && bp == null) return 0;
      if (ap == null) return 1;
      if (bp == null) return -1;
      return (ap - bp) * dir;
    }
    const av = (field === 'size' ? a.size : a.name) || '';
    const bv = (field === 'size' ? b.size : b.name) || '';
    return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * dir;
  }

  function render() {
    if (!loaded) return;
    const query = searchEl.value.trim().toLowerCase();
    const [field, dirName] = defaultSort.split('_');
    const dir = dirName === 'desc' ? -1 : 1;

    const list = allProducts
      .filter(p => productMatches(p, query) && (!options.filter || options.filter(p)))
      .sort((a, b) => compare(a, b, field, dir));

    document.getElementById('shop-count').textContent = `${list.length} ${t('list_count_suffix')}`;

    if ((query || options.filter) && list.length === 0 && allProducts.length) {
      document.getElementById('products-grid').innerHTML = `<p class="products-status">${t('search_no_results')}</p>`;
      return;
    }
    renderProductCards(list, 'products-grid');
    focusLinkedProduct();
  }

  // home page cards link here as /shock?p=<id>: scroll to that card and flash it once
  let focusId = new URLSearchParams(location.search).get('p');
  function focusLinkedProduct() {
    if (!focusId) return;
    const card = document.getElementById(`product-${focusId}`);
    focusId = null;
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('product-focus');
    setTimeout(() => card.classList.remove('product-focus'), 3000);
  }

  async function fetchProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `<p class="products-status">${t('products_loading')}</p>`;

    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      grid.innerHTML = `<p class="products-status">${t('products_error')}</p>`;
      console.error('initProductPage error:', error);
      return;
    }

    allProducts = data || [];
    loaded = true;
    if (options.onLoad) options.onLoad(allProducts);
    render();
  }

  // must run before render so the search sees the formatted size
  if (category === 'tires') attachTireSizeMask(searchEl);
  searchEl.addEventListener('input', render);

  // search box on the home page links here as /tires?q=...
  const initialQuery = new URLSearchParams(location.search).get('q');
  if (initialQuery) searchEl.value = initialQuery;

  window.onLanguageChange = () => {
    renderChips();
    if (options.onLanguageChange) options.onLanguageChange();
    render();
  };

  renderChips();
  fetchProducts();
  return { render };
}

/* ---------------- Category page with a filter sidebar (shock, wheels) ---------------- */

// The page needs the sidebar markup: #filter-options, #price-min, #price-max,
// #filter-clear, #filter-toggle, #shop-filters (see shock.html).
// getOptions(products) -> [{ value, label, count }]; matches(product, value) -> bool
function initFilteredProductPage(category, defaultSort, { getOptions, matches }) {
  const optionsEl = document.getElementById('filter-options');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  let selected = '';
  let products = [];

  function filter(p) {
    if (selected && !matches(p, selected)) return false;
    const min = priceMin.value === '' ? null : Number(priceMin.value);
    const max = priceMax.value === '' ? null : Number(priceMax.value);
    if (min === null && max === null) return true;
    if (p.price == null) return false; // "ask for price" items can't match a price range
    return (min === null || p.price >= min) && (max === null || p.price <= max);
  }

  function renderOptions() {
    const options = [{ value: '', label: t('filter_all'), count: products.length }, ...getOptions(products)];
    if (!options.some(o => o.value === selected)) selected = '';
    optionsEl.innerHTML = options.map(o => `<label class="filter-option">
        <input type="radio" name="filter-option" value="${escapeHtml(o.value)}" ${o.value === selected ? 'checked' : ''}>
        <span>${escapeHtml(o.label)}</span><span class="filter-count">${o.count}</span>
      </label>`).join('');
  }

  const page = initProductPage(category, defaultSort, {
    filter,
    onLoad: list => { products = list; renderOptions(); },
    onLanguageChange: renderOptions,
  });

  optionsEl.addEventListener('change', e => { selected = e.target.value; page.render(); });
  priceMin.addEventListener('input', () => page.render());
  priceMax.addEventListener('input', () => page.render());
  document.getElementById('filter-clear').onclick = () => {
    selected = '';
    priceMin.value = '';
    priceMax.value = '';
    renderOptions();
    page.render();
  };
  // phones: the sidebar is hidden behind the "filter" button
  const toggle = document.getElementById('filter-toggle');
  toggle.onclick = () => {
    const open = document.getElementById('shop-filters').classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  };
  renderOptions();
}

/* ---------------- Lightbox (full-screen viewer) ---------------- */
// A horizontal strip of slides that people swipe (or trackpad-scroll) through.
// No arrow buttons: a "swipe" hint and dots show there is more to the right.
// galleryData[id] = { name, images: [url], names?: [caption], types?: ['photo'|'video'] }

let lbItems = [];   // { url, type, name }
let lbIndex = 0;
let lbWheelLock = false;

function ensureLightbox() {
  let lb = document.getElementById('lightbox');
  if (lb) return lb;

  lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button type="button" class="lb-btn lb-close" onclick="closeLightbox()">×</button>
    <div class="lb-track"></div>
    <div class="lb-hint"><span class="lb-hint-text"></span> <span class="lb-hint-arrow">›››</span></div>
    <div class="lb-footer">
      <div class="lb-caption"></div>
      <div class="lb-dots"></div>
    </div>
  `;
  const track = lb.querySelector('.lb-track');
  // clicking the dark area around a photo closes the viewer
  track.addEventListener('click', e => { if (e.target.classList.contains('lb-slide')) closeLightbox(); });
  track.addEventListener('scroll', () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== lbIndex) {
      lbIndex = i;
      lb.classList.add('swiped'); // they found it, hide the hint
      updateLightboxInfo();
    }
  }, { passive: true });
  // a normal mouse wheel scrolls vertically; turn it into next / previous
  track.addEventListener('wheel', e => {
    if (lbItems.length < 2 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpads scroll sideways natively
    e.preventDefault();
    if (lbWheelLock) return;
    lbWheelLock = true;
    setTimeout(() => { lbWheelLock = false; }, 450);
    stepLightbox(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  document.body.appendChild(lb);
  return lb;
}

function openLightbox(productId, start = 0) {
  const product = galleryData[productId];
  if (!product || !product.images.length) return;
  lbItems = product.images.map((url, i) => ({
    url,
    type: (product.types && product.types[i]) || 'photo',
    name: product.names ? product.names[i] || '' : product.name || '',
  }));
  lbIndex = start;

  const lb = ensureLightbox();
  lb.querySelector('.lb-close').setAttribute('aria-label', t('lb_close'));
  // phones/tablets swipe; computers use the mouse wheel or arrow keys
  const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  lb.querySelector('.lb-hint-text').textContent = t(touch ? 'lb_swipe_hint' : 'lb_desktop_hint');
  lb.querySelector('.lb-track').innerHTML = lbItems.map(item => `
    <div class="lb-slide">
      ${item.type === 'video'
        ? `<video class="lb-media" src="${escapeHtml(item.url)}#t=0.1" controls playsinline preload="metadata"></video>`
        : `<img class="lb-media" src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name)}">`}
    </div>`).join('');
  lb.querySelector('.lb-dots').innerHTML = lbItems.length > 1
    ? lbItems.map((_, i) => `<button type="button" aria-label="${i + 1} / ${lbItems.length}" onclick="goToLightbox(${i})"></button>`).join('')
    : '';
  lb.classList.toggle('single', lbItems.length < 2);
  lb.classList.remove('swiped');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  const track = lb.querySelector('.lb-track');
  track.scrollLeft = track.clientWidth * lbIndex;
  updateLightboxInfo();
}

function updateLightboxInfo() {
  const lb = document.getElementById('lightbox');
  const counter = lbItems.length > 1 ? ` · ${lbIndex + 1} / ${lbItems.length}` : '';
  lb.querySelector('.lb-caption').textContent = (lbItems[lbIndex] ? lbItems[lbIndex].name : '') + counter;
  lb.querySelectorAll('.lb-dots button').forEach((d, i) => d.classList.toggle('active', i === lbIndex));
  // only the visible slide's video may keep playing
  lb.querySelectorAll('.lb-slide').forEach((slide, i) => {
    const video = slide.querySelector('video');
    if (video && i !== lbIndex) video.pause();
  });
}

function goToLightbox(i) {
  const track = document.querySelector('#lightbox .lb-track');
  track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
}

function stepLightbox(dir) {
  if (lbItems.length < 2) return;
  goToLightbox((lbIndex + dir + lbItems.length) % lbItems.length);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.querySelectorAll('video').forEach(v => v.pause());
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

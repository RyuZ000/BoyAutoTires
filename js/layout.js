/* ============================================================
   Shared header / footer / floating contact buttons.
   Put <div id="site-header"></div> and <div id="site-footer"></div>
   in the page, set <body data-page="tires"> (home|wheels|tires|shock|brake|other|portfolio|promo|about|blog|contact)
   and load this script BEFORE auth.js and i18n.js.
   ============================================================ */

const SITE_CONTACT = {
  phone: '081-160-0060',
  phoneTel: '+66811600060',
  phone2: '081-160-0020',
  phone2Tel: '+66811600020',
  line: 'https://line.me/ti/p/yWkHxGNvL2',
  messenger: 'https://m.me/BOYAUTOTIRES',
  // contact page (/contact). mapQuery is what Google Maps searches for to place the pin;
  // address ({ th, en }) is shown only when filled in. Opening hours live in js/store-status.js.
  mapQuery: 'BoyAutoTires',
  // opens the shop on Google Maps, where its reviews are
  reviews: 'https://www.google.com/maps/search/?api=1&query=BoyAutoTires',
  address: {
    th: '9, 32 ถ.กาญจนาภิเษก ต.บางม่วง อ.บางใหญ่ จ.นนทบุรี 11140',
    en: '9, 32 Kanchanaphisek Rd, Bang Muang, Bang Yai, Nonthaburi 11140',
  },
};

const MESSENGER_ICON = `<svg viewBox="0 0 36 36" aria-hidden="true"><path fill="#fff" d="M18 4C10.27 4 4 9.8 4 16.96c0 4.07 2.03 7.7 5.2 10.08V32l4.75-2.6c1.27.35 2.6.54 4.05.54 7.73 0 14-5.8 14-12.98C32 9.8 25.73 4 18 4zm1.39 17.47l-3.57-3.8-6.96 3.8 7.66-8.13 3.65 3.8 6.88-3.8-7.66 8.13z"/></svg>`;

// line icons (lucide, 1.5 stroke) for the contact buttons; sized and coloured by .ico in css/theme.css
const ICO = d => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const ICON_PHONE = ICO('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>');
const ICON_LINE = ICO('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>');
const ICON_CHAT = ICO('<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>');

// every line icon the public pages use: icon('pin') gives <svg class="ico">; sized and coloured in css/theme.css
const ICONS = {
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  chat: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  tire: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  wheel: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 10V2.5M13.9 12.6l7.1 2.3M10.1 12.6 3 14.9M13.2 13.6l4.4 6M10.8 13.6l-4.4 6"/>',
  spring: '<path d="M8 3h8M8 21h8M12 3v2l5 1.5-10 3 10 3-10 3 5 1.5v4"/>',
  brake: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 5.5h.01M18.5 12h.01M12 18.5h.01M5.5 12h.01"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  video: '<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  tag: '<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
};
const icon = name => ICO(ICONS[name]);

const SITE_SOCIAL = [
  { title: 'Facebook', href: 'https://www.facebook.com/BOYAUTOTIRES/?locale=th_TH', img: 'Photo Social/Fb.jpg' },
  { title: 'Instagram', href: 'https://www.instagram.com/boyautotires', img: 'Photo Social/IG.jpg' },
  { title: 'TikTok', href: 'https://www.tiktok.com/@boyautotires', img: 'Photo Social/Tiktok.jpg' },
  { title: 'YouTube', href: 'https://www.youtube.com/@BoyAutoTires', img: 'Photo Social/Youtube.jpg' },
  { title: 'LINE', href: SITE_CONTACT.line, img: 'Photo Social/Line.jpg' },
  { title: 'Shopee', href: 'https://shopee.co.th/shop/1724036905', img: 'Photo Social/Shopee.jpg' },
];

// product: true = a shop category (shown as category chips and in the footer's product list)
// Items without href are shown as "coming soon" (no page yet).
// service landing pages (one per job, written for "<service> บางใหญ่" searches);
// shown as a "Services ▾" dropdown next to "Products ▾", in the ☰ menu and in the footer
const SITE_SERVICES = [
  { page: 'service-tires', href: '/service-tires', key: 'svc_nav_tires', icon: icon('tire') },
  { page: 'service-alignment', href: '/service-alignment', key: 'svc_nav_alignment', icon: icon('target') },
  { page: 'service-wheels', href: '/service-wheels', key: 'svc_nav_wheels', icon: icon('wheel') },
  { page: 'service-suspension', href: '/service-suspension', key: 'svc_nav_suspension', icon: icon('spring') },
  { page: 'service-brakes', href: '/service-brakes', key: 'svc_nav_brakes', icon: icon('brake') },
];

const SITE_NAV = [
  { page: 'home', href: '/', key: 'nav_home' },
  { page: 'wheels', href: '/alloywheel', key: 'nav_wheels', product: true, icon: icon('wheel') },
  { page: 'tires', href: '/tires', key: 'nav_tires', product: true, icon: icon('tire') },
  { page: 'shock', href: '/shock', key: 'nav_shock', product: true, icon: icon('spring') },
  { page: 'brake', href: '/brake', key: 'nav_brake', product: true, icon: icon('brake') },
  { page: 'other', href: '/other', key: 'nav_other', product: true, icon: icon('box') },
  { page: 'portfolio', href: '/portfolio', key: 'nav_portfolio' },
  { page: 'promo', href: '/promotions', key: 'menu_promo' },
  { page: 'about', href: '/about', key: 'menu_about' },
  { page: 'blog', href: '/blog', key: 'menu_blog' },
  { page: 'contact', href: '/contact', key: 'menu_contact' },
];

function renderSiteHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.page;
  const link = n => n.href
    ? `<a href="${n.href}" data-i18n="${n.key}" class="${n.page === current ? 'active' : ''}">${n.key}</a>`
    : `<span class="menu-soon"><span data-i18n="${n.key}">${n.key}</span><small data-i18n="menu_soon">เร็วๆ นี้</small></span>`;
  const productItems = SITE_NAV.filter(n => n.product);
  const firstProduct = SITE_NAV.indexOf(productItems[0]);
  // top bar: product pages sit in one "Products ▾" dropdown and service pages in "Services ▾"
  // right after it (each opens on hover or click)
  const dropdownHtml = (labelKey, items) => `
      <div class="nav-dropdown">
        <button type="button" class="nav-dropdown-btn ${items.some(n => n.page === current) ? 'active' : ''}" aria-expanded="false" aria-haspopup="true">
          <span data-i18n="${labelKey}">${labelKey}</span><span class="nav-caret" aria-hidden="true">▾</span>
        </button>
        <div class="nav-dropdown-menu">${items.map(link).join('')}</div>
      </div>`;
  const navLinks = SITE_NAV.map((n, i) => {
    if (!n.product) return link(n);
    if (i !== firstProduct) return '';
    return dropdownHtml('nav_products', productItems) + dropdownHtml('footer_services', SITE_SERVICES);
  }).join('');
  // ☰ menu on phones / iPad: product and service pages as icon tiles under "Products" / "Services" headings
  const tile = n => `<a href="${n.href}" class="menu-tile ${n.page === current ? 'active' : ''}">
      <span class="menu-tile-icon" aria-hidden="true">${n.icon}</span><span data-i18n="${n.key}">${n.key}</span></a>`;
  const menuNavLinks = SITE_NAV.map((n, i) => {
    if (!n.product) return link(n);
    if (i !== firstProduct) return '';
    return `
      <div class="site-menu-products">
        <span class="site-menu-heading" data-i18n="nav_products">nav_products</span>
        <div class="site-menu-grid">${productItems.map(tile).join('')}</div>
      </div>
      <div class="site-menu-products">
        <span class="site-menu-heading" data-i18n="footer_services">footer_services</span>
        <div class="site-menu-grid">${SITE_SERVICES.map(tile).join('')}</div>
      </div>`;
  }).join('');

  el.outerHTML = `
    <div class="topbar">
      <div class="container">
        <div class="topbar-contact">
          <a href="tel:${SITE_CONTACT.phoneTel}">${ICON_PHONE}<span>${SITE_CONTACT.phone}</span></a>
          <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" class="hide-sm">${ICON_LINE}<span data-i18n="cta_line">แอด LINE</span></a>
          <a href="${SITE_CONTACT.messenger}" target="_blank" rel="noopener" class="hide-sm">${ICON_CHAT}<span data-i18n="cta_messenger">แชท Messenger</span></a>
        </div>
        <div class="topbar-right">
          <div class="lang-switch">
            <button class="lang-btn" data-lang="th" onclick="setLanguage('th')">ไทย</button>
            <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
          </div>
          <div class="staff-corner">
            <a id="staff-login-link" href="/admin" class="staff-btn">${icon('lock')}<span data-i18n="staff_login">Staff Login</span></a>
            <a id="staff-admin-link" href="/admin" class="staff-btn" style="display:none;">${icon('wrench')}<span data-i18n="staff_admin">Admin Panel</span></a>
            <a id="staff-logout-link" href="#" class="staff-btn" style="display:none;" data-i18n="staff_logout" onclick="staffLogout(); return false;">Log out</a>
          </div>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container">
        <div class="header-left">
          <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Menu"
                  aria-expanded="false" aria-controls="site-menu">
            <span class="menu-bars" aria-hidden="true"><span></span><span></span><span></span></span>
          </button>
          <a href="/" class="logo"><span class="b">B</span>oyAuto<span class="t">Tires</span></a>
        </div>
        <nav class="main-nav">${navLinks}</nav>
        <a href="tel:${SITE_CONTACT.phoneTel}" class="header-cta">${ICON_PHONE}<span data-i18n="cta_call">โทรเลย</span></a>
        <div class="site-menu" id="site-menu" hidden>
          <div class="site-menu-inner">
            <nav class="site-menu-nav">${menuNavLinks}</nav>
            <div class="site-menu-cta">
              <a href="tel:${SITE_CONTACT.phoneTel}" class="contact-btn gold">${ICON_PHONE}<span data-i18n="cta_call">โทรเลย</span></a>
              <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" class="contact-btn line">${ICON_LINE}<span data-i18n="cta_line">แอด LINE</span></a>
              <a href="${SITE_CONTACT.messenger}" target="_blank" rel="noopener" class="contact-btn messenger">${ICON_CHAT}<span data-i18n="cta_messenger">แชท Messenger</span></a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  const header = el.ownerDocument.querySelector('.site-header');
  const setOpen = open => {
    // fill the screen below the header (the top bar above it may still be showing)
    if (open) menu.style.maxHeight = `${window.innerHeight - header.getBoundingClientRect().bottom}px`;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
    // hides the floating chat buttons (they'd cover the menu) and stops the page scrolling behind it
    document.body.classList.toggle('menu-open', open);
  };
  toggle.onclick = () => setOpen(menu.hidden);
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // "Products ▾" / "Services ▾": hovering opens one on a computer (CSS); a click / tap toggles it too
  document.querySelectorAll('.main-nav .nav-dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    const setDropdown = open => {
      dropdown.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    };
    btn.onclick = () => setDropdown(!dropdown.classList.contains('open'));
    document.addEventListener('click', e => { if (!dropdown.contains(e.target)) setDropdown(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setDropdown(false); });
  });
}

function renderSiteFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const navItems = SITE_NAV.filter(n => n.product)
    .map(n => `<li><a href="${n.href}" data-i18n="${n.key}">${n.key}</a></li>`).join('');
  const serviceItems = SITE_SERVICES
    .map(n => `<li><a href="${n.href}" data-i18n="${n.key}">${n.key}</a></li>`).join('');
  const social = SITE_SOCIAL.map(s =>
    `<a href="${s.href}" target="_blank" rel="noopener" title="${s.title}"><img src="${s.img}" alt="${s.title}"></a>`
  ).join('');

  el.outerHTML = `
    <footer class="site-footer" id="contact">
      <div class="container footer-grid">
        <div>
          <a href="/" class="logo"><span class="b">B</span>oyAuto<span class="t">Tires</span></a>
          <p data-i18n="tagline"></p>
          <div class="footer-social">${social}</div>
        </div>
        <div>
          <h4 data-i18n="footer_products">สินค้า</h4>
          <ul>${navItems}</ul>
        </div>
        <div>
          <h4 data-i18n="footer_services">บริการ</h4>
          <ul>${serviceItems}</ul>
        </div>
        <div>
          <h4 data-i18n="footer_contact">ติดต่อเรา</h4>
          <ul>
            <li><a href="tel:${SITE_CONTACT.phoneTel}">${ICON_PHONE}<span>${SITE_CONTACT.phone}</span></a></li>
            <li><a href="tel:${SITE_CONTACT.phone2Tel}">${ICON_PHONE}<span>${SITE_CONTACT.phone2}</span></a></li>
            <li><a href="${SITE_CONTACT.line}" target="_blank" rel="noopener">${ICON_LINE}<span data-i18n="cta_line">แอด LINE</span></a></li>
            <li><a href="${SITE_CONTACT.messenger}" target="_blank" rel="noopener">${ICON_CHAT}<span data-i18n="cta_messenger">แชท Messenger</span></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} BoyAutoTires. All rights reserved.</div>
    </footer>
    <div class="float-contact">
      <a href="${SITE_CONTACT.messenger}" target="_blank" rel="noopener" title="Messenger" class="fc-messenger">${MESSENGER_ICON}</a>
      <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" title="LINE"><img src="Photo Social/Line.jpg" alt="LINE"></a>
      <a href="tel:${SITE_CONTACT.phoneTel}" title="Call"><img src="Photo Social/Call.jpg" alt="Call"></a>
    </div>
  `;
}

renderSiteHeader();
renderSiteFooter();

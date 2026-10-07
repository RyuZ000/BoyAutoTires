/* ============================================================
   Shared header / footer / floating contact buttons.
   Put <div id="site-header"></div> and <div id="site-footer"></div>
   in the page, set <body data-page="tires"> (home|wheels|tires|shock|brake)
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
  // address / hours are shown only when filled in.
  mapQuery: 'BoyAutoTires',
  address: '',
  hours: '',
};

const MESSENGER_ICON = `<svg viewBox="0 0 36 36" aria-hidden="true"><path fill="#fff" d="M18 4C10.27 4 4 9.8 4 16.96c0 4.07 2.03 7.7 5.2 10.08V32l4.75-2.6c1.27.35 2.6.54 4.05.54 7.73 0 14-5.8 14-12.98C32 9.8 25.73 4 18 4zm1.39 17.47l-3.57-3.8-6.96 3.8 7.66-8.13 3.65 3.8 6.88-3.8-7.66 8.13z"/></svg>`;

const SITE_SOCIAL = [
  { title: 'Facebook', href: 'https://www.facebook.com/BOYAUTOTIRES/?locale=th_TH', img: 'Photo Social/Fb.jpg' },
  { title: 'Instagram', href: 'https://www.instagram.com/boyautotires', img: 'Photo Social/IG.jpg' },
  { title: 'TikTok', href: 'https://www.tiktok.com/@boyautotires', img: 'Photo Social/Tiktok.jpg' },
  { title: 'YouTube', href: 'https://www.youtube.com/@BoyAutoTires', img: 'Photo Social/Youtube.jpg' },
  { title: 'LINE', href: SITE_CONTACT.line, img: 'Photo Social/Line.jpg' },
  { title: 'Shopee', href: 'https://shopee.co.th/mj_jeab', img: 'Photo Social/Shopee.jpg' },
];

// product: true = a shop category (shown as category chips and in the footer's product list)
const SITE_NAV = [
  { page: 'home', href: '/', key: 'nav_home' },
  { page: 'wheels', href: '/alloywheel', key: 'nav_wheels', product: true },
  { page: 'tires', href: '/tires', key: 'nav_tires', product: true },
  { page: 'shock', href: '/shock', key: 'nav_shock', product: true },
  { page: 'brake', href: '/brake', key: 'nav_brake', product: true },
  { page: 'portfolio', href: '/portfolio', key: 'nav_portfolio' },
  { page: 'contact', href: '/contact', key: 'menu_contact' },
];

// ☰ menu (top left). Items without href are shown as "coming soon".
const SITE_MENU = [
  { key: 'menu_about' },
  { key: 'menu_blog' },
];

function renderSiteHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.page;
  const navLinks = SITE_NAV.map(n =>
    `<a href="${n.href}" data-i18n="${n.key}" class="${n.page === current ? 'active' : ''}">${n.key}</a>`
  ).join('');
  const menuItems = SITE_MENU.map(m => m.href
    ? `<a href="${m.href}" data-i18n="${m.key}">${m.key}</a>`
    : `<span class="menu-soon"><span data-i18n="${m.key}">${m.key}</span><small data-i18n="menu_soon">เร็วๆ นี้</small></span>`
  ).join('');

  el.outerHTML = `
    <div class="topbar">
      <div class="container">
        <div class="topbar-contact">
          <a href="tel:${SITE_CONTACT.phoneTel}">📞 ${SITE_CONTACT.phone}</a>
          <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" class="hide-sm" data-i18n="cta_line">💬 แอด LINE</a>
        </div>
        <div class="topbar-right">
          <div class="lang-switch">
            <button class="lang-btn" data-lang="th" onclick="setLanguage('th')">ไทย</button>
            <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
          </div>
          <div class="staff-corner">
            <a id="staff-login-link" href="/admin" class="staff-btn" data-i18n="staff_login">🔒 Staff Login</a>
            <a id="staff-admin-link" href="/admin" class="staff-btn" style="display:none;" data-i18n="staff_admin">🛠 Admin Panel</a>
            <a id="staff-logout-link" href="#" class="staff-btn" style="display:none;" data-i18n="staff_logout" onclick="staffLogout(); return false;">Log out</a>
          </div>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container">
        <div class="header-left">
          <button type="button" class="menu-toggle" id="menu-toggle" aria-label="Menu"
                  aria-expanded="false" aria-controls="site-menu">☰</button>
          <a href="/" class="logo"><span class="b">B</span>oyAuto<span class="t">Tires</span></a>
        </div>
        <nav class="main-nav">${navLinks}</nav>
        <a href="tel:${SITE_CONTACT.phoneTel}" class="header-cta" data-i18n="cta_call">📞 โทรเลย</a>
        <div class="site-menu" id="site-menu" hidden>
          <nav class="site-menu-nav">${navLinks}</nav>
          ${menuItems}
        </div>
      </div>
    </header>
  `;

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  const setOpen = open => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
  };
  toggle.onclick = () => setOpen(menu.hidden);
  menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== toggle) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

function renderSiteFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const navItems = SITE_NAV.filter(n => n.product)
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
          <h4 data-i18n="footer_contact">ติดต่อเรา</h4>
          <ul>
            <li><a href="tel:${SITE_CONTACT.phoneTel}">📞 ${SITE_CONTACT.phone}</a></li>
            <li><a href="tel:${SITE_CONTACT.phone2Tel}">📞 ${SITE_CONTACT.phone2}</a></li>
            <li><a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" data-i18n="cta_line">💬 แอด LINE</a></li>
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

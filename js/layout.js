/* ============================================================
   Shared header / footer / floating contact buttons.
   Put <div id="site-header"></div> and <div id="site-footer"></div>
   in the page, set <body data-page="tires"> (home|wheels|tires|shock|brake)
   and load this script BEFORE auth.js and i18n.js.
   ============================================================ */

const SITE_CONTACT = {
  phone: '081-160-0060',
  phoneTel: '+66811600060',
  line: 'https://line.me/ti/p/@boyautotires',
  lineId: '@boyautotires',
};

const SITE_SOCIAL = [
  { title: 'Facebook', href: 'https://www.facebook.com/BOYAUTOTIRES/?locale=th_TH', img: 'Photo Social/Fb.jpg' },
  { title: 'Instagram', href: 'https://www.instagram.com/boyautotires', img: 'Photo Social/IG.jpg' },
  { title: 'TikTok', href: 'https://www.tiktok.com/@boyautotires', img: 'Photo Social/Tiktok.jpg' },
  { title: 'YouTube', href: 'https://www.youtube.com/@BoyAutoTires', img: 'Photo Social/Youtube.jpg' },
  { title: 'LINE', href: SITE_CONTACT.line, img: 'Photo Social/Line.jpg' },
  { title: 'Shopee', href: 'https://shopee.co.th/mj_jeab', img: 'Photo Social/Shopee.jpg' },
];

const SITE_NAV = [
  { page: 'home', href: 'index.html', key: 'nav_home' },
  { page: 'wheels', href: 'alloywheel.html', key: 'nav_wheels' },
  { page: 'tires', href: 'tires.html', key: 'nav_tires' },
  { page: 'shock', href: 'shock.html', key: 'nav_shock' },
  { page: 'brake', href: 'brake.html', key: 'nav_brake' },
];

function renderSiteHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const current = document.body.dataset.page;
  const navLinks = SITE_NAV.map(n =>
    `<a href="${n.href}" data-i18n="${n.key}" class="${n.page === current ? 'active' : ''}">${n.key}</a>`
  ).join('');

  el.outerHTML = `
    <div class="topbar">
      <div class="container">
        <div class="topbar-contact">
          <a href="tel:${SITE_CONTACT.phoneTel}">📞 ${SITE_CONTACT.phone}</a>
          <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" class="hide-sm">💬 LINE ${SITE_CONTACT.lineId}</a>
        </div>
        <div class="topbar-right">
          <div class="lang-switch">
            <button class="lang-btn" data-lang="th" onclick="setLanguage('th')">ไทย</button>
            <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
          </div>
          <div class="staff-corner">
            <a id="staff-login-link" href="admin.html" class="staff-btn" data-i18n="staff_login">🔒 Staff Login</a>
            <a id="staff-admin-link" href="admin.html" class="staff-btn" style="display:none;" data-i18n="staff_admin">🛠 Admin Panel</a>
            <a id="staff-logout-link" href="#" class="staff-btn" style="display:none;" data-i18n="staff_logout" onclick="staffLogout(); return false;">Log out</a>
          </div>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container">
        <a href="index.html" class="logo"><span class="b">B</span>oyAuto<span class="t">Tires</span></a>
        <nav class="main-nav" id="main-nav">${navLinks}</nav>
        <a href="tel:${SITE_CONTACT.phoneTel}" class="header-cta" data-i18n="cta_call">📞 โทรเลย</a>
        <button type="button" class="menu-toggle" aria-label="Menu"
                onclick="document.getElementById('main-nav').classList.toggle('open')">☰</button>
      </div>
    </header>
  `;
}

function renderSiteFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const navItems = SITE_NAV.map(n => `<li><a href="${n.href}" data-i18n="${n.key}">${n.key}</a></li>`).join('');
  const social = SITE_SOCIAL.map(s =>
    `<a href="${s.href}" target="_blank" rel="noopener" title="${s.title}"><img src="${s.img}" alt="${s.title}"></a>`
  ).join('');

  el.outerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <a href="index.html" class="logo"><span class="b">B</span>oyAuto<span class="t">Tires</span></a>
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
            <li><a href="${SITE_CONTACT.line}" target="_blank" rel="noopener">💬 LINE ${SITE_CONTACT.lineId}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} BoyAutoTires. All rights reserved.</div>
    </footer>
    <div class="float-contact">
      <a href="${SITE_CONTACT.line}" target="_blank" rel="noopener" title="LINE"><img src="Photo Social/Line.jpg" alt="LINE"></a>
      <a href="tel:${SITE_CONTACT.phoneTel}" title="Call"><img src="Photo Social/Call.jpg" alt="Call"></a>
    </div>
  `;
}

renderSiteHeader();
renderSiteFooter();

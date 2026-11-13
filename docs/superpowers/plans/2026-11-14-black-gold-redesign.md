# Black + gold redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle every public page and the admin to the approved black + gold look (mockup option 2), without changing text, data, storage or SEO.

**Architecture:** A new `css/theme.css` is loaded last on every page, including admin. It redefines the colour tokens and restyles shared components. Only the home page gets new section markup, and it keeps every id, `data-i18n` key and JS hook.

**Tech Stack:** Static HTML/CSS/JS on a Cloudflare Worker, plus Google Fonts (Oswald, Kanit, Prompt).

**Spec:** `docs/superpowers/specs/2026-11-14-black-gold-redesign-design.md`

## Global Constraints
- Palette: bg #0a0a0b, panel #141417, panel-2 #1c1c20, line #2a2a30, text #f2f2f3, muted #9a9aa3, gold #f5c518, with #111 text on gold.
- Fonts: Oswald 500/700 (English display, uppercase), Kanit 600/800 (Thai headings), Prompt (body).
- No change to: any `data-i18n` text, i18n.js strings, Supabase queries, element ids used by JS, meta/JSON-LD/verification tags, URLs.
- Admin: same controls, flow and hints. Only the look changes.
- LINE (#06c755) and Messenger (gradient) keep their brand colours.

## Review Focus
- Long English labels on narrow cards/buttons at 390px (e.g. "Chat on Messenger"): they must wrap inside, never overflow. → checked in Task 5 screenshots.
- Product cards without a photo, or out of stock: the placeholder and grey-out must still read on the new panels. → Task 3.
- Home hero search: the category buttons and form still call `heroSearch` with `#hero-q` and `#hero-cats`. → Task 2 check.
- Home "latest" grid and category photos are filled by JS (`#latest-grid`, `.cat-card img[data-cat]`): the new tiles must keep those hooks. → Task 2.
- Admin drag-reorder hints, empty and one-item states stay visible (rule 6). → Task 4 screenshots.

---

### Task 1: Shared theme stylesheet
**Files:** Create `css/theme.css`. Modify every `*.html`: add the theme link after the last stylesheet, and add Oswald + Kanit to the Google Fonts link.
- [ ] Tokens on `:root` override `--bg --bg-2 --panel --line --text --muted` (and `--blue`/`--blue-soft` → gold so old hover colours turn gold).
- [ ] Header/topbar/menu/footer/float buttons: black, square, gold accents; logo in Oswald.
- [ ] Headings: Thai h1/h2 in Kanit 800; `.sec-label`, `.disp`, the page-hero big words and the breadcrumb in Oswald.
- [ ] Verify: open `/`, `/tires`, `/contact` locally (serve.js :5500) with no console errors and gold/black colours.

### Task 2: Home page layout
**Files:** Modify `index.html` (markup of hero, categories, why, CTA, and its inline `<style>`).
- [ ] Hero: two columns. Left: kicker, BOY AUTO / outlined TIRES, h1, sub, CTA buttons. Right: "Find my tire" panel holding the existing `#hero-cats` buttons and the `heroSearch` form.
- [ ] Gold marquee strip in Oswald.
- [ ] Category tiles: big gold numbers 01–05, first tile gold. Keep `img[data-cat]` (a faint background photo).
- [ ] Why us: photo + numbered list split, with an "Open daily" gold tag using existing hours text.
- [ ] CTA band in gold with dark/LINE/outline buttons.
- [ ] Verify: the search goes to the right category page, latest products load, the gallery rotates.

### Task 3: Inner pages
**Files:** `css/theme.css`.
- [ ] Page hero: dark photo overlay, outlined Oswald word, Kanit title.
- [ ] Shop toolbar, chips, filters, product cards (white photo box like the mockup, Oswald name, gold price), product detail, lightbox.
- [ ] Portfolio, promotions/blog cards and article, the blog CTA (gold instead of blue), about, contact cards, service pages.

### Task 4: Admin
**Files:** Create admin rules in `css/theme.css` (scoped by admin classes); link it in `admin.html` after `admin-editorial.css`; update the fonts link.
- [ ] Tokens, square edges, Oswald "ADMIN"/"STAFF" outline words, gold active tabs.

### Task 5: Verify and ship
- [ ] Screenshots: home, tires, product page, contact and admin, in TH + EN at 1440px and 390px.
- [ ] `git grep` confirms no i18n/ids were removed (diff review).
- [ ] Commit, push to main, re-check live.

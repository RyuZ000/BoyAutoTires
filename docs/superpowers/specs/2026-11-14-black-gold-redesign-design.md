# BoyAutoTires black + gold redesign

**Date:** 2026-11-14 · **Status:** waiting for the user's approval

## Why
The user wants the whole site and the admin to look like the Dribbble "Tire Company Web site" reference (Pinterest pin 591590101057527368). That means black full-bleed bands, one strong accent, heavy condensed uppercase headings, a big photo hero with a "Find my tire" panel, numbered category tiles and square product cards. They picked **black + gold** from the 3-colour mockup (https://claude.ai/artifact/F9GVwyCF3K6mhNrqMUDcrr, option 2), so the shop's existing gold brand stays.

## Goals
- Every public page gets the new look: home, 5 category pages, product pages, portfolio, promotions, blog, about, contact and the 5 service pages.
- The admin page gets the same look: colours, fonts and square edges.
- The home page layout follows the approved mockup: hero with a side search panel, a gold strip, tiles 01–05, cards, a photo + "why us" split, the gallery, a gold contact band and the footer.
- It must work in TH and EN, at desktop and phone width (CLAUDE.md rule 7).

## Must not change (anti-goals)
- Text content and i18n strings. No new copy, apart from a decorative English word already in the mockup ("Find my tire", "Open daily", the eyebrows).
- Any Supabase table, column, row, storage file, or the queries and data the pages read and write.
- How the admin works: same buttons, same flow, drag-to-reorder and every hint (rules 5 and 6). Only the look changes.
- SEO pieces: meta tags, JSON-LD, the Search Console verification tag, URLs.

## Approaches considered
1. **New theme stylesheet loaded last on every page (chosen).** Add `css/theme.css` after the existing CSS on all pages and on admin. It overrides the colour tokens (`--bg`, `--panel`, `--gold`, …), fonts, edges and component styles. HTML changes stay small, except on the home page, which gets the new section markup with the same ids and `data-i18n` keys so its JS keeps working. It is easy to roll back by removing one link.
2. Rewrite `site.css` / `staff.css` / `editorial.css` from scratch. Cleanest result, but a big risk of breaking pages that aren't re-checked, and a much larger diff.
3. Restyle only the home page. Cheapest, but the user asked for the whole site and the admin.

## Design decisions
- Palette: background #0a0a0b, panels #141417 / #1c1c20, hairlines #2a2a30, text #f2f2f3, muted #9a9aa3, accent gold #f5c518 with dark text (#111) on gold.
- Type: Oswald (English display, uppercase), Kanit 600/800 (Thai headings), Prompt (body, as today). Unbounded, Instrument Serif and Space Mono are retired from the public pages.
- Square edges, gold top border on panels, gold bottom border on card hover.
- Page heroes on inner pages keep their big English word (WHEELS, TIRES …) restyled in Oswald with an outline.
- LINE and Messenger buttons keep their brand colours.

## Left to the builder
- Exact spacing and breakpoints per inner page, following the mockup's scale.
- Whether old editorial.css rules are deleted or simply overridden (prefer overriding; delete only dead rules).

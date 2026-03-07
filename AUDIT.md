# Hairstelle – Senior Frontend Audit

**Date:** March 2026  
**Scope:** Performance, UI/UX, structure, security, mobile, code quality  
**Goal:** Luxury beauty brand presence, fast load, accessible, maintainable.

---

## 1. Performance

### Current issues
- **Fonts:** Google Fonts loaded synchronously; no `preconnect` or `font-display: swap` → blocks first paint.
- **LCP:** Hero image and logo not preloaded; loader waits for full `window.load` (all assets).
- **JS:** `products-data.js` loaded on every page (about, contact, gallery) though only shop/home need it.
- **Images:** Home featured grid images lack explicit dimensions and `loading="lazy"` → layout shift and unnecessary early loading.
- **CSS:** Single ~2,500-line file; no critical-path extraction for above-the-fold content.
- **No resource hints:** Missing `dns-prefetch` / `preconnect` for Google Fonts and any future CDNs.

### Recommendations
- Add `preconnect` for `https://fonts.googleapis.com` and `https://fonts.gstatic.com`; use `&display=swap` in font URL.
- Preload `assets/hairstelle-logo-octagon.png` and hero image on home (LCP candidates).
- Load `products-data.js` only on `home.html` and `shop.html` (and product pages if they use catalogue).
- Add `width`/`height` and `loading="lazy"` to product images in home featured grid.
- Remove loader on `DOMContentLoaded` with a short delay, or after LCP (e.g. first image painted) instead of full `load`.
- Consider splitting CSS into critical (inline or first request) and deferred for below-fold; or at least minify in production.

---

## 2. UI / Luxury brand feel

### Current state
- Typography (Playfair + Poppins) and colour tokens (gold, blush, deep brown) are on-brand.
- Hero gradient and chip are strong; section structure is clear.
- Buttons and cards are functional but could feel more premium.

### Gaps
- **Buttons:** Hover is a simple darken; no subtle lift, shadow, or “shine” for a luxury CTA.
- **Cards:** Product and highlight cards use flat borders/shadows; could use finer border, softer shadow, and gentle hover lift.
- **Focus:** No visible `:focus-visible` styles → keyboard users lose clear focus indication.
- **Footer:** Feels utilitarian; could use a stronger divider, slightly more editorial typography, and a touch of brand colour.
- **Product cards:** No hover state on image (e.g. slight zoom or overlay) or card lift.
- **Transitions:** Inconsistent; some interactions feel instant where a 200–300 ms ease would feel more polished.
- **Spacing:** Section padding and title/subtitle gaps could be slightly more generous for a high-end look.

### Recommendations
- Add `:focus-visible` (outline/ring) for all interactive elements; remove default focus outline only where replaced.
- Refine primary button: subtle box-shadow on hover, slight translateY(-2px), optional gradient border.
- Product card: `transform: translateY(-4px)` and shadow increase on hover; image `transform: scale(1.03)` with `overflow: hidden`.
- Footer: thin gold/primary gradient or line above footer; increase letter-spacing on headings; optional small accent on “Luxury hair, crafted by Estelle.”
- Use consistent transition duration (e.g. 0.25s ease) for hover/focus on links, buttons, cards.

---

## 3. Structure & maintainability

### Current issues
- **Duplication:** Header, footer, loader, and add-to-bag modal are copy-pasted across 10+ HTML files → any change requires edits in many places.
- **Scripts:** Loader logic (`is-loading` class, `window.load`) repeated in every `<head>`; `escapeHtml` duplicated in home and shop inline scripts.
- **No component layer:** No shared partials, no build step (e.g. SSI, templating, or static site generator) to include header/footer from one source.
- **Admin:** Large single HTML file with embedded script; could be split into logical modules or at least clearly sectioned.

### Recommendations
- Introduce a minimal build or server-side includes (e.g. `<!--#include file="header.html" -->`) so header/footer/loader/modal live in one place.
- Move loader logic into `hairstelle-global.js` (e.g. set `is-loading` on DOMContentLoaded, clear on load or after first paint) so each page only includes the script.
- Centralise `escapeHtml` (and any other shared helpers) in `hairstelle-global.js` and use it from inline scripts via `window.Hairstelle.escapeHtml` or similar.
- Document in a short README or CONTRIBUTING how to add a new page (which includes to use, which scripts to load).

---

## 4. Security

### Current state
- **Admin:** Access controlled by `sessionStorage.getItem('hairstelle_admin') === '1'`; no server-side auth. Easy to bypass by setting the flag in console or loading admin URL after visiting login.
- **Data:** Cart, orders, bookings stored in `localStorage`; no sensitive payment data, but data can be tampered with or cleared by user or extensions.
- **XSS:** Dynamic content (product names, prices, etc.) is injected via `innerHTML` but consistently wrapped with `escapeHtml()` in the audited code paths. No use of `eval` or `document.write`.

### Recommendations
- Treat admin as “convenience only” unless backed by a real backend: add a comment in code and in AUDIT that admin is not secure for production; for real use, protect with server-side auth and HTTPS.
- Keep using `escapeHtml` for any user- or admin-controlled data before `innerHTML`; consider a small helper that only allows safe tags if you ever need rich text.
- If forms ever post to a server, add CSRF tokens and validate on the server; ensure any email/booking submission is rate-limited and validated server-side.
- Do not store passwords or tokens in `localStorage` if you add real auth later; prefer httpOnly cookies or a proper auth service.

---

## 5. Responsiveness & mobile

### Current state
- Breakpoints at 960px and 768px; mobile header becomes dark with hamburger; container padding reduced.
- Touch target for nav toggle is 44px; cart and Book Now are reasonably sized.
- Hero and product grids stack; footer columns reduce to 2 then 1.

### Gaps
- **Typography:** Fixed font sizes (e.g. hero 2.15rem on mobile) can be too large on very small screens or too small on large tablets; no fluid scaling.
- **Safe area:** No `env(safe-area-inset-*)` for notches/home indicators on notched devices.
- **Viewport:** `width=device-width, initial-scale=1.0` is set; consider `viewport-fit=cover` if you want full-bleed to edges and then pad with safe-area.
- **Product grid:** `minmax(220px, 1fr)` can leave one or two cards per row on mid-width screens; consider a 2-col min for a more intentional layout on phones.
- **Footer links:** Ensure spacing between links meets touch-target guidelines (e.g. 44px height or padding).

### Recommendations
- Use `clamp()` for key headings (e.g. hero title, section titles) so they scale between mobile and desktop.
- Add `padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);` to body or .container where appropriate; add `viewport-fit=cover` if using safe areas.
- Optionally set `min-height: 44px` and `min-width: 44px` on footer links and other tappable elements.
- Consider a 2-column product grid on small screens (e.g. `minmax(140px, 1fr)`) for a more “catalogue” feel, or keep one column and rely on card size.

---

## 6. Code quality

### Strengths
- Consistent use of `escapeHtml` before inserting into DOM in the reviewed flows.
- Semantic HTML (header, main, nav, footer, section, article).
- ARIA on modal and menu (aria-hidden, aria-expanded, aria-label).
- CSS custom properties for theming; logical grouping in styles.css.

### Improvements
- **Script order:** Some pages load `products-data.js` before `hairstelle-global.js`; ensure any dependency order is documented and that catalogue-dependent scripts run after both.
- **Loader:** Unify in one place; avoid duplicate inline script in every page.
- **Error handling:** `getCart()`, `getStore()`, etc. use try/catch; ensure all localStorage access is wrapped where it can throw (e.g. private mode).
- **Linting:** Add a simple HTML and JS lint step (e.g. eslint, htmlhint) in CI or pre-commit to catch missing alt text, invalid ARIA, and obvious JS errors.
- **Comments:** Add a one-line comment above each major block in the global JS (cart, modal, menu, image overrides) for faster onboarding.

---

## 7. Accessibility

- **Focus:** Add `:focus-visible` styles so keyboard navigation is clear.
- **Contrast:** Gold/cream text on dark in hero meets contrast where used; keep an eye on muted text (e.g. `#766963`) on light background – consider slightly darker for body text if needed.
- **Alt text:** Logo has alt="Hairstelle"; hero image has descriptive alt; ensure all product images get meaningful alt from product name.
- **Forms:** Labels are associated with inputs; add `aria-describedby` for error or hint text if you add validation messages.
- **Skip link:** Consider a “Skip to main content” link at the top for keyboard users.

---

## Summary priority matrix

| Priority | Area           | Action |
|----------|----------------|--------|
| High     | Performance    | Preconnect + font-display swap; preload logo/hero; lazy load below-fold images; load products-data only where needed. |
| High     | UI / Luxury    | Focus-visible; button/card hover refinement; product card hover; footer polish. |
| High     | Mobile         | Fluid typography (clamp); safe-area padding where appropriate. |
| Medium   | Structure      | Centralise loader and escapeHtml; document script order; consider SSI/build for header/footer. |
| Medium   | Security       | Document admin as non-production-secure; keep escapeHtml discipline. |
| Low      | Accessibility  | Skip link; aria-describedby on forms when validation exists. |

This audit should be re-visited when adding a backend, moving to a framework, or before a major marketing launch.

---

## 8. Implemented improvements (post-audit)

The following were applied directly to the codebase:

- **Performance:** Preconnect for `fonts.googleapis.com` and `fonts.gstatic.com` on all pages; preload of logo and hero image on home; `loading="lazy"` and explicit dimensions on home featured-grid product images; font URL already uses `display=swap`.
- **UI / luxury:** `:focus-visible` styles for keyboard users; stronger button hover (shadow + translateY); product card hover lift and image zoom; highlight card hover; footer accent (gold shadow line) and typography tweaks; smooth scroll on html.
- **Responsiveness:** Fluid typography via `clamp()` for `.hero-title` and `.section-title`; safe-area padding on body for notched devices; mobile hero title uses clamp.
- **Accessibility:** Skip link (“Skip to main content”) on home, about, and shop; `id="main-content"` and `tabindex="-1"` on main for focus target.
- **Code quality:** `escapeHtml` exposed on `window.Hairstelle.escapeHtml` for reuse; home featured grid uses `escapeHtml(item.image)` for image src to guard against XSS.
- **Security:** No code change; admin and XSS notes remain in Sections 4 and 6.

To roll out skip links and `#main-content` to the remaining pages (contact, services, gallery, cart, product pages, admin), repeat the same pattern used on home/about/shop.

---

## 9. “What to do next” – completed

- **Structure:** Shared header and footer are in **partials/header.html** and **partials/footer.html**. Run **node build.js** (see BUILD.md) to inject them into all main site pages (home, about, shop, contact, services, gallery, cart, product-*). Admin pages are left as-is. **setActiveNav()** in hairstelle-global.js sets the active nav link from the current URL, so one header partial works for every page.
- **Security:** Admin is documented as convenience-only in admin-login.html (meta description and note under the form), admin-dashboard.html (meta description and note in the section), and in this audit (Section 4). Use server-side auth and HTTPS for production.
- **Skip links:** Skip link and **id="main-content"** + **tabindex="-1"** are now on **contact**, **services**, **gallery**, **cart**, and all three **product** pages as well as home, about, and shop.

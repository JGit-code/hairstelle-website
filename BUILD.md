# Hairstelle build (shared header & footer)

Header and footer are kept in **partials** so you can change them in one place and apply to all main site pages.

## Files

- **partials/header.html** – Skip link, page loader, and site header (nav, drawer). No `is-active` class; the current page is set by `hairstelle-global.js` (`setActiveNav()`) from the URL.
- **partials/footer.html** – Main site footer (logo, Shop / Experience / Connect links, copyright).
- **build.js** – Node.js script that injects these partials into each main page.

## When to run the build

After you edit **partials/header.html** or **partials/footer.html**, run the build so all pages get the update.

## How to run

You need **Node.js** installed.

```bash
cd /path/to/Hairstelle
node build.js
```

This updates (in place):

- home.html  
- about.html  
- shop.html  
- contact.html  
- services.html  
- gallery.html  
- cart.html  
- product-crown-aura.html  
- product-silk-serum.html  
- product-template.html  

**Admin pages** (admin-login.html, admin-dashboard.html) are **not** changed; they use their own header and footer.

## First-time setup

If you have never run the build, the HTML files still contain their own header and footer. The first time you run `node build.js`, those blocks are replaced with the content from the partials. After that, any change to the partials is applied by re-running the build.

## Active nav link

The script **partials/header.html** does not add `is-active` to any nav link. On load, `hairstelle-global.js` calls `setActiveNav()`, which sets `is-active` on the link that matches the current page (from `window.location.pathname`), so the correct item is highlighted on every page.

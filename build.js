/**
 * Hairstelle build script: inject shared header and footer from partials into main site pages.
 * Run: node build.js
 * Edit partials/header.html and partials/footer.html, then run again to update all pages.
 * Admin pages (admin-login.html, admin-dashboard.html) are not modified.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PARTIALS = path.join(ROOT, 'partials');
const HEADER_PATH = path.join(PARTIALS, 'header.html');
const FOOTER_PATH = path.join(PARTIALS, 'footer.html');

const MAIN_PAGES = [
  'home.html',
  'about.html',
  'shop.html',
  'contact.html',
  'services.html',
  'gallery.html',
  'cart.html',
  'product-crown-aura.html',
  'product-silk-serum.html',
  'product-template.html'
];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

const headerPartial = read(HEADER_PATH);
const footerPartial = read(FOOTER_PATH);

MAIN_PAGES.forEach(function (filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) {
    console.warn('Skip (not found): ' + filename);
    return;
  }
  let html = read(filePath);

  // Replace from <body...> through </header> with <body...> + header partial
  const bodyHeaderRegex = /(<body[^>]*>)\s*[\s\S]*?<\/header>/;
  if (!bodyHeaderRegex.test(html)) {
    console.warn('No body/header block found in: ' + filename);
  } else {
    html = html.replace(bodyHeaderRegex, '$1\n' + headerPartial);
  }

  // Replace <footer...>...</footer> with footer partial
  const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>/;
  if (!footerRegex.test(html)) {
    console.warn('No footer block found in: ' + filename);
  } else {
    html = html.replace(footerRegex, footerPartial.trim());
  }

  write(filePath, html);
  console.log('Built: ' + filename);
});

console.log('Done. ' + MAIN_PAGES.length + ' pages updated.');

/**
 * Hairstelle – global header (hamburger menu), cart count, add-to-bag modal, cart helpers
 */
(function () {
  'use strict';

  var CART_KEY = 'hairstelle_cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }

  function updateCartCount() {
    var items = getCart();
    var total = items.reduce(function (sum, item) { return sum + (item.quantity || 1); }, 0);
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = total;
    });
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    var overlay = document.getElementById('nav-overlay');
    if (overlay) {
      overlay.setAttribute('aria-hidden', 'false');
      var btn = document.getElementById('nav-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    var overlay = document.getElementById('nav-overlay');
    if (overlay) {
      overlay.setAttribute('aria-hidden', 'true');
      var btn = document.getElementById('nav-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  function setActiveNav() {
    var path = window.location.pathname || '';
    var page = path.split('/').pop() || path.split('/').slice(-1)[0] || '';
    if (!page) page = 'home.html';
    if (page === '' || page === '/') page = 'home.html';
    document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace(/^\.\//, '');
      a.classList.toggle('is-active', href === page || (page === '' && href === 'home.html'));
    });
  }

  function initHeader() {
    setActiveNav();
    var toggle = document.getElementById('nav-toggle');
    var overlay = document.getElementById('nav-overlay');
    if (toggle && overlay) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (document.body.classList.contains('menu-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeMenu();
      });
      overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
      overlay.querySelectorAll('[data-action="close-menu"]').forEach(function (btn) {
        btn.addEventListener('click', closeMenu);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
      });
    }
    updateCartCount();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function openAddToBagModal(product) {
    var modal = document.getElementById('add-to-bag-modal');
    if (!modal) return;
    var nameEl = modal.querySelector('[data-modal="name"]');
    var priceEl = modal.querySelector('[data-modal="price"]');
    var qtyEl = modal.querySelector('[data-modal="qty"]');
    var sizeWrap = modal.querySelector('[data-modal="size-wrap"]');
    var colorWrap = modal.querySelector('[data-modal="color-wrap"]');
    var sizeSelect = modal.querySelector('[data-modal="size"]');
    var colorSelect = modal.querySelector('[data-modal="color"]');
    var form = modal.querySelector('form');
    if (nameEl) nameEl.textContent = product.name || '';
    if (priceEl) priceEl.textContent = 'R' + Number(product.price || 0).toLocaleString('en-ZA');
    if (qtyEl) qtyEl.value = 1;
    var sizes = product.sizes || [];
    var colors = product.colors || [];
    if (sizeWrap) sizeWrap.style.display = sizes.length ? 'block' : 'none';
    if (colorWrap) colorWrap.style.display = colors.length ? 'block' : 'none';
    if (sizeSelect) {
      sizeSelect.innerHTML = '<option value="">Select size</option>' + sizes.map(function (s) {
        return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
      }).join('');
    }
    if (colorSelect) {
      colorSelect.innerHTML = '<option value="">Select colour</option>' + colors.map(function (c) {
        return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
      }).join('');
    }
    if (form) form.dataset.productId = product.id || '';
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeAddToBagModal() {
    var modal = document.getElementById('add-to-bag-modal');
    if (modal) {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  }

  function addToCart(productId, name, price, quantity, size, color) {
    var cart = getCart();
    var id = productId + '-' + (size || '') + '-' + (color || '') + '-' + Date.now();
    cart.push({
      id: id,
      productId: productId,
      name: name,
      price: String(price),
      quantity: parseInt(quantity, 10) || 1,
      size: size || '',
      color: color || ''
    });
    setCart(cart);
    closeAddToBagModal();
  }

  function removeFromCart(itemId) {
    var cart = getCart().filter(function (item) { return item.id !== itemId; });
    setCart(cart);
  }

  function initAddToBagModal() {
    var modal = document.getElementById('add-to-bag-modal');
    if (!modal) return;
    var form = modal.querySelector('form');
    var closeBtn = modal.querySelector('[data-action="close-modal"]');
    if (closeBtn) closeBtn.addEventListener('click', closeAddToBagModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal || (e.target && e.target.classList.contains('add-to-bag-modal-backdrop'))) closeAddToBagModal();
    });
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var productId = form.dataset.productId;
        var name = form.querySelector('[data-modal="name"]');
        var priceEl = form.querySelector('[data-modal="price"]');
        var qty = form.querySelector('[data-modal="qty"]');
        var sizeSelect = form.querySelector('[data-modal="size"]');
        var colorSelect = form.querySelector('[data-modal="color"]');
        var product = window._hairstelleModalProduct || {};
        if (!productId && product.id) productId = product.id;
        var productName = (name && name.textContent) || product.name || 'Item';
        var priceStr = (priceEl && priceEl.textContent) || product.price || '0';
        var price = parseFloat(priceStr.replace(/[^\d.]/g, '')) || 0;
        var quantity = parseInt((qty && qty.value) || 1, 10) || 1;
        var size = (sizeSelect && sizeSelect.value) || '';
        var color = (colorSelect && colorSelect.value) || '';
        addToCart(productId, productName, price, quantity, size, color);
      });
    }
  }

  window.Hairstelle = window.Hairstelle || {};
  window.Hairstelle.getCart = getCart;
  window.Hairstelle.setCart = setCart;
  window.Hairstelle.updateCartCount = updateCartCount;
  window.Hairstelle.openAddToBagModal = openAddToBagModal;
  window.Hairstelle.closeAddToBagModal = closeAddToBagModal;
  window.Hairstelle.removeFromCart = removeFromCart;
  window.Hairstelle.closeMenu = closeMenu;
  window.Hairstelle.escapeHtml = escapeHtml;

  function applyTheme() {
    try {
      var theme = localStorage.getItem('hairstelle_theme') || 'gold';
      document.body.setAttribute('data-hairstelle-theme', theme);
    } catch (e) {}
  }
  var IMAGE_DEFAULTS = {
    header_logo: 'assets/hairstelle-logo-octagon.png',
    hero_home: 'assets/signature-artistry.jpg',
    gallery_1: 'assets/gallery-1.jpg',
    gallery_2: 'assets/gallery-2.jpg',
    gallery_3: 'assets/gallery-3.jpg',
    gallery_4: 'assets/gallery-4.jpg',
    gallery_5: 'assets/gallery-5.jpg',
    about_founder: 'assets/founder-estelle.jpg'
  };
  function applyImageOverrides() {
    try {
      var raw = localStorage.getItem('hairstelle_images');
      var overrides = raw ? JSON.parse(raw) : {};
      document.querySelectorAll('img[data-hairstelle-image]').forEach(function (img) {
        var key = img.getAttribute('data-hairstelle-image');
        var url = overrides[key] !== undefined && overrides[key] !== '' ? overrides[key] : IMAGE_DEFAULTS[key];
        if (url) img.src = url;
      });
    } catch (e) {}
  }
  function initSiteConfig() {
    applyTheme();
    applyImageOverrides();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initHeader();
      initAddToBagModal();
      initSiteConfig();
    });
  } else {
    initHeader();
    initAddToBagModal();
    initSiteConfig();
  }
})();

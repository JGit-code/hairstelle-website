/**
 * Hairstelle – global header (hamburger menu), cart count, add-to-bag modal, cart helpers
 */
(function () {
  'use strict';

  var CART_KEY = 'hairstelle_cart';

  /** Fix logo and hero (and any /assets/ or assets/ images) to load via absolute URL so they show on Vercel like product images */
  function fixAssetImageUrls() {
    var origin = window.location.origin;
    var pathname = window.location.pathname || '/';
    var base = pathname.replace(/\/[^/]*$/, '') || '/';
    document.querySelectorAll('img[src]').forEach(function (img) {
      var s = (img.getAttribute('src') || '').trim();
      if (!s || s.indexOf('http') === 0) return;
      var absolute = s.indexOf('/') === 0
        ? (base === '/' ? origin + s : origin + base + s)
        : origin + base + (base === '/' ? '/' : '') + s;
      if (absolute !== img.src) img.src = absolute;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAssetImageUrls);
  } else {
    fixAssetImageUrls();
  }

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
      function toggleMenu(e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (document.body.classList.contains('menu-open')) {
          closeMenu();
        } else {
          openMenu();
        }
      }
      toggle.addEventListener('click', toggleMenu);
      /* Close when tapping overlay background or any menu link. Use click only for links so mobile tap → synthetic click → navigate. */
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeMenu();
          return;
        }
        var link = e.target.closest('a[href]');
        if (link && overlay.contains(link)) {
          closeMenu();
        }
        var closeBtn = e.target.closest('[data-action="close-menu"]');
        if (closeBtn) {
          e.preventDefault();
          closeMenu();
        }
      });
      overlay.addEventListener('touchend', function (e) {
        if (e.target === overlay) closeMenu();
      });
      overlay.querySelectorAll('[data-action="close-menu"]').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          closeMenu();
        });
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

  function openProductDetailModal(product) {
    var modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    var img = modal.querySelector('[data-pd="image"]');
    var nameEl = modal.querySelector('[data-pd="name"]');
    var categoryEl = modal.querySelector('[data-pd="category"]');
    var priceEl = modal.querySelector('[data-pd="price"]');
    var detailsEl = modal.querySelector('[data-pd="details"]');
    var descEl = modal.querySelector('[data-pd="description"]');
    if (img) { img.src = product.image || ''; img.alt = product.name || ''; img.style.display = product.image ? '' : 'none'; }
    if (nameEl) nameEl.textContent = product.name || '';
    if (categoryEl) categoryEl.textContent = product.categoryLabel || product.category || '';
    if (priceEl) priceEl.textContent = 'R' + Number(product.price || 0).toLocaleString('en-ZA');
    if (detailsEl) { detailsEl.textContent = product.details || ''; detailsEl.style.display = product.details ? '' : 'none'; }
    if (descEl) { descEl.textContent = product.description || ''; descEl.style.display = product.description ? '' : 'none'; }
    modal.dataset.productId = product.id || '';
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeProductDetailModal() {
    var modal = document.getElementById('product-detail-modal');
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

  function initProductDetailModal() {
    var modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    modal.querySelectorAll('[data-action="close-product-detail"]').forEach(function (el) {
      el.addEventListener('click', closeProductDetailModal);
    });
    var addBtn = modal.querySelector('[data-action="product-detail-add-to-bag"]');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var id = modal.dataset.productId;
        var catalog = window.HairstelleCatalog;
        if (id && catalog) {
          var list = catalog.getShopProducts && catalog.getShopProducts();
          var product = list && list.filter(function (p) { return (p.id || '') === id; })[0];
          if (product) {
            closeProductDetailModal();
            openAddToBagModal(product);
          }
        }
      });
    }
    document.addEventListener('click', function (e) {
      var viewBtn = e.target.closest('[data-view-details]');
      if (viewBtn) {
        var id = viewBtn.getAttribute('data-product-id');
        var catalog = window.HairstelleCatalog;
        if (id && catalog && catalog.getShopProducts) {
          var list = catalog.getShopProducts();
          var product = list.filter(function (p) { return (p.id || '') === id; })[0];
          if (product) openProductDetailModal(product);
        }
        return;
      }
      var addBtn = e.target.closest('[data-add-to-bag]');
      if (addBtn) {
        var id = addBtn.getAttribute('data-product-id');
        var catalog = window.HairstelleCatalog;
        if (id && catalog && catalog.getShopProducts) {
          var list = catalog.getShopProducts();
          var product = list.filter(function (p) { return (p.id || '') === id; })[0];
          if (product) openAddToBagModal(product);
        }
      }
    });
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
      var theme = 'gold';
      var params = new URLSearchParams(window.location.search || '');
      var urlTheme = params.get('theme');
      if (urlTheme) {
        theme = urlTheme;
        try { localStorage.setItem('hairstelle_theme', theme); } catch (e) {}
      } else {
        theme = localStorage.getItem('hairstelle_theme') || theme;
      }
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
      var defaults = IMAGE_DEFAULTS;
      document.querySelectorAll('img[data-hairstelle-image]').forEach(function (img) {
        var key = img.getAttribute('data-hairstelle-image');
        var url = overrides[key] !== undefined && overrides[key] !== '' ? overrides[key] : defaults[key];
        if (url) {
          img.src = url;
          img.onerror = function () {
            var def = defaults[key];
            if (def && !this.dataset.fallbackTried) {
              this.dataset.fallbackTried = '1';
              this.src = def;
            }
            this.onerror = null;
          };
        }
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
      initProductDetailModal();
      initSiteConfig();
    });
  } else {
    initHeader();
    initAddToBagModal();
    initProductDetailModal();
    initSiteConfig();
  }
})();

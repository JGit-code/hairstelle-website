(function () {
  function getStoreProducts() {
    try {
      return JSON.parse(localStorage.getItem('hairstelle_products') || '[]');
    } catch (e) {
      return [];
    }
  }

  function mapCategoryKey(category) {
    var value = String(category || '').toLowerCase();
    if (value.indexOf('wig') !== -1) return 'wigs';
    if (value.indexOf('bundle') !== -1) return 'bundles';
    if (value.indexOf('frontal') !== -1 || value.indexOf('closure') !== -1) return 'frontals';
    return 'care';
  }

  var defaultProducts = [
    {
      id: 'default-1',
      name: 'Midnight Muse Bob Unit',
      category: 'Luxury wig',
      categoryLabel: 'Luxury wig',
      categoryKey: 'wigs',
      price: '8300',
      badge: 'Trending',
      details: '12" - 14" | Blunt cut',
      description: 'Everyday soft glam',
      shortTag: 'Soft glam',
      image: 'https://images.unsplash.com/photo-1570464678671-953f859952c4?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: true
    },
    {
      id: 'default-2',
      name: 'Regal Essence Curly Wig',
      category: 'Luxury wig',
      categoryLabel: 'Luxury wig',
      categoryKey: 'wigs',
      price: '10000',
      badge: 'Best seller',
      details: '18" - 26" | Deep curls',
      description: 'Voluminous curls',
      shortTag: 'Luxury volume',
      image: 'https://images.unsplash.com/photo-1654404886290-3d27a00bf4fa?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: true
    },
    {
      id: 'default-3',
      name: 'Opulent Tress Straight Bundles',
      category: 'Bundles & closures',
      categoryLabel: 'Bundles set',
      categoryKey: 'bundles',
      price: '4800',
      badge: 'Collection',
      details: '18" - 30" | 3 pcs',
      description: 'Silky straight',
      shortTag: 'Silky straight',
      image: 'https://images.unsplash.com/photo-1768470004729-87fa38a191ed?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    },
    {
      id: 'default-4',
      name: 'Runway Aura Deep Curl Bundles',
      category: 'Bundles & closures',
      categoryLabel: 'Bundles set',
      categoryKey: 'bundles',
      price: '5300',
      badge: 'Editor\'s pick',
      details: '20" - 30" | 3 pcs',
      description: 'Runway-ready texture',
      shortTag: 'Runway-ready',
      image: 'https://images.unsplash.com/photo-1570464678671-953f859952c4?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    },
    {
      id: 'default-5',
      name: 'Ethereal Melt HD Frontal',
      category: 'Frontals & closures',
      categoryLabel: 'Frontal',
      categoryKey: 'frontals',
      price: '3900',
      badge: 'HD lace',
      details: '13x4 | 16" - 22"',
      description: 'Invisible hairline',
      shortTag: 'Melt finish',
      image: 'https://images.unsplash.com/photo-1768470004729-87fa38a191ed?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: true
    },
    {
      id: 'default-6',
      name: 'Couture Seamless Closure',
      category: 'Frontals & closures',
      categoryLabel: 'Closure',
      categoryKey: 'frontals',
      price: '2950',
      badge: 'Essential',
      details: '5x5 | 14" - 22"',
      description: 'Soft parting',
      shortTag: 'Easy install',
      image: 'https://images.unsplash.com/photo-1570464678671-953f859952c4?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    },
    {
      id: 'default-7',
      name: 'Silk Serum Radiance Drops',
      category: 'Hair care',
      categoryLabel: 'Hair care',
      categoryKey: 'care',
      price: '880',
      badge: 'Care',
      details: '50ml | Lightweight shine',
      description: 'Anti-frizz silk finish',
      shortTag: 'Anti-frizz',
      image: 'https://images.unsplash.com/photo-1731655911208-9356af5dcd50?auto=format&fit=crop&w=900&q=80',
      link: 'product-silk-serum.html',
      featuredOnHome: true
    },
    {
      id: 'default-8',
      name: 'Crown Guard Heat Shield Mist',
      category: 'Hair care',
      categoryLabel: 'Hair care',
      categoryKey: 'care',
      price: '700',
      badge: 'Care',
      details: '150ml | Up to 230C',
      description: 'Heat protectant mist',
      shortTag: 'Heat shield',
      image: 'https://images.unsplash.com/photo-1636708115005-9f1896b046c2?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    },
    {
      id: 'default-9',
      name: 'Hydrate Gloss Shampoo',
      category: 'Hair care',
      categoryLabel: 'Hair care',
      categoryKey: 'care',
      price: '620',
      badge: 'New in',
      details: '250ml | Gentle cleanse',
      description: 'Moisture and shine wash',
      shortTag: 'Hydrating wash',
      image: 'https://images.unsplash.com/photo-1701992679059-8631c83df108?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    },
    {
      id: 'default-10',
      name: 'Studio Restore Care Set',
      category: 'Hair care',
      categoryLabel: 'Hair care set',
      categoryKey: 'care',
      price: '1450',
      badge: 'Set',
      details: '4-piece care edit',
      description: 'Salon shelf essentials',
      shortTag: 'Salon care',
      image: 'https://images.unsplash.com/photo-1695527081782-c4ad3005417e?auto=format&fit=crop&w=900&q=80',
      link: 'cart.html',
      featuredOnHome: false
    }
  ];

  function normalizeStoredProduct(item) {
    var category = item.categoryLabel || item.category || 'Hair care';
    return {
      id: item.id || String(Date.now()),
      name: item.name || 'Untitled product',
      category: category,
      categoryLabel: item.categoryLabel || category,
      categoryKey: item.categoryKey || mapCategoryKey(category),
      price: item.price || '',
      badge: item.badge || 'New in',
      details: item.details || '',
      description: item.description || '',
      shortTag: item.shortTag || item.description || 'New arrival',
      image: item.image || '',
      link: item.link || 'cart.html',
      featuredOnHome: !!item.featuredOnHome,
      source: 'stored'
    };
  }

  window.HairstelleCatalog = {
    mapCategoryKey: mapCategoryKey,
    getDefaultProducts: function () {
      return defaultProducts.slice();
    },
    getStoredProducts: function () {
      return getStoreProducts().map(normalizeStoredProduct);
    },
    getShopProducts: function () {
      return defaultProducts.concat(getStoreProducts().map(normalizeStoredProduct));
    },
    getTrendingProducts: function (limit) {
      var maxItems = limit || 4;
      var stored = getStoreProducts().map(normalizeStoredProduct).filter(function (item) {
        return item.featuredOnHome;
      });
      var defaults = defaultProducts.filter(function (item) {
        return item.featuredOnHome;
      });
      return stored.concat(defaults).slice(0, maxItems);
    }
  };
}());

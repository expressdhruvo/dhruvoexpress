(() => {
  'use strict';

  // ব্যবসার আসল তথ্য দিয়ে এই কনফিগারেশন আপডেট করুন।
  const STORE = {
    whatsappNumber: '8801619831653', // wa.me URL-এ + চিহ্ন ছাড়া আন্তর্জাতিক ফরম্যাট
    paymentDisplayNumber: '+8801619831653'
  };
  const DELIVERY_POLICY = {
    tiers: [
      { maxKg: 10, fee: 30 },
      { maxKg: 30, fee: 60 },
      { maxKg: 80, fee: 100 } // ৮০ কেজি পূর্ণ হলে অনলাইন অর্ডার বন্ধ
    ],
    maximumOnlineWeightKg: 80
  };
  // দাম এখন সাইটে স্বাভাবিকভাবে দেখানো হয় (কার্ড, কার্ট, checkout, WhatsApp মেসেজ)।
  // মালিক/decap CMS থেকে নিজে দাম আপডেট করবেন; তাই এখানে দাম আগের মতোই থাকবে।
  // কখনো দাম সাময়িক লুকাতে চাইলে নিচের মান false করুন — তখন সাইটে "WhatsApp-এ যাচাই করুন" দেখাবে।
  const PRICING = { verified: true };

  // ইমেইল ফর্ম কীভাবে পাঠাবে:
  //   'formsubmit' → সার্ভার ছাড়াই FormSubmit দিয়ে ইমেইল (syedsazzadhossain8@gmail.com-এ প্রথমবার
  //                  পাওয়া “Activate Form” লিংক একবার ক্লিক করতে হবে)।
  //   বার্তা দুই ধাপে যায়: প্রথমে AJAX; ব্যর্থ হলে আড়াল-ফ্রেমে সাধারণ POST (submitViaFrame)।
  //   তাই FormSubmit “activation” বার্তা দিলেও দর্শনার্থী থ্যাংক-ইউ মেসেজ পায়—কোনো মেইল অ্যাপ খোলে না।
  const CONTACT_FORM = { mode: 'formsubmit' };

  // deliveryWeightKg-এ মুদি পণ্যের ঘোষিত/আনুমানিক প্যাক-ওজন; LPG-র gross weight null (WhatsApp quote)।
  // deliveryWeightKg-তে মুদি পণ্যের ঘোষিত/আনুমানিক প্যাক-ওজন আছে; ২L তেল ≈ ২kg।
  // LPG-র gross cylinder weight যাচাই করা হয়নি বলে null—এগুলো null থাকলে cart WhatsApp quote চাইবে।
  const products = [
    { id: 'gas-omera-12', category: 'gas', subcategory: 'gas-12kg', name: 'Omera LPG', detail: '১২ কেজি • রিফিল', price: 1450, deliveryWeightKg: null, visual: 'gas', icon: '🛢️', badge: 'জনপ্রিয়', image: 'assets/products/omera-12kg-card.png', imageWebp: 'assets/products/omera-12kg-card.webp', imageAlt: 'Omera ১২ কেজি LPG সিলিন্ডারের ব্র্যান্ডের পণ্যছবি।', imageLabel: 'ব্র্যান্ডের ছবি', imageFit: 'contain' },
    { id: 'gas-bashundhara-12', category: 'gas', subcategory: 'gas-12kg', name: 'Bashundhara LPG', detail: '১২ কেজি • রিফিল', price: 1480, deliveryWeightKg: null, visual: 'gas', icon: '🛢️', badge: '', image: 'assets/products/bashundhara-12kg-card.png', imageWebp: 'assets/products/bashundhara-12kg-card.webp', imageAlt: 'Bashundhara ১২ কেজি LPG সিলিন্ডারের ব্র্যান্ডের পণ্যছবি।', imageLabel: 'ব্র্যান্ডের ছবি', imageFit: 'contain' },
    { id: 'gas-jamuna-12', category: 'gas', subcategory: 'gas-12kg', name: 'Jamuna LPG', detail: '১২ কেজি • রিফিল', price: 1430, deliveryWeightKg: null, visual: 'gas', icon: '🛢️', badge: '', image: 'assets/products/jamuna-12kg-card.png', imageWebp: 'assets/products/jamuna-12kg-card.webp', imageAlt: 'Jamuna ১২ কেজি LPG সিলিন্ডারের প্রতিনিধি পণ্যছবি; ছবিটি একটি খুচরা বিক্রেতার তালিকা থেকে নেওয়া।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'contain' },
    { id: 'gas-lpg-55', category: 'gas', subcategory: 'gas-small', name: 'LPG Cylinder', detail: '৫.৫ কেজি • ছোট সাইজ', price: 780, deliveryWeightKg: null, visual: 'gas', icon: '🛢️', badge: 'ছোট সাইজ', image: 'assets/products/omera-5.5kg-card.png', imageWebp: 'assets/products/omera-5.5kg-card.webp', imageAlt: 'Omera ৫.৫ কেজি LPG সিলিন্ডারের প্রতিনিধি ছবি; অর্ডারের ব্র্যান্ড মিলিয়ে নিন।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'contain' },
    { id: 'gas-lpg-22', category: 'gas', subcategory: 'gas-large', name: 'LPG Cylinder', detail: '২২ কেজি • বড় সাইজ', price: 2650, deliveryWeightKg: null, visual: 'gas', icon: '🛢️', badge: '', image: 'assets/products/lpg-bangladesh-reference-card.jpg', imageWebp: 'assets/products/lpg-bangladesh-reference-card.webp', imageAlt: 'বাংলাদেশে ব্যবহৃত LPG সিলিন্ডারের বাস্তব ছবি; ২২ কেজির নির্দিষ্ট ব্র্যান্ড বা মডেল নিশ্চিত নয়, এটি প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'contain' },
    { id: 'rice-miniket', category: 'grocery', subcategory: 'rice', name: 'মিনিকেট চাল', detail: '৫ কেজি প্যাক', price: 390, deliveryWeightKg: 5, visual: 'rice', icon: '🍚', badge: 'বাজারের পছন্দ', image: 'assets/products/rice-miniket.jpg', imageWebp: 'assets/products/rice-miniket.webp', imageAlt: 'কাঁচা সাদা চাল ও মাপার কাপের বাস্তব ছবি; মিনিকেট চালের প্রতিনিধি ছবি, প্যাকেজিং নয়।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'masoor-dal', category: 'grocery', subcategory: 'dal', name: 'মসুর ডাল', detail: '১ কেজি প্যাক', price: 150, deliveryWeightKg: 1, visual: 'lentil', icon: '🫘', badge: '', image: 'assets/products/masoor-dal-card.jpg', imageWebp: 'assets/products/masoor-dal-card.webp', imageAlt: 'বাটিতে কাঁচা লাল মসুর ডালের বাস্তব ছবি; প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'soybean-oil', category: 'grocery', subcategory: 'oil', name: 'সয়াবিন তেল', detail: '২ লিটার বোতল', price: 360, deliveryWeightKg: 2, visual: 'oil', icon: '🫒', badge: '', image: 'assets/products/soybean-oil.jpg', imageWebp: 'assets/products/soybean-oil.webp', imageAlt: 'সয়াবিন দানা ও সয়াবিন তেলের বাস্তব ছবি; ২ লিটারের বোতল বা ব্র্যান্ডের ছবি নয়।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'sugar', category: 'grocery', subcategory: 'daily', name: 'চিনি', detail: '১ কেজি প্যাক', price: 145, deliveryWeightKg: 1, visual: 'sugar', icon: '🍚', badge: '', image: 'assets/products/sugar.jpg', imageWebp: 'assets/products/sugar.webp', imageAlt: 'কাচের পাত্রে চিনির বাস্তব ছবি; ১ কেজি প্যাকের প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'atta', category: 'grocery', subcategory: 'daily', name: 'আটা', detail: '২ কেজি প্যাক', price: 130, deliveryWeightKg: 2, visual: 'flour', icon: '🌾', badge: '', image: 'assets/products/atta-card.jpg', imageWebp: 'assets/products/atta-card.webp', imageAlt: 'বাটিতে গমের আটা/ময়দার মতো গুঁড়ার বাস্তব ছবি; নির্দিষ্ট প্যাকের প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'potato', category: 'grocery', subcategory: 'daily', name: 'আলু', detail: '২ কেজি', price: 90, deliveryWeightKg: 2, visual: 'potato', icon: '🥔', badge: '', image: 'assets/products/potato.jpg', imageWebp: 'assets/products/potato.webp', imageAlt: 'কাঁচা আলুর বাস্তব ছবি; ২ কেজি আলুর প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' },
    { id: 'salt', category: 'grocery', subcategory: 'daily', name: 'আয়োডিনযুক্ত লবণ', detail: '১ কেজি প্যাক', price: 40, deliveryWeightKg: 1, visual: 'salt', icon: '🧂', badge: '', image: 'assets/products/iodized-salt-card.jpg', imageWebp: 'assets/products/iodized-salt-card.webp', imageAlt: 'সাদা খাবার লবণভরা কাচের সল্ট শেকারের বাস্তব ছবি; প্যাকেজিং নয়, প্রতিনিধি ছবি।', imageLabel: 'প্রতিনিধি ছবি', imageFit: 'cover' }
  ];

  // টিকার-বার্তা এখানে সম্পাদনা করুন; যাচাই করা মূল্য ছাড়া ছাড়/দামের দাবি দেখাবেন না।
  const dailyOffers = [
    { label: 'লোকাল ডেলিভারি', text: 'কলসি দিঘির পাড় ও আশপাশে হোম ডেলিভারি' },
    { label: 'পেমেন্ট', text: 'Cash on Delivery · bKash · Nagad (manual)' },
    { label: 'ডেলিভারি চার্জ', text: 'ওজন ও দূরত্ব অনুযায়ী অর্ডারের আগে নিশ্চিত করুন' },
    { label: 'গ্রাহকসেবা', text: 'পণ্য, স্টক ও মূল্য জানতে WhatsApp-এ যোগাযোগ করুন' }
  ];

  // আসল পণ্য ও যাচাই করা মূল্য/সময় বসানোর পর দৈনিক Flash Sale চালু করুন।
  const FLASH_SALE = {
    enabled: false,
    productId: 'rice-miniket',
    salePrice: 0,
    endTime: '23:59:59' // Asia/Dhaka local time
  };

  const productById = new Map(products.map((product) => [product.id, product]));
  const CART_KEY = 'dhruvo-express-cart-v1';
  let activeFilter = 'all';
  let toastTimer = null;
  let activeFlashSale = null;
  let flashSaleInterval = null;

  // ---------- Decap CMS কনটেন্ট: content/*.json লোড হলে ডিফল্ট মানের জায়গায় সেটি ব্যবহার হবে ----------
  const CONTENT_FILES = {
    settings: 'content/settings.json',
    sections: 'content/sections.json',
    flashSale: 'content/flash-sale.json',
    categories: 'content/categories.json',
    products: 'content/products.json'
  };
  const DEFAULT_CATEGORIES = [
    { id: 'all', label: 'সব পণ্য', subcategories: [] },
    { id: 'gas', label: 'Gas Cylinder', subcategories: [] },
    { id: 'grocery', label: 'Grocery Market', subcategories: [] }
  ];
  let categories = DEFAULT_CATEGORIES;
  let activeSubcategory = '';

  const productGrid = document.getElementById('product-grid');
  const searchInput = document.getElementById('product-search');
  const headerSearchInput = document.getElementById('header-search');
  const headerSearchForm = document.getElementById('header-search-form');
  const offerTrack = document.getElementById('offer-track');
  const emptyResults = document.getElementById('empty-results');
  const cartDialog = document.getElementById('cart-dialog');
  const checkoutDialog = document.getElementById('checkout-dialog');
  const successDialog = document.getElementById('success-dialog');
  const checkoutForm = document.getElementById('checkout-form');
  const toast = document.getElementById('toast');
  let cart = readCart();

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function money(amount) {
    return `৳ ${Number(amount || 0).toLocaleString('en-BD')}`;
  }

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(saved)) return [];
      const quantities = new Map();
      saved.forEach((row) => {
        if (!row || !productById.has(row.id)) return;
        const quantity = Math.max(1, Math.min(99, Math.floor(Number(row.quantity) || 1)));
        quantities.set(row.id, Math.min(99, (quantities.get(row.id) || 0) + quantity));
      });
      return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
    } catch (_error) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (_error) {
      // Private browsing/storage-disabled হলে কার্ট শুধু এই পেজ খোলা থাকা পর্যন্ত চলবে।
    }
  }

  function getCartRows() {
    return cart.map((row) => ({ product: productById.get(row.id), quantity: row.quantity }))
      .filter((row) => row.product);
  }

  function getSubtotal() {
    return getCartRows().reduce((total, row) => total + row.product.price * row.quantity, 0);
  }

  function getDeliveryQuote() {
    const rows = getCartRows();
    if (!rows.length) return { status: 'empty', weightKg: 0, fee: 0 };

    const unknownWeightRows = rows.filter(({ product }) => !Number.isFinite(product.deliveryWeightKg) || product.deliveryWeightKg <= 0);
    if (unknownWeightRows.length) {
      return { status: 'weight-unknown', weightKg: null, fee: null, products: unknownWeightRows.map(({ product }) => product.name) };
    }

    const weightKg = Math.round(rows.reduce((total, { product, quantity }) => total + product.deliveryWeightKg * quantity, 0) * 100) / 100;
    if (weightKg >= DELIVERY_POLICY.maximumOnlineWeightKg) return { status: 'over-limit', weightKg, fee: null };

    const tier = DELIVERY_POLICY.tiers.find((item) => weightKg <= item.maxKg);
    if (!tier) return { status: 'over-limit', weightKg, fee: null };
    return { status: 'estimated', weightKg, fee: tier.fee };
  }

  function formatWeight(weightKg) {
    return `${Number(weightKg).toLocaleString('bn-BD', { maximumFractionDigits: 2 })} কেজি`;
  }

  function buildDeliveryQuoteMessage(quote = getDeliveryQuote()) {
    const rows = getCartRows();
    const lines = [
      quote.status === 'over-limit'
        ? '৮০ কেজি বা বেশি ওজনের ডেলিভারি সম্ভব কি না জানতে চাই।'
        : quote.status === 'weight-unknown'
          ? 'LPG সিলিন্ডারসহ gross weight ও ডেলিভারি চার্জ জানতে চাই।'
          : 'আমার ঠিকানার দূরত্ব অনুযায়ী চূড়ান্ত ডেলিভারি চার্জ জানতে চাই।',
      '',
      'পণ্যের তালিকা:',
      ...rows.map(({ product, quantity }) => `• ${product.name} (${product.detail}) × ${quantity}`),
      `পণ্যের মূল্য: ${money(getSubtotal())}`,
      `ওজন: ${quote.weightKg === null ? 'গ্যাস সিলিন্ডারের gross weight নিশ্চিত করতে হবে' : `আনুমানিক ${formatWeight(quote.weightKg)}`}`,
      'দয়া করে এলাকা ও সিলিন্ডারসহ ওজন অনুযায়ী চূড়ান্ত ডেলিভারি চার্জ জানান।'
    ];
    return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(`আসসালামু আলাইকুম, Dhruvo Express কাস্টমার সার্ভিস।\n${lines.join('\n')}`)}`;
  }

  function getDhakaDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function getDhakaEndDate(time) {
    const endAt = new Date(`${getDhakaDateKey()}T${time}+06:00`);
    endAt.setMilliseconds(999);
    return endAt;
  }

  function prepareFlashSale() {
    const card = document.getElementById('hero-flash-sale');
    const product = productById.get(FLASH_SALE.productId);
    const salePrice = Number(FLASH_SALE.salePrice);
    const validEndTime = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(FLASH_SALE.endTime);
    if (!card || !FLASH_SALE.enabled || !product || !validEndTime || !Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= product.price) {
      if (card) card.hidden = true;
      return null;
    }

    const endAt = getDhakaEndDate(FLASH_SALE.endTime);
    if (endAt.getTime() <= Date.now()) {
      card.hidden = true;
      return null;
    }

    const originalPrice = product.price;
    product.regularPrice = originalPrice;
    product.price = salePrice;
    product.flashSaleActive = true;
    return {
      product,
      originalPrice,
      endAt,
      discountPercent: Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    };
  }

  function renderFlashSale() {
    const card = document.getElementById('hero-flash-sale');
    if (!card || !activeFlashSale) return;
    card.hidden = false;
    document.getElementById('flash-sale-product').textContent = activeFlashSale.product.name;
    document.getElementById('flash-sale-detail').textContent = activeFlashSale.product.detail;
    const saleImage = document.getElementById('flash-sale-image');
    const saleImageWebp = document.getElementById('flash-sale-image-webp');
    saleImage.src = activeFlashSale.product.image;
    if (saleImageWebp) saleImageWebp.srcset = activeFlashSale.product.imageWebp || activeFlashSale.product.image;
    saleImage.classList.toggle('is-contain', activeFlashSale.product.imageFit === 'contain');
    document.getElementById('flash-sale-price').textContent = money(activeFlashSale.product.price);
    document.getElementById('flash-sale-old-price').textContent = money(activeFlashSale.originalPrice);
    document.getElementById('flash-sale-discount').textContent = `${activeFlashSale.discountPercent}% ছাড়`;
    document.getElementById('flash-sale-status').textContent = 'আজকের বিশেষ দাম';
    updateFlashSaleCountdown();
    if (activeFlashSale) flashSaleInterval = window.setInterval(updateFlashSaleCountdown, 1000);
  }

  function updateFlashSaleCountdown() {
    if (!activeFlashSale) return;
    const remaining = activeFlashSale.endAt.getTime() - Date.now();
    const countdown = document.getElementById('flash-sale-countdown');
    if (remaining <= 0) {
      const endedSale = activeFlashSale;
      endedSale.product.price = endedSale.originalPrice;
      endedSale.product.flashSaleActive = false;
      delete endedSale.product.regularPrice;
      activeFlashSale = null;
      document.getElementById('hero-flash-sale').classList.add('is-expired');
      document.getElementById('flash-sale-status').textContent = 'আজকের সেল শেষ';
      document.getElementById('flash-sale-price').textContent = 'অফার শেষ';
      document.getElementById('flash-sale-old-price').hidden = true;
      document.getElementById('flash-sale-discount').hidden = true;
      countdown.textContent = 'সময় শেষ';
      const link = document.getElementById('flash-sale-cta');
      link.textContent = 'অন্যান্য পণ্য দেখুন →';
      link.href = '#shop';
      window.clearInterval(flashSaleInterval);
      renderProducts();
      renderCart();
      if (checkoutDialog.open) renderCheckoutSummary();
      return;
    }

    const secondsLeft = Math.floor(remaining / 1000);
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    const pad = (value) => new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: 2, useGrouping: false }).format(value);
    countdown.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function initWhatsAppWidget() {
    const widget = document.getElementById('whatsapp-widget');
    const toggle = document.getElementById('whatsapp-float-toggle');
    const panel = document.getElementById('whatsapp-panel');
    const closeButton = document.getElementById('whatsapp-panel-close');
    const serviceLink = document.getElementById('whatsapp-customer-service');
    const orderHelpLink = document.getElementById('whatsapp-order-help');
    if (!widget || !toggle || !panel) return;

    const linkFor = (message) => `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
    serviceLink.href = linkFor('আসসালামু আলাইকুম, Dhruvo Express কাস্টমার সার্ভিসে কথা বলতে চাই।');
    orderHelpLink.href = linkFor('আসসালামু আলাইকুম, অর্ডার বা পেমেন্ট নিয়ে সাহায্য চাই।');
    document.getElementById('whatsapp-call-link').href = `tel:+${STORE.whatsappNumber}`;

    const closePanel = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const opening = panel.hidden;
      panel.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      if (opening) serviceLink.focus();
    });
    if (closeButton) closeButton.addEventListener('click', closePanel);
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closePanel));
    document.addEventListener('click', (event) => {
      if (!widget.contains(event.target)) closePanel();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        closePanel();
        toggle.focus();
      }
    });
  }

  function initEmailContactForm() {
    const form = document.getElementById('email-contact-form');
    if (!form) return;
    const status = document.getElementById('contact-form-status');
    const fallback = document.getElementById('contact-form-fallback');
    const whatsappLink = document.getElementById('contact-form-whatsapp');
    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button.innerHTML;
    const ajaxEndpoint = form.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
    const showStatus = (kind, message) => {
      status.hidden = false;
      status.className = `contact-form-status is-${kind}`;
      status.innerHTML = message;
    };
    const buildWhatsApp = (data) => {
      const text = [
        '*Dhruvo Express — ওয়েবসাইট বার্তা*',
        `নাম: ${data.name || ''}`,
        `ইমেইল: ${data.email || ''}`,
        `বিষয়: ${data.subject || ''}`,
        '',
        data.message || ''
      ].join('\n');
      return `https://wa.me/8801619831653?text=${encodeURIComponent(text)}`;
    };
    // AJAX ব্যর্থ হলে আড়াল-ফ্রেমে সাধারণ POST — CORS/AJAX-এর ঝামেলা এড়িয়ে বার্তা পৌঁছে দেওয়ার দ্বিতীয় সুযোগ।
    const submitViaFrame = (data) => new Promise((resolve) => {
      let frame = document.getElementById('contact-form-frame');
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = 'contact-form-frame';
        frame.name = 'contact-form-frame';
        frame.style.display = 'none';
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;
        document.body.appendChild(frame);
      }
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        frame.onload = null;
        frame.onerror = null;
        resolve(ok);
      };
      // আড়াল-ফ্রেমের POST পাঠানো গেলেই FormSubmit বার্তা গ্রহণ করে (অ্যাকটিভেশন বার্তা দিলেও)।
      const timer = window.setTimeout(() => finish(true), 6000);
      frame.onload = () => finish(true);
      frame.onerror = () => finish(false);
      const temp = document.createElement('form');
      temp.action = form.action;
      temp.method = 'POST';
      temp.target = 'contact-form-frame';
      temp.style.display = 'none';
      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value == null ? '' : String(value);
        temp.appendChild(input);
      });
      document.body.appendChild(temp);
      temp.submit();
      window.setTimeout(() => temp.remove(), 1500);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      // Honeypot: FormSubmit silently ignores submissions with this field filled.
      if (form.elements._honey && form.elements._honey.value) return;

      const data = Object.fromEntries(new FormData(form));
      if (!data.email) return;
      data._replyto = data.email;
      if (whatsappLink) whatsappLink.href = buildWhatsApp(data);

      button.disabled = true;
      button.textContent = 'পাঠানো হচ্ছে…';
      fallback.hidden = true;
      showStatus('pending', 'আপনার বার্তা পাঠানো হচ্ছে…');

      let delivered = false;
      try {
        // FormSubmit মাঝে মাঝে কোনো উত্তরই দেয় না—তাই ৬ সেকেন্ডের সময়সীমা।
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 6000);
        const response = await fetch(ajaxEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        window.clearTimeout(timeoutId);
        const result = await response.json().catch(() => ({}));
        delivered = response.ok && String(result.success) === 'true';
      } catch (error) {
        delivered = false;
      }

      // প্রথম চেষ্টা সফল না হলে আড়াল-ফ্রেমে দ্বিতীয় চেষ্টা (ইন্টারনেট থাকলে)।
      if (!delivered && navigator.onLine !== false) {
        delivered = await submitViaFrame(data).catch(() => false);
      }

      if (delivered) {
        form.reset();
        fallback.hidden = true;
        showStatus('success', 'ধন্যবাদ! আপনার বার্তা জমা হয়েছে। আমরা ইমেইলে অথবা WhatsApp-এ যোগাযোগ করব।');
      } else {
        showStatus('error', 'বার্তা পাঠানো যায়নি। দয়া করে নিচের <strong>“WhatsApp করুন”</strong> বোতামটি চাপুন—আপনার লেখা বার্তাটি সেখানে তৈরি হয়ে যাবে, অথবা <strong>কল করুন</strong>।');
        fallback.hidden = false;
      }
      button.disabled = false;
      button.innerHTML = buttonLabel;
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2700);
  }

  function productCard(product) {
    const categoryLabel = product.category === 'gas' ? 'গ্যাস সিলিন্ডার' : 'মুদি বাজার';
    const badge = product.flashSaleActive
      ? `<span class="product-badge product-badge--flash">ফ্ল্যাশ সেল</span>`
      : product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : '';
    const priceLabel = product.flashSaleActive ? 'ফ্ল্যাশ দাম' : 'দাম';
    const priceValue = PRICING.verified
      ? `<strong class="product-price">${money(product.price)}</strong>`
      : `<strong class="product-price product-price--pending">WhatsApp-এ যাচাই করুন</strong>`;
    return `
      <article class="product-card" id="product-card-${escapeHTML(product.id)}">
        <div class="product-photo-wrap product-photo-wrap--${escapeHTML(product.imageFit || 'cover')} product-photo-wrap--${escapeHTML(product.category)}">
          <picture class="product-picture"><source srcset="${escapeHTML(product.imageWebp || product.image)}" type="image/webp"><img class="product-photo" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.imageAlt)}" loading="lazy" decoding="async" width="900" height="600"></picture>
          <span class="product-image-label" aria-hidden="true">${escapeHTML(product.imageLabel || 'প্রতিনিধি ছবি')}</span>
        </div>
        <div class="product-content">
          <div class="product-tag-row"><span class="product-category">${categoryLabel}</span>${badge}</div>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="product-detail">${escapeHTML(product.detail)}</p>
          <div class="product-buy-row">
            <div><span class="product-price-label">${priceLabel}</span>${priceValue}</div>
            <button class="add-button" type="button" data-add="${escapeHTML(product.id)}" aria-label="${escapeHTML(product.name)} কার্টে যোগ করুন">
              <span aria-hidden="true">＋</span> কার্টে যোগ করুন
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderOfferTicker() {
    const loop = [...dailyOffers, ...dailyOffers];
    offerTrack.innerHTML = loop.map((offer) => `
      <span class="offer-item"><strong>${escapeHTML(offer.label)}</strong><span>${escapeHTML(offer.text)}</span></span>
    `).join('<span class="offer-separator" aria-hidden="true">✦</span>');
    document.getElementById('offer-accessible-text').textContent = `Dhruvo Express-এর আপডেট: ${dailyOffers.map((offer) => `${offer.label} — ${offer.text}`).join('। ')}।`;
  }

  function initMapFallback() {
    const mapFrame = document.getElementById('google-map');
    const fallback = document.getElementById('map-fallback');
    if (!mapFrame || !fallback) return;

    const showFallback = () => {
      mapFrame.hidden = true;
      fallback.hidden = false;
    };
    if (!navigator.onLine) {
      showFallback();
      return;
    }

    // In offline/sandbox previews, Google Maps cannot be reached. Replace the
    // broken frame with a local, readable area card while keeping the Maps link.
    let checked = false;
    const probe = new Image();
    const timeout = window.setTimeout(() => {
      if (!checked) showFallback();
    }, 6500);
    probe.onload = () => {
      checked = true;
      window.clearTimeout(timeout);
    };
    probe.onerror = () => {
      checked = true;
      window.clearTimeout(timeout);
      showFallback();
    };
    probe.src = `https://www.google.com/favicon.ico?dhruvo-map-check=${Date.now()}`;
  }

  // ---------- CMS: কনটেন্ট লোড ও প্রয়োগ ----------
  function setCMSText(selector, value) {
    if (typeof value !== 'string' || !value.trim()) return;
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function setCMSRich(selector, text, emphasis) {
    const element = document.querySelector(selector);
    if (!element) return;
    const parts = [];
    if (typeof text === 'string' && text.trim()) parts.push(escapeHTML(text));
    if (typeof emphasis === 'string' && emphasis.trim()) parts.push(`<em>${escapeHTML(emphasis)}</em>`);
    if (parts.length) element.innerHTML = parts.join('<br>');
  }

  function applySettings(data) {
    if (data.store) {
      Object.assign(STORE, {
        whatsappNumber: data.store.whatsappNumber || STORE.whatsappNumber,
        paymentDisplayNumber: data.store.paymentDisplayNumber || STORE.paymentDisplayNumber
      });
    }
    if (data.delivery) {
      if (Array.isArray(data.delivery.tiers) && data.delivery.tiers.length) {
        DELIVERY_POLICY.tiers = data.delivery.tiers
          .map((tier) => ({ maxKg: Number(tier.maxKg), fee: Number(tier.fee) }))
          .filter((tier) => Number.isFinite(tier.maxKg) && Number.isFinite(tier.fee));
      }
      if (Number.isFinite(Number(data.delivery.maximumOnlineWeightKg))) {
        DELIVERY_POLICY.maximumOnlineWeightKg = Number(data.delivery.maximumOnlineWeightKg);
      }
    }
    if (data.pricing && typeof data.pricing.verified === 'boolean') PRICING.verified = data.pricing.verified;
    if (Array.isArray(data.ticker) && data.ticker.length) dailyOffers.splice(0, dailyOffers.length, ...data.ticker);
    if (data.hero) {
      setCMSRich('#home .hero-copy h1', data.hero.title, data.hero.titleEm);
      setCMSText('#home .hero-description', data.hero.description);
      const kicker = document.querySelector('#home .hero-kicker');
      if (kicker && typeof data.hero.kicker === 'string' && data.hero.kicker.trim()) {
        const [first, ...rest] = data.hero.kicker.split('|').map((part) => part.trim());
        kicker.innerHTML = `<span class="live-dot" aria-hidden="true"></span> ${escapeHTML(first)}${rest.length ? ` <span class="kicker-divider">|</span> ${escapeHTML(rest.join(' | '))}` : ''}`;
      }
    }
    if (typeof data.footerNote === 'string') setCMSText('.footer-demo-note', data.footerNote);
  }

  function applyFlashSaleData(data) {
    FLASH_SALE.enabled = Boolean(data.enabled);
    FLASH_SALE.productId = data.productId || '';
    FLASH_SALE.salePrice = Number(data.salePrice) || 0;
    FLASH_SALE.endTime = data.endTime || '23:59:59';
    setCMSText('#flash-sale-heading', data.title);
    setCMSText('#flash-sale-status', data.note);
    const cta = document.getElementById('flash-sale-cta');
    if (cta && typeof data.ctaText === 'string' && data.ctaText.trim()) {
      cta.innerHTML = `${escapeHTML(data.ctaText)} <span aria-hidden="true">↗</span>`;
    }
  }

  function applyCategoriesData(data) {
    if (!Array.isArray(data.categories) || !data.categories.length) return;
    const cleaned = data.categories
      .filter((category) => category && category.id)
      .map((category) => ({
        id: String(category.id),
        label: category.label || String(category.id),
        subcategories: (category.subcategories || []).filter((sub) => sub && sub.id).map((sub) => ({ id: String(sub.id), label: sub.label || String(sub.id) }))
      }));
    categories = [{ id: 'all', label: 'সব পণ্য', subcategories: [] }, ...cleaned];
  }

  function normalizeProduct(entry) {
    const weight = entry.deliveryWeightKg === '' || entry.deliveryWeightKg === null || entry.deliveryWeightKg === undefined
      ? null : Number(entry.deliveryWeightKg);
    return {
      id: String(entry.id || `product-${Math.random().toString(36).slice(2, 8)}`),
      category: entry.category || 'grocery',
      subcategory: entry.subcategory || '',
      name: entry.name || 'পণ্য',
      detail: entry.detail || '',
      price: Number(entry.price) || 0,
      deliveryWeightKg: Number.isFinite(weight) ? weight : null,
      visual: entry.visual || 'grocery',
      icon: entry.icon || '📦',
      badge: entry.badge || '',
      image: entry.image || 'assets/products/rice-miniket.jpg',
      imageWebp: entry.imageWebp || '',
      imageAlt: entry.imageAlt || '',
      imageLabel: entry.imageLabel || 'প্রতিনিধি ছবি',
      imageFit: entry.imageFit === 'contain' ? 'contain' : 'cover'
    };
  }

  function applyProductsData(data) {
    if (!Array.isArray(data.products) || !data.products.length) return;
    const loaded = data.products.map(normalizeProduct);
    products.splice(0, products.length, ...loaded);
    productById.clear();
    products.forEach((product) => productById.set(product.id, product));
  }

  function renderQuickValues(items) {
    const grid = document.querySelector('.quick-values .values-grid');
    if (!grid) return;
    grid.innerHTML = items.map((item) => `<div class="value-item"><span class="value-icon">${escapeHTML(item.icon || '✓')}</span><div><strong>${escapeHTML(item.title || '')}</strong><small>${escapeHTML(item.text || '')}</small></div></div>`).join('');
  }

  function renderSteps(items) {
    const grid = document.querySelector('.steps-section .steps-grid');
    if (!grid) return;
    grid.innerHTML = items.map((step) => `<article class="step-card"><span class="step-number">${escapeHTML(step.number || '')}</span><span class="step-icon" aria-hidden="true">${escapeHTML(step.icon || '✓')}</span><h3>${escapeHTML(step.title || '')}</h3><p>${escapeHTML(step.text || '')}</p></article>`).join('');
  }

  function renderFaqs(items) {
    const list = document.querySelector('.faq-section .faq-list');
    if (!list) return;
    list.innerHTML = items.map((faq) => `<details><summary>${escapeHTML(faq.question || '')}<span aria-hidden="true">＋</span></summary><p>${escapeHTML(faq.answer || '')}</p></details>`).join('');
  }

  function applySectionsData(data) {
    if (Array.isArray(data.quickValues) && data.quickValues.length) renderQuickValues(data.quickValues);
    if (Array.isArray(data.steps) && data.steps.length) renderSteps(data.steps);
    if (Array.isArray(data.faqs) && data.faqs.length) renderFaqs(data.faqs);
    if (data.services) {
      setCMSText('#services .eyebrow', data.services.eyebrow);
      setCMSRich('#services .section-heading h2', data.services.title, data.services.titleEm);
      setCMSText('#services .section-intro-copy', data.services.intro);
    }
    if (data.shop) {
      setCMSText('#shop .eyebrow', data.shop.eyebrow);
      setCMSRich('#shop .section-heading h2', data.shop.title, data.shop.titleEm);
      setCMSText('#shop .section-intro-copy', data.shop.intro);
      setCMSText('#shop .catalog-note > span:not(.note-alert)', data.shop.catalogNote);
    }
    if (data.coverage) {
      setCMSText('#coverage .eyebrow', data.coverage.eyebrow);
      setCMSRich('#coverage .coverage-copy h2', data.coverage.title, data.coverage.titleEm);
      setCMSText('#coverage .coverage-copy > p:not(.eyebrow)', data.coverage.body);
      setCMSText('#coverage .map-area-label strong', data.coverage.areaName);
      setCMSText('#coverage .map-area-label small', data.coverage.areaNote);
      const coverageButton = document.querySelector('#coverage .coverage-copy .button');
      if (coverageButton && typeof data.coverage.buttonText === 'string' && data.coverage.buttonText.trim()) {
        coverageButton.innerHTML = `${escapeHTML(data.coverage.buttonText)} <span aria-hidden="true">↗</span>`;
      }
    }
    if (data.faqIntro) {
      setCMSText('#faq .faq-intro .eyebrow', data.faqIntro.eyebrow);
      setCMSRich('#faq .faq-intro h2', data.faqIntro.title, data.faqIntro.titleEm);
      setCMSText('#faq .faq-intro > p:not(.eyebrow)', data.faqIntro.body);
    }
    if (data.contact) {
      setCMSText('#contact .eyebrow', data.contact.eyebrow);
      setCMSRich('#contact h2', data.contact.title, data.contact.titleEm);
      setCMSText('#contact .contact-copy > p:not(.eyebrow)', data.contact.body);
    }
  }

  function renderCategoryFilters() {
    const tabs = document.getElementById('filter-tabs');
    const subtabs = document.getElementById('filter-subtabs');
    if (!tabs) return;
    tabs.innerHTML = categories.map((category) => `<button class="filter-pill${category.id === activeFilter ? ' is-active' : ''}" type="button" data-filter="${escapeHTML(category.id)}" aria-pressed="${category.id === activeFilter}">${escapeHTML(category.label)}</button>`).join('');
    if (!subtabs) return;
    const active = categories.find((category) => category.id === activeFilter);
    const subs = (active && active.subcategories) || [];
    const usedSubs = new Set(products.filter((product) => product.category === activeFilter && product.subcategory).map((product) => product.subcategory));
    const visibleSubs = subs.filter((sub) => usedSubs.has(sub.id));
    if (!visibleSubs.length) { subtabs.innerHTML = ''; subtabs.hidden = true; return; }
    subtabs.hidden = false;
    subtabs.innerHTML = `<button class="filter-subpill${!activeSubcategory ? ' is-active' : ''}" type="button" data-subfilter="" aria-pressed="${!activeSubcategory}">সব</button>` +
      visibleSubs.map((sub) => `<button class="filter-subpill${activeSubcategory === sub.id ? ' is-active' : ''}" type="button" data-subfilter="${escapeHTML(sub.id)}" aria-pressed="${activeSubcategory === sub.id}">${escapeHTML(sub.label)}</button>`).join('');
  }

  async function loadCMSContent() {
    const entries = await Promise.all(Object.entries(CONTENT_FILES).map(async ([key, path]) => {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${path} — HTTP ${response.status}`);
      return [key, await response.json()];
    }));
    const apply = {
      settings: applySettings,
      flashSale: applyFlashSaleData,
      categories: applyCategoriesData,
      products: applyProductsData,
      sections: applySectionsData
    };
    entries.forEach(([key, data]) => {
      try { apply[key](data); }
      catch (error) { if (window.console) window.console.warn('[Dhruvo Express] কনটেন্ট প্রয়োগ করা যায়নি:', key, error); }
    });
  }

  function renderProducts() {
    const query = (searchInput.value || '').trim().toLocaleLowerCase();
    const visible = products.filter((product) => {
      const categoryMatches = activeFilter === 'all' || product.category === activeFilter;
      const subcategoryMatches = !activeSubcategory || product.subcategory === activeSubcategory;
      const searchMatches = !query || `${product.name} ${product.detail} ${product.category} ${product.subcategory || ''}`.toLocaleLowerCase().includes(query);
      return categoryMatches && subcategoryMatches && searchMatches;
    });
    productGrid.innerHTML = visible.map(productCard).join('');
    emptyResults.hidden = visible.length !== 0;
  }

  function setFilter(filter) {
    activeFilter = filter;
    activeSubcategory = '';
    document.querySelectorAll('.filter-pill').forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderCategoryFilters();
    renderProducts();
  }

  function setSubcategory(subcategory) {
    activeSubcategory = subcategory;
    renderCategoryFilters();
    renderProducts();
  }

  function renderCart() {
    const rows = getCartRows();
    const itemCount = rows.reduce((count, row) => count + row.quantity, 0);
    document.getElementById('cart-count').textContent = String(itemCount);
    document.getElementById('cart-open').setAttribute('aria-label', `কার্ট খুলুন, ${itemCount}টি পণ্য`);

    const emptyState = document.getElementById('cart-empty');
    const cartItems = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const clearButton = document.getElementById('cart-clear');
    emptyState.hidden = rows.length > 0;
    cartItems.hidden = rows.length === 0;
    summary.hidden = rows.length === 0;
    clearButton.hidden = rows.length === 0;

    cartItems.innerHTML = rows.length ? `<p class="cart-edit-tip">“＋” চাপলে পরিমাণ বাড়বে, “−” চাপলে কমবে। একক পণ্য সরাতে নিচের “এই পণ্যটি কার্ট থেকে সরান” চাপুন।</p>` + rows.map(({ product, quantity }) => `
      <article class="cart-line">
        <div class="cart-line-art" aria-hidden="true">${escapeHTML(product.icon)}</div>
        <div>
          <h3>${escapeHTML(product.name)}</h3>
          <p class="cart-line-detail">${escapeHTML(product.detail)}${PRICING.verified ? ` · ${money(product.price)} / একক` : ' · দাম WhatsApp-এ যাচাই করুন'}</p>
          <div class="quantity-controls" aria-label="${escapeHTML(product.name)}-এর পরিমাণ নিয়ন্ত্রণ">
            <button type="button" data-qty="-1" data-id="${escapeHTML(product.id)}" aria-label="${escapeHTML(product.name)} একটি কমান">−</button>
            <span aria-live="polite">${quantity}</span>
            <button type="button" data-qty="1" data-id="${escapeHTML(product.id)}" aria-label="${escapeHTML(product.name)} একটি বাড়ান">＋</button>
          </div>
          <button class="remove-item" type="button" data-remove="${escapeHTML(product.id)}">এই পণ্যটি কার্ট থেকে সরান</button>
        </div>
        ${PRICING.verified ? `<strong class="cart-line-total">${money(product.price * quantity)}</strong>` : ''}
      </article>`).join('') : '';

    const subtotal = getSubtotal();
    const quote = getDeliveryQuote();
    const checkoutButton = document.getElementById('checkout-open');
    const quoteButton = document.getElementById('cart-service-quote');
    document.querySelectorAll('[data-price-only]').forEach((row) => { row.hidden = !PRICING.verified; });
    document.getElementById('cart-subtotal').textContent = money(subtotal);
    checkoutButton.hidden = quote.status !== 'estimated';
    checkoutButton.disabled = quote.status !== 'estimated';
    quoteButton.hidden = quote.status === 'empty';
    quoteButton.href = buildDeliveryQuoteMessage(quote);

    if (quote.status === 'estimated') {
      document.getElementById('cart-delivery').textContent = `${money(quote.fee)} (ওজনভিত্তিক)`;
      document.getElementById('cart-total').textContent = `${money(subtotal + quote.fee)}*`;
      checkoutButton.hidden = false;
      quoteButton.textContent = 'WhatsApp-এ দূরত্বের চার্জ নিশ্চিত করুন ↗';
      document.getElementById('cart-fee-note').textContent = `আনুমানিক প্যাকেট ওজন ${formatWeight(quote.weightKg)} → ওজনভিত্তিক হিসাব ${money(quote.fee)}। প্যাকের প্রকৃত gross weight ও ঠিকানার দূরত্ব যাচাই করে চূড়ান্ত চার্জ WhatsApp-এ নিশ্চিত হবে।${PRICING.verified ? '' : ' পণ্যের বর্তমান দামও WhatsApp-এ নিশ্চিত হবে।'}`;
    } else if (quote.status === 'over-limit') {
      document.getElementById('cart-delivery').textContent = '৮০ কেজি বা বেশি';
      document.getElementById('cart-total').textContent = 'অনলাইন অর্ডার বন্ধ';
      document.getElementById('cart-fee-note').textContent = `আনুমানিক প্যাকেট ওজন ${formatWeight(quote.weightKg)}। ৮০ কেজি বা বেশি অর্ডারে অনলাইন checkout নেওয়া হচ্ছে না; কাস্টমার সার্ভিসে যোগাযোগ করুন।`;
      quoteButton.textContent = 'WhatsApp-এ কাস্টমার সার্ভিসে যোগাযোগ করুন ↗';
    } else if (quote.status === 'weight-unknown') {
      document.getElementById('cart-delivery').textContent = 'WhatsApp-এ কোট নিন';
      document.getElementById('cart-total').textContent = `${money(subtotal)} + ডেলিভারি কোট`;
      document.getElementById('cart-fee-note').textContent = 'এই LPG সিলিন্ডারের gross ওজন (সিলিন্ডারসহ) এখনো নির্ধারিত নয়; অনলাইন checkout-এর আগে কাস্টমার সার্ভিসে ডেলিভারি চার্জ নিশ্চিত করুন।';
      quoteButton.textContent = 'WhatsApp-এ ডেলিভারি কোট নিন ↗';
    } else {
      document.getElementById('cart-delivery').textContent = '৳ 0';
      document.getElementById('cart-total').textContent = money(subtotal);
      document.getElementById('cart-fee-note').textContent = 'কার্টে পণ্য যোগ হলে ওজন অনুযায়ী ডেলিভারি চার্জ দেখানো হবে।';
    }
  }

  function addProduct(id, quantity = 1) {
    if (!productById.has(id)) return;
    const found = cart.find((row) => row.id === id);
    if (found) found.quantity = Math.min(99, found.quantity + quantity);
    else cart.push({ id, quantity: Math.min(99, quantity) });
    saveCart();
    renderCart();
  }

  function updateQuantity(id, delta) {
    const row = cart.find((item) => item.id === id);
    if (!row) return;
    row.quantity += delta;
    if (row.quantity <= 0) cart = cart.filter((item) => item.id !== id);
    else row.quantity = Math.min(99, row.quantity);
    saveCart();
    renderCart();
  }

  function renderCheckoutSummary() {
    const rows = getCartRows();
    document.getElementById('checkout-summary-items').innerHTML = rows.map(({ product, quantity }) => `
      <div class="checkout-summary-item">
        <span>${escapeHTML(product.name)}<small>${escapeHTML(product.detail)} × ${quantity}</small></span>
        ${PRICING.verified ? `<strong>${money(product.price * quantity)}</strong>` : ''}
      </div>`).join('');
    const subtotal = getSubtotal();
    const quote = getDeliveryQuote();
    document.querySelectorAll('[data-price-only]').forEach((row) => { row.hidden = !PRICING.verified; });
    document.getElementById('checkout-price-note').hidden = PRICING.verified;
    document.getElementById('checkout-subtotal').textContent = money(subtotal);
    document.getElementById('checkout-delivery').textContent = `${money(quote.fee)} (ওজনভিত্তিক)`;
    document.getElementById('checkout-total').textContent = `${money(subtotal + quote.fee)}*`;
    document.getElementById('checkout-shipping-note').textContent = `আনুমানিক প্যাকেট ওজন ${formatWeight(quote.weightKg)}; ওজনভিত্তিক হিসাব ${money(quote.fee)}। প্যাকের প্রকৃত gross weight ও ঠিকানার দূরত্ব যাচাই করে চূড়ান্ত ফি WhatsApp-এ নিশ্চিত হবে।${PRICING.verified ? '' : ' পণ্যের বর্তমান দাম ও মোটও WhatsApp-এ নিশ্চিত হবে।'}`;
  }

  function updatePaymentFields() {
    const selected = document.querySelector('input[name="payment"]:checked');
    const payment = selected ? selected.value : 'cod';
    const manual = payment === 'bkash' || payment === 'nagad';
    const box = document.getElementById('manual-payment-fields');
    const senderPhone = checkoutForm.elements.senderPhone;
    const trxId = checkoutForm.elements.trxId;

    box.hidden = !manual;
    senderPhone.disabled = !manual;
    senderPhone.required = manual;
    trxId.disabled = !manual;
    trxId.required = manual;
    const walletName = payment === 'nagad' ? 'Nagad' : 'bKash';
    document.getElementById('wallet-name').textContent = walletName;
    document.getElementById('wallet-logo').src = payment === 'nagad' ? 'assets/nagad-logo.svg' : 'assets/bkash-logo.svg';
    document.getElementById('wallet-logo').alt = `${walletName} logo`;
    document.getElementById('merchant-number').textContent = STORE.paymentDisplayNumber;
  }

  function openCart() {
    renderCart();
    if (!cartDialog.open) cartDialog.showModal();
  }

  // Product filters and search
  document.querySelectorAll('.filter-pill').forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => setFilter(link.dataset.filterLink));
  });
  searchInput.addEventListener('input', () => {
    headerSearchInput.value = searchInput.value;
    renderProducts();
  });
  headerSearchInput.addEventListener('input', () => {
    searchInput.value = headerSearchInput.value;
    renderProducts();
  });
  headerSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchInput.value = headerSearchInput.value;
    setFilter('all');
    renderProducts();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    addProduct(button.dataset.add);
    const product = productById.get(button.dataset.add);
    showToast(`${product ? product.name : 'পণ্য'} কার্টে যোগ হয়েছে`);
  });

  document.getElementById('add-monthly-pack').addEventListener('click', () => {
    ['rice-miniket', 'masoor-dal', 'soybean-oil', 'sugar', 'atta'].forEach((id) => addProduct(id));
    showToast('৫টি বেসিক মুদি পণ্য কার্টে যোগ হয়েছে');
  });

  document.getElementById('flash-sale-cta').addEventListener('click', (event) => {
    if (!activeFlashSale) return;
    event.preventDefault();
    searchInput.value = '';
    headerSearchInput.value = '';
    const product = activeFlashSale.product;
    setFilter(product.category);
    window.setTimeout(() => document.getElementById(`product-card-${product.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
  });

  // Cart controls
  document.getElementById('cart-open').addEventListener('click', openCart);
  document.getElementById('cart-clear').addEventListener('click', () => {
    if (!cart.length) return;
    if (!window.confirm('কার্টের সব পণ্য একসাথে সরিয়ে কার্ট খালি করবেন?')) return;
    cart = [];
    saveCart();
    renderCart();
    showToast('কার্টের সব পণ্য সরানো হয়েছে');
  });
  document.getElementById('cart-items').addEventListener('click', (event) => {
    const quantityButton = event.target.closest('[data-qty]');
    const removeButton = event.target.closest('[data-remove]');
    if (quantityButton) updateQuantity(quantityButton.dataset.id, Number(quantityButton.dataset.qty));
    if (removeButton) {
      const removed = productById.get(removeButton.dataset.remove);
      cart = cart.filter((row) => row.id !== removeButton.dataset.remove);
      saveCart();
      renderCart();
      if (removed) showToast(`${removed.name} কার্ট থেকে সরানো হয়েছে`);
    }
  });
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.close);
      if (dialog && dialog.open) dialog.close();
    });
  });
  document.querySelectorAll('[data-scroll-shop]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }));
  });

  document.getElementById('checkout-open').addEventListener('click', () => {
    if (!getCartRows().length) {
      showToast('চেকআউটের আগে কার্টে পণ্য যোগ করুন');
      return;
    }
    if (getDeliveryQuote().status !== 'estimated') {
      showToast('ডেলিভারি চার্জ নিশ্চিত করতে WhatsApp-এ যোগাযোগ করুন');
      return;
    }
    renderCheckoutSummary();
    cartDialog.close();
    checkoutDialog.showModal();
  });

  // Mobile navigation
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'মেনু খুলুন' : 'মেনু বন্ধ করুন');
    mainNav.classList.toggle('is-open', !expanded);
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'মেনু খুলুন');
    });
  });

  // Manual bKash / Nagad fields
  document.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener('change', updatePaymentFields);
  });
  updatePaymentFields();

  document.getElementById('copy-number').addEventListener('click', async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(STORE.paymentDisplayNumber);
        copied = true;
      } else {
        const temporary = document.createElement('textarea');
        temporary.value = STORE.paymentDisplayNumber;
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.appendChild(temporary);
        temporary.select();
        copied = document.execCommand('copy');
        temporary.remove();
      }
    } catch (_error) {
      copied = false;
    }
    showToast(copied ? 'পেমেন্ট নম্বর কপি হয়েছে' : `পেমেন্ট নম্বর: ${STORE.paymentDisplayNumber}`);
  });

  // Build a WhatsApp message from the form. A static GitHub Pages site can open
  // the prefilled message, but the customer must press Send inside WhatsApp.
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) return;
    const rows = getCartRows();
    if (!rows.length) {
      checkoutDialog.close();
      showToast('আপনার কার্ট খালি—পণ্য যোগ করে আবার চেষ্টা করুন');
      return;
    }

    const formData = new FormData(checkoutForm);
    const customerName = String(formData.get('customerName') || '').trim();
    const customerPhone = String(formData.get('customerPhone') || '').trim();
    const address = String(formData.get('address') || '').trim();
    const payment = String(formData.get('payment') || 'cod');
    const paymentLabels = {
      cod: 'Cash on Delivery (COD)',
      bkash: 'bKash — ম্যানুয়াল পেমেন্ট',
      nagad: 'Nagad — ম্যানুয়াল পেমেন্ট'
    };
    const subtotal = getSubtotal();
    const quote = getDeliveryQuote();
    if (quote.status !== 'estimated') {
      checkoutDialog.close();
      showToast('সিলিন্ডারসহ ওজন বা delivery limit নিশ্চিত করতে WhatsApp-এ যোগাযোগ করুন');
      return;
    }
    const fee = quote.fee;
    const total = subtotal + fee;
    const reference = `DEX-${String(Date.now()).slice(-7)}`;
    const time = new Intl.DateTimeFormat('bn-BD', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dhaka'
    }).format(new Date());

    const message = [
      '🛍️ নতুন অর্ডার — Dhruvo Express / ধ্রুব এক্সপ্রেস',
      `রেফারেন্স: ${reference}`,
      `সময়: ${time}`,
      '',
      'পণ্যের তালিকা:',
      ...rows.map(({ product, quantity }) => `• ${product.name} (${product.detail}) × ${quantity}${PRICING.verified ? ` = ${money(product.price * quantity)}` : ''}`),
      '',
      ...(PRICING.verified
        ? [
            `পণ্যের মূল্য: ${money(subtotal)}`,
            `সর্বমোট (দূরত্বের চার্জ নিশ্চিত হওয়ার আগে আনুমানিক): ${money(total)}`
          ]
        : ['পণ্যের বর্তমান দাম ও চূড়ান্ত মোট: WhatsApp-এ নিশ্চিত করুন।']),
      `আনুমানিক ওজনভিত্তিক ডেলিভারি চার্জ: ${money(fee)}`,
      `আনুমানিক প্যাকেট ওজন: ${formatWeight(quote.weightKg)}`, 
      'ঠিকানার দূরত্ব অনুযায়ী চূড়ান্ত ডেলিভারি ফি কাস্টমার সার্ভিস নিশ্চিত করবে। MFS payment-এর আগে চূড়ান্ত চার্জ নিশ্চিত করুন।',
      '',
      `কাস্টমারের নাম: ${customerName}`,
      `ফোন নম্বর: ${customerPhone}`,
      `ডেলিভারি ঠিকানা: ${address}`,
      `পেমেন্ট পদ্ধতি: ${paymentLabels[payment] || paymentLabels.cod}`,
      ...(payment === 'cod' ? [] : [
        `পেমেন্ট নম্বর: ${STORE.paymentDisplayNumber}`,
        `প্রেরক নম্বর: ${String(formData.get('senderPhone') || '').trim()}`,
        `Transaction ID (TrxID): ${String(formData.get('trxId') || '').trim()}`
      ])
    ].join('\n');

    const whatsappUrl = `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
    document.getElementById('whatsapp-fallback-link').href = whatsappUrl;
    document.getElementById('success-reference').textContent = reference;

    // This runs directly from the customer's submit click. The fallback link
    // remains available if the browser blocks opening a new tab.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    checkoutDialog.close();
    successDialog.showModal();
    checkoutForm.reset();
    updatePaymentFields();
  });

  document.getElementById('order-sent-button').addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCart();
    if (successDialog.open) successDialog.close();
    showToast('ধন্যবাদ! WhatsApp-এ অর্ডার পাঠানোর জন্য।');
  });

  // Close an open mobile menu when the user presses Escape outside a dialog.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open') && !cartDialog.open && !checkoutDialog.open && !successDialog.open) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'মেনু খুলুন');
    }
  });

  document.getElementById('current-year').textContent = String(new Date().getFullYear());
  initMapFallback();

  const filterTabs = document.getElementById('filter-tabs');
  if (filterTabs) {
    filterTabs.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-pill');
      if (button) setFilter(button.dataset.filter);
    });
  }
  const filterSubtabs = document.getElementById('filter-subtabs');
  if (filterSubtabs) {
    filterSubtabs.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-subpill');
      if (button) setSubcategory(button.dataset.subfilter || '');
    });
  }

  // CMS (content/*.json) লোড হলে সেই কনটেন্ট, নাহলে ফাইলের ভেতরের ডিফল্ট মান দিয়েই সাইট চলবে।
  Promise.race([
    loadCMSContent().catch((error) => {
      if (window.console) window.console.warn('[Dhruvo Express] CMS কনটেন্ট লোড হয়নি, ডিফল্ট মান ব্যবহার করা হচ্ছে:', error);
    }),
    new Promise((resolve) => window.setTimeout(resolve, 2500))
  ]).then(() => {
    renderOfferTicker();
    renderCategoryFilters();
    activeFlashSale = prepareFlashSale();
    renderFlashSale();
    initWhatsAppWidget();
    renderProducts();
    renderCart();
    initEmailContactForm();
  });
})();

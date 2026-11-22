const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");
const searchInput = document.querySelector("#product-search");
const noProductsMessage = document.querySelector("#no-products");
const favoriteCount = document.querySelector("#favorite-count");
const cartDialog = document.querySelector("#cart-dialog");
const cartItemsElement = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const toast = document.querySelector(".toast");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const favorites = new Set();
const cart = new Map();
// Ganti nomor contoh ini dengan nomor WhatsApp bisnis sebelum situs dipublikasikan.
const WHATSAPP_NUMBER = "6281234567890";
const formatPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
let toastTimer;

const productNames = {
  "Kursi santai Sora": { id: "Kursi santai Sora", en: "Sora lounge chair" },
  "Lampu gantung Luma": { id: "Lampu gantung Luma", en: "Luma pendant lamp" },
  "Tas tangan Naya": { id: "Tas tangan Naya", en: "Naya handbag" },
  "Keranjang Rumi": { id: "Keranjang Rumi", en: "Rumi basket" },
};
const translations = [
  [".main-nav a[href='#koleksi']", "Produk", "Products"],
  [".main-nav a[href='#layanan']", "Layanan", "Services"],
  [".main-nav a[href='#cerita']", "Tentang usaha", "About us"],
  [".nav-contact", "Kontak <span aria-hidden=\"true\">↗</span>", "Contact <span aria-hidden=\"true\">↗</span>"],
  [".hero-copy > .eyebrow", "<span class=\"eyebrow-line\"></span> Mitra produk rotan untuk rumah &amp; bisnis", "<span class=\"eyebrow-line\"></span> Rattan partner for homes &amp; businesses"],
  [".hero h1", "Rotan alami,<br>untuk ruang<br><em>berarti.</em>", "Natural rattan,<br>for spaces<br>that <em>matter.</em>"],
  [".hero-description", "Kami menyediakan kerajinan rotan untuk rumah, kafe, hotel, dan proyek interior—tersedia pembelian satuan, pesanan khusus, maupun grosir.", "We provide rattan crafts for homes, cafes, hotels, and interior projects—with retail, custom, and wholesale options."],
  [".hero-actions .button-dark", "Lihat produk <span aria-hidden=\"true\">↘</span>", "Explore products <span aria-hidden=\"true\">↘</span>"],
  [".hero-actions .text-link", "Layanan bisnis <span aria-hidden=\"true\">→</span>", "Business services <span aria-hidden=\"true\">→</span>"],
  [".hero-note p", "Untuk kebutuhan pribadi<br><strong>maupun usaha</strong>", "For personal needs<br><strong>and businesses</strong>"],
  [".hero-caption span:nth-child(2)", "Gaya hidup alami, dibuat dengan tangan", "Natural living, made by hand"],
  [".hero-stamp small", "BUATAN<br>TANGAN", "HAND<br>MADE"],
  [".hero-bottom span:first-child", "01 — KEHANGATAN ALAM", "01 — NATURAL WARMTH"],
  [".hero-bottom span:last-child", "GULIR UNTUK MENJELAJAH", "SCROLL TO EXPLORE"],
  [".intro > .eyebrow", "Tentang usaha", "About us"],
  [".intro h2", "Mitra rotan untuk rumah dan <em>bisnis.</em>", "Your rattan partner for home and <em>business.</em>"],
  [".intro-content > div > p", "Rona Rotan membantu pelanggan menemukan produk anyaman yang sesuai kebutuhan ruang dan anggaran. Kami melayani pesanan satuan, konsultasi produk untuk usaha, hingga permintaan ukuran atau desain khusus.", "Rona Rotan helps customers find woven pieces that suit their space and budget. We offer individual orders, product consultations for businesses, and custom sizes or designs."],
  [".intro-content .text-link", "Lihat cara pemesanan <span aria-hidden=\"true\">→</span>", "See how to order <span aria-hidden=\"true\">→</span>"],
  [".value-item:nth-child(1) h3", "Pilihan produk", "Product selection"],
  [".value-item:nth-child(1) p", "Koleksi rotan untuk kebutuhan hunian dan ruang usaha.", "Rattan pieces for homes and business spaces."],
  [".value-item:nth-child(2) h3", "Pesanan khusus", "Custom orders"],
  [".value-item:nth-child(2) p", "Diskusikan ukuran, jumlah, dan kebutuhan proyek Anda.", "Discuss your preferred size, quantity, and project needs."],
  [".value-item:nth-child(3) h3", "Konsultasi langsung", "Personal consultation"],
  [".value-item:nth-child(3) p", "Tanyakan produk dan penawaran melalui WhatsApp.", "Ask us about products and quotes on WhatsApp."],
  [".collection .section-heading .eyebrow", "Katalog produk", "Product catalog"],
  [".collection .section-heading h2", "Produk rotan untuk <em>setiap ruang.</em>", "Rattan pieces for <em>every space.</em>"],
  [".collection .section-heading > p", "Tanyakan stok, opsi custom,<br>dan harga grosir kepada kami.", "Ask us about availability, custom options,<br>and wholesale pricing."],
  [".filter-button[data-filter='semua']", "Semua karya", "All pieces"],
  [".filter-button[data-filter='rumah']", "Untuk rumah", "For the home"],
  [".filter-button[data-filter='gaya']", "Aksesori", "Accessories"],
  [".product-tag", "Terlaris", "Best seller"],
  [".product-card:nth-child(2) .product-tag", "Cahaya hangat", "Warm glow"],
  [".product-card:nth-child(3) .product-tag", "Pilihan baru", "New arrival"],
  [".product-card:nth-child(4) .product-tag", "Serbaguna", "Versatile"],
  [".product-card:nth-child(1) .product-info p", "Furnitur · Rotan alami", "Furniture · Natural rattan"],
  [".product-card:nth-child(2) .product-info p", "Rumah · Anyaman tangan", "Home · Handwoven"],
  [".product-card:nth-child(3) .product-info p", "Aksesori · Buatan lokal", "Accessories · Locally made"],
  [".product-card:nth-child(4) .product-info p", "Rumah · Anyaman alami", "Home · Natural weave"],
  [".no-products", "Produk tidak ditemukan. Coba kata kunci atau kategori lain.", "No products found. Try another keyword or category."],
  [".collection-footnote", "Butuh jumlah banyak atau spesifikasi khusus? <a href=\"#kontak\">Minta penawaran untuk bisnis Anda.</a>", "Need a larger quantity or special specifications? <a href=\"#kontak\">Request a business quote.</a>"],
  [".business-services .section-heading .eyebrow", "Solusi untuk berbagai kebutuhan", "Solutions for every need"],
  [".business-services .section-heading h2", "Dari satu item hingga <em>proyek.</em>", "From a single item to a <em>project.</em>"],
  [".business-services .section-heading > p", "Diskusikan kebutuhan produk<br>sebelum melakukan pemesanan.", "Discuss your product needs<br>before placing an order."],
  [".business-service-card:nth-child(1) > span", "01 / RITEL", "01 / RETAIL"],
  [".business-service-card:nth-child(1) h3", "Pembelian satuan", "Individual purchases"],
  [".business-service-card:nth-child(1) p", "Pilih produk dari katalog untuk melengkapi hunian atau hadiah. Tanyakan ketersediaan sebelum memesan.", "Choose a catalog item for your home or as a gift. Check availability before ordering."],
  [".business-service-card:nth-child(2) > span", "02 / BISNIS", "02 / BUSINESS"],
  [".business-service-card:nth-child(2) h3", "Grosir untuk kafe & hotel", "Wholesale for cafes & hotels"],
  [".business-service-card:nth-child(2) p", "Perlu beberapa item untuk kafe, hotel, toko, atau ruang komersial? Hubungi kami untuk membahas jumlah dan penawaran.", "Need several items for a cafe, hotel, shop, or commercial space? Contact us to discuss quantities and pricing."],
  [".business-service-card:nth-child(3) > span", "03 / PROYEK", "03 / PROJECTS"],
  [".business-service-card:nth-child(3) h3", "Pesanan custom", "Custom orders"],
  [".business-service-card:nth-child(3) p", "Ceritakan ukuran, model, dan inspirasi yang Anda butuhkan untuk proyek interior atau pesanan khusus.", "Tell us the sizes, styles, and inspiration you need for an interior project or custom order."],
  [".business-services > .text-link", "Ceritakan kebutuhan bisnis Anda <span aria-hidden=\"true\">→</span>", "Tell us what your business needs <span aria-hidden=\"true\">→</span>"],
  [".order-process > .eyebrow", "Mudah dan langsung", "Simple and direct"],
  [".order-process > h2", "Cara <em>memesan.</em>", "How to <em>order.</em>"],
  [".order-steps article:nth-child(1) h3", "Pilih produk", "Choose a product"],
  [".order-steps article:nth-child(1) p", "Jelajahi katalog dan catat item yang Anda minati.", "Browse the catalog and note the items you like."],
  [".order-steps article:nth-child(2) h3", "Konsultasi", "Consult"],
  [".order-steps article:nth-child(2) p", "Kirim pertanyaan, jumlah, atau detail kebutuhan lewat WhatsApp.", "Send your questions, quantities, or requirements via WhatsApp."],
  [".order-steps article:nth-child(3) h3", "Konfirmasi", "Confirm"],
  [".order-steps article:nth-child(3) p", "Kami akan membantu membahas ketersediaan, penawaran, dan langkah berikutnya.", "We'll help you discuss availability, pricing, and next steps."],
  [".craft-image .image-index", "DARI ALAM, DENGAN HATI", "FROM NATURE, MADE WITH CARE"],
  [".craft-copy > .eyebrow", "Bahan alami, proses terampil", "Natural materials, skilled craft"],
  [".craft-copy h2", "Kerajinan rotan dengan <em>sentuhan tangan.</em>", "Rattan crafts with a <em>human touch.</em>"],
  [".craft-description", "Setiap anyaman memiliki karakter dan detailnya sendiri. Kami membantu Anda mengenal pilihan produk dan mendiskusikan kebutuhan sebelum pemesanan.", "Every weave has its own character and details. We help you explore our products and discuss your needs before ordering."],
  [".craft-stat span", "produk rotan untuk rumah,<br>bisnis, dan proyek", "rattan for homes,<br>businesses, and projects"],
  [".craft-copy .text-link", "Kenali layanan kami <span aria-hidden=\"true\">→</span>", "Explore our services <span aria-hidden=\"true\">→</span>"],
  [".quote blockquote", "“Benda yang baik bukan hanya mempercantik ruang, tapi juga membawa cerita yang ingin kita jaga.”", "“A good object does more than beautify a space; it carries a story worth keeping.”"],
  [".quote > p", "FILOSOFI RONA ROTAN", "THE RONA ROTAN PHILOSOPHY"],
  [".contact-banner .eyebrow", "Untuk pelanggan dan mitra bisnis", "For customers and business partners"],
  [".contact-banner h2", "Siap membahas<br>kebutuhan <em>rotan Anda?</em>", "Ready to discuss<br>your <em>rattan needs?</em>"],
  [".contact-description", "Tanyakan katalog, pesanan khusus, atau kebutuhan proyek melalui WhatsApp.", "Ask us about our catalog, custom orders, or project needs on WhatsApp."],
  [".whatsapp-link", "Konsultasi via WhatsApp <span aria-hidden=\"true\">↗</span>", "Chat with us on WhatsApp <span aria-hidden=\"true\">↗</span>"],
  [".site-footer > p", "Anyaman alami, cerita abadi.", "Natural weaves, lasting stories."],
  [".site-footer > span", "© <span id=\"current-year\"></span> Rona Rotan. Dibuat dengan hati.", "© <span id=\"current-year\"></span> Rona Rotan. Made with care."],
  [".photo-credits summary", "Kredit foto", "Photo credits"],
  [".photo-credits li:nth-child(1) a", "Kursi rotan Cebu", "Cebu rattan chair"],
  [".photo-credits li:nth-child(2) a", "Kursi rotan", "Rattan chair"],
  [".photo-credits li:nth-child(3) a", "Kap lampu rotan", "Rattan lampshade"],
  [".photo-credits li:nth-child(4) a", "Tas rotan Bali", "Bali rattan bag"],
  [".photo-credits li:nth-child(5) a", "Keranjang rotan", "Rattan baskets"],
  [".photo-credits li:nth-child(6) a", "Proses menganyam keranjang rotan", "Rattan basket weaving process"],
  [".cart-dialog-header .eyebrow", "Pilihanmu", "Your selection"],
  ["#cart-title", "Keranjang", "Your cart"],
  [".cart-summary > span", "Subtotal", "Subtotal"],
  [".clear-cart", "Kosongkan keranjang", "Clear cart"],
];
let currentLanguage = "id";

function productLabel(productName) {
  return productNames[productName][currentLanguage];
}

function setLeadingText(element, text) {
  const textNode = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) {
    textNode.textContent = text;
  } else {
    element.textContent = text;
  }
}

function updateFavoriteLabels() {
  document.querySelectorAll(".favorite-button").forEach((button) => {
    const name = productLabel(button.dataset.favorite);
    const isFavorite = favorites.has(button.dataset.favorite);
    const label =
      currentLanguage === "id"
        ? `${isFavorite ? "Hapus" : "Tambah"} ${name} ${isFavorite ? "dari" : "ke"} favorit`
        : `${isFavorite ? "Remove" : "Add"} ${name} ${isFavorite ? "from" : "to"} favorites`;
    button.setAttribute("aria-label", label);
  });
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title =
    language === "id"
      ? "Rona Rotan — Produk Rotan untuk Rumah & Bisnis"
      : "Rona Rotan — Rattan for Homes & Businesses";
  document.querySelector('meta[name="description"]').content =
    language === "id"
      ? "Rona Rotan menyediakan kerajinan rotan untuk rumah, bisnis, dan proyek interior. Tersedia pesanan satuan, grosir, dan custom."
      : "Rona Rotan offers rattan crafts for homes, businesses, and interior projects, with retail, wholesale, and custom orders available.";

  translations.forEach(([selector, indonesian, english]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.innerHTML = language === "id" ? indonesian : english;
    });
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  document.querySelector(".language-switch").setAttribute(
    "aria-label",
    language === "id" ? "Pilih bahasa" : "Choose language",
  );
  document.querySelector(".brand").setAttribute(
    "aria-label",
    language === "id" ? "Rona Rotan, kembali ke beranda" : "Rona Rotan, back to home",
  );
  menuToggle.setAttribute("aria-label", language === "id" ? "Buka menu" : "Open menu");
  mainNav.setAttribute("aria-label", language === "id" ? "Navigasi utama" : "Main navigation");
  document.querySelector(".cart-toggle").setAttribute(
    "aria-label",
    language === "id" ? "Buka keranjang" : "Open cart",
  );
  setLeadingText(document.querySelector(".cart-toggle"), language === "id" ? "Keranjang " : "Cart ");
  setLeadingText(
    document.querySelector(".filter-button[data-filter='favorit']"),
    language === "id" ? "Favorit " : "Favorites ",
  );
  document.querySelector(".filter-row").setAttribute(
    "aria-label",
    language === "id" ? "Filter kategori produk" : "Filter products by category",
  );
  searchInput.placeholder = language === "id" ? "Cari produk..." : "Search products...";
  searchInput.setAttribute("aria-label", language === "id" ? "Cari produk" : "Search products");
  setLeadingText(
    document.querySelector("#checkout-link"),
    language === "id" ? "Kirim daftar pesanan via WhatsApp " : "Send your order via WhatsApp ",
  );
  document.querySelector(".cart-close").setAttribute(
    "aria-label",
    language === "id" ? "Tutup keranjang" : "Close cart",
  );

  productCards.forEach((card) => {
    const productName = card.querySelector(".add-button").dataset.product;
    const name = productLabel(productName);
    card.querySelector(".product-info h3").textContent = name;
    setLeadingText(
      card.querySelector(".add-button"),
      language === "id" ? "Tambah ke keranjang " : "Add to cart ",
    );
    card.querySelector(".favorite-button").textContent = favorites.has(productName) ? "♥" : "♡";
    card.querySelector(".product-image").setAttribute(
      "aria-label",
      language === "id" ? `Tanya tentang ${name}` : `Ask about ${name}`,
    );
  });
  updateFavoriteLabels();

  document.querySelectorAll(".product-card img").forEach((image, index) => {
    const altText = {
      id: [
        "Kursi santai dari anyaman rotan",
        "Kap lampu dan alas lampu yang dianyam dari rotan",
        "Tas tangan anyaman rotan dari Bali",
        "Koleksi keranjang yang dianyam dari rotan",
      ],
      en: [
        "Lounge chair woven from rattan",
        "Rattan-woven lampshade and lamp base",
        "Handwoven rattan handbag from Bali",
        "Collection of woven rattan baskets",
      ],
    };
    image.alt = altText[language][index];
  });
  document.querySelector(".hero-visual img").alt =
    language === "id" ? "Kursi rotan buatan pengrajin Cebu" : "Rattan chair made by a Cebu artisan";
  document.querySelector(".craft-image img").alt =
    language === "id"
      ? "Pengrajin sedang membuat keranjang dari rotan"
      : "Artisan making a basket from rattan";
  document.querySelector(".hero-stamp").setAttribute(
    "aria-label",
    language === "id" ? "100 persen buatan tangan" : "100 percent handmade",
  );
  document.querySelector(".whatsapp-link").dataset.message =
    language === "id"
      ? "Halo Rona Rotan, saya ingin berkonsultasi tentang produk atau kebutuhan bisnis."
      : "Hello Rona Rotan, I would like to ask about your products or business services.";
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(link.dataset.message)}`;
  });

  renderCart();
  updateProductVisibility();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function updateProductVisibility() {
  const selectedCategory = document.querySelector(".filter-button.is-active").dataset.filter;
  const locale = currentLanguage === "id" ? "id-ID" : "en";
  const searchTerm = searchInput.value.trim().toLocaleLowerCase(locale);
  let visibleCount = 0;

  productCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLocaleLowerCase(locale);
    const productName = card.querySelector(".add-button").dataset.product;
    const matchesCategory =
      selectedCategory === "semua" ||
      (selectedCategory === "favorit"
        ? favorites.has(productName)
        : card.dataset.category === selectedCategory);
    const matchesSearch = name.includes(searchTerm);
    card.hidden = !matchesCategory || !matchesSearch;
    if (!card.hidden) visibleCount += 1;
  });

  noProductsMessage.hidden = visibleCount > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });
    updateProductVisibility();
  });
});

searchInput.addEventListener("input", updateProductVisibility);

document.querySelectorAll(".favorite-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.favorite;
    const isFavorite = favorites.has(productName);

    if (isFavorite) {
      favorites.delete(productName);
    } else {
      favorites.add(productName);
    }

    button.setAttribute("aria-pressed", String(!isFavorite));
    button.textContent = isFavorite ? "♡" : "♥";
    favoriteCount.textContent = String(favorites.size);
    updateFavoriteLabels();
    updateProductVisibility();
  });
});

function renderCart() {
  cartItemsElement.replaceChildren();
  let itemCount = 0;
  let subtotal = 0;

  cart.forEach((item, productName) => {
    itemCount += item.quantity;
    subtotal += item.price * item.quantity;

    const productCard = [...productCards].find(
      (card) => card.querySelector(".add-button").dataset.product === productName,
    );
    const row = document.createElement("article");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = productCard.querySelector(".product-image img").src;
    image.alt = "";

    const details = document.createElement("div");
    details.className = "cart-item-details";
    const name = document.createElement("h3");
    name.textContent = productLabel(productName);
    const price = document.createElement("p");
    price.textContent = formatPrice.format(item.price);
    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    controls.append(
      createCartActionButton(
        "decrease",
        productName,
        "−",
        currentLanguage === "id"
          ? `Kurangi ${productLabel(productName)}`
          : `Decrease ${productLabel(productName)}`,
      ),
    );
    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    quantity.setAttribute(
      "aria-label",
      currentLanguage === "id" ? `Jumlah ${item.quantity}` : `Quantity ${item.quantity}`,
    );
    controls.append(quantity);
    controls.append(
      createCartActionButton(
        "increase",
        productName,
        "+",
        currentLanguage === "id"
          ? `Tambah ${productLabel(productName)}`
          : `Increase ${productLabel(productName)}`,
      ),
    );

    const removeButton = createCartActionButton(
      "remove",
      productName,
      currentLanguage === "id" ? "Hapus" : "Remove",
      currentLanguage === "id"
        ? `Hapus ${productLabel(productName)} dari keranjang`
        : `Remove ${productLabel(productName)} from cart`,
    );
    removeButton.classList.add("remove-cart-item");
    row.append(image, details, controls, removeButton);
    cartItemsElement.append(row);
  });

  if (cart.size === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty";
    emptyMessage.textContent =
      currentLanguage === "id" ? "Keranjangmu masih kosong." : "Your cart is empty.";
    cartItemsElement.append(emptyMessage);
  }

  cartCount.textContent = String(itemCount);
  cartTotal.textContent = formatPrice.format(subtotal);
  clearCartButton.disabled = cart.size === 0;

  const checkoutLink = document.querySelector("#checkout-link");
  if (cart.size === 0) {
    checkoutLink.href = "#";
    checkoutLink.classList.add("is-disabled");
    checkoutLink.setAttribute("aria-disabled", "true");
  } else {
    const orderDetails = [...cart.entries()].map(
      ([name, item]) =>
        `- ${productLabel(name)} x${item.quantity}: ${formatPrice.format(item.price * item.quantity)}`,
    );
    const message = [
      currentLanguage === "id"
        ? "Halo Rona Rotan, saya ingin menanyakan pesanan berikut:"
        : "Hello Rona Rotan, I would like to ask about the following order:",
      ...orderDetails,
      currentLanguage === "id"
        ? `Subtotal sementara: ${formatPrice.format(subtotal)}`
        : `Estimated subtotal: ${formatPrice.format(subtotal)}`,
      currentLanguage === "id"
        ? "Mohon info ketersediaan dan ongkos kirim."
        : "Please share availability and shipping costs.",
    ].join("\n");
    checkoutLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    checkoutLink.classList.remove("is-disabled");
    checkoutLink.setAttribute("aria-disabled", "false");
  }
}

function createCartActionButton(action, productName, text, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.cartAction = action;
  button.dataset.product = productName;
  button.textContent = text;
  button.setAttribute("aria-label", label);
  return button;
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.product;
    const price = Number(button.dataset.price);

    if (!Number.isFinite(price) || price <= 0) {
      showToast(
        currentLanguage === "id" ? "Harga produk belum tersedia." : "Product price is unavailable.",
      );
      return;
    }

    const item = cart.get(productName);
    if (item) {
      item.quantity += 1;
    } else {
      cart.set(productName, { price, quantity: 1 });
    }

    renderCart();
    showToast(
      currentLanguage === "id"
        ? `${productLabel(productName)} ditambahkan ke keranjang.`
        : `${productLabel(productName)} added to cart.`,
    );
  });
});

cartItemsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;

  const productName = button.dataset.product;
  const item = cart.get(productName);
  if (!item) return;

  if (button.dataset.cartAction === "increase") item.quantity += 1;
  if (button.dataset.cartAction === "decrease") item.quantity -= 1;
  if (button.dataset.cartAction === "remove" || item.quantity <= 0) {
    cart.delete(productName);
  }
  renderCart();
});

document.querySelector(".cart-toggle").addEventListener("click", () => {
  cartDialog.showModal();
});
document.querySelector("#checkout-link").addEventListener("click", (event) => {
  if (cart.size === 0) event.preventDefault();
});
document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});
clearCartButton.addEventListener("click", () => {
  cart.clear();
  renderCart();
});
renderCart();

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(link.dataset.message)}`;
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    currentLanguage === "id"
      ? isOpen
        ? "Buka menu"
        : "Tutup menu"
      : isOpen
        ? "Open menu"
        : "Close menu",
  );
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", currentLanguage === "id" ? "Buka menu" : "Open menu");
  });
});

document.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

applyLanguage("id");
document.querySelector("#current-year").textContent = new Date().getFullYear();

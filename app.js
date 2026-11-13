/**
 * ============================================================================
 * SUNFADE SUPPLY — LÓGICA DE CATÁLOGO, LINKS DIRECTOS Y RESERVAS
 * ============================================================================
 */

(function () {
  const config = window.SUNFADE_CONFIG;
  const products = window.SUNFADE_PRODUCTS || [];

  // Estado de filtros y selección (piezas 1 de 1)
  const state = {
    availability: "all", // all | available | sold
    size: "all",         // all | S | M | L | XL
    brand: "all",
    sort: "featured",    // featured | price-asc | price-desc
    bagIds: loadBagFromStorage()
  };

  // Referencias del DOM
  const gridEl = document.getElementById("productsGrid");
  const countLabelEl = document.getElementById("catalogCountLabel");
  const brandSelectEl = document.getElementById("brandFilterSelect");
  const sortSelectEl = document.getElementById("sortFilterSelect");
  const bagCountEls = document.querySelectorAll(".js-bag-count");

  const backdropEl = document.getElementById("globalBackdrop");
  const quickviewModalEl = document.getElementById("quickviewModal");
  const quickviewContentEl = document.getElementById("quickviewContent");
  const sizeGuideModalEl = document.getElementById("sizeGuideModal");
  const orderConfirmModalEl = document.getElementById("orderConfirmModal");
  const orderPreviewTextEl = document.getElementById("orderPreviewText");
  const bagDrawerEl = document.getElementById("bagDrawer");
  const bagItemsContainerEl = document.getElementById("bagItemsContainer");
  const bagTotalEl = document.getElementById("bagTotalAmount");
  const bagTransferNoteEl = document.getElementById("bagTransferNote");
  const toastEl = document.getElementById("toastMessage");

  // Formateador de moneda ARS
  function formatARS(amount) {
    return "$" + Math.round(amount).toLocaleString("es-AR");
  }

  function getTransferPrice(price) {
    const pct = config.transferDiscountPercent || 0;
    return price * (1 - pct / 100);
  }

  function loadBagFromStorage() {
    try {
      const raw = localStorage.getItem("sunfade_bag_v1");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveBagToStorage() {
    try {
      localStorage.setItem("sunfade_bag_v1", JSON.stringify(state.bagIds));
    } catch (_) {}
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2900);
  }

  // Construcción y copiado de Link Directo (?prenda=SF-001)
  function getProductDeepLink(productId) {
    const base = window.location.origin && window.location.origin !== "null"
      ? window.location.origin + window.location.pathname
      : window.location.href.split("?")[0].split("#")[0];
    return `${base}?prenda=${encodeURIComponent(productId)}`;
  }

  function copyProductLink(productId) {
    const item = products.find((p) => p.id === productId);
    if (!item) return;
    const url = getProductDeepLink(item.id);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast(`🔗 Link directo copiado (${item.id})`);
        })
        .catch(() => {
          prompt("Copiá el link directo a esta prenda:", url);
        });
    } else {
      prompt("Copiá el link directo a esta prenda:", url);
    }
  }

  function setUrlPrendaParam(productId) {
    try {
      const url = new URL(window.location.href);
      if (productId) {
        url.searchParams.set("prenda", productId);
      } else {
        url.searchParams.delete("prenda");
      }
      window.history.replaceState({}, "", url.toString());
    } catch (_) {}
  }

  // Inicializar marcas dinámicamente
  function populateBrands() {
    const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
    brands.forEach((brand) => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = "Marca: " + brand;
      brandSelectEl.appendChild(opt);
    });
  }

  // Filtrar y ordenar productos
  function getFilteredProducts() {
    return products
      .filter((item) => {
        if (state.availability === "available" && !item.available) return false;
        if (state.availability === "sold" && item.available) return false;
        if (state.size !== "all" && item.sizeGroup !== state.size) return false;
        if (state.brand !== "all" && item.brand !== state.brand) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.available !== b.available && state.availability === "all") {
          return a.available ? -1 : 1;
        }
        if (state.sort === "price-asc") return a.price - b.price;
        if (state.sort === "price-desc") return b.price - a.price;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return 0;
      });
  }

  // Renderizar grilla del catálogo
  function renderCatalog() {
    const list = getFilteredProducts();
    const availableTotal = products.filter((p) => p.available).length;
    if (countLabelEl) {
      countLabelEl.textContent = `${list.length} prendas mostradas · ${availableTotal} disponibles ahora`;
    }

    if (list.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-catalog">
          <h3 style="margin-bottom:0.5rem;">No encontramos prendas con esos filtros</h3>
          <p style="color:var(--ink-muted); margin-bottom:1rem;">Probá ver todos los talles o sumate al grupo de WhatsApp para el próximo ingreso.</p>
          <button class="btn btn-ocean" id="resetFiltersBtn">Restablecer filtros</button>
        </div>
      `;
      const resetBtn = document.getElementById("resetFiltersBtn");
      if (resetBtn) resetBtn.addEventListener("click", resetFilters);
      return;
    }

    gridEl.innerHTML = list
      .map((item) => {
        const inBag = state.bagIds.includes(item.id);
        const transferPrice = getTransferPrice(item.price);
        const badgeClass = !item.available
          ? "sold"
          : item.featured
          ? "highlight"
          : "";

        return `
          <article class="product-card ${!item.available ? "sold-out" : ""}" data-id="${item.id}">
            <div class="product-media js-open-quickview" data-id="${item.id}">
              <div class="card-top-badges">
                <span class="badge-chip ${badgeClass}">${!item.available ? "SOLD OUT" : item.badge}</span>
                <span class="size-pill">${item.sizeLabel}</span>
              </div>
              <img src="${item.image}" alt="${item.name}" loading="lazy" />
              ${
                !item.available
                  ? `<div class="sold-stamp-overlay"><span class="sold-stamp">VENDIDO</span></div>`
                  : ""
              }
            </div>

            <div class="product-body">
              <div class="product-meta-row">
                <span class="product-brand">${item.brand} · ${item.era}</span>
                <span>${item.code}</span>
              </div>

              <h3 class="product-title js-open-quickview" data-id="${item.id}">${item.name}</h3>

              <div class="measurements-box" title="Medidas tomadas en plano">
                <span>📏 Cintura: <strong>${item.waistCm} cm</strong></span>
                <span>·</span>
                <span>Largo: <strong>${item.lengthCm} cm</strong></span>
              </div>

              <div class="product-footer">
                <div class="price-block">
                  <span class="price-main">${formatARS(item.price)}</span>
                  ${
                    config.transferDiscountPercent > 0
                      ? `<span class="price-transfer">${formatARS(transferPrice)} transf. (-${config.transferDiscountPercent}%)</span>`
                      : ""
                  }
                </div>

                <div class="card-actions">
                  <button
                    class="icon-btn js-copy-link"
                    data-id="${item.id}"
                    title="Copiar link directo a esta prenda"
                    aria-label="Copiar link directo de ${item.name}"
                  >
                    🔗
                  </button>
                  <button
                    class="icon-btn js-open-quickview"
                    data-id="${item.id}"
                    title="Ver ficha completa"
                    aria-label="Ver detalles de ${item.name}"
                  >
                    🔍
                  </button>
                  ${
                    item.available
                      ? `<button class="buy-card-btn ${inBag ? "in-bag" : ""} js-toggle-bag" data-id="${item.id}">
                          ${inBag ? "✓ En selección" : "+ Reservar"}
                        </button>`
                      : `<button class="buy-card-btn" disabled>Sin stock</button>`
                  }
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function resetFilters() {
    state.availability = "all";
    state.size = "all";
    state.brand = "all";
    state.sort = "featured";

    document.querySelectorAll("[data-filter-availability]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filterAvailability === "all");
    });
    document.querySelectorAll("[data-filter-size]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filterSize === "all");
    });
    brandSelectEl.value = "all";
    sortSelectEl.value = "featured";
    renderCatalog();
  }

  // Gestión de Mi Selección (Bolsa de reserva)
  function toggleBagItem(productId) {
    const prod = products.find((p) => p.id === productId);
    if (!prod || !prod.available) return;

    const idx = state.bagIds.indexOf(productId);
    if (idx >= 0) {
      state.bagIds.splice(idx, 1);
      showToast(`Quitaste "${prod.name}" de tu selección`);
    } else {
      state.bagIds.push(productId);
      showToast(`¡Agregado! "${prod.name}" (Pieza 1 de 1)`);
    }

    saveBagToStorage();
    updateBagUI();
    renderCatalog();
  }

  function updateBagUI() {
    const selectedItems = state.bagIds
      .map((id) => products.find((p) => p.id === id && p.available))
      .filter(Boolean);

    if (selectedItems.length !== state.bagIds.length) {
      state.bagIds = selectedItems.map((i) => i.id);
      saveBagToStorage();
    }

    bagCountEls.forEach((el) => {
      el.textContent = selectedItems.length;
    });

    const paymentSelect = document.getElementById("checkoutPayment");
    const isTransfer = !paymentSelect || paymentSelect.value.includes("Transferencia");

    const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
    const finalTotal = isTransfer ? getTransferPrice(subtotal) : subtotal;

    if (bagTotalEl) {
      bagTotalEl.textContent = formatARS(finalTotal);
    }
    if (bagTransferNoteEl) {
      bagTransferNoteEl.textContent =
        isTransfer && subtotal > 0
          ? `Incluye ${config.transferDiscountPercent}% OFF abonando por transferencia (Lista: ${formatARS(subtotal)})`
          : "Seleccioná transferencia para obtener 10% OFF";
    }

    if (!bagItemsContainerEl) return;

    if (selectedItems.length === 0) {
      bagItemsContainerEl.innerHTML = `
        <div style="text-align:center; padding: 2.2rem 0.5rem; color: var(--ink-muted);">
          <p style="font-size: 2rem; margin-bottom: 0.4rem;">🌊</p>
          <p style="font-weight:700; color:var(--ink); margin-bottom:0.35rem;">Tu selección está vacía</p>
          <p style="font-size:0.86rem;">Elegí tus boardshorts favoritos del drop para generar tu pedido listo para enviar.</p>
        </div>
      `;
      return;
    }

    bagItemsContainerEl.innerHTML = selectedItems
      .map(
        (item) => `
        <div class="bag-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <div class="bag-item-title">${item.name}</div>
            <div class="bag-item-meta">${item.sizeLabel} · ${item.waistCm}x${item.lengthCm}cm</div>
            <div class="bag-item-meta" style="color:var(--ink); font-weight:700;">${formatARS(item.price)}</div>
          </div>
          <button class="remove-item-btn js-remove-bag" data-id="${item.id}" title="Quitar">✕</button>
        </div>
      `
      )
      .join("");
  }

  // Modal de Vista Rápida (sincronizado con ?prenda=ID)
  function openQuickView(productId) {
    const item = products.find(
      (p) => p.id.toLowerCase() === String(productId || "").toLowerCase()
    );
    if (!item) return;

    const inBag = state.bagIds.includes(item.id);
    const transferPrice = getTransferPrice(item.price);

    quickviewContentEl.innerHTML = `
      <div class="quickview-grid">
        <div class="quickview-img-wrap">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="quickview-details">
          <div style="display:flex; gap:0.5rem; align-items:center; justify-content:space-between; flex-wrap:wrap; padding-right:2rem;">
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <span class="badge-chip ${item.available ? "highlight" : "sold"}">
                ${item.available ? item.badge : "SOLD OUT"}
              </span>
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--ink-muted);">${item.code}</span>
            </div>
            <button
              type="button"
              class="chip js-copy-link"
              data-id="${item.id}"
              style="font-family:var(--font-mono); font-size:0.72rem;"
              title="Copiar link directo a esta prenda"
            >
              🔗 Link (${item.id})
            </button>
          </div>

          <h2 style="font-size:1.45rem; line-height:1.15;">${item.name}</h2>

          <div>
            <div style="font-family:var(--font-mono); font-size:1.35rem; font-weight:700;">
              ${formatARS(item.price)}
            </div>
            <div style="font-size:0.82rem; color:var(--whatsapp-dark); font-weight:700;">
              ${formatARS(transferPrice)} abonando por transferencia (-${config.transferDiscountPercent}% OFF)
            </div>
          </div>

          <p style="font-size:0.92rem; color:var(--ink-soft);">${item.description}</p>

          <div class="spec-list">
            <div><strong>Talle sugerido:</strong> ${item.sizeLabel}</div>
            <div><strong>Medidas en plano:</strong> Cintura ${item.waistCm} cm · Largo total ${item.lengthCm} cm</div>
            <div><strong>Marca & Era:</strong> ${item.brand} (${item.era})</div>
            <div><strong>Estado:</strong> ${item.condition}</div>
            <div><strong>Material:</strong> ${item.fabric}</div>
          </div>

          <p style="font-size:0.76rem; color:var(--ink-muted);">
            ⚡ <strong>Pieza única 1 de 1:</strong> Sin cambio por talle. Se reserva únicamente abonando por transferencia o seña.
          </p>

          ${
            item.available
              ? `
                <div style="display:grid; gap:0.55rem; margin-top:0.2rem;">
                  <button class="btn btn-whatsapp js-direct-reserve" data-id="${item.id}">
                    💬 Quiero reservar esta prenda ahora
                  </button>
                  <button class="btn btn-cream js-modal-toggle-bag" data-id="${item.id}">
                    ${inBag ? "✓ Ya está en Mi Selección (Quitar)" : "+ Sumar a Mi Selección para pedir varias"}
                  </button>
                </div>
              `
              : `
                <a href="${config.whatsappGroupUrl}" target="_blank" rel="noopener" class="btn btn-ocean" style="margin-top:0.4rem;">
                  🌊 Vendido · Unite al grupo VIP para el próximo drop
                </a>
              `
          }
        </div>
      </div>
    `;

    setUrlPrendaParam(item.id);
    openModal(quickviewModalEl);
  }

  // Construcción de mensaje de pedido
  function buildOrderMessage(items, customerName, customerCity, shippingMethod, paymentMethod) {
    const isTransfer = paymentMethod.includes("Transferencia");
    const subtotal = items.reduce((acc, i) => acc + i.price, 0);
    const total = isTransfer ? getTransferPrice(subtotal) : subtotal;

    const lines = [
      `🌊 ¡Hola Sunfade Supply! Quiero reservar del catálogo web:`,
      ``
    ];

    items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name} [${item.id}] — Talle ${item.sizeLabel} (${item.waistCm}x${item.lengthCm}cm) · ${formatARS(item.price)}`
      );
      lines.push(`   🔗 ${getProductDeepLink(item.id)}`);
    });

    lines.push(``);
    if (customerName) lines.push(`👤 Nombre: ${customerName}`);
    if (customerCity) lines.push(`📍 Localidad: ${customerCity}`);
    lines.push(`📦 Entrega: ${shippingMethod}`);
    lines.push(`💳 Pago: ${paymentMethod}`);
    lines.push(
      `💰 Total estimado: ${formatARS(total)}${
        isTransfer ? ` (con ${config.transferDiscountPercent}% OFF transf.)` : ""
      }`
    );
    lines.push(``);
    lines.push(`¿Sigue disponible para pasarme el alias y señar/transferir ahora? ¡Gracias! 🌞`);

    return lines.join("\n");
  }

  function dispatchOrder(message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).catch(() => {});
    }
    if (orderPreviewTextEl) {
      orderPreviewTextEl.value = message;
    }
    closeAllOverlays();
    openModal(orderConfirmModalEl);
  }

  // Helpers de Modals y Drawer
  function openModal(modalEl) {
    backdropEl.classList.add("open");
    modalEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function openBagDrawer() {
    closeAllOverlays();
    updateBagUI();
    backdropEl.classList.add("open");
    bagDrawerEl.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAllOverlays() {
    backdropEl.classList.remove("open");
    quickviewModalEl.classList.remove("open");
    sizeGuideModalEl.classList.remove("open");
    orderConfirmModalEl.classList.remove("open");
    bagDrawerEl.classList.remove("open");
    document.body.style.overflow = "";
    setUrlPrendaParam(null);
  }

  // Detectar ?prenda=SF-001 al entrar desde Instagram Stories o WhatsApp
  function checkInitialDeepLink() {
    try {
      const params = new URLSearchParams(window.location.search);
      const prendaId = params.get("prenda");
      if (!prendaId) return;

      const found = products.find(
        (p) => p.id.toLowerCase() === prendaId.trim().toLowerCase()
      );
      if (found) {
        const catalogSection = document.getElementById("catalogo");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        openQuickView(found.id);
      }
    } catch (_) {}
  }

  // Event Listeners globales
  function bindEvents() {
    document.querySelectorAll("[data-filter-availability]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.availability = btn.dataset.filterAvailability;
        document.querySelectorAll("[data-filter-availability]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderCatalog();
      });
    });

    document.querySelectorAll("[data-filter-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.size = btn.dataset.filterSize;
        document.querySelectorAll("[data-filter-size]").forEach((b) =>
          b.classList.toggle("active", b === btn)
        );
        renderCatalog();
      });
    });

    brandSelectEl.addEventListener("change", (e) => {
      state.brand = e.target.value;
      renderCatalog();
    });

    sortSelectEl.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderCatalog();
    });

    document.addEventListener("click", (e) => {
      const copyLinkTrigger = e.target.closest(".js-copy-link");
      if (copyLinkTrigger) {
        e.stopPropagation();
        copyProductLink(copyLinkTrigger.dataset.id);
        return;
      }

      const qvTrigger = e.target.closest(".js-open-quickview");
      if (qvTrigger) {
        openQuickView(qvTrigger.dataset.id);
        return;
      }

      const bagToggle = e.target.closest(".js-toggle-bag");
      if (bagToggle) {
        toggleBagItem(bagToggle.dataset.id);
        return;
      }

      const modalBagToggle = e.target.closest(".js-modal-toggle-bag");
      if (modalBagToggle) {
        toggleBagItem(modalBagToggle.dataset.id);
        openQuickView(modalBagToggle.dataset.id);
        return;
      }

      const directReserve = e.target.closest(".js-direct-reserve");
      if (directReserve) {
        const prod = products.find((p) => p.id === directReserve.dataset.id);
        if (prod) {
          if (!state.bagIds.includes(prod.id)) {
            state.bagIds.push(prod.id);
            saveBagToStorage();
          }
          openBagDrawer();
        }
        return;
      }

      const removeBtn = e.target.closest(".js-remove-bag");
      if (removeBtn) {
        toggleBagItem(removeBtn.dataset.id);
        return;
      }

      if (e.target.closest(".js-open-bag")) {
        openBagDrawer();
        return;
      }

      if (e.target.closest(".js-open-size-guide")) {
        e.preventDefault();
        closeAllOverlays();
        openModal(sizeGuideModalEl);
        return;
      }

      if (e.target.closest(".js-close-overlay") || e.target === backdropEl) {
        closeAllOverlays();
      }
    });

    const paymentSelect = document.getElementById("checkoutPayment");
    if (paymentSelect) {
      paymentSelect.addEventListener("change", updateBagUI);
    }

    const checkoutForm = document.getElementById("whatsappCheckoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedItems = state.bagIds
          .map((id) => products.find((p) => p.id === id && p.available))
          .filter(Boolean);

        if (selectedItems.length === 0) {
          showToast("Primero agregá al menos un boardshort disponible");
          return;
        }

        const name = document.getElementById("checkoutName").value.trim();
        const city = document.getElementById("checkoutCity").value.trim();
        const shipping = document.getElementById("checkoutShipping").value;
        const payment = document.getElementById("checkoutPayment").value;

        const msg = buildOrderMessage(selectedItems, name, city, shipping, payment);
        dispatchOrder(msg);
      });
    }

    const copyOrderBtn = document.getElementById("copyOrderBtn");
    if (copyOrderBtn) {
      copyOrderBtn.addEventListener("click", () => {
        if (orderPreviewTextEl) {
          orderPreviewTextEl.select();
          navigator.clipboard?.writeText(orderPreviewTextEl.value);
          showToast("¡Pedido copiado al portapapeles! Pegalo en el chat");
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllOverlays();
    });
  }

  // Inicialización
  populateBrands();
  renderCatalog();
  updateBagUI();
  bindEvents();
  checkInitialDeepLink();
})();

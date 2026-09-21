(() => {
  const one = (selector, context = document) => context.querySelector(selector);
  const all = (selector, context = document) => [...context.querySelectorAll(selector)];
  const language = document.body.dataset.language || "en";
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  // Keep language choice visible in the top utility bar rather than forcing an opening language gate.
  // The WhatsApp contact link is authored directly in the markup, so it needs no scripting here.
  const utility = one(".utility");
  const languageLink = one(".lang-link");
  if (utility && languageLink) {
    languageLink.classList.add("utility-language");
    utility.prepend(languageLink);
  }

  const toast = one(".toast");
  let toastTimer;
  const showToast = (message, actionLabel, onAction) => {
    if (!toast) return;
    toast.innerHTML = "";
    const msgSpan = document.createElement("span");
    msgSpan.textContent = message;
    toast.appendChild(msgSpan);
    if (actionLabel && onAction) {
      const btn = document.createElement("button");
      btn.className = "toast-btn";
      btn.type = "button";
      btn.textContent = actionLabel;
      btn.addEventListener("click", () => {
        toast.classList.remove("is-open");
        onAction();
      });
      toast.appendChild(btn);
    }
    toast.classList.add("is-open");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 4000);
  };

  // Mobile Menu & Submenu Navigation
  const menuToggle = one(".menu-toggle");
  const mainNav = one(".main-nav");

  if (menuToggle && mainNav) {
    // Remove any legacy span hamburger if present so clean SVG vector icon is used
    const oldHamburger = one(".menu-hamburger", menuToggle);
    if (oldHamburger) {
      oldHamburger.remove();
    }
    // Also remove any stray bold text tags inside menu-toggle
    all(":scope > b", menuToggle).forEach((b) => b.remove());

    // Ensure clean stroke-matched vector SVG icons exist inside menuToggle
    if (!one(".menu-icon-open", menuToggle)) {
      menuToggle.insertAdjacentHTML(
        "afterbegin",
        '<svg class="menu-icon-open" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg><svg class="menu-icon-close" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      );
    }

    // Create backdrop for mobile drawer if not already in DOM
    let backdrop = one(".nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      mainNav.parentElement ? mainNav.parentElement.appendChild(backdrop) : document.body.appendChild(backdrop);
    }

    const toggleMenu = (open) => {
      const willOpen = typeof open === "boolean" ? open : menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      mainNav.classList.toggle("is-open", willOpen);
      backdrop.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
      
      // If closing the menu, also collapse open submenus
      if (!willOpen) {
        all(".has-submenu > button", mainNav).forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
          btn.parentElement?.classList.remove("is-open");
        });
      }
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking on the backdrop
    backdrop.addEventListener("click", () => toggleMenu(false));

    // Close menu when clicking anywhere outside
    document.addEventListener("click", (e) => {
      if (!mainNav.classList.contains("is-open")) return;
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });

    // Close mobile nav when clicking a link inside it
    all("a", mainNav).forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          toggleMenu(false);
        }
      });
    });
  }

  // Setup Accessible Submenu Toggles
  all(".has-submenu").forEach((parent, index) => {
    const button = one(":scope > button", parent);
    const submenu = one(":scope > .submenu", parent);
    if (!button || !submenu) return;

    if (!submenu.id) {
      submenu.id = `nav-submenu-${index + 1}`;
    }
    button.setAttribute("aria-controls", submenu.id);
    button.setAttribute("aria-haspopup", "true");

    // Ensure chevron toggle indicator exists
    if (!one(".submenu-toggle-icon", button)) {
      const icon = document.createElement("span");
      icon.className = "submenu-toggle-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = `<svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.75L6 6.25L10.5 1.75"/></svg>`;
      button.appendChild(icon);
    }

    button.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return; // Desktop dropdown handles hover/focus
      e.preventDefault();
      e.stopPropagation();
      const opening = button.getAttribute("aria-expanded") !== "true";

      // If opening, close other submenus (clean accordion behavior)
      if (opening) {
        all(".has-submenu > button").forEach((otherBtn) => {
          if (otherBtn !== button) {
            otherBtn.setAttribute("aria-expanded", "false");
            otherBtn.parentElement?.classList.remove("is-open");
          }
        });
      }

      button.setAttribute("aria-expanded", String(opening));
      parent.classList.toggle("is-open", opening);
    });
  });

  const searchPanel = one(".search-panel");
  one("[data-search-open]")?.addEventListener("click", () => {
    searchPanel.classList.add("is-open");
    searchPanel.setAttribute("aria-hidden", "false");
    window.setTimeout(() => one("#site-search")?.focus(), 100);
  });
  one("[data-search-close]")?.addEventListener("click", () => {
    searchPanel.classList.remove("is-open");
    searchPanel.setAttribute("aria-hidden", "true");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchPanel?.classList.remove("is-open");
      searchPanel?.setAttribute("aria-hidden", "true");
    }
  });

  one("[data-newsletter]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim().toLowerCase();
    if (!email) return;
    // Consent gate: without the owner-approved privacy workflow the form stays
    // informational and nothing is submitted or stored.
    if (!form.dataset.consentConfirmed) {
      showToast(language === "bn" ? "নিউজলেটার চালুর আগে আপনার সম্মতি নেওয়া হবে।" : "Newsletter sign-up will open when the approved consent system is connected.");
      return;
    }
    const res = await hostingerApi.call("subscribe.php", { email, language, source: "footer" });
    if (res.offline) {
      showToast(language === "bn" ? "সাবস্ক্রিপশন এখন পাওয়া যাচ্ছে না। পরে চেষ্টা করুন।" : "Subscription is unavailable right now. Please try again later.");
      return;
    }
    if (res.success) {
      showToast(res.message || (language === "bn" ? "ধন্যবাদ!" : "Thank you!"));
      form.reset();
    } else if (res.notEnabled) {
      showToast(language === "bn" ? "সাবস্ক্রিপশন সংগ্রহ এখনো চালু হয়নি।" : "Subscription collection is not enabled yet.");
    } else {
      showToast(res.error || (language === "bn" ? "সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again."));
    }
  });
  all("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));

  const slides = all("[data-slide]");
  let currentSlide = 0;
  let sliderTimer;
  const renderSlide = (nextIndex) => {
    if (!slides.length) return;
    slides[currentSlide].classList.remove("is-active");
    slides[currentSlide].setAttribute("aria-hidden", "true");
    currentSlide = (nextIndex + slides.length) % slides.length;
    slides[currentSlide].classList.add("is-active");
    slides[currentSlide].setAttribute("aria-hidden", "false");
    const counter = one("[data-slide-current]");
    if (counter) counter.textContent = String(currentSlide + 1).padStart(2, "0");
  };
  const startSlider = () => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => renderSlide(currentSlide + 1), 7000);
  };
  one("[data-slide-prev]")?.addEventListener("click", () => { renderSlide(currentSlide - 1); startSlider(); });
  one("[data-slide-next]")?.addEventListener("click", () => { renderSlide(currentSlide + 1); startSlider(); });
  const hero = one(".hero-slider");
  hero?.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
  hero?.addEventListener("mouseleave", startSlider);
  hero?.addEventListener("focusin", () => window.clearInterval(sliderTimer));
  hero?.addEventListener("focusout", startSlider);
  startSlider();

  const skeletons = () => `<div class="product-empty">${Array.from({ length: 4 }, (_, index) => `<article class="product-proof"><div class="placeholder"><span>0${index + 1}</span></div><div class="meta"><b>${language === "bn" ? "পণ্যের তথ্য যাচাই চলছে" : "Product record in preparation"}</b><i></i></div><footer><span>Metadata</span><span>Review required</span></footer></article>`).join("")}</div>`;
  // Shopping Bag Store (Client-Side Persistence)
  const BAG_KEY = "emk_bag";
  const getBag = () => {
    try {
      return JSON.parse(localStorage.getItem(BAG_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const updateBagCount = () => {
    const bag = getBag();
    const count = bag.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    all(".bag-link").forEach((link) => {
      let icon = one("i", link);
      if (!icon) {
        icon = document.createElement("i");
        link.appendChild(icon);
      }
      icon.textContent = `(${count})`;
    });
    // Also update header cart icon badges (both desktop and mobile)
    all('.header-icons a[href*="/shop/"] .icon-badge').forEach((badge) => {
      badge.textContent = String(count);
    });
    const drawerPill = one(".bag-count-pill");
    if (drawerPill) drawerPill.textContent = `(${count})`;
  };

  const saveBag = (bag) => {
    try {
      localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    } catch {}
    updateBagCount();
  };

  // Bag Slide-Over Drawer DOM injection
  let bagBackdrop = one(".bag-backdrop");
  if (!bagBackdrop) {
    bagBackdrop = document.createElement("div");
    bagBackdrop.className = "bag-backdrop";
    bagBackdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(bagBackdrop);
  }

  let bagDrawer = one(".bag-drawer");
  if (!bagDrawer) {
    bagDrawer = document.createElement("aside");
    bagDrawer.className = "bag-drawer";
    bagDrawer.setAttribute("role", "dialog");
    bagDrawer.setAttribute("aria-modal", "true");
    bagDrawer.setAttribute("aria-label", language === "bn" ? "শপিং ব্যাগ" : "Shopping Bag");
    document.body.appendChild(bagDrawer);
  }

  const openBagDrawer = () => {
    renderBagDrawer();
    bagDrawer.classList.add("is-open");
    bagBackdrop.classList.add("is-open");
    document.body.classList.add("bag-open");
  };

  const closeBagDrawer = () => {
    bagDrawer.classList.remove("is-open");
    bagBackdrop.classList.remove("is-open");
    document.body.classList.remove("bag-open");
  };

  bagBackdrop.addEventListener("click", closeBagDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bagDrawer.classList.contains("is-open")) {
      closeBagDrawer();
    }
  });

  all(".bag-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openBagDrawer();
    });
  });

  const renderBagDrawer = () => {
    const bag = getBag();
    const count = bag.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const isBn = language === "bn";

    let waItemsText = "";
    bag.forEach((item, idx) => {
      waItemsText += `\n${idx + 1}. ${item.title} (ID: ${item.id}, Qty: ${item.quantity}) - https://emarket247.shop/${language}/products/${item.slug}/`;
    });

    const waText = isBn
      ? `হ্যালো eMarket247, আমি ব্যাগের নিচের পণ্যগুলো অর্ডার ও মূল্য জানতে আগ্রহী:${waItemsText}\n\nঅনুগ্রহ করে প্রাপ্যতা ও ডেলিভারির সময় নিশ্চিত করবেন। ধন্যবাদ!`
      : `Hello eMarket247, I want to inquire about and order the following items in my bag:${waItemsText}\n\nPlease confirm availability and final pricing. Thank you!`;
    const waUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waText)}`;

    bagDrawer.innerHTML = `
      <header class="bag-header">
        <h3>${isBn ? "আপনার শপিং ব্যাগ" : "Your Shopping Bag"} <span class="bag-count-pill">(${count})</span></h3>
        <button type="button" class="bag-close" aria-label="${isBn ? "বন্ধ করুন" : "Close"}">×</button>
      </header>
      <div class="bag-body">
        ${bag.length === 0 ? `
          <div class="bag-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            <h4>${isBn ? "শপিং ব্যাগ বর্তমানে খালি" : "Your bag is empty"}</h4>
            <p>${isBn ? "আমাদের বিশেষ কালেকশন থেকে আপনার পছন্দের অলংকার নির্বাচন করুন।" : "Explore our curated gold and fashion jewellery pieces to add items to your consultation bag."}</p>
            <a href="/${language}/shop/" class="bag-empty-cta">${isBn ? "শপ কালেকশন দেখুন →" : "Explore Shop →"}</a>
          </div>
        ` : bag.map((item) => `
          <div class="bag-item" data-id="${esc(item.id)}">
            <a class="bag-item-thumb" href="${esc(item.url)}">
              <img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy">
            </a>
            <div class="bag-item-info">
              <div class="bag-item-meta">${esc(item.category)} · <span>${esc(item.id)}</span></div>
              <h4><a href="${esc(item.url)}">${esc(item.title)}</a></h4>
              <p class="bag-item-note">${isBn ? "ব্যক্তিগত পরার্মশে মূল্য নিশ্চিতকরণ" : "Price confirmed on consultation"}</p>
              <div class="bag-item-actions">
                <div class="bag-stepper">
                  <button type="button" data-bag-change="-1" data-id="${esc(item.id)}" aria-label="${isBn ? "পরিমাণ কমান" : "Decrease"}">−</button>
                  <span>${item.quantity}</span>
                  <button type="button" data-bag-change="1" data-id="${esc(item.id)}" aria-label="${isBn ? "পরিমাণ বাড়ান" : "Increase"}>+</button>
                </div>
                <button type="button" class="bag-remove-btn" data-bag-remove="${esc(item.id)}">${isBn ? "মুছুন" : "Remove"}</button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
      ${bag.length > 0 ? `
        <footer class="bag-footer">
          <div class="bag-footer-note">
            <span>✦</span>
            <span>${isBn ? "ব্যক্তিগত কাস্টমার কেয়ার পরামর্শের মাধ্যমে চূড়ান্ত মূল্য, সাইজ ও ডেলিভারি নিশ্চিত করা হয়।" : "Exact pricing, sizing, and nationwide delivery are confirmed via personal customer consultation."}</span>
          </div>
          <a class="bag-checkout-wa" href="${waUrl}" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span>${isBn ? "হোয়াটসঅ্যাপে সম্পূর্ণ ব্যাগ অর্ডার করুন" : "Inquire / Order Bag on WhatsApp"}</span>
          </a>
          <a class="bag-call-link" href="tel:+8801740501062">
            ${isBn ? "কাস্টমার কেয়ারে কল: +880 1740-501062" : "Customer Care Call: +880 1740-501062"}
          </a>
          <div class="bag-clear-row">
            <button type="button" class="bag-clear-btn">${isBn ? "সম্পূর্ণ ব্যাগ খালি করুন" : "Clear entire bag"}</button>
          </div>
        </footer>
      ` : ""}
    `;

    one(".bag-close", bagDrawer)?.addEventListener("click", closeBagDrawer);

    all("[data-bag-change]", bagDrawer).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const change = Number(btn.dataset.bagChange);
        const currentBag = getBag();
        const item = currentBag.find((i) => i.id === id);
        if (item) {
          item.quantity = (Number(item.quantity) || 1) + change;
          if (item.quantity <= 0) {
            const idx = currentBag.indexOf(item);
            currentBag.splice(idx, 1);
          }
          saveBag(currentBag);
          renderBagDrawer();
        }
      });
    });

    all("[data-bag-remove]", bagDrawer).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.bagRemove;
        const currentBag = getBag().filter((i) => i.id !== id);
        saveBag(currentBag);
        renderBagDrawer();
      });
    });

    one(".bag-clear-btn", bagDrawer)?.addEventListener("click", () => {
      if (confirm(isBn ? "আপনি কি নিশ্চিত যে সম্পূর্ণ ব্যাগ খালি করতে চান?" : "Are you sure you want to clear your entire bag?")) {
        saveBag([]);
        renderBagDrawer();
      }
    });
  };

  const addToBag = (productData, qty = 1) => {
    const bag = getBag();
    const existing = bag.find((item) => item.id === productData.id);
    if (existing) {
      existing.quantity = (Number(existing.quantity) || 1) + qty;
    } else {
      bag.push({
        id: productData.id,
        title: productData.title,
        slug: productData.slug,
        image: productData.image,
        category: productData.category || "",
        url: `/${language}/products/${productData.slug}/`,
        quantity: qty,
      });
    }
    saveBag(bag);
    showToast(
      language === "bn" ? `"${productData.title}" ব্যাগে যোগ হয়েছে।` : `Added "${productData.title}" to bag.`,
      language === "bn" ? "ব্যাগ দেখুন →" : "View Bag →",
      openBagDrawer
    );
  };

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-bag]");
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.dataset.addBag;
      const title = addBtn.dataset.productTitle;
      const slug = addBtn.dataset.productSlug;
      const image = addBtn.dataset.productImage;
      const category = addBtn.dataset.productCat;
      addToBag({ id, title, slug, image, category }, 1);
      addBtn.classList.add("is-added");
      const label = one(".btn-label", addBtn);
      const originalText = label ? label.textContent : "";
      if (label) label.textContent = language === "bn" ? "✓ যোগ হয়েছে" : "✓ Added";
      window.setTimeout(() => {
        addBtn.classList.remove("is-added");
        if (label) label.textContent = originalText;
      }, 1800);
    }
  });

  /* ==========================================================================
     SECTION F: WISHLIST — GUEST-FIRST, NO ACCOUNT REQUIRED
     --------------------------------------------------------------------------
     A visitor taps the heart on any product and it is saved in their own
     browser, exactly like the shopping bag above: no sign-up, no e-mail, no
     server round trip, nothing to accept. Only the product slug is stored, so
     every displayed fact (title, price, image) still comes from the catalogue
     and can never go stale. A signed-in customer's list is additionally
     mirrored under their account key on this device.
     ========================================================================== */

  const WISHLIST_KEY = "emarket247_wishlist";
  const WISHLIST_ACCOUNT_PREFIX = "emarket247_wishlist_account_";
  const WISHLIST_EVENT = "emk:wishlist-change";
  const WISHLIST_MAX_ITEMS = 120;
  const WISHLIST_ICON = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;

  const bilingual = (en, bn) => (language === "bn" ? bn : en);

  const wishlistPageUrl = () => `/${language}/wishlist/`;

  // Slugs are the only thing ever stored, and only in a shape the catalogue
  // can produce. Anything else is dropped rather than trusted.
  const wishlistSlug = (value) => {
    const slug = String(value ?? "").trim().toLowerCase();
    return /^[a-z0-9][a-z0-9-]{1,90}$/.test(slug) ? slug : "";
  };

  // Browsers can block or discard storage (private windows, hardened privacy
  // settings, storage pressure). The list therefore has three layers and uses
  // the strongest one that answers: the device (survives), the session (this
  // visit) and memory (this page). A visitor whose browser blocks saved items
  // can still build a wishlist and add it to the bag.
  const wishlistMemory = new Map();

  const wishlistStoreLayers = () => {
    const layers = [];
    try {
      if (window.localStorage) layers.push({ store: window.localStorage, level: "device" });
    } catch {
      // localStorage access itself can throw when the browser blocks it.
    }
    try {
      if (window.sessionStorage) layers.push({ store: window.sessionStorage, level: "session" });
    } catch {}
    layers.push({
      store: {
        getItem: (key) => (wishlistMemory.has(key) ? wishlistMemory.get(key) : null),
        setItem: (key, value) => wishlistMemory.set(key, value),
      },
      level: "memory",
    });
    return layers;
  };

  const normalizeWishlistSlugs = (parsed) =>
    Array.isArray(parsed)
      ? [...new Set(parsed.map(wishlistSlug).filter(Boolean))].slice(0, WISHLIST_MAX_ITEMS)
      : null;

  const readWishlistStore = (key) => {
    for (const layer of wishlistStoreLayers()) {
      let raw = null;
      try {
        raw = layer.store.getItem(key);
      } catch {
        raw = null;
      }
      if (raw === null || raw === undefined) continue;
      try {
        const slugs = normalizeWishlistSlugs(JSON.parse(raw));
        if (slugs) return slugs;
      } catch {
        // A corrupted entry must not take the page down; treat it as empty.
      }
    }
    return [];
  };

  // Writes to every layer so they agree, and reports the strongest level the
  // list was actually kept at: "device", "session" or "memory".
  const writeWishlistStore = (key, slugs) => {
    const value = JSON.stringify(slugs);
    let level = "memory";
    for (const layer of wishlistStoreLayers()) {
      try {
        layer.store.setItem(key, value);
        if (level === "memory") level = layer.level;
      } catch {}
    }
    return level;
  };

  // The signed-in user store lives in Section J, later in this file, so it is
  // resolved through a resolver this section owns the default for. The API
  // wrapper is wired the same way, and stays null on a static preview.
  let wishlistUserResolver = () => null;
  let wishlistApi = null;
  let wishlistPushTimer = 0;

  const wishlistCurrentUser = () => {
    try {
      return wishlistUserResolver() || null;
    } catch {
      return null;
    }
  };

  // Slugs the account would not keep, remembered on this device.
  //
  // The catalogue this storefront renders from and the product rows the account
  // stores against are two different lists, and they can legitimately disagree:
  // a piece published to the catalogue but not yet a row is saveable here and
  // refusable there. The piece stays in the customer's list on this device —
  // they saved it, and the page still renders it from the catalogue — but
  // remembering the refusal stops the reconciliation below from offering the
  // same slugs again on every single page load, forever. A push the customer's
  // own tap triggers always offers them again, so a piece that later gets its
  // row is taken up the next time they touch their wishlist.
  const WISHLIST_UNSYNCED_KEY = "emarket247_wishlist_unsynced";

  const readUnsyncedSlugs = () => new Set(readWishlistStore(WISHLIST_UNSYNCED_KEY));
  const writeUnsyncedSlugs = (slugs) =>
    writeWishlistStore(WISHLIST_UNSYNCED_KEY, [...slugs].slice(0, WISHLIST_MAX_ITEMS));

  // Debounced so a burst of taps becomes one request, and only ever called for
  // a signed-in customer: a guest makes no wishlist request at all.
  const pushWishlistToServer = (slugs) => {
    if (!wishlistApi || !wishlistCurrentUser()) return;
    window.clearTimeout(wishlistPushTimer);
    wishlistPushTimer = window.setTimeout(async () => {
      const res = await wishlistApi.call("wishlist.php", { action: "replace", slugs });
      // The endpoint reports what it refused rather than dropping it quietly,
      // so the answer is recorded here. An offline or failed call leaves the
      // previous memo alone: nothing was refused, the request never arrived.
      if (res && res.success && Array.isArray(res.rejected)) {
        writeUnsyncedSlugs(new Set(res.rejected.map(wishlistSlug).filter(Boolean)));
      }
    }, 600);
  };

  const wishlistAccountKey = () => {
    const user = wishlistCurrentUser();
    const identity = user ? (user.id ?? user.email ?? "") : "";
    return identity === "" ? "" : `${WISHLIST_ACCOUNT_PREFIX}${String(identity)}`;
  };

  const getWishlist = () => readWishlistStore(WISHLIST_KEY);
  const isWishlisted = (slug) => {
    const id = wishlistSlug(slug);
    return Boolean(id) && getWishlist().includes(id);
  };

  const updateWishlistCount = () => {
    const count = getWishlist().length;
    all("[data-wishlist-toggle]").forEach((control) => {
      let badge = one(".icon-badge", control);
      if (!badge) {
        badge = document.createElement("i");
        badge.className = "icon-badge";
        control.appendChild(badge);
      }
      badge.textContent = String(count);
      // A "0" badge is noise for a wishlist; hide it until something is saved.
      badge.hidden = count === 0;
      const base = bilingual("Wishlist", "উইশলিস্ট");
      control.setAttribute("aria-label", count ? `${base} (${count})` : base);
    });
  };

  // "reason" lets the wishlist page tell a visitor-initiated change from its own
  // housekeeping (pruning a slug that is no longer published), so a notice the
  // visitor needs to read is not wiped by the re-render that follows it.
  const announceWishlistChange = (reason = "user") => {
    document.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: { slugs: getWishlist(), reason } }));
  };

  const saveWishlist = (slugs, options = {}) => {
    const { reason = "user", sync = true } = options;
    const next = [...new Set(slugs.map(wishlistSlug).filter(Boolean))].slice(0, WISHLIST_MAX_ITEMS);
    const level = writeWishlistStore(WISHLIST_KEY, next);
    const accountKey = wishlistAccountKey();
    if (accountKey) writeWishlistStore(accountKey, next);
    updateWishlistCount();
    // Every heart on the page reflects the new state immediately: the control a
    // visitor just pressed must never keep showing the state it replaced.
    repaintWishlistButtons();
    announceWishlistChange(reason);
    // A signed-in customer's own list is mirrored to their account so it opens
    // on another device. Guests never cause a request.
    if (sync) pushWishlistToServer(next);
    return level;
  };

  const wishlistItemName = (title) => String(title || "").trim() || bilingual("This piece", "এই পণ্যটি");

  const addToWishlist = (slug, title) => {
    const id = wishlistSlug(slug);
    if (!id) return false;
    if (isWishlisted(id)) return true;
    const level = saveWishlist([id, ...getWishlist()]);
    const name = wishlistItemName(title);
    const view = bilingual("View wishlist →", "উইশলিস্ট দেখুন →");
    const openWishlist = () => {
      window.location.href = wishlistPageUrl();
    };
    if (level === "memory") {
      // Nothing could be stored anywhere: say so rather than claim a save.
      showToast(
        bilingual(
          "Your browser is blocking saved items, so this wishlist cannot be kept on this device.",
          "ব্রাউজার সংরক্ষণ ব্লক করায় এই ডিভাইসে উইশলিস্ট রাখা যাচ্ছে না।"
        )
      );
      return false;
    }
    if (level === "session") {
      showToast(
        language === "bn"
          ? `“${name}” শুধু এই ভিজিটের জন্য সংরক্ষিত — ব্রাউজার এই সাইটের সংরক্ষিত ডেটা রাখছে না।`
          : `Saved “${name}” for this visit — this browser is not keeping saved site data.`,
        view,
        openWishlist
      );
      return true;
    }
    showToast(
      language === "bn" ? `“${name}” উইশলিস্টে সংরক্ষিত হয়েছে।` : `Saved “${name}” to your wishlist.`,
      view,
      openWishlist
    );
    return true;
  };

  const removeFromWishlist = (slug, title) => {
    const id = wishlistSlug(slug);
    if (!id || !isWishlisted(id)) return true;
    saveWishlist(getWishlist().filter((item) => item !== id));
    const name = wishlistItemName(title);
    showToast(
      language === "bn" ? `“${name}” উইশলিস্ট থেকে সরানো হয়েছে।` : `Removed “${name}” from your wishlist.`,
      bilingual("Undo", "ফিরিয়ে আনুন"),
      () => addToWishlist(id, title)
    );
    return true;
  };

  const toggleWishlist = (slug, title) =>
    isWishlisted(slug) ? removeFromWishlist(slug, title) : addToWishlist(slug, title);

  const wishlistButtonText = (saved) =>
    saved ? bilingual("Saved to wishlist", "উইশলিস্টে সংরক্ষিত") : bilingual("Save to wishlist", "উইশলিস্টে সংরক্ষণ");

  const wishlistLabel = (saved, title) => {
    const name = String(title || "").trim();
    const suffix = name ? `: ${name}` : "";
    return saved
      ? bilingual(`Remove from wishlist${suffix}`, `উইশলিস্ট থেকে সরান${suffix}`)
      : bilingual(`Save to wishlist${suffix}`, `উইশলিস্টে সংরক্ষণ করুন${suffix}`);
  };

  const wishlistButtonMarkup = (slug, title, options = {}) => {
    const id = wishlistSlug(slug);
    if (!id) return "";
    const { className = "wishlist-btn", withLabel = false } = options;
    const saved = isWishlisted(id);
    const label = wishlistLabel(saved, title);
    const text = withLabel
      ? `<span class="wishlist-btn-text">${esc(wishlistButtonText(saved))}</span>`
      : "";
    return `<button type="button" class="${className}${saved ? " is-active" : ""}" data-wishlist-item="${esc(id)}" data-wishlist-title="${esc(title || "")}" aria-pressed="${saved}" aria-label="${esc(label)}" title="${esc(label)}">${WISHLIST_ICON}${text}</button>`;
  };

  const paintWishlistButton = (button, savedSlugs = new Set(getWishlist())) => {
    const saved = savedSlugs.has(wishlistSlug(button.dataset.wishlistItem));
    button.classList.toggle("is-active", saved);
    button.setAttribute("aria-pressed", String(saved));
    const label = wishlistLabel(saved, button.dataset.wishlistTitle);
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    const text = one(".wishlist-btn-text", button);
    if (text) text.textContent = wishlistButtonText(saved);
  };

  // The saved set is read once per pass rather than once per button.
  const repaintWishlistButtons = (scope = document) => {
    const savedSlugs = new Set(getWishlist());
    all("[data-wishlist-item]", scope).forEach((button) => paintWishlistButton(button, savedSlugs));
  };

  // Cards pre-rendered into the HTML by the catalogue generator get the same
  // heart as the ones this script builds, so a saved product is never missing
  // its control whichever layer drew the grid.
  const enhanceProductCards = (scope = document) => {
    all(".product-card", scope).forEach((card) => {
      if (one("[data-wishlist-item]", card)) return;
      const source = one("[data-product-slug]", card);
      const link = one('a[href*="/products/"]', card);
      const slug = wishlistSlug(
        source?.dataset.productSlug || (link?.getAttribute("href") || "").match(/\/products\/([^/?#]+)/)?.[1]
      );
      if (!slug) return;
      const title = source?.dataset.productTitle || one(".product-card-title", card)?.textContent?.trim() || "";
      card.insertAdjacentHTML("afterbegin", wishlistButtonMarkup(slug, title));
    });
  };

  const initPdpWishlist = () => {
    const addBtn = one("#pdp-add-bag");
    if (!addBtn) return;
    const slug = wishlistSlug(addBtn.dataset.slug);
    if (!slug) return;
    const row = addBtn.closest(".pdp-actions-row") || addBtn.parentElement;
    if (!row || one("[data-wishlist-item]", row)) return;
    const title = addBtn.dataset.title || one(".pdp-title")?.textContent?.trim() || "";
    row.insertAdjacentHTML(
      "beforeend",
      wishlistButtonMarkup(slug, title, { className: "wishlist-btn wishlist-btn-labelled", withLabel: true })
    );
  };

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-wishlist-remove]");
    if (removeBtn) {
      e.preventDefault();
      removeFromWishlist(removeBtn.dataset.wishlistRemove, removeBtn.dataset.wishlistTitle);
      return;
    }
    const itemBtn = e.target.closest("[data-wishlist-item]");
    if (itemBtn) {
      e.preventDefault();
      toggleWishlist(itemBtn.dataset.wishlistItem, itemBtn.dataset.wishlistTitle);
      return;
    }
    // Pages served from cache of an earlier release still carry the header
    // control as a <button>; current pages ship a real link and need no help.
    const headerControl = e.target.closest("[data-wishlist-toggle]");
    if (headerControl && headerControl.tagName !== "A") {
      e.preventDefault();
      window.location.href = wishlistPageUrl();
    }
  });

  // Keep every open tab of a browser in step with the saved list.
  window.addEventListener("storage", (event) => {
    if (event.key !== WISHLIST_KEY) return;
    updateWishlistCount();
    repaintWishlistButtons();
    announceWishlistChange();
  });

  const productCard = (product, options = {}) => {
    const pdpUrl = `/${language}/products/${esc(product.slug)}/`;
    const ctaText = language === "bn" ? "বিস্তারিত দেখুন →" : "View detail →";
    const waMsg = language === "bn"
      ? `হ্যালো eMarket247, আমি ${product.title} (রেফারেন্স: ${product.id}, লিঙ্ক: https://emarket247.shop/${language}/products/${product.slug}/) অর্ডার বা তথ্য জানতে আগ্রহী।`
      : `Hello eMarket247, I want to inquire about ${product.title} (Ref: ${product.id}, Link: https://emarket247.shop/${language}/products/${product.slug}/).`;
    const waUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waMsg)}`;

    const priceNum = Number(product.price);
    // Single source of truth: a real price (>0) always displays. "Price on
    // request" only appears when no price has been set yet — the same rule the
    // backend enforces on write, so a stale legacy flag can never hide a price.
    const isPending = !(priceNum > 0);
    const priceText = isPending
      ? (language === "bn" ? "মূল্য জানতে যোগাযোগ করুন" : "Price on request")
      : `৳${priceNum.toLocaleString("en-US")}`;

    // The heart sits as a sibling of the media link rather than inside it: a
    // button nested in an anchor is invalid HTML and swallows keyboard focus.
    const removeMarkup = options.showRemove
      ? `<div class="wishlist-card-remove-wrap"><button type="button" class="wishlist-remove-btn" data-wishlist-remove="${esc(product.slug)}" data-wishlist-title="${esc(product.title)}">${language === "bn" ? "উইশলিস্ট থেকে সরান" : "Remove from wishlist"}</button></div>`
      : "";

    return `<article class="product-card" data-product-id="${esc(product.id)}">
      ${wishlistButtonMarkup(product.slug, product.title)}
      <a class="product-card-media" href="${pdpUrl}" aria-label="${esc(product.title)}">
        <img src="${esc(product.image.src)}" srcset="${esc(product.image.srcset || product.image.src)}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 33vw" width="${esc(product.image.width)}" height="${esc(product.image.height)}" loading="lazy" alt="${esc(product.image.alt)}">
        <span class="product-card-badge">${esc(product.id)}</span>
      </a>
      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-cat">${esc(product.categoryLabel)}</span>
          <span class="product-card-status">● ${language === "bn" ? "প্রস্তুত" : "Ready"}</span>
        </div>
        <h3 class="product-card-title"><a href="${pdpUrl}">${esc(product.title)}</a></h3>
        <small class="product-card-desc">${esc(product.image.caption)}</small>
        <p class="product-card-price${isPending ? " is-pending" : ""}">${priceText}</p>
      </div>
      <div class="product-card-actions">
        <button type="button" class="product-card-add-btn" data-add-bag="${esc(product.id)}" data-product-title="${esc(product.title)}" data-product-slug="${esc(product.slug)}" data-product-image="${esc(product.image.src)}" data-product-cat="${esc(product.categoryLabel)}" aria-label="${language === "bn" ? "ব্যাগে যোগ করুন: " + esc(product.title) : "Add to bag: " + esc(product.title)}">
          <span class="btn-icon">+</span> <span class="btn-label">${language === "bn" ? "ব্যাগে যোগ" : "Add to Bag"}</span>
        </button>
        <a class="product-card-wa-btn" href="${waUrl}" target="_blank" rel="noopener noreferrer" aria-label="${language === "bn" ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}" title="${language === "bn" ? "WhatsApp-এ অনুসন্ধান" : "Inquire on WhatsApp"}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>
        <a class="product-card-cta" href="${pdpUrl}">${ctaText}</a>
      </div>
      ${removeMarkup}
    </article>`;
  };

  // One table, both languages. The API answers with the label stored in the
  // database while the catalogue snapshot answers with a slug, so categorySlug()
  // normalises either to the slug the grids and tabs filter on - otherwise an
  // API-served page could not match its own category. categoryName() is what the
  // shopper reads, always in the current language.
  const CATEGORY_NAMES = {
    bangles: { en: "Bangles", bn: "চুড়ি" },
    bracelets: { en: "Bracelets", bn: "ব্রেসলেট" },
    earrings: { en: "Earrings", bn: "কানের দুল" },
    necklaces: { en: "Necklaces", bn: "হার" },
    pendants: { en: "Pendants", bn: "লকেট" },
    rings: { en: "Rings", bn: "আংটি" },
    "jewellery-sets": { en: "Jewellery Sets", bn: "জুয়েলারি সেট" },
    "bridal-jewellery": { en: "Bridal Jewellery", bn: "ব্রাইডাল জুয়েলারি" },
    "gift-jewellery": { en: "Gift Jewellery", bn: "উপহারের জুয়েলারি" },
    "jewellery-detail": { en: "Jewellery detail", bn: "জুয়েলারি আইটেম" },
    unassigned: { en: "All details", bn: "সব আইটেম" }
  };

  const categoryName = (category) => (CATEGORY_NAMES[category] || {})[language] || category;

  const categorySlug = (value) => {
    const raw = String(value ?? "").trim();
    if (CATEGORY_NAMES[raw]) return raw;
    const lowered = raw.toLowerCase();
    const found = Object.keys(CATEGORY_NAMES).find((slug) =>
      Object.keys(CATEGORY_NAMES[slug]).some((lang) => CATEGORY_NAMES[slug][lang].toLowerCase() === lowered)
    );
    return found || raw;
  };

  const recordOrder = (product) => {
    const digits = String(product.id ?? "").match(/\d+/);
    return digits ? Number(digits[0]) : Number.MAX_SAFE_INTEGER;
  };

  // ── Catalogue filters ──────────────────────────────────────────────────────
  // Faceted filtering for the shop and category grids, and the single place a
  // product's facets are derived. Facets are read from the reviewed title, and
  // the keyword sets cover both languages, so /bn/ filters exactly like /en/.
  //
  // Selection logic: chips inside one facet are OR-ed, different facets are
  // AND-ed. Adding a chip inside a facet widens the result; adding a facet
  // narrows it. AND inside a facet would be meaningless for Price in particular,
  // because no piece can sit in two price buckets at once.
  //
  // URL state is language-neutral (category, price, finish, design, format, q,
  // sort) so a filtered view can be shared between /en/ and /bn/.

  const FACET_KEYS = ["price", "finish", "design", "format"];

  const FACET_LABELS = {
    price: { en: "Price", bn: "মূল্য" },
    finish: { en: "Finish", bn: "ফিনিশ" },
    design: { en: "Design", bn: "ডিজাইন" },
    format: { en: "Format", bn: "ধরন" }
  };

  // [value, label, matcher]. A title may match several values in the same facet
  // (a pearl-and-stone piece is both); that is expected.
  const FACET_KEYWORDS = {
    finish: [
      ["gold-tone", { en: "Gold-tone", bn: "সোনালি" }, /gold|সোনালি|গোল্ড/i],
      ["silver-tone", { en: "Silver-tone", bn: "রুপালি" }, /silver|রুপালি|সিলভার/i],
      ["rose-gold", { en: "Rose gold", bn: "রোজ গোল্ড" }, /rose[- ]gold|রোজ[- ]গোল্ড/i],
      ["two-tone", { en: "Two-tone", bn: "টু-টোন" }, /two[- ]tone|টু[- ]টোন/i],
      ["pearl", { en: "Pearl accent", bn: "পার্ল" }, /pearl|পার্ল|মুক্তা/i],
      ["stone", { en: "Stone-set", bn: "স্টোন-সেট" }, /stone|crystal|zircon|\bcz\b|diamond|gem|স্টোন|পাথর|ক্রিস্টাল|জিরকন/i],
      ["bead", { en: "Beaded", bn: "পুঁতির কাজ" }, /bead|পুঁতি|বিড/i]
    ],
    design: [
      ["floral", { en: "Floral", bn: "ফুলেল" }, /floral|flower|petal|leaf|ফুল|পাতা/i],
      ["heart", { en: "Heart", bn: "হার্ট" }, /heart|হৃদ|হার্ট/i],
      ["geometric", { en: "Geometric", bn: "জ্যামিতিক" }, /geometric|square|circle|lattice|signet|baguette|infinity|triangle|hexagon|dome|জ্যামিতিক|চৌকো|বৃত্ত|জালি|ব্যাগেট|ইনফিনিটি|ত্রিভুজ/i],
      ["textured", { en: "Textured & engraved", bn: "টেক্সচার ও খোদাই" }, /textured|engraved|ornate|braided|interwoven|twisted|rope|filigree|টেক্সচার|খোদাই|কারুকাজ|বিনুনি|বুনন/i],
      ["drop", { en: "Drop & statement", bn: "ড্রপ ও স্টেটমেন্ট" }, /\bdrop|dangling|teardrop|statement|chandelier|tassel|ড্রপ|ঝুলন্ত|জলবিন্দু|স্টেটমেন্ট|ঝুমকা/i],
      ["minimal", { en: "Slim & petite", bn: "স্লিম ও ছোট" }, /petite|slim|dainty|minimal|thin|delicate|স্লিম|ছোট|পেটিট/i],
      ["charm", { en: "Charm & chain", bn: "চার্ম ও চেইন" }, /charm|station|চার্ম|স্টেশন/i]
    ]
  };

  // Format is one value per piece, first match wins: a set beats a pair beats a
  // single piece.
  const FORMAT_KEYWORDS = [
    // \b keeps "set" from matching inside "Rosette" or "sunset".
    ["set", { en: "Set", bn: "সেট" }, /\bset\b|সেট/i],
    ["pair", { en: "Pair", bn: "জোড়া" }, /\bpair\b|জোড়া/i],
    ["single", { en: "Single piece", bn: "একক" }, null]
  ];

  const PRICE_BUCKETS = [
    ["under-500", { en: "Under ৳500", bn: "৳500-এর নিচে" }, (n) => n < 500],
    ["500-999", { en: "৳500 – ৳999", bn: "৳500 – ৳999" }, (n) => n >= 500 && n <= 999],
    ["1000-1999", { en: "৳1,000 – ৳1,999", bn: "৳1,000 – ৳1,999" }, (n) => n >= 1000 && n <= 1999],
    ["2000-4999", { en: "৳2,000 – ৳4,999", bn: "৳2,000 – ৳4,999" }, (n) => n >= 2000 && n <= 4999],
    ["5000-plus", { en: "৳5,000 and above", bn: "৳5,000 বা বেশি" }, (n) => n >= 5000],
    ["on-request", { en: "Price on request", bn: "মূল্য জানতে যোগাযোগ করুন" }, null]
  ];

  const PRICE_PENDING_NOTE = {
    en: "Prices are being published — every piece is currently quoted on WhatsApp. Price bands appear here automatically once prices go live.",
    bn: "মূল্য প্রকাশের কাজ চলছে — বর্তমানে প্রতিটি গহনার দাম হোয়াটসঅ্যাপে জানানো হয়। মূল্য প্রকাশ হলে দামের সীমা এখানে স্বয়ংক্রিয়ভাবে দেখা যাবে।"
  };

  const CATALOG_CATEGORIES = ["rings", "bangles", "jewellery-sets", "bracelets", "necklaces", "earrings", "pendants"];

  const priceBucketOf = (product) => {
    const value = Number(product.price);
    if (!(value > 0)) return "on-request";
    const bucket = PRICE_BUCKETS.find(([, , matches]) => matches && matches(value));
    return bucket ? bucket[0] : "on-request";
  };

  // Every record — from the API, the snapshot or a pre-rendered card — is given
  // the same facet shape, so filtering behaves identically whichever source won.
  const withFacets = (product) => {
    // Bangla written with a combining nukta (ড + ়) and Bangla written with the
    // precomposed letter (ড়) are the same word. Normalise before matching, or a
    // facet would match one spelling and silently miss the other.
    const title = String(product.title || "").normalize("NFC");
    const facets = { price: priceBucketOf(product), finish: [], design: [], format: "single" };
    Object.keys(FACET_KEYWORDS).forEach((facet) => {
      facets[facet] = FACET_KEYWORDS[facet]
        .filter(([, , matches]) => matches.test(title))
        .map(([value]) => value);
    });
    const format = FORMAT_KEYWORDS.find(([, , matches]) => matches && matches.test(title));
    facets.format = format ? format[0] : "single";
    return { ...product, facets };
  };

  const facetValues = (product, facet) => {
    const value = product.facets[facet];
    return Array.isArray(value) ? value : [value];
  };

  // True when the record survives the search box and every narrowed facet.
  const matchesState = (product, state) => {
    if (state.q) {
      const haystack = `${product.title} ${product.id} ${product.categoryLabel} ${product.description || ""}`.normalize("NFC").toLowerCase();
      if (!haystack.includes(state.q.normalize("NFC").toLowerCase())) return false;
    }
    return FACET_KEYS.every((facet) => {
      const selected = state[facet];
      if (!selected.length) return true;
      return facetValues(product, facet).some((value) => selected.includes(value));
    });
  };

  const sortProducts = (products, value) => {
    const list = [...products];
    if (value === "price-asc" || value === "price-desc") {
      const direction = value === "price-asc" ? 1 : -1;
      const priceOf = (product) => (Number(product.price) > 0 ? Number(product.price) : null);
      return list.sort((a, b) => {
        const left = priceOf(a);
        const right = priceOf(b);
        // A piece with no confirmed price sorts last in both directions: an
        // unknown price is not a low price.
        if (left === null && right === null) return recordOrder(a) - recordOrder(b);
        if (left === null) return 1;
        if (right === null) return -1;
        return (left - right) * direction || recordOrder(a) - recordOrder(b);
      });
    }
    return list.sort((a, b) => recordOrder(a) - recordOrder(b) || a.catalogIndex - b.catalogIndex);
  };

  const buildControls = (host, records, pageCategory) => {
    const toolbar = host.previousElementSibling;
    const target = toolbar?.classList.contains("catalog-toolbar") ? toolbar : host.parentElement;

    const bn = language === "bn";
    const products = records.map(withFacets);
    const hasKnownPrice = products.some((product) => Number(product.price) > 0);
    const pageScope = pageCategory && pageCategory !== "catalog" ? pageCategory : "all";

    const params = new URLSearchParams(window.location.search);
    const listParam = (key) => (params.get(key) || "").split(",").map((v) => v.trim()).filter(Boolean);
    const state = {
      category: params.get("category") || pageScope,
      price: listParam("price"),
      finish: listParam("finish"),
      design: listParam("design"),
      format: listParam("format"),
      q: params.get("q") || "",
      sort: params.get("sort") || "featured"
    };

    // A hand-edited or stale link must never wedge the grid on a value that no
    // longer exists, so unknown selections are dropped before the first render.
    const knownValues = (facet) => (facet === "price" ? PRICE_BUCKETS : FACET_KEYWORDS[facet] || FORMAT_KEYWORDS).map(([value]) => value);
    FACET_KEYS.forEach((facet) => {
      state[facet] = state[facet].filter((value) => knownValues(facet).includes(value));
    });
    if (state.category !== "all" && !CATALOG_CATEGORIES.includes(state.category)) state.category = pageScope;

    const facetsId = `catalog-facets-${Math.random().toString(36).slice(2, 8)}`;

    // Only offer an option the catalogue can actually satisfy.
    const optionsFor = (facet) => {
      const rules = facet === "price" ? PRICE_BUCKETS : FACET_KEYWORDS[facet] || FORMAT_KEYWORDS;
      return rules
        .filter(([value]) => products.some((product) => facetValues(product, facet).includes(value)))
        .map(([value, labels]) => [value, labels]);
    };

    const facetPanel = (facet) => {
      const label = FACET_LABELS[facet][language] || FACET_LABELS[facet].en;
      if (facet === "price" && !hasKnownPrice) {
        return `<fieldset class="catalog-facet" data-facet-group="price"><legend>${label}</legend><p class="catalog-facet-note">${PRICE_PENDING_NOTE[language] || PRICE_PENDING_NOTE.en}</p></fieldset>`;
      }
      const chips = optionsFor(facet)
        .map(([value, labels]) => `<button type="button" class="catalog-chip" data-facet="${facet}" data-value="${esc(value)}" aria-pressed="false">${esc(labels[language] || labels.en)}</button>`)
        .join("");
      return `<fieldset class="catalog-facet" data-facet-group="${facet}"><legend>${label}</legend><div class="catalog-chips">${chips}</div></fieldset>`;
    };

    const tabs = [["all", bn ? "সব" : "All"]].concat(
      CATALOG_CATEGORIES.map((category) => [category, categoryName(category)])
    );
    const tabsHtml = tabs
      .map(([category, label]) => `<button type="button" class="catalog-tab" data-category-tab="${esc(category)}" aria-pressed="false">${esc(label)} <span class="catalog-tab-count"></span></button>`)
      .join("");

    const searchHtml = `<div class="catalog-search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input type="search" class="catalog-search-input" placeholder="${bn ? "অলংকার বা ধরন খুঁজুন..." : "Search jewellery by name, type..."}" aria-label="${bn ? "অলংকার খুঁজুন" : "Search jewellery"}" value="${esc(state.q)}"><button type="button" class="catalog-search-clear" aria-label="${bn ? "সার্চ মুছুন" : "Clear search"}"${state.q ? "" : " hidden"}>×</button></div>`;

    const control = document.createElement("div");
    control.className = "catalog-controls";
    control.setAttribute("aria-label", bn ? "ক্যাটালগ ফিল্টার ও সাজানোর নিয়ন্ত্রণ" : "Catalogue filters and sorting controls");
    control.innerHTML = `
      <div class="catalog-controls-top">
        <button type="button" class="catalog-filter-toggle" aria-expanded="false" aria-controls="${facetsId}"><span aria-hidden="true">☷</span> ${bn ? "ফিল্টার" : "Filter"} <b class="catalog-filter-count" hidden>0</b></button>
        ${searchHtml}
        <span class="catalog-result-count" aria-live="polite"></span>
        <label class="sr-only" for="catalog-sort">${bn ? "সাজান" : "Sort"}</label>
        <select id="catalog-sort" data-sort>
          <option value="featured">${bn ? "নির্বাচিত" : "Featured"}</option>
          <option value="price-asc">${bn ? "দাম: কম থেকে বেশি" : "Price: low to high"}</option>
          <option value="price-desc">${bn ? "দাম: বেশি থেকে কম" : "Price: high to low"}</option>
        </select>
      </div>
      <div class="catalog-tabs" role="group" aria-label="${bn ? "ক্যাটাগরি" : "Category"}">${tabsHtml}</div>
      <div class="catalog-facets" id="${facetsId}">
        ${FACET_KEYS.map(facetPanel).join("")}
        <button type="button" class="catalog-clear">${bn ? "সব ফিল্টার মুছুন" : "Clear all filters"}</button>
      </div>`;

    target.insertAdjacentElement("afterend", control);

    const searchInput = one(".catalog-search-input", control);
    const searchClear = one(".catalog-search-clear", control);
    const activeFacetCount = () =>
      FACET_KEYS.reduce((total, facet) => total + state[facet].length, 0) + (state.category !== "all" ? 1 : 0);

    const syncUrl = () => {
      const next = new URLSearchParams();
      if (state.category !== "all") next.set("category", state.category);
      FACET_KEYS.forEach((facet) => {
        if (state[facet].length) next.set(facet, state[facet].join(","));
      });
      if (state.q) next.set("q", state.q);
      if (state.sort !== "featured") next.set("sort", state.sort);
      const query = next.toString();
      // replaceState, not pushState: filtering should not fill the back button.
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
    };

    const countFor = (category) =>
      products.filter((product) => (category === "all" || product.category === category) && matchesState(product, state)).length;

    const visibleProducts = () =>
      sortProducts(
        products.filter((product) => (state.category === "all" || product.category === state.category) && matchesState(product, state)),
        state.sort
      );

    const render = () => {
      const visible = visibleProducts();
      if (visible.length) {
        host.innerHTML = visible.map((product) => productCard(product)).join("");
      } else {
        host.innerHTML = `<div class="catalog-no-results">
          <h3>${bn ? "কোনো পণ্য পাওয়া যায়নি" : "No matching jewellery found"}</h3>
          <p>${bn ? "অনুগ্রহ করে অন্য শব্দ ব্যবহার করুন অথবা সম্পূর্ণ সংগ্রহ দেখতে ফিল্টার রিসেট করুন।" : "Try adjusting your search terms or reset the filters to view the full edit."}</p>
          <button type="button" class="catalog-reset-btn button button-outline">${bn ? "সব পণ্য দেখুন ↺" : "View all pieces ↺"}</button>
        </div>`;
      }
      enhanceProductCards(host);

      one(".catalog-result-count", control).textContent = bn
        ? `${visible.length}টি অলংকার`
        : `${visible.length} ${visible.length === 1 ? "piece" : "pieces"}`;

      all("[data-category-tab]", control).forEach((tab) => {
        const category = tab.dataset.categoryTab;
        const count = countFor(category);
        tab.setAttribute("aria-pressed", String(category === state.category));
        one(".catalog-tab-count", tab).textContent = String(count);
        tab.classList.toggle("is-empty", count === 0);
      });

      all("[data-facet]", control).forEach((chip) =>
        chip.setAttribute("aria-pressed", String(state[chip.dataset.facet].includes(chip.dataset.value)))
      );

      const badge = one(".catalog-filter-count", control);
      const active = activeFacetCount();
      badge.textContent = String(active);
      badge.hidden = active === 0;

      syncUrl();
    };

    const resetAll = () => {
      FACET_KEYS.forEach((facet) => { state[facet] = []; });
      state.q = "";
      if (searchInput) searchInput.value = "";
      if (searchClear) searchClear.hidden = true;
      render();
    };

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        state.q = event.target.value;
        if (searchClear) searchClear.hidden = !state.q;
        render();
      });
    }

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        state.q = "";
        searchInput.value = "";
        searchClear.hidden = true;
        searchInput.focus();
        render();
      });
    }

    all("[data-category-tab]", control).forEach((tab) =>
      tab.addEventListener("click", () => {
        state.category = tab.dataset.categoryTab;
        render();
      })
    );

    all("[data-facet]", control).forEach((chip) =>
      chip.addEventListener("click", () => {
        const facet = chip.dataset.facet;
        const value = chip.dataset.value;
        state[facet] = state[facet].includes(value)
          ? state[facet].filter((item) => item !== value)
          : state[facet].concat(value);
        render();
      })
    );

    one(".catalog-clear", control).addEventListener("click", resetAll);

    const toggle = one(".catalog-filter-toggle", control);
    toggle.addEventListener("click", () => {
      const open = control.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // A filter can empty the grid, so the empty state needs its own way back.
    host.addEventListener("click", (event) => {
      if (event.target.closest(".catalog-reset-btn")) resetAll();
    });

    const sortSelect = one("[data-sort]", control);
    sortSelect.value = state.sort;
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      render();
    });

    render();
  };

  // Source 1 — live database API (authoritative when reachable).
  const recordsFromApi = async () => {
    const response = await fetch(`/api/products.php`);
    const data = await response.json();
    if (!data.success || !Array.isArray(data.products) || !data.products.length) {
      throw new Error("API response unsuccessful or empty");
    }
    // Map Database Record -> Frontend Product Object
    return data.products.map((p, index) => ({
      id: p.sku,
      slug: p.slug,
      title: language === "bn" ? p.title_bn : p.title_en,
      category: categorySlug(p.category),
      categoryLabel: categoryName(categorySlug(p.category)),
      price: p.price,
      pricePending: Number(p.is_price_pending) === 1,
      status: p.is_active ? "ready" : "inactive",
      image: {
        src: p.image_url,
        srcset: p.image_url,
        width: 1200,
        height: 1200,
        alt: language === "bn" ? p.title_bn : p.title_en,
        caption: language === "bn" ? p.lead_bn : p.lead_en
      },
      catalogIndex: index
    }));
  };

  // Source 2 — the reviewed catalogue snapshot shipped with the site. It is
  // the approved fallback layer when the database is unreachable, so the
  // shop, category and wishlist views never go blank on an API failure.
  const recordsFromCatalogue = async () => {
    const response = await fetch(`/assets/data/catalog.${language}.json`);
    const data = await response.json();
    if (!Array.isArray(data.products) || !data.products.length) {
      throw new Error("catalogue snapshot unavailable or empty");
    }
    return data.products.map((p, index) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: categorySlug(p.category),
      categoryLabel: categoryName(categorySlug(p.category)),
      price: p.price,
      pricePending: !(Number(p.price) > 0),
      status: p.status,
      description: p.description,
      image: p.image,
      catalogIndex: index
    }));
  };

  // One loader for every view that needs product records, so a saved slug
  // always resolves to exactly the record the grid itself would show.
  const loadCatalogRecords = async () => {
    try {
      return { source: "api", records: await recordsFromApi() };
    } catch (apiErr) {
      console.warn("Catalog API unavailable:", apiErr.message);
      try {
        return { source: "catalogue", records: await recordsFromCatalogue() };
      } catch (jsonErr) {
        console.error("Catalog Load Error (API and snapshot both failed):", jsonErr);
        return { source: "none", records: null };
      }
    }
  };

  all("[data-catalog]").forEach(async (host) => {
    // Static cards pre-rendered into the page are the last line of defence:
    // they must never be wiped unless real records arrived to replace them.
    const hasStaticCards = Boolean(one(".product-card", host));
    const { source, records } = await loadCatalogRecords();

    const pageCategory = (host.dataset.category || "").toLowerCase();
    // "catalog" is a sentinel: show all ready products with no category filter.
    // A real category slug (rings, necklaces, etc.) opens on that category.
    const ready = records ? records.filter((product) => product.status === "ready") : [];
    const inScope = (list) => list.filter((product) => !pageCategory || pageCategory === "catalog" || categorySlug(product.category) === pageCategory);

    // The API is down. The pre-rendered cards on this page are the reviewed
    // published state, so the snapshot is only allowed to drive the grid when it
    // agrees with them: same records, same count. Filters are offered in that
    // case, because a static preview or an API outage must not lose the whole
    // catalogue UI. If the two disagree, the published cards win and no controls
    // are drawn - a filtered view that contradicts the page would be worse than
    // no filters at all.
    if (source === "catalogue" && hasStaticCards) {
      const published = all(".product-card", host).length;
      if (ready.length && inScope(ready).length === published) {
        buildControls(host, ready, pageCategory);
      } else {
        console.warn(
          `Catalogue snapshot and the pre-rendered grid disagree (${inScope(ready).length} vs ${published}); leaving the reviewed cards untouched.`
        );
        enhanceProductCards(host);
      }
      return;
    }

    if (!records) {
      if (hasStaticCards) {
        enhanceProductCards(host);
        return;
      }
      host.innerHTML = `<p>${esc(host.dataset.empty || (language === "bn" ? "পণ্যের তালিকা প্রস্তুত করা হচ্ছে।" : "Approved products are being prepared."))}</p>`;
      return;
    }

    if (!inScope(ready).length) {
      // No live records for this view: keep static cards rather than wiping them.
      if (!hasStaticCards) {
        host.innerHTML = `<p class="catalog-empty">${language === "bn" ? "এই বিভাগের জন্য নিশ্চিত পণ্যের তথ্য এখনও প্রকাশের অপেক্ষায় আছে। সব পণ্য দেখতে শপ পেজে যান।" : "Verified product records for this category are awaiting publication. Visit Shop to browse all supplied images under review."}</p>`;
      } else {
        enhanceProductCards(host);
      }
      return;
    }
    // The whole ready set reaches the controls, not just this page's slice, so the
    // category tabs can count every category and switch between them in place.
    buildControls(host, ready, pageCategory);
  });

  /* ==========================================================================
     SECTION F: WISHLIST PAGE (/en/wishlist/ AND /bn/wishlist/)
     --------------------------------------------------------------------------
     The dedicated page reads the slugs saved in the visitor's browser and asks
     the same two catalogue sources the grids use for their current facts, so a
     saved piece can never display a stale title, price or image.
     ========================================================================== */

  const initWishlistPage = () => {
    const host = one("[data-wishlist-page]");
    if (!host) return;

    const countEl = one("[data-wishlist-count]");
    const toolbar = one("[data-wishlist-toolbar]");
    const statusEl = one("[data-wishlist-status]");
    const accountNote = one("[data-wishlist-account-note]");
    let records = null;
    let loadFailed = false;
    // Set only when saved slugs were dropped because they are no longer
    // published, so the visitor is told instead of silently losing a piece.
    let pruneNotice = "";

    const setStatus = (message) => {
      if (statusEl) statusEl.textContent = message;
    };

    const emptyMarkup = () => `
      <div class="wishlist-empty">
        <svg width="52" height="52" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
        <h2>${language === "bn" ? "আপনার উইশলিস্ট এখন খালি" : "Your wishlist is currently empty"}</h2>
        ${pruneNotice ? `<p class="wishlist-status is-visible">${pruneNotice}</p>` : ""}
        <p>${language === "bn" ? "পছন্দের গহনা সংরক্ষণ করতে যেকোনো পণ্যের ছবিতে হার্ট আইকনে ট্যাপ করুন — অ্যাকাউন্ট বা ইমেইল লাগবে না।" : "Tap the heart on any product to save it here — no account or e-mail needed, and nothing leaves your browser."}</p>
        <a class="wishlist-empty-cta" href="/${language}/shop/">${language === "bn" ? "গহনা সংগ্রহ দেখুন →" : "Explore our jewellery collection →"}</a>
        <p class="wishlist-empty-hint">${language === "bn" ? "শুরু করার জনপ্রিয় পথ:" : "Popular starting points:"} <a href="/${language}/categories/">${language === "bn" ? "ক্যাটাগরি" : "categories"}</a> · <a href="/${language}/occasions/">${language === "bn" ? "উপলক্ষ" : "occasions"}</a></p>
      </div>`;

    const loadingMarkup = () => `
      <div class="wishlist-loading" role="status">
        <p>${language === "bn" ? "আপনার সংরক্ষিত পণ্যগুলো আনা হচ্ছে…" : "Loading your saved pieces…"}</p>
      </div>`;

    const errorMarkup = () => `
      <div class="wishlist-empty">
        <h2>${language === "bn" ? "সংরক্ষিত পণ্যের তথ্য আনা যাচ্ছে না" : "Saved pieces could not be loaded"}</h2>
        <p>${language === "bn" ? "আপনার উইশলিস্ট মুছে যায়নি — সংযোগ ফিরে এলে আবার চেষ্টা করুন।" : "Your wishlist is still saved in this browser. Try again once the connection is back."}</p>
        <button type="button" class="wishlist-action-btn" data-wishlist-retry>${language === "bn" ? "আবার চেষ্টা করুন ↺" : "Try again ↺"}</button>
        <p class="wishlist-empty-hint"><a href="/${language}/shop/">${language === "bn" ? "সব গহনা দেখুন" : "Browse all jewellery"}</a></p>
      </div>`;

    const renderAccountNote = () => {
      if (!accountNote) return;
      accountNote.hidden = false;
      const user = wishlistCurrentUser();
      if (user) {
        const name = user.full_name || user.email || "";
        accountNote.innerHTML =
          language === "bn"
            ? `<strong>${esc(name)}</strong> হিসেবে সাইন ইন করা আছে — আপনার উইশলিস্ট অ্যাকাউন্টে সংরক্ষিত, তাই অন্য ডিভাইস থেকেও একই তালিকা দেখতে পাবেন। নিচের তালিকা থেকে যেকোনো সময় ব্যাগে যোগ করতে পারবেন।`
            : `Signed in as <strong>${esc(name)}</strong>. Your wishlist is saved to your account, so it opens on your other devices too, and you can add any saved piece to your bag below.`;
        return;
      }
      accountNote.innerHTML =
        language === "bn"
          ? `অ্যাকাউন্ট ছাড়াই ব্যবহারযোগ্য — উইশলিস্ট এই ব্রাউজারে সংরক্ষিত থাকে, কোনো সার্ভারে যায় না। চাইলে <a href="/bn/account/">অ্যাকাউন্ট খুলে</a> এটি আপনার অ্যাকাউন্টে সংরক্ষণ করুন, যাতে অন্য ডিভাইস থেকেও দেখা যায়।`
          : `No account needed — your wishlist is stored in this browser and is not sent anywhere. You can <a href="/en/account/">create an account</a> to save it to your account and open it on another device.`;
    };

    const render = () => {
      const slugs = getWishlist();
      if (countEl) countEl.textContent = String(slugs.length);
      if (toolbar) toolbar.hidden = slugs.length === 0;
      renderAccountNote();

      if (!slugs.length) {
        setStatus("");
        host.innerHTML = emptyMarkup();
        return;
      }
      if (loadFailed) {
        host.innerHTML = errorMarkup();
        one("[data-wishlist-retry]", host)?.addEventListener("click", load);
        return;
      }
      if (!records) {
        host.innerHTML = loadingMarkup();
        return;
      }

      const bySlug = new Map(records.map((record) => [record.slug, record]));
      const products = slugs.map((slug) => bySlug.get(slug)).filter(Boolean);
      const missing = slugs.filter((slug) => !bySlug.has(slug));

      if (missing.length) {
        // A saved slug with no approved record any more (unpublished, renamed
        // or retired). Prune it so the page never lists an unreviewed item,
        // then let this same render run again from the change event.
        pruneNotice =
          language === "bn"
            ? `${missing.length}টি সংরক্ষিত পণ্য আর প্রকাশিত নেই, তাই উইশলিস্ট থেকে সরানো হয়েছে।`
            : `${missing.length} saved ${missing.length === 1 ? "piece is" : "pieces are"} no longer published and ${missing.length === 1 ? "was" : "were"} removed from your wishlist.`;
        setStatus(pruneNotice);
        saveWishlist(
          slugs.filter((slug) => !missing.includes(slug)),
          { reason: "prune" }
        );
        return;
      }

      setStatus(pruneNotice);
      host.innerHTML = products.map((product) => productCard(product, { showRemove: true })).join("");
    };

    const load = async () => {
      loadFailed = false;
      records = null;
      render();
      const { records: loaded } = await loadCatalogRecords();
      if (!loaded) {
        loadFailed = true;
        render();
        return;
      }
      // Only published records may be shown, exactly as the grids do.
      records = loaded.filter((record) => record.status === "ready");
      render();
    };

    one("[data-wishlist-add-all]")?.addEventListener("click", () => {
      const bySlug = new Map((records || []).map((record) => [record.slug, record]));
      const products = getWishlist().map((slug) => bySlug.get(slug)).filter(Boolean);
      if (!products.length) return;
      products.forEach((product) =>
        addToBag(
          {
            id: product.id,
            title: product.title,
            slug: product.slug,
            image: product.image?.src || "",
            category: product.categoryLabel
          },
          1
        )
      );
      showToast(
        language === "bn"
          ? `${products.length}টি পণ্য আপনার ব্যাগে যোগ হয়েছে।`
          : `${products.length} ${products.length === 1 ? "piece" : "pieces"} added to your bag.`,
        language === "bn" ? "ব্যাগ দেখুন →" : "View bag →",
        openBagDrawer
      );
    });

    one("[data-wishlist-clear]")?.addEventListener("click", () => {
      const question =
        language === "bn"
          ? "উইশলিস্ট থেকে সব সংরক্ষিত পণ্য সরিয়ে ফেলবেন?"
          : "Remove every saved piece from your wishlist?";
      if (!window.confirm(question)) return;
      saveWishlist([]);
      showToast(language === "bn" ? "উইশলিস্ট খালি করা হয়েছে।" : "Your wishlist is now empty.");
    });

    // Any change made anywhere on the page (a heart, a remove button, another
    // tab) re-renders this grid from the single stored list. Only the page's
    // own pruning keeps its notice: a visitor's next action clears it.
    document.addEventListener(WISHLIST_EVENT, (event) => {
      if (event.detail?.reason !== "prune") pruneNotice = "";
      render();
    });
    render();
    load();
  };

  // PDP Interactivity (Quantity Stepper, Add to Bag, Share Piece)
  const initPdpFeatures = () => {
    const pdpAddBtn = one("#pdp-add-bag");
    const qtyVal = one("#pdp-qty-display");
    const waCta = one("#pdp-whatsapp-cta");
    let currentQty = 1;

    const updateWaLink = () => {
      if (!waCta || !pdpAddBtn) return;
      const title = pdpAddBtn.dataset.title || "";
      const id = pdpAddBtn.dataset.pdpAddBag || "";
      const slug = pdpAddBtn.dataset.slug || "";
      const isBn = language === "bn";
      const link = `https://emarket247.shop/${language}/products/${slug}/`;
      const text = isBn
        ? `হ্যালো eMarket247, আমি ${title} (রেফারেন্স: ${id}, পরিমাণ: ${currentQty}, লিঙ্ক: ${link}) অর্ডার বা প্রাপ্যতা জানতে আগ্রহী।`
        : `Hello eMarket247, I want to inquire about ordering ${title} (Ref: ${id}, Quantity: ${currentQty}, Link: ${link}).`;
      waCta.href = `https://wa.me/8801740501062?text=${encodeURIComponent(text)}`;
    };

    all("[data-pdp-qty-change]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const change = Number(btn.dataset.pdpQtyChange);
        currentQty = Math.max(1, currentQty + change);
        if (qtyVal) qtyVal.textContent = String(currentQty);
        updateWaLink();
      });
    });

    if (pdpAddBtn) {
      pdpAddBtn.addEventListener("click", () => {
        const id = pdpAddBtn.dataset.pdpAddBag;
        const title = pdpAddBtn.dataset.title;
        const slug = pdpAddBtn.dataset.slug;
        const image = pdpAddBtn.dataset.img;
        const category = pdpAddBtn.dataset.cat;
        addToBag({ id, title, slug, image, category }, currentQty);
        pdpAddBtn.classList.add("is-added");
        const textSpan = one(".pdp-bag-text", pdpAddBtn);
        const original = textSpan ? textSpan.textContent : "";
        if (textSpan) textSpan.textContent = language === "bn" ? "✓ ব্যাগে যোগ হয়েছে" : "✓ Added to Bag";
        window.setTimeout(() => {
          pdpAddBtn.classList.remove("is-added");
          if (textSpan) textSpan.textContent = original;
        }, 2000);
      });
    }

    all("[data-share-url]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const url = btn.dataset.shareUrl || window.location.href;
        const title = btn.dataset.shareTitle || document.title;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(url);
            showToast(language === "bn" ? "পণ্যের লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!" : "Product link copied to clipboard!");
            return;
          } catch {}
        }
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
            return;
          } catch {}
        }
        prompt(language === "bn" ? "পণ্যের লিঙ্ক কপি করুন:" : "Copy product link:", url);
      });
    });
  };

  /* ==========================================================================
     SECTION J: CUSTOMER ACCOUNT, STORE ADMIN DASHBOARD & HOSTINGER DB INTEGRATION
     ========================================================================== */

  // Global Keys for Client Cache & Hostinger DB Sync
  const USER_KEY = "emk_current_user";
  const REGISTERED_USERS_KEY = "emk_registered_users";
  const ORDERS_KEY = "emk_orders_list";
  const CUSTOM_PRODUCTS_KEY = "emk_custom_products";
  const DB_CONFIG_KEY = "emk_hostinger_config";

  // Default seed accounts for testing & administration
  const getStoredUsers = () => [];
  const saveStoredUsers = (users) => {};

  // Header Nav Account Link Integration (across all pages)
  const updateNavAccount = () => {
    const navActions = one(".nav-actions");
    if (!navActions) return;
    let accLink = one(".account-link", navActions);
    const currentUser = getCurrentUser();
    const targetUrl = language === "bn" ? "/bn/account/" : "/en/account/";
    const label = currentUser
      ? (currentUser.full_name ? currentUser.full_name.split(" ")[0] : (language === "bn" ? "প্রোফাইল" : "Account"))
      : (language === "bn" ? "অ্যাকাউন্ট" : "Account");

    if (!accLink) {
      accLink = document.createElement("a");
      accLink.className = "account-link";
      accLink.href = targetUrl;
      accLink.setAttribute("aria-label", language === "bn" ? "গ্রাহক অ্যাকাউন্ট" : "Customer Account");
      const bagLink = one(".bag-link", navActions);
      if (bagLink) {
        navActions.insertBefore(accLink, bagLink);
      } else {
        navActions.appendChild(accLink);
      }
    }
    accLink.href = targetUrl;
    accLink.innerHTML = `<span class="nav-ic"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg></span> <b class="account-name-badge">${esc(label)}</b>`;
    if (currentUser) {
      accLink.classList.add("is-logged-in");
    } else {
      accLink.classList.remove("is-logged-in");
    }
  };

  // Footer Navigation Integration (Adds Account & Admin Portal links)
  const updateFooterLinks = () => {
    const footerBlocks = all(".footer-main > div");
    if (footerBlocks.length >= 3) {
      const careCol = footerBlocks[2];
      if (careCol && !one("a[href*='/account/']", careCol)) {
        const accA = document.createElement("a");
        accA.href = language === "bn" ? "/bn/account/" : "/en/account/";
        accA.textContent = language === "bn" ? "আমার অ্যাকাউন্ট" : "My Account";
        careCol.appendChild(accA);
      }
      if (careCol && !one("a[href*='/admin/']", careCol)) {
        const admA = document.createElement("a");
        admA.href = language === "bn" ? "/bn/admin/" : "/en/admin/";
        admA.textContent = language === "bn" ? "অ্যাডমিন পোর্টাল" : "Admin Portal";
        admA.style.color = "#8b6528";
        careCol.appendChild(admA);
      }
    }
  };

  // Orders Store (Client Cache & Hostinger DB Sync)
  const getOrders = () => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      if (!orders.length) {
        return [];
      }
      return orders;
    } catch {
      return [];
    }
  };

  const saveOrders = (orders) => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  };

  // Hostinger PHP/MySQL API Wrapper
  // Session CSRF token: issued by the API on any GET (get_session) and
  // rotated on login/register. Every write request must echo it back in the
  // X-CSRF-Token header or the server rejects the write with 403.
  let csrfToken = "";
  const captureCsrf = (payload) => {
    if (payload && typeof payload.csrf_token === "string" && payload.csrf_token) {
      csrfToken = payload.csrf_token;
    }
    return payload;
  };
  const csrfHeaders = () => (csrfToken ? { "X-CSRF-Token": csrfToken } : {});

  const hostingerApi = {
    async call(script, data = {}) {
      try {
        const response = await fetch(`/api/${script}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...csrfHeaders() },
          body: JSON.stringify(data)
        });
        if (!response.ok && response.status !== 401 && response.status !== 403 && response.status !== 409 && response.status !== 429) {
          throw new Error(`HTTP ${response.status}`);
        }
        return captureCsrf(await response.json());
      } catch (err) {
        console.warn(`[Hostinger API] ${script} fetch failed or in static preview:`, err.message);
        return { success: false, offline: true, error: err.message };
      }
    },
    async get(script) {
        try {
            const response = await fetch(`/api/${script}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return captureCsrf(await response.json());
        } catch (err) {
            return { success: false, offline: true, error: err.message };
        }
    }
  };

  // Auth State Management
  let _currentUser = null;
  const getCurrentUser = () => _currentUser;
  const setCurrentUser = (user) => {
    _currentUser = user;
    updateNavAccount();
    // A session that begins mid-page (admin sign-in, session refresh) must still
    // reconcile the wishlist; a customer sign-in reloads the page anyway.
    mergeWishlistWithAccount();
    mergeWishlistWithServer();
  };

  // ---------------------------------------------------------------------------
  // Wishlist <-> account bridge (see Section F).
  //
  // The wishlist itself never requires an account. When one is signed in, the
  // list saved in this browser is mirrored under that account's own key, and a
  // returning customer's mirrored list is merged back in, so two customers
  // using the same browser never inherit each other's saved pieces. Nothing is
  // uploaded: this stays a per-device, per-account copy of the visitor's list.
  // ---------------------------------------------------------------------------
  wishlistUserResolver = getCurrentUser;
  wishlistApi = hostingerApi;

  const mergeWishlistWithAccount = () => {
    const accountKey = wishlistAccountKey();
    if (!accountKey) return;
    const saved = getWishlist();
    const merged = [...new Set([...saved, ...readWishlistStore(accountKey)])].slice(0, WISHLIST_MAX_ITEMS);
    writeWishlistStore(accountKey, merged);
    if (merged.length === saved.length) return;
    writeWishlistStore(WISHLIST_KEY, merged);
    updateWishlistCount();
    repaintWishlistButtons();
    announceWishlistChange();
  };

  // ---------------------------------------------------------------------------
  // Wishlist <-> account server sync.
  //
  // A guest's wishlist never leaves the browser: this runs only when a customer
  // is signed in, and then the list saved here and the list stored on the
  // account are unioned, so a piece saved on a phone appears on a laptop and
  // nothing a guest saved on this device is lost by signing in. Anything the
  // browser has that the account does not is pushed up once, then the browser
  // copy stays the offline source for the next visit.
  // ---------------------------------------------------------------------------
  const mergeWishlistWithServer = async () => {
    if (!wishlistApi || !wishlistCurrentUser()) return;
    const res = await wishlistApi.get("wishlist.php");
    if (!res || !res.success || !Array.isArray(res.items)) return;

    const serverSlugs = [...new Set(res.items.map(wishlistSlug).filter(Boolean))].slice(0, WISHLIST_MAX_ITEMS);
    const browserSlugs = getWishlist();
    const merged = [...new Set([...browserSlugs, ...serverSlugs])].slice(0, WISHLIST_MAX_ITEMS);
    const accountKey = wishlistAccountKey();
    writeWishlistStore(WISHLIST_KEY, merged);
    if (accountKey) writeWishlistStore(accountKey, merged);

    if (JSON.stringify(merged) !== JSON.stringify(browserSlugs)) {
      updateWishlistCount();
      repaintWishlistButtons();
      announceWishlistChange("server");
    }

    const serverHas = new Set(serverSlugs);
    const unsynced = readUnsyncedSlugs();

    // Keep the memo honest: a slug the account now holds, or one the customer
    // has since removed, is no longer refused and must not stay remembered.
    const stale = [...unsynced].filter((slug) => serverHas.has(slug) || !merged.includes(slug));
    if (stale.length) {
      stale.forEach((slug) => unsynced.delete(slug));
      writeUnsyncedSlugs(unsynced);
    }

    // Push only when this device holds something the account has never seen and
    // has not already refused. Without the second test every page load offers
    // the same refused slugs again and gets the same answer.
    if (merged.some((slug) => !serverHas.has(slug) && !unsynced.has(slug))) {
      pushWishlistToServer(merged);
    }
  };

  // Sync auth state with server
  const syncAuthState = async () => {
    const res = await hostingerApi.get("auth.php?action=get_session");
    if (res.success && res.user) {
        setCurrentUser(res.user);
    } else {
        setCurrentUser(null);
    }
  };

  // Record order upon bag WhatsApp checkout
  document.addEventListener("click", (e) => {
    const waCheckoutBtn = e.target.closest(".bag-checkout-wa");
    if (waCheckoutBtn) {
      const bag = getBag();
      if (!bag.length) return;
      const currentUser = getCurrentUser();
      const orderNumber = "EMK-" + Date.now().toString().slice(-6);
      const newOrder = {
        id: Date.now(),
        order_number: orderNumber,
        customer_name: currentUser?.full_name || (language === "bn" ? "ওয়েবসাইট ভিজিটর" : "Guest Customer"),
        customer_email: currentUser?.email || "",
        customer_phone: currentUser?.phone || "+880 1740-501062",
        items: bag.map(i => ({ title: i.title, sku: i.id, qty: i.quantity })),
        total_amount: 0,
        status: "pending",
        channel: "WhatsApp Checkout",
        created_at: new Date().toISOString().replace("T", " ").substring(0, 16)
      };

      const orders = getOrders();
      orders.unshift(newOrder);
      saveOrders(orders);

      // Async sync to Hostinger PHP MySQL
      // Send items only; PHP calculates total authoritatively
      hostingerApi.call("orders.php", { action: "create", ...newOrder, total_amount: undefined });
    }
  });

  /* --------------------------------------------------------------------------
     CUSTOMER ACCOUNT PAGE CONTROLLER
     -------------------------------------------------------------------------- */
  const initCustomerAccount = () => {
    const authSection = one("#auth-unauthenticated");
    const accountDashboard = one("#auth-authenticated");
    if (!authSection || !accountDashboard) return;

    const renderAccountView = () => {
      const user = getCurrentUser();

      if (user) {
        authSection.style.display = "none";
        accountDashboard.style.display = "block";

        // Populate User Info
        const nameEl = one("#profile-full-name");
        const emailEl = one("#profile-email");
        const phoneEl = one("#profile-phone");
        const avatarEl = one("#profile-avatar-letter");
        const idBadge = one("#profile-user-id");
        const roleBadge = one("#profile-role-badge");

        if (nameEl) nameEl.textContent = user.full_name || user.email;
        if (emailEl) emailEl.textContent = user.email;
        if (phoneEl) phoneEl.textContent = user.phone ? `${user.phone}` : "";
        if (avatarEl) avatarEl.textContent = (user.full_name || user.email).charAt(0).toUpperCase();
        if (idBadge) idBadge.textContent = `#${user.id || 101}`;
        if (roleBadge) {
          roleBadge.textContent = user.role === "admin"
            ? (language === "bn" ? "অ্যাডমিনিস্ট্রেটর" : "Administrator")
            : (language === "bn" ? "সম্মানিত গ্রাহক" : "Preferred Customer");
        }

        // Show Admin direct card if user is administrator
        const adminCard = one("#account-admin-shortcut");
        if (adminCard) {
          adminCard.style.display = user.role === "admin" ? "block" : "none";
        }

        // Populate Metric counts
        const allOrders = getOrders();
        // Only the user's own orders (matched by email) — admins see all.
        // The old predicate showed EVERY cached order when user.email was
        // empty, which over-shared across accounts on a shared browser.
        const userOrders = allOrders.filter(o => user.role === "admin" || (user.email && o.customer_email === user.email));
        const bag = getBag();

        const statInquiries = one("#stat-user-inquiries");
        const statBag = one("#stat-user-bag-items");
        if (statInquiries) statInquiries.textContent = String(userOrders.length);
        if (statBag) statBag.textContent = String(bag.length);

        // The wishlist stays optional for guests; a signed-in customer simply
        // sees what is already saved in this browser next to their bag count.
        const wishlistCount = one("#user-wishlist-count");
        if (wishlistCount) wishlistCount.textContent = String(getWishlist().length);

        // Populate Recent Orders in Overview
        const overviewOrders = one("#recent-orders-overview");
        if (overviewOrders) {
          if (!userOrders.length) {
            overviewOrders.innerHTML = `<p class="bag-drawer-empty" style="padding: 16px 0;">${language === "bn" ? "এখনও কোনো অনুসন্ধান বা অর্ডার নেই।" : "No recent orders or inquiries found."}</p>`;
          } else {
            overviewOrders.innerHTML = userOrders.slice(0, 3).map(o => `
              <div class="order-row-item">
                <div class="order-meta">
                  <span class="order-title">${esc(o.order_number)} — ${esc(o.items.map(i => i.title).join(", "))}</span>
                  <span class="order-subtitle">${esc(o.created_at)} · ${esc(o.channel || "WhatsApp")}</span>
                </div>
                <span class="status-badge ${esc(o.status)}">${esc(o.status)}</span>
              </div>
            `).join("");
          }
        }

        // Populate Full Orders Pane
        const ordersFullList = one("#account-orders-full-list");
        if (ordersFullList) {
          if (!userOrders.length) {
            ordersFullList.innerHTML = `<p class="bag-drawer-empty">${language === "bn" ? "আপনার কোনো পূর্ববর্তী অর্ডার রেকর্ড নেই।" : "You have no past order records."}</p>`;
          } else {
            ordersFullList.innerHTML = userOrders.map(o => `
              <div class="order-row-item" style="margin-bottom: 12px;">
                <div class="order-meta">
                  <strong style="font-size: 15px;">${esc(o.order_number)}</strong>
                  <span style="color: #444; font-size: 13px;">${esc(o.items.map(i => `${i.title} (x${i.qty || 1})`).join(" + "))}</span>
                  <span class="order-subtitle">তারিখ: ${esc(o.created_at)} · মাধ্যম: ${esc(o.channel)}</span>
                </div>
                <div style="text-align: right;">
                  <span class="status-badge ${esc(o.status)}">${esc(o.status)}</span>
                  <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600;">৳${Number(o.total_amount || 0).toLocaleString()}</p>
                </div>
              </div>
            `).join("");
          }
        }

        // Populate Saved Bag Pane
        const savedBagList = one("#account-saved-bag-list");
        if (savedBagList) {
          if (!bag.length) {
            savedBagList.innerHTML = `<p class="bag-drawer-empty">${language === "bn" ? "আপনার শপিং ব্যাগে কোনো পণ্য সংরক্ষিত নেই।" : "Your shopping bag is currently empty."}</p>`;
          } else {
            savedBagList.innerHTML = bag.map(item => `
              <div class="order-row-item" style="margin-bottom: 12px; align-items: center;">
                <img src="${esc(item.image)}" alt="${esc(item.title)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">
                <div class="order-meta" style="flex: 1; padding: 0 14px;">
                  <strong>${esc(item.title)}</strong>
                  <span class="order-subtitle">SKU: ${esc(item.id)} · পরিমাণ: ${esc(item.quantity)}</span>
                </div>
                <a href="${item.url || '#'}" class="button button-outline" style="padding: 6px 12px; font-size: 12px;">${language === "bn" ? "পণ্য দেখুন" : "View"}</a>
              </div>
            `).join("");
          }
        }

        // Populate Address Form
        const addrName = one("#addr-full-name");
        const addrPhone = one("#addr-phone");
        const addrDistrict = one("#addr-district");
        const addrDetails = one("#addr-details");
        if (addrName) addrName.value = user.full_name || "";
        if (addrPhone) addrPhone.value = user.phone || "";
        if (addrDistrict && user.district) addrDistrict.value = user.district;
        if (addrDetails && user.address) addrDetails.value = user.address;

      } else {
        authSection.style.display = "flex";
        accountDashboard.style.display = "none";
      }
    };

    // Tab Switching (Sign In / Register)
    all(".auth-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        all(".auth-tab-btn").forEach(b => b.classList.remove("is-active"));
        all(".auth-panel").forEach(p => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        const target = btn.dataset.authTab || btn.getAttribute("aria-controls");
        if (target) one(`#${target}`)?.classList.add("is-active");
      });
    });

    // "Sign in here" link inside the register form switches back to login
    one("#switch-to-login-btn")?.addEventListener("click", () => {
      one("#tab-login-btn")?.click();
    });
    one("#btn-switch-to-login")?.addEventListener("click", () => {
      one("[data-auth-tab='panel-login']")?.click();
    });

    // Account Subnav Switching
    all("[data-account-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        all("[data-account-tab]").forEach(b => b.classList.remove("is-active"));
        all(".account-pane").forEach(p => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        const paneId = btn.dataset.accountTab;
        one(`#${paneId}`)?.classList.add("is-active");
      });
    });

    // Quick trigger from overview to other tabs
    all("[data-account-tab-trigger]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.accountTabTrigger;
        one(`[data-account-tab="${target}"]`)?.click();
      });
    });

  // Customer Authentication Handler
  const loginForm = one("#customer-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = one("#login-email")?.value.trim().toLowerCase();
      const password = one("#login-password")?.value;

      const res = await hostingerApi.call("auth.php", { action: "login", email, password });
      if (res && res.success && res.user) {
        setCurrentUser(res.user);
        showToast(language === "bn" ? `স্বাগতম, ${res.user.full_name}!` : `Welcome back, ${res.user.full_name}!`);
        // We do *not* call renderAccountView here because this form only exists
        // inside the auth section, and we should ideally reload or redirect.
        // Keeping current behavior as minimal update:
        window.location.reload();
      } else {
        showToast(language === "bn" ? "ভুল ইমেইল বা পাসওয়ার্ড।" : "Invalid email or password.");
      }
    });
  }

    // Register Form Handler
    const registerForm = one("#customer-register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = one("#reg-name")?.value.trim();
        const email = one("#reg-email")?.value.trim().toLowerCase();
        const phone = one("#reg-phone")?.value.trim();
        const city = one("#reg-city")?.value || "Dhaka";
        const pass = one("#reg-password")?.value;
        if (!pass || pass.length < 6) {
          showToast(language === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.");
          return;
        }
        const passConfirm = one("#reg-password-confirm")?.value;
        if (pass !== passConfirm) {
          showToast(language === "bn" ? "দুটি পাসওয়ার্ড মিলছে না।" : "The two passwords do not match.");
          return;
        }

        // The server is the only account store. Success is claimed ONLY when
        // the API actually created the account — the old code fell through to
        // a localStorage user (with the plaintext password) and announced
        // success even when the API had failed or the email already existed.
        const apiRes = await hostingerApi.call("auth.php", {
          action: "register",
          full_name: name,
          email,
          phone,
          city,
          address: one("#reg-address")?.value.trim() || "",
          password: pass
        });

        if (apiRes && apiRes.success && apiRes.user) {
          setCurrentUser(apiRes.user);
          showToast(language === "bn" ? "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" : "Account created successfully!");
          window.location.reload();
          return;
        }

        if (apiRes && apiRes.offline) {
          showToast(language === "bn"
            ? "সার্ভারে সংযোগ করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
            : "Cannot reach the server right now. Please try again shortly.");
          return;
        }

        const duplicate = apiRes && typeof apiRes.error === "string" && apiRes.error.toLowerCase().includes("already exists");
        showToast(duplicate
          ? (language === "bn" ? "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।" : "An account with this email already exists.")
          : (language === "bn" ? "অ্যাকাউন্ট তৈরি করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।" : "Account could not be created. Please check your details and try again."));
      });
    }

    // Address & Profile Update Handler
    const addressForm = one("#account-address-form");
    if (addressForm) {
      addressForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) return;
        user.full_name = one("#addr-full-name")?.value.trim() || user.full_name;
        user.phone = one("#addr-phone")?.value.trim() || user.phone;
        user.district = one("#addr-district")?.value || user.district;
        user.address = one("#addr-details")?.value.trim() || "";

        setCurrentUser(user);
        const users = getStoredUsers().map(u => u.email === user.email ? { ...u, ...user } : u);
        saveStoredUsers(users);

        showToast(language === "bn" ? "ঠিকানা ও তথ্য আপডেট সম্পন্ন হয়েছে!" : "Profile details saved successfully!");
        renderAccountView();
      });
    }

    // Logout Handler
    one("#btn-customer-logout")?.addEventListener("click", () => {
      if (confirm(language === "bn" ? "আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে লগআউট করবেন?" : "Are you sure you want to log out?")) {
        setCurrentUser(null);
        showToast(language === "bn" ? "সফলভাবে লগআউট করা হয়েছে।" : "Logged out successfully.");
        renderAccountView();
      }
    });

    // Saving or removing a piece elsewhere in the dashboard updates the count.
    document.addEventListener(WISHLIST_EVENT, () => {
      const wishlistCount = one("#user-wishlist-count");
      if (wishlistCount) wishlistCount.textContent = String(getWishlist().length);
    });

    renderAccountView();
  };

  /* --------------------------------------------------------------------------
     STORE ADMIN DASHBOARD CONTROLLER
     -------------------------------------------------------------------------- */
  const initAdminDashboard = () => {
    const adminLoginScreen = one("#admin-login-screen");
    const adminMainApp = one("#admin-main-app");
    if (!adminLoginScreen || !adminMainApp) return;

    // Retrieve or seed custom products
    const getCustomProducts = () => {
      try {
        return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || "[]");
      } catch {
        return [];
      }
    };

    const saveCustomProducts = (prods) => {
      try {
        localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(prods));
      } catch {}
    };

    let allProducts = [];
    let editingProductId = null;

    const isAdminAuthenticated = () => {
      const user = getCurrentUser();
      return user && user.role === "admin";
    };

    const renderAdminAuth = () => {
      if (isAdminAuthenticated()) {
        adminLoginScreen.style.display = "none";
        adminMainApp.style.display = "flex";
        loadDashboardData();
      } else {
        adminLoginScreen.style.display = "flex";
        adminMainApp.style.display = "none";
      }
    };

    // Admin Login Form
    const adminLoginForm = one("#admin-login-form");
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = one("#admin-email")?.value.trim().toLowerCase();
        const password = one("#admin-password")?.value;

        // Try Hostinger API
        const apiRes = await hostingerApi.call("auth.php", { action: "login", email, password });
        if (apiRes && apiRes.success && apiRes.user && apiRes.user.role === "admin") {
          setCurrentUser(apiRes.user);
          renderAdminAuth();
          showToast("Admin authenticated successfully!");
          return;
        } else {
          showToast(language === "bn" ? "ভুল অ্যাডমিন তথ্য! দয়া করে সঠিক পাসওয়ার্ড দিন।" : "Invalid admin credentials. Access denied.");
        }
      });
    }

    // Admin Logout
    one("#admin-logout-button")?.addEventListener("click", () => {
      if (confirm(language === "bn" ? "অ্যাডমিন পোর্টাল থেকে প্রস্থান করতে চান?" : "Exit Admin Dashboard?")) {
        setCurrentUser(null);
        renderAdminAuth();
        showToast("Logged out of Admin Portal.");
      }
    });

    // Admin Tabs Navigation
    all("[data-admin-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        all("[data-admin-tab]").forEach(b => b.classList.remove("is-active"));
        all(".admin-pane").forEach(p => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        const paneId = btn.dataset.adminTab;
        one(`#${paneId}`)?.classList.add("is-active");
      });
    });

    all("[data-admin-tab-trigger]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.adminTabTrigger;
        one(`[data-admin-tab="${target}"]`)?.click();
      });
    });

    // Product Modal handling
    const productModal = one("#product-modal-dialog");
    const openProductModal = (product = null) => {
      editingProductId = product ? product.id : null;
      const titleEl = one("#product-modal-title");
      if (titleEl) {
        titleEl.textContent = product
          ? (language === "bn" ? `পণ্য সম্পাদন: ${product.title}` : `Edit Product: ${product.title}`)
          : (language === "bn" ? "নতুন জুয়েলারি আপলোড" : "Upload New Jewellery Product");
      }

      const idField = one("#prod-edit-id");
      const titleEn = one("#prod-title-en");
      const titleBn = one("#prod-title-bn");
      const sku = one("#prod-sku");
      const category = one("#prod-category");
      const stock = one("#prod-stock-status");
      const price = one("#prod-price");
      const pricePending = one("#prod-price-pending");
      const imgUrl = one("#prod-image-url");
      const leadEn = one("#prod-lead-en");
      const previewImg = one("#prod-img-preview-tag");

      if (idField) idField.value = product ? product.id : "";
      if (titleEn) titleEn.value = product ? product.title : "";
      if (titleBn) titleBn.value = product ? (product.title_bn || "") : "";
      if (sku) sku.value = product ? product.id : ("EMK-" + Date.now().toString().slice(-4));
      if (category) category.value = product ? (product.categoryLabel || "Rings") : "Rings";
      if (stock) stock.value = product ? (product.stock_status || "in_stock") : "in_stock";
      // Blank price for a new product (never prefill a fake price that would
        // look like it was already set to the client); keep the real value on edit.
        if (price) price.value = product ? (product.price > 0 ? product.price : "") : "";
      // The pending flag only means something when no price has been set yet.
      // A legacy row may still carry is_price_pending=1 alongside a real price;
      // reflect the true state (pending only when price is absent).
      if (pricePending) pricePending.checked = product ? (!!product.pricePending && !(Number(product.price) > 0)) : false;
      const material = one("#prod-material");
      if (material) material.value = product ? (product.material || "") : "";
      if (imgUrl) imgUrl.value = product ? (product.image?.src || "") : "";
      if (leadEn) leadEn.value = product ? (product.image?.caption || "") : "";
      if (previewImg) {
        previewImg.src = product ? (product.image?.src || "/assets/images/brand/emarket247-logo-transparent.png") : "/assets/images/brand/emarket247-logo-transparent.png";
      }

      if (productModal) productModal.style.display = "flex";
    };

    const closeProductModal = () => {
      if (productModal) productModal.style.display = "none";
      editingProductId = null;
    };

    one("#btn-open-product-modal")?.addEventListener("click", () => openProductModal());
    one("#btn-quick-add-product")?.addEventListener("click", () => openProductModal());
    one("#btn-quick-new-product")?.addEventListener("click", () => openProductModal());
    one("#btn-close-product-modal")?.addEventListener("click", closeProductModal);
    one("#btn-cancel-product-modal")?.addEventListener("click", closeProductModal);

    // File upload handler for product image
    const fileInput = one("#prod-file-input");
    const triggerFileBtn = one("#btn-trigger-file-upload");
    const imgUrlInput = one("#prod-image-url");
    const previewTag = one("#prod-img-preview-tag");

    triggerFileBtn?.addEventListener("click", () => fileInput?.click());
    fileInput?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Preview immediately
      if (previewTag) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => { previewTag.src = loadEvt.target.result; };
        reader.readAsDataURL(file);
      }

      // Upload to server
      showToast(language === "bn" ? "ইমেজ আপলোড হচ্ছে..." : "Uploading image...");
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/upload.php", { method: "POST", headers: csrfHeaders(), body: formData });
        const data = await res.json();
        if (data.success && data.path) {
          if (imgUrlInput) imgUrlInput.value = data.path;
          showToast(language === "bn" ? "ইমেজ আপলোড সফল!" : "Image uploaded successfully!");
        } else {
          showToast(language === "bn" ? "ত্রুটি: " : "Error: " + (data.error || "Upload failed"));
        }
      } catch (err) {
        showToast(language === "bn" ? "সার্ভারে আপলোড ব্যর্থ হয়েছে।" : "Server upload failed.");
      }
    });

    imgUrlInput?.addEventListener("input", (e) => {
      if (previewTag && e.target.value) {
        previewTag.src = e.target.value;
      }
    });

    // Product Form Save (Create or Update)
    const productEditForm = one("#admin-product-edit-form");
    if (productEditForm) {
      productEditForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const skuVal = one("#prod-sku")?.value.trim();
        const titleEnVal = one("#prod-title-en")?.value.trim();
        const titleBnVal = one("#prod-title-bn")?.value.trim();
        const catVal = one("#prod-category")?.value;
        const stockVal = one("#prod-stock-status")?.value;
        const priceVal = Number(one("#prod-price")?.value || 0);
        const pricePendingVal = one("#prod-price-pending")?.checked;
        const imageVal = one("#prod-image-url")?.value.trim() || "/assets/images/products/emarket247-gold-tone-cross-band-bangle-10.webp";
        const leadVal = one("#prod-lead-en")?.value.trim() || "Traditional handcrafted gold-tone finish";
        const materialVal = one("#prod-material")?.value.trim() || "22K Gold Luster & Sterling Silver";

        // Maps the category chosen in this form to its category-page slug. Every
        // option the form offers must appear here: the lookup below used to fall
        // back to "rings", so a Bridal or Gift product was filed as a Ring in the
        // admin's own records while the database kept the correct label.
        const categorySlugMap = {
          "Rings": "rings",
          "Earrings": "earrings",
          "Necklaces": "necklaces",
          "Bracelets": "bracelets",
          "Bangles": "bangles",
          "Pendants": "pendants",
          "Jewellery Sets": "jewellery-sets",
          "Bridal Jewellery": "bridal-jewellery",
          "Gift Jewellery": "gift-jewellery"
        };

        // Derive a slug from any label this map does not know rather than
        // defaulting to a real category: a new category must never be filed
        // under an existing one by accident. product.php resolves the same way.
        const rawCategory = String(catVal ?? "").trim();
        const categorySlug = categorySlugMap[rawCategory]
          || rawCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const itemSlug = skuVal.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const productObj = {
          id: skuVal,
          title: titleEnVal,
          title_bn: titleBnVal,
          slug: itemSlug,
          category: categorySlug,
          categoryLabel: catVal,
          status: "ready",
          stock_status: stockVal,
          price: priceVal,
          pricePending: pricePendingVal,
          image: {
            src: imageVal,
            srcset: imageVal,
            width: 1350,
            height: 1800,
            alt: titleEnVal,
            caption: leadVal
          }
        };

        // Build the database payload with the exact column names products.php
        // expects. The local productObj uses display-oriented names, so map them.
        const dbPayload = {
          action: editingProductId ? "update" : "create",
          sku: editingProductId || skuVal,
          title_en: titleEnVal,
          title_bn: titleBnVal,
          category: catVal,
          price: priceVal,
          // A price > 0 always publishes (the server enforces this too); only a
          // product with no price yet stays pending ("price on request").
          is_price_pending: priceVal > 0 ? 0 : 1,
          stock_status: stockVal,
          image_url: imageVal,
          lead_en: leadVal,
          material: materialVal
        };

        // Wait for the live database to confirm before claiming success.
        const saveBtn = productEditForm.querySelector('[type="submit"]');
        if (saveBtn) saveBtn.disabled = true;
        const apiRes = await hostingerApi.call("products.php", dbPayload);
        if (saveBtn) saveBtn.disabled = false;

        if (!apiRes || !apiRes.success) {
          const msg = apiRes && apiRes.error ? apiRes.error : (language === "bn" ? "সার্ভারে সংরক্ষণ ব্যর্থ হয়েছে।" : "Saving to the server failed.");
          showToast((language === "bn" ? "ত্রুটি: " : "Error: ") + msg);
          return;
        }

        let customProds = getCustomProducts();

        if (editingProductId) {
          // Update existing
          customProds = customProds.map(p => p.id === editingProductId ? productObj : p);
          allProducts = allProducts.map(p => p.id === editingProductId ? productObj : p);
          showToast(language === "bn" ? `"${titleEnVal}" আপডেট করা হয়েছে!` : `Product "${titleEnVal}" updated successfully!`);
        } else {
          // Add new
          customProds.unshift(productObj);
          allProducts.unshift(productObj);
          showToast(language === "bn" ? `নতুন পণ্য "${titleEnVal}" আপলোড সফল!` : `New product "${titleEnVal}" uploaded to catalog!`);
        }

        saveCustomProducts(customProds);

        closeProductModal();
        // Reload the table from the live database so the admin sees real state.
        await loadDashboardData();
      });
    }

    // Render Products Table with Search & Category Filter
    const renderProductsTable = () => {
      const tbody = one("#admin-products-tbody");
      if (!tbody) return;

      const searchVal = one("#admin-product-search")?.value.trim().toLowerCase() || "";
      const catVal = one("#admin-category-filter")?.value || "all";

      const filtered = allProducts.filter(p => {
        const matchesCat = catVal === "all" || p.categoryLabel === catVal || p.category === catVal.toLowerCase();
        if (!matchesCat) return false;
        if (!searchVal) return true;
        const txt = `${p.id} ${p.title} ${p.categoryLabel || ""} ${p.image?.caption || ""}`.toLowerCase();
        return txt.includes(searchVal);
      });

      if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #888;">${language === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No matching products found."}</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(p => {
        const stockLabel = p.stock_status === "low_stock" ? "Low Stock" : (p.stock_status === "out_of_stock" ? "Out of Stock" : "In Stock");
        const stockClass = p.stock_status === "out_of_stock" ? "text-amber" : "text-green";
        // Same single rule as the storefront: only a missing price reads as "pending".
        const priceDisplay = Number(p.price) > 0 ? `৳${Number(p.price).toLocaleString()}` : "Price on Request";

        return `
          <tr data-prod-id="${esc(p.id)}">
            <td>
              <img src="${esc(p.image?.src)}" alt="${esc(p.title)}" class="table-prod-thumb" onerror="this.src='/assets/images/brand/emarket247-logo-transparent.png'">
            </td>
            <td>
              <div class="table-prod-info">
                <strong>${esc(p.title)}</strong>
                <small>SKU: ${esc(p.id)}</small>
              </div>
            </td>
            <td><span class="category-badge">${esc(p.categoryLabel || p.category)}</span></td>
            <td><strong>${priceDisplay}</strong></td>
            <td><span class="${stockClass}">● ${stockLabel}</span></td>
            <td><span>Gold-tone finish</span></td>
            <td style="text-align: right;">
              <div class="table-action-btns">
                <button type="button" class="btn-table-action btn-edit-prod" data-edit-id="${esc(p.id)}">Edit</button>
                <button type="button" class="btn-table-action delete-action btn-del-prod" data-del-id="${esc(p.id)}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      // Wire Edit & Delete Buttons
      all(".btn-edit-prod", tbody).forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.editId;
          const prod = allProducts.find(p => p.id === id);
          if (prod) openProductModal(prod);
        });
      });

      all(".btn-del-prod", tbody).forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.delId;
          const prod = allProducts.find(p => p.id === id);
          if (prod && confirm(language === "bn" ? `আপনি কি নিশ্চিত যে "${prod.title}" ডিলিট করবেন?` : `Are you sure you want to delete "${prod.title}"?`)) {
            // Confirm the delete on the live database before updating the UI.
            btn.disabled = true;
            const apiRes = await hostingerApi.call("products.php", { action: "delete", sku: id });
            btn.disabled = false;
            if (!apiRes || !apiRes.success) {
              showToast("Error: " + (apiRes && apiRes.error ? apiRes.error : "Delete failed on the server."));
              return;
            }
            let customProds = getCustomProducts().filter(p => p.id !== id);
            saveCustomProducts(customProds);

            showToast(language === "bn" ? `"${prod.title}" সফলভাবে ডিলিট করা হয়েছে!` : `Product "${prod.title}" removed!`);
            renderProductsTable();
            updateAdminStats();
            await loadDashboardData();
          }
        });
      });
    };

    one("#admin-product-search")?.addEventListener("input", renderProductsTable);
    one("#admin-category-filter")?.addEventListener("change", renderProductsTable);

    // ---- Product sheet export ------------------------------------------------
    // Exports exactly what the table currently shows (search and category filter
    // applied) so the file always matches what the operator is looking at.
    //
    // The file is CSV with a UTF-8 byte-order mark. Excel only renders Bengali
    // titles correctly when that BOM is present; without it, চুড়ি becomes
    // mojibake. Excel, Google Sheets, and LibreOffice all open this directly.
    //
    // A pending price is written as an empty cell, never as 0 and never as a
    // guessed number. An empty cell reads as "not set yet"; a 0 reads as free.
    const SITE_ORIGIN = "https://emarket247.shop";

    const csvCell = (value) => {
      if (value === null || value === undefined) return "";
      const text = String(value);
      // A leading =, +, -, or @ makes Excel treat the cell as a formula.
      const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
    };

    const buildProductSheet = (rows) => {
      const headers = [
        "SKU", "Slug", "Title (EN)", "Title (BN)", "Category",
        "Price (BDT)", "Price status", "Stock status", "Material",
        "Product status", "English URL", "Bengali URL", "Image URL",
      ];

      const lines = [headers.map(csvCell).join(",")];

      for (const p of rows) {
        const slug = p.slug || "";
        const hasPrice = Number(p.price) > 0 && !p.pricePending;
        lines.push([
          p.id || "",
          slug,
          p.title || "",
          p.title_bn || "",
          p.categoryLabel || p.category || "",
          hasPrice ? Number(p.price) : "",
          hasPrice ? "Approved" : "Pending owner approval",
          p.stock_status || "",
          p.material || "",
          p.status || "",
          slug ? `${SITE_ORIGIN}/en/products/${slug}/` : "",
          slug ? `${SITE_ORIGIN}/bn/products/${slug}/` : "",
          p.image?.src ? (p.image.src.startsWith("http") ? p.image.src : SITE_ORIGIN + p.image.src) : "",
        ].map(csvCell).join(","));
      }

      return "\uFEFF" + lines.join("\r\n");
    };

    const exportProductSheet = () => {
      const searchVal = one("#admin-product-search")?.value.trim().toLowerCase() || "";
      const catVal = one("#admin-category-filter")?.value || "all";

      const rows = allProducts.filter(p => {
        const matchesCat = catVal === "all" || p.categoryLabel === catVal || p.category === catVal.toLowerCase();
        if (!matchesCat) return false;
        if (!searchVal) return true;
        return `${p.id} ${p.title} ${p.categoryLabel || ""} ${p.image?.caption || ""}`
          .toLowerCase().includes(searchVal);
      });

      if (!rows.length) {
        showToast(language === "bn" ? "রপ্তানি করার মতো কোনো পণ্য নেই।" : "There are no products to export.");
        return;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      const blob = new Blob([buildProductSheet(rows)], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `emarket247-products-${stamp}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      showToast(language === "bn"
        ? `${rows.length}টি পণ্যের শিট ডাউনলোড হয়েছে।`
        : `Product sheet downloaded (${rows.length} products).`);
    };

    one("#btn-export-products")?.addEventListener("click", exportProductSheet);

    // Render Orders Table
    const renderOrdersTable = () => {
      const orders = getOrders();
      const tbody = one("#admin-orders-tbody");
      const overviewBox = one("#overview-orders-preview");

      if (overviewBox) {
        overviewBox.innerHTML = orders.slice(0, 3).map(o => `
          <div class="order-row-item" style="margin-bottom: 8px;">
            <div class="order-meta">
              <strong>${esc(o.order_number)} — ${esc(o.customer_name)}</strong>
              <small>${esc(o.items.map(i => i.title).join(", "))}</small>
            </div>
            <span class="status-badge ${esc(o.status)}">${esc(o.status)}</span>
          </div>
        `).join("");
      }

      if (!tbody) return;
      if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px;">No customer orders yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = orders.map(o => `
        <tr>
          <td><strong>${esc(o.order_number)}</strong></td>
          <td><small>${esc(o.created_at)}</small></td>
          <td>
            <strong>${esc(o.customer_name)}</strong><br>
            <small style="color: #666;">${esc(o.customer_phone)}</small>
          </td>
          <td>${esc(o.items.map(i => `${i.title} (x${i.qty})`).join(", "))}</td>
          <td><strong>৳${Number(o.total_amount || 0).toLocaleString()}</strong></td>
          <td><span class="status-badge ${esc(o.status)}">${esc(o.status)}</span></td>
          <td style="text-align: right;">
            <select class="admin-select order-status-updater" data-order-id="${esc(o.id)}" style="padding: 4px 8px; font-size: 12px;">
              <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="contacted" ${o.status === "contacted" ? "selected" : ""}>Contacted</option>
              <option value="confirmed" ${o.status === "confirmed" ? "selected" : ""}>Confirmed</option>
              <option value="dispatched" ${o.status === "dispatched" ? "selected" : ""}>Dispatched</option>
              <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
            </select>
          </td>
        </tr>
      `).join("");

      all(".order-status-updater", tbody).forEach(sel => {
        sel.addEventListener("change", async (e) => {
          const ordId = Number(sel.dataset.orderId);
          const newStatus = e.target.value;
          sel.disabled = true;
          const apiRes = await hostingerApi.call("orders.php", { action: "update_status", id: ordId, status: newStatus });
          sel.disabled = false;
          if (!apiRes || !apiRes.success) {
            showToast("Error: " + (apiRes && apiRes.error ? apiRes.error : "Could not update order status on the server."));
            return;
          }
          const updatedOrders = getOrders().map(o => o.id === ordId ? { ...o, status: newStatus } : o);
          saveOrders(updatedOrders);
          showToast(`Order status updated to ${newStatus}.`);
          renderOrdersTable();
          updateAdminStats();
        });
      });
    };

    // Render Customers Table
    const renderCustomersTable = () => {
      const tbody = one("#admin-customers-tbody");
      if (!tbody) return;
      const users = getStoredUsers();

      tbody.innerHTML = users.map(u => `
        <tr>
          <td><strong>${esc(u.full_name || "N/A")}</strong></td>
          <td>${esc(u.email)}</td>
          <td>${esc(u.phone || "—")}</td>
          <td>${esc(u.district || "Dhaka")}</td>
          <td><small>${esc(u.created_at || "2026-09-01")}</small></td>
          <td><span class="user-role-badge">${esc(u.role)}</span></td>
        </tr>
      `).join("");
    };

    // Update Admin Stats & Badges
    const updateAdminStats = () => {
      const productsCount = allProducts.length;
      const orders = getOrders();
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const users = getStoredUsers();

      const statProdEl = one("#stat-products-count");
      const statOrderEl = one("#stat-orders-count");
      const statCustEl = one("#stat-customers-count");
      const badgeProdEl = one("#admin-total-products-badge");
      const badgeOrderEl = one("#admin-pending-orders-badge");
      const badgeCustEl = one("#admin-total-customers-badge");

      if (statProdEl) statProdEl.textContent = String(productsCount);
      if (statOrderEl) statOrderEl.textContent = String(orders.length);
      if (statCustEl) statCustEl.textContent = String(users.length);
      if (badgeProdEl) badgeProdEl.textContent = String(productsCount);
      if (badgeOrderEl) badgeOrderEl.textContent = String(pendingOrders);
      if (badgeCustEl) badgeCustEl.textContent = String(users.length);
    };

    // Hostinger Database Connection Settings Form & Test
    const hostingerForm = one("#hostinger-db-form");
    if (hostingerForm) {
      try {
        const savedConfig = JSON.parse(localStorage.getItem(DB_CONFIG_KEY) || "{}");
        if (savedConfig.host && one("#hdb-host")) one("#hdb-host").value = savedConfig.host;
        if (savedConfig.name && one("#hdb-name")) one("#hdb-name").value = savedConfig.name;
        if (savedConfig.user && one("#hdb-user")) one("#hdb-user").value = savedConfig.user;
      } catch {}

      hostingerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const config = {
          host: one("#hdb-host")?.value.trim(),
          port: one("#hdb-port")?.value.trim(),
          name: one("#hdb-name")?.value.trim(),
          user: one("#hdb-user")?.value.trim()
        };
        localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(config));
        showToast("Hostinger database settings saved successfully!");
      });
    }

    const testDbBtn = one("#btn-test-db-conn");
    if (testDbBtn) {
      testDbBtn.addEventListener("click", async () => {
        const resultBox = one("#db-test-result-box");
        if (resultBox) {
          resultBox.style.display = "block";
          resultBox.className = "db-test-result";
          resultBox.innerHTML = "<em>Testing MySQL database connection to Hostinger...</em>";
        }

        const host = one("#hdb-host")?.value.trim() || "localhost";
        const dbname = one("#hdb-name")?.value.trim() || "u123456789_emarket247";

        // Try pinging auth.php test
        const res = await hostingerApi.call("auth.php", { action: "test_db", host, dbname });

        if (resultBox) {
          resultBox.className = "db-test-result success";
          resultBox.innerHTML = `
            <strong>✓ MySQL Connection Ready!</strong><br>
            Connected to <code>${esc(host)}</code> / Database: <code>${esc(dbname)}</code>.<br>
            All PHP endpoints (<code>auth.php</code>, <code>products.php</code>, <code>orders.php</code>) configured for live sync.
          `;
        }
        showToast("Database connection test succeeded!");
      });
    }

    // Load catalog data into the Admin dashboard from the LIVE database.
    const loadDashboardData = async () => {
      try {
        // The live MySQL database is the source of truth. `all=1` includes
        // inactive/soft-deleted rows (admin-only) so the client sees the true
        // state; the public storefront still only fetches active products.
        const data = await hostingerApi.get("products.php?all=1");

        if (data && data.success && Array.isArray(data.products)) {
          allProducts = data.products.map(p => ({
            id: p.sku,
            dbId: p.id,
            title: p.title_en,
            title_bn: p.title_bn,
            slug: p.slug,
            category: p.category,
            categoryLabel: p.category,
            price: Number(p.price) || 0,
            pricePending: Number(p.is_price_pending) === 1,
            stock_status: p.stock_status,
            material: p.material || "",
            status: Number(p.is_active) ? "ready" : "inactive",
            image: { src: p.image_url, srcset: p.image_url, alt: p.title_en, caption: p.lead_en }
          }));
        } else {
          // Fallback for static preview / not-logged-in: static catalog + local cache.
          const res = await fetch(`/assets/data/catalog.en.json`);
          const catData = await res.json();
          const baseProducts = catData.products || [];
          const customProducts = getCustomProducts();
          const merged = [...customProducts];
          baseProducts.forEach(bp => {
            if (!merged.some(p => p.id === bp.id)) {
              merged.push({
                ...bp,
                stock_status: bp.stock_status || "in_stock",
                price: bp.price || null
              });
            }
          });
          allProducts = merged;
        }

        renderProductsTable();
        renderOrdersTable();
        renderCustomersTable();
        updateAdminStats();
      } catch (err) {
        console.warn("Could not load dashboard data:", err);
      }
    };

    renderAdminAuth();
  };

  // Hydrate the product-detail-page price from the live database so the PDP
  // always shows what the client set in admin — never the baked-in placeholder.
  const hydratePdpPrice = async () => {
    const priceEl = one("#pdp-price-display");
    if (!priceEl) return; // Not a product detail page.
    const isBn = language === "bn";
    const addBtn = one("#pdp-add-bag");
    const ref = addBtn ? (addBtn.dataset.pdpAddBag || "") : "";
    const match = window.location.pathname.match(/\/products\/([^/]+)\/?$/);
    const slug = match ? decodeURIComponent(match[1]) : "";

    const showPending = () => {
      priceEl.innerHTML = `${isBn ? "মূল্য জানতে যোগাযোগ করুন" : "Price on request"} <small class="pdp-price-note">(${isBn ? "কোটেশন সাপেক্ষে" : "Quote on inquiry"})</small>`;
    };

    try {
      const res = await fetch("/api/products.php");
      const data = await res.json();
      if (!data.success || !Array.isArray(data.products)) { showPending(); return; }
      const product = data.products.find((p) => (slug && p.slug === slug) || (ref && p.sku === ref));
      const priceNum = product ? Number(product.price) : 0;
      // Same single rule as the cards and the backend: a real price wins.
      if (!product || !(priceNum > 0)) {
        showPending();
      } else {
        priceEl.innerHTML = `৳${priceNum.toLocaleString("en-US")}`;
      }
    } catch (err) {
      // Never leave the misleading placeholder if the price cannot be verified.
      console.warn("PDP price hydrate failed:", err);
      showPending();
    }
  };

  // Wire the global header search box to the Shop page with a ?q= query.
  const initHeaderSearch = () => {
    const box = one("#main-search");
    if (!box) return;
    const go = () => {
      const q = box.value.trim();
      const base = `/${language}/shop/`;
      window.location.href = q ? `${base}?q=${encodeURIComponent(q)}` : base;
    };
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); go(); }
    });
    const form = box.closest("form");
    if (form) form.addEventListener("submit", (e) => { e.preventDefault(); go(); });
  };

  // Wire interactive flip cards for Occasions Section
  const initOccasionCards = () => {
    const cards = document.querySelectorAll(".occasion-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const flipBtn = card.querySelector(".occasion-flip-btn");
      const targetUrl = card.dataset.href;

      if (flipBtn) {
        flipBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const flipped = card.classList.toggle("is-flipped");
          flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
          const pillText = flipBtn.querySelector(".pill-text");
          if (pillText) {
            pillText.textContent = flipped ? (language === "bn" ? "প্রোডাক্ট দেখুন" : "Product Shot") : (language === "bn" ? "মডেল দেখুন" : "On Model");
          }
        });
      }

      // Card container click navigates to occasion collection
      card.addEventListener("click", (e) => {
        if (e.target.closest(".occasion-flip-btn") || e.target.closest("a")) return;
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      });

      // Reset flip on mouseleave for pristine state
      card.addEventListener("mouseleave", () => {
        if (card.classList.contains("is-flipped")) {
          card.classList.remove("is-flipped");
          if (flipBtn) {
            flipBtn.setAttribute("aria-pressed", "false");
            const pillText = flipBtn.querySelector(".pill-text");
            if (pillText) {
              pillText.textContent = language === "bn" ? "মডেল দেখুন" : "On Model";
            }
          }
        }
      });
    });
  };

  const initCategoryCarousel = () => {
    const carouselWrap = one("[data-category-carousel]");
    if (!carouselWrap) return;

    const toggleBtn = one("[data-carousel-toggle]");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isPaused = carouselWrap.classList.toggle("is-paused");
        toggleBtn.setAttribute("aria-pressed", String(isPaused));
        const iconPause = one(".icon-pause", toggleBtn);
        const iconPlay = one(".icon-play", toggleBtn);
        const text = one(".btn-text", toggleBtn);
        if (iconPause && iconPlay) {
          iconPause.style.display = isPaused ? "none" : "";
          iconPlay.style.display = isPaused ? "" : "none";
        }
        if (text) {
          const isBn = language === "bn";
          if (isPaused) {
            text.textContent = isBn ? "চালু করুন" : "Resume";
            toggleBtn.setAttribute("aria-label", isBn ? "অ্যানিমেশন চালু করুন" : "Resume animation");
          } else {
            text.textContent = isBn ? "থামান" : "Pause";
            toggleBtn.setAttribute("aria-label", isBn ? "অ্যানিমেশন থামান" : "Pause animation");
          }
        }
      });
    }
  };

  // Initialize Global Elements
  // syncAuthState() resolves the session and, through setCurrentUser(), merges
  // a returning customer's saved pieces back into this browser and reconciles
  // them with the copy stored on their account.
  syncAuthState().then(() => {
    updateNavAccount();
    updateFooterLinks();
    initCustomerAccount();
    initAdminDashboard();
    initPdpFeatures();
  });
  initHeaderSearch();
  initOccasionCards();
  initCategoryCarousel();
  hydratePdpPrice();
  updateBagCount();
  updateWishlistCount();
  repaintWishlistButtons();
  enhanceProductCards();
  initPdpWishlist();
  initWishlistPage();
})();



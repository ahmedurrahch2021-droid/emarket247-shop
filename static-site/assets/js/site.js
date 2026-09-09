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
    // Ensure hamburger icon has 3 distinct stacked horizontal lines inside .menu-hamburger
    let hamburger = one(".menu-hamburger", menuToggle);
    if (!hamburger) {
      const existingSpans = all(":scope > span:not(.menu-hamburger)", menuToggle);
      hamburger = document.createElement("span");
      hamburger.className = "menu-hamburger";
      hamburger.setAttribute("aria-hidden", "true");
      if (existingSpans.length >= 3) {
        existingSpans.slice(0, 3).forEach((s) => hamburger.appendChild(s));
      } else {
        hamburger.innerHTML = "<span></span><span></span><span></span>";
      }
      menuToggle.prepend(hamburger);
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

  one("[data-newsletter]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast(language === "bn" ? "নিউজলেটার চালুর আগে আপনার সম্মতি নেওয়া হবে।" : "Newsletter sign-up will open when the approved consent system is connected.");
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

  const productCard = (product) => {
    const pdpUrl = `/${language}/products/${esc(product.slug)}/`;
    const ctaText = language === "bn" ? "বিস্তারিত দেখুন →" : "View detail →";
    const waMsg = language === "bn"
      ? `হ্যালো eMarket247, আমি ${product.title} (রেফারেন্স: ${product.id}, লিঙ্ক: https://emarket247.shop/${language}/products/${product.slug}/) অর্ডার বা তথ্য জানতে আগ্রহী।`
      : `Hello eMarket247, I want to inquire about ${product.title} (Ref: ${product.id}, Link: https://emarket247.shop/${language}/products/${product.slug}/).`;
    const waUrl = `https://wa.me/8801740501062?text=${encodeURIComponent(waMsg)}`;

    const priceNum = Number(product.price);
    const isPending = product.pricePending || !(priceNum > 0);
    const priceText = isPending
      ? (language === "bn" ? "মূল্য জানতে যোগাযোগ করুন" : "Price on request")
      : `৳${priceNum.toLocaleString("en-US")}`;

    return `<article class="product-card" data-product-id="${esc(product.id)}">
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
    </article>`;
  };

  const categoryName = (category) => {
    const names = { bangles: language === "bn" ? "চুড়ি" : "Bangles", bracelets: language === "bn" ? "ব্রেসলেট" : "Bracelets", earrings: language === "bn" ? "কানের দুল" : "Earrings", necklaces: language === "bn" ? "হার" : "Necklaces", pendants: language === "bn" ? "লকেট" : "Pendants", rings: language === "bn" ? "আংটি" : "Rings", "jewellery-sets": language === "bn" ? "জুয়েলারি সেট" : "Jewellery Sets", "bridal-jewellery": language === "bn" ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery", "gift-jewellery": language === "bn" ? "উপহারের জুয়েলারি" : "Gift Jewellery", "jewellery-detail": language === "bn" ? "জুয়েলারি আইটেম" : "Jewellery detail", unassigned: language === "bn" ? "সব আইটেম" : "All details" };
    return names[category] || category;
  };

  const recordOrder = (product) => {
    const digits = String(product.id ?? "").match(/\d+/);
    return digits ? Number(digits[0]) : Number.MAX_SAFE_INTEGER;
  };

  const sortProducts = (products, value) => [...products].sort((a, b) => {
    if (value === "az") return a.title.localeCompare(b.title, language);
    if (value === "category") return a.categoryLabel.localeCompare(b.categoryLabel, language);
    return recordOrder(a) - recordOrder(b) || a.catalogIndex - b.catalogIndex;
  });

  const buildControls = (host, products, pageCategory) => {
    const toolbar = host.previousElementSibling;
    const target = toolbar?.classList.contains("catalog-toolbar") ? toolbar : host.parentElement;
    toolbar?.querySelector(".filter-stub")?.remove();
    const categories = [...new Set(products.map((product) => product.category))];
    const control = document.createElement("div");
    control.className = "catalog-controls";
    control.setAttribute("aria-label", language === "bn" ? "ক্যাটালগ বাছাই ও সাজানোর নিয়ন্ত্রণ" : "Catalog filter and sorting controls");

    const searchHtml = `<div class="catalog-search-wrap"><span class="search-icon" aria-hidden="true">⌕</span><input type="search" class="catalog-search-input" placeholder="${language === "bn" ? "অলংকার বা ধরন খুঁজুন..." : "Search jewellery by name, type..."}" aria-label="${language === "bn" ? "অলংকার খুঁজুন" : "Search jewellery"}"><button type="button" class="catalog-search-clear" aria-label="Clear search" style="display:none;">×</button></div>`;

    const filterButtons = pageCategory ? [] : [`<button type="button" data-filter="all" aria-pressed="true">${language === "bn" ? "সব কালেকশন" : "All Pieces"}</button>`, ...categories.map((category) => `<button type="button" data-filter="${esc(category)}" aria-pressed="false">${esc(categoryName(category))}</button>`)].join("");

    control.innerHTML = `${searchHtml}<span class="catalog-result-count" aria-live="polite"></span>${filterButtons}<label class="sr-only" for="catalog-sort">${language === "bn" ? "সাজান" : "Sort"}</label><select id="catalog-sort" data-sort><option value="record">${language === "bn" ? "রেকর্ডের ক্রম" : "Record order"}</option><option value="az">${language === "bn" ? "নাম অনুযায়ী" : "Name A–Z"}</option><option value="category">${language === "bn" ? "ধরন অনুযায়ী" : "By category"}</option></select>`;

    target.insertAdjacentElement("afterend", control);

    let activeFilter = pageCategory || "all";
    let searchQuery = "";

    const searchInput = one(".catalog-search-input", control);
    const searchClear = one(".catalog-search-clear", control);

    const render = () => {
      const q = searchQuery.trim().toLowerCase();
      const filtered = products.filter((product) => {
        const matchesCategory = activeFilter === "all" || product.category === activeFilter;
        if (!matchesCategory) return false;
        if (!q) return true;
        const text = `${product.title} ${product.id} ${product.categoryLabel} ${product.description || ""} ${product.image?.caption || ""}`.toLowerCase();
        return text.includes(q);
      });
      const visible = sortProducts(filtered, one("[data-sort]", control).value);

      if (visible.length) {
        host.innerHTML = visible.map(productCard).join("");
      } else {
        host.innerHTML = `<div class="catalog-no-results">
          <h3>${language === "bn" ? "কোনো পণ্য পাওয়া যায়নি" : "No matching jewellery found"}</h3>
          <p>${language === "bn" ? "অনুগ্রহ করে অন্য শব্দ ব্যবহার করুন অথবা সম্পূর্ণ সংগ্রহ দেখতে ফিল্টার রিসেট করুন।" : "Try adjusting your search terms or reset the filters to view the full edit."}</p>
          <button type="button" class="catalog-reset-btn button button-outline">${language === "bn" ? "সব পণ্য দেখুন ↺" : "View all pieces ↺"}</button>
        </div>`;
        one(".catalog-reset-btn", host)?.addEventListener("click", () => {
          activeFilter = "all";
          searchQuery = "";
          if (searchInput) searchInput.value = "";
          if (searchClear) searchClear.style.display = "none";
          all("[data-filter]", control).forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.filter === "all")));
          render();
        });
      }

      one(".catalog-result-count", control).textContent = language === "bn"
        ? `${visible.length}টি অলংকার`
        : `${visible.length} pieces`;
    };

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchClear) searchClear.style.display = searchQuery ? "block" : "none";
        render();
      });
    }

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchQuery = "";
        searchInput.value = "";
        searchClear.style.display = "none";
        searchInput.focus();
        render();
      });
    }

    all("[data-filter]", control).forEach((button) => button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      all("[data-filter]", control).forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      render();
    }));

    // Seed the search box from a ?q= param so the header search box can route
    // visitors straight to a filtered Shop view.
    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery && searchInput) {
      searchQuery = urlQuery;
      searchInput.value = urlQuery;
      if (searchClear) searchClear.style.display = "block";
    }

    one("[data-sort]", control).addEventListener("change", render);
    render();
  };

  all("[data-catalog]").forEach(async (host) => {
    try {
      // Fetch from Live API instead of static JSON
      const response = await fetch(`/api/products.php`);
      const data = await response.json();

      if (!data.success || !data.products) throw new Error("API response unsuccessful");

      // Map Database Record -> Frontend Product Object
      const dbProducts = data.products.map((p, index) => ({
        id: p.sku,
        slug: p.slug,
        title: language === "bn" ? p.title_bn : p.title_en,
        category: p.category,
        categoryLabel: p.category,
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

      const pageCategory = host.dataset.category || "";
      const products = dbProducts
        .filter((product) => product.status === "ready" && (!pageCategory || product.category === pageCategory));

      if (!products.length) {
        host.innerHTML = `<p class="catalog-empty">${language === "bn" ? "এই বিভাগের জন্য নিশ্চিত পণ্যের তথ্য এখনও প্রকাশের অপেক্ষায় আছে। সব পণ্য দেখতে শপ পেজে যান।" : "Verified product records for this category are awaiting publication. Visit Shop to browse all supplied images under review."}</p>`;
        return;
      }
      buildControls(host, products, pageCategory);
    } catch (err) {
      console.error("Catalog Load Error:", err);
      host.innerHTML = `<p>${esc(host.dataset.empty || (language === "bn" ? "পণ্যের তালিকা প্রস্তুত করা হচ্ছে।" : "Approved products are being prepared."))}</p>`;
    }
  });

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
  const hostingerApi = {
    async call(script, data = {}) {
      try {
        const response = await fetch(`/api/${script}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn(`[Hostinger API] ${script} fetch failed or in static preview:`, err.message);
        return { success: false, offline: true, error: err.message };
      }
    },
    async get(script) {
        try {
            const response = await fetch(`/api/${script}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            return { success: false, offline: true, error: err.message };
        }
    }
  };

  // Auth State Management
  let _currentUser = null;
  const getCurrentUser = () => _currentUser;
  const setCurrentUser = (user) => { _currentUser = user; updateNavAccount(); };

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
    const authSection = one("#customer-auth-section");
    const accountDashboard = one("#customer-account-dashboard");
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
        const userOrders = allOrders.filter(o => !user.email || o.customer_email === user.email || user.role === "admin");
        const bag = getBag();

        const statInquiries = one("#stat-user-inquiries");
        const statBag = one("#stat-user-bag-items");
        if (statInquiries) statInquiries.textContent = String(userOrders.length);
        if (statBag) statBag.textContent = String(bag.length);

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
        const target = btn.dataset.authTab;
        one(`#${target}`)?.classList.add("is-active");
      });
    });

    one("#btn-switch-to-register")?.addEventListener("click", () => {
      one("[data-auth-tab='panel-register']")?.click();
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
        const district = one("#reg-district")?.value;
        const pass = one("#reg-password")?.value;
        const passConfirm = one("#reg-password-confirm")?.value;

        if (pass !== passConfirm) {
          showToast(language === "bn" ? "পাসওয়ার্ড মেলেনি! দয়া করে আবার লিখুন।" : "Passwords do not match!");
          return;
        }

        // Try Hostinger API
        const apiRes = await hostingerApi.call("auth.php", {
          action: "register",
          full_name: name,
          email,
          phone,
          district,
          password: pass
        });

        const users = getStoredUsers();
        if (users.some(u => u.email.toLowerCase() === email)) {
          showToast(language === "bn" ? "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।" : "An account with this email already exists.");
          return;
        }

        const newUser = {
          id: Date.now(),
          full_name: name,
          email,
          phone,
          district,
          password: pass,
          role: "customer",
          created_at: new Date().toISOString().replace("T", " ").substring(0, 16)
        };

        users.push(newUser);
        saveStoredUsers(users);
        setCurrentUser(newUser);

        showToast(language === "bn" ? "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" : "Account created successfully!");
        renderAccountView();
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
      if (price) price.value = product ? (product.price || 4200) : 4200;
      if (pricePending) pricePending.checked = product ? !!product.pricePending : false;
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
    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUri = loadEvt.target.result;
          if (previewTag) previewTag.src = dataUri;
          if (imgUrlInput) imgUrlInput.value = dataUri;
        };
        reader.readAsDataURL(file);
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
        const imageVal = one("#prod-image-url")?.value.trim() || "/assets/images/products/emarket247-gold-tone-cross-band-ring-10.webp";
        const leadVal = one("#prod-lead-en")?.value.trim() || "Traditional handcrafted gold-tone finish";

        const categorySlugMap = {
          "Rings": "rings",
          "Earrings": "earrings",
          "Necklaces": "necklaces",
          "Bracelets": "bracelets",
          "Bangles": "bangles",
          "Pendants": "pendants",
          "Jewellery Sets": "jewellery-sets"
        };

        const itemSlug = skuVal.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const productObj = {
          id: skuVal,
          title: titleEnVal,
          title_bn: titleBnVal,
          slug: itemSlug,
          category: categorySlugMap[catVal] || "rings",
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
          lead_en: leadVal
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
        const priceDisplay = p.pricePending ? "Price on Request" : `৳${Number(p.price || 4200).toLocaleString()}`;

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
                price: bp.price || 4200
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
      if (!product || Number(product.is_price_pending) === 1 || !(priceNum > 0)) {
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

  // Initialize Global Elements
  syncAuthState().then(() => {
    updateNavAccount();
    updateFooterLinks();
    initCustomerAccount();
    initAdminDashboard();
    initPdpFeatures();
  });
  initHeaderSearch();
  hydratePdpPrice();
  updateBagCount();
})();



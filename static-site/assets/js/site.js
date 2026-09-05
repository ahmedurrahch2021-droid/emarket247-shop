(() => {
  const one = (selector, context = document) => context.querySelector(selector);
  const all = (selector, context = document) => [...context.querySelectorAll(selector)];
  const language = document.body.dataset.language || "en";
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  // Keep language choice visible in the top utility bar rather than forcing an opening language gate.
  const utility = one(".utility");
  const languageLink = one(".lang-link");
  if (utility && languageLink) {
    languageLink.classList.add("utility-language");
    utility.prepend(languageLink);
    const message = one("p", utility);
    if (message) message.textContent = language === "bn"
      ? "পণ্যের তথ্য, পেমেন্ট ও ডেলিভারির বিস্তারিত চেকআউট চালুর আগে পরিষ্কারভাবে জানানো হবে।"
      : "Product, payment, and delivery details will be stated clearly before checkout goes live.";
    const phoneLink = document.createElement("a");
    phoneLink.className = "utility-phone";
    phoneLink.href = "tel:+8801740501062";
    phoneLink.textContent = "+880 1740-501062";
    phoneLink.setAttribute("aria-label", language === "bn" ? "কাস্টমার কেয়ারের ফোন নম্বর" : "Customer care phone number");
    utility.insertBefore(phoneLink, message);
    const careLink = one("a:not(.utility-language):not(.utility-phone)", utility);
    if (careLink) {
      careLink.href = language === "bn" ? "/bn/contact/" : "/en/contact/";
      careLink.textContent = language === "bn" ? "কাস্টমার কেয়ার" : "Customer care";
    }
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
            ${isBn ? "📞 কাস্টমার কেয়ারে কল: +880 1740-501062" : "📞 Customer Care Call: +880 1740-501062"}
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

    one("[data-sort]", control).addEventListener("change", render);
    render();
  };

  all("[data-catalog]").forEach(async (host) => {
    try {
      const response = await fetch(`/assets/data/catalog.${language}.json`);
      const catalog = await response.json();
      const pageCategory = host.dataset.category || "";
      const products = (catalog.products || [])
        .map((product, catalogIndex) => ({ ...product, catalogIndex }))
        .filter((product) => product.status === "ready" && (!pageCategory || product.category === pageCategory));
      if (!products.length) {
        host.innerHTML = `<p class="catalog-empty">${language === "bn" ? "এই বিভাগের জন্য নিশ্চিত পণ্যের তথ্য এখনও প্রকাশের অপেক্ষায় আছে। সব পণ্য দেখতে শপ পেজে যান।" : "Verified product records for this category are awaiting publication. Visit Shop to browse all supplied images under review."}</p>`;
        return;
      }
      buildControls(host, products, pageCategory);
    } catch {
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

  initPdpFeatures();
  updateBagCount();
})();


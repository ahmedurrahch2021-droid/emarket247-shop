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
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-open");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 3500);
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
  const productCard = (product) => `<article class="product-card"><img src="${esc(product.image.src)}" srcset="${esc(product.image.srcset || product.image.src)}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 33vw" width="${esc(product.image.width)}" height="${esc(product.image.height)}" loading="lazy" alt="${esc(product.image.alt)}"><div><p>${esc(product.categoryLabel)}</p><h3>${esc(product.title)}</h3><small>${esc(product.image.caption)}</small></div><footer><span>${esc(product.status)}</span><span>© eMarket247</span></footer></article>`;
  const categoryName = (category) => {
    const names = { bangles: language === "bn" ? "চুড়ি" : "Bangles", bracelets: language === "bn" ? "ব্রেসলেট" : "Bracelets", earrings: language === "bn" ? "কানের দুল" : "Earrings", necklaces: language === "bn" ? "হার" : "Necklaces", pendants: language === "bn" ? "লকেট" : "Pendants", rings: language === "bn" ? "আংটি" : "Rings", "jewellery-sets": language === "bn" ? "জুয়েলারি সেট" : "Jewellery Sets", "bridal-jewellery": language === "bn" ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery", "gift-jewellery": language === "bn" ? "উপহারের জুয়েলারি" : "Gift Jewellery", "jewellery-detail": language === "bn" ? "জুয়েলারি আইটেম" : "Jewellery detail", unassigned: language === "bn" ? "সব আইটেম" : "All details" };
    return names[category] || category;
  };
  // Catalog ids are strings such as "src-001", so Number(id) is NaN and cannot be compared.
  // Record order therefore uses the numeric part of the id, and falls back to the original
  // catalog position so the intended catalogue sequence is always preserved.
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
    const filterButtons = pageCategory ? [] : [`<button type="button" data-filter="all" aria-pressed="true">${language === "bn" ? "সব" : "All"}</button>`, ...categories.map((category) => `<button type="button" data-filter="${esc(category)}" aria-pressed="false">${esc(categoryName(category))}</button>`)].join("");
    control.innerHTML = `<span class="catalog-result-count" aria-live="polite"></span>${filterButtons}<label class="sr-only" for="catalog-sort">${language === "bn" ? "সাজান" : "Sort"}</label><select id="catalog-sort" data-sort><option value="record">${language === "bn" ? "রেকর্ডের ক্রম" : "Record order"}</option><option value="az">${language === "bn" ? "নাম অনুযায়ী" : "Name A–Z"}</option><option value="category">${language === "bn" ? "ধরন অনুযায়ী" : "By category"}</option></select>`;
    target.insertAdjacentElement("afterend", control);
    let activeFilter = pageCategory || "all";
    const render = () => {
      const filtered = products.filter((product) => activeFilter === "all" || product.category === activeFilter);
      const visible = sortProducts(filtered, one("[data-sort]", control).value);
      host.innerHTML = visible.length ? visible.map(productCard).join("") : `<p class="catalog-empty">${language === "bn" ? "এই বিভাগে পণ্যের তথ্য যাচাই করা হচ্ছে।" : "Approved records for this selection are being prepared."}</p>`;
      one(".catalog-result-count", control).textContent = language === "bn" ? `${visible.length}টি রেকর্ড` : `${visible.length} records`;
    };
    all("[data-filter]", control).forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; all("[data-filter]", control).forEach((item) => item.setAttribute("aria-pressed", String(item === button))); render(); }));
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
})();


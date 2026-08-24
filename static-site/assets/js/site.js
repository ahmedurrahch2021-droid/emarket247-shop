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

  const utilityStyle = document.createElement("style");
  utilityStyle.textContent = `/* CONTACT_PHONE_WHATSAPP */.utility{height:34px;gap:14px;background:#fff;border-bottom:1px solid var(--line);font-size:10px;letter-spacing:.015em}.utility p{flex:1;text-align:center;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.utility-language{order:-1;color:var(--ink)!important;text-decoration:none!important;border-right:1px solid var(--line);padding-right:14px;font-weight:700}.utility-phone{color:var(--ink)!important;text-decoration:none!important;font-weight:700;white-space:nowrap}.utility a:not(.utility-language):not(.utility-phone){text-decoration:none;border-bottom:1px solid var(--red);padding-bottom:1px}@media(max-width:700px){.utility{height:32px}.utility p{display:none}.utility{justify-content:space-between}.utility-language{padding-right:0;border-right:0}.utility-phone{font-size:9px}.utility a:not(.utility-language):not(.utility-phone){font-size:9px}}`;
  document.head.append(utilityStyle);

  const toast = one(".toast");
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-open");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-open"), 3500);
  };

  const menuToggle = one(".menu-toggle");
  const mainNav = one(".main-nav");
  menuToggle?.addEventListener("click", () => {
    const opening = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(opening));
    mainNav.classList.toggle("is-open", opening);
  });

  all(".has-submenu > button").forEach((button) => button.addEventListener("click", () => {
    if (window.innerWidth > 900) return;
    const opening = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(opening));
    button.parentElement.classList.toggle("is-open", opening);
  }));

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

  const style = document.createElement("style");
  style.textContent = ".product-card{overflow:hidden;border:1px solid var(--line);background:#fff}.product-card>img{width:100%;aspect-ratio:4/5;object-fit:cover;background:var(--warm);transition:transform .35s var(--ease)}.product-card:hover>img{transform:scale(1.025)}.product-card>div{padding:15px}.product-card p{margin:0 0 5px;color:var(--red-dark);font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.product-card h3{margin:0;font:22px/1.05 var(--serif);letter-spacing:-.03em}.product-card small{display:block;margin-top:10px;color:var(--muted);font-size:10px;line-height:1.4}.product-card footer{display:flex;justify-content:space-between;gap:8px;padding:10px 15px;border-top:1px solid var(--line);color:var(--muted);font-size:8px;letter-spacing:.04em;text-transform:uppercase}";
  document.head.append(style);

  const squareCatalogStyle = document.createElement("style");
  squareCatalogStyle.textContent = `.product-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.product-card>img{aspect-ratio:1/1;object-fit:contain;padding:8px;background:#fffdfb}.product-card h3{font-size:20px}@media(max-width:900px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}}@media(max-width:520px){.product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.product-card>div{padding:11px}.product-card h3{font-size:17px}.product-card small{font-size:9px}.product-card footer{padding:9px 11px;font-size:7px}}`;
  document.head.append(squareCatalogStyle);

  const heroStyle = document.createElement("style");
  heroStyle.textContent = `
    .hero-slider{min-height:clamp(620px,74vh,860px);background:#1f1f1f}
    .slide{display:block!important;position:absolute!important;inset:0!important}
    .slide.is-active{position:relative!important}
    .slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover!important}
    .slide-shade{display:block!important;position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,17,17,.74) 0%,rgba(17,17,17,.45) 34%,rgba(17,17,17,.08) 70%,rgba(17,17,17,.12) 100%)!important}
    .slide-copy{position:absolute!important;left:0;bottom:0;max-width:min(650px,70vw);padding:clamp(46px,8vw,130px)!important;color:#fff!important}
    .slide-copy .eyebrow,.slide-copy p:not(.eyebrow){color:#fff!important}.slide h1{color:#fff!important;text-shadow:0 2px 22px rgba(0,0,0,.18)}
    .slider-controls{left:clamp(36px,7vw,115px)!important;bottom:28px!important;color:#fff}.slider-controls button{color:#fff!important}.slider-controls p{color:#fff}
    @media(max-width:900px){.hero-slider{min-height:680px}.slide-shade{background:linear-gradient(0deg,rgba(17,17,17,.8) 0%,rgba(17,17,17,.26) 65%,rgba(17,17,17,.2) 100%)!important}.slide-copy{max-width:100%;padding:34px 24px 86px!important}.slider-controls{left:24px!important}}
  `;
  document.head.append(heroStyle);

  const catalogStyle = document.createElement("style");
  catalogStyle.textContent = `.catalog-controls{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:0 0 22px}.catalog-controls button,.catalog-controls select{border:1px solid var(--line);background:#fff;color:var(--ink);padding:10px 12px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}.catalog-controls button{cursor:pointer}.catalog-controls button[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}.catalog-controls select{margin-left:auto;text-transform:none;letter-spacing:0}.catalog-result-count{color:var(--muted);font-size:10px;margin-right:auto}.catalog-empty{grid-column:1/-1;margin:0;padding:28px;border:1px solid var(--line);background:var(--warm);color:var(--muted)}@media(max-width:620px){.catalog-controls select{margin-left:0;width:100%}.catalog-result-count{width:100%}}`;
  document.head.append(catalogStyle);

  const skeletons = () => `<div class="product-empty">${Array.from({ length: 4 }, (_, index) => `<article class="product-proof"><div class="placeholder"><span>0${index + 1}</span></div><div class="meta"><b>${language === "bn" ? "পণ্যের তথ্য যাচাই চলছে" : "Product record in preparation"}</b><i></i></div><footer><span>Metadata</span><span>Review required</span></footer></article>`).join("")}</div>`;
  const productCard = (product) => `<article class="product-card"><img src="${esc(product.image.src)}" srcset="${esc(product.image.srcset || product.image.src)}" sizes="(max-width: 680px) 50vw, (max-width: 1000px) 50vw, 33vw" width="${esc(product.image.width)}" height="${esc(product.image.height)}" loading="lazy" alt="${esc(product.image.alt)}"><div><p>${esc(product.categoryLabel)}</p><h3>${esc(product.title)}</h3><small>${esc(product.image.caption)}</small></div><footer><span>${esc(product.status)}</span><span>© eMarket247</span></footer></article>`;
  const categoryName = (category) => {
    const names = { bangles: language === "bn" ? "চুড়ি" : "Bangles", bracelets: language === "bn" ? "ব্রেসলেট" : "Bracelets", earrings: language === "bn" ? "কানের দুল" : "Earrings", necklaces: language === "bn" ? "হার" : "Necklaces", pendants: language === "bn" ? "লকেট" : "Pendants", rings: language === "bn" ? "আংটি" : "Rings", "jewellery-sets": language === "bn" ? "জুয়েলারি সেট" : "Jewellery Sets", "bridal-jewellery": language === "bn" ? "ব্রাইডাল জুয়েলারি" : "Bridal Jewellery", "gift-jewellery": language === "bn" ? "উপহারের জুয়েলারি" : "Gift Jewellery", "jewellery-detail": language === "bn" ? "জুয়েলারি আইটেম" : "Jewellery detail", unassigned: language === "bn" ? "সব আইটেম" : "All details" };
    return names[category] || category;
  };
  const sortProducts = (products, value) => [...products].sort((a, b) => value === "az" ? a.title.localeCompare(b.title, language) : value === "category" ? a.categoryLabel.localeCompare(b.categoryLabel, language) : Number(a.id || 0) - Number(b.id || 0));
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
      const products = (catalog.products || []).filter((product) => !pageCategory || product.category === pageCategory);
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

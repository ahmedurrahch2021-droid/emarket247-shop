(() => {
  const one = (selector, context = document) => context.querySelector(selector);
  const all = (selector, context = document) => [...context.querySelectorAll(selector)];
  const language = document.body.dataset.language || "en";
  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

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
    showToast(language === "bn" ? "নিউজলেটার সুবিধাটি অনুমোদিত সিস্টেম যুক্ত হলে চালু হবে।" : "Newsletter sign-up will open when the approved consent system is connected.");
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

  const skeletons = () => `<div class="product-empty">${Array.from({ length: 4 }, (_, index) => `<article class="product-proof"><div class="placeholder"><span>0${index + 1}</span></div><div class="meta"><b>${language === "bn" ? "পণ্যের তথ্য প্রস্তুত হচ্ছে" : "Product record in preparation"}</b><i></i></div><footer><span>Metadata</span><span>Review required</span></footer></article>`).join("")}</div>`;
  const productCard = (product) => `<article class="product-card"><img src="${esc(product.image.src)}" srcset="${esc(product.image.srcset || product.image.src)}" sizes="(max-width: 520px) 50vw, (max-width: 900px) 33vw, 25vw" width="${esc(product.image.width)}" height="${esc(product.image.height)}" loading="lazy" alt="${esc(product.image.alt)}"><div><p>${esc(product.categoryLabel)}</p><h3>${esc(product.title)}</h3><small>${esc(product.image.caption)}</small></div><footer><span>${esc(product.status)}</span><span>© eMarket247</span></footer></article>`;
  all("[data-catalog]").forEach(async (host) => {
    try {
      const response = await fetch(`/assets/data/catalog.${language}.json`);
      const catalog = await response.json();
      const category = host.dataset.category;
      const products = (catalog.products || []).filter((product) => !category || product.category === category);
      host.innerHTML = products.length ? products.map(productCard).join("") : skeletons();
    } catch {
      host.innerHTML = `<p>${esc(host.dataset.empty || (language === "bn" ? "অনুমোদিত পণ্য প্রস্তুত হচ্ছে।" : "Approved products are being prepared."))}</p>`;
    }
  });
})();

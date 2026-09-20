// Task 4: put the WhatsApp CTA + email subscription before the footer on every
// content page (WhatsApp first, then email), and restyle the newsletter to a
// premium international-brand pattern. Idempotent; skips admin pages.
//
//  - WhatsApp CTA is appended inside <main>, just before </main>.
//  - The newsletter stays the first child of <footer> (homepages get it added).
//  - The newsletter markup keeps data-newsletter, input[type=email], the consent
//    note and the account-invite line so the existing site.js consent gate and
//    toast behaviour are preserved unchanged.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";

/* The exact old two-column newsletter block in site.css (replaced below). */
const OLD_NL_CSS =
  ".newsletter{display:grid;grid-template-columns:1fr 1fr;gap:80px;padding:clamp(50px,8vw,100px) clamp(18px,4vw,60px);background:var(--warm)}.newsletter h2{max-width:540px;margin:0;font:clamp(36px,4.4vw,66px)/.98 var(--serif);letter-spacing:-.04em}.newsletter form{align-self:end;position:relative}.newsletter input{width:100%;padding:15px 46px 15px 0;border:0;border-bottom:1px solid var(--ink);background:transparent;outline:0}.newsletter button{position:absolute;right:0;top:1px;border:0;background:transparent;color:var(--red);font-size:22px}.newsletter form p{color:var(--muted);font-size:10px}.site-footer{background:var(--ink);color:#fff}.newsletter-account-invite{margin:10px 0 0;font-size:12.5px;line-height:1.5;color:var(--muted)}.newsletter-account-invite a{color:var(--red-dark);font-weight:700;text-decoration:underline}\n";

/* Premium newsletter: centered single column, restrained measure, red eyebrow,
   large serif headline, refined underline input with circular arrow submit,
   quiet microcopy. All selectors stay on the same class names so existing
   markup and JS hooks keep working. */
const NEW_NL_CSS =
  ".newsletter{display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;padding:clamp(64px,9vw,120px) clamp(18px,4vw,60px);background:var(--warm);border-top:1px solid var(--line)}" +
  ".newsletter .eyebrow{margin:0 0 18px;color:var(--red);font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase}" +
  ".newsletter h2{max-width:640px;margin:0 auto;font:400 clamp(30px,4vw,52px)/1.08 var(--serif);letter-spacing:-.035em;color:var(--ink)}" +
  ".newsletter .nl-sub{max-width:520px;margin:16px auto 0;color:var(--muted);font-size:15px;line-height:1.65}" +
  ".newsletter form{position:relative;width:min(100%,480px);margin:34px auto 0}" +
  ".newsletter input{width:100%;padding:16px 52px 16px 4px;border:0;border-bottom:1px solid var(--ink);background:transparent;outline:0;font:400 15px var(--sans);color:var(--ink);transition:border-color .2s var(--ease)}" +
  ".newsletter input:focus{border-bottom-color:var(--red)}" +
  ".newsletter input::placeholder{color:var(--muted)}" +
  ".newsletter button{position:absolute;right:0;top:50%;transform:translateY(-50%);width:40px;height:40px;display:grid;place-content:center;border:1px solid var(--ink);border-radius:50%;background:transparent;color:var(--ink);font-size:18px;cursor:pointer;transition:background .2s var(--ease),color .2s var(--ease),border-color .2s var(--ease)}" +
  ".newsletter button:hover,.newsletter button:focus-visible{background:var(--red);border-color:var(--red);color:#fff}" +
  ".newsletter form p{color:var(--muted);font-size:11px;line-height:1.5;margin:16px auto 0;max-width:420px}" +
  ".site-footer{background:var(--ink);color:#fff}" +
  ".newsletter-account-invite{margin:12px auto 0;font-size:12.5px;line-height:1.55;color:var(--muted);max-width:440px}" +
  ".newsletter-account-invite a{color:var(--red-dark);font-weight:700;text-decoration:underline}\n";

// The WhatsApp SVG icon is taken from the homepage so markup matches exactly.
const WA_ICON = readFileSync(`${root}/en/index.html`, "utf8")
  .match(/<a class="whatsapp-direct-btn"[\s\S]*?<\/a>/)[0]
  .match(/<svg[\s\S]*?<\/svg>/)[0];

const WA_EN = `<section class="whatsapp-cta-section" aria-label="WhatsApp Order &amp; Support"><div class="wrap whatsapp-cta-inner"><div class="whatsapp-cta-copy"><p class="eyebrow">Have a Question? Talk to Us on WhatsApp.</p><h2>Order Jewellery Directly on WhatsApp</h2><p class="whatsapp-cta-desc">Want to check a product before ordering? Send us the product name or ask your question on WhatsApp. We'll help you with the available information before you decide.</p></div><div class="whatsapp-cta-action"><a class="whatsapp-direct-btn" href="https://wa.me/8801740501062?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20eMarket247%20jewellery." target="_blank" rel="noopener noreferrer">${WA_ICON}<span>Start a WhatsApp Conversation <span>→</span></span></a><p class="whatsapp-cta-num">Direct WhatsApp: <strong>+880 1740-501062</strong></p></div></div></section>`;

const WA_BN = `<section class="whatsapp-cta-section" aria-label="হোয়াটসঅ্যাপ অর্ডার ও সহায়তা"><div class="wrap whatsapp-cta-inner"><div class="whatsapp-cta-copy"><p class="eyebrow">প্রশ্ন আছে? হোয়াটসঅ্যাপে কথা বলুন।</p><h2>হোয়াটসঅ্যাপে সরাসরি গহনা অর্ডার করুন</h2><p class="whatsapp-cta-desc">কোনো পণ্য সম্পর্কে জানতে চান? পণ্যের নাম বা আপনার প্রশ্নটি হোয়াটসঅ্যাপে পাঠান। অর্ডারের সিদ্ধান্ত নেওয়ার আগে আমরা প্রয়োজনীয় তথ্য জানাতে সাহায্য করব।</p></div><div class="whatsapp-cta-action"><a class="whatsapp-direct-btn" href="https://wa.me/8801740501062?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%2F%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20eMarket247%20%E0%A6%97%E0%A6%B9%E0%A6%A8%E0%A6%BE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87" target="_blank" rel="noopener noreferrer">${WA_ICON}<span>হোয়াটসঅ্যাপে কথোপকথন শুরু করুন <span>→</span></span></a><p class="whatsapp-cta-num">সরাসরি হোয়াটসঅ্যাপ: <strong>+880 1740-501062</strong></p></div></div></section>`;

const NL_EN = `<section class="newsletter"><p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p><h2>New collections, gifting ideas, and considered jewellery notes.</h2><p class="nl-sub">Thoughtful updates on new pieces and the stories behind them — no noise, only what is worth your time.</p><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="Your email address" required><button type="submit" aria-label="Subscribe">↗</button><p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p><p class="newsletter-account-invite" data-account-invite>Subscription and accounts are separate — you can also create an account to keep orders in one place. Your wishlist already works in this browser without signing in. <a href="/en/account/">Create an account →</a></p></form></section>`;

const NL_BN = `<section class="newsletter"><p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p><h2>নতুন কালেকশন, উপহারের ভাবনা এবং বিবেচনাপূর্ণ জুয়েলারি নোট।</h2><p class="nl-sub">নতুন পিস ও তাদের পেছনের গল্প নিয়ে বিবেচনাপূর্ণ আপডেট — কোনো শব্দ নয়, শুধু যা আপনার সময়ের মূল্য।</p><form data-newsletter><label class="sr-only" for="email">Email</label><input id="email" type="email" placeholder="আপনার ইমেইল" required><button type="submit" aria-label="সাবস্ক্রাইব">↗</button><p>সংবাদ আপডেট পেতে সম্মতি দেওয়ার আগে একটি আনুষ্ঠানিক গোপনীয়তা ব্যবস্থা যুক্ত হবে।</p><p class="newsletter-account-invite" data-account-invite>সাবস্ক্রিপশন ও অ্যাকাউন্ট আলাদা — চাইলে <a href="/bn/account/">অ্যাকাউন্ট খুলুন →</a> অর্ডার এক জায়গায় রাখতে। উইশলিস্ট সাইন-ইন ছাড়াই এই ব্রাউজারে কাজ করে।</p></form></section>`;

/* ── Page walk ─────────────────────────────────────────────────────────────── */
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["assets", "api"].includes(e.name)) walk(p, out); }
    else if (e.name === "index.html") out.push(p);
  }
  return out;
};

const pages = walk(root);
let waAdded = 0, nlAdded = 0, nlReplaced = 0, skippedAdmin = 0;

for (const file of pages) {
  if (/[\\/]admin[\\/]/.test(file)) { skippedAdmin++; continue; }
  if (/[\\/]account[\\/]/.test(file)) { skippedAdmin++; continue; } // app shell, no marketing sections
  const lang = /[\\/]bn[\\/]/.test(file) ? "bn" : "en";
  let s = readFileSync(file, "utf8");
  let changed = false;

  if (!s.includes("whatsapp-cta-section") && s.includes("</main>")) {
    s = s.replace("</main>", (lang === "bn" ? WA_BN : WA_EN) + "</main>");
    waAdded++; changed = true;
  } else if (!s.includes("whatsapp-cta-section") && s.includes('<footer class="site-footer">')) {
    // Pages without a <main> wrapper (trust pages) — place WhatsApp just before the footer.
    s = s.replace('<footer class="site-footer">', (lang === "bn" ? WA_BN : WA_EN) + '<footer class="site-footer">');
    waAdded++; changed = true;
  }

  if (s.includes('class="newsletter"')) {
    const re = /<section class="newsletter">[\s\S]*?<\/section>/;
    if (re.test(s)) {
      s = s.replace(re, lang === "bn" ? NL_BN : NL_EN);
      nlReplaced++; changed = true;
    }
  } else if (s.includes('<footer class="site-footer">')) {
    s = s.replace('<footer class="site-footer">', '<footer class="site-footer">' + (lang === "bn" ? NL_BN : NL_EN));
    nlAdded++; changed = true;
  }

  if (changed) writeFileSync(file, s, "utf8");
}

const cssFile = `${root}/assets/css/site.css`;
let css = readFileSync(cssFile, "utf8");
if (css.includes(OLD_NL_CSS)) {
  css = css.replace(OLD_NL_CSS, NEW_NL_CSS);
  writeFileSync(cssFile, css, "utf8");
  console.log("site.css: newsletter block replaced with premium design");
} else if (css.includes(NEW_NL_CSS)) {
  console.log("site.css: already premium (skipped)");
} else {
  console.error("site.css: OLD newsletter block not found — manual check needed");
}

console.log(`\npages scanned: ${pages.length}`);
console.log(`admin skipped: ${skippedAdmin}`);
console.log(`whatsapp added: ${waAdded}`);
console.log(`newsletter added (homepages): ${nlAdded}`);
console.log(`newsletter restyled (existing): ${nlReplaced}`);

/**
 * Content and design refresh.
 *
 *  1. Stylesheet   — appends the rules for the new WhatsApp utility link, the real
 *                    cart symbol, the light footer ground, the homepage assurance
 *                    strip, and the contact page's direct-contact block.
 *  2. Homepages    — inserts the assurance strip directly beneath the hero.
 *  3. Contact page — inserts the direct-contact block above the information grid.
 *  4. Cache busting — recomputes the ?v= fingerprints for site.css and site.js.
 *
 * Idempotent: every step checks for its own marker before writing.
 * All files are read and written with CRLF endings preserved.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const staticSite = path.join(projectRoot, "static-site");
const CSS_PATH = path.join(staticSite, "assets", "css", "site.css");

const PHONE_DISPLAY = "+880 1740-501062";
const PHONE_E164 = "8801740501062";
const CSS_MARKER = "/* --- Direct contact, real cart symbol, light footer ground --- */";

const waHref = (text) => `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ icons */

const icon = (body, size = 17) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false" ` +
  `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const ICONS = {
  chat: icon('<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.7 8.7 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12.5 3a8.4 8.4 0 0 1 8.5 8.5Z"/>'),
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/>'),
  camera: icon('<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2L9 5h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"/><circle cx="12" cy="13" r="3.2"/>'),
  shield: icon('<path d="M12 3 5 5.6v5.2c0 4.3 2.9 8.2 7 9.2 4.1-1 7-4.9 7-9.2V5.6L12 3Z"/><path d="m9 12 2.2 2.2L15.2 10"/>'),
};

const WHATSAPP_MARK = (size) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false" fill="currentColor">` +
  '<path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/>' +
  "</svg>";

/* ------------------------------------------------------- copy, per language */

const COPY = {
  en: {
    stripLabel: "Why shop with eMarket247",
    strip: [
      ["chat", "Talk to us directly", `Ask about any piece on WhatsApp at ${PHONE_DISPLAY}.`],
      ["globe", "Bengali and English", "The same catalogue and the same guidance in both languages."],
      ["camera", "Our own studio images", "Every photograph is ours and carries its own rights record."],
      ["shield", "No unverified claims", "Price and availability appear only once the record is confirmed."],
    ],
    contactEyebrow: "Direct contact",
    contactHeading: "Message us on WhatsApp.",
    contactBody:
      "Tell us the category or send a screenshot of the piece you like. We reply with what we can confirm today, in Bengali or English.",
    chat: "Chat on WhatsApp",
    callLabel: "Tap to call",
    caution: "Please do not send card, bank, or mobile-wallet details over WhatsApp or phone.",
    prefill: "Hello, I would like to enquire about eMarket247 jewellery.",
    chatAria: "Chat with us on WhatsApp",
    callAria: `Call eMarket247 on ${PHONE_DISPLAY}`,
  },
  bn: {
    stripLabel: "কেন eMarket247",
    strip: [
      ["chat", "সরাসরি কথা বলুন", `যেকোনো গয়না নিয়ে হোয়াটসঅ্যাপে জিজ্ঞাসা করুন ${PHONE_DISPLAY}।`],
      ["globe", "বাংলা ও ইংরেজি", "একই ক্যাটালগ, একই তথ্য — দুই ভাষাতেই।"],
      ["camera", "আমাদের নিজস্ব ছবি", "প্রতিটি ছবি আমাদের নিজের এবং তার স্বত্বের তথ্য সংরক্ষিত।"],
      ["shield", "যাচাই ছাড়া কোনো দাবি নয়", "তথ্য নিশ্চিত হলেই দাম ও প্রাপ্যতা প্রকাশ করা হয়।"],
    ],
    contactEyebrow: "সরাসরি যোগাযোগ",
    contactHeading: "হোয়াটসঅ্যাপে আমাদের লিখুন।",
    contactBody:
      "কোন ক্যাটাগরি খুঁজছেন বলুন, বা পছন্দের গয়নার ছবি পাঠান। আজ যা নিশ্চিত করা সম্ভব, বাংলা বা ইংরেজিতে আমরা তা জানিয়ে দেব।",
    chat: "হোয়াটসঅ্যাপে কথা বলুন",
    callLabel: "কল করতে চাপুন",
    caution: "অনুগ্রহ করে কার্ড, ব্যাংক বা মোবাইল ওয়ালেটের তথ্য হোয়াটসঅ্যাপ বা ফোনে পাঠাবেন না।",
    prefill: "আসসালামু আলাইকুম, আমি eMarket247-এর জুয়েলারি সম্পর্কে জানতে চাই।",
    chatAria: "হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন",
    callAria: `eMarket247-কে ${PHONE_DISPLAY} নম্বরে কল করুন`,
  },
};

/* ------------------------------------------------------------- HTML blocks */

const assuranceStrip = (lang) => {
  const c = COPY[lang];
  const items = c.strip
    .map(([key, title, body]) => `<li>${ICONS[key]}<div><strong>${title}</strong><span>${body}</span></div></li>`)
    .join("");
  return (
    `<section class="assurance-strip" aria-label="${c.stripLabel}"><div class="wrap"><ul>${items}</ul></div></section>`
  );
};

const contactDirect = (lang) => {
  const c = COPY[lang];
  const id = "contact-direct-title";
  return (
    `<section class="contact-direct wrap" aria-labelledby="${id}">` +
    `<div><p class="eyebrow">${c.contactEyebrow}</p><h2 id="${id}">${c.contactHeading}</h2><p>${c.contactBody}</p></div>` +
    `<div class="contact-actions">` +
    `<a class="contact-whatsapp" href="${waHref(c.prefill)}" target="_blank" rel="noopener" aria-label="${c.chatAria}">` +
    `${WHATSAPP_MARK(19)}<span>${c.chat}</span></a>` +
    `<a class="contact-call" href="tel:+${PHONE_E164}" aria-label="${c.callAria}">` +
    `<strong>${PHONE_DISPLAY}</strong><small>${c.callLabel}</small></a>` +
    `<p class="contact-caution">${c.caution}</p>` +
    `</div></section>`
  );
};

/* --------------------------------------------------------------------- CSS */

const CSS_BLOCK = [
  "",
  CSS_MARKER,
  "",
  "/* Utility bar: the contact route sits hard right, opposite the language link. */",
  ".utility-whatsapp {",
  "  margin-left: auto;",
  "  gap: 6px;",
  "}",
  ".utility-whatsapp svg {",
  "  flex: none;",
  "}",
  ".utility-whatsapp b {",
  "  font-weight: 700;",
  "  letter-spacing: .03em;",
  "  color: var(--ink);",
  "}",
  ".utility-whatsapp:hover b,",
  ".utility-whatsapp:focus-visible b {",
  "  color: var(--red-dark);",
  "}",
  "@media (max-width: 400px) {",
  "  .utility-whatsapp span {",
  "    display: none;",
  "  }",
  "}",
  "",
  "/* Cart link: a real bag symbol replaces the placeholder glyph. */",
  ".bag-link svg {",
  "  flex: none;",
  "}",
  "",
  "/* Footer: a light warm ground so the brand logo keeps its own red and ink. */",
  ".site-footer {",
  "  background: var(--warm);",
  "  color: var(--ink);",
  "}",
  ".footer-main {",
  "  border-top: 1px solid var(--line);",
  "}",
  ".footer-main img {",
  "  filter: none;",
  "}",
  ".footer-main p,",
  ".footer-main a {",
  "  color: var(--muted);",
  "}",
  ".footer-main h3 {",
  "  color: var(--ink);",
  "}",
  ".footer-main a:hover,",
  ".footer-main a:focus-visible {",
  "  color: var(--red-dark);",
  "  text-decoration: underline;",
  "}",
  ".footer-bottom {",
  "  border-top: 1px solid var(--line);",
  "  color: var(--muted);",
  "}",
  "",
  "/* Homepage assurance strip, directly beneath the hero. */",
  ".assurance-strip {",
  "  background: var(--warm);",
  "  border-bottom: 1px solid var(--line);",
  "}",
  ".assurance-strip ul {",
  "  display: grid;",
  "  grid-template-columns: repeat(4, minmax(0, 1fr));",
  "  gap: 1px;",
  "  margin: 0;",
  "  padding: 0;",
  "  list-style: none;",
  "  background: var(--line);",
  "}",
  ".assurance-strip li {",
  "  display: flex;",
  "  gap: 12px;",
  "  align-items: flex-start;",
  "  padding: 22px clamp(14px, 1.6vw, 26px);",
  "  background: var(--warm);",
  "}",
  ".assurance-strip svg {",
  "  flex: none;",
  "  margin-top: 1px;",
  "  color: var(--red-dark);",
  "}",
  ".assurance-strip strong {",
  "  display: block;",
  "  font-size: 11px;",
  "  font-weight: 700;",
  "  letter-spacing: .07em;",
  "  text-transform: uppercase;",
  "}",
  ".assurance-strip span {",
  "  display: block;",
  "  margin-top: 5px;",
  "  color: var(--muted);",
  "  font-size: 12px;",
  "  line-height: 1.45;",
  "}",
  "@media (max-width: 900px) {",
  "  .assurance-strip ul {",
  "    grid-template-columns: repeat(2, minmax(0, 1fr));",
  "  }",
  "}",
  "@media (max-width: 520px) {",
  "  .assurance-strip li {",
  "    padding: 16px 14px;",
  "  }",
  "  .assurance-strip span {",
  "    font-size: 11px;",
  "  }",
  "}",
  "",
  "/* Contact page: the direct WhatsApp and call route. */",
  ".contact-direct {",
  "  display: grid;",
  "  grid-template-columns: 1.05fr .95fr;",
  "  gap: clamp(28px, 6vw, 90px);",
  "  align-items: center;",
  "  padding-block: clamp(45px, 6vw, 82px);",
  "  border-top: 1px solid var(--line);",
  "}",
  ".contact-direct h2 {",
  "  margin: 0;",
  "  font: clamp(32px, 3.6vw, 52px)/1 var(--serif);",
  "  letter-spacing: -.04em;",
  "}",
  ".contact-direct > div > p:not(.eyebrow) {",
  "  max-width: 470px;",
  "  margin: 18px 0 0;",
  "  color: var(--muted);",
  "}",
  ".contact-actions {",
  "  display: grid;",
  "  gap: 12px;",
  "}",
  ".contact-whatsapp {",
  "  display: inline-flex;",
  "  justify-content: center;",
  "  align-items: center;",
  "  gap: 10px;",
  "  min-height: 54px;",
  "  padding: 0 22px;",
  "  background: #25d366;",
  "  color: #fff;",
  "  font-size: 11px;",
  "  font-weight: 700;",
  "  letter-spacing: .09em;",
  "  text-transform: uppercase;",
  "  transition: background .2s var(--ease);",
  "}",
  ".contact-whatsapp:hover,",
  ".contact-whatsapp:focus-visible {",
  "  background: #1da851;",
  "}",
  ".contact-whatsapp svg {",
  "  flex: none;",
  "}",
  ".contact-call {",
  "  display: flex;",
  "  justify-content: space-between;",
  "  align-items: center;",
  "  gap: 14px;",
  "  min-height: 54px;",
  "  padding: 0 22px;",
  "  border: 1px solid var(--ink);",
  "  transition: background .2s var(--ease);",
  "}",
  ".contact-call:hover,",
  ".contact-call:focus-visible {",
  "  background: var(--warm);",
  "}",
  ".contact-call strong {",
  "  font: 21px var(--serif);",
  "  letter-spacing: -.02em;",
  "}",
  ".contact-call small {",
  "  color: var(--muted);",
  "  font-size: 9px;",
  "  font-weight: 700;",
  "  letter-spacing: .09em;",
  "  text-transform: uppercase;",
  "}",
  ".contact-caution {",
  "  margin: 4px 0 0;",
  "  color: var(--muted);",
  "  font-size: 11px;",
  "  line-height: 1.5;",
  "}",
  "@media (max-width: 900px) {",
  "  .contact-direct {",
  "    grid-template-columns: 1fr;",
  "  }",
  "}",
  "",
].join("\r\n");

/* -------------------------------------------------------------------- steps */

const langOf = (html) => (/<html[^>]*\slang="bn"/.test(html) ? "bn" : "en");

async function insertBlock(relPath, anchor, build, marker) {
  const file = path.join(staticSite, relPath);
  let html = await fs.readFile(file, "utf8");
  if (html.includes(marker)) return `already present : ${relPath}`;
  if (!html.includes(anchor)) return `ANCHOR MISSING  : ${relPath}`;
  html = html.replace(anchor, build(langOf(html)) + anchor);
  await fs.writeFile(file, html, "utf8");
  return `inserted        : ${relPath}`;
}

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

async function main() {
  // 1. Stylesheet.
  let css = await fs.readFile(CSS_PATH, "utf8");
  if (css.includes(CSS_MARKER)) {
    console.log("CSS             : already present");
  } else {
    await fs.writeFile(CSS_PATH, css + CSS_BLOCK, "utf8");
    console.log("CSS             : appended");
  }

  // 2. Homepages.
  console.log("\nAssurance strip");
  for (const page of ["index.html", "en/index.html", "bn/index.html"]) {
    console.log(
      "  " +
        (await insertBlock(page, '<section class="category-section wrap">', assuranceStrip, 'class="assurance-strip"')),
    );
  }

  // 3. Contact pages.
  console.log("\nDirect contact block");
  for (const page of ["en/contact/index.html", "bn/contact/index.html"]) {
    console.log(
      "  " + (await insertBlock(page, '<section class="info-grid wrap">', contactDirect, 'class="contact-direct wrap"')),
    );
  }

  // 4. Cache busting — must run last, after every asset edit.
  const hash = async (p) =>
    crypto.createHash("md5").update(await fs.readFile(p)).digest("hex").slice(0, 8);
  const cssHash = await hash(CSS_PATH);
  const jsHash = await hash(path.join(staticSite, "assets", "js", "site.js"));

  let touched = 0;
  for (const file of await htmlFiles(staticSite)) {
    const before = await fs.readFile(file, "utf8");
    const after = before
      .replace(/site\.css\?v=[0-9a-f]{8}/g, `site.css?v=${cssHash}`)
      .replace(/site\.js\?v=[0-9a-f]{8}/g, `site.js?v=${jsHash}`);
    if (after !== before) {
      await fs.writeFile(file, after, "utf8");
      touched += 1;
    }
  }
  console.log(`\nCache busting   : site.css?v=${cssHash}  site.js?v=${jsHash}  (${touched} files updated)`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

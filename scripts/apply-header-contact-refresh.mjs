/**
 * Header refresh across the static site.
 *
 *  1. Utility bar  — drops the centred "checkout goes live" notice and replaces the
 *                    "Customer care" link with a direct WhatsApp click-to-chat link
 *                    carrying the real contact number.
 *  2. Bag link     — swaps the placeholder glyph for a real shopping-bag symbol and
 *                    renames the label from "Bag" to "Cart".
 *
 * Idempotent: running twice produces no further change.
 */
import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const staticSite = path.join(projectRoot, "public_html");

const PHONE_DISPLAY = "+880 1740-501062";
const PHONE_E164 = "8801740501062";

const PREFILL = {
  en: "Hello, I would like to enquire about eMarket247 jewellery.",
  bn: "আসসালামু আলাইকুম, আমি eMarket247-এর জুয়েলারি সম্পর্কে জানতে চাই।",
};

const LABEL = {
  en: { whatsapp: "WhatsApp", cart: "Cart", chatAria: "Chat with us on WhatsApp" },
  bn: { whatsapp: "হোয়াটসঅ্যাপ", cart: "কার্ট", chatAria: "হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন" },
};

const WHATSAPP_ICON =
  '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false" fill="currentColor">' +
  '<path d="M12.04 2.016c-5.495 0-9.958 4.463-9.96 9.957 0 1.758.46 3.472 1.332 4.983L2 22.02l5.19-1.362a9.94 9.94 0 0 0 4.75 1.21h.005c5.49 0 9.954-4.463 9.956-9.957a9.9 9.9 0 0 0-2.914-7.04 9.9 9.9 0 0 0-7.042-2.917Zm0 18.19h-.004a8.26 8.26 0 0 1-4.208-1.152l-.302-.18-3.128.82.835-3.05-.196-.313a8.25 8.25 0 0 1-1.264-4.4c.002-4.565 3.718-8.28 8.29-8.28a8.23 8.23 0 0 1 5.854 2.43 8.23 8.23 0 0 1 2.424 5.86c-.002 4.566-3.718 8.28-8.3 8.28Zm4.544-6.2c-.25-.124-1.475-.727-1.703-.81-.229-.084-.395-.125-.561.125-.166.25-.644.81-.79.977-.144.166-.29.187-.539.062-.25-.125-1.052-.388-2.004-1.237-.74-.66-1.24-1.477-1.386-1.727-.145-.25-.015-.384.11-.508.112-.112.29-.291.436-.437.146-.145.194-.25.29-.416.098-.167.05-.312-.011-.437-.062-.125-.561-1.353-.769-1.852-.203-.486-.409-.42-.561-.428-.146-.007-.312-.008-.478-.008-.166 0-.436.062-.664.312-.229.25-.873.853-.873 2.08 0 1.228.894 2.414 1.018 2.58.125.167 1.758 2.686 4.26 3.767.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.48-.072 1.475-.603 1.683-1.185.208-.583.208-1.082.146-1.186-.063-.104-.229-.166-.478-.29Z"/>' +
  "</svg>";

const CART_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M5.5 7.5h13l-1.1 12.2a1.4 1.4 0 0 1-1.4 1.3H8a1.4 1.4 0 0 1-1.4-1.3L5.5 7.5Z"/>' +
  '<path d="M9 7.5V6a3 3 0 0 1 6 0v1.5"/>' +
  "</svg>";

const waHref = (lang) =>
  `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(PREFILL[lang])}`;

const utilityBar = (lang) =>
  `<div class="utility"><a class="utility-phone utility-whatsapp" href="${waHref(lang)}" ` +
  `target="_blank" rel="noopener" aria-label="${LABEL[lang].chatAria}">${WHATSAPP_ICON}` +
  `<span>${LABEL[lang].whatsapp}</span> <b>${PHONE_DISPLAY}</b></a></div>`;

const bagLink = (lang) =>
  `<a class="bag-link" href="/${lang}/shop/" aria-label="${LABEL[lang].cart}">` +
  `${CART_ICON}<span>${LABEL[lang].cart}</span><i>0</i></a>`;

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
  const files = await htmlFiles(staticSite);
  let utilityChanged = 0;
  let bagChanged = 0;
  const skipped = [];

  for (const file of files) {
    let html = await fs.readFile(file, "utf8");
    const before = html;
    const lang = /<html[^>]*\slang="bn"/.test(html) ? "bn" : "en";

    // 1. Utility bar — replace the whole element so the notice <p> and the
    //    old care link disappear together.
    const utilityRe = /<div class="utility">[\s\S]*?<\/div>/;
    if (utilityRe.test(html)) {
      const replaced = html.replace(utilityRe, utilityBar(lang));
      if (replaced !== html) {
        html = replaced;
        utilityChanged += 1;
      }
    }

    // 2. Bag link — the placeholder glyph becomes a real cart symbol.
    const bagRe = /<a class="bag-link"[\s\S]*?<i>0<\/i><\/a>/;
    if (bagRe.test(html)) {
      const replaced = html.replace(bagRe, bagLink(lang));
      if (replaced !== html) {
        html = replaced;
        bagChanged += 1;
      }
    }

    if (html !== before) await fs.writeFile(file, html, "utf8");
    else if (!/class="utility"/.test(before) && !/class="bag-link"/.test(before)) {
      skipped.push(path.relative(staticSite, file));
    }
  }

  console.log(`HTML files inspected : ${files.length}`);
  console.log(`Utility bars updated : ${utilityChanged}`);
  console.log(`Cart links updated   : ${bagChanged}`);
  if (skipped.length) console.log(`No header present    : ${skipped.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

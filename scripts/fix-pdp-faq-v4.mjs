#!/usr/bin/env node
/**
 * fix-pdp-faq-v4.mjs
 * Replace FAQ accordion content using direct string index arithmetic.
 * Finds pdp-faq → its first <div class="pdp-accordion-content"> → replaces up to its </div>
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');

const BN_INNER = [
  '<p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা, বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>',
  '<p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>',
  '<p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>',
  '<p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>',
].join('\n          ');

let changed = 0;
let skipped = 0;

for (const lang of ['bn']) {
  const productsDir = join(ROOT, lang, 'products');
  try {
    const entries = readdirSync(productsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const htmlPath = join(productsDir, entry.name, 'index.html');
      let html;
      try {
        html = readFileSync(htmlPath, 'utf8');
      } catch {
        continue;
      }

      if (!html.includes('id="pdp-faq"')) { skipped++; continue; }

      // Find the first <div class="pdp-accordion-content"> AFTER id="pdp-faq"
      const faqAnchor = 'id="pdp-faq"';
      const faqIdx = html.indexOf(faqAnchor);
      if (faqIdx === -1) { skipped++; continue; }

      const searchFrom = faqIdx + faqAnchor.length;
      const divOpen = '<div class="pdp-accordion-content">';
      const divOpenIdx = html.indexOf(divOpen, searchFrom);
      if (divOpenIdx === -1) { skipped++; continue; }

      const contentStart = divOpenIdx + divOpen.length;
      // Find the FIRST </div> after this div's opening tag (not crossing </details>)
      const detailsClose = html.indexOf('</details>', contentStart);
      const divCloseRaw = html.indexOf('</div>', contentStart);
      // Only accept </div> that comes BEFORE </details>
      const divCloseIdx = (divCloseRaw !== -1 && (detailsClose === -1 || divCloseRaw < detailsClose))
        ? divCloseRaw
        : -1;

      if (divCloseIdx === -1) {
        // eslint-disable-next-line no-console
        console.warn(`  ! Could not find </div> in ${lang}/${entry.name}`);
        skipped++;
        continue;
      }

      // Build replacement: opening div + new content + closing div
      const newBlock = divOpen + '\n          ' + BN_INNER + '\n        </div>';
      const newHtml = html.substring(0, contentStart) + '\n          ' + BN_INNER + '\n        ' + html.substring(divCloseIdx);

      if (newHtml !== html) {
        writeFileSync(htmlPath, newHtml, 'utf8');
        changed++;
        // eslint-disable-next-line no-console
        console.log(`  ✓ ${lang}/products/${entry.name}/`);
      } else {
        skipped++;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error:', err.message);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. ${changed} BN FAQs replaced, ${skipped} skipped.`);

#!/usr/bin/env node
/**
 * fix-pdp-faq-v3.mjs
 * Replace FAQ accordion content across all PDPs using regex.
 * Works regardless of exact Bengali text encoding differences.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');

// New accordion content for each language (inner content only — inside the div)
const EN_INNER = [
  '<p><strong>Is this real gold?</strong> No — this is gold-tone (imitation) jewellery, not solid gold. We always state the material honestly.</p>',
  '<p><strong>Will the colour fade?</strong> With proper care — removing before water, perfume, and sweat — the colour typically lasts 6–12 months or longer.</p>',
  '<p><strong>How do I get the exact price?</strong> Message us on WhatsApp with the product reference. We confirm price and availability within hours.</p>',
  '<p><strong>Can I return it?</strong> Yes — within 15 days of delivery, unused and in original condition. Contact us on WhatsApp to start a return.</p>',
].join('\n          ');

const BN_INNER = [
  '<p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা, বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>',
  '<p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>',
  '<p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>',
  '<p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>',
].join('\n          ');

let changed = 0;
let skipped = 0;

for (const lang of ['en', 'bn']) {
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

      // Only process files that have a FAQ accordion
      if (!html.includes('id="pdp-faq"')) { skipped++; continue; }

      const inner = lang === 'en' ? EN_INNER : BN_INNER;

      // Build regex to match the accordion content div inside pdp-faq
      // Must not cross the </details> boundary — use look-ahead for </details>
      const pattern = /(<div class="pdp-accordion-content">)([\s\S]*?)(?=<\/div>\s*<\/details>)/;
      const replacement = `$1\n          ${inner}\n        `;

      if (pattern.test(html)) {
        html = html.replace(pattern, replacement);
        writeFileSync(htmlPath, html, 'utf8');
        changed++;
        // eslint-disable-next-line no-console
        console.log(`  ✓ ${lang}/products/${entry.name}/`);
      } else {
        // Fallback: just replace the pdp-accordion-content div wherever it appears
        // after pdp-faq (naive but covers most cases)
        const faqIdx = html.indexOf('id="pdp-faq"');
        const afterFaq = html.substring(faqIdx);
        const accStart = afterFaq.indexOf('<div class="pdp-accordion-content">');
        const accEnd = afterFaq.indexOf('</div>', accStart) + 6;
        const beforeFaq = html.substring(0, faqIdx);
        const replaced = beforeFaq + afterFaq.substring(0, accStart + accEnd.length)
          .replace(/<div class="pdp-accordion-content">[\s\S]*?(?=<\/div>)/, `<div class="pdp-accordion-content">\n          ${inner}\n        `);
        if (replaced !== html) {
          html = replaced;
          writeFileSync(htmlPath, html, 'utf8');
          changed++;
          // eslint-disable-next-line no-console
          console.log(`  ✓ ${lang}/products/${entry.name}/ (fallback)`);
        } else {
          skipped++;
        }
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error:', err.message);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. ${changed} FAQs replaced, ${skipped} skipped.`);

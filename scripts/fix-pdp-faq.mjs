#!/usr/bin/env node
/**
 * fix-pdp-faq.mjs
 * Replaces the FAQ accordion placeholder in all PDPs with real content.
 * Targeted: <details id="pdp-faq"> block only.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');

const EN_FAQ = `<details class="pdp-accordion" id="pdp-faq">
        <summary>Frequently Asked Questions</summary>
        <div class="pdp-accordion-content">
          <p><strong>Is this real gold?</strong> No — this is gold-tone (imitation) jewellery, not solid gold. We always state the material honestly.</p>
          <p><strong>Will the colour fade?</strong> With proper care — removing before water, perfume, and sweat — the colour typically lasts 6–12 months or longer.</p>
          <p><strong>How do I get the exact price?</strong> Message us on WhatsApp with the product reference. We confirm price and availability within hours.</p>
          <p><strong>Can I return it?</strong> Yes — within 15 days of delivery, unused and in original condition. Contact us on WhatsApp to start a return.</p>
        </div>
      </details>`;

const BN_FAQ = `<details class="pdp-accordion" id="pdp-faq">
        <summary>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী</summary>
        <div class="pdp-accordion-content">
          <p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা, বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>
          <p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>
          <p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>
          <p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>
        </div>
      </details>`;

// The old accordion body patterns (inside the FAQ details block) - 10-space indent
const EN_OLD_FAQ_BODY = `
        <div class="pdp-accordion-content">
          <p>Our customer care team is here to assist you.</p>
        </div>`;

const BN_OLD_FAQ_BODY = `
        <div class="pdp-accordion-content">
          <p>আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তা করবে।</p>
        </div>`;

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

      if (lang === 'en') {
        if (html.includes(EN_OLD_FAQ_BODY)) {
          html = html.replace(EN_OLD_FAQ_BODY, EN_FAQ.replace('<details class="pdp-accordion" id="pdp-faq">', '\n      <details class="pdp-accordion" id="pdp-faq">'));
          writeFileSync(htmlPath, html, 'utf8');
          changed++;
          // eslint-disable-next-line no-console
          console.log(`  ✓ en/products/${entry.name}/ — FAQ replaced`);
        } else if (html.includes('id="pdp-faq"')) {
          // Already fixed or different placeholder
          skipped++;
        } else {
          skipped++;
        }
      } else {
        if (html.includes(BN_OLD_FAQ_BODY)) {
          html = html.replace(BN_OLD_FAQ_BODY, BN_FAQ.replace('<details class="pdp-accordion" id="pdp-faq">', '\n      <details class="pdp-accordion" id="pdp-faq">'));
          writeFileSync(htmlPath, html, 'utf8');
          changed++;
          // eslint-disable-next-line no-console
          console.log(`  ✓ bn/products/${entry.name}/ — FAQ replaced`);
        } else if (html.includes('id="pdp-faq"')) {
          skipped++;
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
console.log(`\nDone. ${changed} FAQs replaced, ${skipped} skipped/already-fixed.`);

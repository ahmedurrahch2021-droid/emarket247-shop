#!/usr/bin/env node
/**
 * fix-pdp-faq-v2.mjs
 * Replace FAQ accordion placeholder in all PDPs.
 * Simple string replacement — works regardless of surrounding whitespace.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');

const EN_OLD = '<p>Our customer care team is here to assist you.</p>';
const EN_NEW = (
  '<p><strong>Is this real gold?</strong> No — this is gold-tone (imitation) jewellery, ' +
  'not solid gold. We always state the material honestly.</p>' +
  '<p><strong>Will the colour fade?</strong> With proper care — removing before water, ' +
  'perfume, and sweat — the colour typically lasts 6–12 months or longer.</p>' +
  '<p><strong>How do I get the exact price?</strong> Message us on WhatsApp with the ' +
  'product reference. We confirm price and availability within hours.</p>' +
  '<p><strong>Can I return it?</strong> Yes — within 15 days of delivery, unused and in ' +
  'original condition. Contact us on WhatsApp to start a return.</p>'
);

const BN_OLD = '<p>আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তা করবে।</p>';
const BN_NEW = (
  '<p><strong>এটা কি আসল সোনা?</strong> না — এটি সোনালি রঙের (ইমিটেশন) গহনা, ' +
  'বিশুদ্ধ সোনা নয়। আমরা সবসময় উপাদান সম্পর্কে সৎ থাকি।</p>' +
  '<p><strong>রঙ কি উঠে যাবে?</strong> সঠিক যত্ন নিলে — পানি, প্রসাধন ও ঘাম থেকে আগে ' +
  'খুলে রাখলে — রঙ সাধারণত ৬–১২ মাস বা তার বেশি সময় থাকে।</p>' +
  '<p><strong>সঠিক মূল্য কীভাবে জানব?</strong> পণ্যের রেফারেন্স দিয়ে WhatsApp-এ ' +
  'মেসেজ করুন। আমরা কয়েক ঘণ্টার মধ্যে মূল্য ও প্রাপ্যতা নিশ্চিত করব।</p>' +
  '<p><strong>ফেরত দিতে পারব?</strong> হ্যাঁ — ডেলিভারির ১৫ দিনের মধ্যে, ' +
  'অব্যবহৃত ও আসল অবস্থায় থাকলে। রিটার্ন শুরু করতে WhatsApp-এ যোগাযোগ করুন।</p>'
);

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

      const old = lang === 'en' ? EN_OLD : BN_OLD;
      const fresh = lang === 'en' ? EN_NEW : BN_NEW;

      if (html.includes(old)) {
        html = html.replace(old, fresh, 1);
        writeFileSync(htmlPath, html, 'utf8');
        changed++;
        // eslint-disable-next-line no-console
        console.log(`  ✓ ${lang}/products/${entry.name}/`);
      } else if (html.includes('id="pdp-faq"')) {
        skipped++;
      } else {
        skipped++;
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error reading products dir:', err.message);
  }
}

// eslint-disable-next-line no-console
console.log(`\nDone. ${changed} FAQs replaced, ${skipped} skipped/already-fixed.`);

/**
 * One-off script: PDP accordion section patcher
 * Last needed: Before T1 (legacy consolidation), when generate-product-detail-pages.mjs was active
 * Purpose: Patched the PDP template in generate-product-detail-pages.mjs to add accordion sections
 * Status: Obsolete — generate-product-detail-pages.mjs is now disabled (targeted static-site/)
 * Archived: 2026-09-17 during T2 (repository cleanup)
 */
const fs = require('fs');

let content = fs.readFileSync('scripts/generate-product-detail-pages.mjs', 'utf8');

// Define new accordion section
const accordionSection = `
    <!-- SECTION: Product Information Accordion -->
    <section class="pdp-accordion-section wrap">
      <details class="pdp-accordion" id="pdp-details">
        <summary>\${isBn ? 'পণ্যের তথ্য' : 'Product Details'}</summary>
        <div class="pdp-accordion-content">
          <h3>\${isBn ? 'পণ্যের বিবরণ' : 'Description'}</h3>
          <p>\${product.description[lang]}</p>

          <h3>\${isBn ? 'উপকরণ' : 'Materials'}</h3>
          <p>\${product.materials[lang]}</p>

          <h3>\${isBn ? 'মাত্রা' : 'Dimensions'}</h3>
          <p>\${product.dimensions[lang] || (isBn ? 'প্রযোজ্য নয়' : 'N/A')}</p>
        </div>
      </details>

      <details class="pdp-accordion" id="pdp-care">
        <summary>\${isBn ? 'যত্ন নির্দেশনা' : 'Care Instructions'}</summary>
        <div class="pdp-accordion-content">
          <p>\${isBn ? 'আপনার গহনাকে সুন্দর রাখতে:' : 'To keep your jewellery beautiful:'}</p>
          <ul>
            <li>\${isBn ? 'পরিষ্কার, শুষ্ক জায়গায় সংরক্ষণ করুন' : 'Store in a clean, dry place'}</li>
            <li>\${isBn ? 'রাসায়নিক পদার্থ থেকে দূরে রাখুন' : 'Keep away from chemicals'}</li>
            <li>\${isBn ? 'নরম কাপড় দিয়ে মুছুন' : 'Wipe with a soft cloth'}</li>
          </ul>
        </div>
      </details>

      <details class="pdp-accordion" id="pdp-shipping">
        <summary>\${isBn ? 'ডেলিভারি ও ফেরত' : 'Delivery & Returns'}</summary>
        <div class="pdp-accordion-content">
          <p>\${isBn ? 'ঢাকার মধ্যে ১-২ কার্যদিবস' : 'Delivery within Dhaka: 1-2 business days'}</p>
          <p>\${isBn ? 'ঢাকার বাইরে ২-৪ কার্যদিবস' : 'Outside Dhaka: 2-4 business days'}</p>
          <p>\${isBn ? 'ত্রুটিপূর্ণ পণ্য ৭ দিনের মধ্যে বিনিময়যোগ্য' : 'Defective items exchangeable within 7 days'}</p>
        </div>
      </details>
    </section>
`;

// Insert accordion section before the footer
const footerMarker = '<!-- SECTION: Footer -->';
if (content.includes(footerMarker)) {
  content = content.replace(footerMarker, accordionSection + '\n' + footerMarker);
  fs.writeFileSync('scripts/generate-product-detail-pages.mjs', content, 'utf8');
  console.log('✓ Accordion section added to PDP template');
} else {
  console.log('✗ Footer marker not found');
}

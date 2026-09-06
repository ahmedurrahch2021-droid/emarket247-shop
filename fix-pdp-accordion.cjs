const fs = require('fs');

let content = fs.readFileSync('scripts/generate-product-detail-pages.mjs', 'utf8');

// Define new accordion section
const accordionSection = `
    <!-- SECTION: Product Information Accordion -->
    <section class="pdp-accordion-section wrap">
      <details class="pdp-accordion" id="pdp-details">
        <summary>\${isBn ? 'পণ্যের তথ্য' : 'Product Details'}</summary>
        <div class="pdp-accordion-content">
          <dl class="pdp-specs-list">
            <div class="pdp-spec-row"><dt>\${isBn ? 'ক্যাটালগ রেফারেন্স আইডি' : 'Catalogue Reference ID'}</dt><dd><code>\${attr(product.id)}</code></dd></div>
            <div class="pdp-spec-row"><dt>\${isBn ? 'ক্যাটাগরি' : 'Category'}</dt><dd>\${attr(categoryLabel)}</dd></div>
            <div class="pdp-spec-row"><dt>\${isBn ? 'ডিজাইন সিলুয়েট' : 'Silhouette Style'}</dt><dd>\${attr(context.silhouetteName)}</dd></div>
          </dl>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-care">
        <summary>\${isBn ? 'যত্ন ও স্টাইলিং নির্দেশিকা' : 'Care & Styling Guidance'}</summary>
        <div class="pdp-accordion-content">
          <p>\${isBn ? 'শুকনো নরম কাপড়ে মুছুন; পারফিউম ও আর্দ্রতা থেকে দূরে রাখুন' : 'Soft dry cloth wipe; store dry away from moisture & perfumes'}</p>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-shipping">
        <summary>\${isBn ? 'শিপিং ও ডেলিভারি' : 'Shipping & Delivery'}</summary>
        <div class="pdp-accordion-content">
          <p>\${isBn ? 'সারাদেশে কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি' : 'Nationwide courier delivery across Bangladesh'}</p>
        </div>
      </details>
      <details class="pdp-accordion" id="pdp-faq">
        <summary>\${isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}</summary>
        <div class="pdp-accordion-content">
          <p>\${isBn ? 'আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তা করবে।' : 'Our customer care team is here to assist you.'}</p>
        </div>
      </details>
    </section>
`;

// Replacing everything from SECTION D up to SECTION J
const startIndex = content.indexOf('<!-- SECTION D: Product Specifications -->');
// Find the end just before J
const endIndex = content.indexOf('<!-- SECTION J: Related Products -->');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + accordionSection + content.substring(endIndex);
  fs.writeFileSync('scripts/generate-product-detail-pages.mjs', newContent);
  console.log('Successfully updated accordion sections.');
} else {
  console.log('Could not find existing sections to replace.');
}

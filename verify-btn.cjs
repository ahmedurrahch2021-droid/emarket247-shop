const fs = require('fs');
const site = fs.readFileSync('public_html/assets/css/site.css', 'utf8');
const pdp  = fs.readFileSync('public_html/assets/css/pdp.css', 'utf8');
const vars = fs.readFileSync('public_html/assets/css/variables.css', 'utf8');

const checks = [
  ['variables.css --btn-rest',        vars.includes('--btn-rest:')],
  ['variables.css --btn-hover',       vars.includes('--btn-hover:')],
  ['variables.css --btn-active',      vars.includes('--btn-active:')],
  ['site.css .btn class',            site.includes('.btn{background:var(--btn-rest)')],
  ['site.css .btn:hover',            site.includes('.btn:hover{background:var(--btn-hover)')],
  ['site.css .btn:active',           site.includes('.btn:active')],
  ['site.css hero-btn-primary --btn-rest',  site.includes('background: var(--btn-rest) !important')],
  ['site.css hero-btn-primary hover --btn-hover', site.includes('background: var(--btn-hover) !important')],
  ['site.css product-card-add-btn --btn-rest', site.includes('background: var(--btn-rest)')],
  ['site.css bag-empty-cta --btn-rest', site.includes('background: var(--btn-rest)')],
  ['site.css aria-pressed --btn-rest', site.includes('button[aria-pressed="true"]{background:var(--btn-rest)')],
  ['pdp.css .pdp-btn-add-bag-primary --btn-rest', pdp.includes('background: var(--btn-rest)')],
  ['pdp.css .pdp-btn-add-bag-primary hover --btn-hover', pdp.includes('.pdp-btn-add-bag-primary:hover') && pdp.includes('background: var(--btn-hover)')],
  ['pdp.css WhatsApp button preserved #143d31', pdp.includes('#143d31')],
  ['site.css WhatsApp btn NOT changed (#143d31)', site.includes('#143d31')],
];

let passed = 0, failed = 0;
checks.forEach(([label, ok]) => {
  console.log((ok ? '✅' : '❌'), label);
  ok ? passed++ : failed++;
});
console.log('\n' + passed + '/' + checks.length + ' checks passed');

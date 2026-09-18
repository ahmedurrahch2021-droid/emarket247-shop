const fs = require('fs');

// Check site.css
const site = fs.readFileSync('public_html/assets/css/site.css', 'utf8');
const pdp  = fs.readFileSync('public_html/assets/css/pdp.css', 'utf8');

function findRules(content, label) {
  const targets = [
    'hero-btn-primary{', 'hero-btn-secondary{', 'hero-btn-primary:hover',
    'product-card-add-btn{', 'product-card-wa-btn{',
    'bag-checkout-wa{', 'bag-empty-cta{', 'catalog-reset-btn{',
    '.button{', '.button-dark{', '.button-outline{',
    '.button:hover', 'button[aria-pressed',
    'is-added{', 'is-added:hover',
    'pdp-btn-add-bag-primary{', 'pdp-btn-whatsapp-action{',
    'pdp-final-actions .button{', 'pdp-final-actions .button-dark{',
  ];
  console.log(`\n=== ${label} ===`);
  targets.forEach(t => {
    let idx = 0, count = 0;
    while ((idx = content.indexOf(t, idx)) !== -1) {
      // find the opening brace position
      const ob = content.indexOf('{', idx);
      // find matching closing brace
      let depth = 1, ci = ob + 1;
      while (depth > 0 && ci < content.length) {
        if (content[ci] === '{') depth++;
        else if (content[ci] === '}') depth--;
        ci++;
      }
      const rule = content.substring(idx, ci);
      if (rule.includes('background') || rule.includes('border')) {
        console.log('  FOUND:', t, '=>', rule.replace(/\n/g,' ').slice(0, 300));
      }
      if (++count > 5) { console.log('  ...more'); break; }
      idx++;
    }
  });
}

findRules(site, 'site.css');
findRules(pdp, 'pdp.css');

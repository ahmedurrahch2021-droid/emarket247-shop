import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const siteCssPath = path.join(root, 'public_html', 'assets', 'css', 'site.css');
const pdpCssPath = path.join(root, 'public_html', 'assets', 'css', 'pdp.css');
const enIndexPath = path.join(root, 'public_html', 'en', 'index.html');
const bnIndexPath = path.join(root, 'public_html', 'bn', 'index.html');

let siteCss = fs.readFileSync(siteCssPath, 'utf8');
let pdpCss = fs.readFileSync(pdpCssPath, 'utf8');
let enIndex = fs.readFileSync(enIndexPath, 'utf8');
let bnIndex = fs.readFileSync(bnIndexPath, 'utf8');

console.log('--- Refactoring Button Color System across CSS & HTML ---');

// 1. Update line 1 in site.css for .button-dark
const oldButtonDark = '.button-dark{background:var(--crimson,#7a1830);color:var(--ivory,#faf5ec);border:1px solid var(--crimson,#7a1830)}.button-dark:hover,.button-dark:focus-visible{background:var(--crimson-dark,#4e0f1e);border-color:var(--gold,#8b6528);color:var(--ivory,#faf5ec)}';
const newButtonDark = '.button-dark{background:var(--btn-rest);color:var(--btn-text);border:1px solid var(--btn-rest);transition:var(--btn-transition)}.button-dark:hover{background:var(--btn-hover);border-color:var(--btn-hover);color:var(--btn-text)}.button-dark:active,.button-dark:focus-visible{background:var(--btn-active);border-color:var(--btn-active);color:var(--btn-text)}';

if (siteCss.includes(oldButtonDark)) {
  siteCss = siteCss.replace(oldButtonDark, newButtonDark);
  console.log('✓ site.css: .button-dark replaced with tokens');
} else {
  console.log('! site.css: oldButtonDark pattern not found on line 1, checking regex');
}

// 2. Update .studio-whatsapp in site.css
const oldStudioWa = '.studio-whatsapp{background:var(--crimson,#7a1830);color:var(--ivory,#faf5ec);border:1px solid var(--crimson,#7a1830)}.studio-whatsapp:hover{background:var(--crimson-dark,#4e0f1e);border-color:var(--gold,#8b6528);color:var(--ivory,#faf5ec)}';
const newStudioWa = '.studio-whatsapp{background:var(--btn-rest);color:var(--btn-text);border:1px solid var(--btn-rest);transition:var(--btn-transition)}.studio-whatsapp:hover{background:var(--btn-hover);border-color:var(--btn-hover);color:var(--btn-text)}.studio-whatsapp:active,.studio-whatsapp:focus-visible{background:var(--btn-active);border-color:var(--btn-active);color:var(--btn-text)}';

if (siteCss.includes(oldStudioWa)) {
  siteCss = siteCss.replace(oldStudioWa, newStudioWa);
  console.log('✓ site.css: .studio-whatsapp replaced with tokens');
}

// 3. Update pdp-final-actions .button-dark (block 1)
const oldPdpFinal1 = `.pdp-final-actions .button-dark {
  background: #143d31;
  border-color: #143d31;
  color: #ffffff;
}
.pdp-final-actions .button-dark:hover {
  background: #0d2820;
}`;

const newPdpFinal1 = `.pdp-final-actions .button-dark {
  background: var(--btn-rest);
  border-color: var(--btn-rest);
  color: var(--btn-text);
  transition: var(--btn-transition);
}
.pdp-final-actions .button-dark:hover {
  background: var(--btn-hover);
  border-color: var(--btn-hover);
  color: var(--btn-text);
}
.pdp-final-actions .button-dark:active,
.pdp-final-actions .button-dark:focus-visible {
  background: var(--btn-active);
  border-color: var(--btn-active);
  color: var(--btn-text);
}`;

if (siteCss.includes(oldPdpFinal1)) {
  siteCss = siteCss.replace(oldPdpFinal1, newPdpFinal1);
  console.log('✓ site.css: pdp-final-actions block 1 replaced with tokens');
}

// 4. Update pdp-final-actions .button-dark (block 2)
const oldPdpFinal2 = `.pdp-final-actions .button-dark {
  background: #143d31 !important;
  border: 1px solid #143d31 !important;
  color: #ffffff !important;
}
.pdp-final-actions .button-dark:hover {
  background: #0d2820 !important;
  border-color: #0d2820 !important;
}`;

const newPdpFinal2 = `.pdp-final-actions .button-dark {
  background: var(--btn-rest) !important;
  border: 1px solid var(--btn-rest) !important;
  color: var(--btn-text) !important;
  transition: var(--btn-transition) !important;
}
.pdp-final-actions .button-dark:hover {
  background: var(--btn-hover) !important;
  border-color: var(--btn-hover) !important;
  color: var(--btn-text) !important;
}
.pdp-final-actions .button-dark:active,
.pdp-final-actions .button-dark:focus-visible {
  background: var(--btn-active) !important;
  border-color: var(--btn-active) !important;
  color: var(--btn-text) !important;
}`;

if (siteCss.includes(oldPdpFinal2)) {
  siteCss = siteCss.replace(oldPdpFinal2, newPdpFinal2);
  console.log('✓ site.css: pdp-final-actions block 2 replaced with tokens');
}

// 5. Update .carousel-shop-btn and define the shared pill-shaped .btn component
const oldCarouselShopBtn = `.carousel-shop-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--crimson, #7a1830);
  color: var(--ivory, #faf5ec);
  border: 1px solid var(--crimson, #7a1830);
  border-radius: 9999px;
  padding: 0.75rem 1.75rem;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(122, 24, 48, 0.25);
  transition: all 0.22s var(--ease);
  cursor: pointer;
}

.carousel-shop-btn:hover,
.carousel-shop-btn:focus-visible {
  background: var(--crimson-dark, #4e0f1e);
  border-color: var(--gold, #8b6528);
  color: var(--ivory, #faf5ec);
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(78, 15, 30, 0.4);
}`;

const newSharedBtn = `/* Shared Pill Button Component (.btn) — based on "View our shop" design */
.btn,
.carousel-shop-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--btn-rest);
  color: var(--btn-text);
  border: 1px solid var(--btn-rest);
  border-radius: 9999px;
  padding: 0.75rem 1.75rem;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(137, 33, 37, 0.25);
  transition: var(--btn-transition, background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease);
  cursor: pointer;
}

.btn:hover,
.carousel-shop-btn:hover {
  background: var(--btn-hover);
  border-color: var(--btn-hover);
  color: var(--btn-text);
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(210, 53, 59, 0.4);
}

.btn:active,
.btn:focus-visible,
.carousel-shop-btn:active,
.carousel-shop-btn:focus-visible {
  background: var(--btn-active);
  border-color: var(--btn-active);
  color: var(--btn-text);
}`;

if (siteCss.includes(oldCarouselShopBtn)) {
  siteCss = siteCss.replace(oldCarouselShopBtn, newSharedBtn);
  console.log('✓ site.css: .btn & .carousel-shop-btn configured with tokens');
} else {
  console.error('✗ site.css: oldCarouselShopBtn not matched!');
}

// 6. Update auth-submit-btn and admin-submit-btn
siteCss = siteCss.replace(
  `.auth-submit-btn {\n  width: 100%;\n  padding: 14px;\n  margin-top: 8px;\n  font-weight: 600;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n}`,
  `.auth-submit-btn {\n  width: 100%;\n  padding: 14px;\n  margin-top: 8px;\n  font-weight: 600;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n  background: var(--btn-rest);\n  color: var(--btn-text);\n  border: 1px solid var(--btn-rest);\n  cursor: pointer;\n  transition: var(--btn-transition);\n}\n.auth-submit-btn:hover {\n  background: var(--btn-hover);\n  border-color: var(--btn-hover);\n  color: var(--btn-text);\n}\n.auth-submit-btn:active, .auth-submit-btn:focus-visible {\n  background: var(--btn-active);\n  border-color: var(--btn-active);\n  color: var(--btn-text);\n}`
);

siteCss = siteCss.replace(
  `.admin-submit-btn {\n  width: 100%;\n  padding: 14px;\n  font-weight: 600;\n}`,
  `.admin-submit-btn {\n  width: 100%;\n  padding: 14px;\n  font-weight: 600;\n  background: var(--btn-rest);\n  color: var(--btn-text);\n  border: 1px solid var(--btn-rest);\n  cursor: pointer;\n  transition: var(--btn-transition);\n}\n.admin-submit-btn:hover {\n  background: var(--btn-hover);\n  border-color: var(--btn-hover);\n  color: var(--btn-text);\n}\n.admin-submit-btn:active, .admin-submit-btn:focus-visible {\n  background: var(--btn-active);\n  border-color: var(--btn-active);\n  color: var(--btn-text);\n}`
);

// 7. Update pdp.css
pdpCss = pdpCss.replace(
  `color: #ffffff;\n  border: 1px solid var(--btn-rest);`,
  `color: var(--btn-text);\n  border: 1px solid var(--btn-rest);`
);

pdpCss = pdpCss.replace(
  `.pdp-btn-add-bag-primary:hover,\n.pdp-btn-add-bag-primary:focus-visible {\n  background: var(--btn-hover);\n  border-color: var(--btn-hover);\n  color: #ffffff;\n}`,
  `.pdp-btn-add-bag-primary:hover {\n  background: var(--btn-hover);\n  border-color: var(--btn-hover);\n  color: var(--btn-text);\n}\n.pdp-btn-add-bag-primary:active,\n.pdp-btn-add-bag-primary:focus-visible {\n  background: var(--btn-active);\n  border-color: var(--btn-active);\n  color: var(--btn-text);\n}`
);

// 8. In HTML files, add .btn to carousel-shop-btn
enIndex = enIndex.replace(
  'class="carousel-shop-btn"',
  'class="btn carousel-shop-btn"'
);

bnIndex = bnIndex.replace(
  'class="carousel-shop-btn"',
  'class="btn carousel-shop-btn"'
);

fs.writeFileSync(siteCssPath, siteCss, 'utf8');
fs.writeFileSync(pdpCssPath, pdpCss, 'utf8');
fs.writeFileSync(enIndexPath, enIndex, 'utf8');
fs.writeFileSync(bnIndexPath, bnIndex, 'utf8');

console.log('✓ All CSS and HTML files saved successfully.');

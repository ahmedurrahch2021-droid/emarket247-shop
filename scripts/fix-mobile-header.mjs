/**
 * fix-mobile-header.mjs — v3
 * Restructures nav-header mobile row across all public_html HTML files.
 * Detects and fixes these patterns:
 *   A) <button class="menu-toggle" attrs><span×3><b>Menu</b></button>  (EN/BN)
 *   B) <div...><button class="menu-toggle" attrs><span×3></button></div> (already wrapped)
 *   C) <button class="menu-toggle" attrs><span×3></button>           (bare, no wrapper)
 * Run: node scripts/fix-mobile-header.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = join(process.cwd(), 'public_html');

function iconLinks(prefix) {
  const a = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.3-3.4 4-5 7.5-5s6.2 1.6 7.5 5"/></svg>`;
  const w = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1 7.8 7.8 7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`;
  const c = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 8h11l-1 11a1.6 1.6 0 0 1-1.6 1.5H9.1A1.6 1.6 0 0 1 7.5 19L6.5 8Z"/><path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8"/></svg>`;
  const b = `<i class="icon-badge">0</i>`;
  return `<div class="mobile-header-icons">
        <a href="${prefix}/account/" class="icon-link" aria-label="Account" title="Account">${a}${b}</a>
        <button type="button" class="icon-link" aria-label="Wishlist" title="Wishlist" data-wishlist-toggle>${w}${b}</button>
        <a href="${prefix}/shop/" class="icon-link" aria-label="Cart" title="Cart">${c}${b}</a>
      </div>`;
}

function getPrefix(fp) {
  return /[\\/]bn[\\/]/.test(fp) ? '/bn' : '/en';
}

function shortPath(fp) {
  return fp.replace(process.cwd(), '').replace(/^\\public_html\\/, 'public_html\\').replace(/^\/public_html\//, 'public_html/');
}

function processFile(fp) {
  let c = readFileSync(fp, 'utf8');
  const prefix = getPrefix(fp);
  if (c.includes('mobile-nav-bar')) return 'skip-already-fixed';
  if (!c.includes('menu-toggle'))   return 'skip-no-menu';

  // Pattern A: <button ...><span></span><span></span><span></span><b>Menu</b></button>  (with optional Bengali)
  // Handles multiline: the button may span multiple lines
  const patA = /<button\s+class="menu-toggle"([^>]*(?:"[^"]*")?[^>]*)>\s*<span><\/span>\s*<span><\/span>\s*<span><\/span>\s*<b>[^<]*<\/b>\s*<\/button>/;
  if (patA.test(c)) {
    c = c.replace(patA, () => `<div class="mobile-nav-bar">
      ${iconLinks(prefix)}
      <button class="menu-toggle$1><span></span><span></span><span></span></button>
    </div>`);
    writeFileSync(fp, c, 'utf8');
    return 'fixed-A';
  }

  // Pattern D: <button ...><span class="menu-hamburger"><span×3></span><b>Menu</b></button>  (wrapper span)
  const patD = /<button\s+class="menu-toggle"([^>]*(?:"[^"]*")?[^>]*)>\s*<span\s+class="menu-hamburger"[^>]*>(?:\s*<span><\/span>\s*){3}<\/span>\s*<b>[^<]*<\/b>\s*<\/button>/;
  if (patD.test(c)) {
    c = c.replace(patD, () => `<div class="mobile-nav-bar">
      ${iconLinks(prefix)}
      <button class="menu-toggle$1><span></span><span></span><span></span></button>
    </div>`);
    writeFileSync(fp, c, 'utf8');
    return 'fixed-D';
  }

  // Pattern B: bare <button ...><span×3></button>  (no wrapping div)
  const patB = /<button\s+class="menu-toggle"([^>]*(?:"[^"]*")?[^>]*)>\s*<span><\/span>\s*<span><\/span>\s*<span><\/span>\s*<\/button>/;
  if (patB.test(c)) {
    c = c.replace(patB, () => `<div class="mobile-nav-bar">
      ${iconLinks(prefix)}
      <button class="menu-toggle$1><span></span><span></span><span></span></button>
    </div>`);
    writeFileSync(fp, c, 'utf8');
    return 'fixed-B';
  }

  return 'skip-unknown-pattern';
}

const stats = { fixed: 0, skipped: 0, errors: 0, details: [] };

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (extname(entry) !== '.html') continue;
    try {
      const r = processFile(full);
      stats.details.push({ f: shortPath(full), r });
      if (r.startsWith('fixed')) stats.fixed++;
      else stats.skipped++;
    } catch (e) {
      stats.errors++;
      stats.details.push({ f: shortPath(full), r: 'ERROR: ' + e.message });
    }
  }
}

walk(ROOT);

console.log(`\n=== Mobile Header Fix v3 ===`);
console.log(`Fixed: ${stats.fixed}  |  Skipped: ${stats.skipped}  |  Errors: ${stats.errors}`);
stats.details.forEach(d => {
  const m = d.r.startsWith('fixed') ? '✓' : d.r.startsWith('ERROR') ? '✗' : '·';
  console.log(`  ${m}  ${d.f.padEnd(72)} ${d.r}`);
});

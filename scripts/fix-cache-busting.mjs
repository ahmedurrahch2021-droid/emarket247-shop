#!/usr/bin/env node
/**
 * Step 2 — Cache-Busting Repair.
 * Every HTML page in both trees gets TRUE content-hash version strings on its
 * CSS/JS links, and the modular first layer (variables.css) is linked so the
 * whole site shares one token source.
 *
 * The version strings are computed from the actual bytes of the files served,
 * so a browser re-downloads an asset the moment its content changes (the memory
 * rule: "always content-hash, never hardcode").
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TREES = ['static-site', 'public_html'];

function hash8(rel) {
  const buf = readFileSync(path.join(ROOT, 'public_html', rel));
  return createHash('md5').update(buf).digest('hex').slice(0, 8);
}

const V = {
  variables: hash8('assets/css/variables.css'),
  site: hash8('assets/css/site.css'),
  pdp: hash8('assets/css/pdp.css'),
  js: hash8('assets/js/site.js'),
};
console.log('Version map:', V);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

function normalize(file) {
  let html = readFileSync(file, 'utf8');
  const orig = html;

  // variables.css version (link may have no version yet)
  html = html.replace(
    /href="\/assets\/css\/variables\.css(\?v=[A-Za-z0-9_]+)?"/g,
    `href="/assets/css/variables.css?v=${V.variables}"`
  );
  // site.css version (fixes v_clean / stale-hash / missing)
  html = html.replace(
    /href="\/assets\/css\/site\.css(?:\?v=[A-Za-z0-9_]+)?"/g,
    `href="/assets/css/site.css?v=${V.site}"`
  );
  // pdp.css version
  html = html.replace(
    /href="\/assets\/css\/pdp\.css(\?v=[A-Za-z0-9_]+)?"/g,
    `href="/assets/css/pdp.css?v=${V.pdp}"`
  );
  // site.js version
  html = html.replace(
    /src="\/assets\/js\/site\.js(?:\?v=[A-Za-z0-9_]+)?"/g,
    `src="/assets/js/site.js?v=${V.js}"`
  );

  // Ensure variables.css (token layer) is linked just before site.css —
  // the first layer of the design system, only when absent.
  if (!html.includes('/assets/css/variables.css')) {
    html = html.replace(
      '<link rel="stylesheet" href="/assets/css/site.css?v=' + V.site + '">',
      '<link rel="stylesheet" href="/assets/css/variables.css?v=' + V.variables + '">' +
        '<link rel="stylesheet" href="/assets/css/site.css?v=' + V.site + '">'
    );
  }

  if (html !== orig) {
    writeFileSync(file, html, 'utf8');
    return true;
  }
  return false;
}

let totalChanged = 0;
for (const tree of TREES) {
  const files = walk(path.join(ROOT, tree));
  let changed = 0;
  for (const f of files) if (normalize(f)) changed++;
  totalChanged += changed;
  console.log(`${tree}: ${files.length} html, ${changed} updated`);
}
console.log('TOTAL updated:', totalChanged);

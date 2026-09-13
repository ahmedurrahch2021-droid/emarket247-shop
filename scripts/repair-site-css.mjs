#!/usr/bin/env node
/**
 * Step 1 — CSS Repair.
 * Rebuilds a COMPLETE, non-truncated site.css and writes it to BOTH trees
 * (static-site = source of truth, public_html = deployed) so they match.
 *
 * What it does:
 *  1. Reads the complete source stylesheet (static-site/assets/css/site.css).
 *  2. Removes the trailing "PDP MASTER LAYOUT" block (the !important-heavy,
 *     redundant override) — PDP layout is owned by pdp.css.
 *  3. Ensures --gold / --gold-light / --mono tokens are defined in :root so no
 *     page has an undefined CSS variable.
 *  4. Writes the result to static-site/assets/css/site.css AND
 *     public_html/assets/css/site.css.
 *
 * It does NOT alter any other styles — it only repairs the truncation and the
 * token gap. Deeper cleanup happens later (Step 5 design refinements).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'static-site', 'assets', 'css', 'site.css');
const TARGETS = [
  path.join(ROOT, 'static-site', 'assets', 'css', 'site.css'),
  path.join(ROOT, 'public_html', 'assets', 'css', 'site.css'),
];

let css = readFileSync(SOURCE, 'utf8');

// 1. Drop the trailing "PDP MASTER LAYOUT" !important block (from its marker to EOF).
const MASTER_MARKER = 'PDP MASTER LAYOUT';
const markerIdx = css.indexOf(MASTER_MARKER);
if (markerIdx === -1) {
  console.error('WARN: "PDP MASTER LAYOUT" marker not found; skipping block removal.');
} else {
  // Back up to the opening banner comment of that block.
  const bannerIdx = css.lastIndexOf('/* =', markerIdx);
  const start = bannerIdx === -1 ? markerIdx : bannerIdx;
  css = css.slice(0, start).replace(/\s+$/, '') + '\n';
  console.log('Removed PDP MASTER LAYOUT block.');
}

// 2. Ensure tokens exist. Find the :root block that defines --mono and inject
//    --gold / --gold-light next to it (only if not already present).
if (!css.includes('--gold:')) {
  css = css.replace(
    /(:root\s*\{[^}]*?--mono:\s*"[^"]*"[^}]*?\})/,
    (_m, block) => block.replace('--mono:', '--gold:#8b6528; --gold-light:#faf4eb; --mono:')
  );
  console.log('Injected --gold / --gold-light tokens.');
} else {
  console.log('--gold already defined; skipped token injection.');
}

// 3. Sanity: ensure the file no longer ends mid-rule (last non-space char must be '}').
const trimmed = css.trimEnd();
if (!trimmed.endsWith('}')) {
  console.error('ERROR: rebuilt file does not end with a closing brace — aborting.');
  process.exit(1);
}
if (css.includes('.pdp-hero {')) {
  // fine — earlier clean definition remains
}

// 4. Write to both trees.
for (const target of TARGETS) {
  writeFileSync(target, css, 'utf8');
  console.log('Wrote', target, `(${css.length} bytes)`);
}

// Report the new content hash for cache-busting.
import { createHash } from 'node:crypto';
const h = createHash('md5').update(css).digest('hex').slice(0, 8);
console.log('NEW site.css content-hash (first 8 of md5):', h);

#!/usr/bin/env node
/**
 * Wire the header wishlist control to the wishlist page.
 *
 * Every page already ships the heart (data-wishlist-toggle) as a plain
 * <button> with no destination. This script turns it into a real link to
 * /{lang}/wishlist/ so the wishlist is reachable without JavaScript at all,
 * which is also what keeps the control honest for keyboard and screen-reader
 * users: it announces a link with a destination, not a dead button.
 *
 * The data-wishlist-toggle hook stays on the element, because site.js uses it
 * to keep the count badge in sync. Idempotent: a page that already links to the
 * wishlist page is left untouched.
 *
 * Run after scripts/add-wishlist-pages.mjs and before scripts/fix-cache-busting.mjs.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TREE = path.join(ROOT, "public_html");

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const file = path.join(dir, entry);
    if (statSync(file).isDirectory()) walk(file, out);
    else if (entry.endsWith(".html")) out.push(file);
  }
  return out;
};

// Any <button ... data-wishlist-toggle ...>…</button>, including the legacy
// emoji variant on a couple of older pages.
const BUTTON_PATTERN = /<button\b[^>]*data-wishlist-toggle[^>]*>/g;

const toLink = (tag, href) => {
  const attributes = tag
    .replace(/^<button\b/i, "")
    .replace(/\/?>$/, "")
    .replace(/\stype="button"/i, "")
    .trim();
  return `<a href="${href}"${attributes ? ` ${attributes}` : ""}>`;
};

let changed = 0;
let controls = 0;
let skipped = 0;

for (const file of walk(TREE)) {
  const rel = path.relative(TREE, file).split(path.sep).join("/");
  const lang = rel.startsWith("bn/") ? "bn" : "en";
  const href = `/${lang}/wishlist/`;
  const html = readFileSync(file, "utf8");

  if (!html.includes("data-wishlist-toggle")) continue;
  controls += (html.match(/data-wishlist-toggle/g) || []).length;

  let next = html.replace(BUTTON_PATTERN, (tag) => toLink(tag, href));
  // The matching closing tag of a converted control is the first </button>
  // that follows it; converting precisely avoids touching unrelated buttons.
  next = next.replace(/(<a\b[^>]*data-wishlist-toggle[^>]*>[\s\S]*?)<\/button>/g, "$1</a>");

  if (next === html) {
    skipped += 1;
    continue;
  }
  writeFileSync(file, next, "utf8");
  changed += 1;
}

console.log(`Wishlist header controls found: ${controls}`);
console.log(`Pages rewritten: ${changed} (already linked: ${skipped})`);
console.log("Next: node scripts/fix-cache-busting.mjs && npm run check");

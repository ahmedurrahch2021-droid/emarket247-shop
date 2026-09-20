#!/usr/bin/env node
/**
 * apply-home-chrome.mjs — copy the homepage header/footer onto storefront pages.
 *
 * The canonical chrome is the <header class="site-header"> and
 * <footer class="site-footer"> of public_html/en/index.html and
 * public_html/bn/index.html. This script replaces those two blocks on the
 * given pages with the homepage blocks of the same language. Nothing between
 * </header> and <footer> is touched, so page copy, product grids and page JS
 * stay exactly as they are.
 *
 * The only per-page difference is the language switch (.lang-link): when the
 * counterpart page exists (/en/x/ <-> /bn/x/) the link deep-links to it instead
 * of the other language's homepage.
 *
 * Usage:
 *   node scripts/apply-home-chrome.mjs <file-or-dir> [...more]
 *   node scripts/apply-home-chrome.mjs --check <file-or-dir> [...]   (report only)
 *
 * Admin pages (public_html/admin, en/admin, bn/admin) are always skipped.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public_html");

function extractBlock(html, tag, className) {
  const open = new RegExp(`<${tag}\\s+class="${className}"[^>]*>`).exec(html);
  if (!open) return null;
  const tokens = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, "g");
  tokens.lastIndex = open.index;
  let depth = 0;
  let token;
  while ((token = tokens.exec(html))) {
    if (token[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) return { start: open.index, end: token.index + token[0].length, html: html.slice(open.index, token.index + token[0].length) };
    } else {
      depth += 1;
    }
  }
  return null;
}

const canonical = {};
for (const lang of ["en", "bn"]) {
  const home = readFileSync(path.join(PUBLIC, lang, "index.html"), "utf8");
  const header = extractBlock(home, "header", "site-header");
  const footer = extractBlock(home, "footer", "site-footer");
  if (!header || !footer) throw new Error(`${lang}/index.html: homepage chrome not found`);
  canonical[lang] = { header: header.html, footer: footer.html };
}

function walk(target, out = []) {
  const stats = statSync(target);
  if (stats.isDirectory()) {
    for (const entry of readdirSync(target)) walk(path.join(target, entry), out);
  } else if (target.endsWith(".html")) {
    out.push(target);
  }
  return out;
}

function counterpartHref(rel, lang, other) {
  // rel like "en/how-to-order/index.html" -> "/bn/how-to-order/" when that page exists.
  const otherRel = rel.replace(new RegExp(`^${lang}/`), `${other}/`);
  if (!existsSync(path.join(PUBLIC, otherRel))) return `/${other}/`;
  return "/" + otherRel.replace(/index\.html$/, "");
}

function applyChrome(file, checkOnly) {
  const rel = path.relative(PUBLIC, file).split(path.sep).join("/");
  if (/^(admin|en\/admin|bn\/admin)\//.test(rel)) return { rel, skipped: "admin" };
  const lang = rel.startsWith("bn/") ? "bn" : rel.startsWith("en/") ? "en" : null;
  if (!lang) return { rel, skipped: "not under /en/ or /bn/" };
  const other = lang === "en" ? "bn" : "en";

  const html = readFileSync(file, "utf8");
  const header = extractBlock(html, "header", "site-header");
  const footer = extractBlock(html, "footer", "site-footer");
  if (!header || !footer) return { rel, skipped: `missing ${!header ? "site-header" : "site-footer"} block` };

  const langHref = counterpartHref(rel, lang, other);
  const newHeader = canonical[lang].header.replace(
    new RegExp(`(<a href=")/${other}/(" class="lang-link")`),
    `$1${langHref}$2`
  );
  const newFooter = canonical[lang].footer;

  const changed = header.html !== newHeader || footer.html !== newFooter;
  if (changed && !checkOnly) {
    // Replace the footer first so the header offsets stay valid.
    let next = html.slice(0, footer.start) + newFooter + html.slice(footer.end);
    next = next.slice(0, header.start) + newHeader + next.slice(header.end);
    writeFileSync(file, next, "utf8");
  }
  return { rel, changed, langHref };
}

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const targets = args.filter((arg) => arg !== "--check");
if (!targets.length) {
  console.error("Usage: node scripts/apply-home-chrome.mjs [--check] <file-or-dir> [...]");
  process.exit(1);
}

let changed = 0;
let same = 0;
for (const target of targets) {
  for (const file of walk(path.resolve(ROOT, target))) {
    const result = applyChrome(file, checkOnly);
    if (result.skipped) {
      console.log(`  - ${result.rel}: skipped (${result.skipped})`);
    } else if (result.changed) {
      changed += 1;
      console.log(`  ${checkOnly ? "!" : "✓"} ${result.rel}${checkOnly ? " differs from homepage chrome" : ""} (lang switch → ${result.langHref})`);
    } else {
      same += 1;
    }
  }
}
console.log(`${checkOnly ? "Would update" : "Updated"} ${changed} page(s); ${same} already matched the homepage chrome.`);

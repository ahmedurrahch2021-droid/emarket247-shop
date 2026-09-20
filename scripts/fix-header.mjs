// Remove the social row that was wrongly injected into the page HEADER
// (inside .main-header, right after the brand logo). The footer keeps its own
// single social row under the footer logo. Idempotent; skips admin.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const root = "public_html";
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!["assets", "api"].includes(e.name)) walk(p, out); }
    else if (e.name === "index.html") out.push(p);
  }
  return out;
};

let fixed = 0, none = 0;
for (const file of walk(root)) {
  if (/[\\/]admin[\\/]/.test(file)) { continue; }
  let s = readFileSync(file, "utf8");
  // Header social row: it sits inside .main-header immediately after the brand
  // logo <a>. The footer logo is followed by a <p> tagline, not a social row,
  // so this pattern only matches the header.
  const re = /(<a class="brand"[^>]*>\s*<img[^>]*logo-transparent\.png[^>]*>)\s*<div class="footer-social"[\s\S]*?<\/div>/;
  if (re.test(s)) {
    s = s.replace(re, "$1");
    writeFileSync(file, s, "utf8");
    fixed++;
  } else {
    none++;
  }
}
console.log("header social removed:", fixed, "| no header social:", none);

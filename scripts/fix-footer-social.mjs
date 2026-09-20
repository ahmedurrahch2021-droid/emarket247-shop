// Fix: remove the duplicate social row from the payment row. The social icons
// live once, under the logo in the brand column. Idempotent; skips admin.
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

let fixed = 0, already = 0, skipped = 0;
for (const file of walk(root)) {
  if (/[\\/]admin[\\/]/.test(file)) { skipped++; continue; }
  let s = readFileSync(file, "utf8");
  // Remove a social row that is the first child inside the payment row.
  const re = /(<div class="footer-pay">)<div class="footer-social"[\s\S]*?<\/div>/;
  if (re.test(s)) {
    s = s.replace(re, "$1");
    writeFileSync(file, s, "utf8");
    fixed++;
  } else {
    already++;
  }
}
console.log(`fixed (removed dup social in pay row): ${fixed}`);
console.log(`already single: ${already}`);
console.log(`admin skipped: ${skipped}`);

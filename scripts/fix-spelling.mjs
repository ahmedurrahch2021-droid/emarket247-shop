// Fix the footer address spelling across all pages and the generator.
// "Kaluktra" -> "Kalukhali" (Union: Kalukhali, Yakubpur, Thakurgaon).
// EN text only; the BN address is already correct Bengali. Idempotent.
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

let fixed = 0;
for (const file of walk(root)) {
  let s = readFileSync(file, "utf8");
  if (s.includes("Kaluktra")) {
    s = s.split("Kaluktra").join("Kalukhali");
    writeFileSync(file, s, "utf8");
    fixed++;
  }
}

// Also fix the two generators so future rebuilds use the right spelling.
for (const g of ["scripts/rebuild-footer.mjs", "scripts/update-footer.mjs"]) {
  try {
    let s = readFileSync(g, "utf8");
    if (s.includes("Kaluktra")) {
      s = s.split("Kaluktra").join("Kalukhali");
      writeFileSync(g, s, "utf8");
      console.log("generator fixed:", g);
    }
  } catch {}
}
console.log("pages fixed spelling:", fixed);

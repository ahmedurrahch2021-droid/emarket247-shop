// Fix the footer address spelling across all pages and the generator.
// Replace "Kalukhali" with "Kalukhetra" (Kalukhetra, Yakubpur, Thakurgaon).
// Idempotent.
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
  if (s.includes("Kalukhali") || s.includes("Kaluktra")) {
    s = s.split("Kalukhali").join("Kalukhetra").split("Kaluktra").join("Kalukhetra");
    writeFileSync(file, s, "utf8");
    fixed++;
  }
}

// Also fix the two generators so future rebuilds use the right spelling.
for (const g of ["scripts/rebuild-footer.mjs", "scripts/update-footer.mjs"]) {
  try {
    let s = readFileSync(g, "utf8");
    if (s.includes("Kalukhali") || s.includes("Kaluktra")) {
      s = s.split("Kalukhali").join("Kalukhetra").split("Kaluktra").join("Kalukhetra");
      writeFileSync(g, s, "utf8");
      console.log("generator fixed:", g);
    }
  } catch {}
}
console.log("pages fixed spelling:", fixed);

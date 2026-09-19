// One-off repair: the FAQ JSON-LD was appended after a complete top-level
// object, producing two adjacent JSON documents. Merge the FAQPage into the
// existing @graph instead.
import { readFileSync, writeFileSync } from "node:fs";

for (const lang of ["en", "bn"]) {
  const f = `public_html/${lang}/how-to-order/index.html`;
  let s = readFileSync(f, "utf8");
  const m = s.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  const raw = m[1];
  const idx = raw.indexOf('{"@context":"https://schema.org","@type":"FAQPage"');
  if (idx < 0) { console.log("no appended FAQ:", lang); continue; }
  const base = JSON.parse(raw.slice(0, raw.lastIndexOf("}", idx) + 1));
  const faqObj = JSON.parse(raw.slice(idx));
  base["@graph"].push(faqObj);
  s = s.replace(raw, JSON.stringify(base));
  writeFileSync(f, s);
  // verify
  const m2 = readFileSync(f, "utf8").match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  JSON.parse(m2[1]);
  console.log("fixed+valid:", lang);
}

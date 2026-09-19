// One-off: add "How to Order" to the footer Care column on every page.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const walk = (d, o = []) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, o);
    else if (p.endsWith(".html")) o.push(p);
  }
  return o;
};

let en = 0, bn = 0;
for (const f of walk("public_html")) {
  const norm = f.split(path.sep).join("/");
  let s = readFileSync(f, "utf8");
  if (norm.includes("/bn/")) {
    const a = '<a href="/bn/guides/">গাইড</a>';
    if (s.includes(a) && !s.includes('href="/bn/how-to-order/"')) {
      s = s.replace(a, a + '\n<a href="/bn/how-to-order/">কীভাবে অর্ডার করবেন</a>');
      writeFileSync(f, s);
      bn++;
    }
  } else {
    const a = '<a href="/en/guides/">Guides</a>';
    if (s.includes(a) && !s.includes('href="/en/how-to-order/"')) {
      s = s.replace(a, a + '\n<a href="/en/how-to-order/">How to Order</a>');
      writeFileSync(f, s);
      en++;
    }
  }
}
console.log("footer links added — en:", en, "bn:", bn);

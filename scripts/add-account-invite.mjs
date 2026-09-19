// One-off: add an account invitation line under the newsletter form, and
// mark the section with the account link. EN and BN variants.
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

let en = 0, bn = 0, skip = 0;
for (const f of walk("public_html")) {
  const norm = f.split(path.sep).join("/");
  // homepage has no newsletter section (removed as planned)
  if (!readFileSync(f, "utf8").includes('class="newsletter"')) { continue; }
  let s = readFileSync(f, "utf8");
  if (s.includes("data-account-invite")) { skip++; continue; }
  const isBN = norm.includes("/bn/");
  const langPath = isBN ? "/bn/" : "/en/";
  const label = isBN ? "অ্যাকাউন্ট খুলুন" : "Create an account";
  const copy = isBN
    ? "সাবস্ক্রিপশন ও অ্যাকাউন্ট আলাদা — চাইলে অ্যাকাউন্ট খুলে অর্ডার ও উইশলিস্ট এক জায়গায় রাখতে পারেন।"
    : "Subscription and accounts are separate — you can also create an account to keep orders and your wishlist in one place.";
  const old = '<p>A formal consent and privacy workflow will be connected before newsletter collection goes live.</p>';
  const oldBN = 'সাবস্ক্রিপশন সংগ্রহ চালুর আগে অনুমোদিত সম্মতি প্রক্রিয়া যুক্ত করা হবে।';
  const invite = `<p class="newsletter-account-invite" data-account-invite>${copy} <a href="${langPath}account/">${label} →</a></p>`;
  if (s.includes(old)) {
    s = s.replace(old, old + invite);
  } else if (s.includes(oldBN)) {
    // BN consent line may differ; append after the consent <p> generically
    const idx = s.indexOf("</p></form></section>");
    if (idx < 0) { skip++; continue; }
    s = s.slice(0, idx) + invite + s.slice(idx);
  } else {
    skip++;
    continue;
  }
  writeFileSync(f, s);
  isBN ? bn++ : en++;
}
console.log("invite added — en:", en, "bn:", bn, "skipped:", skip);

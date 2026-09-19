// One-off: retire /occasions/bridal/ (EN + BN) and align the occasions
// navigation with the occasion set that actually exists.
//
// Owner decision: bridal was a second name for the same occasion. The bridal
// page earned no separate search intent from /occasions/wedding/, and keeping
// two near-identical occasion pages was thin content, not coverage. The
// bridal-look editorial image moves to the wedding hero instead.
//
// What this script does, in order:
//   1. 301 /{lang}/occasions/bridal/ -> /{lang}/occasions/wedding/ in .htaccess
//   2. delete the two retired page folders
//   3. retarget the surviving in-body links that pointed at the retired page
//      (homepage bridal promo, bridal-jewellery category hero CTA)
//   4. remove the retired top-level nav item and the footer link, everywhere
//      they were copied into (HTML pages + the product.php header/footer)
//   5. add Pahela Baishakh to the Occasions dropdown, which never had it
//   6. drop the hub tile and keep the hub ItemList numbering honest
//   7. drop the two retired URLs from sitemap.xml
//
// public_html is the approved deployment tree and the only target.
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = "public_html";
const LANGS = ["en", "bn"];

const BN_NAV = "ব্রাইডাল";
const EN_NAV = "Bridal";
const BN_FOOTER = "ব্রাইডাল জুয়েলারি";
const EN_FOOTER = "Bridal Jewellery";

const count = (s, re) => (s.match(re) || []).length;
const report = [];

// ---------------------------------------------------------------------------
// 1) 301 redirects
// ---------------------------------------------------------------------------
{
  const file = path.join(ROOT, ".htaccess");
  let s = readFileSync(file, "utf8");
  const rule = "  RewriteRule ^(en|bn)/occasions/bridal/?$ /$1/occasions/wedding/ [R=301,L]";
  if (s.includes(rule)) {
    report.push(".htaccess: redirect already present, skipped");
  } else {
    const marker = "# ---- Dynamic Product Detail Pages";
    if (!s.includes(marker)) throw new Error(".htaccess anchor not found");
    const block = [
      "  # ---- Retired occasion URLs ---------------------------------------",
      "  # /occasions/bridal/ was folded into /occasions/wedding/: one occasion,",
      "  # one page. These are permanent moves so whatever authority and inbound",
      "  # links the retired URLs earned are passed on instead of lost to a 404.",
      rule,
      "  # -------------------------------------------------------------------",
      "",
    ].join("\n");
    s = s.replace(marker, block + marker);
    writeFileSync(file, s, "utf8");
    report.push(".htaccess: 301 bridal -> wedding added");
  }
}

// ---------------------------------------------------------------------------
// 2) Delete the retired page folders
// ---------------------------------------------------------------------------
for (const lang of LANGS) {
  const dir = path.join(ROOT, lang, "occasions", "bridal");
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    report.push(`deleted ${dir}`);
  } else {
    report.push(`${dir}: already gone`);
  }
}

// ---------------------------------------------------------------------------
// Collect every deployable page that carries the shared header/footer
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else if (/\.(?:html|php)$/.test(entry.name)) out.push(file);
  }
  return out;
}
const pages = walk(ROOT).sort();

// ---------------------------------------------------------------------------
// 3) Retarget the surviving in-body links
// ---------------------------------------------------------------------------
const retargets = [
  [
    `<a class="text-link" href="/en/occasions/bridal/">Shop Bridal Jewellery →</a>`,
    `<a class="text-link" href="/en/occasions/wedding/">Shop Wedding Jewellery →</a>`,
  ],
  [
    `<a class="text-link" href="/bn/occasions/bridal/">ব্রাইডাল গহনা দেখুন →</a>`,
    `<a class="text-link" href="/bn/occasions/wedding/">বিয়ের গহনা দেখুন →</a>`,
  ],
  [
    `<a class="button hero-btn-secondary" href="/en/occasions/bridal/">Bridal Occasion</a>`,
    `<a class="button hero-btn-secondary" href="/en/occasions/wedding/">Wedding Occasion</a>`,
  ],
  [
    `<a class="button hero-btn-secondary" href="/bn/occasions/bridal/">ব্রাইডাল উপলক্ষ</a>`,
    `<a class="button hero-btn-secondary" href="/bn/occasions/wedding/">বিয়ের উপলক্ষ</a>`,
  ],
];
for (const [from, to] of retargets) {
  let hits = 0;
  for (const file of pages) {
    const s = readFileSync(file, "utf8");
    if (!s.includes(from)) continue;
    writeFileSync(file, s.split(from).join(to), "utf8");
    hits += 1;
  }
  report.push(`retargeted ${hits} page(s): ${from.slice(0, 60)}…`);
}

// ---------------------------------------------------------------------------
// 4) Remove the retired nav item and footer link
// ---------------------------------------------------------------------------
const removals = [
  {
    label: "nav item",
    re: /\n[ \t]*<a href="\/(?:en|bn)\/occasions\/bridal\/">(?:Bridal|ব্রাইডাল)<\/a>/g,
    // the PHP header builds the same item from a template string
    php: /\n[ \t]*<a href="\/' \. \$lang \. '\/occasions\/bridal\/">' \. \(\$isBn \? 'ব্রাইডাল' : 'Bridal'\) \. '<\/a>/g,
  },
  {
    label: "footer link",
    re: /\n[ \t]*<a href="\/(?:en|bn)\/occasions\/bridal\/">(?:Bridal Jewellery|ব্রাইডাল জুয়েলারি)<\/a>/g,
    php: /\n[ \t]*<a href="\/' \. \$lang \. '\/occasions\/bridal\/">' \. \(\$isBn \? 'ব্রাইডাল জুয়েলারি' : 'Bridal Jewellery'\) \. '<\/a>/g,
  },
];
for (const { label, re, php } of removals) {
  let hits = 0;
  for (const file of pages) {
    const s = readFileSync(file, "utf8");
    const pattern = file.endsWith(".php") ? php : re;
    const next = s.replace(pattern, "");
    if (next !== s) {
      writeFileSync(file, next, "utf8");
      hits += 1;
    }
  }
  report.push(`removed ${label} from ${hits} page(s)`);
}

// ---------------------------------------------------------------------------
// 5) Add Pahela Baishakh to the Occasions dropdown (HTML + product.php)
// ---------------------------------------------------------------------------
const DROPDOWN = {
  bn: {
    after: `<li><a href="/bn/occasions/eid/">ঈদ<small>Eid</small></a></li>`,
    add: `<li><a href="/bn/occasions/pahela-baishakh/">পহেলা বৈশাখ<small>Pahela Baishakh</small></a></li>`,
  },
  en: {
    after: `<li><a href="/en/occasions/eid/">Eid<small>ঈদ</small></a></li>`,
    add: `<li><a href="/en/occasions/pahela-baishakh/">Pahela Baishakh<small>পহেলা বৈশাখ</small></a></li>`,
  },
};
{
  let hits = 0;
  for (const file of pages) {
    if (file.endsWith(".php")) continue;
    let s = readFileSync(file, "utf8");
    let changed = false;
    for (const { after, add } of Object.values(DROPDOWN)) {
      if (!s.includes(after) || s.includes(add)) continue;
      s = s.split(after).join(after + add);
      changed = true;
    }
    if (changed) {
      writeFileSync(file, s, "utf8");
      hits += 1;
    }
  }
  report.push(`added Pahela Baishakh to the occasions dropdown on ${hits} page(s)`);
}
{
  const file = path.join(ROOT, "product.php");
  let s = readFileSync(file, "utf8");
  const after = "    ['eid', 'Eid', 'ঈদ'],";
  const add = "    ['pahela-baishakh', 'Pahela Baishakh', 'পহেলা বৈশাখ'],";
  if (s.includes(after) && !s.includes(add)) {
    s = s.replace(after, after + "\n" + add);
    writeFileSync(file, s, "utf8");
    report.push("product.php: Pahela Baishakh added to $occasions");
  } else {
    report.push("product.php: $occasions already carries Pahela Baishakh");
  }
}

// ---------------------------------------------------------------------------
// 6) Hub: drop the tile, keep the ItemList honest
// ---------------------------------------------------------------------------
for (const lang of LANGS) {
  const file = path.join(ROOT, lang, "occasions", "index.html");
  let s = readFileSync(file, "utf8");

  const tile = new RegExp(
    `<a href="/${lang}/occasions/bridal/" class="category-tile has-media">[\\s\\S]*?</a>`,
  );
  const before = s;
  s = s.replace(tile, "");
  const tileRemoved = s !== before;

  // The ItemList is generated data: it must describe what the page shows.
  const item = new RegExp(
    `,\\{"@type":"ListItem","position":\\d+,"name":"[^"]*","url":"https://emarket247\\.shop/${lang}/occasions/bridal/"\\}`,
  );
  s = s.replace(item, "");

  // Baishakh was position 8 while bridal held 7; it is now the 7th occasion.
  s = s.replace(
    new RegExp(`\\{"@type":"ListItem","position":8,"name":"([^"]*)","url":"https://emarket247\\.shop/${lang}/occasions/pahela-baishakh/"\\}`),
    `{"@type":"ListItem","position":7,"name":"$1","url":"https://emarket247.shop/${lang}/occasions/pahela-baishakh/"}`,
  );
  s = s.replace(/"numberOfItems":8,/, '"numberOfItems":7,');

  writeFileSync(file, s, "utf8");

  // Verify against the parsed ItemList, not a regex over the whole document:
  // the BreadcrumbList in the same @graph also uses "position".
  const ld = JSON.parse(s.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
  const list = ld["@graph"].find((node) => node["@type"] === "ItemList");
  const positions = list.itemListElement.map((item) => item.position);
  const ordered = positions.every((p, i) => p === i + 1);
  const tiles = count(s, /class="category-tile has-media"/g);
  report.push(
    `${file}: tileRemoved=${tileRemoved} tiles=${tiles} numberOfItems=${list.numberOfItems} positionsSequential=${ordered}`,
  );
  if (!ordered || list.numberOfItems !== tiles || list.itemListElement.length !== tiles || tiles !== 7) {
    throw new Error(`hub ${lang}: tile/schema mismatch after edit`);
  }
}

// ---------------------------------------------------------------------------
// 7) Sitemap: the retired URLs must not be advertised
// ---------------------------------------------------------------------------
{
  const file = path.join(ROOT, "sitemap.xml");
  let s = readFileSync(file, "utf8");
  const before = count(s, /occasions\/bridal\//g);
  s = s.replace(
    /\s*<url><loc>https:\/\/emarket247\.shop\/(?:en|bn)\/occasions\/bridal\/<\/loc><\/url>/g,
    "",
  );
  writeFileSync(file, s, "utf8");
  report.push(`sitemap.xml: removed ${before} retired URL(s)`);
}

// ---------------------------------------------------------------------------
// Verify nothing still points at the retired page except the 301 itself
// ---------------------------------------------------------------------------
{
  const leftovers = [];
  for (const file of pages) {
    const s = readFileSync(file, "utf8");
    if (s.includes("occasions/bridal")) leftovers.push(path.relative(ROOT, file));
  }
  if (leftovers.length) {
    throw new Error(`retired URL still referenced in: ${leftovers.join(", ")}`);
  }
}

console.log(report.join("\n"));
console.log("\nBridal occasion retired; navigation aligned.");
void statSync;

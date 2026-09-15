import { readdir, readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const root = path.join(project, "public_html");
const errors = [];
const warnings = [];

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(folder, out = []) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await walk(file, out);
    else out.push(file);
  }
  return out;
}

if (!(await exists(root))) {
  console.error("ERROR: public_html was not found.");
  process.exit(1);
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const jsFiles = files.filter((file) => file.endsWith(".js"));
const phpFiles = files.filter((file) => file.endsWith(".php"));
const publicPages = htmlFiles.filter((file) => {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  return /^(en|bn)\//.test(rel) && !/^((en|bn)\/(admin|account|studio-pilot)\/)/.test(rel);
});

for (const file of publicPages) {
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const lang = rel.startsWith("bn/") ? "bn" : "en";
  const otherLang = lang === "en" ? "bn" : "en";
  const counterpartRel = rel.replace(new RegExp(`^${lang}/`), `${otherLang}/`);

  if (!new RegExp(`<html[^>]+lang=["']${lang}["']`, "i").test(html)) errors.push(`${rel}: missing or incorrect html lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${rel}: missing title`);
  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) errors.push(`${rel}: missing meta description`);
  if (!/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/emarket247\.shop\//i.test(html)) errors.push(`${rel}: missing canonical URL`);
  if (!new RegExp(`hreflang=["']${otherLang}["']`, "i").test(html)) errors.push(`${rel}: missing ${otherLang} hreflang`);
  if (!/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i.test(html)) errors.push(`${rel}: missing h1`);
  if (!(await exists(path.join(root, counterpartRel)))) errors.push(`${rel}: missing ${otherLang} counterpart ${counterpartRel}`);

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref.startsWith("/") || ref.startsWith("//") || ref.startsWith("/api/")) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!clean || clean === "/") continue;
    const candidate = path.join(root, clean);
    const resolved = path.extname(clean) ? candidate : path.join(candidate, "index.html");
    if (!(await exists(resolved))) errors.push(`${rel}: broken local reference ${clean}`);
  }
}

for (const lang of ["en", "bn"]) {
  const file = path.join(root, "assets", "data", `catalog.${lang}.json`);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(parsed.products)) errors.push(`catalog.${lang}.json: products must be an array`);
  } catch (error) {
    errors.push(`catalog.${lang}.json: invalid JSON (${error.message})`);
  }
}

try {
  const en = JSON.parse(await readFile(path.join(root, "assets/data/catalog.en.json"), "utf8")).products || [];
  const bn = JSON.parse(await readFile(path.join(root, "assets/data/catalog.bn.json"), "utf8")).products || [];
  const enKeys = en.map((product) => `${product.id}:${product.slug}`).sort();
  const bnKeys = bn.map((product) => `${product.id}:${product.slug}`).sort();
  if (JSON.stringify(enKeys) !== JSON.stringify(bnKeys)) errors.push("catalog EN/BN product ID and slug parity failed");
} catch {
  // The individual JSON errors above provide the useful failure message.
}

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) errors.push(`${path.relative(root, file)}: JavaScript syntax failed`);
}

const phpProbe = spawnSync("php", ["-v"], { encoding: "utf8" });
if (phpProbe.error?.code === "ENOENT") {
  warnings.push("PHP CLI is unavailable; PHP syntax checks were skipped.");
} else {
  for (const file of phpFiles) {
    const result = spawnSync("php", ["-l", file], { encoding: "utf8" });
    if (result.status !== 0) errors.push(`${path.relative(root, file)}: PHP syntax failed`);
  }
}

const activeTextFiles = files.filter((file) => /\.(?:html|js|php|json)$/i.test(file));
for (const file of activeTextFiles) {
  const text = await readFile(file, "utf8");
  const rel = path.relative(root, file).replaceAll("\\", "/");
  if (text.includes("৳ 8,500")) warnings.push(`${rel}: contains the unapproved ৳ 8,500 placeholder`);
  if (/\bprice\s*:\s*bp\.price\s*\|\|\s*4200\b/.test(text)) warnings.push(`${rel}: contains the unapproved 4200 price fallback`);
}

console.log(`Checked ${publicPages.length} public HTML pages, ${jsFiles.length} JavaScript files, ${phpFiles.length} PHP files, and both catalogues.`);
if (warnings.length) {
  console.warn(`\nWARNINGS (${warnings.length})`);
  for (const warning of [...new Set(warnings)]) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`\nERRORS (${errors.length})`);
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nPublic-site validation passed.");

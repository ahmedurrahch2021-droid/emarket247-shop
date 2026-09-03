/**
 * Creates a Hostinger File Manager upload package outside the web project.
 * It copies the static Vite build, moves the approved local campaign/brand files
 * into the package, and replaces Manus storage paths with relative static paths.
 */
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const buildDir = path.join(projectRoot, "dist", "public");
const outputDir = "/home/ubuntu/emarket247-hostinger-package";
const staticDir = "/home/ubuntu/webdev-static-assets";

const assetCopies = [
  ["emarket247-logo-transparent.png", "assets/brand/emarket247-logo-transparent.png"],
  ["emarket247-favicon-master.png", "assets/brand/emarket247-favicon-master.png"],
  ["optimized/emarket247-hero-vermilion-atelier.webp", "assets/editorial/emarket247-hero-vermilion-atelier.webp"],
  ["optimized/emarket247-bridal-occasion-editorial.webp", "assets/editorial/emarket247-bridal-occasion-editorial.webp"],
  ["optimized/emarket247-gifting-puja-editorial.webp", "assets/editorial/emarket247-gifting-puja-editorial.webp"],
];

const replacements = new Map([
  ["/manus-storage/emarket247-logo-transparent_c0ae1043.png", "/assets/brand/emarket247-logo-transparent.png"],
  ["/manus-storage/emarket247-favicon-master_f1c1f72c.png", "/assets/brand/emarket247-favicon-master.png"],
  ["/manus-storage/emarket247-hero-vermilion-atelier_4b6b7b63.jpg", "/assets/editorial/emarket247-hero-vermilion-atelier.webp"],
  ["/manus-storage/emarket247-bridal-occasion-editorial_ed91364d.jpg", "/assets/editorial/emarket247-bridal-occasion-editorial.webp"],
  ["/manus-storage/emarket247-gifting-puja-editorial_9dd55897.jpg", "/assets/editorial/emarket247-gifting-puja-editorial.webp"],
]);

async function rewriteAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await rewriteAssets(target);
    if (entry.isFile() && /\.(?:html|js|css|xml|txt)$/i.test(entry.name)) {
      let content = await readFile(target, "utf8");
      for (const [from, to] of replacements) content = content.replaceAll(from, to);
      await writeFile(target, content, "utf8");
    }
  }
}

await rm(outputDir, { recursive: true, force: true });
await cp(buildDir, outputDir, { recursive: true });

for (const [sourceName, destinationRelative] of assetCopies) {
  const source = path.join(staticDir, sourceName);
  const destination = path.join(outputDir, destinationRelative);
  await stat(source);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
}

await rewriteAssets(outputDir);
await writeFile(path.join(outputDir, "HOSTINGER_UPLOAD.md"), `# eMarket247 Hostinger Upload\n\nUpload the **contents** of this folder, not the folder itself, into the website domain's \`public_html\` directory through Hostinger File Manager.\n\nThe package contains a static single-page storefront, a \`.htaccess\` fallback for browser routes, the approved eMarket247 brand assets, and the generated editorial campaign assets.\n\nBefore publishing a live commerce experience, complete product mapping, prices, payment, delivery, newsletter, and policy configuration through secure approved services. Do not upload merchant secrets or customer data files to this folder.\n`, "utf8");

console.log(`Hostinger package created: ${outputDir}`);

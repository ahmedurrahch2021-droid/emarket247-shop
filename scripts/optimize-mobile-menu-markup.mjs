import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const staticSite = path.join(projectRoot, 'static-site');

async function getHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const htmlFiles = await getHtmlFiles(staticSite);
  console.log(`Found ${htmlFiles.length} HTML files to inspect and optimize for mobile menu.`);

  let updatedCount = 0;

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');
    const original = content;

    // 1. Optimize hamburger button structure with .menu-hamburger wrapper and aria-label
    // English
    content = content.replace(
      /<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span><\/span><span><\/span><span><\/span><b>Menu<\/b><\/button>/g,
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu" aria-label="Toggle navigation menu"><span class="menu-hamburger" aria-hidden="true"><span></span><span></span><span></span></span><b>Menu</b></button>'
    );
    // Bengali
    content = content.replace(
      /<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span><\/span><span><\/span><span><\/span><b>মেনু<\/b><\/button>/g,
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu" aria-label="নেভিগেশন মেনু খুলুন"><span class="menu-hamburger" aria-hidden="true"><span></span><span></span><span></span></span><b>মেনু</b></button>'
    );

    // 2. Submenu toggle buttons with clear accessible toggle icons
    // English Categories
    content = content.replace(
      /<button type="button" aria-expanded="false">Categories<\/button>/g,
      '<button type="button" aria-expanded="false" aria-haspopup="true"><span>Categories</span><span class="submenu-toggle-icon" aria-hidden="true"><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.75L6 6.25L10.5 1.75"/></svg></span></button>'
    );
    // English Occasion
    content = content.replace(
      /<button type="button" aria-expanded="false">Occasion<\/button>/g,
      '<button type="button" aria-expanded="false" aria-haspopup="true"><span>Occasion</span><span class="submenu-toggle-icon" aria-hidden="true"><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.75L6 6.25L10.5 1.75"/></svg></span></button>'
    );
    // Bengali Categories (ক্যাটাগরি)
    content = content.replace(
      /<button type="button" aria-expanded="false">ক্যাটাগরি<\/button>/g,
      '<button type="button" aria-expanded="false" aria-haspopup="true"><span>ক্যাটাগরি</span><span class="submenu-toggle-icon" aria-hidden="true"><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.75L6 6.25L10.5 1.75"/></svg></span></button>'
    );
    // Bengali Occasion (অনুষ্ঠান)
    content = content.replace(
      /<button type="button" aria-expanded="false">অনুষ্ঠান<\/button>/g,
      '<button type="button" aria-expanded="false" aria-haspopup="true"><span>অনুষ্ঠান</span><span class="submenu-toggle-icon" aria-hidden="true"><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.75L6 6.25L10.5 1.75"/></svg></span></button>'
    );

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8');
      updatedCount++;
    }
  }

  console.log(`Successfully optimized mobile menu markup in ${updatedCount} HTML files.`);
}

main().catch(console.error);

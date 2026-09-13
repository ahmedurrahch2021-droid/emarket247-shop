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
  console.log(`Found ${htmlFiles.length} HTML files to inspect and update.`);

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');
    const original = content;

    // 1. Replace Bengali transliterations of eMarket247
    // ইমার্কেট২৪৭ or ইমার্কেট ২৪৭ or ইমার্কেট
    content = content.replace(/ইমার্কেট২৪৭/g, 'eMarket247');
    content = content.replace(/ইমার্কেট ২৪৭/g, 'eMarket247');
    content = content.replace(/ইমার্কেট/g, 'eMarket247');

    // 2. In eyebrows and body headings / notes / paragraphs, ensure eMarket247 is styled with bold red brand-name
    // Avoid replacing inside HTML attributes (alt="...", href="...", content="...", id="...") or <title>, <script>
    // We can do targeted high-value replacements for known components:
    content = content.replace(/<p class="eyebrow">eMarket247\s*([A-Za-z\u0980-\u09FF\s&]*)<\/p>/g, (match, rest) => {
      const trimmedRest = rest.trim() ? ` ${rest.trim()}` : '';
      return `<p class="eyebrow"><strong class="brand-name">eMarket247</strong>${trimmedRest}</p>`;
    });

    content = content.replace(/<p class="eyebrow">Notes from eMarket247<\/p>/g, '<p class="eyebrow">Notes from <strong class="brand-name">eMarket247</strong></p>');
    content = content.replace(/<p class="eyebrow">eMarket247 থেকে নোট<\/p>/g, '<p class="eyebrow"><strong class="brand-name">eMarket247</strong> থেকে নোট</p>');

    content = content.replace(/<p>© 2026 eMarket247\. All rights reserved\.<\/p>/g, '<p>© 2026 <strong class="brand-name">eMarket247</strong>. All rights reserved.</p>');
    content = content.replace(/<p>© 2026 eMarket247\. সর্বস্বত্ব সংরক্ষিত।<\/p>/g, '<p>© 2026 <strong class="brand-name">eMarket247</strong>. সর্বস্বত্ব সংরক্ষিত।</p>');

    // In care-note and general text
    content = content.replace(/<p>eMarket247 is building a clear standard/g, '<p><strong class="brand-name">eMarket247</strong> is building a clear standard');
    content = content.replace(/<p>eMarket247 পণ্যের তথ্য/g, '<p><strong class="brand-name">eMarket247</strong> পণ্যের তথ্য');

    // Prevent double wrapping
    content = content.replace(/<strong class="brand-name"><strong class="brand-name">eMarket247<\/strong><\/strong>/g, '<strong class="brand-name">eMarket247</strong>');

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8');
      console.log(`Updated brand name in: ${path.relative(projectRoot, file)}`);
    }
  }

  // Also check catalog.bn.json if it contains Bengali brand transliteration
  const catalogBnPath = path.join(staticSite, 'assets', 'data', 'catalog.bn.json');
  try {
    let catContent = await fs.readFile(catalogBnPath, 'utf8');
    const origCat = catContent;
    catContent = catContent.replace(/ইমার্কেট২৪৭/g, 'eMarket247');
    catContent = catContent.replace(/ইমার্কেট ২৪৭/g, 'eMarket247');
    catContent = catContent.replace(/ইমার্কেট/g, 'eMarket247');
    if (catContent !== origCat) {
      await fs.writeFile(catalogBnPath, catContent, 'utf8');
      console.log('Updated brand name in catalog.bn.json');
    }
  } catch (err) {
    console.warn('Could not update catalog.bn.json:', err.message);
  }
}

main().catch(console.error);

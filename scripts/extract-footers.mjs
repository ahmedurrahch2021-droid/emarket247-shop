import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const enIndex = path.join(root, 'public_html/en/index.html');
const bnIndex = path.join(root, 'public_html/bn/index.html');

function extractFooter(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const m = html.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/);
  return m ? m[0] : null;
}

const enFooter = extractFooter(enIndex);
const bnFooter = extractFooter(bnIndex);

console.log('=== EN FOOTER ===');
console.log(enFooter || 'NOT FOUND');
console.log('\n=== BN FOOTER ===');
console.log(bnFooter || 'NOT FOUND');

// Save both for inspection
fs.writeFileSync(path.join(__dirname, 'en-footer.txt'), enFooter || '', 'utf8');
fs.writeFileSync(path.join(__dirname, 'bn-footer.txt'), bnFooter || '', 'utf8');
console.log('\nSaved to scripts/en-footer.txt and scripts/bn-footer.txt');

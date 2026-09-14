import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public_html');

function gitShow(branch, file) {
  try {
    const cmd = `git -C "${root}" show ${branch}:${file}`;
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return null;
  }
}

function inspect(html, relPath) {
  if (!html) return { file: relPath, status: 'MISSING' };
  const bodyAttrs = (html.match(/<body[^>]*>/) || [''])[0];
  const cssLinks = [...html.matchAll(/<link[^>]*href="([^"]*\.css[^\"]*)"[^>]*>/g)].map(m => m[1]);
  const hasNewsletter = html.includes('class="newsletter"');
  const hasOldFooter = /class="footer-inner"|class="footer-main wrap"|class="footer-main">|class="footer-bottom">/.test(html);
  const fabricatedPrice = /৳\s*\d{2,}/.test(html);
  return { file: relPath, bodyAttrs, cssLinks, hasNewsletter, hasOldFooter, fabricatedPrice };
}

const checks = [
  // [gitPath, displayName]
  ['public_html/en/guides/glossary/index.html', 'glossary EN (old branch)'],
  ['public_html/bn/guides/glossary/index.html', 'glossary BN (old branch)'],
  ['public_html/en/occasions/puja/index.html', 'puja EN (master)'],
  ['public_html/bn/occasions/puja/index.html', 'puja BN (master)'],
];

console.log('=== Page quality audit ===\n');
for (const [gitPath, label] of checks) {
  const masterHtml = fs.existsSync(path.join(root, gitPath)) ? fs.readFileSync(path.join(root, gitPath), 'utf8') : null;
  const branchHtml = gitShow('claude/upbeat-hermann-1d51a2', gitPath);
  
  const src = masterHtml ? 'master' : (branchHtml ? 'old-branch' : 'MISSING');
  const info = inspect(masterHtml || branchHtml, label);
  console.log(`[${src.toUpperCase()}] ${label}`);
  console.log(`  Body attrs:  ${info.bodyAttrs}`);
  console.log(`  CSS links:   ${info.cssLinks.join(' | ')}`);
  console.log(`  Newsletter:  ${info.hasNewsletter}`);
  console.log(`  Old footer:  ${info.hasOldFooter}`);
  console.log(`  ❌ Fabricated price: ${info.fabricatedPrice}`);
  console.log('');
}

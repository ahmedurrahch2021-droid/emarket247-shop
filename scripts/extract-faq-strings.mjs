#!/usr/bin/env node
/** extract-faq-strings.mjs — read exact FAQ text from a BN PDP and print it */
import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', 'public_html');
const sample = join(ROOT, 'bn', 'products', 'emarket247-bangles-17', 'index.html');
const html = readFileSync(sample, 'utf8');

// Find the FAQ accordion content: find id="pdp-faq" then read until </details>
const faqStart = html.indexOf('id="pdp-faq"');
if (faqStart === -1) { console.error('pdp-faq not found'); process.exit(1); }
const contentStart = html.indexOf('<div class="pdp-accordion-content">', faqStart);
const contentEnd = html.indexOf('</div>', contentStart) + 6; // include </div>
const oldBlock = html.substring(contentStart, contentEnd);

// Print it so we can see the exact text
console.log('=== BN OLD BLOCK ===');
console.log(oldBlock);
console.log('=== HEX of inner text ===');
const inner = oldBlock.match(/<p>(.*?)<\/p>/s)?.[1] || '';
const buf = Buffer.from(inner, 'utf8');
console.log(Buffer.from(buf).toString('hex'));
console.log('Length:', inner.length);

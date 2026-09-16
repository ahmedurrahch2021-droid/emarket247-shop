import { readFileSync } from 'node:fs';
const content = readFileSync('public_html/assets/js/site.js', 'utf8');

// 1. Check all WhatsApp URLs use the same number
const waNumbers = [...content.matchAll(/wa\.me\/(\d+)/g)].map(m => m[1]);
const uniqueNums = [...new Set(waNumbers)];
console.log('WhatsApp numbers found:', uniqueNums);
console.log('All same:', uniqueNums.length === 1 ? '✅ YES' : '❌ MISMATCH: ' + uniqueNums.join(', '));

// 2. Check emk_bag is used everywhere consistently
const bagKeys = [...content.matchAll(/emk_bag/g)].length;
console.log('\nemk_bag references:', bagKeys);

// 3. Check BAG_KEY definition
const bagKeyMatch = content.match(/const BAG_KEY = "([^"]+)"/);
console.log('BAG_KEY:', bagKeyMatch ? bagKeyMatch[1] : 'NOT FOUND');

// 4. Check localStorage read/write consistency
const lsGets = [...content.matchAll(/localStorage\.getItem\(([^)]+)\)/g)].map(m => m[1]);
const lsSets = [...content.matchAll(/localStorage\.setItem\(([^)]+)/g)].map(m => m[1]);
const lsKeys = [...new Set([...lsGets, ...lsSets])];
console.log('\nlocalStorage keys used:', lsKeys.join(', '));

// 5. Check if there's any hardcoded 88017... number
const hardcodedWa = content.match(/880\d{7,}/);
console.log('\nHardcoded WA number (non-url):', hardcodedWa ? hardcodedWa[0] : 'none');

// 6. Check WhatsApp checkout in cart page
const cartWa = content.match(/wa\.me.*?encodeURIComponent\(waText\)/g);
console.log('\nWhatsApp checkout calls:', cartWa ? cartWa.length : 0);

// 7. Check WhatsApp number across all pages - utility bars
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const walk = (d, skip=['api','admin','assets','scripts','node_modules','static-site']) => {
  let r=[];
  for(const e of readdirSync(d, {withFileTypes:true})) {
    const f=path.join(d,e.name);
    if(e.isDirectory() && !skip.includes(e.name)) r.push(...walk(f,skip));
    else if(e.name==='index.html') r.push(f);
  }
  return r;
};
const pages = walk('public_html');
const waUtilityBars = [];
for(const p of pages) {
  const h = readFileSync(p, 'utf8');
  const m = h.match(/wa\.me\/(\d+)/);
  if(m) waUtilityBars.push({page: path.relative('public_html',p), num: m[1]});
}
const utilNums = [...new Set(waUtilityBars.map(x=>x.num))];
console.log('\nWA numbers in pages:', utilNums);
if(utilNums.length > 1) {
  console.log('MISMATCH! Files:', waUtilityBars.filter(x=>x.num!==utilNums[0]).map(x=>x.page));
} else {
  console.log('✅ All consistent:', utilNums[0]);
}

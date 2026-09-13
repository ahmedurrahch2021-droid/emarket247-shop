import { readFileSync } from 'fs';
const html = readFileSync('public_html/en/categories/bangles/index.html', 'utf8');

const fullNavPattern = /(<div class="nav-header">)\s*(<button class="menu-toggle"[^>]*><span><\/span><span><\/span><span><\/span><b>Menu<\/b><\/button>)(\s*<nav id="main-menu"[\s\S]*?<\/nav>\s*<\/div>)/g;

let matchCount = 0;
let result = html.replace(fullNavPattern, (_match, navOpen, hamburger, navRest) => {
  matchCount++;
  const replacement = navOpen + `
    <div class="mobile-nav-bar">
      <div class="header-icons mobile-header-icons">
        <div class="test-icon">icons here</div>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="menu-hamburger"><span></span><span></span><span></span></span><b>Menu</b></button>
    </div>` + hamburger + navRest;

  console.log(`Match #${matchCount}`);
  console.log('  navOpen:', JSON.stringify(navOpen.trim()));
  console.log('  hamburger (first 50):', JSON.stringify(hamburger.substring(0, 50)));
  console.log('  hamburger includes menu-hamburger:', hamburger.includes('menu-hamburger'));
  console.log('  navRest (last 50):', JSON.stringify(navRest.slice(-50)));
  console.log('  Replacement includes OLD hamburger:', replacement.includes('<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span></span><span></span><span></span><b>Menu</b></button>'));
  return replacement;
});

console.log('\nTotal matches:', matchCount);
const hamburgerCount = (result.match(/<button class="menu-toggle"/g) || []).length;
console.log('Hamburger buttons in result:', hamburgerCount);

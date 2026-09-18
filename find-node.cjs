const fs = require('fs');
const content = fs.readFileSync('public_html/assets/css/site.css', 'utf8');
const idx = content.indexOf('.button{display:inline-flex');
const idx2 = content.indexOf('.catalog-controls{');
console.log('.button at:', idx);
console.log('.catalog-controls at:', idx2);
if (idx >= 0) console.log('Context:', content.substring(Math.max(0,idx-20), idx+280));
if (idx2 >= 0) console.log('Catalog:', content.substring(idx2, idx2+50));

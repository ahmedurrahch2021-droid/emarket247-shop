const fs = require('fs');
const content = fs.readFileSync('public_html/assets/css/site.css', 'utf8');
const idx = content.indexOf('.button{display:inline-flex;gap:15px');
console.log('Found at index:', idx);
console.log('Context:', content.substring(Math.max(0, idx - 100), idx + 200));

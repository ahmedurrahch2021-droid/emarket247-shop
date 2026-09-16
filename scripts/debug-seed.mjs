import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SEED_SQL = join(__dirname, '..', 'database', 'seed_products.sql');
const sql = readFileSync(SEED_SQL, 'utf8');

// Find VALUES block
const valMatch = sql.match(/VALUES\s*([\s\S]*?);/);
if (!valMatch) {
  console.error('No VALUES block found');
  process.exit(1);
}
console.log('VALUES block found, length:', valMatch[1].length);
console.log('First 200 chars:', valMatch[1].slice(0, 200));

// Try splitting on ),(
const rows = valMatch[1].match(/\),\s*\(/g);
console.log('\nRow separators found:', rows ? rows.length : 0);

// Try splitting differently
const allRows = valMatch[1].split(/\)\s*,\s*\(/);
console.log('Rows split:', allRows.length);
if (allRows.length > 0) {
  console.log('First row snippet:', allRows[0].slice(0, 120));
}

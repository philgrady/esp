import fs from 'node:fs';
import path from 'node:path';
import xlsx from 'xlsx';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const outputPath = path.join(root, 'src/data/products.json');

const csvPath = path.join(dataDir, 'products.csv');
const xlsxPath = path.join(dataDir, 'products.xlsx');

const sourcePath = fs.existsSync(xlsxPath) ? xlsxPath : csvPath;

if (!fs.existsSync(sourcePath)) {
  throw new Error('Missing products.csv or products.xlsx in /data.');
}

const workbook = xlsx.readFile(sourcePath);
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(firstSheet, { defval: '' });

const toBool = (value) => String(value).toLowerCase() === 'true' || value === 1 || String(value).toLowerCase() === 'yes';

const products = rows
  .map((row) => ({
    sku: String(row.sku).trim(),
    slug: String(row.slug).trim(),
    title: String(row.title).trim(),
    short_description: String(row.short_description).trim(),
    full_description: String(row.full_description).trim(),
    category: String(row.category).trim(),
    subcategory: String(row.subcategory).trim(),
    price_gbp: Number(row.price_gbp || 0),
    sale_price_gbp: row.sale_price_gbp === '' ? null : Number(row.sale_price_gbp),
    stripe_price_id: String(row.stripe_price_id).trim(),
    image_1: String(row.image_1).trim(),
    image_2: String(row.image_2).trim(),
    image_3: String(row.image_3).trim(),
    stock_status: String(row.stock_status).trim(),
    lead_time: String(row.lead_time).trim(),
    vat_rate: Number(row.vat_rate || 20),
    weight: Number(row.weight || 0),
    meta_title: String(row.meta_title).trim(),
    meta_description: String(row.meta_description).trim(),
    canonical_url: String(row.canonical_url).trim(),
    status: String(row.status).trim(),
    featured: toBool(row.featured),
    sort_order: Number(row.sort_order || 0)
  }))
  .filter((product) => product.status === 'active' && product.slug && product.stripe_price_id)
  .sort((a, b) => a.sort_order - b.sort_order);

fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Converted ${products.length} products from ${path.basename(sourcePath)} -> src/data/products.json`);

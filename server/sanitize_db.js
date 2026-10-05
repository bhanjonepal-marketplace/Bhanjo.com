import db from './db.js';

function stripChinese(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\s*\([\u4e00-\u9fa5\s/,-]+\)/g, '') // remove (纳帕纹环保皮)
    .replace(/[\u4e00-\u9fa5]+/g, '')             // remove remaining Chinese chars
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanProduct(p) {
  // 1. Clean Title if it mentions 1688 or Chinese characters
  if (p.title) {
    p.title = stripChinese(p.title)
      .replace(/\b1688\b\.com?/gi, '')
      .replace(/1688/g, '')
      .replace(/Factory Direct/gi, 'Global Direct')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  if (p.nepaliTitle) {
    p.nepaliTitle = stripChinese(p.nepaliTitle)
      .replace(/\b1688\b\.com?/gi, '')
      .replace(/1688/g, '')
      .replace(/Factory Direct/gi, 'Global Direct')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // 2. Clean Description
  if (p.description) {
    let lines = p.description.split('\n');
    let inForbiddenSection = false;
    let newLines = [];

    for (let line of lines) {
      const trimmed = line.trim();

      // Check section headers for distributor/factory intel
      if (/(FACTORY\s*&\s*SOURCING\s*DETAILS|MANUFACTURING\s*&\s*SUPPLIER\s*DETAILS)/i.test(trimmed)) {
        inForbiddenSection = true;
        continue;
      }
      if (/^(OVERVIEW\s*&\s*SPECIFICATIONS|LOGISTICS\s*&\s*DELIVERY|CUSTOMIZATION)/i.test(trimmed)) {
        inForbiddenSection = false;
      }

      if (inForbiddenSection) continue;

      // Skip lines with 1688, distributor, manufacturer, supplier, wholesale margin, or factory pricing
      if (/\b1688\b/i.test(line)) continue;
      if (/(distributor|manufactur|supplier|factory direct sku|verified direct|audited supplier|super factory)/i.test(line)) continue;
      if (/([¥￥]|RMB|Factory Base Price|Original Factory Price|Direct Sourcing Margin|Wholesale Tier Discounts)/i.test(line)) continue;
      if (/[\u4e00-\u9fa5]/.test(line)) continue; // Any line with Chinese distributor names or characters
      if (/(个体工商户|工作室|阿里巴巴|源头工厂|箱包厂|制造厂)/.test(line)) continue;

      // Clean up headers and text
      line = line.replace(/### Factory Direct/gi, '### Bhanjo Global Direct');
      line = line.replace(/Official (1688\.com|Global Direct\.com) Factory Direct SKU:/gi, 'Bhanjo Global Direct Quality SKU:');
      line = line.replace(/1688 Trade Escrow Guaranteed/gi, 'Bhanjo 100% Safe Delivery & Quality Guarantee');
      line = line.replace(/1688 Buyer Protection Guaranteed/gi, 'Bhanjo 100% Quality & Buyer Protection Guarantee');
      line = line.replace(/Guaranteed factory direct/gi, 'Guaranteed premium export');
      line = line.replace(/\(Global Direct Factory Direct\)/gi, '');
      line = line.replace(/\(Factory SKU #\d+\)/gi, '');
      line = stripChinese(line);

      if (line.trim()) {
        newLines.push(line);
      }
    }

    let cleanedDesc = newLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!cleanedDesc || cleanedDesc.length < 35 || !cleanedDesc.includes('OVERVIEW')) {
      cleanedDesc = `### Bhanjo Global Direct: ${p.title}

OVERVIEW & SPECIFICATIONS:
• Quality Standard: Audited Premium Export Standard
• Buyer Protection: Bhanjo 100% Safe Delivery & Quality Guarantee
• Door-to-Door Delivery: Handled directly to Kathmandu Hub & all Nepal Provinces
• Estimated Courier Lead Time: 6-10 Days Express Delivery`;
    }
    p.description = cleanedDesc;
  }

  // 3. Clean Specs
  if (p.specs && typeof p.specs === 'object') {
    const cleanedSpecs = {};
    const forbiddenKeyRegex = /(1688|source platform|factory price|base price|manufacturer|manufactur|distributor|supplier|store link|factory verification|production hub|wholesale moq)/i;

    for (let [k, v] of Object.entries(p.specs)) {
      if (forbiddenKeyRegex.test(k)) continue;

      // Rename Factory SKU to SKU Code
      if (/Factory SKU/i.test(k)) {
        k = 'SKU Code';
      }

      if (typeof v === 'string') {
        if (/\b1688\b/i.test(v)) continue;
        if (/([¥￥]|RMB)/.test(v)) continue;
        if (/(distributor|manufactur|super factory|个体工商户|工作室|阿里巴巴|源头工厂)/i.test(v)) continue;

        let cleanVal = stripChinese(v);
        if (!cleanVal) continue;

        if (/escrow protection/i.test(k)) {
          cleanVal = 'Bhanjo 100% Safe Delivery & Quality Guarantee';
        }
        if (/quality standard/i.test(k) && /1688/i.test(cleanVal)) {
          cleanVal = 'Audited Export Standard (CE / GB/T / ISO)';
        }
        cleanedSpecs[k] = cleanVal;
      } else {
        cleanedSpecs[k] = v;
      }
    }
    p.specs = cleanedSpecs;
  }

  // 4. Clean root metadata
  delete p.distributorName;
  delete p.distributorNameZh;
  delete p.distributorShopId;
  delete p.distributorUrl;
  delete p.distributorLocation;
  delete p.supplierZh;
  delete p.titleZh;
  delete p.chineseTitle;
  delete p.original1688PriceRMB;
  delete p.priceRMB;

  p.supplier = 'Bhanjo Global Direct';
  p.supplierName = 'Bhanjo Global Direct';
  p.source = 'Bhanjo Global Direct';
  if (p.platform === '1688') {
    p.platform = 'Bhanjo Global';
  }

  return p;
}

// Update all products in database
const all = db.prepare('SELECT id, data_json FROM products').all();
let updatedCount = 0;

const updateStmt = db.prepare('UPDATE products SET data_json = ? WHERE id = ?');

for (const row of all) {
  const p = JSON.parse(row.data_json);
  const cleaned = cleanProduct(p);
  updateStmt.run(JSON.stringify(cleaned), row.id);
  updatedCount++;
}

console.log(`Successfully sanitized ${updatedCount} products in SQLite database!`);

// Test XM8048 handbag product
const checkBag = db.prepare("SELECT data_json FROM products WHERE data_json LIKE '%XM8048%' LIMIT 1").get();
if (checkBag) {
  const bag = JSON.parse(checkBag.data_json);
  console.log('\n=== SANITIZED XM8048 DESC ===\n', bag.description);
  console.log('\n=== SANITIZED XM8048 SPECS ===\n', JSON.stringify(bag.specs, null, 2));
}

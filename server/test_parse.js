import fs from 'fs';

const html = fs.readFileSync('server/real_product.html', 'utf8');

// 1. LD+JSON
const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
if (ldJsonMatch) {
  try {
    const data = JSON.parse(ldJsonMatch[1].trim());
    console.log('LD+JSON parsed keys:', Object.keys(data[0] || data));
    const prod = Array.isArray(data) ? data[0] : data;
    console.log('Name:', prod.name);
    console.log('Images count:', prod.image?.length);
    console.log('Images:', prod.image);
    console.log('Offers:', prod.offers);
    console.log('Brand/Supplier:', prod.brand);
  } catch (e) {
    console.log('JSON parse err:', e.message);
  }
}

// 2. Window data or other scripts
const detailDataMatch = html.match(/window\.detailData\s*=\s*({[\s\S]*?});/);
console.log('window.detailData found?', !!detailDataMatch);

// 3. Search for price patterns
const priceMatches = html.match(/(\$[0-9]+(?:\.[0-9]{1,2})?)/g);
console.log('Sample prices in page:', [...new Set(priceMatches || [])].slice(0, 5));

// 4. Breadcrumb or Category keywords
const breadcrumbMatch = html.match(/class="[^"]*breadcrumb[^"]*"[\s\S]*?<\/div>/i);
console.log('Breadcrumbs found?', !!breadcrumbMatch);
if (breadcrumbMatch) {
  console.log('Breadcrumb:', breadcrumbMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

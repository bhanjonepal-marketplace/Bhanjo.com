import { parseAlibabaUrl } from './alibabaEngine.js';

async function testMultiple() {
  const url2 = 'https://www.alibaba.com/product-detail/Custom-Zip-up-Spider-Hoodie-Oversize_1600972451127.html';
  const p2 = await parseAlibabaUrl(url2);
  console.log('--- Product 2 (Spider Hoodie) ---');
  console.log('Title:', p2.title);
  console.log('Category:', p2.categoryId, '(', p2.categoryName, ')');
  console.log('Images count:', p2.images?.length);
  console.log('Original: $' + p2.originalAlibabaPrice, '-> 3x Price: $' + p2.samplePrice);
  console.log('Supplier:', p2.supplierName);

  // Test electronics URL slug simulation
  const urlElectronics = 'https://www.alibaba.com/product-detail/TWS-Bluetooth-5-4-Wireless-Earbuds-Active-Noise-Cancelling_1600999888.html';
  const p3 = await parseAlibabaUrl(urlElectronics);
  console.log('--- Product 3 (Electronics) ---');
  console.log('Title:', p3.title);
  console.log('Category:', p3.categoryId, '(', p3.categoryName, ')');
  console.log('Original: $' + p3.originalAlibabaPrice, '-> 3x Price: $' + p3.samplePrice);

  // Test lighting URL
  const urlLighting = 'https://www.alibaba.com/product-detail/Waterproof-Outdoor-Solar-LED-Street-Light-300W_1600777666.html';
  const p4 = await parseAlibabaUrl(urlLighting);
  console.log('--- Product 4 (Lighting) ---');
  console.log('Title:', p4.title);
  console.log('Category:', p4.categoryId, '(', p4.categoryName, ')');
  console.log('Original: $' + p4.originalAlibabaPrice, '-> 3x Price: $' + p4.samplePrice);
}

testMultiple();

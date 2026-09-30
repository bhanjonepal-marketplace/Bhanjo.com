import fs from 'fs';

async function testSecondUrl() {
  const url = 'https://www.alibaba.com/product-detail/Custom-Zip-up-Spider-Hoodie-Oversize_1600972451127.html';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Dest': 'document'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (ldJsonMatch) {
    const data = JSON.parse(ldJsonMatch[1].trim());
    const prod = Array.isArray(data) ? data[0] : data;
    console.log('Name:', prod.name);
    console.log('Images:', prod.image?.length, prod.image?.[0]);
    console.log('Price:', prod.offers?.price);
    console.log('Supplier:', prod.brand?.name);
  }
}

testSecondUrl();

import fs from 'fs';

async function test() {
  const url = 'https://www.alibaba.com/trade/search?fsb=y&IndexArea=product_en&CatId=&SearchText=hoodie';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const text = await res.text();
  console.log('Title:', text.match(/<title>(.*?)<\/title>/i)?.[1]);
  // Write 5000 characters around any json or keywords
  fs.writeFileSync('server/alibaba_sample.html', text);
  console.log('Saved alibaba_sample.html, size:', text.length);
}

test();

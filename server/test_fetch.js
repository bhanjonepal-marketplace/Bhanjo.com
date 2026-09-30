import fs from 'fs';

async function testRealAlibabaUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    console.log('Status for', url, '->', res.status);
    const html = await res.text();
    fs.writeFileSync('server/real_product.html', html);
    console.log('Saved real_product.html, length:', html.length);
    
    // Parse title, images, specifications, price
    const ogTitle = html.match(/property=["']og:title["'] content=["']([^"']+)["']/i)?.[1];
    const ogDesc = html.match(/property=["']og:description["'] content=["']([^"']+)["']/i)?.[1];
    const ogImage = html.match(/property=["']og:image["'] content=["']([^"']+)["']/i)?.[1];
    
    console.log('og:title:', ogTitle);
    console.log('og:desc:', ogDesc);
    console.log('og:image:', ogImage);

    // Look for ld+json
    const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    if (ldJsonMatch) {
      console.log('Found ld+json:', ldJsonMatch[1].slice(0, 400));
    }
    
    // Look for alicdn images
    const alicdnImages = [...new Set(html.match(/https?:\/\/[^"'\s]+\.alicdn\.com\/[^"'\s]+(?:\.jpg|\.png|\.jpeg|\.webp)/gi) || [])];
    console.log('Alicdn images count:', alicdnImages.length);
    if (alicdnImages.length > 0) {
      console.log('First 3 alicdn images:', alicdnImages.slice(0, 3));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testRealAlibabaUrl('https://www.alibaba.com/product-detail/Hip-Hop-Distress-Vintage-Oversize-Loose_1601836403827.html');

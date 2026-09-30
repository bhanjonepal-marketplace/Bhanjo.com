async function getCategories() {
  const res = await fetch('https://www.alibaba.com', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await res.text();
  const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const s of scripts) {
    if (s.includes('Consumer Electronics') && s.includes('Home & Garden') && s.includes('Kitchenware')) {
      console.log('Found script with full category hierarchy! Length:', s.length);
      // Try to extract JSON object
      const jsonMatch = s.match(/(\{[\s\S]*"Consumer Electronics"[\s\S]*\})/);
      if (jsonMatch) {
        console.log('JSON match found, length:', jsonMatch[1].length);
      }
    }
  }
}
getCategories();

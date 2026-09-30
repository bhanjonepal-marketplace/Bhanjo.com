import { parseGlobalSourcingUrl, parse1688Url } from './alibabaEngine.js';

async function run() {
  const tests = [
    { name: '1688 Bag with tracking params', url: 'https://detail.1688.com/offer/1060516634917.html?spm=a261y.7663282.sameProduct.3.356e788683gSge' },
    { name: '1688 Bag with Chinese share text', url: '【韩版纯色女包单肩腋下包】https://detail.1688.com/offer/1060516634917.html' },
    { name: '1688 Random Offer A', url: 'https://detail.1688.com/offer/712883921920.html' },
    { name: '1688 Random Offer B', url: 'https://detail.1688.com/offer/829104821039.html?item=sneakers' },
    { name: '1688 Random Offer C', url: 'https://detail.1688.com/offer/654817293812.html' }
  ];

  for (const t of tests) {
    console.log(`\n--- Test: ${t.name} ---`);
    const p = await parseGlobalSourcingUrl(t.url);
    console.log({
      id: p.id,
      title: p.title,
      category: p.categoryName,
      priceUSD: p.samplePrice,
      priceNPR: p.priceNPR,
      originalRMB: p.original1688PriceRMB,
      imagesCount: p.images.length,
      firstImage: p.images[0]?.slice(0, 70)
    });
  }
}

run();

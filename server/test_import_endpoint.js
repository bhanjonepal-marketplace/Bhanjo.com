async function testImport() {
  const urls = [
    'https://detail.1688.com/offer/1060516634917.html?spm=a261y.7663282.sameProduct.3.356e788683gSge',
    'https://detail.1688.com/offer/712883921920.html',
    'https://detail.1688.com/offer/829104821039.html?item=sneakers',
    'https://detail.1688.com/offer/654817293812.html'
  ];

  for (const u of urls) {
    try {
      console.log('\nImporting:', u);
      const res = await fetch('http://127.0.0.1:5000/api/alibaba/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: u, markupPercent: 200 })
      });
      const data = await res.json();
      console.log('Result status:', res.status, 'success:', data.success);
      console.log('Product:', {
        id: data.product?.id,
        title: data.product?.title?.slice(0, 45),
        category: data.product?.categoryName,
        priceUSD: data.product?.samplePrice,
        priceNPR: data.product?.priceNPR,
        imagesCount: data.product?.images?.length
      });
    } catch (e) {
      console.error('Import error:', e.message);
    }
  }
}

testImport();

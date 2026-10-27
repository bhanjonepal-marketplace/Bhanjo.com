import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function processNewLogo() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const sourcePath = 'C:/Users/prash/.gemini/antigravity-ide/brain/26712105-9b65-4e76-a3ff-5a0ac5d58fb1/.user_uploaded/media_1792327756600.png';
  const base64 = fs.readFileSync(sourcePath).toString('base64');
  
  const results = await page.evaluate(async (b64) => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const srcC = document.createElement('canvas');
        srcC.width = img.width;
        srcC.height = img.height;
        const srcCtx = srcC.getContext('2d');
        srcCtx.drawImage(img, 0, 0);

        const srcData = srcCtx.getImageData(0, 0, img.width, img.height).data;
        let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
        let wordMaxY = 0;

        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const r = srcData[idx], g = srcData[idx+1], b = srcData[idx+2];
            if (r < 240 || g < 240 || b < 240) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              if (y < 310 && y > wordMaxY) wordMaxY = y;
            }
          }
        }

        function createExtracted(box, padX, padY, filterMode) {
          const w = (box.maxX - box.minX + 1) + padX * 2;
          const h = (box.maxY - box.minY + 1) + padY * 2;
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');

          // Initialize with white background so unreached pixels are white, NOT black!
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);

          ctx.drawImage(
            srcC,
            box.minX, box.minY, box.maxX - box.minX + 1, box.maxY - box.minY + 1,
            padX, padY, box.maxX - box.minX + 1, box.maxY - box.minY + 1
          );

          const imgData = ctx.getImageData(0, 0, w, h);
          const d = imgData.data;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i+1], b = d[i+2];

            const deltaR = 255 - r;
            const deltaG = 255 - g;
            const deltaB = 255 - b;
            const maxDelta = Math.max(deltaR, deltaG, deltaB);

            if (maxDelta <= 14) {
              d[i+3] = 0;
            } else if (maxDelta >= 42) {
              d[i+3] = 255;
              if (filterMode === 'white') {
                d[i] = 255; d[i+1] = 255; d[i+2] = 255;
              }
            } else {
              const t = (maxDelta - 14) / (42 - 14);
              d[i+3] = Math.round(t * 255);
              if (filterMode === 'white') {
                d[i] = 255; d[i+1] = 255; d[i+2] = 255;
              } else {
                d[i] = Math.max(0, Math.min(255, Math.round(255 - (255 - r) / Math.max(t, 0.25))));
                d[i+1] = Math.max(0, Math.min(255, Math.round(255 - (255 - g) / Math.max(t, 0.25))));
                d[i+2] = Math.max(0, Math.min(255, Math.round(255 - (255 - b) / Math.max(t, 0.25))));
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          return c.toDataURL('image/png');
        }

        function createIcon(filterMode) {
          const iconW = 280;
          const iconH = 280;
          const c = document.createElement('canvas');
          c.width = iconW;
          c.height = iconH;
          const ctx = c.getContext('2d');

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, iconW, iconH);

          const sX = 68, sY = 32, sW = 265, sH = 270;
          const targetH = 240;
          const targetW = Math.round((sW / sH) * targetH);
          const offsetX = Math.round((iconW - targetW) / 2);
          const offsetY = Math.round((iconH - targetH) / 2);

          ctx.drawImage(srcC, sX, sY, sW, sH, offsetX, offsetY, targetW, targetH);
          const imgData = ctx.getImageData(0, 0, iconW, iconH);
          const d = imgData.data;

          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i+1], b = d[i+2];
            const maxDelta = Math.max(255 - r, 255 - g, 255 - b);

            if (maxDelta <= 14) {
              d[i+3] = 0;
            } else if (maxDelta >= 42) {
              d[i+3] = 255;
              if (filterMode === 'white') {
                d[i] = 255; d[i+1] = 255; d[i+2] = 255;
              }
            } else {
              const t = (maxDelta - 14) / (42 - 14);
              d[i+3] = Math.round(t * 255);
              if (filterMode === 'white') {
                d[i] = 255; d[i+1] = 255; d[i+2] = 255;
              } else {
                d[i] = Math.max(0, Math.min(255, Math.round(255 - (255 - r) / Math.max(t, 0.25))));
                d[i+1] = Math.max(0, Math.min(255, Math.round(255 - (255 - g) / Math.max(t, 0.25))));
                d[i+2] = Math.max(0, Math.min(255, Math.round(255 - (255 - b) / Math.max(t, 0.25))));
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          return c.toDataURL('image/png');
        }

        resolve({
          fullPng: createExtracted({ minX, maxX, minY, maxY }, 14, 14),
          wordmarkPng: createExtracted({ minX, maxX, minY, maxY: wordMaxY }, 12, 10),
          whiteWordmarkPng: createExtracted({ minX, maxX, minY, maxY: wordMaxY }, 12, 10, 'white'),
          iconPng: createIcon(),
          iconWhitePng: createIcon('white')
        });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, base64);

  fs.writeFileSync('C:/Bhanjo.com/client/public/bhanjo-logo.png', Buffer.from(results.fullPng.split(',')[1], 'base64'));
  fs.writeFileSync('C:/Bhanjo.com/client/public/bhanjo-logo-horizontal.png', Buffer.from(results.wordmarkPng.split(',')[1], 'base64'));
  fs.writeFileSync('C:/Bhanjo.com/client/public/bhanjo-logo-text.png', Buffer.from(results.wordmarkPng.split(',')[1], 'base64'));
  fs.writeFileSync('C:/Bhanjo.com/client/public/bhanjo-logo-white.png', Buffer.from(results.whiteWordmarkPng.split(',')[1], 'base64'));
  fs.writeFileSync('C:/Bhanjo.com/client/public/bhanjo-logo-icon.png', Buffer.from(results.iconPng.split(',')[1], 'base64'));

  await browser.close();
  console.log('🎉 Updated clean borderless logos');
}

processNewLogo().catch(err => {
  console.error(err);
  process.exit(1);
});

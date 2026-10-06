import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function processLogo() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  const imgPath = path.resolve('../client/public/bhanjo-logo.jpg');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const dataUri = 'data:image/jpeg;base64,' + imgBase64;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>body { margin: 0; background: transparent; }</style>
  </head>
  <body>
    <canvas id="mainCanvas" width="1024" height="1024"></canvas>
    <canvas id="cropCanvas"></canvas>
    <script>
      const img = new Image();
      img.onload = () => {
        const c = document.getElementById('mainCanvas');
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, 1024, 1024);
        const data = imgData.data;

        // Bounding boxes
        let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
        
        // Exact section boxes:
        // Text "भान्जो": y ~ 230 to 550
        let textMinX = 1024, textMaxX = 0, textMinY = 1024, textMaxY = 0;
        // Icon "B": y ~ 660 to 840
        let iconMinX = 1024, iconMaxX = 0, iconMinY = 1024, iconMaxY = 0;

        for (let y = 0; y < 1024; y++) {
          for (let x = 0; x < 1024; x++) {
            const idx = (y * 1024 + x) * 4;
            const brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;

            if (brightness < 235) { // dark pixel
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (y >= 200 && y <= 550) {
                if (x < textMinX) textMinX = x;
                if (x > textMaxX) textMaxX = x;
                if (y < textMinY) textMinY = y;
                if (y > textMaxY) textMaxY = y;
              } else if (y >= 650 && y <= 850) {
                if (x < iconMinX) iconMinX = x;
                if (x > iconMaxX) iconMaxX = x;
                if (y < iconMinY) iconMinY = y;
                if (y > iconMaxY) iconMaxY = y;
              }
            }
          }
        }

        window.boxes = {
          full: { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY },
          text: { minX: textMinX, maxX: textMaxX, minY: textMinY, maxY: textMaxY, w: textMaxX - textMinX, h: textMaxY - textMinY },
          icon: { minX: iconMinX, maxX: iconMaxX, minY: iconMinY, maxY: iconMaxY, w: iconMaxX - iconMinX, h: iconMaxY - iconMinY }
        };

        // Render transparent PNG
        window.cropAndMakeTransparent = (box, padding = 16, tintColor = null) => {
          const cropC = document.getElementById('cropCanvas');
          const p = padding;
          const w = box.w + p * 2;
          const h = box.h + p * 2;
          cropC.width = w;
          cropC.height = h;
          const cropCtx = cropC.getContext('2d');
          cropCtx.fillStyle = '#ffffff';
          cropCtx.fillRect(0, 0, w, h);

          cropCtx.drawImage(
            c,
            box.minX, box.minY, box.w, box.h,
            p, p, box.w, box.h
          );

          const cData = cropCtx.getImageData(0, 0, w, h);
          const pixels = cData.data;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i+1];
            const b = pixels[i+2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;

            if (luma > 240) {
              pixels[i+3] = 0; // Pure transparent
            } else if (luma < 40) {
              pixels[i+3] = 255;
              if (tintColor) {
                pixels[i] = tintColor[0];
                pixels[i+1] = tintColor[1];
                pixels[i+2] = tintColor[2];
              } else {
                pixels[i] = 17; // Clean rich dark #111827
                pixels[i+1] = 24;
                pixels[i+2] = 39;
              }
            } else {
              const alpha = Math.max(0, Math.min(255, Math.round((240 - luma) / (240 - 40) * 255)));
              pixels[i+3] = alpha;
              if (tintColor) {
                pixels[i] = tintColor[0];
                pixels[i+1] = tintColor[1];
                pixels[i+2] = tintColor[2];
              } else {
                pixels[i] = 17;
                pixels[i+1] = 24;
                pixels[i+2] = 39;
              }
            }
          }

          cropCtx.putImageData(cData, 0, 0);
          return cropC.toDataURL('image/png');
        };

        // Horizontal lockup: Icon "B" + Text "भान्जो" + optional badge
        window.createHorizontalLockup = (tintColor = null) => {
          const cropC = document.getElementById('cropCanvas');
          const textBox = window.boxes.text;
          const iconBox = window.boxes.icon;

          // Height target: 120px for razor sharp rendering
          const targetH = 120;
          const iconScale = targetH / iconBox.h;
          const iconW = Math.round(iconBox.w * iconScale);

          // Text should match optical height
          const textScale = (targetH * 0.96) / textBox.h;
          const textW = Math.round(textBox.w * textScale);
          const textH = Math.round(textBox.h * textScale);

          const gap = 20;
          const pad = 12;
          const totalW = pad + iconW + gap + textW + pad;
          const totalH = pad + targetH + pad;

          cropC.width = totalW;
          cropC.height = totalH;
          const cropCtx = cropC.getContext('2d');
          cropCtx.fillStyle = '#ffffff';
          cropCtx.fillRect(0, 0, totalW, totalH);

          // Draw icon
          cropCtx.drawImage(
            c,
            iconBox.minX, iconBox.minY, iconBox.w, iconBox.h,
            pad, pad, iconW, targetH
          );

          // Draw text vertically centered
          const textY = pad + (targetH - textH) / 2;
          cropCtx.drawImage(
            c,
            textBox.minX, textBox.minY, textBox.w, textBox.h,
            pad + iconW + gap, textY, textW, textH
          );

          const cData = cropCtx.getImageData(0, 0, totalW, totalH);
          const pixels = cData.data;

          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i+1];
            const b = pixels[i+2];
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;

            if (luma > 240) {
              pixels[i+3] = 0;
            } else if (luma < 40) {
              pixels[i+3] = 255;
              if (tintColor) {
                pixels[i] = tintColor[0];
                pixels[i+1] = tintColor[1];
                pixels[i+2] = tintColor[2];
              } else {
                pixels[i] = 17;
                pixels[i+1] = 24;
                pixels[i+2] = 39;
              }
            } else {
              const alpha = Math.max(0, Math.min(255, Math.round((240 - luma) / (240 - 40) * 255)));
              pixels[i+3] = alpha;
              if (tintColor) {
                pixels[i] = tintColor[0];
                pixels[i+1] = tintColor[1];
                pixels[i+2] = tintColor[2];
              } else {
                pixels[i] = 17;
                pixels[i+1] = 24;
                pixels[i+2] = 39;
              }
            }
          }

          cropCtx.putImageData(cData, 0, 0);
          return cropC.toDataURL('image/png');
        };

        window.isReady = true;
      };
      img.src = '${dataUri}';
    </script>
  </body>
  </html>
  `;

  await page.setContent(html);
  await page.waitForFunction('window.isReady === true');

  const boxes = await page.evaluate(() => window.boxes);
  console.log('Detected Boxes:', JSON.stringify(boxes, null, 2));

  // 1. Full clean transparent logo (original lockup)
  const fullPngUri = await page.evaluate(() => window.cropAndMakeTransparent(window.boxes.full, 16));
  fs.writeFileSync('../client/public/bhanjo-logo.png', Buffer.from(fullPngUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo.png');

  // 2. Just 'B' Monogram Icon transparent
  const iconPngUri = await page.evaluate(() => window.cropAndMakeTransparent(window.boxes.icon, 10));
  fs.writeFileSync('../client/public/bhanjo-logo-icon.png', Buffer.from(iconPngUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo-icon.png');

  // 3. Just 'भान्जो' Wordmark transparent
  const textPngUri = await page.evaluate(() => window.cropAndMakeTransparent(window.boxes.text, 10));
  fs.writeFileSync('../client/public/bhanjo-logo-text.png', Buffer.from(textPngUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo-text.png');

  // 4. Horizontal lockup (Rich Charcoal / Black #111827)
  const horizPngUri = await page.evaluate(() => window.createHorizontalLockup(null));
  fs.writeFileSync('../client/public/bhanjo-logo-horizontal.png', Buffer.from(horizPngUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo-horizontal.png');

  // 5. Horizontal lockup (Brand Orange #F85606)
  const horizOrangePngUri = await page.evaluate(() => window.createHorizontalLockup([248, 86, 6]));
  fs.writeFileSync('../client/public/bhanjo-logo-horizontal-orange.png', Buffer.from(horizOrangePngUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo-horizontal-orange.png');

  // 6. White version for dark backgrounds
  const fullWhiteUri = await page.evaluate(() => window.cropAndMakeTransparent(window.boxes.full, 16, [255, 255, 255]));
  fs.writeFileSync('../client/public/bhanjo-logo-white.png', Buffer.from(fullWhiteUri.split(',')[1], 'base64'));
  console.log('✅ Generated client/public/bhanjo-logo-white.png');

  await browser.close();
}

processLogo().catch(err => {
  console.error(err);
  process.exit(1);
});

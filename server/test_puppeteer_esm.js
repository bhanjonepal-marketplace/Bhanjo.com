import puppeteer from 'puppeteer-core';

async function test() {
  console.log('Puppeteer ESM import success:', typeof puppeteer.launch);
}
test();

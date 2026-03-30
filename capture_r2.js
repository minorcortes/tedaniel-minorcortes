const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = 'http://localhost:8081/index.html?v=' + Date.now(); // Cache busting
const outDir = '/Users/minorcorteschinchilla/.gemini/antigravity/brain/e294c4b8-57f7-4337-81da-a654a584a31f';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Captura Desktop Hero
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, 'r2-after-hero-desktop.png') });
  
  // Captura Nosotros
  await page.evaluate(() => {
    document.querySelector('#nosotros').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'r2-after-nosotros.png') });

  // Captura Daniel
  await page.evaluate(() => {
    document.querySelector('#daniel').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'r2-after-daniel.png') });

  // Captura Evento
  await page.evaluate(() => {
    document.querySelector('#evento').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'r2-after-evento.png') });

  // Captura Regalos
  await page.evaluate(() => {
    document.querySelector('#regalos').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'r2-after-regalos.png') });

  // Captura Cierre
  await page.evaluate(() => {
    document.querySelector('#cierre').scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'r2-after-cierre.png') });

  // Captura Mobile Hero
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, 'r2-after-hero-mobile.png') });
  
  await browser.close();
  console.log("Screenshots completados.");
}

capture();

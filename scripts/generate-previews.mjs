/**
 * Script: generate-previews.mjs
 * Dùng Puppeteer chụp ảnh từng template để tạo thumbnail cho template picker.
 *
 * Usage:
 *   1. Mở 1 terminal: npm run dev
 *   2. Mở terminal khác: node scripts/generate-previews.mjs
 *
 * Yêu cầu: Puppeteer (npm install -g puppeteer hoặc npx puppeteer)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public/previews');
const TEMPLATES = [
  'standard', 'executive', 'tech', 'creative', 'modern', 'timeline',
  'elegant', 'professional', 'vibrant', 'compact', 'academic',
  'gradient', 'nature', 'bold', 'sidebar', 'minimal',
];

async function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setViewport({ width: 400, height: 565 });

  for (const tmpl of TEMPLATES) {
    console.log(`[Preview] Capturing template: ${tmpl}`);
    // Mở app với query param ?preview=template-name để kích hoạt chế độ preview
    await page.goto(`http://localhost:5173/?preview=${tmpl}&hideUI=1`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Đợi CV paper render
    await page.waitForSelector('.cv-paper', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 1500)); // đợi font load

    const filePath = path.join(PUBLIC_DIR, `template-${tmpl}.webp`);
    await page.screenshot({
      path: filePath,
      type: 'webp',
      quality: 85,
      clip: await page.evaluate(() => {
        const el = document.querySelector('.cv-paper');
        if (!el) return { x: 0, y: 0, width: 400, height: 565 };
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: Math.min(rect.width, 400), height: Math.min(rect.height, 565) };
      }),
    });

    const size = fs.statSync(filePath).size;
    console.log(`[Preview] Saved ${tmpl}.webp (${(size / 1024).toFixed(1)}KB)`);
  }

  await browser.close();
  console.log('[Preview] Done — 16 screenshots generated.');
}

main().catch(console.error);

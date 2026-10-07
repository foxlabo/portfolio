// OGP 画像（public/og.png, 1200×630）を og.html から書き出す
// 使い方: npm run og
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, '../../public/og.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(dir, 'og.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out}`);

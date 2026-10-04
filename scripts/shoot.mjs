// Real-browser screenshots of every chapter at phone, tablet and desktop widths.
// Usage: node scripts/shoot.mjs [url] [widths=390,768,1440] [outDir=screenshots]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const URL_ = process.argv[2] || 'http://localhost:5180/';
const WIDTHS = (process.argv[3] || '390,768,1440').split(',').map(Number);
const OUT = process.argv[4] || 'screenshots';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// [name, selector, offset as a fraction of the viewport height, optional action]
const SHOTS = [
  ['01-hero', null, 0],
  ['02-intro', '#about', 0.05],
  ['03-elements-akasha', '#elements', 0.05, 'pin'],
  ['04-elements-vayu', '#elements', 1.25, 'pin'],
  ['05-elements-agni', '#elements', 2.5, 'pin'],
  ['06-elements-jala', '#elements', 3.75, 'pin'],
  ['07-elements-prithvi', '#elements', 4.95, 'pin'],
  ['08-homa', '.homa', 1.2, 'pin'],
  ['09-panchakarma', '.coverflow', -0.18, 'oil'],
  ['10-swarna', '.marquee', -0.25, 'swarna'],
  ['11-geriatric', '#geriatric', 0.05, 'lens'],
  ['12-yoga', '.yoga__grid', -0.1, 'yoga'],
  ['13-conditions', '#conditions', 0.0],
  ['14-contact', '#contact', 0.0],
  ['15-footer', 'footer', -0.4],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
});

for (const width of WIDTHS) {
  const mobile = width < 768;
  const height = mobile ? 844 : width < 1024 ? 1024 : 900;
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log(`  [pageerror] ${e.message.split(String.fromCharCode(10))[0]}`));
  page.on('console', (m) => { if (m.type() === 'error') console.log(`  [console] ${m.text().slice(0, 200)}`); });
  await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  if (mobile) await page.setUserAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36');
  await page.goto(URL_, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2500));
  mkdirSync(`${OUT}/${width}`, { recursive: true });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`${width}px  horizontal overflow: ${overflow}px`);

  for (const [name, sel, off, action] of SHOTS) {
    await page.evaluate(
      (sel, off, pin) => {
        let el = sel && document.querySelector(sel);
        if (el && pin) el = el.closest('.pin-spacer') || el;
        const y = el ? el.getBoundingClientRect().top + scrollY + off * innerHeight : 0;
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      },
      sel, off, action === 'pin'
    );
    await new Promise((r) => setTimeout(r, 1600));

    if (action === 'oil' && (await page.$('.cf-slide.is-front'))) {
      const box = await page.$eval('.cf-slide.is-front', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
      const [px, py] = [box.x + box.w * 0.57, box.y + box.h * 0.62];
      if (mobile) await page.touchscreen.tap(px, py);
      else for (let i = 0; i < 12; i++) await page.mouse.move(px - 30 + i * 5, py - 6 + (i % 3) * 3);
      await new Promise((r) => setTimeout(r, 700));
    }
    if (action === 'lens') {
      await page.evaluate(() => [...document.querySelectorAll('.lens-panel__chips button')][0]?.click());
      await new Promise((r) => setTimeout(r, 1200));
    }
    if (action === 'swarna') {
      const box = await page.$eval('.m-tile:nth-child(2)', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      if (mobile) await page.touchscreen.tap(box.x, box.y); else await page.mouse.move(box.x, box.y);
      await new Promise((r) => setTimeout(r, 1500));
    }
    if (action === 'yoga') {
      await page.evaluate(() => [...document.querySelectorAll('.yoga__picker button')][2]?.click());
      await new Promise((r) => setTimeout(r, 1500));
    }
    await page.screenshot({ path: `${OUT}/${width}/${name}.jpg`, type: 'jpeg', quality: 72 });
  }
  await page.close();
}
await browser.close();
console.log('saved to', OUT);

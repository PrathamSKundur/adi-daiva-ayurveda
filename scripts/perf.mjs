// Load-time check on a simulated mid-range Android phone (Lighthouse "mobile" profile:
// ~1.6 Mbps down, 150 ms RTT, 4x CPU slowdown). Run against a production build:
//   npm run build && npx vite preview --port 4180   then   node scripts/perf.mjs http://localhost:4180/
import puppeteer from 'puppeteer-core';

const URL_ = process.argv[2] || 'http://localhost:4180/';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
for (const [label, mobile] of [['phone (throttled 4G, 4x CPU)', true], ['desktop (no throttling)', false]]) {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  if (mobile) {
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const cdp = await page.createCDPSession();
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  } else {
    await page.setViewport({ width: 1440, height: 900 });
  }
  const requests = [];
  page.on('response', async (res) => {
    const len = Number(res.headers()['content-length'] || 0) || (await res.buffer().catch(() => Buffer.alloc(0))).length;
    requests.push({ url: res.url().replace(URL_, '/'), type: res.request().resourceType(), kb: len / 1024, t: Date.now() });
  });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = { t: e.startTime, el: e.element?.tagName + '.' + (e.element?.className || '') + ' ' + (e.url || '').split('/').pop() }; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const t0 = Date.now();
  await page.goto(URL_, { waitUntil: 'load', timeout: 120000 });
  const loadMs = Date.now() - t0;
  await new Promise((r) => setTimeout(r, 4000));
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return { fcp: fcp?.startTime, lcp: window.__lcp, cls: window.__cls, dcl: nav.domContentLoadedEventEnd };
  });
  const total = requests.reduce((s, r) => s + r.kb, 0);
  const byType = {};
  for (const r of requests) byType[r.type] = (byType[r.type] || 0) + r.kb;
  console.log(`\n=== ${label} ===`);
  console.log(`FCP ${Math.round(m.fcp)} ms | LCP ${Math.round(m.lcp.t)} ms (${m.lcp.el}) | CLS ${m.cls.toFixed(3)} | load event ${loadMs} ms`);
  console.log(`transferred in first view (incl. 4 s idle): ${Math.round(total)} KB  ` + Object.entries(byType).map(([k, v]) => `${k} ${Math.round(v)} KB`).join(' · '));
  for (const r of requests.sort((a, b) => b.kb - a.kb).slice(0, 12)) console.log(`  ${String(Math.round(r.kb)).padStart(5)} KB  ${r.type.padEnd(10)} ${r.url.slice(0, 90)}`);
  await page.close();
}
await browser.close();

// Renders docs/assets/og.png (1200x630 social card) with Playwright + local Chrome.
// Usage: node og.mjs   (needs playwright-core; see README)
import { chromium } from 'playwright-core';

const LEAF = 'M126 386 A260 260 0 0 1 386 126 A260 260 0 0 1 126 386 Z';
const VEIN = 'M135.19 395.19 L301.41 213.41 A2 2 0 0 0 298.59 210.59 L116.81 376.81 Z';
const html = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;background:#0D1714;color:#E6F2ED;font-family:-apple-system,'SF Pro Display',Inter,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 96px;box-sizing:border-box">
  <div style="display:flex;align-items:center;gap:22px;margin-bottom:48px">
    <svg width="72" height="72" viewBox="104 104 304 304"><defs><mask id="v"><rect width="512" height="512" fill="#000"/><path d="${LEAF}" fill="#fff"/><path d="${VEIN}" fill="#000"/></mask></defs><rect width="512" height="512" fill="#7EE2B8" mask="url(#v)"/></svg>
    <span style="font-size:64px;font-weight:680;letter-spacing:-0.045em">mintwork</span>
  </div>
  <div style="font-size:60px;font-weight:700;letter-spacing:-0.035em;line-height:1.1;max-width:900px">Developer tools you're glad you installed.</div>
  <div style="font-size:28px;color:#A3B9B1;margin-top:28px">tokenscope · honest-tests · wcag-audit-skill · agent-ready</div>
</div></body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: 'docs/assets/og.png' });
await browser.close();
console.log('wrote docs/assets/og.png');

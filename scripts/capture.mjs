import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://127.0.0.1:4173';
const OUT = path.resolve('submission/screenshots');
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

await mkdir(OUT, { recursive: true });
await mkdir('submission/architecture', { recursive: true });

const browser = await chromium.launch({
  executablePath: BRAVE,
  headless: true,
});

async function shot(page, name) {
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(OUT, name),
    fullPage: true,
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(name, 'overflow-x', overflow);
}

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await mobile.newPage();

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shot(page, 'landing-mobile.png');

const desk = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const dpage = await desk.newPage();
await dpage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shot(dpage, 'landing-desktop.png');
await desk.close();

await page.goto(`${BASE}/#/onboarding`, { waitUntil: 'networkidle' });
await shot(page, 'onboarding.png');

await page.fill('input[type="text"]', 'Ananya');
await page.getByRole('button', { name: /continue/i }).click();
await page.fill('input[type="date"]', '1998-04-12');
await page.getByRole('button', { name: /continue/i }).click();
await page.fill('input[type="time"]', '09:15');
await page.getByRole('button', { name: /continue/i }).click();
await page.getByRole('button', { name: 'Mumbai' }).click();
await page.getByRole('button', { name: /generate my cosmic profile/i }).click();
await page.waitForURL(/profile/, { timeout: 12000 });
await page.waitForTimeout(400);
await shot(page, 'profile.png');

await page.goto(`${BASE}/#/bonds`, { waitUntil: 'networkidle' });
await shot(page, 'bonds-empty.png');

await page.goto(`${BASE}/#/compatibility`, { waitUntil: 'networkidle' });
await shot(page, 'compatibility.png');

await page.fill('input[placeholder="Enter their name"]', 'Rohan');
await page.locator('input[type="date"]').fill('1996-11-03');
await page.locator('input[type="time"]').fill('14:40');
await page.fill('input[placeholder="City"]', 'Delhi');
await page.getByRole('button', { name: /reveal cosmic bond/i }).click();
await page.waitForURL(/bond-result/, { timeout: 8000 });
await page.waitForTimeout(500);
await shot(page, 'bond-result.png');

await page.goto(`${BASE}/#/bonds`, { waitUntil: 'networkidle' });
await shot(page, 'bonds-list.png');

const bondHref = await page.locator('.bond-list-item').first().getAttribute('onclick').catch(() => null);
await page.locator('.bond-list-item').first().click();
await page.waitForURL(/bond\//, { timeout: 5000 });
await shot(page, 'bond-detail.png');

await page.goto(`${BASE}/#/premium`, { waitUntil: 'networkidle' });
await shot(page, 'premium.png');

const inviteUrl = await page.evaluate(() => {
  const profile = JSON.parse(localStorage.getItem('nakshatra_user_profile'));
  const payload = {
    name: profile.birthData.name,
    date: profile.birthData.date,
    time: profile.birthData.time,
    place: profile.birthData.place,
    gender: profile.birthData.gender,
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  const token = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${location.origin}${location.pathname}#/invite/${token}`;
});

const guest = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const gpage = await guest.newPage();
await gpage.goto(inviteUrl, { waitUntil: 'networkidle' });
await shot(gpage, 'invite.png');

const sharedUrl = await page.evaluate(() => {
  const me = JSON.parse(localStorage.getItem('nakshatra_user_profile'));
  const bonds = JSON.parse(localStorage.getItem('nakshatra_bonds') || '[]');
  const other = bonds[0].profile.birthData;
  const payload = {
    a: { name: me.birthData.name, date: me.birthData.date, time: me.birthData.time, place: me.birthData.place },
    b: { name: other.name, date: other.date, time: other.time, place: other.place },
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  const token = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${location.origin}${location.pathname}#/shared/${token}`;
});
await gpage.goto(sharedUrl, { waitUntil: 'networkidle' });
await shot(gpage, 'shared-bond.png');
await guest.close();

await page.getByRole('button', { name: /start premium/i }).click();
await page.waitForTimeout(3500);
await shot(page, 'premium-active.png');

await page.goto(`${BASE}/#/report/couple`, { waitUntil: 'networkidle' });
await shot(page, 'report.png');

const tablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
const tpage = await tablet.newPage();
await tpage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shot(tpage, 'landing-tablet.png');
await tablet.close();

const wide = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const wpage = await wide.newPage();
await wpage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shot(wpage, 'landing-1920.png');
await wide.close();

await browser.close();
console.log('done', inviteUrl);
console.log('unused', bondHref);

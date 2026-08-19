import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const OUT = path.resolve('report/img');
const BRAVE = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: BRAVE,
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

async function shot(name) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log('wrote', name);
}

await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  localStorage.clear();
  sessionStorage.clear();
});
await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await shot('landing.png');
await page.screenshot({ path: path.join(OUT, 'landing-desktop.png'), fullPage: false });

await page.goto(`${BASE}/#/onboarding`, { waitUntil: 'networkidle' });
await shot('onboarding.png');

await page.fill('input[placeholder="Enter your name"]', 'Ananya');
await page.getByRole('button', { name: /continue/i }).click();
await page.fill('input[type="date"]', '1998-04-12');
await page.getByRole('button', { name: /continue/i }).click();
await page.fill('input[type="time"]', '09:15');
await page.getByRole('button', { name: /continue/i }).click();
await page.getByRole('button', { name: 'Mumbai' }).click();
await page.getByRole('button', { name: /generate my cosmic profile/i }).click();
await page.waitForURL(/profile/, { timeout: 12000 });
await page.waitForTimeout(400);
await shot('profile.png');

await page.goto(`${BASE}/#/compatibility`, { waitUntil: 'networkidle' });
await page.fill('input[placeholder="Enter their name"]', 'Rohan');
await page.locator('input[type="date"]').fill('1996-11-03');
await page.locator('input[type="time"]').fill('14:40');
await page.fill('input[placeholder="City"]', 'Delhi');
await page.getByRole('button', { name: /reveal cosmic bond/i }).click();
await page.waitForURL(/bond-result/, { timeout: 12000 });
await page.waitForTimeout(500);
await shot('bond-result.png');

const inviteUrl = await page.evaluate(() => {
  const profile = JSON.parse(localStorage.getItem('nakshatra_user_profile'));
  const payload = {
    name: profile.birthData.name,
    date: profile.birthData.date,
    time: profile.birthData.time,
    place: profile.birthData.place,
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  const token = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${location.origin}${location.pathname}#/invite/${token}`;
});

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

await page.goto(`${BASE}/#/premium`, { waitUntil: 'networkidle' });
await shot('premium.png');

const guest = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const gpage = await guest.newPage();
await gpage.goto(inviteUrl, { waitUntil: 'networkidle' });
await gpage.waitForTimeout(300);
await gpage.screenshot({ path: path.join(OUT, 'invite.png'), fullPage: false });
console.log('wrote invite.png');
await gpage.goto(sharedUrl, { waitUntil: 'networkidle' });
await gpage.waitForTimeout(300);
await gpage.screenshot({ path: path.join(OUT, 'shared-bond.png'), fullPage: false });
console.log('wrote shared-bond.png');

await browser.close();
console.log('done');

// Downscale + compress raw dashboard screenshots (from /tmp) into web-ready
// WebP assets under public/shots/. Re-run after recapturing the web UI.
//
// Capture flow (see README): seed the demo DB in the parley repo
// (`node scripts/seed-demo-db.mjs`), serve it, screenshot each page to /tmp,
// then run `node scripts/make-shots.mjs`.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('public/shots', { recursive: true });
const jobs = [
  ['/tmp/demo-dark-dashboard.png', 'dashboard-dark', 2200],
  ['/tmp/demo-light-dashboard.png', 'dashboard-light', 2200],
  ['/tmp/demo-dark-analytics.png', 'analytics-dark', 2000],
  ['/tmp/demo-light-analytics.png', 'analytics-light', 2000],
  ['/tmp/demo-dark-meetings.png', 'meetings-dark', 2000],
  ['/tmp/demo-light-meetings.png', 'meetings-light', 2000],
  ['/tmp/demo-dark-actions.png', 'actions-dark', 2000],
  ['/tmp/demo-dark-reading-vp.png', 'reading-dark', 2000],
  ['/tmp/demo-light-reading-vp.png', 'reading-light', 2000],
  ['/tmp/demo-dark-search-results.png', 'search-dark', 2000],
  ['/tmp/demo-dark-live.png', 'live-dark', 2000],
  ['/tmp/demo-dark-setup.png', 'setup-dark', 2000],
  ['/tmp/demo-dark-commands.png', 'commands-dark', 2000],
];
for (const [src, name, w] of jobs) {
  await sharp(src).resize({ width: w }).webp({ quality: 82 }).toFile(`public/shots/${name}.webp`);
  console.log('wrote', name);
}

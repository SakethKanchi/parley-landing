import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');

const bars = [
  { x: 360, hh: 22 }, { x: 384, hh: 40 }, { x: 408, hh: 62 },
  { x: 432, hh: 48 }, { x: 456, hh: 30 }, { x: 480, hh: 18 }, { x: 504, hh: 26 },
];
const barLines = bars
  .map((b) => `<line x1="${b.x}" y1="${315 - b.hh}" x2="${b.x}" y2="${315 + b.hh}" stroke="#5865F2" stroke-width="10" stroke-linecap="round"/>`)
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0B0F"/>
  <g transform="translate(0,-70)">${barLines}
    <line x1="528" y1="315" x2="600" y2="315" stroke="#23A559" stroke-width="10" stroke-linecap="round"/>
  </g>
  <text x="600" y="420" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="88" font-weight="700" fill="#E6E8EE">Parley</text>
  <text x="600" y="478" text-anchor="middle" font-family="Inter, sans-serif" font-size="30" fill="#8A90A2">Self-hosted Discord meeting notes</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(out, png);
console.log('wrote', out, png.length, 'bytes');

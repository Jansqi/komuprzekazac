// One-off utility to render public/og-default.png (1200×630).
// Re-run manually after brand/copy changes: `node scripts/generate-og-image.mjs`.
import { readFileSync } from 'fs';
import sharp from 'sharp';

const logo = readFileSync('public/logo-large.png');
const logoBase64 = `data:image/png;base64,${logo.toString('base64')}`;

// Logo is 558×120; render at 480×103 centered in a band near the top.
const LOGO_W = 480;
const LOGO_H = Math.round((LOGO_W / 558) * 120);
const LOGO_X = (1200 - LOGO_W) / 2;
const LOGO_Y = 110;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="0" y="0" width="1200" height="16" fill="#00b9fb"/>
  <rect x="0" y="614" width="1200" height="16" fill="#00b9fb"/>

  <image x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_W}" height="${LOGO_H}" href="${logoBase64}"/>

  <text x="600" y="360" text-anchor="middle"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="56" font-weight="700" fill="#1a1a1a">
    Wybierz świadomie, komu
  </text>
  <text x="600" y="430" text-anchor="middle"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="56" font-weight="700" fill="#1a1a1a">
    przekazujesz 1,5%
  </text>

  <text x="600" y="510" text-anchor="middle"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="28" font-weight="400" fill="#6b7280">
    9 671 organizacji pożytku publicznego
  </text>
  <text x="600" y="560" text-anchor="middle"
        font-family="Segoe UI, system-ui, -apple-system, sans-serif"
        font-size="28" font-weight="600" fill="#00b9fb">
    komuprzekazac.pl
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-default.png');

console.log('Wrote public/og-default.png (1200×630)');

// scripts/generate-og.mjs — run once: node scripts/generate-og.mjs
import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0A0E16"/>
  <rect x="0" y="0" width="8" height="630" fill="#4D8DFF"/>
  <text x="80" y="240" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#E8ECF4">Armando Ochoa</text>
  <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#4D8DFF">Full Stack Web3 Developer</text>
  <text x="80" y="400" font-family="Courier New, monospace" font-size="24" fill="#94A3B8">Solidity · Smart Contracts · DeFi · 7 yrs fintech</text>
  <text x="80" y="560" font-family="Courier New, monospace" font-size="20" fill="#94A3B8">armandochoa.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og-default.png');
console.log('OK public/og-default.png');

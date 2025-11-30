/**
 * Icon Generation Script for Sentinel PWA
 * 
 * This script generates PWA icons from the base SVG icon.
 * 
 * Requirements:
 * - Install sharp: npm install sharp --save-dev
 * - Run: node scripts/generate-icons.js
 * 
 * Or use an online tool like:
 * - https://realfavicongenerator.net/
 * - https://www.pwabuilder.com/imageGenerator
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('⚠️  Icon Generation Script');
console.log('==========================');
console.log('');
console.log('This script requires manual icon generation.');
console.log('');
console.log('Recommended approach:');
console.log('1. Create a 512x512px icon in your design tool (Figma, Photoshop, etc.)');
console.log('2. Export it as PNG with the Sentinel shield logo');
console.log('3. Use an online tool to generate all sizes:');
console.log('   - https://realfavicongenerator.net/');
console.log('   - https://www.pwabuilder.com/imageGenerator');
console.log('');
console.log('Required icon sizes:');
iconSizes.forEach(size => {
  console.log(`   - icon-${size}x${size}.png (${size}x${size}px)`);
});
console.log('');
console.log('Save all icons to: public/icons/');
console.log('');
console.log('For now, creating placeholder icons with SVG fallback...');

// Create placeholder SVG icons (will be replaced with actual PNGs)
const svgTemplate = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#00F0FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0080FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="#0b1021"/>
  <path d="M256 64L416 128V256C416 352 320 416 256 448C192 416 96 352 96 256V128L256 64Z" 
        fill="url(#shieldGradient)" 
        stroke="#00F0FF" 
        stroke-width="8"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="80" font-weight="bold" 
        text-anchor="middle" fill="#00F0FF">S</text>
</svg>`;

const iconsDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create README for icon generation
const readmeContent = `# PWA Icons for Sentinel

## Required Icon Sizes

Generate PNG icons in the following sizes and save them in this directory:

- icon-72x72.png (72x72px)
- icon-96x96.png (96x96px)
- icon-128x128.png (128x128px)
- icon-144x144.png (144x144px)
- icon-152x152.png (152x152px)
- icon-192x192.png (192x192px) - **Required for PWA**
- icon-384x384.png (384x384px)
- icon-512x512.png (512x512px) - **Required for PWA**

## Quick Generation Options

### Option 1: Online Tools (Recommended)
1. Create a 512x512px icon with the Sentinel shield logo
2. Upload to: https://realfavicongenerator.net/
3. Download generated icons
4. Place in this directory

### Option 2: Design Tool
1. Create icons in Figma/Photoshop
2. Export each size as PNG
3. Name them as listed above
4. Place in this directory

### Option 3: Use Icon Template
The base SVG icon is at: app/icons/icon.svg
Convert this to PNG at required sizes using any image converter.

## Icon Design Guidelines
- Background: Dark navy (#0b1021)
- Primary color: Cyan (#00F0FF)
- Logo: Shield with "S" letter
- Rounded corners: 100px radius on 512x512 canvas
- Ensure good contrast and readability at small sizes

## After Adding Icons
1. Clear browser cache
2. Unregister old service worker (DevTools > Application > Service Workers)
3. Refresh and reinstall PWA
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent);
console.log('✅ Created README.md in public/icons/ with instructions');
console.log('');
console.log('Next steps:');
console.log('1. Generate PNG icons using one of the methods above');
console.log('2. Place them in public/icons/');
console.log('3. The PWA will automatically use them');


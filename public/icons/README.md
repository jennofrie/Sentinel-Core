# PWA Icons for Sentinel

## Quick Setup Instructions

### Option 1: Generate Icons Online (Recommended - 5 minutes)

1. **Create Base Icon** (if you don't have one):
   - Use the SVG at `app/icons/icon.svg` as reference
   - Create a 512x512px PNG with the Sentinel shield logo
   - Background: Dark navy (#0b1021)
   - Logo: Cyan shield (#00F0FF)

2. **Generate All Sizes**:
   - Go to: https://realfavicongenerator.net/
   - Upload your 512x512px icon
   - Configure settings:
     - iOS: Enable "Apple touch icon"
     - Android: Enable "Android Chrome"
     - Windows: Enable "Windows Metro"
   - Download the generated package
   - Extract and copy all PNG files to this directory

3. **Rename Files** (if needed):
   - Ensure files are named: `icon-72x72.png`, `icon-96x96.png`, etc.

### Option 2: Use PWA Builder (Alternative)

1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload your 512x512px icon
3. Download generated icons
4. Place in this directory

### Option 3: Manual Creation

Create PNG icons in these sizes:
- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px) - **iOS required**
- `icon-192x192.png` (192x192px) - **Android required**
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px) - **PWA required**

## Icon Design Guidelines

- **Background**: Dark navy (#0b1021)
- **Primary Color**: Cyan (#00F0FF)
- **Logo**: Shield with "S" letter (see `app/icons/icon.svg`)
- **Rounded Corners**: 100px radius (on 512x512 canvas)
- **Padding**: Leave 10-15% padding around edges
- **Contrast**: Ensure good visibility at all sizes

## After Adding Icons

1. Clear browser cache (Ctrl+Shift+Del / Cmd+Shift+Del)
2. Open DevTools > Application > Service Workers
3. Click "Unregister" for any old service workers
4. Refresh the page
5. Reinstall PWA (Chrome: Menu > Install app)

## Testing

- **Desktop**: Chrome DevTools > Application > Manifest (should show icons)
- **Mobile**: Add to home screen, verify icon appears correctly
- **iOS**: Safari > Share > Add to Home Screen
- **Android**: Chrome > Menu > Install app

## Troubleshooting

- **Icons not showing**: Clear cache, hard refresh (Ctrl+F5)
- **Wrong icon on home screen**: Uninstall app, clear cache, reinstall
- **Icons look blurry**: Ensure PNG files are at exact pixel dimensions
- **iOS icon issues**: Use exactly 152x152px for Apple touch icon

## Current Status

⚠️ **Placeholder icons needed** - Replace with actual PNG files using one of the methods above.


# PWA Setup Guide for Sentinel

## Overview

Sentinel is now configured as a Progressive Web App (PWA), allowing users to install it on their mobile devices and tablets for a native app-like experience.

## Features Implemented

✅ **Manifest File** (`public/manifest.json`)
- App metadata and configuration
- Icon references
- Display mode (standalone)
- Theme colors

✅ **Service Worker** (`public/sw.js`)
- Offline caching
- Asset caching strategy
- Background sync (ready for future features)
- Push notifications (ready for future features)

✅ **PWA Components**
- `PWARegister.tsx` - Service worker registration
- `PWAInstallButton.tsx` - Custom install prompt

✅ **Mobile Optimizations**
- Responsive design breakpoints
- Touch-friendly tap targets
- Viewport meta tags
- Mobile-first CSS

✅ **App Icons**
- Multiple sizes for different devices
- Maskable icons support
- iOS and Android optimized

## Setup Checklist

### 1. Add App Icons

**IMPORTANT**: The app needs actual icon PNG files to work properly.

See `public/icons/README.md` for detailed instructions. Quick steps:

1. Create a 512x512px icon with the Sentinel shield logo
2. Use an online tool to generate all sizes:
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator
3. Place generated PNGs in `public/icons/`

Required sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### 2. Test Service Worker

1. Run `npm run dev`
2. Open DevTools > Application > Service Workers
3. Verify service worker is registered
4. Check "Offline" checkbox to test offline mode

### 3. Test on Mobile

#### iOS (Safari)
1. Open the app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Verify icon and launch behavior

#### Android (Chrome)
1. Open the app in Chrome
2. Tap menu (3 dots)
3. Select "Install app" or "Add to Home Screen"
4. Verify installation and launch behavior

### 4. Configure HTTPS (Production)

**IMPORTANT**: PWAs require HTTPS in production!

- Deploy to a platform that provides HTTPS (Vercel, Netlify, etc.)
- Service workers only work on HTTPS (except localhost)

## Mobile Responsiveness

### Breakpoints Used

- **Mobile**: < 768px (default styles)
- **Tablet**: 768px - 1024px (`md:` prefix)
- **Desktop**: > 1024px (`lg:` prefix)

### Mobile-Specific Features

- **Sidebar**: Collapses to icon-only on mobile
- **Hero Section**: Stacked layout on mobile, side-by-side on desktop
- **Video**: Responsive sizing with proper aspect ratio
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Text Size**: Responsive typography scaling

### Testing Mobile Layout

1. **Chrome DevTools**:
   - Open DevTools (F12)
   - Click device toolbar icon
   - Select device presets or custom dimensions

2. **Real Devices**:
   - Test on actual phones/tablets
   - Check both portrait and landscape orientations
   - Test touch interactions

## Offline Functionality

The service worker caches:
- Static assets (CSS, JS, fonts)
- Pages (/, /dashboard, /login)
- Images and icons

**Not cached**:
- API routes (`/api/*`) - Always fetch from network
- Dynamic content

## Customization

### Update App Name/Description

Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your description"
}
```

### Change Theme Color

Edit `app/layout.tsx` metadata:
```typescript
themeColor: "#00F0FF", // Your color
```

And `public/manifest.json`:
```json
{
  "theme_color": "#00F0FF"
}
```

### Modify Caching Strategy

Edit `public/sw.js` to change:
- Cache names
- Assets to cache
- Caching duration
- Update strategies

## Troubleshooting

### Service Worker Not Registering

1. Check browser console for errors
2. Verify `sw.js` is accessible at `/sw.js`
3. Check Next.js config headers for service worker
4. Clear browser cache

### Icons Not Showing

1. Verify PNG files exist in `public/icons/`
2. Check file names match manifest.json
3. Clear browser cache
4. Check manifest.json icon paths are correct

### Offline Mode Not Working

1. Verify service worker is registered
2. Check service worker cache in DevTools > Application > Cache Storage
3. Ensure assets are being cached
4. Check service worker console logs

### Install Button Not Showing

1. App must be served over HTTPS (or localhost)
2. Manifest must be valid
3. Service worker must be registered
4. User must not have already installed

### Layout Breaking on Mobile

1. Check viewport meta tag is present
2. Verify responsive breakpoints are correct
3. Test with actual device or accurate DevTools emulation
4. Check for fixed widths that don't scale

## Next Steps

- [ ] Add actual icon PNGs (see `public/icons/README.md`)
- [ ] Test on real iOS and Android devices
- [ ] Configure push notifications (optional)
- [ ] Add offline fallback pages
- [ ] Optimize service worker caching strategy

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Support

If you encounter issues:
1. Check browser console for errors
2. Review service worker logs in DevTools
3. Verify all files are in correct locations
4. Test in different browsers/devices


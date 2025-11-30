# ⚡ Netlify Quick Start Guide

## 🎯 What Has Been Done Automatically

✅ **Created Configuration Files:**
- `netlify.toml` - Netlify deployment configuration
- `.nvmrc` - Node version specification (Node 20)
- `docs/NETLIFY-DEPLOYMENT-GUIDE.md` - Full deployment guide

---

## 📋 What You Need to Do Manually

### 1️⃣ Test Local Build (5 minutes)

```powershell
npm run build
```

**If build succeeds:** ✅ You're ready to deploy!  
**If build fails:** Fix errors before deploying.

---

### 2️⃣ Commit and Push Configuration Files (2 minutes)

```powershell
git add netlify.toml .nvmrc docs/NETLIFY-DEPLOYMENT-GUIDE.md
git commit -m "chore: Add Netlify deployment configuration"
git push origin main
```

---

### 3️⃣ Deploy to Netlify (15 minutes)

#### Quick Steps:

1. **Go to**: https://app.netlify.com
2. **Click**: "Add new site" → "Import an existing project"
3. **Connect**: GitHub → Select `Sentinel-Core` repository
4. **Verify Build Settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20`
5. **Click**: "Deploy site"
6. **Wait**: 5-10 minutes for first build

---

### 4️⃣ Add Environment Variables (5 minutes)

**After first deployment:**

1. Go to: **Site settings** → **Environment variables**
2. Add:
   ```
   NEXT_PUBLIC_USE_MOCK_DATA = true
   ```
3. Click **"Save"**
4. Go to **Deploys** → **Trigger deploy** → **Clear cache and deploy**

---

### 5️⃣ Test Your Site (5 minutes)

Visit your Netlify URL (e.g., `https://your-site.netlify.app`)

**Check:**
- ✅ Landing page loads
- ✅ Video plays
- ✅ Login page works
- ✅ Dashboard loads

---

## 🔥 That's It!

Your site should now be live at: `https://your-site-name.netlify.app`

**Full detailed guide:** See `docs/NETLIFY-DEPLOYMENT-GUIDE.md`

---

## ⚠️ Common First-Time Issues

**Build Fails?**
- Check build logs in Netlify dashboard
- Ensure you tested `npm run build` locally first
- Verify all dependencies are in `package.json`

**Environment Variables Not Working?**
- Redeploy after adding variables
- Variable names are case-sensitive
- Must start with `NEXT_PUBLIC_` for client-side access

**Service Worker Not Loading?**
- HTTPS is required (Netlify provides this)
- Check browser console for errors
- Verify `/sw.js` redirect in `netlify.toml`

---

## 📞 Need Help?

Full troubleshooting guide: `docs/NETLIFY-DEPLOYMENT-GUIDE.md`


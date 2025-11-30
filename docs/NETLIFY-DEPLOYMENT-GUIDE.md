# 🚀 Netlify Deployment Guide for Sentinel

## ✅ Automated Setup Complete

The following files have been created automatically:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `.nvmrc` - Node version specification

---

## 📋 Manual Steps You Need to Complete

### Step 1: Test Local Build (REQUIRED - 5 minutes)

Before deploying, test that your build works locally:

```powershell
# In your project directory
npm run build
```

**What to check:**
- ✅ Build completes without errors
- ✅ No TypeScript errors
- ✅ All dependencies install correctly

**If you see errors:**
- Fix them locally first before deploying
- Common issues: Missing dependencies, TypeScript errors, syntax issues

---

### Step 2: Commit Configuration Files (2 minutes)

```powershell
# Add the new files
git add netlify.toml .nvmrc

# Commit them
git commit -m "chore: Add Netlify deployment configuration"

# Push to GitHub
git push origin main
```

---

### Step 3: Connect to Netlify (10 minutes)

#### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit: https://app.netlify.com
   - Sign up/Login (can use GitHub account)

2. **Add New Site**
   - Click "Add new site" button
   - Select "Import an existing project"
   - Choose "GitHub" (authorize if needed)

3. **Select Your Repository**
   - Search for: `Sentinel-Core`
   - Or: `jennofrie/Sentinel-Core`
   - Click on it

4. **Configure Build Settings**
   - Netlify should auto-detect from `netlify.toml`
   - **Verify these settings:**
     - **Build command**: `npm run build` (should be auto-filled)
     - **Publish directory**: `.next` (should be auto-filled)
     - **Node version**: `20` (should be auto-filled from `.nvmrc`)
   
   **⚠️ IMPORTANT:** If settings don't match, manually set:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **Click "Deploy site"**
   - First build will take 5-10 minutes
   - Watch the build logs for any errors

---

### Step 4: Configure Environment Variables (5 minutes)

**After the first deployment:**

1. **Go to Site Settings**
   - In your Netlify dashboard
   - Click on your site
   - Go to: **Site settings** → **Environment variables**

2. **Add Required Variables**

   Click "Add a variable" for each:

   ```
   Name: NEXT_PUBLIC_USE_MOCK_DATA
   Value: true
   Scope: All scopes
   ```

   **For Mock Mode (Recommended for Testing):**
   - `NEXT_PUBLIC_USE_MOCK_DATA` = `true`
   
   **Optional - If Using Real APIs:**
   ```
   VIRUSTOTAL_API_KEY=your_virustotal_key_here
   ABUSEIPDB_API_KEY=your_abuseipdb_key_here
   GOOGLE_SAFEBROWSING_API_KEY=your_safebrowsing_key_here
   SHODAN_API_KEY=your_shodan_key_here
   ```
   
   **Optional - If Using Supabase:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Trigger Redeploy**
   - After adding variables
   - Go to: **Deploys** tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

---

### Step 5: Install Netlify Next.js Plugin (Optional but Recommended)

1. **Go to Plugins**
   - Site settings → **Plugins**

2. **Install Plugin**
   - Search: `@netlify/plugin-nextjs`
   - Click "Install"
   - Or manually add to `package.json` (see Step 6)

---

### Step 6: Verify Build Settings (2 minutes)

In **Site settings** → **Build & deploy** → **Build settings**:

- ✅ Build command: `npm run build`
- ✅ Publish directory: `.next`
- ✅ Node version: `20` (or latest LTS)

---

### Step 7: Test Your Deployment (5 minutes)

After deployment completes:

1. **Check Site URL**
   - Your site will be at: `https://your-site-name.netlify.app`
   - Netlify auto-generates a name

2. **Test Critical Features:**
   - [ ] Landing page loads
   - [ ] Login page works
   - [ ] Dashboard loads (after login)
   - [ ] API route works (`/api/scan`)
   - [ ] Service worker registers (DevTools → Application → Service Workers)
   - [ ] PWA manifest loads (`/manifest.json`)

3. **Check Build Logs**
   - Go to: **Deploys** tab
   - Click on latest deploy
   - Review logs for warnings/errors

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Build Fails - "Module not found"

**Solution:**
```powershell
# Make sure all dependencies are in package.json
npm install
npm run build  # Test locally first
```

### Issue 2: Build Fails - TypeScript Errors

**Solution:**
- Fix TypeScript errors locally first
- Run: `npm run build` to see all errors
- Ensure `tsconfig.json` is properly configured

### Issue 3: Build Timeout

**Solution:**
- Netlify free tier: 15-minute limit
- For large builds, consider:
  - Optimizing dependencies
  - Using Netlify Pro tier
  - Or Vercel (better Next.js support)

### Issue 4: "Service Worker Not Loading"

**Solution:**
- Verify `/sw.js` redirect in `netlify.toml`
- Check browser console for errors
- Ensure HTTPS is enabled (Netlify provides this)

### Issue 5: Environment Variables Not Working

**Solution:**
- Variable names are **case-sensitive**
- Must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding variables
- Check in browser console: `console.log(process.env)`

### Issue 6: Video Not Loading

**Solution:**
- Check video file size (should be under 50MB)
- Verify video path: `/videos/sentinel-demo.mp4`
- Check browser console for 404 errors

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Site loads at Netlify URL
- [ ] Landing page displays correctly
- [ ] Video plays on landing page
- [ ] Login page accessible
- [ ] Authentication works (if configured)
- [ ] Dashboard loads after login
- [ ] IOC Scanner works
- [ ] API routes respond (`/api/scan`)
- [ ] Service worker registers
- [ ] PWA manifest loads
- [ ] Mobile responsive design works
- [ ] No console errors (check DevTools)

---

## 🎯 Quick Deploy Checklist

**Before Deploying:**
- [x] `netlify.toml` created
- [x] `.nvmrc` created
- [ ] Local build tested (`npm run build`)
- [ ] Configuration files committed to GitHub

**During Deploy:**
- [ ] Connected GitHub repository to Netlify
- [ ] Verified build settings
- [ ] Added environment variables
- [ ] First deployment successful

**After Deploy:**
- [ ] Site loads without errors
- [ ] All features work
- [ ] Tested on mobile device
- [ ] PWA features verified

---

## 🌐 Custom Domain Setup (Optional)

1. Go to: **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Follow Netlify's DNS setup instructions
4. Wait for DNS propagation (5-30 minutes)

---

## 📊 Deployment Status

After deployment, you'll see:
- ✅ **Production URL**: Your live site
- ✅ **Deploy previews**: For every pull request
- ✅ **Build logs**: Full deployment logs
- ✅ **Analytics**: Site performance data (Pro tier)

---

## 🔐 Security Notes

- ✅ HTTPS is automatically enabled on Netlify
- ✅ Service workers work on HTTPS
- ✅ API keys are server-side only (secure)
- ✅ Environment variables are encrypted

---

## 📞 Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **Next.js on Netlify**: https://docs.netlify.com/integrations/frameworks/nextjs/
- **Build Logs**: Check in Netlify dashboard → Deploys

---

**Estimated Total Time: ~30 minutes**

**Status**: ✅ Configuration files ready. Complete manual steps above to deploy!


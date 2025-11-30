# 🔐 Authentication Setup Guide

## Current Status

Your application is deployed on Netlify and working! However, you're seeing a "Failed to fetch" error when trying to log in because **Supabase authentication is not configured**.

---

## ✅ Two Options to Fix Authentication

### Option 1: Add Supabase Credentials (Recommended for Production)

**Enables full authentication and user management.**

#### Step 1: Create Supabase Project (if not done)

1. Go to: https://app.supabase.com
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - Name: `sentinel-core` (or your choice)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

#### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to: **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT token)

#### Step 3: Add to Netlify Environment Variables

1. Go to Netlify Dashboard → Your Site
2. **Site settings** → **Environment variables**
3. Click "Add a variable" for each:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
   ```

4. Click **Save**

#### Step 4: Create Your First User

1. In Supabase Dashboard → **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `your-email@example.com`
   - Password: (choose a secure password)
4. Click "Create user"

#### Step 5: Redeploy

1. Go to Netlify → **Deploys** tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deployment to complete

#### Step 6: Test Login

1. Visit your site: `https://your-site.netlify.app/login`
2. Enter the email/password you created
3. Should now work! ✅

---

### Option 2: Use App Without Authentication (Temporary)

**Current behavior:** The app now works without authentication when Supabase is not configured.

- ✅ Dashboard accessible
- ✅ IOC Scanner works
- ✅ All features functional
- ⚠️ No user authentication
- ⚠️ No search history (requires Supabase)

**Note:** This is fine for testing/demos, but for production, use Option 1.

---

## 🎯 Quick Fix Summary

**To enable authentication:**
1. Create Supabase project
2. Get credentials
3. Add to Netlify environment variables
4. Create a user account
5. Redeploy
6. Login works! ✅

**To use without authentication:**
- ✅ Already working!
- App bypasses auth when Supabase not configured
- Perfect for demos/testing

---

## 🔍 Troubleshooting

### "Failed to fetch" Error

**Cause:** Supabase credentials missing or invalid

**Solution:**
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Netlify
- Verify credentials are correct (no typos)
- Redeploy after adding variables

### "Invalid login credentials"

**Cause:** User doesn't exist in Supabase

**Solution:**
- Create user in Supabase Dashboard → Authentication → Users
- Or use the signup flow (if enabled)

### Can't Access Dashboard

**Cause:** Authentication required but not logged in

**Solution:**
- If Supabase configured: Log in first
- If Supabase not configured: Should work automatically (bypass auth)

---

## 📝 Environment Variables Needed

For full authentication features:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**Where to add:** Netlify Dashboard → Site settings → Environment variables

---

**Status:** App works without auth. Add Supabase credentials to enable authentication!


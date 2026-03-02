# Supabase URL Configuration for Vercel

## Your Vercel Domain: `migranthubtest.vercel.app`

## Step 1: Configure Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**

### Site URL (IMPORTANT - Set this first!)
Set this to your Vercel production URL **without trailing slash**:
```
https://migranthubtest.vercel.app
```
⚠️ **This is critical!** The Site URL must match your domain.

### Redirect URLs
Add these URLs (one per line, exactly as shown):

```
https://migranthubtest.vercel.app
https://migranthubtest.vercel.app/**
https://migranthubtest.vercel.app/*
http://localhost:4000
http://localhost:4000/**
http://localhost:4000/*
com.iraqiguideuk.app://
https://com.iraqiguideuk.app
```

**Important Notes:**
- Include the base URL **without** wildcards: `https://migranthubtest.vercel.app`
- Also include with wildcards: `https://migranthubtest.vercel.app/**` and `https://migranthubtest.vercel.app/*`
- The trailing slash doesn't matter, but consistency helps

## Step 2: Save Changes

Click **Save** after adding all URLs.

⚠️ **Wait 1-2 minutes** for changes to propagate before testing.

## Step 3: Verify Google OAuth Configuration

Your Google OAuth should already be configured, but verify:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and click **Edit**
5. Under **Authorized redirect URIs**, you should have:
   ```
   https://your-supabase-project.supabase.co/auth/v1/callback
   ```
   (Replace `your-supabase-project` with your actual Supabase project reference ID)

   **This should already be set** - Google OAuth redirects to Supabase first, then Supabase redirects to your app.

## Step 4: Clear Browser Cache

1. Open your app in an **incognito/private window**
2. Or clear cookies and cache for `migranthubtest.vercel.app`

## Step 5: Test

1. Go to: `https://migranthubtest.vercel.app`
2. Click "Sign in with Google"
3. Complete Google authentication
4. You should be redirected back to `https://migranthubtest.vercel.app`

---

## Troubleshooting Google Login Not Working

### Issue 1: "Redirect URL not allowed" error
**Solution:**
- ✅ Check that **Site URL** is set to: `https://migranthubtest.vercel.app`
- ✅ Verify all redirect URLs are added exactly as shown above
- ✅ Make sure you clicked **Save** in Supabase
- ✅ Wait 1-2 minutes after saving

### Issue 2: Redirects to localhost instead of Vercel
**Solution:**
- ✅ Site URL must be: `https://migranthubtest.vercel.app` (not localhost)
- ✅ Clear browser cache/cookies
- ✅ Try incognito mode
- ✅ Check browser console for errors

### Issue 3: OAuth popup closes but doesn't log in
**Solution:**
- ✅ Check browser console for errors
- ✅ Verify Supabase environment variables are set in Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- ✅ Check Network tab in browser DevTools - look for failed requests

### Issue 4: "Invalid redirect_uri" from Google
**Solution:**
- ✅ This shouldn't happen if Google OAuth is correctly configured
- ✅ Google redirects to Supabase (`*.supabase.co/auth/v1/callback`), not directly to your app
- ✅ Supabase then redirects to your app based on the redirect URLs above

---

## Complete Checklist

- [ ] Site URL set to: `https://migranthubtest.vercel.app`
- [ ] All redirect URLs added (base URL + wildcards + localhost + native URLs)
- [ ] Clicked **Save** in Supabase
- [ ] Waited 1-2 minutes for changes to propagate
- [ ] Cleared browser cache or using incognito mode
- [ ] Environment variables set in Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] App deployed to Vercel
- [ ] Tested in browser console (check for errors)


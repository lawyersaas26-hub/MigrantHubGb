# Fix Vercel Login Redirect Issue

## Problem
After logging in on Vercel, you're being redirected to `localhost:4000` instead of your Vercel URL, and the page doesn't show.

## Root Cause
Supabase is using redirect URLs configured in the Supabase Dashboard, not the ones from your code. The redirect URL needs to be updated in Supabase settings.

---

## Solution: Update Supabase Redirect URLs

### Step 1: Get Your Vercel URL
Your Vercel URL should look like:
- `https://your-app-name.vercel.app`

### Step 2: Update Supabase Settings

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Go to Authentication Settings**
   - Click **"Authentication"** in the left sidebar
   - Click **"URL Configuration"** (or "Settings" → "Auth")

3. **Update Site URL**
   - **Site URL**: Change to your Vercel URL
   - Example: `https://your-app-name.vercel.app`

4. **Update Redirect URLs**
   - Find **"Redirect URLs"** section
   - **Remove** any `localhost:3000` or `localhost:3001` entries
   - **Add** your Vercel URLs:
     ```
     https://your-app-name.vercel.app
     https://your-app-name.vercel.app/**
     https://your-app-name.vercel.app/*
     ```
   - Also keep your local development URL if needed:
     ```
     http://localhost:4000
     http://localhost:4000/**
     http://localhost:4000/*
     ```

5. **Save Changes**

### Step 3: Update Google OAuth (If Using Google Login)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Select your project

2. **Go to OAuth 2.0 Client IDs**
   - Navigate to **"APIs & Services"** → **"Credentials"**
   - Find your OAuth 2.0 Client ID
   - Click **"Edit"**

3. **Update Authorized Redirect URIs**
   - Add your Vercel URL:
     ```
     https://your-supabase-project.supabase.co/auth/v1/callback
     ```
   - **Note**: This should already be set if you configured Google OAuth correctly
   - The redirect URI should point to Supabase, not directly to your app

4. **Save Changes**

### Step 4: Verify Code Configuration

The code already uses dynamic redirect URLs:
```typescript
// lib/userAuth.ts
redirectTo: `${window.location.origin}/`
```

This should automatically use your Vercel URL when deployed.

### Step 5: Redeploy (If Needed)

After updating Supabase settings:
```bash
vercel --prod
```

---

## Quick Checklist

- [ ] Updated Site URL in Supabase to Vercel URL
- [ ] Added Vercel URL to Redirect URLs in Supabase
- [ ] Removed localhost:3000 and localhost:3001 from Redirect URLs (if not needed)
- [ ] Added localhost:4000 for local development
- [ ] Verified Google OAuth redirect URI points to Supabase
- [ ] Redeployed app to Vercel
- [ ] Tested login flow

---

## Testing

1. **Open your Vercel URL** in an incognito window
2. **Click "Login"** or "Sign in with Google"
3. **After authentication**, you should be redirected back to your Vercel URL (not localhost)
4. **Verify** you're logged in and see the home page

---

## Common Issues

### Issue 1: Still redirecting to localhost
**Solution**: 
- Double-check Supabase Redirect URLs
- Clear browser cache/cookies
- Try incognito mode

### Issue 2: "Redirect URL not allowed" error
**Solution**:
- Make sure your exact Vercel URL is in the Redirect URLs list
- Include both with and without trailing slash
- Include wildcard patterns: `https://your-app.vercel.app/**`

### Issue 3: OAuth works but email/password doesn't
**Solution**:
- Check Site URL is set correctly
- Verify Redirect URLs include your Vercel URL
- Check Supabase email templates (if using email confirmation)

---

## Environment Variables

Make sure these are set in Vercel:
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

---

## Still Having Issues?

1. **Check Browser Console** for errors
2. **Check Supabase Logs** (Dashboard → Logs)
3. **Verify** your Vercel URL matches exactly in Supabase settings
4. **Test** with a simple redirect URL first (just the base URL without wildcards)














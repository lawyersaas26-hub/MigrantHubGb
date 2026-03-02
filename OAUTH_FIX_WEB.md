# Fix Google OAuth Login/Registration Issue

## Problem
When trying to login or register with Google, the Google screen shows but the app keeps loading and nothing happens.

## Root Cause
The OAuth callback wasn't being properly handled for web applications. After Google redirects back to your app, the tokens in the URL hash weren't being processed.

## Solution Applied

### 1. Added OAuth Callback Handler for Web
Updated `App.tsx` to properly handle OAuth callbacks when users return from Google authentication:

- Detects OAuth callback by checking for `access_token` in URL hash or query params
- Extracts tokens from URL hash
- Sets Supabase session with the tokens
- Ensures user profile exists
- Navigates to home page after successful login
- Handles OAuth errors gracefully

### 2. Improved Redirect URL Handling
Updated `lib/userAuth.ts` to ensure redirect URLs are properly formatted.

## Required: Verify Supabase Configuration

### Step 1: Check Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to: **Authentication** → **URL Configuration**

### Step 2: Verify Site URL

**Site URL** should be set to your current domain:
```
https://out-azure-sigma.vercel.app
```

### Step 3: Verify Redirect URLs

Make sure these URLs are in the **Redirect URLs** list:

```
https://out-azure-sigma.vercel.app
https://out-azure-sigma.vercel.app/
https://out-azure-sigma.vercel.app/**
https://out-azure-sigma.vercel.app/*
http://localhost:4000
http://localhost:4000/
http://localhost:4000/**
http://localhost:4000/*
com.migranthubGBv3.app://
https://com.migranthubGBv3.app
```

**Important:**
- Include the base URL **without** trailing slash: `https://out-azure-sigma.vercel.app`
- Include **with** trailing slash: `https://out-azure-sigma.vercel.app/`
- Include wildcard patterns: `https://out-azure-sigma.vercel.app/**` and `/*`

### Step 4: Save and Wait

1. Click **Save**
2. **Wait 1-2 minutes** for changes to propagate
3. Clear browser cache or use incognito mode
4. Test Google login again

## Testing

1. **Open your app** in a browser (or incognito window)
2. **Click "Sign in with Google"** or "Sign up with Google"
3. **Complete Google authentication**
4. **You should be redirected back** to your app
5. **You should be logged in** and see the home page

## Debugging

If it still doesn't work:

1. **Check browser console** for errors
2. **Check the URL** after Google redirect - it should have `#access_token=...` in the hash
3. **Verify Supabase redirect URLs** match exactly what's in the redirect URL
4. **Check Supabase logs** in the dashboard for authentication errors

## Common Issues

### Issue 1: "Redirect URL not allowed"
**Solution:** Make sure your exact domain is in Supabase Redirect URLs list

### Issue 2: Still loading after Google login
**Solution:** 
- Check browser console for errors
- Verify the redirect URL in code matches Supabase settings
- Clear browser cache

### Issue 3: OAuth works but user not logged in
**Solution:**
- Check if user profile is being created
- Check Supabase logs for errors
- Verify database tables exist





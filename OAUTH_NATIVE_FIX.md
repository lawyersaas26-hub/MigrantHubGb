# OAuth Native App Fix Guide

## Problem
When logging in with Google OAuth in the native Android app, it was opening Chrome browser and redirecting to the Vercel web app instead of staying in the native app.

## Solution
The app now uses:
1. **Capacitor Browser plugin** to open OAuth in an in-app browser (not Chrome)
2. **Deep links** to handle OAuth callbacks and return to the native app
3. **Custom URL scheme** (`com.iraqiguideuk.app://`) for OAuth redirects

## Changes Made

### 1. Android Deep Link Configuration
Added intent filters to `android/app/src/main/AndroidManifest.xml` to handle OAuth callbacks:
- Custom URL scheme: `com.iraqiguideuk.app://`
- HTTPS deep link: `https://com.iraqiguideuk.app`

### 2. OAuth Flow for Native Apps
Updated `lib/userAuth.ts` to:
- Use `skipBrowserRedirect: true` to prevent Supabase from opening Chrome automatically
- Get the OAuth URL from Supabase
- Use Capacitor Browser plugin to open OAuth in an in-app browser
- Use the app's custom URL scheme (`com.iraqiguideuk.app://`) for redirects

### 3. OAuth Callback Handling
Added deep link handling in `App.tsx` using Capacitor's `App` plugin to:
- Listen for OAuth callback URLs via `appUrlOpen` events
- Extract access tokens from the callback URL
- Set the Supabase session
- Navigate to the account page after successful login
- Also listen for Browser close events as a fallback

## Required: Update Supabase Redirect URLs

You **MUST** add the following redirect URLs to your Supabase project:

### Steps:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   com.iraqiguideuk.app://
   https://com.iraqiguideuk.app
   ```
5. Also keep your existing URLs:
   ```
   http://localhost:4000/
   http://localhost:4000/**
   http://localhost:4000/*
   https://migranthubtest.vercel.app/
   ```
6. Click **Save**

## Testing

1. **Rebuild the app:**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Build and install the app** on your device

3. **Test OAuth login:**
   - Open the app
   - Go to Account → Login
   - Click "Sign in with Google"
   - Complete OAuth in the browser
   - The app should automatically return to the native app (not Chrome)
   - You should be logged in

## How It Works

1. User clicks "Sign in with Google" in the native app
2. App gets OAuth URL from Supabase with `skipBrowserRedirect: true`
3. App opens OAuth URL in **Capacitor Browser** (in-app browser, not Chrome)
4. User completes OAuth in the in-app browser
5. Supabase redirects to `com.iraqiguideuk.app://` with tokens in URL hash
6. Android OS recognizes the deep link and closes the browser, opening the app
7. App receives the deep link event via Capacitor's `appUrlOpen`
8. App extracts tokens from the URL and sets Supabase session
9. User is logged in and navigated to account page

**Key Difference**: Instead of opening Chrome, we use Capacitor Browser which properly handles deep link redirects back to the app.

## Troubleshooting

### Still opening in Chrome?
- Make sure you've added `com.iraqiguideuk.app://` to Supabase redirect URLs
- Make sure you've **removed** the Vercel URL from Supabase redirect URLs (or it will still redirect there)
- Rebuild and reinstall the app after changes: `npm run build && npx cap sync android`
- Clear app data and try again
- Check that `@capacitor/browser` is installed: `npm list @capacitor/browser`

### OAuth callback not working?
- Check Android logs: `adb logcat | grep -i "oauth\|capacitor\|app"`
- Verify the deep link intent filters are in `AndroidManifest.xml`
- Make sure `@capacitor/app` is installed: `npm install @capacitor/app`

### Session not persisting?
- Check if Supabase session is being set correctly
- Verify the tokens are being extracted from the URL hash
- Check browser console (if using remote debugging)

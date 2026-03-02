# Exact Supabase URLs to Configure

## Your Vercel Domain
**migranthubtest.vercel.app**

---

## Step 1: Go to Supabase Dashboard

1. Visit: https://supabase.com/dashboard
2. Select your project
3. Go to: **Authentication** → **URL Configuration**

---

## Step 2: Set Site URL

**Site URL field:**
```
https://migranthubtest.vercel.app
```

⚠️ **THIS IS CRITICAL!** Make sure this is set correctly.

---

## Step 3: Add Redirect URLs

In the **Redirect URLs** section, add each URL on a separate line:

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

**Copy and paste the above list exactly as shown.**

---

## Step 4: Save and Wait

1. Click **Save**
2. **Wait 1-2 minutes** for changes to take effect
3. Clear browser cache or use incognito mode
4. Test Google login

---

## Why It Wasn't Working

You added:
- ✅ `https://migranthubtest.vercel.app/**`
- ✅ `https://migranthubtest.vercel.app/*`

But you were missing:
- ❌ **Site URL** (must be set to your Vercel URL)
- ❌ Base URL without wildcards: `https://migranthubtest.vercel.app`

The Site URL is especially important - it's used as the default redirect destination.

---

## Quick Checklist

- [ ] Site URL = `https://migranthubtest.vercel.app`
- [ ] Added base URL: `https://migranthubtest.vercel.app`
- [ ] Added wildcard URLs: `https://migranthubtest.vercel.app/**` and `/*`
- [ ] Added localhost URLs for development
- [ ] Added native app URLs
- [ ] Clicked Save
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Tested in incognito window


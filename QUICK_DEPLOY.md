# Quick Deployment Guide - Share with Your Friend

## Fastest Way: Deploy to Vercel (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Build Your App
```bash
npm run build
```

### Step 3: Deploy
```bash
vercel
```

**Follow the prompts:**
- Login to Vercel (or create account)
- Link to existing project or create new
- Confirm settings
- **Done!** You'll get a URL like: `https://your-app.vercel.app`

### Step 4: Share the URL
Send this URL to your friend. They can:
1. Open it in Safari on iPhone
2. Tap Share → "Add to Home Screen" for app-like experience

### Step 5: Update Supabase Settings
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL" and "Redirect URLs"
3. Example: `https://your-app.vercel.app`

---

## Alternative: Netlify (Just as Easy)

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Deploy
```bash
netlify deploy --prod --dir=dist
```

**First time only:**
```bash
netlify login
```

---

## Important: Environment Variables

Before deploying, make sure to add these in Vercel/Netlify dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Redeploy after adding

---

## Testing Checklist

- [ ] App loads correctly
- [ ] Login/Register works
- [ ] Google OAuth works (check redirect URLs)
- [ ] Categories display
- [ ] Search works
- [ ] Navigation works
- [ ] RTL (Arabic/Kurdish) works

---

## Troubleshooting

**App shows blank page:**
- Check browser console for errors
- Verify environment variables are set
- Check Supabase CORS settings

**OAuth not working:**
- Add production URL to Supabase redirect URLs
- Check Supabase Auth → URL Configuration

**Build fails:**
- Run `npm install` first
- Check for TypeScript errors: `npm run build`














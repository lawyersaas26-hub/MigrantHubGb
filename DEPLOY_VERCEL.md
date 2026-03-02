# Deploy to Vercel - Quick Guide

## Method 1: Using Vercel CLI (Recommended)

### First Time Setup:
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```
   - Follow the prompts
   - If it's your first deployment, Vercel will ask you to link/create a project
   - Confirm settings (it will use `vercel.json` automatically)

### For Future Updates:
Just run:
```bash
npm run build
vercel --prod
```

Or simply:
```bash
vercel --prod
```
(Vercel will build automatically if you haven't run `npm run build`)

---

## Method 2: Using Git (Automatic Deployments)

### Connect GitHub/GitLab/Bitbucket:

1. **Push your code to Git**:
   ```bash
   git add .
   git commit -m "Update app with latest changes"
   git push
   ```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect settings from `vercel.json`

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - Save and redeploy

4. **Automatic Deployments**:
   - Every `git push` will automatically trigger a new deployment
   - Production deployments happen on `main`/`master` branch
   - Preview deployments for other branches

---

## Method 3: Using Vercel Dashboard (Web UI)

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "Add New Project"
3. **Import Git Repository** (or drag & drop `dist` folder)
4. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. **Add Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. **Deploy**

---

## Important: Environment Variables

Before deploying, make sure these are set in Vercel:

1. Go to **Project Settings → Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
3. **Redeploy** after adding variables

---

## Update Supabase Redirect URLs

After deploying, update Supabase:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`
3. Save changes

---

## Quick Commands Reference

```bash
# Build locally
npm run build

# Deploy to production (Vercel CLI)
vercel --prod

# Deploy preview (for testing)
vercel

# View deployment logs
vercel logs

# List all deployments
vercel ls
```

---

## Troubleshooting

**Build fails:**
- Check for TypeScript errors: `npm run build`
- Ensure all dependencies are installed: `npm install`
- Check `vercel.json` configuration

**Environment variables not working:**
- Make sure variables start with `VITE_` prefix
- Redeploy after adding variables
- Check variable names match exactly

**OAuth not working:**
- Add production URL to Supabase redirect URLs
- Check Supabase Auth → URL Configuration
- Ensure `androidScheme: 'https'` in `capacitor.config.ts`

**App shows blank page:**
- Check browser console for errors
- Verify environment variables are set correctly
- Check Supabase CORS settings

---

## Your Vercel URL

After deployment, you'll get a URL like:
- `https://iraqi-immigrant-guide-uk.vercel.app`
- Or custom domain if configured

Share this URL with your friend - they can open it in Safari on iPhone!














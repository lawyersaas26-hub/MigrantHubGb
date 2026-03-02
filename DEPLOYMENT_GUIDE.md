# Deployment Guide - Sharing Your App

This guide covers multiple ways to share your app with friends for testing.

## Option 1: Deploy to Web (Easiest - Recommended for Testing)

Your friend can access the app via Safari on their iPhone. This is the quickest way to share.

### A. Deploy to Vercel (Free & Easy)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your project settings
   - Vercel will give you a URL like: `https://your-app-name.vercel.app`

4. **Share the URL** with your friend - they can open it in Safari on iPhone!

5. **For future updates**, just run:
   ```bash
   npm run build
   vercel --prod
   ```

### B. Deploy to Netlify (Alternative)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```
   - First time: `netlify login` and follow setup
   - You'll get a URL like: `https://your-app-name.netlify.app`

### C. Deploy to GitHub Pages

1. **Add to package.json scripts**:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

2. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Update vite.config.ts** - Add base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // Replace with your GitHub repo name
     // ... rest of config
   });
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages** in your repo settings
   - Settings → Pages → Source: `gh-pages` branch

---

## Option 2: Native iOS App (Requires Apple Developer Account)

If you want your friend to test it as a native iOS app, you'll need:

### Prerequisites:
- **Apple Developer Account** ($99/year)
- **Mac computer** with Xcode installed
- **iOS device** (your friend's iPhone)

### Steps:

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**:
   ```bash
   npx cap sync ios
   ```

3. **Open in Xcode**:
   ```bash
   npx cap open ios
   ```

4. **Configure Signing**:
   - In Xcode, select your project
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
   - Enable "Automatically manage signing"

5. **Update capacitor.config.ts** for production:
   ```typescript
   server: {
     // Comment out the dev server URL
     // url: 'http://192.168.1.116:5173',
     // cleartext: true,
     
     // Use production settings
     androidScheme: 'https',
     iosScheme: 'https',
   },
   ```

6. **Build for TestFlight**:
   - In Xcode: Product → Archive
   - Once archived: Distribute App → App Store Connect
   - Upload to TestFlight

7. **Invite your friend**:
   - Go to App Store Connect → TestFlight
   - Add your friend's email as an internal tester
   - They'll receive an invitation email

---

## Option 3: Development Build with Public URL (Quick Testing)

If you want to test with live reload without deploying:

### Using ngrok (Free):

1. **Install ngrok**:
   - Download from https://ngrok.com/download
   - Or: `npm install -g ngrok`

2. **Start your dev server**:
   ```bash
   npm run dev
   ```

3. **In another terminal, create tunnel**:
   ```bash
   ngrok http 5173
   ```

4. **Update capacitor.config.ts** temporarily:
   ```typescript
   server: {
     url: 'https://your-ngrok-url.ngrok.io', // Use the HTTPS URL from ngrok
     cleartext: false,
   },
   ```

5. **Sync Capacitor**:
   ```bash
   npx cap sync ios
   ```

6. **Share the ngrok URL** - Your friend can access via web browser

**Note**: Free ngrok URLs change each time you restart. For stable testing, use Option 1 (deploy to Vercel/Netlify).

---

## Recommended Approach for Testing

**For quick testing with your friend:**
1. Use **Option 1A (Vercel)** - It's free, fast, and works perfectly on iPhone Safari
2. The app will work exactly like a native app when added to home screen
3. Your friend can "Add to Home Screen" in Safari for app-like experience

**For native app testing:**
- Use **Option 2 (TestFlight)** if you have Apple Developer account
- This gives the full native iOS experience

---

## Adding to iPhone Home Screen (PWA-like Experience)

Your friend can make the web app feel like a native app:

1. Open the app URL in Safari
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. The app will appear as an icon on their home screen
5. When opened, it will run fullscreen without Safari UI

---

## Environment Variables for Production

Make sure your production deployment has these environment variables set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

In Vercel/Netlify:
- Go to Project Settings → Environment Variables
- Add the variables
- Redeploy

---

## Troubleshooting

### CORS Issues:
- Make sure your Supabase project allows your deployment URL
- Go to Supabase Dashboard → Settings → API → Add your domain

### OAuth Redirect Issues:
- Update redirect URLs in Supabase Auth settings
- Add your production URL to allowed redirect URLs

### Build Errors:
- Make sure all dependencies are in `package.json`
- Run `npm install` before building
- Check for TypeScript errors: `npm run build`














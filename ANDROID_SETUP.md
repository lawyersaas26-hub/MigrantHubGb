# Running on Android Phone - Step by Step Guide

## 📱 Quick Steps

### Step 1: Build Your App
First, build your web app so it's ready for Android:

```bash
npm run build
```

### Step 2: Sync with Android
Copy your built app to the Android project:

```bash
npx cap sync
```

### Step 3: Open Android Studio
Open the Android project in Android Studio:

```bash
npm run cap:open:android
```

**Or use the all-in-one command:**
```bash
npm run cap:run:android
```
(This builds, syncs, and opens Android Studio automatically)

---

## 🔌 Running on Physical Android Phone

### Prerequisites:
1. ✅ **Android Studio** installed ([Download here](https://developer.android.com/studio))
2. ✅ **USB cable** to connect your phone
3. ✅ **Android phone** with USB debugging enabled

### Enable USB Debugging on Your Phone:

1. **Enable Developer Options:**
   - Go to **Settings** > **About Phone**
   - Tap **Build Number** 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to **Settings** > **Developer Options**
   - Turn on **USB Debugging**
   - Turn on **Install via USB** (if available)

3. **Connect Your Phone:**
   - Connect phone to computer via USB
   - On your phone, when prompted, tap **Allow USB Debugging**
   - Check "Always allow from this computer" if you want

### Run the App:

1. **Open Android Studio** (via `npm run cap:open:android`)

2. **Wait for Gradle Sync** (first time may take a few minutes)

3. **Select Your Device:**
   - At the top toolbar, click the device dropdown
   - You should see your phone listed (e.g., "Samsung Galaxy S21")
   - If not visible, make sure USB debugging is enabled

4. **Click Run** (▶️ green button) or press `Shift + F10`

5. **Wait for Installation:**
   - Android Studio will build and install the app
   - The app will launch automatically on your phone!

---

## 🔄 After Making Code Changes

Every time you update your code:

```bash
# 1. Rebuild
npm run build

# 2. Sync to Android
npx cap sync

# 3. In Android Studio, click Run again
```

**Or use the shortcut:**
```bash
npm run cap:run:android
```

---

## 🌐 Environment Variables for Android

Your `.env` file works for web, but for Android you need to handle environment variables differently.

### Option 1: Use Build-time Variables (Recommended)

The `.env` file should work, but if you have issues, you can also set them in `capacitor.config.ts`:

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iraqiguideuk.app',
  appName: 'Iraqi Immigrant Guide UK',
  webDir: 'dist',
  // ... rest of config
};

export default config;
```

### Option 2: Hardcode for Testing (Not for production)

If needed, you can temporarily hardcode in `lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://nysjbpprdpzkwjaypqed.supabase.co';
const supabaseAnonKey = 'your_key_here';
```

---

## 🐛 Troubleshooting

### Phone Not Detected:
- ✅ Check USB cable (try a different one)
- ✅ Make sure USB Debugging is enabled
- ✅ Try different USB port
- ✅ Install phone drivers (if Windows)
- ✅ In Android Studio: **Tools** > **Device Manager** > Check if device appears

### Build Errors:
- ✅ Make sure you ran `npm run build` first
- ✅ Check that `dist` folder exists
- ✅ Try `npx cap sync` again
- ✅ In Android Studio: **File** > **Invalidate Caches** > **Invalidate and Restart**

### App Shows Blank Screen:
- ✅ Check Android Studio's **Logcat** for errors
- ✅ Make sure Supabase URL is accessible from phone
- ✅ Check network connection on phone
- ✅ Try rebuilding: `npm run build && npx cap sync`

### "Command not found: cap":
```bash
npm install -g @capacitor/cli
```

### Gradle Sync Failed:
- ✅ Check internet connection
- ✅ In Android Studio: **File** > **Sync Project with Gradle Files**
- ✅ Try: **File** > **Invalidate Caches** > **Invalidate and Restart**

---

## 📱 Alternative: Generate APK for Direct Installation

If you want to install the app directly on your phone without Android Studio:

1. **Build the app:**
   ```bash
   npm run build
   npx cap sync
   ```

2. **In Android Studio:**
   - Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
   - Wait for build to complete
   - Click **locate** in the notification
   - Copy the APK file to your phone
   - Install it on your phone

---

## ✅ Success Checklist

- [ ] Android Studio installed
- [ ] Phone connected via USB
- [ ] USB Debugging enabled
- [ ] Phone appears in Android Studio device list
- [ ] App builds successfully
- [ ] App installs on phone
- [ ] App launches and shows content

---

## 🎉 You're Done!

Once the app is running on your phone, you can:
- Test all features
- Check Supabase connectivity
- Test on real device performance
- Share with others (by generating APK)

Your app is now running natively on Android! 🚀


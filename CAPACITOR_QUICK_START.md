# How to View Your App with Capacitor

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
npm install
```

This installs all Capacitor packages and your existing dependencies.

---

### Step 2: Build Your Web App

```bash
npm run build
```

This creates the `dist` folder with your compiled React app that Capacitor will use.

---

### Step 3: Add Mobile Platforms

#### For Android:
```bash
npx cap add android
```

#### For iOS (Mac only):
```bash
npx cap add ios
```

This creates the native Android/iOS project folders.

---

### Step 4: Sync Your App

```bash
npx cap sync
```

This copies your web app (`dist` folder) into the native projects.

---

### Step 5: Open in IDE and Run

#### Option A: Android (Works on Windows/Mac/Linux)

```bash
npm run cap:open:android
```

This opens **Android Studio**. Then:
1. Wait for Gradle sync to finish
2. Click the green "Run" button (▶️) or press `Shift + F10`
3. Choose an emulator or connected device
4. Your app will launch!

**Or use the all-in-one command:**
```bash
npm run cap:run:android
```
(This builds, syncs, and opens Android Studio)

---

#### Option B: iOS (Mac only)

```bash
npm run cap:open:ios
```

This opens **Xcode**. Then:
1. Select a simulator (iPhone 14, iPhone 15, etc.)
2. Click the "Play" button (▶️) or press `Cmd + R`
3. Your app will launch in the simulator!

**Or use the all-in-one command:**
```bash
npm run cap:run:ios
```

---

## 📱 Alternative: Test on Real Device

### Android:
1. Enable **Developer Options** on your Android phone
2. Enable **USB Debugging**
3. Connect phone via USB
4. In Android Studio, select your device from the device dropdown
5. Click Run

### iOS:
1. Connect iPhone via USB
2. In Xcode, select your device from the device dropdown
3. You may need to sign the app (add your Apple ID in Xcode settings)
4. Click Run

---

## 🔄 After Making Code Changes

Every time you change your React code:

```bash
# 1. Rebuild
npm run build

# 2. Sync to native projects
npx cap sync

# 3. Run again in Android Studio or Xcode
```

**Or use the shortcut:**
```bash
npm run cap:run:android  # Does all 3 steps
```

---

## 🛠️ Prerequisites

### For Android:
- ✅ **Android Studio** - [Download here](https://developer.android.com/studio)
- ✅ **Java JDK** (usually comes with Android Studio)
- ✅ **Android SDK** (installed via Android Studio)

### For iOS:
- ✅ **Mac computer** (required)
- ✅ **Xcode** - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- ✅ **Xcode Command Line Tools**: `xcode-select --install`

---

## 🐛 Troubleshooting

### "Command not found: cap"
```bash
npm install -g @capacitor/cli
```

### "Android Studio not found"
- Make sure Android Studio is installed
- Add Android Studio to your PATH, or use full path to `studio.exe`

### "Build failed"
- Make sure you ran `npm run build` first
- Check that `dist` folder exists
- Try `npx cap sync` again

### "App shows blank screen"
- Check browser console in Android Studio/Xcode
- Make sure `dist` folder has your built files
- Try `npx cap sync` again

---

## 📝 Quick Reference Commands

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Add platform (first time only)
npx cap add android
npx cap add ios

# Sync after changes
npx cap sync

# Open in IDE
npm run cap:open:android
npm run cap:open:ios

# Build + Sync + Open (all in one)
npm run cap:run:android
npm run cap:run:ios
```

---

## ✅ What You'll See

Once running, you'll see your app exactly as it looks in the browser, but:
- ✅ Running as a native app
- ✅ Can be installed on device
- ✅ Access to device features (via Capacitor plugins)
- ✅ Works offline (after first load)

Your app will look identical to the web version! 🎉


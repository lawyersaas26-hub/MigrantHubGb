# Android Text-to-Speech Fix

## ⚠️ Issue

Android WebView does **not** support the Web Speech API (`speechSynthesis`). This is a known limitation of Android's WebView component.

## 🔧 Solution Options

### Option 1: Use Native Android TTS (Recommended)

Since Web Speech API doesn't work in Android WebView, we need to use Android's native Text-to-Speech API through a Capacitor plugin.

#### Install Compatible Plugin:

Since `@capacitor-community/text-to-speech` requires Capacitor 7, we have two options:

**Option A: Create Custom Native Bridge (Recommended for now)**

1. Create a simple Capacitor plugin wrapper for Android TTS
2. This will work with Capacitor 6

**Option B: Upgrade to Capacitor 7** (More work, but better long-term)

```bash
npm install @capacitor/core@^7.0.0 @capacitor/cli@^7.0.0
npm install @capacitor-community/text-to-speech
npx cap sync
```

### Option 2: Show Button with Fallback Message

For now, the button will show but may not work on Android. We can:
- Show the button always
- Display a helpful message if TTS isn't available
- Guide users to use the web version or wait for native TTS

## 🚀 Quick Fix (Current Implementation)

The current code:
- ✅ Shows the button always (even if TTS not available)
- ✅ Handles errors gracefully
- ✅ Logs helpful messages for debugging
- ⚠️ May not work on Android WebView (known limitation)

## 📱 Testing on Android

1. **Check Logcat** for:
   - "Speech synthesis not supported in this browser/WebView"
   - "SpeechSynthesis API exists but may not be functional"

2. **Expected Behavior**:
   - Button shows (but may be grayed out)
   - Clicking shows error message
   - Works on web browsers, may not work on Android WebView

## 🔮 Next Steps

To fully support Android TTS, we need to:

1. **Create a custom Capacitor plugin** for Android TTS, OR
2. **Upgrade to Capacitor 7** and use `@capacitor-community/text-to-speech`

Would you like me to:
- A) Create a custom native Android TTS bridge?
- B) Upgrade to Capacitor 7 and use the community plugin?
- C) Keep current implementation with better error messages?


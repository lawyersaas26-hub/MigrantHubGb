# Android Text-to-Speech Implementation

## ✅ Solution Implemented

Since Android WebView doesn't support the Web Speech API, we've implemented a **native Android TTS plugin** that uses Android's built-in Text-to-Speech engine.

## 📁 Files Created/Modified

### 1. **Native Android Plugin**
- `android/app/src/main/java/com/iraqiguideuk/app/TextToSpeechPlugin.java`
  - Uses Android's `TextToSpeech` API
  - Supports Kurdish (ckb), Arabic (ar-SA), and English (en-GB)
  - Auto-registers via `@CapacitorPlugin` annotation

### 2. **TypeScript Integration**
- `utils/textToSpeech.ts` - Updated to use native plugin on Android
- `utils/textToSpeech.web.ts` - Web fallback implementation
- `hooks/useTextToSpeech.ts` - Updated to handle async operations

### 3. **MainActivity**
- `android/app/src/main/java/com/iraqiguideuk/app/MainActivity.java`
  - WebView settings configured
  - Plugin auto-registers (no manual registration needed)

## 🔧 How It Works

1. **Detection**: The code detects if running on native platform (Android/iOS)
2. **Native TTS**: On Android, uses `TextToSpeechPlugin` which calls Android's native TTS
3. **Web Fallback**: On web browsers, uses Web Speech API
4. **Language Support**:
   - Kurdish: Uses `ckb` (Central Kurdish) locale
   - Arabic: Uses `ar-SA` (Saudi Arabia) locale
   - English: Uses `en-GB` (UK) locale

## 🚀 Testing

### Build and Sync:
```bash
npm run build
npx cap sync
```

### Run on Android:
```bash
npm run cap:open:android
```

### Expected Behavior:
1. ✅ TTS button appears in resource detail pages
2. ✅ Clicking button starts reading content in Kurdish/Arabic/English
3. ✅ Works on Android devices (uses native TTS)
4. ✅ Works on web browsers (uses Web Speech API)

## 📝 Notes

- **Kurdish TTS**: May not be available on all Android devices. If not available, will fallback to device default language.
- **Pause/Resume**: Android TTS doesn't support pause/resume natively, so pause stops the speech and resume would need to re-speak from the beginning.
- **Language Detection**: The plugin tries to use the best available voice for each language.

## 🐛 Troubleshooting

### If TTS doesn't work:
1. Check Logcat for errors: `adb logcat | grep -i tts`
2. Verify plugin is loaded: Look for "Using native Capacitor TTS" in console
3. Check device TTS settings: Settings > Accessibility > Text-to-Speech

### Common Issues:
- **"Text-to-Speech not initialized"**: TTS engine may be loading. Wait a moment and try again.
- **Wrong language voice**: Device may not have Kurdish/Arabic voices installed. Install from Google Play Store.

## ✅ Status

- ✅ Native Android TTS plugin created
- ✅ TypeScript integration complete
- ✅ Auto-detection of platform (native vs web)
- ✅ Language support (Kurdish, Arabic, English)
- ✅ Error handling and fallbacks
- ✅ Ready for testing on Android device


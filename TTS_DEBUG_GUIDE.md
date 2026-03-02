# TTS Debugging Guide

## 🔍 What to Check When TTS Button Doesn't Work

### Step 1: Check Console Logs

When you click the TTS button, you should see these logs in order:

1. `"TTS button clicked"` - Button was clicked
2. `"TTS toggle() called"` - Toggle function started
3. `"TextToSpeech: Using native Capacitor TTS"` - Native plugin detected
4. `"TTS play() called"` - Play function started
5. `"TextToSpeech: Checking native TTS availability..."` - Checking if TTS is available
6. `"TextToSpeech: Native TTS available: true/false"` - Availability result
7. `"TextToSpeech: Using native TTS to speak"` - Starting to speak
8. `"TextToSpeech: Calling native speak with text length: X"` - Text prepared
9. `"TextToSpeech: Native speak completed"` - Speech finished

### Step 2: Check for Errors

Look for these error messages:

- `"Text-to-speech not available"` - TTS not initialized
- `"Native TTS not available"` - Plugin not found or not working
- `"Text-to-Speech not initialized"` - Android TTS engine not ready
- `"Error speaking text"` - Error from Android TTS

### Step 3: Verify Plugin Registration

In Android Studio Logcat, filter by "TextToSpeech" or "Capacitor" and look for:
- Plugin loading messages
- Any Java exceptions
- TTS initialization errors

### Step 4: Test Native Plugin Directly

You can test if the plugin is registered by running this in the browser console (on Android device):

```javascript
import { Capacitor } from '@capacitor/core';
console.log('Is native:', Capacitor.isNativePlatform());

// Try to call the plugin
const { TextToSpeech } = await import('@capacitor/core');
// This should work if plugin is registered
```

### Common Issues:

1. **Plugin Not Found**
   - Solution: Run `npx cap sync` to register the plugin
   - Check that `TextToSpeechPlugin.java` is in the correct location

2. **TTS Not Initialized**
   - Android TTS engine takes time to initialize
   - Wait a moment and try again
   - Check device TTS settings

3. **No Text to Speak**
   - Check that `textContent` has content
   - Verify resource HTML content is loaded

4. **Button Click Not Working**
   - Check if button is visible and clickable
   - Look for JavaScript errors in console
   - Verify `toggle` function is being called

### Quick Fix Commands:

```bash
# Rebuild and sync
npm run build
npx cap sync

# Open Android Studio
npm run cap:open:android
```

### Next Steps:

1. Rebuild the app: `npm run build && npx cap sync`
2. Run on device and check console logs
3. Share the console output if still not working


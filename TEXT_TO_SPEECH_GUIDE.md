# Text-to-Speech Feature Guide

## 🎙️ Overview

The app now includes text-to-speech functionality that reads content aloud in Kurdish, Arabic, and English. This is especially helpful for users who cannot read or prefer to listen to content.

## ✨ Features

- **Multi-language support**: Kurdish (ku), Arabic (ar), and English (en)
- **Play/Pause controls**: Start, pause, resume, and stop reading
- **Visual indicators**: Shows when content is being read
- **Automatic text extraction**: Extracts clean text from HTML content
- **Smart voice selection**: Automatically finds the best voice for the language

## 🎯 How It Works

### For Users:

1. **Navigate to a resource** (e.g., "How to register with GP")
2. **Click the speaker icon** (🔊) in the header
3. **Content starts reading** automatically
4. **Use controls**:
   - Click again to pause
   - Click play to resume
   - Click stop (X) to stop reading

### Visual Indicators:

- **🔊 Icon**: Ready to play
- **⏸️ Icon**: Currently playing (click to pause)
- **▶️ Icon**: Paused (click to resume)
- **Reading indicator**: Blue banner at top of content when playing

## 🔧 Technical Details

### Browser Support

The feature uses the **Web Speech API** (`speechSynthesis`), which is supported in:
- ✅ Chrome/Edge (full support)
- ✅ Safari (full support)
- ✅ Firefox (full support)
- ⚠️ Some mobile browsers may have limited voice options

### Language Codes

- **Kurdish**: Uses `ku` or `ckb` (Central Kurdish)
- **Arabic**: Uses `ar-SA` (Saudi Arabic)
- **English**: Uses `en-GB` (British English)

### Voice Selection

The system automatically:
1. Tries to find a voice matching the language
2. Falls back to the best available voice if exact match not found
3. Uses system default voices (varies by device/browser)

## 📝 Implementation

### Files Created:

1. **`utils/textToSpeech.ts`**: Core text-to-speech functionality
2. **`hooks/useTextToSpeech.ts`**: React hook for easy integration
3. **`pages/ResourceDetail.tsx`**: Updated with TTS controls

### Usage Example:

```typescript
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const { isPlaying, isPaused, isAvailable, play, pause, stop, toggle } = 
    useTextToSpeech(textContent, language);
```

## 🧪 Testing

### Test the Feature:

1. **Start the app**: `npm run dev`
2. **Navigate to a resource** with HTML content
3. **Click the speaker icon** in the header
4. **Verify**:
   - Content starts reading
   - Pause button appears
   - Reading indicator shows
   - Can pause/resume/stop

### Test with Kurdish Content:

1. Go to Healthcare category
2. Click "How to register with GP" (if you've added it to Supabase)
3. Click the speaker icon
4. Should read in Kurdish (if Kurdish voice is available)

## ⚠️ Known Limitations

1. **Voice Availability**: 
   - Kurdish voices may not be available on all devices
   - System will use best available voice
   - Users may need to install language packs

2. **Mobile Browsers**:
   - Some mobile browsers have limited voice options
   - May need to use system TTS instead

3. **Long Content**:
   - Very long content may take time to process
   - Consider breaking into sections for better UX

## 🔮 Future Enhancements

Possible improvements:
- [ ] Highlight text as it's being read
- [ ] Adjustable reading speed
- [ ] Save reading position
- [ ] Offline TTS support
- [ ] Better Kurdish voice support

## 🐛 Troubleshooting

### "Text-to-speech not available"

- Check browser support: `'speechSynthesis' in window`
- Try a different browser (Chrome/Edge recommended)
- Check browser permissions

### "Voice not found for Kurdish"

- System will use best available voice
- May need to install language packs on device
- Try switching to Arabic or English to test

### "Reading stops unexpectedly"

- Check browser console for errors
- May be due to browser restrictions
- Try refreshing the page

## 📚 Resources

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)


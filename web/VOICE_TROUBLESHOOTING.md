# Voice Commands Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue: "Bad Request - Field Required" Error

**Problem**: OpenAI API returns error about missing 'file' field
```
{"error": {"message": "[{'type': 'missing', 'loc': ('body', 'file'), 'msg': 'Field required', 'input': None}]"}}
```

**Solutions**:

#### 1. Check API Key
Make sure your OpenAI API key is correctly set in `.env`:
```env
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

#### 2. Verify API Key Permissions
- Log into OpenAI dashboard
- Check if your API key has Whisper API access
- Ensure you have sufficient credits/quota

#### 3. Test API Key
Add this test to your browser console:
```javascript
// Test if API key works
const testKey = import.meta.env.VITE_OPENAI_API_KEY;
console.log('API Key exists:', !!testKey);
console.log('API Key starts with sk-:', testKey?.startsWith('sk-'));
```

#### 4. Browser Compatibility Issues
The OpenAI SDK in browsers can be tricky. Try these fixes:

**Option A: Use Fallback Voice Commands**
```javascript
// In UserHome.jsx, switch to simple voice commands
import { useSimpleVoiceCommands } from '../../../hooks/user/useSimpleVoiceCommands';

// Replace OpenAI button with browser-based one
<VoiceCommandButton services={services} onServiceFilter={handleVoiceServiceFilter} />
```

**Option B: Backend Proxy (Recommended for Production)**
Create a backend endpoint to handle OpenAI calls:

```javascript
// server/routes/voiceRoutes.js
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: req.file,
      model: 'whisper-1'
    });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Issue: Microphone Not Working

**Solutions**:
1. **Allow Microphone Access**: Click "Allow" when browser asks
2. **Check Browser Settings**: Ensure mic permissions are enabled
3. **HTTPS Required**: Voice recording needs HTTPS in production
4. **Test Microphone**: Try other apps to ensure mic works

### Issue: Poor Recognition Accuracy

**Solutions**:
1. **Speak Clearly**: Normal pace, clear pronunciation
2. **Reduce Background Noise**: Find quiet environment
3. **Use Specific Terms**: "dry clean pant" vs "clean clothes"
4. **Check Audio Quality**: Ensure good microphone

### Issue: Commands Not Recognized

**Solutions**:
1. **Use Exact Phrases**: Follow the command examples
2. **Check Service Names**: Ensure services exist in your app
3. **Try Variations**: "add to cart" vs "put in cart"

## 🔧 Quick Fixes

### Fix 1: Switch to Browser Speech Recognition
```javascript
// In UserHome.jsx
import VoiceCommandButton from "../../../components/user/VoiceCommandButton";

// Use this instead of OpenAI version
<VoiceCommandButton services={services} onServiceFilter={handleVoiceServiceFilter} />
```

### Fix 2: Test Without OpenAI
```javascript
// Temporarily disable OpenAI and test basic functionality
const processVoiceCommand = (text) => {
  console.log('Voice command:', text);
  // Basic keyword matching
  if (text.includes('cart')) {
    console.log('Cart command detected');
  }
};
```

### Fix 3: Check Network Issues
```javascript
// Test network connectivity
fetch('https://api.openai.com/v1/models', {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  }
})
.then(response => console.log('OpenAI API accessible:', response.ok))
.catch(error => console.error('Network error:', error));
```

## 🎯 Working Alternatives

### Option 1: Browser Speech Recognition (react-speech-recognition)
- ✅ Works offline
- ✅ No API costs
- ❌ Less accurate
- ❌ Browser dependent

### Option 2: OpenAI via Backend
- ✅ More secure
- ✅ Better error handling
- ✅ Rate limiting control
- ❌ Requires backend setup

### Option 3: Other Speech APIs
- Google Speech-to-Text
- Azure Speech Services
- AWS Transcribe

## 📝 Debug Steps

1. **Check Console Errors**
   ```javascript
   // Look for these in browser console
   - "API key not found"
   - "Network error"
   - "Microphone access denied"
   ```

2. **Test Audio Recording**
   ```javascript
   // Test if audio recording works
   navigator.mediaDevices.getUserMedia({ audio: true })
     .then(stream => console.log('Microphone works'))
     .catch(error => console.error('Mic error:', error));
   ```

3. **Verify File Creation**
   ```javascript
   // Check if audio file is created properly
   const audioFile = new File([audioBlob], 'test.webm', { type: 'audio/webm' });
   console.log('File created:', audioFile.name, audioFile.size);
   ```

## 🚀 Recommended Solution

For immediate testing, use the browser-based speech recognition:

1. **Comment out OpenAI button** in UserHome.jsx
2. **Uncomment regular VoiceCommandButton**
3. **Test basic voice commands**
4. **Add OpenAI later** when API issues are resolved

This ensures your voice command feature works while you troubleshoot the OpenAI integration.

## 📞 Support

If issues persist:
1. Check OpenAI status page
2. Verify billing/quota in OpenAI dashboard  
3. Test with a fresh API key
4. Use browser speech recognition as fallback
# Quick Start Guide

## Installation

1. Navigate to the web app directory:
```bash
cd apps/web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

## Features Available

✅ **Four Beautiful Themes**: Switch between Under Stars, Mountain Summit, Above Clouds, and Ocean Night

✅ **Multi-language Support**: Choose from Auto, English, Hindi, or Punjabi

✅ **Text-to-Speech**: The app will speak the guidance using your browser's built-in speech synthesis

✅ **Audio Feedback**: Chime sounds play when you interact with the light

✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

## Browser Requirements

- Modern browser with Web Speech API support (Chrome, Edge, Firefox, Safari 14.5+)
- JavaScript enabled
- Audio playback may require user interaction on some browsers

## Troubleshooting

### Text-to-Speech Not Working
- Make sure your browser supports the Web Speech API
- Check browser permissions for speech synthesis
- Try a different browser (Chrome/Edge recommended)

### Audio Not Playing
- Some browsers require user interaction before playing audio
- Make sure audio files are in `public/audio/` directory
- Check browser console for errors

### Build Issues
- Make sure Node.js version is 18 or higher
- Delete `node_modules` and `.next` folder, then run `npm install` again


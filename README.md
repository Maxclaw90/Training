# Fitness Form Checker

A React Native Expo app that uses your device's camera to analyze exercise form in real-time using TensorFlow.js pose detection.

## Features

- 📹 Real-time camera preview with pose detection
- 🏋️ Exercise form analysis and feedback
- 💾 Save workout recordings
- 📊 Track your progress over time

## Prerequisites

- Node.js 18+ and npm/yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) for building
- iOS: macOS with Xcode (for iOS builds)
- Android: Android Studio (for Android builds)

## Installation

```bash
# Install dependencies
npm install

# Install EAS CLI globally (if not already installed)
npm install -g eas-cli
```

## Running on Device

### Development Build (Recommended)

Development builds include the native code required for camera access and TensorFlow.js:

```bash
# Create a development build
npm run build:ios      # For iOS
npm run build:android  # For Android

# Or use preview profile for quick testing
npm run build:ios:preview
npm run build:android:preview
```

After the build completes, install the app on your device using the QR code or download link provided by EAS.

### Running the Development Server

```bash
# Start the development client
npm run dev

# Or use Expo Go (limited functionality)
npm start
```

## Building for App Store / Play Store

### iOS App Store

1. **Configure App Store Connect**
   - Create an App ID in Apple Developer Portal
   - Set up App Store Connect API Key
   - Update `eas.json` with your API credentials

2. **Build and Submit**
   ```bash
   # Build for production
   eas build --platform ios --profile production
   
   # Or build and submit in one command
   eas build --platform ios --profile production --auto-submit
   ```

3. **Manual Submission**
   ```bash
   npm run submit:ios
   ```

### Google Play Store

1. **Configure Google Play Console**
   - Create a new app in Google Play Console
   - Set up app signing

2. **Build and Submit**
   ```bash
   # Build AAB (Android App Bundle)
   eas build --platform android --profile production
   
   # Or build and submit
   eas build --platform android --profile production --auto-submit
   ```

## EAS Build Instructions

### Build Profiles

The `eas.json` file contains three build profiles:

| Profile | Use Case | Distribution |
|---------|----------|--------------|
| `development` | Local development with hot reload | Internal |
| `preview` | Testing before production | Internal (APK) |
| `production` | App Store / Play Store release | Store |

### Build Commands

```bash
# iOS builds
eas build --platform ios --profile development
eas build --platform ios --profile preview
eas build --platform ios --profile production

# Android builds
eas build --platform android --profile development
eas build --platform android --profile preview
eas build --platform android --profile production

# Local builds (requires macOS for iOS)
eas build --platform ios --local
eas build --platform android --local
```

### Environment Variables

Create a `.env` file for local development:

```bash
EXPO_PUBLIC_API_URL=https://your-api.com
```

## Project Structure

```
fitness-form-checker-expo/
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies and scripts
├── assets/               # Icons and splash screens
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash.png
│   └── favicon.png
└── src/
    ├── components/       # React components
    ├── hooks/            # Custom hooks
    ├── utils/            # Utility functions
    └── types/            # TypeScript types
```

## Required Permissions

### iOS

- **Camera**: Used for real-time pose detection
- **Photo Library**: Save workout recordings
- **Microphone**: Audio recording with videos

### Android

- **Camera**: Real-time pose detection
- **Record Audio**: Video recording with sound
- **Storage**: Save workout recordings

## Troubleshooting

### Camera not working in Expo Go

This app requires native modules that aren't available in Expo Go. Use a development build instead:

```bash
npm run build:ios:preview  # or build:android:preview
```

### Build fails on iOS

Make sure you have:
- macOS with Xcode 14+
- Valid Apple Developer account
- Bundle identifier is unique

### Build fails on Android

- Ensure Android SDK is installed
- Check that `ANDROID_HOME` environment variable is set

## License

MIT

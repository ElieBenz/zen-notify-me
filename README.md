
# Zen Notify Me - Expo Version

A mindful reminder app built with React Native and Expo.

## Features

- ✨ Beautiful, zen-inspired interface
- 📱 Native mobile experience
- 🔔 Local push notifications
- 📅 Smart categorization and priorities
- 💾 Offline-first with AsyncStorage
- 🎨 Custom clock logo integration

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go app on your mobile device

### Building for Production

1. For Android APK:
   ```bash
   expo build:android
   ```

2. For iOS (requires Apple Developer account):
   ```bash
   expo build:ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── hooks/              # Custom React hooks
├── context/            # React context providers
└── types/              # Type definitions
```

## Key Differences from Web Version

- Uses React Native components instead of HTML/CSS
- AsyncStorage instead of localStorage
- Expo Notifications for push notifications
- Native navigation with React Navigation
- Platform-specific styling with StyleSheet

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

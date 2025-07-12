# Tim Grow - Mobile App

A professional business booking platform with native Android and iOS apps built with Capacitor.js.

## Features

- 📱 Native Android & iOS apps
- 🗓️ Booking system with calendar integration
- 💼 Business dashboard and management
- 🎨 Custom branding and theming
- 📊 Analytics and reporting
- 🔗 Third-party integrations
- 🌐 Website builder integration

## Quick Start

### Prerequisites

- Node.js 18+
- Java 17 (for Android builds)
- Android Studio (for local development)

### Installation

```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Sync with Capacitor
npx cap sync android

# Run on Android
npx cap run android
```

## Mobile App Development

### Building APK

This project is configured for automatic APK builds using Codemagic CI/CD.

1. **Push to GitHub**: All commits to the `main` branch trigger builds
2. **Automatic Build**: Codemagic builds the APK automatically
3. **Download**: Built APK is available in the artifacts

### Manual Build

```bash
# Build web app
npm run build

# Sync with Android
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug
```

## Project Structure

```
├── android/           # Android native project
├── client/           # React TypeScript frontend
├── server/           # Express.js backend
├── shared/           # Shared types and schemas
├── capacitor.config.ts  # Capacitor configuration
├── codemagic.yaml    # CI/CD configuration
└── package.json      # Dependencies
```

## Development Workflow

1. **Make changes** to the web app in `client/`
2. **Build** the app: `npm run build`
3. **Sync** with Capacitor: `npx cap sync android`
4. **Test** on device: `npx cap run android`
5. **Push** to GitHub for automatic APK builds

## CI/CD with Codemagic

The `codemagic.yaml` file configures automatic builds:

- **Trigger**: Push to main branch
- **Build Time**: 6-10 minutes
- **Output**: Debug APK ready for testing
- **Environment**: Java 17, Node.js 18

## Environment Variables

For production builds, set these in Codemagic:

```bash
DATABASE_URL=your_database_url
```

## License

Private - Tim Grow Platform
# Harmee Social - Android APK Build Guide

This document explains how to build a real, installable debug APK for the Harmee Social Android app.

## Prerequisites

Before building the APK, ensure you have:

1. **Android SDK** (API Level 34)
   - Download from: https://developer.android.com/studio
   - Set `ANDROID_HOME` environment variable

2. **Java Development Kit (JDK)** 8 or higher
   - Download from: https://www.oracle.com/java/technologies/downloads/

3. **Gradle** (included in project)

## Build Instructions

### Option 1: Using the Build Script (Linux/macOS)

```bash
chmod +x BUILD_APK.sh
./BUILD_APK.sh
```

### Option 2: Manual Build

```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
mkdir -p .build-outputs APK_DOWNLOAD
cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/
```

### Option 3: Using Android Studio

1. Open `android` folder in Android Studio
2. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
3. Wait for the build to complete
4. The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Copy to `.build-outputs/` and `APK_DOWNLOAD/` folders

## Output Locations

After successful build, the APK will be available at:

- **Primary:** `.build-outputs/app-debug.apk` (Build outputs folder)
- **Download:** `APK_DOWNLOAD/app-debug.apk` (Easy-to-find folder)

## Installation

### On a Connected Device or Emulator

```bash
adb install APK_DOWNLOAD/app-debug.apk
```

### Using Android Studio

1. Connect your Android device or start the emulator
2. Open Android Studio
3. Click "Run" → "Run 'app'"

## APK Specifications

- **App Name:** Harmee Social
- **Package Name:** com.harmeesocial.app
- **Min SDK:** API 21 (Android 5.0)
- **Target SDK:** API 34 (Android 14)
- **Version Code:** 1
- **Version Name:** 1.0.0

## Troubleshooting

### Build Fails: "ANDROID_HOME not set"
Set the environment variable:
```bash
export ANDROID_HOME=/path/to/android-sdk
```

### Build Fails: "gradlew permission denied"
```bash
chmod +x android/gradlew
```

### APK Installation Fails on Device
- Ensure device has Developer Mode enabled
- Check USB connection: `adb devices`
- Uninstall existing app: `adb uninstall com.harmeesocial.app`

## Features Included

✓ Video sharing capability
✓ Messaging system
✓ User communities
✓ Real-time engagement
✓ Firebase integration
✓ Camera and audio permissions
✓ WebView for web app integration

## Build Output Verification

The build script verifies:
- APK file exists and is not empty
- APK file size is greater than 1 MB
- Both copy locations contain valid APK

## Support

For issues or questions:
- Check Android logcat: `adb logcat`
- Review build output in Android Studio
- Check Gradle sync errors

---

**Build Date:** Generated on demand
**APK Type:** Debug Build (Unsigned, for testing only)

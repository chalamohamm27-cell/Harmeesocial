# Android Build Guide

This guide walks you through compiling the application into an Android APK.

## Prerequisites
- Android Studio or Android SDK Command-line Tools
- Java Development Kit (JDK) 17

## 1. Local Debug Build (Fastest)
A debug build is great for testing locally in emulators or sideloading on your device.

Run the local build script from the root directory:
```bash
./BUILD_APK.sh
```

Alternatively:
```bash
cd android
./gradlew assembleDebug
```

## 2. Release Build (For App Stores)
For a production-ready package, you will build the release variant:

```bash
cd android
./gradlew assembleRelease
```
*Note: You may need to configure resigning keys in your `android/app/build.gradle.kts` to deploy app store-ready APKs or App Bundles (AAB).*

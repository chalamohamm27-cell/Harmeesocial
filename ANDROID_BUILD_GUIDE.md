# APK Build Documentation

This guide explains how the APK build process works and how to use the generated artifacts.

## Table of Contents

1. [Automated GitHub Actions Build](#automated-github-actions-build)
2. [Local Build Process](#local-build-process)
3. [APK Output Structure](#apk-output-structure)
4. [Installation Instructions](#installation-instructions)
5. [Troubleshooting](#troubleshooting)

## Automated GitHub Actions Build

### GitHub Actions Workflow

The project includes an automated build workflow (`.github/workflows/build-apk.yml`) that:

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - Pull requests to `main` or `develop`
   - Manual trigger (workflow_dispatch)

2. **Build Steps:**
   - Sets up Java 17 environment
   - Downloads Android SDK
   - Runs `./gradlew clean`
   - Runs `./gradlew assembleDebug`
   - Verifies APK integrity
   - Uploads artifacts

3. **Artifacts Generated:**
   - `.build-outputs/app-debug.apk`
   - `APK_DOWNLOAD/app-debug.apk`

### Accessing Build Artifacts

1. Go to **Actions** tab in GitHub repository
2. Select the latest workflow run
3. Scroll to **Artifacts** section
4. Download `app-debug-apk` zip file

The downloaded ZIP contains both APK copies.

## Local Build Process

### Prerequisites

```bash
# Check Java installation
java -version  # Must be 1.8 or higher

# Set Android SDK path
export ANDROID_HOME=/path/to/android-sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
```

### Build Steps

```bash
# Clone repository
git clone https://github.com/chalamohamm27-cell/Harmeesocial.git
cd Harmeesocial

# Make scripts executable
chmod +x BUILD_APK.sh
chmod +x scripts/github-actions-build.sh

# Run build
./BUILD_APK.sh
```

Or manually:

```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..

mkdir -p .build-outputs APK_DOWNLOAD
cp android/app/build/outputs/apk/debug/app-debug.apk .build-outputs/
cp android/app/build/outputs/apk/debug/app-debug.apk APK_DOWNLOAD/
```

### Android Studio Build

1. Open `android` folder in Android Studio
2. Wait for Gradle sync to complete
3. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Check **Build Output** panel for completion

## APK Output Structure

After successful build, you'll have:

```
Harmeesocial/
├── .build-outputs/
│   └── app-debug.apk          (Build output folder)
├── APK_DOWNLOAD/
│   └── app-debug.apk          (Easy download folder)
└── android/
    └── app/
        └── build/
            └── outputs/
                └── apk/
                    └── debug/
                        └── app-debug.apk  (Original build location)
```

### APK Specifications

- **App Name:** Harmee Social
- **Package Name:** `com.harmeesocial.app`
- **Version:** 1.0.0
- **Build Type:** Debug
- **Min SDK:** API 21 (Android 5.0)
- **Target SDK:** API 34 (Android 14)
- **Size:** Typically 5-15 MB (debug builds are larger)

## Installation Instructions

### Via ADB (Android Debug Bridge)

```bash
# Install on connected device
adb install APK_DOWNLOAD/app-debug.apk

# Reinstall (uninstall first)
adb uninstall com.harmeesocial.app
adb install APK_DOWNLOAD/app-debug.apk

# Install on specific device
adb -s <device-id> install APK_DOWNLOAD/app-debug.apk
```

### Via Android Studio

1. Connect device or start emulator
2. Click **Run** icon (green play button)
3. Select target device
4. App will install and launch automatically

### Via File Manager (Mobile)

1. Copy APK to device storage
2. Open file manager on device
3. Navigate to file location
4. Tap APK to install
5. Allow installation from unknown sources if prompted

### Via Web Download

1. Download `APK_DOWNLOAD/app-debug.apk` from GitHub
2. Transfer to Android device
3. Open file and install

## Build Configuration

### Gradle Properties (`android/gradle.properties`)

```properties
gradle.org.gradle.parallel=true
gradle.org.gradle.caching=true
android.useAndroidX=true
```

### Build Features (`android/app/build.gradle.kts`)

- ✓ WebView binding
- ✓ ViewBinding
- ✓ Firebase support
- ✓ Kotlin support
- ✓ ProGuard optimization (release builds)

## Troubleshooting

### Build Fails: "ANDROID_HOME not set"

```bash
# Linux/macOS
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk           # Linux

# Windows (Command Prompt)
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\sdk

# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\sdk"
```

### Build Fails: "gradlew: permission denied"

```bash
chmod +x android/gradlew
```

### Build Fails: "Java not found"

```bash
# Install Java 17 or later
# macOS
brew install openjdk@17

# Ubuntu/Debian
sudo apt-get install openjdk-17-jdk

# Verify installation
java -version
```

### Build Fails: "SDK not found"

```bash
# Download Android SDK
# macOS/Linux:
~/Library/Android/sdk/cmdline-tools/latest/bin/sdkmanager --list

# Install required packages
sdkmanager "build-tools;34.0.0"
sdkmanager "platforms;android-34"
sdkmanager "system-images;android-34;google_apis;arm64-v8a"
```

### APK Installation Fails on Device

```bash
# Check device is connected
adb devices

# Enable developer mode on device
# Settings → About Phone → Build Number (tap 7 times) → Developer Options

# Allow USB debugging
# Settings → Developer Options → USB Debugging

# Check logcat for errors
adb logcat | grep -i error

# Uninstall existing app before reinstalling
adb uninstall com.harmeesocial.app
```

### APK is Very Large (>50 MB)

- This is normal for debug builds (includes debug symbols)
- Release builds will be smaller
- Consider enabling ProGuard/R8 minification

## Advanced Build Options

### Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Requires signing configuration setup.

### Build with Specific Variant

```bash
# Build only debug
./gradlew assembleDebug

# Build specific module
./gradlew :app:assembleDebug

# Build with verbose output
./gradlew assembleDebug -v
```

### Clean Build

```bash
# Complete clean build
./gradlew clean assembleDebug

# Clean specific tasks
./gradlew clean
./gradlew --stop
```

## CI/CD Integration

### GitHub Actions

The workflow automatically builds APK on:
- Commits to main/develop
- Pull requests
- Manual trigger

Check `.github/workflows/build-apk.yml` for workflow details.

### Local CI

For local testing before commit:

```bash
./gradlew clean
./gradlew check      # Run tests
./gradlew assembleDebug
```

## Performance Tips

1. **Enable Gradle parallel builds:** Already configured
2. **Use Gradle build cache:** Already configured
3. **Increase Gradle memory:**
   ```bash
   export GRADLE_OPTS="-Xmx4096m"
   ```

4. **Use Android Studio with bundled Gradle** instead of command line

## Support & Resources

- **Android Developer Docs:** https://developer.android.com/docs
- **Gradle Documentation:** https://gradle.org/documentation/
- **GitHub Actions:** https://github.com/features/actions

---

**Last Updated:** 2026-06-07

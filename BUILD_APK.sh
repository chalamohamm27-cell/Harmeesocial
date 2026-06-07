#!/bin/bash
# Local APK build script
set -e

echo "Building Android APK locally..."

cd android
chmod +x gradlew
./gradlew assembleDebug

echo "APK built successfully!"
echo "Check: android/app/build/outputs/apk/debug/"

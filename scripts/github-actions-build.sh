#!/bin/bash
# script: scripts/github-actions-build.sh
set -e

echo "Starting GitHub Actions Build Script..."

cd android
chmod +x gradlew
./gradlew assembleRelease

echo "Build completed successfully!"

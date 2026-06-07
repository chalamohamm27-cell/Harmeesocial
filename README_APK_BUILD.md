# APK Build Quick Reference

A quick reference guide for your Android CI/CD pipelines and local build targets.

## Local Shortcuts
- **Build Demo APK:** Run `./BUILD_APK.sh` from the repository root.
- **Path to generated Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Path to generated Release:** `android/app/build/outputs/apk/release/app-release.apk`

## CI/CD 
- Automated build jobs are located in `.github/workflows/build-apk.yml`.
- Any code pushed to the `main` or `master` branches will automatically trigger the GitHub actions runner to build an APK release logic.
- Ensure the `scripts/github-actions-build.sh` maintains execution permissions (`chmod +x`). 

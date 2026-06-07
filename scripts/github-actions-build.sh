#!/bin/bash

# GitHub Actions Helper Script
# This script provides utilities for GitHub Actions builds

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Harmee Social - GitHub Actions Build${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Build APK
build_apk() {
    echo -e "\n${GREEN}Step 1: Building debug APK...${NC}"
    cd android
    ./gradlew clean --stacktrace
    ./gradlew assembleDebug --stacktrace
    cd ..
    print_success "APK build completed"
}

# Create output directories
create_directories() {
    echo -e "\n${GREEN}Step 2: Creating output directories...${NC}"
    mkdir -p .build-outputs
    mkdir -p APK_DOWNLOAD
    print_success "Output directories created"
}

# Copy APK files
copy_apk() {
    echo -e "\n${GREEN}Step 3: Copying APK files...${NC}"
    
    APK_SOURCE="android/app/build/outputs/apk/debug/app-debug.apk"
    
    if [ ! -f "$APK_SOURCE" ]; then
        print_error "Source APK not found at $APK_SOURCE"
        exit 1
    fi
    
    cp "$APK_SOURCE" ".build-outputs/app-debug.apk"
    cp "$APK_SOURCE" "APK_DOWNLOAD/app-debug.apk"
    print_success "APK files copied"
}

# Verify APK files
verify_apk() {
    echo -e "\n${GREEN}Step 4: Verifying APK files...${NC}"
    
    for apk_path in ".build-outputs/app-debug.apk" "APK_DOWNLOAD/app-debug.apk"; do
        if [ ! -f "$apk_path" ]; then
            print_error "$apk_path not found"
            exit 1
        fi
        
        SIZE=$(stat -c%s "$apk_path" 2>/dev/null || stat -f%z "$apk_path" 2>/dev/null)
        SIZE_MB=$((SIZE / 1024 / 1024))
        SIZE_KB=$((SIZE / 1024))
        
        if [ "$SIZE" -lt 1048576 ]; then
            print_warning "$apk_path - Size: ${SIZE_KB}KB (less than 1MB)"
        else
            print_success "$apk_path - Size: ${SIZE_MB}MB (${SIZE_KB}KB)"
        fi
        
        # Verify it's a valid ZIP file (APK is a ZIP archive)
        if file "$apk_path" | grep -q "Zip archive"; then
            print_success "$apk_path is a valid APK"
        else
            print_error "$apk_path is not a valid APK"
            exit 1
        fi
    done
}

# Display build information
display_info() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}Build Information${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo "Repository: $GITHUB_REPOSITORY"
    echo "Commit: ${GITHUB_SHA:0:7}"
    echo "Branch: $GITHUB_REF_NAME"
    echo "Build Number: $GITHUB_RUN_NUMBER"
    echo ""
    echo "APK Output Locations:"
    echo "  - .build-outputs/app-debug.apk"
    echo "  - APK_DOWNLOAD/app-debug.apk"
    echo ""
    echo "To download artifacts, check GitHub Actions workflow run."
    echo -e "${GREEN}========================================${NC}"
}

# Main execution
main() {
    build_apk
    create_directories
    copy_apk
    verify_apk
    display_info
    
    print_success "Build completed successfully!"
}

# Run main function
main "$@"

#!/bin/bash

# Interactive Version Updater for the Capacitor Plugin for SAP Emarsys.
# Walks you through bumping the package version (and, when available, the
# underlying native Emarsys SDK versions) across every authoritative source,
# then helps you write the changelog and commit.
#
# Version sources kept in sync:
#   - package.json                "version"      (also the plugin's iOS version;
#                                                 the podspec reads it at install time)
#   - android/build.gradle        versionName
#   - CHANGELOG.md                top "# x.y.z" header
#
# Native SDK versions (optional):
#   - android/build.gradle        com.emarsys:emarsys-sdk / emarsys-firebase (X.Y.Z)
#   - Package.swift               ios-emarsys-sdk  from: "X.Y.Z"

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# File paths
PACKAGE_JSON_PATH="$PROJECT_ROOT/package.json"
ANDROID_GRADLE_PATH="$PROJECT_ROOT/android/build.gradle"
IOS_PACKAGE_SWIFT_PATH="$PROJECT_ROOT/Package.swift"
CHANGELOG_PATH="$PROJECT_ROOT/CHANGELOG.md"

# Function to get current versions
get_current_versions() {
    echo -e "${CYAN}📋 Current Versions:${NC}"

    # Get current package version
    if [ -f "$PACKAGE_JSON_PATH" ]; then
        CURRENT_PACKAGE=$(node -pe "require('$PACKAGE_JSON_PATH').version")
        echo -e "${WHITE}   📦 Package: ${YELLOW}$CURRENT_PACKAGE${NC}"
    fi

    # Get current Android version info + native SDK version
    if [ -f "$ANDROID_GRADLE_PATH" ]; then
        CURRENT_ANDROID_VERSION_NAME=$(grep 'versionName' "$ANDROID_GRADLE_PATH" | sed 's/.*versionName "\(.*\)".*/\1/')
        CURRENT_ANDROID_VERSION_CODE=$(grep 'versionCode' "$ANDROID_GRADLE_PATH" | sed 's/.*versionCode \([0-9]*\).*/\1/')
        CURRENT_ANDROID_SDK=$(grep 'com.emarsys:emarsys-sdk:' "$ANDROID_GRADLE_PATH" | head -1 | sed "s/.*com.emarsys:emarsys-sdk:\([^'\"]*\)[\"'].*/\1/")

        echo -e "${WHITE}   🤖 Android versionName: ${YELLOW}$CURRENT_ANDROID_VERSION_NAME${NC}"
        echo -e "${WHITE}   🤖 Android versionCode: ${YELLOW}$CURRENT_ANDROID_VERSION_CODE${NC}"
        echo -e "${WHITE}   🤖 Android Emarsys SDK: ${YELLOW}$CURRENT_ANDROID_SDK${NC}"
    fi
    # Get current iOS native SDK version (from Package.swift)
    if [ -f "$IOS_PACKAGE_SWIFT_PATH" ]; then
        CURRENT_IOS_SDK=$(grep 'ios-emarsys-sdk' "$IOS_PACKAGE_SWIFT_PATH" | grep 'from:' | sed 's/.*from: *"\([^"]*\)".*/\1/')
        echo -e "${WHITE}   🍎 iOS Emarsys SDK: ${YELLOW}$CURRENT_IOS_SDK${NC}"
    fi
    echo ""
}

# Function to fetch latest native SDK versions from GitHub
fetch_latest_sdk_versions() {
    echo -e "${CYAN}🔍 Fetching latest native SDK versions from GitHub...${NC}"

    if command -v curl >/dev/null 2>&1; then
        LATEST_ANDROID=$(curl -s "https://api.github.com/repos/emartech/android-emarsys-sdk/releases/latest" 2>/dev/null | grep '"tag_name"' | sed 's/.*"tag_name": "\([^"]*\)".*/\1/' || echo "")
        if [ -n "$LATEST_ANDROID" ]; then
            echo -e "${WHITE}   🤖 Latest Android SDK: ${GREEN}$LATEST_ANDROID${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Could not fetch latest Android SDK version${NC}"
        fi

        LATEST_IOS=$(curl -s "https://api.github.com/repos/emartech/ios-emarsys-sdk/releases/latest" 2>/dev/null | grep '"tag_name"' | sed 's/.*"tag_name": "\([^"]*\)".*/\1/' || echo "")
        if [ -n "$LATEST_IOS" ]; then
            echo -e "${WHITE}   🍎 Latest iOS SDK: ${GREEN}$LATEST_IOS${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Could not fetch latest iOS SDK version${NC}"
        fi
    else
        echo -e "${YELLOW}   ⚠️  curl not available - cannot fetch latest versions${NC}"
        LATEST_ANDROID=""
        LATEST_IOS=""
    fi
    echo ""
}

# Function to calculate next package version suggestions
calculate_package_versions() {
    local current_version="$1"

    # Parse stable version (e.g., "0.2.0")
    if [[ "$current_version" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        local major="${BASH_REMATCH[1]}"
        local minor="${BASH_REMATCH[2]}"
        local patch="${BASH_REMATCH[3]}"

        SUGGESTED_PATCH="$major.$minor.$((patch + 1))"
        SUGGESTED_MINOR="$major.$((minor + 1)).0"
    # Parse beta version (e.g., "2.0.0-beta.3")
    elif [[ "$current_version" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)-beta\.([0-9]+)$ ]]; then
        local major="${BASH_REMATCH[1]}"
        local minor="${BASH_REMATCH[2]}"
        local patch="${BASH_REMATCH[3]}"
        local beta="${BASH_REMATCH[4]}"

        SUGGESTED_PATCH="$major.$minor.$patch-beta.$((beta + 1))"
        SUGGESTED_MINOR="$major.$((minor + 1)).0-beta.0"
    else
        SUGGESTED_PATCH=""
        SUGGESTED_MINOR=""
    fi
}

# Function to prompt for package version with smart suggestions
prompt_for_package_version() {
    local current_version="$1"
    local variable_name="$2"

    calculate_package_versions "$current_version"

    echo -e "${BLUE}${BOLD}📦 Package Version Update${NC}"
    echo -e "${WHITE}Current: ${YELLOW}$current_version${NC}"

    echo -e "${WHITE}Suggestions:${NC}"
    if [ -n "$SUGGESTED_PATCH" ]; then
        echo -e "${WHITE}   🔧 Patch / next prerelease: ${GREEN}$SUGGESTED_PATCH${NC}"
    fi
    if [ -n "$SUGGESTED_MINOR" ]; then
        echo -e "${WHITE}   📈 Minor bump:              ${GREEN}$SUGGESTED_MINOR${NC}"
    fi

    echo -e "${WHITE}Example: ${CYAN}0.2.0${NC} or ${CYAN}2.0.0-beta.1${NC}"
    echo ""

    local prompt_msg="? Enter new version (or press Enter to keep current"
    if [ -n "$SUGGESTED_PATCH" ]; then
        prompt_msg="$prompt_msg, 'p' for patch/next prerelease"
    fi
    if [ -n "$SUGGESTED_MINOR" ]; then
        prompt_msg="$prompt_msg, 'm' for minor"
    fi
    prompt_msg="$prompt_msg): "

    while true; do
        read -p $'\033[1;32m'"$prompt_msg"$'\033[0m' input

        if [ -z "$input" ]; then
            eval "$variable_name='$current_version'"
            echo -e "${WHITE}   → Keeping: ${YELLOW}$current_version${NC}"
            break
        elif [ "$input" = "p" ] && [ -n "$SUGGESTED_PATCH" ]; then
            eval "$variable_name='$SUGGESTED_PATCH'"
            echo -e "${WHITE}   → ${GREEN}$SUGGESTED_PATCH${NC}"
            break
        elif [ "$input" = "m" ] && [ -n "$SUGGESTED_MINOR" ]; then
            eval "$variable_name='$SUGGESTED_MINOR'"
            echo -e "${WHITE}   → ${GREEN}$SUGGESTED_MINOR${NC}"
            break
        elif [[ "$input" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?$ ]]; then
            eval "$variable_name='$input'"
            echo -e "${WHITE}   → New version: ${GREEN}$input${NC}"
            break
        else
            echo -e "${RED}   ✗ Invalid format. Use e.g. 0.2.0 or 2.0.0-beta.1${NC}"
        fi
    done
    echo ""
}

# Function to generate changelog entry
generate_changelog_entry() {
    local new_package_version="$1"
    local current_android="$2"
    local new_android="$3"
    local current_ios="$4"
    local new_ios="$5"

    local entry=""
    entry="# $new_package_version\n"

    # SDK Updates section (if any)
    if [ "$current_android" != "$new_android" ] || [ "$current_ios" != "$new_ios" ]; then
        entry="${entry}## What's changed\n"
        if [ "$current_android" != "$new_android" ]; then
            entry="${entry}* Updated underlying Android Emarsys SDK to $new_android\n"
        fi
        if [ "$current_ios" != "$new_ios" ]; then
            entry="${entry}* Updated underlying iOS Emarsys SDK to $new_ios\n"
        fi
        entry="${entry}\n"
    fi

    # Placeholder sections for manual additions
    entry="${entry}<!-- Uncomment and fill in the sections you need:\n\n"
    entry="${entry}## What's new\n"
    entry="${entry}* Description of new features\n\n"
    entry="${entry}## What's fixed\n"
    entry="${entry}* Description of bug fixes\n\n"
    entry="${entry}## What's changed\n"
    entry="${entry}* Description of changes or improvements\n\n"
    entry="${entry}-->\n\n"

    echo -e "$entry"
}

# Function to update changelog (prepend, preserving history)
update_changelog() {
    local new_package_version="$1"
    local current_android="$2"
    local new_android="$3"
    local current_ios="$4"
    local new_ios="$5"

    local changelog_entry
    changelog_entry=$(generate_changelog_entry "$new_package_version" "$current_android" "$new_android" "$current_ios" "$new_ios")

    if [ -f "$CHANGELOG_PATH" ]; then
        local existing
        existing=$(cat "$CHANGELOG_PATH")
        printf '%s\n%s\n' "$changelog_entry" "$existing" > "$CHANGELOG_PATH"
    else
        printf '%s\n' "$changelog_entry" > "$CHANGELOG_PATH"
    fi
}

# Function to check git status
check_git_status() {
    echo -e "${CYAN}🔍 Checking git status...${NC}"

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Not in a git repository. Please run this script from within a git repository.${NC}"
        exit 1
    fi

    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo -e "${RED}❌ You have uncommitted changes in your repository.${NC}"
        echo -e "${WHITE}Please commit or stash your changes before running the version updater.${NC}"
        echo ""
        echo -e "${YELLOW}Uncommitted changes:${NC}"
        git status --porcelain
        echo ""
        exit 1
    else
        echo -e "${GREEN}✅ Git status is clean - ready to proceed!${NC}"
        echo ""
    fi
}

# Main script
echo -e "${BOLD}${GREEN}🚀 Capacitor Plugin for SAP Emarsys - Version Updater${NC}"
echo -e "${WHITE}This tool will guide you through updating the package and native SDK versions.${NC}"
echo ""

check_git_status
get_current_versions
fetch_latest_sdk_versions

# Decide whether native SDK updates are on offer (differ by full version)
ANDROID_UPDATE_AVAILABLE=false
if [ -n "$LATEST_ANDROID" ] && [ -n "$CURRENT_ANDROID_SDK" ] && [ "$LATEST_ANDROID" != "$CURRENT_ANDROID_SDK" ]; then
    ANDROID_UPDATE_AVAILABLE=true
fi

IOS_UPDATE_AVAILABLE=false
if [ -n "$LATEST_IOS" ] && [ -n "$CURRENT_IOS_SDK" ] && [ "$LATEST_IOS" != "$CURRENT_IOS_SDK" ]; then
    IOS_UPDATE_AVAILABLE=true
fi

echo -e "${CYAN}📊 Update Analysis:${NC}"
if [ "$ANDROID_UPDATE_AVAILABLE" = true ]; then
    echo -e "${WHITE}   🤖 Android SDK: ${YELLOW}$CURRENT_ANDROID_SDK${NC} → ${GREEN}$LATEST_ANDROID${NC} ${CYAN}(update available!)${NC}"
elif [ -n "$CURRENT_ANDROID_SDK" ]; then
    echo -e "${WHITE}   🤖 Android SDK: ${GREEN}$CURRENT_ANDROID_SDK${NC} ${CYAN}(up to date)${NC}"
fi
if [ "$IOS_UPDATE_AVAILABLE" = true ]; then
    echo -e "${WHITE}   🍎 iOS SDK: ${YELLOW}$CURRENT_IOS_SDK${NC} → ${GREEN}$LATEST_IOS${NC} ${CYAN}(update available!)${NC}"
elif [ -n "$CURRENT_IOS_SDK" ]; then
    echo -e "${WHITE}   🍎 iOS SDK: ${GREEN}$CURRENT_IOS_SDK${NC} ${CYAN}(up to date)${NC}"
fi
echo -e "${WHITE}   📦 Package: ${YELLOW}$CURRENT_PACKAGE${NC} ${CYAN}(can always be updated)${NC}"
echo ""

# Initialize with current values
NEW_ANDROID_SDK="$CURRENT_ANDROID_SDK"
NEW_IOS_SDK="$CURRENT_IOS_SDK"

STEP_COUNT=1

# Step 1: Android SDK Update (only if update available)
if [ "$ANDROID_UPDATE_AVAILABLE" = true ]; then
    echo -e "${BLUE}${BOLD}🤖 Step $STEP_COUNT: Android SDK Update Available${NC}"
    echo -e "${WHITE}Current: ${YELLOW}$CURRENT_ANDROID_SDK${NC}"
    echo -e "${WHITE}Latest:  ${GREEN}$LATEST_ANDROID${NC}"
    echo ""

    while true; do
        read -p $'\033[1;32m? Update to latest Android SDK version? (Y/n): \033[0m' android_update
        android_update=${android_update:-y}

        if [[ "$android_update" =~ ^[Yy]$ ]]; then
            NEW_ANDROID_SDK="$LATEST_ANDROID"
            echo -e "${WHITE}   → Will update to: ${GREEN}$NEW_ANDROID_SDK${NC}"
            break
        elif [[ "$android_update" =~ ^[Nn]$ ]]; then
            echo -e "${WHITE}   → Keeping current: ${YELLOW}$CURRENT_ANDROID_SDK${NC}"
            break
        else
            echo -e "${RED}   ✗ Please answer 'y' for yes or 'n' for no${NC}"
        fi
    done
    echo ""
    STEP_COUNT=$((STEP_COUNT + 1))
fi

# Step 2: iOS SDK Update (only if update available)
if [ "$IOS_UPDATE_AVAILABLE" = true ]; then
    echo -e "${BLUE}${BOLD}🍎 Step $STEP_COUNT: iOS SDK Update Available${NC}"
    echo -e "${WHITE}Current: ${YELLOW}$CURRENT_IOS_SDK${NC}"
    echo -e "${WHITE}Latest:  ${GREEN}$LATEST_IOS${NC}"
    echo ""

    while true; do
        read -p $'\033[1;32m? Update to latest iOS SDK version? (Y/n): \033[0m' ios_update
        ios_update=${ios_update:-y}

        if [[ "$ios_update" =~ ^[Yy]$ ]]; then
            NEW_IOS_SDK="$LATEST_IOS"
            echo -e "${WHITE}   → Will update to: ${GREEN}$NEW_IOS_SDK${NC}"
            break
        elif [[ "$ios_update" =~ ^[Nn]$ ]]; then
            echo -e "${WHITE}   → Keeping current: ${YELLOW}$CURRENT_IOS_SDK${NC}"
            break
        else
            echo -e "${RED}   ✗ Please answer 'y' for yes or 'n' for no${NC}"
        fi
    done
    echo ""
    STEP_COUNT=$((STEP_COUNT + 1))
fi

# Step N: Package Version (always ask)
echo -e "${BLUE}${BOLD}📦 Step $STEP_COUNT: Package Version${NC}"
prompt_for_package_version "$CURRENT_PACKAGE" "NEW_PACKAGE_VERSION"
STEP_COUNT=$((STEP_COUNT + 1))

# versionName mirrors the full package version, including any prerelease suffix
NEW_ANDROID_VERSION_NAME="$NEW_PACKAGE_VERSION"

# versionCode is simply incremented by 1, but only when the package version changed
if [ "$CURRENT_PACKAGE" != "$NEW_PACKAGE_VERSION" ]; then
    NEW_ANDROID_VERSION_CODE=$((CURRENT_ANDROID_VERSION_CODE + 1))
else
    NEW_ANDROID_VERSION_CODE="$CURRENT_ANDROID_VERSION_CODE"
fi

# Step N+1: CHANGELOG.md Update (if package version changed OR any SDK version changed)
CHANGELOG_UPDATE_NEEDED=false
if [ "$NEW_PACKAGE_VERSION" != "$CURRENT_PACKAGE" ] || [ "$CURRENT_ANDROID_SDK" != "$NEW_ANDROID_SDK" ] || [ "$CURRENT_IOS_SDK" != "$NEW_IOS_SDK" ]; then
    CHANGELOG_UPDATE_NEEDED=true
fi

UPDATE_CHANGELOG=false
if [ "$CHANGELOG_UPDATE_NEEDED" = "true" ]; then
    echo -e "${BLUE}${BOLD}📝 Step $STEP_COUNT: CHANGELOG.md Update${NC}"

    CHANGELOG_BACKUP=""
    if [ -f "$CHANGELOG_PATH" ]; then
        CHANGELOG_BACKUP=$(cat "$CHANGELOG_PATH")
    fi

    echo -e "${WHITE}Updating CHANGELOG.md with version changes...${NC}"
    update_changelog "$NEW_PACKAGE_VERSION" "$CURRENT_ANDROID_SDK" "$NEW_ANDROID_SDK" "$CURRENT_IOS_SDK" "$NEW_IOS_SDK"
    echo -e "${GREEN}✓ CHANGELOG.md updated with a new entry${NC}"
    UPDATE_CHANGELOG=true

    echo ""
    echo -e "${YELLOW}${BOLD}📝 IMPORTANT: Manual Changelog Review Required${NC}"
    echo -e "${WHITE}Complete the top CHANGELOG.md entry by:${NC}"
    echo -e "${CYAN}   1. REMOVING the template comment block (<!-- Uncomment and fill... -->)${NC}"
    echo -e "${CYAN}   2. Adding real sections: What's new / What's fixed / What's changed${NC}"
    echo -e "${CYAN}   3. Filling in the actual changes made${NC}"
    echo ""

    if command -v code >/dev/null 2>&1; then
        echo -e "${CYAN}Opening CHANGELOG.md in VS Code...${NC}"
        code "$CHANGELOG_PATH"
    elif command -v open >/dev/null 2>&1; then
        echo -e "${CYAN}Opening CHANGELOG.md with default editor...${NC}"
        open "$CHANGELOG_PATH"
    else
        echo -e "${YELLOW}Please edit: $CHANGELOG_PATH${NC}"
    fi

    echo ""
    echo -e "${WHITE}Press any key when you have finished editing the changelog...${NC}"
    read -n 1 -s
    echo ""

    if grep -q "<!-- Uncomment and fill in the sections you need:" "$CHANGELOG_PATH" 2>/dev/null; then
        echo -e "${RED}❌ Template comments still present in CHANGELOG.md${NC}"
        echo -e "${WHITE}You must remove the template comments and add actual changelog content.${NC}"
        echo -e "${YELLOW}🔄 Restoring original CHANGELOG.md and discarding all changes...${NC}"
        if [ -n "$CHANGELOG_BACKUP" ]; then
            printf '%s\n' "$CHANGELOG_BACKUP" > "$CHANGELOG_PATH"
        elif [ -f "$CHANGELOG_PATH" ]; then
            rm "$CHANGELOG_PATH"
        fi
        echo ""
        echo -e "${YELLOW}Update cancelled. No files have been modified.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Changelog properly completed - proceeding with update${NC}"
    echo ""
    STEP_COUNT=$((STEP_COUNT + 1))
fi

# Summary of changes
echo -e "${CYAN}${BOLD}📋 Summary of Changes:${NC}"
echo -e "${WHITE}   📦 Package:     ${YELLOW}$CURRENT_PACKAGE${NC} → ${GREEN}$NEW_PACKAGE_VERSION${NC}"
echo -e "${WHITE}   🤖 Android SDK: ${YELLOW}$CURRENT_ANDROID_SDK${NC} → ${GREEN}$NEW_ANDROID_SDK${NC}"
echo -e "${WHITE}   🍎 iOS SDK:     ${YELLOW}$CURRENT_IOS_SDK${NC} → ${GREEN}$NEW_IOS_SDK${NC}"
echo -e "${WHITE}   🤖 versionName: ${YELLOW}$CURRENT_ANDROID_VERSION_NAME${NC} → ${GREEN}$NEW_ANDROID_VERSION_NAME${NC} ${CYAN}(derived)${NC}"
echo -e "${WHITE}   🤖 versionCode: ${YELLOW}$CURRENT_ANDROID_VERSION_CODE${NC} → ${GREEN}$NEW_ANDROID_VERSION_CODE${NC} ${CYAN}(derived)${NC}"
if [ "$UPDATE_CHANGELOG" = true ]; then
    echo -e "${WHITE}   📝 Changelog:   ${GREEN}Updated and manually reviewed${NC}"
fi
echo ""

# Check if any changes were made
CHANGES_MADE=false
if [ "$CURRENT_PACKAGE" != "$NEW_PACKAGE_VERSION" ]; then CHANGES_MADE=true; fi
if [ "$CURRENT_ANDROID_SDK" != "$NEW_ANDROID_SDK" ]; then CHANGES_MADE=true; fi
if [ "$CURRENT_IOS_SDK" != "$NEW_IOS_SDK" ]; then CHANGES_MADE=true; fi
if [ "$UPDATE_CHANGELOG" = true ]; then CHANGES_MADE=true; fi

if [ "$CHANGES_MADE" = false ]; then
    echo -e "${YELLOW}ℹ️  No changes detected. All versions remain the same.${NC}"
    exit 0
fi

# Final confirmation
echo -e "${BOLD}${BLUE}🤔 Do you want to apply these changes?${NC}"
read -p $'\033[1;32m? Proceed with update? (y/N): \033[0m' confirm
if [[ ! "$confirm" =~ ^[yY]$ ]]; then
    echo -e "${YELLOW}❌ Update cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}🔄 Applying updates...${NC}"

UPDATE_SUCCESS=true

# Update package.json + package-lock.json - Package version
# npm version edits both files atomically (no sed/regex escaping, no separate lockfile sync).
if [ "$CURRENT_PACKAGE" != "$NEW_PACKAGE_VERSION" ]; then
    echo -ne "${WHITE}   📝 Updating package.json + package-lock.json... ${NC}"
    if (cd "$PROJECT_ROOT" && npm version "$NEW_PACKAGE_VERSION" --no-git-tag-version --allow-same-version >/dev/null 2>&1); then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        UPDATE_SUCCESS=false
    fi
fi

# Update Android build.gradle: versionName and native SDK deps
echo -ne "${WHITE}   📝 Updating android/build.gradle... ${NC}"
current_android_sdk_escaped=$(printf '%s\n' "$CURRENT_ANDROID_SDK" | sed 's/[[\.*^$()+?{|]/\\&/g')
if sed -i.tmp \
    -e "s/versionCode $CURRENT_ANDROID_VERSION_CODE/versionCode $NEW_ANDROID_VERSION_CODE/" \
    -e "s/versionName \"$CURRENT_ANDROID_VERSION_NAME\"/versionName \"$NEW_ANDROID_VERSION_NAME\"/" \
    -e "s/com\.emarsys:emarsys-sdk:$current_android_sdk_escaped/com.emarsys:emarsys-sdk:$NEW_ANDROID_SDK/g" \
    -e "s/com\.emarsys:emarsys-firebase:$current_android_sdk_escaped/com.emarsys:emarsys-firebase:$NEW_ANDROID_SDK/g" \
    "$ANDROID_GRADLE_PATH" 2>/dev/null; then
    rm "$ANDROID_GRADLE_PATH.tmp"
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    UPDATE_SUCCESS=false
fi

# Update iOS Package.swift: ios-emarsys-sdk `from:` version
if [ "$CURRENT_IOS_SDK" != "$NEW_IOS_SDK" ]; then
    echo -ne "${WHITE}   📝 Updating Package.swift... ${NC}"
    current_ios_sdk_escaped=$(printf '%s\n' "$CURRENT_IOS_SDK" | sed 's/[[\.*^$()+?{|]/\\&/g')
    if sed -i.tmp \
        -e "s/\(ios-emarsys-sdk\.git\", *from: *\"\)$current_ios_sdk_escaped\"/\1$NEW_IOS_SDK\"/" \
        "$IOS_PACKAGE_SWIFT_PATH" 2>/dev/null && grep -q "from: \"$NEW_IOS_SDK\"" "$IOS_PACKAGE_SWIFT_PATH"; then
        rm "$IOS_PACKAGE_SWIFT_PATH.tmp"
        echo -e "${GREEN}✓${NC}"
    else
        [ -f "$IOS_PACKAGE_SWIFT_PATH.tmp" ] && mv "$IOS_PACKAGE_SWIFT_PATH.tmp" "$IOS_PACKAGE_SWIFT_PATH"
        echo -e "${RED}✗${NC}"
        UPDATE_SUCCESS=false
    fi
fi

echo ""

if [ "$UPDATE_SUCCESS" != true ]; then
    echo -e "${RED}${BOLD}❌ Some updates failed. Please check the errors above.${NC}"
    exit 1
fi

# Verify all sources now agree before offering to commit
echo -ne "${WHITE}   🔎 Verifying version consistency... ${NC}"
if (cd "$PROJECT_ROOT" && bash scripts/check-version-consistency.sh >/dev/null 2>&1); then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}Version sources disagree after the update. Run scripts/check-version-consistency.sh to see the mismatch.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}${BOLD}🎉 Version update completed successfully!${NC}"
echo ""

# Next steps: review + commit
echo -e "${CYAN}${BOLD}📝 Next Steps${NC}"
echo ""

echo -e "${BLUE}${BOLD}📋 Step 1: Review Changes${NC}"
read -p $'\033[1;32m? Run git diff to review changes? (Y/n): \033[0m' review_confirm
if [[ ! "$review_confirm" =~ ^[nN]$ ]]; then
    echo ""
    (cd "$PROJECT_ROOT" && git --no-pager diff)
    echo ""
fi

echo -e "${BLUE}${BOLD}💾 Step 2: Commit Changes${NC}"
if [ "$UPDATE_CHANGELOG" = true ]; then
    COMMIT_MSG="chore: release version $NEW_PACKAGE_VERSION"
else
    COMMIT_MSG="chore: update versions"
fi

echo -e "${WHITE}Commit message will be:${NC}"
echo -e "${CYAN}\"$COMMIT_MSG\"${NC}"
echo ""

read -p $'\033[1;32m? Commit these changes? (y/N): \033[0m' commit_confirm
if [[ "$commit_confirm" =~ ^[yY]$ ]]; then
    (cd "$PROJECT_ROOT" && git add package.json package-lock.json android/build.gradle Package.swift CHANGELOG.md && git commit -m "$COMMIT_MSG")
    echo ""
    echo -e "${GREEN}${BOLD}✅ Changes committed successfully!${NC}"
    echo ""
    echo -e "${CYAN}💡 Next: push a branch and open a PR titled \"[Release] $NEW_PACKAGE_VERSION\".${NC}"
    echo -e "${WHITE}   git push -u origin <your-branch>${NC}"
else
    echo -e "${YELLOW}📝 Changes are ready but not committed.${NC}"
    echo -e "${WHITE}When you're ready, run:${NC}"
    echo -e "${CYAN}   git add package.json package-lock.json android/build.gradle Package.swift CHANGELOG.md${NC}"
    echo -e "${CYAN}   git commit -m \"$COMMIT_MSG\"${NC}"
fi

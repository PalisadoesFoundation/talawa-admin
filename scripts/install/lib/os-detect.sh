#!/bin/bash
# ==============================================================================
# Talawa Admin - OS Detection Library
# ==============================================================================
# Robust OS/WSL detection across Debian/Ubuntu, RHEL/Fedora, macOS, and WSL
# variants. Safe to source multiple times. Caches results for performance.
#
# Usage:
#   source "scripts/install/lib/os-detect.sh"
#   detect_os
#   echo "$OS_TYPE"           # macos, debian, redhat, wsl-debian, wsl-redhat, unknown
#   echo "$OS_DISPLAY_NAME"   # Human-readable OS name
#   echo "$IS_WSL"            # true or false
#
# Compatibility: Ubuntu, macOS, RHEL/Fedora, WSL (bash 3.2+)
# ==============================================================================

# ==============================================================================
# SOURCE GUARD - Prevent multiple sourcing
# ==============================================================================
[[ -n "${TALAWA_OS_DETECT_SOURCED:-}" ]] && [[ -z "${_OS_DETECT_TEST_MODE:-}" ]] && return 0
TALAWA_OS_DETECT_SOURCED=1

# ==============================================================================
# EXPORTED VARIABLES
# ==============================================================================
# These are set by detect_os() and cached for subsequent calls
export OS_TYPE=""
export OS_DISPLAY_NAME=""
export IS_WSL=false

# Internal cache flag - DO NOT USE DIRECTLY (exported for test verification)
_OS_DETECTED=false

# ==============================================================================
# CONFIGURATION VARIABLES
# ==============================================================================
# Root path for file system operations - can be overridden for testing
# Default to empty string (uses real filesystem paths)
# For testing: set _OS_DETECT_ROOT="/path/to/fixture" before sourcing
export _OS_DETECT_ROOT="${_OS_DETECT_ROOT:-}"

# OS override for macOS detection - TESTING ONLY, DO NOT USE IN PRODUCTION
# When set to "Darwin", forces is_macos() to return true (macOS detected)
# This variable is intended for unit and integration testing only. It allows
# test suites to simulate macOS environments without requiring actual macOS hardware.
# 
# Usage in tests:
#   export _TEST_OS_OVERRIDE="Darwin"
#   export _OS_DETECT_ROOT="/path/to/test/fixtures"
#   source scripts/install/lib/os-detect.sh
#   # is_macos() will now return true
#
# Important: This variable only takes effect when _OS_DETECT_ROOT is set (test mode).
# In production (when _OS_DETECT_ROOT is empty), is_macos() uses uname -s directly.
#
# Example value: "Darwin"
# Default: unset (uses actual uname -s output)

# ==============================================================================
# INTERNAL DETECTION HELPERS
# ==============================================================================

is_wsl() {
    if [[ -n "${WSL_DISTRO_NAME:-}" ]]; then
        return 0
    fi
    
    local proc_version="${_OS_DETECT_ROOT}/proc/version"
    if [[ -f "$proc_version" ]]; then
        if grep -qiE "microsoft|wsl" "$proc_version" 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

is_macos() {
    if [[ -n "${_OS_DETECT_ROOT:-}" ]]; then
        [[ "${_TEST_OS_OVERRIDE:-}" == "Darwin" ]]
    else
        [[ "$(uname -s)" == "Darwin" ]]
    fi
}

# Check if running on Debian-based system (Debian/Ubuntu)
# Returns: 0 if Debian-based, 1 otherwise
is_debian() {
    local debian_version="${_OS_DETECT_ROOT}/etc/debian_version"
    if [[ -f "$debian_version" ]]; then
        return 0
    fi
    
    local os_release="${_OS_DETECT_ROOT}/etc/os-release"
    if [[ -f "$os_release" ]]; then
        if grep -qiE 'debian|ubuntu' "$os_release" 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# Check if running on RHEL-based system (RHEL/CentOS/Fedora)
# Returns: 0 if RHEL-based, 1 otherwise
is_redhat() {
    local redhat_release="${_OS_DETECT_ROOT}/etc/redhat-release"
    if [[ -f "$redhat_release" ]]; then
        return 0
    fi
    
    local os_release="${_OS_DETECT_ROOT}/etc/os-release"
    if [[ -f "$os_release" ]]; then
        if grep -qiE 'rhel|centos|fedora|red hat' "$os_release" 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# ==============================================================================
# PUBLIC API
# ==============================================================================

# Detect the operating system and set OS_TYPE, OS_DISPLAY_NAME, and IS_WSL
# This function is idempotent - subsequent calls use cached results
# Returns: 0 always (sets exported variables)
detect_os() {
    # Return immediately if already detected (cached)
    [[ "$_OS_DETECTED" == "true" ]] && return 0
    
    # Reset IS_WSL to ensure clean detection
    IS_WSL=false
    
    # Detect WSL first
    if is_wsl; then
        IS_WSL=true
        
        # Determine WSL distribution type
        if is_debian; then
            OS_TYPE="wsl-debian"
            OS_DISPLAY_NAME="WSL (Debian/Ubuntu)"
        elif is_redhat; then
            OS_TYPE="wsl-redhat"
            OS_DISPLAY_NAME="WSL (RHEL/CentOS/Fedora)"
        else
            OS_TYPE="unknown"
            OS_DISPLAY_NAME="WSL (Unknown)"
        fi
    # Check for native macOS
    elif is_macos; then
        OS_TYPE="macos"
        OS_DISPLAY_NAME="macOS"
    # Check for native Debian/Ubuntu
    elif is_debian; then
        OS_TYPE="debian"
        OS_DISPLAY_NAME="Debian/Ubuntu"
    # Check for native RHEL/CentOS/Fedora
    elif is_redhat; then
        OS_TYPE="redhat"
        OS_DISPLAY_NAME="RHEL/CentOS/Fedora"
    # Unknown OS
    else
        OS_TYPE="unknown"
        OS_DISPLAY_NAME="Unknown OS"
    fi
    
    # Mark detection as complete
    _OS_DETECTED=true
    
    # Export all variables for use in calling scripts
    export OS_TYPE
    export OS_DISPLAY_NAME
    export IS_WSL
    export _OS_DETECTED
    
    return 0
}

# Get the human-readable OS display name
# Usage: display_name=$(get_os_display_name)
# Returns: Human-readable OS name (via stdout)
get_os_display_name() {
    detect_os
    printf "%s\n" "$OS_DISPLAY_NAME"
}

# ==============================================================================
# MANUAL TEST COMMANDS
# ==============================================================================
# To test this library, run the following commands in a bash shell:
#
# # Test sourcing (should be silent, no output)
# source ./scripts/install/lib/os-detect.sh
#
# # Test multiple sourcing (second source should be no-op)
# source ./scripts/install/lib/os-detect.sh
#
# # Test OS detection
# detect_os
# echo "OS_TYPE: $OS_TYPE"
# echo "OS_DISPLAY_NAME: $OS_DISPLAY_NAME"
# echo "IS_WSL: $IS_WSL"
#
# # Test get_os_display_name function
# display_name=$(get_os_display_name)
# echo "Display name: $display_name"
#
# # Test caching (should return immediately without re-detecting)
# time detect_os
# time detect_os  # Second call should be instant
#
# # Test idempotency (multiple calls should return same results)
# detect_os
# first_type="$OS_TYPE"
# detect_os
# second_type="$OS_TYPE"
# [[ "$first_type" == "$second_type" ]] && echo "Idempotent: PASS" || echo "Idempotent: FAIL"
#
# # Test on different systems:
# # - Ubuntu/Debian: should report "debian" or "wsl-debian"
# # - RHEL/CentOS/Fedora: should report "redhat" or "wsl-redhat"
# # - macOS: should report "macos"
# # - WSL: should set IS_WSL=true and appropriate wsl-* type
# ==============================================================================

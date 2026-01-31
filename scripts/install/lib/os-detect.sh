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
[[ -n "${TALAWA_OS_DETECT_SOURCED:-}" ]] && return 0
readonly TALAWA_OS_DETECT_SOURCED=1

# ==============================================================================
# EXPORTED VARIABLES
# ==============================================================================
# These are set by detect_os() and cached for subsequent calls
export OS_TYPE=""
export OS_DISPLAY_NAME=""
export IS_WSL=false

# ==============================================================================
# INTERNAL DETECTION HELPERS
# ==============================================================================

# Check if running in WSL (Windows Subsystem for Linux)
# Returns: 0 if WSL, 1 otherwise
is_wsl() {
    # Check WSL_DISTRO_NAME environment variable (set by WSL)
    if [[ -n "${WSL_DISTRO_NAME:-}" ]]; then
        return 0
    fi
    
    # Check /proc/version for Microsoft or WSL indicators
    if [[ -f /proc/version ]]; then
        if grep -qi "microsoft\|wsl" /proc/version 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# Check if running on macOS
# Returns: 0 if macOS, 1 otherwise
is_macos() {
    [[ "$(uname -s)" == "Darwin" ]]
}

# Check if running on Debian-based system (Debian/Ubuntu)
# Returns: 0 if Debian-based, 1 otherwise
is_debian() {
    # Check for debian_version file
    if [[ -f /etc/debian_version ]]; then
        return 0
    fi
    
    # Check os-release for Debian/Ubuntu indicators
    if [[ -f /etc/os-release ]]; then
        if grep -qiE 'debian|ubuntu' /etc/os-release 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# Check if running on RHEL-based system (RHEL/CentOS/Fedora)
# Returns: 0 if RHEL-based, 1 otherwise
is_redhat() {
    # Check for redhat-release file
    if [[ -f /etc/redhat-release ]]; then
        return 0
    fi
    
    # Check os-release for RHEL/CentOS/Fedora indicators
    if [[ -f /etc/os-release ]]; then
        if grep -qiE 'rhel|centos|fedora|red hat' /etc/os-release 2>/dev/null; then
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
    [[ -n "$OS_TYPE" ]] && return 0
    
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
            OS_TYPE="wsl-unknown"
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
    
    # Export all variables for use in calling scripts
    export OS_TYPE
    export OS_DISPLAY_NAME
    export IS_WSL
    
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

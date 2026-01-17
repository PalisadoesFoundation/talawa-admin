#!/bin/bash
#
# Talawa Admin - Common Utility Library
# =====================================
#
# A self-contained, reusable library providing common utilities for
# Talawa installation and setup scripts.
#
# Features:
#   - Logging functions (info, success, warning, error, step headers)
#   - Error handling (trap handlers, die function)
#   - Input validation and prompts
#   - Security helpers (input sanitization, temp files)
#   - Command and path utilities
#
# Usage:
#   source "path/to/common.sh"
#   # or
#   . "path/to/common.sh"
#
# Design Principles:
#   - No ANSI color codes (plain text only)
#   - Uses only ✓ for success and ✗ for errors
#   - Safe to source multiple times (idempotent)
#   - All functions use local variables
#   - No side effects on sourcing (only definitions)
#   - Shell-agnostic (works with bash)
#
# Exit Codes:
#   E_SUCCESS=0      - Successful execution
#   E_GENERAL=1      - General/unspecified error
#   E_MISSING_DEP=2  - Missing dependency or required file
#   E_PERMISSION=3   - Permission denied
#   E_NETWORK=4      - Network-related error
#   E_USER_ABORT=5   - User cancelled operation
#

set -euo pipefail

# =============================================================================
# Source Guard - Prevents multiple sourcing
# =============================================================================
[[ -n "${TALAWA_COMMON_SOURCED:-}" ]] && return 0
readonly TALAWA_COMMON_SOURCED=1

# =============================================================================
# Exit Codes
# =============================================================================
readonly E_SUCCESS=0       # Successful execution
readonly E_GENERAL=1       # General/unspecified error
readonly E_MISSING_DEP=2   # Missing dependency or required file
readonly E_PERMISSION=3    # Permission denied
readonly E_NETWORK=4       # Network-related error
readonly E_USER_ABORT=5    # User cancelled operation

# =============================================================================
# Symbols (Plain text, no colors)
# =============================================================================
readonly CHECK_MARK="✓"
readonly X_MARK="✗"

# =============================================================================
# Logging Functions
# =============================================================================

# Log an informational message
# Arguments:
#   $1 - Message to log
log_info() {
    local message="${1:-}"
    printf "[INFO] %s\n" "$message"
}

# Log a success message with checkmark
# Arguments:
#   $1 - Message to log
log_success() {
    local message="${1:-}"
    printf "%s %s\n" "$CHECK_MARK" "$message"
}

# Log a warning message
# Arguments:
#   $1 - Message to log
log_warning() {
    local message="${1:-}"
    printf "[WARN] %s\n" "$message"
}

# Log an error message to stderr
# Arguments:
#   $1 - Message to log
log_error() {
    local message="${1:-}"
    printf "%s ERROR: %s\n" "$X_MARK" "$message" >&2
}

# Log a step header for multi-step processes
# Arguments:
#   $1 - Step number
#   $2 - Step description
log_step() {
    local step_number="${1:-}"
    local step_description="${2:-}"
    printf "\nStep %s: %s\n" "$step_number" "$step_description"
    printf "%s\n" "----------------------------------------"
}

# =============================================================================
# Error Handling
# =============================================================================

# Exit with an error message
# Arguments:
#   $1 - Error message (optional, default: "Unexpected error")
#   $2 - Exit code (optional, default: E_GENERAL)
die() {
    local message="${1:-Unexpected error}"
    local exit_code="${2:-$E_GENERAL}"
    log_error "$message"
    exit "$exit_code"
}

# Cleanup function - override in your script for custom cleanup
# This is called on EXIT, INT, and TERM signals
cleanup() {
    :
}

# Set up trap handlers for cleanup
trap cleanup EXIT INT TERM

# =============================================================================
# Input Validation and Prompts
# =============================================================================

# Prompt user for yes/no confirmation
# Arguments:
#   $1 - Prompt message
#   $2 - Default value (optional, default: "n")
# Returns:
#   0 if user confirms (yes)
#   1 if user declines (no)
confirm() {
    local prompt="${1:-Continue?}"
    local default="${2:-n}"
    local reply

    while true; do
        read -r -p "$prompt [y/N]: " reply
        reply="${reply:-$default}"
        # Convert to lowercase (bash 4.0+)
        reply="${reply,,}"

        case "$reply" in
            y|yes)
                return 0
                ;;
            n|no)
                return 1
                ;;
            *)
                log_warning "Please answer yes or no."
                ;;
        esac
    done
}

# Prompt user for input with optional default value
# Arguments:
#   $1 - Prompt message
#   $2 - Default value (optional)
# Returns:
#   Prints the input (or default) to stdout
prompt_input() {
    local prompt="${1:-Enter value}"
    local default="${2:-}"
    local input

    if [[ -n "$default" ]]; then
        read -r -p "$prompt [$default]: " input
        input="${input:-$default}"
    else
        read -r -p "$prompt: " input
    fi

    printf "%s" "$input"
}

# =============================================================================
# Security Helpers
# =============================================================================

# Sanitize input by removing potentially dangerous characters
# Arguments:
#   $1 - Input string to sanitize
# Returns:
#   Prints sanitized string to stdout
sanitize_input() {
    local input="${1:-}"
    # Remove shell metacharacters that could be used for injection
    printf "%s" "$input" | sed 's/[;&|`$(){}]//g'
}

# Create a secure temporary file
# Arguments:
#   $1 - Prefix for temp file (optional, default: "talawa")
# Returns:
#   Prints path to created temp file
create_temp_file() {
    local prefix="${1:-talawa}"
    local temp_file

    temp_file="$(mktemp "/tmp/${prefix}-XXXXXX")" || die "Failed to create temporary file" "$E_PERMISSION"
    printf "%s" "$temp_file"
}

# Create a secure temporary directory
# Arguments:
#   $1 - Prefix for temp directory (optional, default: "talawa")
# Returns:
#   Prints path to created temp directory
create_temp_dir() {
    local prefix="${1:-talawa}"
    local temp_dir

    temp_dir="$(mktemp -d "/tmp/${prefix}-XXXXXX")" || die "Failed to create temporary directory" "$E_PERMISSION"
    printf "%s" "$temp_dir"
}

# =============================================================================
# Command and Path Utilities
# =============================================================================

# Check if a command exists
# Arguments:
#   $1 - Command name to check
# Returns:
#   0 if command exists, 1 otherwise
command_exists() {
    local cmd="${1:-}"
    command -v "$cmd" >/dev/null 2>&1
}

# Validate a URL format (http or https)
# Arguments:
#   $1 - URL to validate
# Returns:
#   0 if valid, 1 otherwise
validate_url() {
    local url="${1:-}"
    [[ "$url" =~ ^https?://[^[:space:]]+$ ]]
}

# Get the directory containing the current script
# Returns:
#   Prints absolute path to script directory
get_script_dir() {
    local dir
    dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)" || die "Failed to determine script directory" "$E_GENERAL"
    printf "%s" "$dir"
}

# Get the absolute path of a file or directory
# Arguments:
#   $1 - Relative or absolute path
# Returns:
#   Prints absolute path
get_absolute_path() {
    local path="${1:-}"

    if [[ -d "$path" ]]; then
        (cd "$path" && pwd)
    elif [[ -f "$path" ]]; then
        local dir
        dir="$(cd "$(dirname "$path")" && pwd)"
        printf "%s/%s" "$dir" "$(basename "$path")"
    else
        die "Path does not exist: $path" "$E_GENERAL"
    fi
}

# =============================================================================
# Library Loading
# =============================================================================

# Safely source another library file
# Arguments:
#   $1 - Path to library file
safe_source() {
    local library_path="${1:-}"

    [[ -f "$library_path" ]] || die "Library not found: $library_path" "$E_MISSING_DEP"

    # shellcheck source=/dev/null
    . "$library_path" || die "Failed to load library: $library_path" "$E_GENERAL"
}

# =============================================================================
# Requirement Checks
# =============================================================================

# Check if required commands are available
# Arguments:
#   $@ - List of command names to check
# Returns:
#   0 if all commands exist, exits with E_MISSING_DEP otherwise
require_commands() {
    local cmd
    local missing=()

    for cmd in "$@"; do
        if ! command_exists "$cmd"; then
            missing+=("$cmd")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        die "Missing required commands: ${missing[*]}" "$E_MISSING_DEP"
    fi
}

# Check if running as root
# Returns:
#   0 if running as root, 1 otherwise
is_root() {
    [[ "$(id -u)" -eq 0 ]]
}

# Require root privileges
# Exits with E_PERMISSION if not running as root
require_root() {
    if ! is_root; then
        die "This operation requires root privileges" "$E_PERMISSION"
    fi
}

#!/bin/bash
# ==============================================================================
# Talawa Admin - Common Shell Utilities Library
# ==============================================================================
# A reusable, plain-text (no ANSI colors) utility library for install scripts.
# Safe to source multiple times. No side effects on source except defining
# functions and constants.
#
# Usage:
#   source "path/to/common.sh"
#   # or
#   . "path/to/common.sh"
#
# Compatibility: Ubuntu, macOS, WSL (bash 3.2+)
# ==============================================================================

# ==============================================================================
# SOURCE GUARD - Prevent multiple sourcing
# ==============================================================================
# Note: We check source guard BEFORE any set commands to avoid affecting
# the caller's shell on subsequent sources.
[[ -n "${TALAWA_COMMON_SOURCED:-}" ]] && return 0
readonly TALAWA_COMMON_SOURCED=1

# Note: We intentionally do NOT use 'set -euo pipefail' at the top level
# because this library is meant to be sourced, and those settings would
# persist in the caller's shell, potentially causing unexpected exits.
# Instead, individual functions that need strict mode should set it locally
# or scripts that source this library should set their own options.

# ==============================================================================
# EXIT CODES
# ==============================================================================
# Standard exit codes for consistent error handling across scripts.
#
# E_SUCCESS      (0) - Successful execution
# E_GENERAL      (1) - General/unspecified error
# E_MISSING_DEP  (2) - Required dependency not found
# E_PERMISSION   (3) - Permission denied or insufficient privileges
# E_NETWORK      (4) - Network-related error (connection, timeout, etc.)
# E_USER_ABORT   (5) - User cancelled/aborted the operation
# E_INVALID_ARG  (6) - Invalid argument or input provided
# E_IO_ERROR     (7) - File/IO operation failed
# ==============================================================================
export E_SUCCESS=0
export E_GENERAL=1
export E_MISSING_DEP=2
export E_PERMISSION=3
export E_NETWORK=4
export E_USER_ABORT=5
export E_INVALID_ARG=6
export E_IO_ERROR=7

# ==============================================================================
# SYMBOLS (Plain text, no ANSI colors)
# ==============================================================================
readonly CHECK_MARK="✓"
readonly X_MARK="✗"

# ==============================================================================
# LOGGING FUNCTIONS
# ==============================================================================
# All logging functions output plain text only (no ANSI color codes).
# Error messages are sent to stderr; all others to stdout.
# ==============================================================================

# Log an informational message
# Usage: log_info "message"
log_info() {
    local message="${1:-}"
    printf "[INFO] %s\n" "$message"
}

# Log a success message with checkmark
# Usage: log_success "message"
log_success() {
    local message="${1:-}"
    printf "%s %s\n" "$CHECK_MARK" "$message"
}

# Log a warning message
# Usage: log_warning "message"
log_warning() {
    local message="${1:-}"
    printf "[WARN] %s\n" "$message"
}

# Log an error message with X mark (outputs to stderr)
# Usage: log_error "message"
log_error() {
    local message="${1:-}"
    printf "%s ERROR: %s\n" "$X_MARK" "$message" >&2
}

# Log a step header for multi-step processes
# Usage: log_step "1" "Installing dependencies"
log_step() {
    local step_number="${1:-}"
    local step_title="${2:-}"
    printf "\n"
    printf "Step %s: %s\n" "$step_number" "$step_title"
    printf '%s\n' "----------------------------------------"
}

# Log a section header (for major sections without step numbers)
# Usage: log_section "Configuration"
log_section() {
    local title="${1:-}"
    printf "\n"
    printf "=== %s ===\n" "$title"
}

# ==============================================================================
# ERROR HANDLING
# ==============================================================================

# Cleanup function - override in your script if needed
# This is called on EXIT, INT, and TERM signals
# Usage: Override by redefining cleanup() after sourcing this library
cleanup() {
    # Default: no-op. Override in your script for custom cleanup.
    :
}

# Set up signal traps for cleanup
# Note: To enable automatic cleanup, add this to your script after sourcing:
# trap cleanup EXIT INT TERM

# Exit with an error message and code
# Usage: die "Error message" [exit_code]
# Default exit code is E_GENERAL (1)
die() {
    local message="${1:-Unexpected error occurred}"
    local exit_code="${2:-$E_GENERAL}"
    log_error "$message"
    exit "$exit_code"
}

# ==============================================================================
# INPUT VALIDATION & PROMPTS
# ==============================================================================

# Prompt user for yes/no confirmation
# Returns 0 for yes, 1 for no
# Loops until valid input is provided
# Usage: confirm "Do you want to continue?" "n"
#        confirm "Proceed with installation?" "y"
confirm() {
    local prompt="${1:-Continue?}"
    local default="${2:-n}"
    local reply
    local prompt_suffix

    # Normalize and validate the default to ensure it's always a valid y/n value
    # This prevents infinite loops in non-TTY environments with invalid defaults
    local default_lower
    default_lower="$(printf '%s' "$default" | tr '[:upper:]' '[:lower:]')"
    case "$default_lower" in
        y|yes)
            default_lower="y"
            ;;
        n|no)
            default_lower="n"
            ;;
        *)
            # Invalid default provided, fall back to safe default "n"
            default_lower="n"
            ;;
    esac

    # Build prompt suffix based on normalized default
    if [[ "$default_lower" == "y" ]]; then
        prompt_suffix="[Y/n]"
    else
        prompt_suffix="[y/N]"
    fi

    while true; do
        # Use /dev/tty to ensure we read from terminal even when stdin is redirected
        if [[ -t 0 ]]; then
            read -r -p "$prompt $prompt_suffix: " reply
        else
            read -r -p "$prompt $prompt_suffix: " reply </dev/tty 2>/dev/null || reply="$default_lower"
        fi

        # Use normalized default if empty
        reply="${reply:-$default_lower}"

        # Convert to lowercase for comparison (bash 4.0+ syntax with fallback)
        reply="$(printf '%s' "$reply" | tr '[:upper:]' '[:lower:]')"

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

# Prompt for input with validation
# Usage: prompt_input "Enter your name" "name_var" "default_value" "validation_regex"
# Returns the input in the variable name provided
prompt_input() {
    local prompt="${1:-Enter value}"
    local varname="${2:-REPLY}"
    local default="${3:-}"
    local validation="${4:-}"
    local input
    local prompt_display
    local attempts=0
    local max_attempts=3

    # Validate varname is a valid identifier (letters, digits, underscores, not starting with digit)
    if [[ ! "$varname" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
        die "prompt_input: Invalid variable name '$varname'" "$E_INVALID_ARG"
    fi

    if [[ -n "$default" ]]; then
        prompt_display="$prompt [$default]"
    else
        prompt_display="$prompt"
    fi

    while true; do
        if [[ -t 0 ]]; then
            read -r -p "$prompt_display: " input
        else
            read -r -p "$prompt_display: " input </dev/tty 2>/dev/null || input="$default"
            ((attempts++))
        fi

        # Use default if empty
        input="${input:-$default}"

        # Validate if pattern provided
        if [[ -n "$validation" ]]; then
            if [[ "$input" =~ $validation ]]; then
                printf -v "$varname" '%s' "$input"
                return 0
            else
                if [[ ! -t 0 ]] && ((attempts >= max_attempts)); then
                    die "prompt_input: Validation failed after $max_attempts attempts in non-interactive mode" "$E_INVALID_ARG"
                fi
                log_warning "Invalid input. Please try again."
            fi
        else
            printf -v "$varname" '%s' "$input"
            return 0
        fi
    done
}

# ==============================================================================
# SECURITY HELPERS
# ==============================================================================

# Whitelist-based validation for security-critical inputs
# Validates input against context-specific patterns and REJECTS invalid input
# instead of silently transforming it.
#
# Usage: 
#   sanitize_input "$user_input" "filename"
#   sanitize_input "$user_input" "identifier"
#   sanitize_input "$user_input" "path"
#   sanitize_input "$user_input"  # defaults to "general"
#
# Returns:
#   0 - Input is valid and printed to stdout
#   $E_INVALID_ARG - Input does not match expected pattern
#
# Context types:
#   filename   - Safe filename characters only, no path separators (a-zA-Z0-9._-)
#   identifier - Valid shell variable/function names (starts with letter/underscore)
#   path       - Absolute paths only, no path traversal (..)
#   general    - Most restrictive: alphanumeric, underscore, hyphen only
sanitize_input() {
    local input="${1:-}"
    local purpose="${2:-general}"  # Context: filename, path, identifier, etc.
    
    # Empty input is invalid
    if [[ -z "$input" ]]; then
        log_error "Invalid input: empty string is not allowed for $purpose"
        return "$E_INVALID_ARG"
    fi
    
    case "$purpose" in
        filename)
            # Only allow safe filename characters, no path separators
            if [[ "$input" =~ ^[a-zA-Z0-9._-]+$ ]]; then
                printf '%s' "$input"
                return 0
            fi
            ;;
        identifier)
            # Variable names, function names (must start with letter or underscore)
            if [[ "$input" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
                printf '%s' "$input"
                return 0
            fi
            ;;
        path)
            # Absolute paths only, no traversal
            # Must start with /, no .. sequences allowed
            if [[ "$input" =~ ^/[a-zA-Z0-9._/-]+$ ]] && [[ ! "$input" =~ \.\. ]]; then
                printf '%s' "$input"
                return 0
            fi
            ;;
        *)
            # General: most restrictive - alphanumeric, underscore, hyphen only
            if [[ "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
                printf '%s' "$input"
                return 0
            fi
            ;;
    esac
    
    # Reject invalid input
    log_error "Invalid input: '$input' does not match expected pattern for $purpose"
    return "$E_INVALID_ARG"
}

# Create a temporary file securely
# Usage: tmpfile=$(create_temp_file "myprefix")
# Returns the path to the created temp file
create_temp_file() {
    local prefix="${1:-talawa}"
    local tmpfile

    # Use mktemp with portable options
    # macOS mktemp requires template to be last argument
    # Linux mktemp is more flexible
    if [[ "$(uname -s)" == "Darwin" ]]; then
        # macOS
        tmpfile="$(mktemp -t "${prefix}.XXXXXX")"
    else
        # Linux/WSL
        tmpfile="$(mktemp --tmpdir "${prefix}.XXXXXX" 2>/dev/null)" || \
        tmpfile="$(mktemp "/tmp/${prefix}.XXXXXX")"
    fi
    if [[ -z "$tmpfile" ]]; then
        die "Failed to create temporary file" "$E_IO_ERROR"
    fi

    printf '%s' "$tmpfile"
}

# Create a temporary directory securely
# Usage: tmpdir=$(create_temp_dir "myprefix")
# Returns the path to the created temp directory
create_temp_dir() {
    local prefix="${1:-talawa}"
    local tmpdir

    if [[ "$(uname -s)" == "Darwin" ]]; then
        # macOS
        tmpdir="$(mktemp -d -t "${prefix}.XXXXXX")"
    else
        # Linux/WSL
        tmpdir="$(mktemp -d --tmpdir "${prefix}.XXXXXX" 2>/dev/null)" || \
        tmpdir="$(mktemp -d "/tmp/${prefix}.XXXXXX")"
    fi
    if [[ -z "$tmpdir" ]]; then
        die "Failed to create temporary directory" "$E_IO_ERROR"
    fi

    printf '%s' "$tmpdir"
}

# ==============================================================================
# COMMAND & PATH UTILITIES
# ==============================================================================

# Check if a command exists
# Usage: if command_exists "git"; then echo "git found"; fi
command_exists() {
    local cmd="${1:-}"
    command -v "$cmd" >/dev/null 2>&1
}

# Require a command to exist, die if not found
# Usage: require_command "git" "Git is required for version control"
require_command() {
    local cmd="${1:-}"
    local message="${2:-Command ${cmd} is required but not installed}"

    if ! command_exists "$cmd"; then
        die "$message" "$E_MISSING_DEP"
    fi
}

# Validate a URL (basic check for http:// or https://)
# Usage: if validate_url "$url"; then echo "valid"; fi
validate_url() {
    local url="${1:-}"
    [[ "$url" =~ ^https?://[^[:space:]]+$ ]]
}

# Safely source another script file
# Usage: safe_source "/path/to/script.sh"
safe_source() {
    local filepath="${1:-}"

    if [[ -z "$filepath" ]]; then
        die "safe_source: No file path provided" "$E_INVALID_ARG"
    fi

    if [[ ! -f "$filepath" ]]; then
        die "Library not found: $filepath" "$E_MISSING_DEP"
    fi

    if [[ ! -r "$filepath" ]]; then
        die "Cannot read library: $filepath (permission denied)" "$E_PERMISSION"
    fi

    # shellcheck source=/dev/null
    if ! . "$filepath"; then
        die "Failed to source library: $filepath" "$E_GENERAL"
    fi
}

# Resolve a path to its absolute form
# Usage: abs_path=$(resolve_path "./relative/path")
resolve_path() {
    local path="${1:-}"
    local resolved

    if [[ -d "$path" ]]; then
        resolved="$(cd "$path" && pwd)"
    elif [[ -f "$path" ]]; then
        resolved="$(cd "$(dirname "$path")" && pwd)/$(basename "$path")"
    else
        # Path doesn't exist yet, resolve what we can
        local dir
        local base
        dir="$(dirname "$path")"
        base="$(basename "$path")"
        if [[ -d "$dir" ]]; then
            resolved="$(cd "$dir" && pwd)/$base"
        else
            resolved="$path"
        fi
    fi

    printf '%s' "$resolved"
}

# ==============================================================================
# SYSTEM DETECTION HELPERS
# ==============================================================================

# Check if running as root
# Usage: if is_root; then echo "Running as root"; fi
is_root() {
    # Primary method: use id command if available
    if command -v id >/dev/null 2>&1; then
        [[ "$(id -u 2>/dev/null)" -eq 0 ]]
    else
        # Fallback: check UID if set and numeric, otherwise check username
        if [[ -n "${UID:-}" ]] && [[ "$UID" =~ ^[0-9]+$ ]]; then
            # UID is set and numeric, compare to 0
            [[ "$UID" -eq 0 ]]
        else
            # UID not set or not numeric, check username
            [[ "$(whoami 2>/dev/null)" == "root" ]]
        fi
    fi
}

# Check if running in WSL (Windows Subsystem for Linux)
# Usage: if is_wsl; then echo "Running in WSL"; fi
is_wsl() {
    # Check WSL_DISTRO_NAME environment variable
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

# Get the current operating system name
# Returns: "darwin", "linux", "windows", or "unknown"
# Usage: os=$(get_os)
get_os() {
    local uname_out
    uname_out="$(uname -s)"

    case "$uname_out" in
        Darwin*)
            printf 'darwin'
            ;;
        Linux*)
            printf 'linux'
            ;;
        MINGW*|MSYS*|CYGWIN*)
            printf 'windows'
            ;;
        *)
            printf 'unknown'
            ;;
    esac
}

# ==============================================================================
# MANUAL TEST COMMANDS
# ==============================================================================
# To test this library, run the following commands in a bash shell:
#
# # Test sourcing (should be silent, no output)
# source ./scripts/install/lib/common.sh
#
# # Test multiple sourcing (second source should be no-op)
# source ./scripts/install/lib/common.sh
#
# # Test logging functions
# log_info "This is an info message"
# log_success "This is a success message"
# log_warning "This is a warning message"
# log_error "This is an error message"
# log_step "1" "First step title"
# log_section "Section Title"
#
# # Test exit codes are defined
# echo "E_SUCCESS=$E_SUCCESS"
# echo "E_GENERAL=$E_GENERAL"
# echo "E_MISSING_DEP=$E_MISSING_DEP"
#
# # Test command_exists
# command_exists "bash" && echo "bash exists"
# command_exists "nonexistent_cmd_12345" || echo "nonexistent command not found (expected)"
#
# # Test validate_url
# validate_url "https://example.com" && echo "URL valid"
# validate_url "not-a-url" || echo "Invalid URL rejected (expected)"
#
# # Test sanitize_input (now validates instead of transforms)
# sanitize_input "hello123" "general" && echo "Valid general input"
# sanitize_input "file.txt" "filename" && echo "Valid filename"
# sanitize_input "/usr/local/bin" "path" && echo "Valid path"
# sanitize_input "../../etc/passwd" "path" || echo "Path traversal rejected (expected)"
# sanitize_input "hello; rm -rf /" "general" || echo "Command injection rejected (expected)"
#
#
# # Test temp file creation
# tmpfile=$(create_temp_file "test")
# echo "Created temp file: $tmpfile"
# rm -f "$tmpfile"
#
# # Test is_root
# is_root && echo "Running as root" || echo "Not running as root"
#
# # Test is_wsl
# is_wsl && echo "Running in WSL" || echo "Not running in WSL"
#
# # Test get_os
# echo "Operating system: $(get_os)"
#
# # Test confirm (interactive - will prompt for input)
# # confirm "Do you want to test confirm?" "n"
#
# # Test die (WARNING: This will exit the shell!)
# # die "Test error message" 1
#
# # Test trap behavior (run in subshell to avoid exiting main shell)
# # (
# #     cleanup() { echo "Custom cleanup called"; }
# #     trap cleanup EXIT
# #     exit 0
# # )
#
# # Test require_command (will die if command not found)
# # require_command "git" "Git is required"
# # require_command "nonexistent_cmd" "This should fail"
# ==============================================================================

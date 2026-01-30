#!/bin/bash
# ==============================================================================
# Talawa Admin - OS Detection Library
# ==============================================================================
# Detects macOS, Debian/Ubuntu, RHEL/CentOS/Fedora, and WSL variants.
# Safe to source multiple times. No side effects on source except defining
# functions and exported variables.
#
# Exports (after detect_os):
#   OS_TYPE          - macos | debian | redhat | wsl-debian | wsl-redhat | unknown
#   OS_DISPLAY_NAME  - Human-readable display string
#   IS_WSL           - "true" or "false"
#
# Notes:
# - WSL detection logic is kept consistent with src/install/os/detector.ts.
# - We intentionally do NOT set 'set -euo pipefail' here because this file is
#   meant to be sourced; strict mode would persist in the caller's shell.
# ==============================================================================

# ==============================================================================
# SOURCE GUARD - Prevent multiple sourcing
# ==============================================================================
[[ -n "${TALAWA_OS_DETECT_SOURCED:-}" ]] && return 0
readonly TALAWA_OS_DETECT_SOURCED=1

# ==============================================================================
# EXPORTED STATE (cached between calls)
# ==============================================================================
# Default to empty/false, but do not clobber caller-provided values.
export OS_TYPE="${OS_TYPE:-}"
export OS_DISPLAY_NAME="${OS_DISPLAY_NAME:-}"
export IS_WSL="${IS_WSL:-false}"

# ==============================================================================
# INTERNAL HELPERS
# ==============================================================================

__talawa_to_lower() {
  local input="${1:-}"
  printf '%s' "$input" | tr '[:upper:]' '[:lower:]'
}

__talawa_read_os_release() {
  # Output: "id|id_like" (both may be empty)
  local id=""
  local id_like=""
  local key value

  if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC2162
    while IFS='=' read -r key value; do
      case "$key" in
        ID)
          id="${value//\"/}"
          ;;
        ID_LIKE)
          id_like="${value//\"/}"
          ;;
      esac
    done < /etc/os-release
  fi

  id="$(__talawa_to_lower "$id")"
  id_like="$(__talawa_to_lower "$id_like")"
  printf '%s|%s' "$id" "$id_like"
}

__talawa_os_release_has() {
  # Usage: __talawa_os_release_has "token"
  # Checks ID and ID_LIKE for token (case-insensitive)
  local token="$(__talawa_to_lower "${1:-}")"
  local osr id id_like

  osr="$(__talawa_read_os_release)"
  id="${osr%%|*}"
  id_like="${osr#*|}"

  [[ "$id" == "$token" ]] && return 0
  [[ " $id_like " == *" $token "* ]] && return 0

  return 1
}

# ==============================================================================
# PUBLIC PREDICATES
# ==============================================================================

# Check if running inside WSL (Windows Subsystem for Linux)
# NOTE: Keep in sync with src/install/os/detector.ts (isRunningInWsl)
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

is_macos() {
  [[ "$(uname -s 2>/dev/null)" == "Darwin" ]]
}

is_debian() {
  # Debian/Ubuntu family
  [[ -f /etc/debian_version ]] && return 0
  __talawa_os_release_has "debian" && return 0
  __talawa_os_release_has "ubuntu" && return 0
  return 1
}

is_redhat() {
  # RHEL/CentOS/Fedora family
  [[ -f /etc/redhat-release ]] && return 0
  __talawa_os_release_has "rhel" && return 0
  __talawa_os_release_has "fedora" && return 0
  __talawa_os_release_has "centos" && return 0
  __talawa_os_release_has "redhat" && return 0
  __talawa_os_release_has "rocky" && return 0
  __talawa_os_release_has "almalinux" && return 0
  __talawa_os_release_has "ol" && return 0
  __talawa_os_release_has "oracle" && return 0
  return 1
}

# ==============================================================================
# PUBLIC API
# ==============================================================================

detect_os() {
  # Cache: if OS_TYPE was already computed (or provided by caller), do nothing.
  if [[ -n "${OS_TYPE:-}" ]]; then
    export OS_TYPE OS_DISPLAY_NAME IS_WSL
    return 0
  fi

  IS_WSL=false

  if is_macos; then
    OS_TYPE="macos"
    OS_DISPLAY_NAME="macOS"
  elif is_wsl; then
    IS_WSL=true

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
  elif is_debian; then
    OS_TYPE="debian"
    OS_DISPLAY_NAME="Debian/Ubuntu"
  elif is_redhat; then
    OS_TYPE="redhat"
    OS_DISPLAY_NAME="RHEL/CentOS/Fedora"
  else
    OS_TYPE="unknown"
    OS_DISPLAY_NAME="Unknown OS"
  fi

  export OS_TYPE OS_DISPLAY_NAME IS_WSL
}

get_os_display_name() {
  detect_os
  printf '%s\n' "${OS_DISPLAY_NAME:-Unknown OS}"
}

# ==============================================================================
# MANUAL TEST COMMANDS
# ==============================================================================
# To test this library, run the following commands in a bash shell:
#
# source ./scripts/install/lib/os-detect.sh
# detect_os
# echo "OS_TYPE=$OS_TYPE"
# echo "OS_DISPLAY_NAME=$OS_DISPLAY_NAME"
# echo "IS_WSL=$IS_WSL"
#
# # Repeated calls should use cached values (no changes)
# detect_os
#
# # Print display name helper
# get_os_display_name

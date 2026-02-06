#!/bin/bash
# ==============================================================================
# Talawa Admin - Node.js Installation Helper Library
# ==============================================================================
# Reusable library for installing and verifying fnm, Node.js, and pnpm.
# Safe to source multiple times. Non-interactive, plain text output.
#
# Usage:
#   source "scripts/install/lib/node-install.sh"
#   check_fnm && echo "fnm installed" || install_fnm
#   check_node && echo "node installed" || install_node
#   check_pnpm && echo "pnpm installed" || install_pnpm
#
# Compatibility: Ubuntu, macOS, RHEL/Fedora, WSL (bash 3.2+)
# ==============================================================================

# ==============================================================================
# SOURCE GUARD - Prevent multiple sourcing
# ==============================================================================
[[ -n "${TALAWA_NODE_INSTALL_SOURCED:-}" ]] && return 0
readonly TALAWA_NODE_INSTALL_SOURCED=1

# ==============================================================================
# DEPENDENCIES - Source required libraries
# ==============================================================================
# Get the directory where this script is located
_NODE_INSTALL_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source common utilities if not already sourced
if [[ -z "${TALAWA_COMMON_SOURCED:-}" ]]; then
    if [[ -f "${_NODE_INSTALL_LIB_DIR}/common.sh" ]]; then
        # shellcheck source=./common.sh
        . "${_NODE_INSTALL_LIB_DIR}/common.sh"
    else
        command_exists() { command -v "$1" >/dev/null 2>&1; }
        log_info() { printf "[INFO] %s\n" "$1"; }
        log_success() { printf "✓ %s\n" "$1"; }
        log_warning() { printf "[WARN] %s\n" "$1"; }
        log_error() { printf "✗ ERROR: %s\n" "$1" >&2; }
        create_temp_file() {
            local prefix="${1:-talawa}"
            mktemp -t "${prefix}.XXXXXX" 2>/dev/null || mktemp "/tmp/${prefix}.XXXXXX"
        }
        export E_SUCCESS=0
        export E_GENERAL=1
        export E_NETWORK=4
    fi
fi

# ==============================================================================
# CONFIGURATION
# ==============================================================================
readonly NODE_INSTALL_DEFAULT_VERSION="22"

readonly PNPM_INSTALL_DEFAULT_VERSION="9"

readonly FNM_INSTALLER_URL="https://fnm.vercel.app/install"

# ==============================================================================
# SEMVER UTILITIES
# ==============================================================================

normalize_version() {
    local version="$1"
    version="${version#v}"
    version="${version#V}"
    printf '%s' "$version"
}

parse_major_version() {
    local version="$1"
    version="$(normalize_version "$version")"
    printf '%s' "${version%%.*}"
}

# Parse version component at given index (0=major, 1=minor, 2=patch)
parse_version_component() {
    local version="$1"
    local index="$2"
    version="$(normalize_version "$version")"
    
    local IFS='.'
    local -a parts
    read -ra parts <<< "$version"
    
    # Return component or 0 if missing
    printf '%s' "${parts[$index]:-0}"
}

# Full semver comparison: returns 0 if installed >= required
version_satisfies() {
    local installed="$1"
    local required="$2"
    
    installed="$(normalize_version "$installed")"
    required="$(normalize_version "$required")"
    
    # Check for empty values
    if [[ -z "$installed" ]] || [[ -z "$required" ]]; then
        return 1
    fi
    
    local i inst_part req_part
    for i in 0 1 2; do
        inst_part="$(parse_version_component "$installed" "$i")"
        req_part="$(parse_version_component "$required" "$i")"
        
        # Validate numeric before comparison
        if ! [[ "$inst_part" =~ ^[0-9]+$ ]] || ! [[ "$req_part" =~ ^[0-9]+$ ]]; then
            return 1
        fi
        
        # Force base-10 to handle leading zeros
        if (( 10#$inst_part > 10#$req_part )); then
            return 0
        elif (( 10#$inst_part < 10#$req_part )); then
            return 1
        fi
    done
    
    # All components equal means installed >= required
    return 0
}

# ==============================================================================
# FNM FUNCTIONS
# ==============================================================================

# Check if fnm is installed and available
# Honors FNM_DIR if set, then checks PATH and common locations
# Returns: 0 if fnm is available, 1 otherwise
check_fnm() {
    if [[ -n "${FNM_DIR:-}" ]]; then
        if [[ -x "$FNM_DIR/fnm" ]]; then
            return 0
        fi
        if [[ -x "$FNM_DIR/bin/fnm" ]]; then
            return 0
        fi
    fi
    
    if command_exists fnm; then
        return 0
    fi
    
    if [[ -x "$HOME/.local/share/fnm/fnm" ]]; then
        return 0
    fi
    
    if [[ -x "$HOME/.fnm/fnm" ]]; then
        return 0
    fi
    
    return 1
}

# Set up fnm environment variables and PATH
# This should be called before using fnm commands
# Check order mirrors check_fnm: FNM_DIR first, then PATH, then common locations
# Returns: 0 on success, 1 if fnm not found
setup_fnm_env() {
    # Honor FNM_DIR first (mirrors check_fnm priority)
    if [[ -n "${FNM_DIR:-}" ]]; then
        if [[ -x "$FNM_DIR/fnm" ]]; then
            export PATH="$FNM_DIR:$PATH"
            eval "$(fnm env --use-on-cd 2>/dev/null)" || true
            return 0
        fi
        if [[ -x "$FNM_DIR/bin/fnm" ]]; then
            export PATH="$FNM_DIR/bin:$PATH"
            eval "$(fnm env --use-on-cd 2>/dev/null)" || true
            return 0
        fi
    fi
    
    # Already in PATH and working
    if command_exists fnm; then
        eval "$(fnm env --use-on-cd 2>/dev/null)" || true
        return 0
    fi
    
    # Check ~/.local/share/fnm (default installation location)
    if [[ -d "$HOME/.local/share/fnm" ]]; then
        export PATH="$HOME/.local/share/fnm:$PATH"
        if command_exists fnm; then
            eval "$(fnm env --use-on-cd 2>/dev/null)" || true
            return 0
        fi
    fi
    
    # Check ~/.fnm (alternative location)
    if [[ -d "$HOME/.fnm" ]]; then
        export PATH="$HOME/.fnm:$PATH"
        if command_exists fnm; then
            eval "$(fnm env --use-on-cd 2>/dev/null)" || true
            return 0
        fi
    fi
    
    return 1
}

# Install fnm (Fast Node Manager)
# Returns: 0 on success, 1 on failure
# Outputs: Status messages to stdout, errors to stderr
install_fnm() {
    log_info "Installing fnm (Fast Node Manager)..."
    
    # Check if already installed
    if check_fnm; then
        log_success "fnm is already installed"
        setup_fnm_env
        return 0
    fi
    
    # Require curl for installation
    if ! command_exists curl; then
        log_error "curl is required to install fnm but is not installed"
        return 1
    fi
    
    # Download installer to temporary file for validation
    local tmp_installer
    tmp_installer="$(create_temp_file "fnm-installer")"
    
    # Download the installer script
    if ! curl -fsSL "$FNM_INSTALLER_URL" -o "$tmp_installer" 2>/dev/null; then
        rm -f "$tmp_installer"
        log_error "Failed to download fnm installer from $FNM_INSTALLER_URL"
        return 1
    fi
    
    # Basic validation - check if it looks like the fnm installer
    # 1. Check for proper shell shebang
    local first_line
    first_line="$(head -1 "$tmp_installer" 2>/dev/null)"
    if ! [[ "$first_line" =~ ^#!\/(bin\/(ba)?sh|usr\/bin\/env[[:space:]]+(ba)?sh) ]]; then
        rm -f "$tmp_installer"
        log_error "Downloaded file does not have a valid shell shebang"
        return 1
    fi
    
    # 2. Check for known fnm installer markers (install_fnm function or fnm references)
    if ! grep -qE "(install_fnm|fnm\.vercel\.app|FNM_DIR)" "$tmp_installer" 2>/dev/null; then
        rm -f "$tmp_installer"
        log_error "Downloaded file does not appear to be a valid fnm installer"
        return 1
    fi
    
    # Run the installer with options
    # --install-dir: Use default location
    # --skip-shell: Don't modify shell config (we handle this separately)
    if ! bash "$tmp_installer" --skip-shell 2>/dev/null; then
        rm -f "$tmp_installer"
        log_error "fnm installation failed"
        return 1
    fi
    
    rm -f "$tmp_installer"
    
    # Set up the environment
    if ! setup_fnm_env; then
        log_error "fnm installed but could not set up environment"
        return 1
    fi
    
    log_success "fnm installed successfully"
    return 0
}

# Verify fnm installation and version
# Returns: 0 if fnm works correctly, 1 otherwise
# Outputs: fnm version to stdout on success
verify_fnm() {
    setup_fnm_env || return 1
    
    if ! command_exists fnm; then
        log_error "fnm is not available in PATH"
        return 1
    fi
    
    local version
    version="$(fnm --version 2>/dev/null)" || {
        log_error "Failed to get fnm version"
        return 1
    }
    
    log_success "fnm verified: $version"
    return 0
}

# ==============================================================================
# NODE.JS FUNCTIONS
# ==============================================================================

# Get the required Node.js version from .nvmrc or default
# Returns: Version string (e.g., "22" or "20.10.0")
# Outputs: Version to stdout
required_node_version() {
    # Check for .nvmrc file in current directory
    if [[ -f ".nvmrc" ]]; then
        local version
        version="$(tr -d '[:space:]' < .nvmrc 2>/dev/null)"
        if [[ -n "$version" ]]; then
            printf '%s' "$version"
            return 0
        fi
    fi
    
    # Check for engines.node in package.json (must be inside "engines" object, not dependencies)
    if [[ -f "package.json" ]]; then
        local engines_node raw_version=""
        
        # Prefer jq for reliable JSON parsing if available
        if command_exists jq; then
            raw_version="$(jq -r '.engines.node // empty' package.json 2>/dev/null)"
        else
            # Fallback: extract engines block first, then find node within it
            # This prevents matching "node" in dependencies or other fields
            local engines_block
            engines_block="$(sed -n '/"engines"[[:space:]]*:/,/}/p' package.json 2>/dev/null)"
            if [[ -n "$engines_block" ]]; then
                raw_version="$(printf '%s' "$engines_block" | \
                               grep -o '"node"[[:space:]]*:[[:space:]]*"[^"]*"' 2>/dev/null | \
                               sed 's/.*"node"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | \
                               head -1)"
            fi
        fi
        
        if [[ -n "$raw_version" ]]; then
            engines_node="${raw_version#>=}"
            engines_node="${engines_node#\^}"
            engines_node="${engines_node#~}"
            engines_node="${engines_node#>}"
            engines_node="${engines_node%.x}"
            printf '%s' "$engines_node"
            return 0
        fi
    fi
    
    # Default version
    printf '%s' "$NODE_INSTALL_DEFAULT_VERSION"
}

# Check if Node.js is installed and available
# Returns: 0 if node is available, 1 otherwise
check_node() {
    command_exists node
}

# Install Node.js via fnm
# Returns: 0 on success, 1 on failure
# Outputs: Status messages to stdout, errors to stderr
install_node() {
    log_info "Installing Node.js..."
    
    # Ensure fnm is available
    if ! check_fnm; then
        log_info "fnm not found, installing first..."
        if ! install_fnm; then
            log_error "Cannot install Node.js without fnm"
            return 1
        fi
    fi
    
    # Set up fnm environment
    if ! setup_fnm_env; then
        log_error "Failed to set up fnm environment"
        return 1
    fi
    
    # Get required version
    local version
    version="$(required_node_version)"
    log_info "Required Node.js version: $version"
    
    # Install the required version
    if ! fnm install "$version" 2>/dev/null; then
        log_error "Failed to install Node.js version $version"
        return 1
    fi
    
    # Use the installed version
    if ! fnm use "$version" 2>/dev/null; then
        log_error "Failed to activate Node.js version $version"
        return 1
    fi
    
    log_success "Node.js installed and activated"
    return 0
}

# Verify Node.js installation and version
# Returns: 0 if node works correctly, 1 otherwise
# Outputs: node version to stdout on success
verify_node() {
    setup_fnm_env || true
    
    if ! command_exists node; then
        log_error "node is not available in PATH"
        return 1
    fi
    
    local installed_version required_version
    installed_version="$(node --version 2>/dev/null)" || {
        log_error "Failed to get node version"
        return 1
    }
    
    # Normalize both versions to strip leading v/V prefix
    required_version="$(normalize_version "$(required_node_version)")"
    installed_version="$(normalize_version "$installed_version")"
    
    # Check if required_version is numeric/semver-like (starts with digit)
    # Non-numeric values like "lts/*", "node", "lts/hydrogen" skip version comparison
    if ! [[ "$required_version" =~ ^[0-9] ]]; then
        log_warning "Non-numeric version requirement '$required_version' - skipping version comparison (fnm resolved at runtime)"
        log_success "Node.js verified: v$installed_version (requirement: $required_version)"
        return 0
    fi
    
    if ! version_satisfies "$installed_version" "$required_version"; then
        log_error "Node.js version mismatch: required >=$required_version, found $installed_version"
        return 1
    fi
    
    log_success "Node.js verified: v$installed_version (required: >=$required_version)"
    return 0
}

# ==============================================================================
# PNPM FUNCTIONS
# ==============================================================================

# Get the required pnpm version from package.json or default
# Returns: Version string (e.g., "9" or "10.4.1")
# Outputs: Version to stdout
required_pnpm_version() {
    # Check packageManager field in package.json
    if [[ -f "package.json" ]]; then
        local pm_version
        # Extract pnpm version from packageManager field
        # Format: "pnpm@10.4.1" or "pnpm@9.0.0+sha256...."
        pm_version="$(grep -oE '"packageManager"[[:space:]]*:[[:space:]]*"pnpm@[0-9]+\.[0-9]+\.[0-9]+' package.json 2>/dev/null | \
                     sed -E 's/.*pnpm@([0-9]+\.[0-9]+\.[0-9]+).*/\1/' | \
                     head -1)"
        if [[ -n "$pm_version" ]]; then
            printf '%s' "$pm_version"
            return 0
        fi
    fi
    
    # Default version
    printf '%s' "$PNPM_INSTALL_DEFAULT_VERSION"
}

# Check if pnpm is installed and available
# Returns: 0 if pnpm is available, 1 otherwise
check_pnpm() {
    command_exists pnpm
}

# Install pnpm via corepack
# Returns: 0 on success, 1 on failure
# Outputs: Status messages to stdout, errors to stderr
install_pnpm() {
    log_info "Installing pnpm..."
    
    # Ensure Node.js is available (corepack comes with Node.js)
    if ! check_node; then
        log_info "Node.js not found, installing first..."
        if ! install_node; then
            log_error "Cannot install pnpm without Node.js"
            return 1
        fi
    fi
    
    # Get required version
    local version
    version="$(required_pnpm_version)"
    log_info "Required pnpm version: $version"
    
    # Enable corepack (non-interactive to avoid hanging on password prompts)
    if ! corepack enable 2>/dev/null; then
        if command_exists sudo; then
            # Check for passwordless sudo before attempting
            if sudo -n true 2>/dev/null; then
                log_info "Enabling corepack with passwordless sudo..."
                if ! sudo -n corepack enable 2>/dev/null; then
                    log_error "Failed to enable corepack with sudo"
                    return 1
                fi
            else
                log_error "corepack enable requires elevated privileges but passwordless sudo is not available"
                log_error "Please either: run as root, configure passwordless sudo, or manually run: sudo corepack enable"
                return 1
            fi
        else
            log_error "Failed to enable corepack (try running as root or configure passwordless sudo)"
            return 1
        fi
    fi
    
    # Prepare and activate the specified pnpm version
    if ! corepack prepare "pnpm@$version" --activate 2>/dev/null; then
        log_error "Failed to prepare pnpm version $version"
        return 1
    fi
    
    log_success "pnpm installed successfully"
    return 0
}

# Verify pnpm installation and version
# Returns: 0 if pnpm works correctly, 1 otherwise
# Outputs: pnpm version to stdout on success
verify_pnpm() {
    setup_fnm_env || true
    
    if ! command_exists pnpm; then
        log_error "pnpm is not available in PATH"
        return 1
    fi
    
    local installed_version required_version
    installed_version="$(pnpm --version 2>/dev/null)" || {
        log_error "Failed to get pnpm version"
        return 1
    }
    
    required_version="$(required_pnpm_version)"
    installed_version="$(normalize_version "$installed_version")"
    
    if ! version_satisfies "$installed_version" "$required_version"; then
        log_error "pnpm version mismatch: required >=$required_version, found $installed_version"
        return 1
    fi
    
    log_success "pnpm verified: v$installed_version (required: >=$required_version)"
    return 0
}

# ==============================================================================
# CONVENIENCE FUNCTIONS
# ==============================================================================

# Ensure all Node.js toolchain components are installed
# Installs fnm, Node.js, and pnpm if not already present
# Arguments:
#   --fail-fast: Exit immediately on first install failure (default: continue checking all)
# Returns: 0 if all components are available, 1 on any failure
ensure_node_toolchain() {
    local fail_fast=false
    local had_error=false
    
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --fail-fast)
                fail_fast=true
                shift
                ;;
            *)
                log_error "Unknown argument: $1"
                return 1
                ;;
        esac
    done
    
    log_info "Checking Node.js toolchain..."
    
    # Check/install fnm
    if check_fnm; then
        setup_fnm_env
        log_success "fnm is available"
    else
        if ! install_fnm; then
            if [[ "$fail_fast" == "true" ]]; then
                log_error "fnm installation failed, aborting (--fail-fast)"
                return 1
            fi
            had_error=true
        fi
    fi
    
    # Check/install Node.js
    if check_node; then
        log_success "Node.js is available"
    else
        if ! install_node; then
            if [[ "$fail_fast" == "true" ]]; then
                log_error "Node.js installation failed, aborting (--fail-fast)"
                return 1
            fi
            had_error=true
        fi
    fi
    
    # Check/install pnpm
    if check_pnpm; then
        log_success "pnpm is available"
    else
        if ! install_pnpm; then
            if [[ "$fail_fast" == "true" ]]; then
                log_error "pnpm installation failed, aborting (--fail-fast)"
                return 1
            fi
            had_error=true
        fi
    fi
    
    if [[ "$had_error" == "true" ]]; then
        log_error "Some toolchain components failed to install"
        return 1
    fi
    
    log_success "Node.js toolchain is ready"
    return 0
}

# Verify all Node.js toolchain components
# Returns: 0 if all components work, 1 on any failure
verify_node_toolchain() {
    local had_error=false
    
    log_info "Verifying Node.js toolchain..."
    
    if ! verify_fnm; then
        had_error=true
    fi
    
    if ! verify_node; then
        had_error=true
    fi
    
    if ! verify_pnpm; then
        had_error=true
    fi
    
    if [[ "$had_error" == "true" ]]; then
        log_error "Some toolchain components failed verification"
        return 1
    fi
    
    log_success "Node.js toolchain verified"
    return 0
}

# ==============================================================================
# MANUAL TEST COMMANDS
# ==============================================================================
# To test this library, run the following commands in a bash shell:
#
# # Test sourcing (should be silent, no output)
# source ./scripts/install/lib/node-install.sh
#
# # Test multiple sourcing (second source should be no-op)
# source ./scripts/install/lib/node-install.sh
#
# # Test version detection functions
# echo "Required Node version: $(required_node_version)"
# echo "Required pnpm version: $(required_pnpm_version)"
#
# # Test check functions
# check_fnm && echo "fnm: installed" || echo "fnm: not installed"
# check_node && echo "node: installed" || echo "node: not installed"
# check_pnpm && echo "pnpm: installed" || echo "pnpm: not installed"
#
# # Test verify functions (requires tools to be installed)
# verify_fnm
# verify_node
# verify_pnpm
#
# # Test installation (will download and install if not present)
# # WARNING: These actually install software
# # install_fnm
# # install_node
# # install_pnpm
#
# # Test convenience functions
# # ensure_node_toolchain  # Installs everything if needed
# # verify_node_toolchain  # Verifies everything works
# ==============================================================================

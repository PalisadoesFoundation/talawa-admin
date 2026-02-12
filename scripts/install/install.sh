#!/bin/bash
# ==============================================================================
# Talawa Admin - Main Installation Script
# ==============================================================================
# Modular installer that sources libraries from scripts/install/lib/ and
# orchestrates the full installation flow:
#   1. OS detection
#   2. Docker status check (optional)
#   3. Node.js toolchain (fnm, Node.js, pnpm)
#   4. Project dependency installation (pnpm install)
#   5. Post-install summary
#
# Usage:
#   ./scripts/install/install.sh [OPTIONS]
#
# Options:
#   --help              Show this help message and exit
#   --skip-docker-check Skip Docker detection step
#   --non-interactive   Run without prompting for user input
#   --dry-run           Show what would be done without executing
#   --verbose           Enable verbose output
#
# Compatibility: Ubuntu, macOS, RHEL/Fedora, WSL (bash 3.2+)
# ==============================================================================
set -euo pipefail

# ==============================================================================
# RESOLVE SCRIPT LOCATION
# ==============================================================================
# Works from any cwd by resolving the absolute path of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/lib"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ==============================================================================
# SOURCE LIBRARIES
# ==============================================================================
_required_libs=(
    "common.sh"
    "os-detect.sh"
    "docker-detect.sh"
    "node-install.sh"
)

for _lib in "${_required_libs[@]}"; do
    if [[ ! -f "$LIB_DIR/$_lib" ]]; then
        printf "ERROR: Required library not found: %s/%s\n" "$LIB_DIR" "$_lib" >&2
        printf "Please ensure all library files are present in %s\n" "$LIB_DIR" >&2
        exit 1
    fi
    # shellcheck source=/dev/null
    . "$LIB_DIR/$_lib"
done
unset _lib _required_libs

# ==============================================================================
# PARSE COMMAND-LINE ARGUMENTS
# ==============================================================================
SKIP_DOCKER=false
NON_INTERACTIVE=false
DRY_RUN=false
VERBOSE=false
DEPS_SKIPPED=false

_show_help() {
    cat <<EOF
Talawa Admin Installation Script

Usage: $(basename "$0") [OPTIONS]

Options:
  --help              Show this help message and exit
  --skip-docker-check Skip Docker detection step
  --non-interactive   Run without prompting for user input
  --dry-run           Show what would be done without executing
  --verbose           Enable verbose output

Examples:
  $(basename "$0")                          Interactive installation
  $(basename "$0") --non-interactive        Unattended installation
  $(basename "$0") --dry-run --verbose      Preview all steps with details
  $(basename "$0") --skip-docker-check      Skip Docker detection
EOF
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-docker-check)
            SKIP_DOCKER=true
            ;;
        --non-interactive)
            NON_INTERACTIVE=true
            ;;
        --dry-run)
            DRY_RUN=true
            ;;
        --verbose)
            VERBOSE=true
            ;;
        --help)
            _show_help
            ;;
        *)
            log_error "Unknown option: $1"
            log_info "Run '$(basename "$0") --help' for usage information"
            exit "$E_INVALID_ARG"
            ;;
    esac
    shift
done

# ==============================================================================
# VERBOSE LOGGING HELPER
# ==============================================================================
log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        log_info "[VERBOSE] $1"
    fi
}

# ==============================================================================
# BANNER
# ==============================================================================
log_section "Talawa Admin Installation"
log_info "Starting installation..."
log_verbose "Script directory: $SCRIPT_DIR"
log_verbose "Library directory: $LIB_DIR"
log_verbose "Project root: $PROJECT_ROOT"

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY RUN] No changes will be made"
fi
if [[ "$NON_INTERACTIVE" == "true" ]]; then
    log_verbose "Running in non-interactive mode"
fi

# ==============================================================================
# STEP 1: OS DETECTION
# ==============================================================================
log_step "1" "Detecting Operating System"

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY] Would detect OS via uname and /etc/os-release"
else
    detect_os
    log_success "Running on $OS_DISPLAY_NAME"
    log_verbose "OS_TYPE=$OS_TYPE"
    log_verbose "IS_WSL=$IS_WSL"

    if [[ "$IS_WSL" == "true" ]]; then
        log_info "WSL environment detected"
        log_info "Note: For Docker support in WSL, use Docker Desktop for Windows"
        log_info "with the WSL 2 backend enabled."
        log_info "See: https://docs.docker.com/desktop/wsl/"
    fi
fi

# ==============================================================================
# STEP 2: DOCKER STATUS (optional)
# ==============================================================================
if [[ "$SKIP_DOCKER" != "true" ]]; then
    log_step "2" "Checking Docker Status"

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY] Would check Docker CLI, daemon, and Compose status"
    else
        log_verbose "Checking Docker CLI..."
        docker_cli_status="$(check_docker_cli)" || true
        log_verbose "Checking Docker daemon..."
        docker_daemon_status="$(check_docker_daemon)" || true
        log_verbose "Checking Docker Compose..."
        docker_compose_status="$(check_docker_compose)" || true

        # Report CLI status
        case "$docker_cli_status" in
            installed:*)
                docker_version="${docker_cli_status#installed:}"
                log_success "Docker CLI: installed (version $docker_version)"
                ;;
            not_installed)
                log_warning "Docker CLI: not installed"
                ;;
            *)
                log_warning "Docker CLI: unknown status ($docker_cli_status)"
                ;;
        esac

        # Report daemon status
        case "$docker_daemon_status" in
            running)
                log_success "Docker daemon: running"
                ;;
            not_running)
                log_warning "Docker daemon: not running"
                ;;
            permission_denied)
                log_warning "Docker daemon: permission denied"
                ;;
            unresponsive)
                log_warning "Docker daemon: unresponsive"
                ;;
            cli_not_installed)
                log_info "Docker daemon: cannot check (CLI not installed)"
                ;;
            *)
                log_warning "Docker daemon: unknown status ($docker_daemon_status)"
                ;;
        esac

        # Report Compose status
        case "$docker_compose_status" in
            v2:*)
                docker_compose_version="${docker_compose_status#v2:}"
                log_success "Docker Compose: v2 (version $docker_compose_version)"
                ;;
            v1:*)
                docker_compose_version="${docker_compose_status#v1:}"
                log_success "Docker Compose: v1 (version $docker_compose_version)"
                ;;
            not_installed)
                log_warning "Docker Compose: not installed"
                ;;
            *)
                log_warning "Docker Compose: unknown status ($docker_compose_status)"
                ;;
        esac

        # Provide guidance if Docker is not fully operational
        if [[ "$docker_daemon_status" != "running" ]]; then
            log_info ""
            log_info "Docker is optional but recommended for development."
            log_info "Installation will continue without Docker."

            if [[ "$VERBOSE" == "true" ]]; then
                case "$docker_daemon_status" in
                    not_running|unresponsive)
                        log_verbose "Run 'print_docker_status_report' for detailed guidance"
                        ;;
                    permission_denied)
                        log_verbose "Try: sudo usermod -aG docker \$USER && newgrp docker"
                        ;;
                    cli_not_installed)
                        log_verbose "Visit https://docs.docker.com/get-docker/ for installation"
                        ;;
                    *)
                        log_verbose "Run 'print_docker_status_report' for detailed guidance"
                        ;;
                esac
            fi
        fi
    fi
else
    log_step "2" "Docker Status (skipped)"
    log_info "Docker check skipped via --skip-docker-check"
fi

# ==============================================================================
# STEP 3: NODE.JS TOOLCHAIN
# ==============================================================================
log_step "3" "Node.js Toolchain"

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY] Would check/install fnm (Fast Node Manager)"
    log_info "[DRY] Would check/install Node.js (version: project-defined)"
    log_info "[DRY] Would check/install pnpm (version: project-defined)"
else
    log_verbose "Checking fnm..."
    if check_fnm; then
        setup_fnm_env
        log_success "fnm is available"
    else
        log_info "fnm not found, installing..."
        if [[ "$NON_INTERACTIVE" == "true" ]]; then
            install_fnm || die "fnm installation failed" "$E_MISSING_DEP"
        else
            if confirm "fnm (Fast Node Manager) is not installed. Install it?" "y"; then
                install_fnm || die "fnm installation failed" "$E_MISSING_DEP"
            else
                die "fnm is required for installation" "$E_USER_ABORT"
            fi
        fi
        setup_fnm_env
    fi

    log_verbose "Checking Node.js..."
    if check_node; then
        log_success "Node.js is available ($(node --version 2>/dev/null))"
    else
        log_info "Node.js not found, installing..."
        if [[ "$NON_INTERACTIVE" == "true" ]]; then
            install_node || die "Node.js installation failed" "$E_MISSING_DEP"
        else
            if confirm "Node.js is not installed. Install it via fnm?" "y"; then
                install_node || die "Node.js installation failed" "$E_MISSING_DEP"
            else
                die "Node.js is required for installation" "$E_USER_ABORT"
            fi
        fi
    fi

    log_verbose "Checking pnpm..."
    if check_pnpm; then
        log_success "pnpm is available ($(pnpm --version 2>/dev/null))"
    else
        log_info "pnpm not found, installing..."
        if [[ "$NON_INTERACTIVE" == "true" ]]; then
            install_pnpm || die "pnpm installation failed" "$E_MISSING_DEP"
        else
            if confirm "pnpm is not installed. Install it via corepack?" "y"; then
                install_pnpm || die "pnpm installation failed" "$E_MISSING_DEP"
            else
                die "pnpm is required for installation" "$E_USER_ABORT"
            fi
        fi
    fi
fi

# ==============================================================================
# STEP 4: INSTALL PROJECT DEPENDENCIES
# ==============================================================================
log_step "4" "Installing Project Dependencies"

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY] Would run: pnpm install (in $PROJECT_ROOT)"
else
    if [[ "$NON_INTERACTIVE" == "true" ]]; then
        log_info "Running pnpm install..."
        (cd "$PROJECT_ROOT" && pnpm install) || die "Dependency installation failed" "$E_MISSING_DEP"
        log_success "Project dependencies installed"
    else
        if confirm "Install project dependencies (pnpm install)?" "y"; then
            log_info "Running pnpm install..."
            (cd "$PROJECT_ROOT" && pnpm install) || die "Dependency installation failed" "$E_MISSING_DEP"
            log_success "Project dependencies installed"
        else
            DEPS_SKIPPED=true
            log_warning "Skipping dependency installation"
        fi
    fi
fi

# ==============================================================================
# STEP 5: POST-INSTALL SUMMARY
# ==============================================================================
log_step "5" "Installation Summary"

if [[ "$DRY_RUN" == "true" ]]; then
    log_info "[DRY] Would display installation summary"
else
    log_section "Installation Complete"

    if [[ "$DEPS_SKIPPED" == "true" ]]; then
        log_warning "Talawa Admin installation finished (dependencies skipped)"
        log_info ""
        log_info "Run 'pnpm install' manually before starting the development server."
    else
        log_success "Talawa Admin installation finished"
    fi

    log_info ""

    log_info "Installed toolchain:"
    if command_exists fnm; then
        log_info "  fnm:    $(fnm --version 2>/dev/null || echo 'unknown')"
    fi
    if command_exists node; then
        log_info "  Node.js: $(node --version 2>/dev/null || echo 'unknown')"
    fi
    if command_exists pnpm; then
        log_info "  pnpm:   $(pnpm --version 2>/dev/null || echo 'unknown')"
    fi

    log_info ""
    log_info "Next steps:"
    log_info "  1. Run 'pnpm run setup' to configure your application"
    log_info "  2. Run 'pnpm run dev' to start the development server"

    # Shell config reminder for fnm
    if command_exists fnm; then
        log_info ""
        log_info "Tip: Add this to your shell config (~/.bashrc, ~/.zshrc, etc.):"
        log_info "  eval \"\$(fnm env --use-on-cd)\""
    fi
fi

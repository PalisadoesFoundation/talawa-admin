#!/bin/bash
# ==============================================================================
# Talawa Admin - Docker Detection Library
# ==============================================================================
# A detection-only library for Docker CLI, daemon, and Compose status.
# This library does NOT install Docker; it only detects presence/health and
# provides platform-appropriate guidance for next steps.
#
# Safe to source multiple times. No side effects on source except defining
# functions and constants.
#
# Usage:
#   source "path/to/docker-detect.sh"
#   # or
#   . "path/to/docker-detect.sh"
#
# Dependencies:
#   - scripts/install/lib/common.sh (for logging and utility functions)
#
# Compatibility: Ubuntu, macOS, WSL (bash 3.2+)
# ==============================================================================

# ==============================================================================
# SOURCE GUARD - Prevent multiple sourcing
# ==============================================================================
[[ -n "${TALAWA_DOCKER_DETECT_SOURCED:-}" ]] && [[ -z "${_DOCKER_DETECT_TEST_MODE:-}" ]] && return 0
TALAWA_DOCKER_DETECT_SOURCED=1

# ==============================================================================
# TEST MODE CONFIGURATION
# ==============================================================================
# For testing, set _DOCKER_DETECT_TEST_MODE=1 and define mock functions:
#   _mock_docker_cli_output     - Output for "docker --version"
#   _mock_docker_info_output    - Output for "docker info"
#   _mock_docker_info_exit_code - Exit code for "docker info"
#   _mock_docker_compose_output - Output for "docker compose version"
#   _mock_docker_compose_v1_output - Output for "docker-compose --version"
#   _mock_has_docker            - "true" or "false" to simulate docker presence
#   _mock_has_docker_compose_v1 - "true" or "false" to simulate docker-compose presence
#
# Example:
#   export _DOCKER_DETECT_TEST_MODE=1
#   export _mock_has_docker="true"
#   export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
#   source scripts/install/lib/docker-detect.sh
# ==============================================================================
export _DOCKER_DETECT_TEST_MODE="${_DOCKER_DETECT_TEST_MODE:-}"

# ==============================================================================
# DOCKER STATUS CONSTANTS
# ==============================================================================
# Status strings returned by detection functions for consistent parsing.
#
# CLI Status:
#   installed:<version>  - Docker CLI is installed with the given version
#   not_installed        - Docker CLI is not found
#
# Daemon Status:
#   running              - Docker daemon is running and accessible
#   not_running          - Docker daemon is not running
#   permission_denied    - Permission denied accessing Docker daemon
#   unresponsive         - Daemon timed out (not responding)
#   cli_not_installed    - Cannot check daemon; CLI not installed
#
# Compose Status:
#   v2:<version>         - Docker Compose v2 plugin detected
#   v1:<version>         - Legacy docker-compose standalone detected
#   not_installed        - No Docker Compose found
# ==============================================================================

# Default timeout for daemon connectivity check (in seconds)
if [[ -z "${DOCKER_DAEMON_TIMEOUT:-}" ]]; then
    DOCKER_DAEMON_TIMEOUT=5
fi

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

# Check if a command exists (with test mode support)
# In test mode, checks _mock_has_* variables instead of actual commands
# Usage: _docker_command_exists "docker"
_docker_command_exists() {
    local cmd="${1:-}"
    
    if [[ -n "${_DOCKER_DETECT_TEST_MODE:-}" ]]; then
        case "$cmd" in
            docker)
                [[ "${_mock_has_docker:-false}" == "true" ]]
                ;;
            docker-compose)
                [[ "${_mock_has_docker_compose_v1:-false}" == "true" ]]
                ;;
            timeout|gtimeout)
                return 1
                ;;
            *)
                command -v "$cmd" >/dev/null 2>&1
                ;;
        esac
    else
        command -v "$cmd" >/dev/null 2>&1
    fi
}

# ==============================================================================
# DOCKER CLI DETECTION
# ==============================================================================

# Check if Docker CLI is installed and get its version
# Returns: "installed:<version>" or "not_installed"
# Usage: status=$(check_docker_cli)
check_docker_cli() {
    if _docker_command_exists docker; then
        local version_output
        
        if [[ -n "${_DOCKER_DETECT_TEST_MODE:-}" ]]; then
            version_output="${_mock_docker_cli_output:-}"
            if [[ -z "$version_output" ]]; then
                printf 'not_installed'
                return 1
            fi
        else
            version_output="$(docker --version 2>/dev/null)" || {
                printf 'not_installed'
                return 1
            }
        fi
        # Parse version from "Docker version 24.0.7, build afdd53b"
        local version
        version="$(printf '%s' "$version_output" | awk '{print $3}' | tr -d ',')"
        if [[ -n "$version" ]]; then
            printf 'installed:%s' "$version"
            return 0
        else
            printf 'installed:unknown'
            return 0
        fi
    else
        printf 'not_installed'
        return 1
    fi
}

# ==============================================================================
# DOCKER DAEMON DETECTION
# ==============================================================================

# Check if Docker daemon is running and accessible
# Uses timeout to avoid hanging on unresponsive daemons
# Returns: "running", "not_running", "permission_denied", "unresponsive", or "cli_not_installed"
# Usage: status=$(check_docker_daemon)
check_docker_daemon() {
    # First check if CLI is available
    if ! _docker_command_exists docker; then
        printf 'cli_not_installed'
        return 1
    fi

    local docker_info_output
    local exit_code

    # Test mode: use mock output
    if [[ -n "${_DOCKER_DETECT_TEST_MODE:-}" ]]; then
        docker_info_output="${_mock_docker_info_output:-}"
        exit_code="${_mock_docker_info_exit_code:-1}"
    else
        # Try to get docker info with timeout
        # Use timeout command if available, otherwise use built-in approach
        if _docker_command_exists timeout; then
            # GNU coreutils timeout (Linux)
            docker_info_output="$(timeout "${DOCKER_DAEMON_TIMEOUT}" docker info 2>&1)"
            exit_code=$?
            
            # timeout returns 124 when command times out
            if [[ $exit_code -eq 124 ]]; then
                printf 'unresponsive'
                return 1
            fi
        elif _docker_command_exists gtimeout; then
            # GNU coreutils timeout on macOS (via homebrew coreutils)
            docker_info_output="$(gtimeout "${DOCKER_DAEMON_TIMEOUT}" docker info 2>&1)"
            exit_code=$?
            
            if [[ $exit_code -eq 124 ]]; then
                printf 'unresponsive'
                return 1
            fi
        else
            # Fallback: run without timeout (macOS without coreutils)
            # Use a background process with sleep to implement basic timeout
            local tmpfile
            tmpfile="$(mktemp 2>/dev/null || mktemp -t docker_check)"
            
            (docker info > "$tmpfile" 2>&1) &
            local pid=$!
            
            # Wait for completion or timeout
            local count=0
            while kill -0 "$pid" 2>/dev/null; do
                sleep 1
                count=$((count + 1))
                if [[ $count -ge $DOCKER_DAEMON_TIMEOUT ]]; then
                    kill -9 "$pid" 2>/dev/null || true
                    wait "$pid" 2>/dev/null || true
                    rm -f "$tmpfile"
                    printf 'unresponsive'
                    return 1
                fi
            done
            
            wait "$pid" 2>/dev/null
            exit_code=$?
            docker_info_output="$(cat "$tmpfile" 2>/dev/null)"
            rm -f "$tmpfile"
        fi
    fi

    # Check for success
    if [[ $exit_code -eq 0 ]]; then
        printf 'running'
        return 0
    fi

    # Parse error output to determine cause
    # Check for permission denied errors
    if printf '%s' "$docker_info_output" | grep -qi "permission denied\|connect: permission denied\|dial unix.*permission denied"; then
        printf 'permission_denied'
        return 1
    fi

    # Check for daemon not running errors
    if printf '%s' "$docker_info_output" | grep -qi "cannot connect\|connection refused\|is the docker daemon running\|docker daemon is not running"; then
        printf 'not_running'
        return 1
    fi

    # Generic failure - assume not running
    printf 'not_running'
    return 1
}

# ==============================================================================
# DOCKER COMPOSE DETECTION
# ==============================================================================

# Check for Docker Compose (v2 plugin or v1 standalone)
# Prefers v2 (docker compose) over v1 (docker-compose)
# Returns: "v2:<version>", "v1:<version>", or "not_installed"
# Usage: status=$(check_docker_compose)
check_docker_compose() {
    local version_output
    local version

    # Try Docker Compose v2 (plugin) first: "docker compose version"
    if _docker_command_exists docker; then
        if [[ -n "${_DOCKER_DETECT_TEST_MODE:-}" ]]; then
            version_output="${_mock_docker_compose_output:-}"
            if [[ -n "$version_output" ]]; then
                # Parse version from "Docker Compose version v2.21.0"
                version="$(printf '%s' "$version_output" | awk '{print $NF}' | tr -d 'v')"
                if [[ -n "$version" ]]; then
                    printf 'v2:%s' "$version"
                    return 0
                fi
            fi
        else
            version_output="$(docker compose version 2>/dev/null)" && {
                # Parse version from "Docker Compose version v2.21.0"
                version="$(printf '%s' "$version_output" | awk '{print $NF}' | tr -d 'v')"
                if [[ -n "$version" ]]; then
                    printf 'v2:%s' "$version"
                    return 0
                fi
            }
        fi
    fi

    # Try legacy docker-compose (v1 standalone)
    if _docker_command_exists docker-compose; then
        if [[ -n "${_DOCKER_DETECT_TEST_MODE:-}" ]]; then
            version_output="${_mock_docker_compose_v1_output:-}"
        else
            version_output="$(docker-compose --version 2>/dev/null)"
        fi
        
        if [[ -n "$version_output" ]]; then
            # Parse version from "docker-compose version 1.29.2, build 5becea4c"
            # or "Docker Compose version v2.x.x" (some installations)
            # Extract first semantic version pattern: v?[0-9]+(\.[0-9]+)+
            version="$(printf '%s' "$version_output" | grep -oE 'v?[0-9]+(\.[0-9]+)+' | head -n1 | sed 's/^v//')"
            if [[ -n "$version" ]]; then
                # Determine if it's actually v1 or v2 masquerading as docker-compose
                if [[ "$version" =~ ^1\. ]]; then
                    printf 'v1:%s' "$version"
                else
                    printf 'v2:%s' "$version"
                fi
                return 0
            fi
        fi
    fi

    printf 'not_installed'
    return 1
}

# ==============================================================================
# AGGREGATED STATUS
# ==============================================================================

# Get complete Docker status as a single string
# Format: "CLI:<status>|DAEMON:<status>|COMPOSE:<status>"
# Usage: status=$(get_docker_status)
#        echo "$status"  # CLI:installed:24.0.7|DAEMON:running|COMPOSE:v2:2.21.0
get_docker_status() {
    local cli_status
    local daemon_status
    local compose_status

    cli_status="$(check_docker_cli)"
    daemon_status="$(check_docker_daemon)"
    compose_status="$(check_docker_compose)"

    printf 'CLI:%s|DAEMON:%s|COMPOSE:%s' "$cli_status" "$daemon_status" "$compose_status"
}

# Parse a specific component from the aggregated status string
# Usage: cli=$(parse_docker_status "$status" "CLI")
#        daemon=$(parse_docker_status "$status" "DAEMON")
#        compose=$(parse_docker_status "$status" "COMPOSE")
parse_docker_status() {
    local status_string="${1:-}"
    local component="${2:-}"

    case "$component" in
        CLI)
            printf '%s' "$status_string" | sed -n 's/.*CLI:\([^|]*\).*/\1/p'
            ;;
        DAEMON)
            printf '%s' "$status_string" | sed -n 's/.*DAEMON:\([^|]*\).*/\1/p'
            ;;
        COMPOSE)
            printf '%s' "$status_string" | sed -n 's/.*COMPOSE:\([^|]*\).*/\1/p'
            ;;
        *)
            printf ''
            return 1
            ;;
    esac
}

# ==============================================================================
# STATUS CHECK HELPERS
# ==============================================================================

# Check if Docker is fully operational (CLI installed, daemon running)
# Usage: if is_docker_operational; then echo "Ready"; fi
is_docker_operational() {
    local daemon_status
    daemon_status="$(check_docker_daemon)"
    [[ "$daemon_status" == "running" ]]
}

# Check if Docker Compose is available (any version)
# Usage: if is_compose_available; then echo "Compose ready"; fi
is_compose_available() {
    local compose_status
    compose_status="$(check_docker_compose)"
    [[ "$compose_status" != "not_installed" ]]
}

# ==============================================================================
# PLATFORM-SPECIFIC GUIDANCE
# ==============================================================================

# Get installation guidance for the current platform
# This function provides helpful next-step instructions without attempting installation
# Usage: guidance=$(get_docker_install_guidance)
get_docker_install_guidance() {
    local os_type
    os_type="$(uname -s)"

    case "$os_type" in
        Darwin)
            _get_macos_docker_guidance
            ;;
        Linux)
            if [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qi "microsoft\|wsl" /proc/version 2>/dev/null; then
                _get_wsl_docker_guidance
            else
                _get_linux_docker_guidance
            fi
            ;;
        *)
            printf 'Please visit https://docs.docker.com/get-docker/ for installation instructions.\n'
            ;;
    esac
}

# macOS-specific Docker installation guidance
_get_macos_docker_guidance() {
    cat <<'EOF'
Docker Desktop for macOS Installation:
---------------------------------------
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Open the downloaded .dmg file
3. Drag Docker.app to your Applications folder
4. Launch Docker from Applications
5. Complete the setup wizard and grant necessary permissions

Alternatively, using Homebrew:
  brew install --cask docker

After installation, ensure Docker Desktop is running (whale icon in menu bar).
EOF
}

# WSL-specific Docker guidance
_get_wsl_docker_guidance() {
    cat <<'EOF'
Docker for WSL Installation:
----------------------------
Option 1: Docker Desktop for Windows (Recommended)
  1. Install Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop/
  2. Enable WSL 2 integration in Docker Desktop settings:
     Settings > Resources > WSL Integration > Enable for your distro
  3. Restart your WSL terminal

Option 2: Docker Engine in WSL (Native)
  Follow the Linux installation guide for your WSL distribution:
  https://docs.docker.com/engine/install/

Note: If Docker is installed but not accessible, you may need to:
  - Start Docker Desktop on Windows
  - Add your user to the docker group: sudo usermod -aG docker $USER
  - Log out and back in for group changes to take effect
EOF
}

# Linux-specific Docker guidance
_get_linux_docker_guidance() {
    local distro=""
    
    if [[ -f /etc/os-release ]]; then
        distro="$( ( . /etc/os-release 2>/dev/null; printf '%s' "${ID:-}" ) )"
    fi

    cat <<EOF
Docker Engine for Linux Installation:
-------------------------------------
EOF

    case "$distro" in
        ubuntu|debian)
            cat <<'EOF'
For Ubuntu/Debian:
  # Update package index
  sudo apt-get update

  # Install prerequisites
  sudo apt-get install -y ca-certificates curl gnupg

  # Add Docker's official GPG key
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  # Set up repository and install
  # Visit: https://docs.docker.com/engine/install/ubuntu/
EOF
            ;;
        fedora|rhel|centos)
            cat <<'EOF'
For Fedora/RHEL/CentOS:
  # Install using dnf/yum
  sudo dnf install -y dnf-plugins-core
  sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

  # Visit: https://docs.docker.com/engine/install/fedora/
EOF
            ;;
        *)
            cat <<'EOF'
Visit the Docker documentation for your distribution:
https://docs.docker.com/engine/install/
EOF
            ;;
    esac

    cat <<'EOF'

After installation:
  # Start Docker service
  sudo systemctl start docker
  sudo systemctl enable docker

  # Add your user to docker group (to run without sudo)
  sudo usermod -aG docker $USER

  # Log out and back in for group changes to take effect
EOF
}

# Get guidance for permission denied errors
# Usage: guidance=$(get_permission_guidance)
get_permission_guidance() {
    cat <<'EOF'
Docker Permission Denied:
-------------------------
Your user does not have permission to access the Docker daemon.

To fix this:
  1. Add your user to the docker group:
     sudo usermod -aG docker $USER

  2. Log out and log back in (or restart your terminal)

  3. Verify with: docker info

Note: Adding users to the docker group grants root-equivalent privileges.
Only add trusted users to this group.
EOF
}

# Get guidance for daemon not running
# Usage: guidance=$(get_daemon_not_running_guidance)
get_daemon_not_running_guidance() {
    local os_type
    os_type="$(uname -s)"

    cat <<'EOF'
Docker Daemon Not Running:
--------------------------
The Docker CLI is installed but the daemon is not running.

EOF

    case "$os_type" in
        Darwin)
            cat <<'EOF'
On macOS:
  - Open Docker Desktop from Applications
  - Wait for Docker to start (whale icon in menu bar stops animating)
  - Or start from command line: open -a Docker
EOF
            ;;
        Linux)
            if [[ -n "${WSL_DISTRO_NAME:-}" ]] || grep -qi "microsoft\|wsl" /proc/version 2>/dev/null; then
                cat <<'EOF'
On WSL:
  - Start Docker Desktop on Windows
  - Ensure WSL integration is enabled in Docker Desktop settings
  - Or if using native Docker in WSL:
    sudo service docker start
EOF
            else
                cat <<'EOF'
On Linux:
  # Start Docker daemon
  sudo systemctl start docker

  # Enable Docker to start on boot
  sudo systemctl enable docker

  # Check daemon status
  sudo systemctl status docker
EOF
            fi
            ;;
        *)
            cat <<'EOF'
Please start the Docker daemon according to your system's documentation.
EOF
            ;;
    esac
}

# ==============================================================================
# DIAGNOSTIC OUTPUT
# ==============================================================================

# Print a comprehensive Docker status report
# Usage: print_docker_status_report
print_docker_status_report() {
    local cli_status
    local daemon_status
    local compose_status

    cli_status="$(check_docker_cli)"
    daemon_status="$(check_docker_daemon)"
    compose_status="$(check_docker_compose)"

    printf '\n'
    printf 'Docker Status Report\n'
    printf '====================\n'
    printf '\n'

    # CLI Status
    printf 'Docker CLI:     '
    case "$cli_status" in
        installed:*)
            local version="${cli_status#installed:}"
            printf 'Installed (version %s)\n' "$version"
            ;;
        not_installed)
            printf 'Not installed\n'
            ;;
        *)
            printf '%s\n' "$cli_status"
            ;;
    esac

    # Daemon Status
    printf 'Docker Daemon:  '
    case "$daemon_status" in
        running)
            printf 'Running\n'
            ;;
        not_running)
            printf 'Not running\n'
            ;;
        permission_denied)
            printf 'Permission denied\n'
            ;;
        unresponsive)
            printf 'Unresponsive (timed out)\n'
            ;;
        cli_not_installed)
            printf 'Cannot check (CLI not installed)\n'
            ;;
        *)
            printf '%s\n' "$daemon_status"
            ;;
    esac

    # Compose Status
    printf 'Docker Compose: '
    case "$compose_status" in
        v2:*)
            local version="${compose_status#v2:}"
            printf 'Installed (v2 plugin, version %s)\n' "$version"
            ;;
        v1:*)
            local version="${compose_status#v1:}"
            printf 'Installed (v1 standalone, version %s)\n' "$version"
            ;;
        not_installed)
            printf 'Not installed\n'
            ;;
        *)
            printf '%s\n' "$compose_status"
            ;;
    esac

    printf '\n'

    # Overall status and guidance
    if [[ "$daemon_status" == "running" ]]; then
        printf 'Status: Docker is operational\n'
    else
        printf 'Status: Docker is NOT operational\n'
        printf '\n'
        
        # Provide appropriate guidance
        case "$daemon_status" in
            permission_denied)
                get_permission_guidance
                ;;
            not_running|unresponsive)
                get_daemon_not_running_guidance
                ;;
            cli_not_installed)
                get_docker_install_guidance
                ;;
        esac
    fi
}

# ==============================================================================
# MANUAL TEST COMMANDS
# ==============================================================================
# To test this library, run the following commands in a bash shell:
#
# # Source the library
# source ./scripts/install/lib/docker-detect.sh
#
# # Test CLI detection
# echo "CLI: $(check_docker_cli)"
#
# # Test daemon detection
# echo "Daemon: $(check_docker_daemon)"
#
# # Test compose detection
# echo "Compose: $(check_docker_compose)"
#
# # Test aggregated status
# echo "Full status: $(get_docker_status)"
#
# # Test status parsing
# status=$(get_docker_status)
# echo "Parsed CLI: $(parse_docker_status "$status" "CLI")"
# echo "Parsed DAEMON: $(parse_docker_status "$status" "DAEMON")"
# echo "Parsed COMPOSE: $(parse_docker_status "$status" "COMPOSE")"
#
# # Test operational check
# is_docker_operational && echo "Docker is operational" || echo "Docker is NOT operational"
#
# # Test compose availability
# is_compose_available && echo "Compose is available" || echo "Compose is NOT available"
#
# # Print full status report
# print_docker_status_report
#
# # Test guidance functions
# echo "=== Install Guidance ==="
# get_docker_install_guidance
#
# echo "=== Permission Guidance ==="
# get_permission_guidance
#
# echo "=== Daemon Not Running Guidance ==="
# get_daemon_not_running_guidance
# ==============================================================================

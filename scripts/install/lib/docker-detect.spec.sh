#!/bin/bash
# ==============================================================================
# Talawa Admin - Docker Detection Library Test Suite
# ==============================================================================
# Automated tests for docker-detect.sh using mock-based testing.
# Uses mock environment variables to simulate different Docker configurations.
#
# Usage:
#   bash scripts/install/lib/docker-detect.spec.sh
#   # or
#   ./scripts/install/lib/docker-detect.spec.sh
#
# Test Coverage:
#   - Docker CLI detection (installed/not installed)
#   - Docker daemon detection (running/not running/permission denied)
#   - Docker Compose detection (v1/v2/not installed)
#   - Aggregated status
#   - Status parsing
#   - Helper functions (is_docker_operational, is_compose_available)
#   - Guidance functions
#
# Execution Model:
#   Tests run serially (not in parallel). Each test uses setup_test_env() and
#   reset_mock_env() to isolate mock variables (_mock_has_docker, _mock_docker_cli_output,
#   _mock_docker_info_output, etc.). The run_test() wrapper ensures mocks are reset
#   between tests so state does not leak. Some tests use subshells for additional
#   isolation when overriding shell functions (e.g., uname, grep).
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

reset_mock_env() {
    unset _DOCKER_DETECT_TEST_MODE
    unset _mock_has_docker
    unset _mock_has_docker_compose_v1
    unset _mock_docker_cli_output
    unset _mock_docker_info_output
    unset _mock_docker_info_exit_code
    unset _mock_docker_info_timeout
    unset _mock_docker_compose_output
    unset _mock_docker_compose_v1_output
    unset TALAWA_DOCKER_DETECT_SOURCED
}

setup_test_env() {
    reset_mock_env
    export _DOCKER_DETECT_TEST_MODE=1
}

source_docker_detect() {
    local docker_detect_path="$SCRIPT_DIR/docker-detect.sh"
    # shellcheck source=scripts/install/lib/docker-detect.sh
    source "$docker_detect_path"
}

assert_equals() {
    local expected="$1"
    local actual="$2"
    local message="${3:-Assertion failed}"
    
    if [[ "$expected" == "$actual" ]]; then
        return 0
    else
        echo "  ✗ FAILED: $message"
        echo "    Expected: '$expected'"
        echo "    Actual:   '$actual'"
        return 1
    fi
}

assert_contains() {
    local needle="$1"
    local haystack="$2"
    local message="${3:-Assertion failed}"
    
    if [[ "$haystack" == *"$needle"* ]]; then
        return 0
    else
        echo "  ✗ FAILED: $message"
        echo "    Expected to contain: '$needle'"
        echo "    Actual: '$haystack'"
        return 1
    fi
}

run_test() {
    local test_name="$1"
    local test_func="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo ""
    echo "Running: $test_name"
    
    setup_test_env
    
    set +e
    $test_func
    local test_result=$?
    set -e
    
    if [[ $test_result -eq 0 ]]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ PASSED"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        FAILED_TESTS+=("$test_name")
    fi
    
    reset_mock_env
}

# ==============================================================================
# CLI DETECTION TESTS
# ==============================================================================

test_cli_installed() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    
    source_docker_detect
    
    local result
    result=$(check_docker_cli)
    
    assert_equals "installed:24.0.7" "$result" "CLI should be detected as installed:24.0.7"
}

test_cli_not_installed() {
    export _mock_has_docker="false"
    
    source_docker_detect
    
    local result
    result=$(check_docker_cli)
    
    assert_equals "not_installed" "$result" "CLI should be detected as not_installed"
}

test_cli_version_parsing_different_format() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 20.10.21, build baeda1f"
    
    source_docker_detect
    
    local result
    result=$(check_docker_cli)
    
    assert_equals "installed:20.10.21" "$result" "CLI version should be parsed correctly"
}

# ==============================================================================
# DAEMON DETECTION TESTS
# ==============================================================================

test_daemon_running() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Server Version: 24.0.7"
    export _mock_docker_info_exit_code="0"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "running" "$result" "Daemon should be detected as running"
}

test_daemon_not_running() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Cannot connect to the Docker daemon"
    export _mock_docker_info_exit_code="1"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "not_running" "$result" "Daemon should be detected as not_running"
}

test_daemon_permission_denied() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Got permission denied while trying to connect"
    export _mock_docker_info_exit_code="1"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "permission_denied" "$result" "Daemon should be detected as permission_denied"
}

test_daemon_cli_not_installed() {
    export _mock_has_docker="false"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "cli_not_installed" "$result" "Daemon check should return cli_not_installed when CLI missing"
}

test_daemon_connection_refused() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="error during connect: connection refused"
    export _mock_docker_info_exit_code="1"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "not_running" "$result" "Connection refused should be detected as not_running"
}

test_daemon_unresponsive() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_timeout="true"
    
    source_docker_detect
    
    local result
    result=$(check_docker_daemon)
    
    assert_equals "unresponsive" "$result" "Timeout should be detected as unresponsive"
}

# ==============================================================================
# COMPOSE DETECTION TESTS
# ==============================================================================

test_compose_v2_installed() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_compose_output="Docker Compose version v2.21.0"
    
    source_docker_detect
    
    local result
    result=$(check_docker_compose)
    
    assert_equals "v2:2.21.0" "$result" "Compose v2 should be detected"
}

test_compose_v1_installed() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_compose_output=""
    export _mock_has_docker_compose_v1="true"
    export _mock_docker_compose_v1_output="docker-compose version 1.29.2, build 5becea4c"
    
    source_docker_detect
    
    local result
    result=$(check_docker_compose)
    
    assert_equals "v1:1.29.2" "$result" "Compose v1 should be detected"
}

test_compose_not_installed() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_compose_output=""
    export _mock_has_docker_compose_v1="false"
    
    source_docker_detect
    
    local result
    result=$(check_docker_compose)
    
    assert_equals "not_installed" "$result" "Compose should be detected as not_installed"
}

test_compose_no_docker_cli() {
    export _mock_has_docker="false"
    export _mock_has_docker_compose_v1="false"
    
    source_docker_detect
    
    local result
    result=$(check_docker_compose)
    
    assert_equals "not_installed" "$result" "Compose should be not_installed when Docker CLI missing"
}

# ==============================================================================
# AGGREGATED STATUS TESTS
# ==============================================================================

test_get_docker_status_all_working() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Server Version: 24.0.7"
    export _mock_docker_info_exit_code="0"
    export _mock_docker_compose_output="Docker Compose version v2.21.0"
    
    source_docker_detect
    
    local result
    result=$(get_docker_status)
    
    assert_equals "CLI:installed:24.0.7|DAEMON:running|COMPOSE:v2:2.21.0" "$result" \
        "Full status should be correct when everything is working"
}

test_get_docker_status_nothing_installed() {
    export _mock_has_docker="false"
    export _mock_has_docker_compose_v1="false"
    
    source_docker_detect
    
    local result
    result=$(get_docker_status)
    
    assert_equals "CLI:not_installed|DAEMON:cli_not_installed|COMPOSE:not_installed" "$result" \
        "Full status should reflect nothing installed"
}

# ==============================================================================
# STATUS PARSING TESTS
# ==============================================================================

test_parse_docker_status_cli() {
    source_docker_detect
    
    local status="CLI:installed:24.0.7|DAEMON:running|COMPOSE:v2:2.21.0"
    local result
    result=$(parse_docker_status "$status" "CLI")
    
    assert_equals "installed:24.0.7" "$result" "CLI parsing should work"
}

test_parse_docker_status_daemon() {
    source_docker_detect
    
    local status="CLI:installed:24.0.7|DAEMON:permission_denied|COMPOSE:v2:2.21.0"
    local result
    result=$(parse_docker_status "$status" "DAEMON")
    
    assert_equals "permission_denied" "$result" "DAEMON parsing should work"
}

test_parse_docker_status_compose() {
    source_docker_detect
    
    local status="CLI:installed:24.0.7|DAEMON:running|COMPOSE:not_installed"
    local result
    result=$(parse_docker_status "$status" "COMPOSE")
    
    assert_equals "not_installed" "$result" "COMPOSE parsing should work"
}

test_parse_docker_status_invalid() {
    source_docker_detect
    
    local status="CLI:installed:24.0.7|DAEMON:running|COMPOSE:v2:2.21.0"
    local result
    result=$(parse_docker_status "$status" "INVALID") || true
    
    assert_equals "" "$result" "Invalid component should return empty string"
}

# ==============================================================================
# HELPER FUNCTION TESTS
# ==============================================================================

test_is_docker_operational_true() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Server Version: 24.0.7"
    export _mock_docker_info_exit_code="0"
    
    source_docker_detect
    
    if is_docker_operational; then
        return 0
    else
        echo "  ✗ FAILED: is_docker_operational should return true when daemon is running"
        return 1
    fi
}

test_is_docker_operational_false() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Cannot connect to the Docker daemon"
    export _mock_docker_info_exit_code="1"
    
    source_docker_detect
    
    if is_docker_operational; then
        echo "  ✗ FAILED: is_docker_operational should return false when daemon is not running"
        return 1
    else
        return 0
    fi
}

test_is_compose_available_true() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_compose_output="Docker Compose version v2.21.0"
    
    source_docker_detect
    
    if is_compose_available; then
        return 0
    else
        echo "  ✗ FAILED: is_compose_available should return true when compose is installed"
        return 1
    fi
}

test_is_compose_available_false() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_compose_output=""
    export _mock_has_docker_compose_v1="false"
    
    source_docker_detect
    
    if is_compose_available; then
        echo "  ✗ FAILED: is_compose_available should return false when compose is not installed"
        return 1
    else
        return 0
    fi
}

# ==============================================================================
# GUIDANCE FUNCTION TESTS
# ==============================================================================

test_permission_guidance_output() {
    source_docker_detect
    
    local result
    result=$(get_permission_guidance)
    
    assert_contains "docker group" "$result" "Permission guidance should mention docker group" && \
    assert_contains "usermod" "$result" "Permission guidance should mention usermod command"
}

test_daemon_not_running_guidance_output() {
    source_docker_detect
    
    local result
    result=$(get_daemon_not_running_guidance)
    
    assert_contains "not running" "$result" "Daemon guidance should mention not running"
}

# ==============================================================================
# OS-SPECIFIC GUIDANCE TESTS
# ==============================================================================

test_macos_docker_guidance() {
    source_docker_detect
    
    local result
    result=$(_get_macos_docker_guidance)
    
    assert_contains "Docker Desktop for macOS" "$result" "macOS guidance should mention Docker Desktop" && \
    assert_contains "Applications" "$result" "macOS guidance should mention Applications folder" && \
    assert_contains "Homebrew" "$result" "macOS guidance should mention Homebrew alternative" && \
    assert_contains "brew install" "$result" "macOS guidance should include brew install command"
}

test_wsl_docker_guidance() {
    source_docker_detect
    
    local result
    result=$(_get_wsl_docker_guidance)
    
    assert_contains "WSL" "$result" "WSL guidance should mention WSL" && \
    assert_contains "Docker Desktop for Windows" "$result" "WSL guidance should mention Docker Desktop" && \
    assert_contains "WSL Integration" "$result" "WSL guidance should mention WSL Integration" && \
    assert_contains "usermod -aG docker" "$result" "WSL guidance should mention docker group"
}

test_linux_docker_guidance_common_header() {
    source_docker_detect
    
    local result
    result=$(_get_linux_docker_guidance)
    
    assert_contains "Docker Engine for Linux" "$result" "Linux guidance should show header" && \
    assert_contains "systemctl" "$result" "Linux guidance should mention systemctl" && \
    assert_contains "usermod -aG docker" "$result" "Linux guidance should mention docker group"
}

test_linux_docker_guidance_common_footer() {
    source_docker_detect
    
    local result
    result=$(_get_linux_docker_guidance)
    
    assert_contains "Docker Engine for Linux" "$result" "Linux guidance should show header" && \
    assert_contains "usermod -aG docker" "$result" "Linux guidance should mention docker group"
}

test_linux_docker_guidance_common_docs_url() {
    source_docker_detect
    
    local result
    result=$(_get_linux_docker_guidance)
    
    assert_contains "Docker" "$result" "Linux guidance should mention Docker" && \
    assert_contains "https://docs.docker.com" "$result" "Linux guidance should include docs URL"
}

test_get_docker_install_guidance_macos() {
    source_docker_detect
    
    local result
    result=$(uname() { echo "Darwin"; }; get_docker_install_guidance)
    
    assert_contains "Docker Desktop for macOS" "$result" "Install guidance should detect macOS"
}

test_get_docker_install_guidance_wsl() {
    source_docker_detect
    
    local result
    result=$(
        uname() { echo "Linux"; }
        export WSL_DISTRO_NAME="Ubuntu"
        get_docker_install_guidance
    )
    
    assert_contains "WSL" "$result" "Install guidance should detect WSL via WSL_DISTRO_NAME"
}

test_get_docker_install_guidance_linux_fallback() {
    source_docker_detect
    
    local result
    result=$(
        uname() { echo "Linux"; }
        unset WSL_DISTRO_NAME
        grep() {
            if [[ "$*" == *"/proc/version"* ]]; then
                return 1
            fi
            command grep "$@"
        }
        export -f grep
        get_docker_install_guidance
    )
    
    assert_contains "Docker Engine for Linux" "$result" "Install guidance should fall back to Linux guidance when not WSL"
}

test_get_docker_install_guidance_unknown_os() {
    source_docker_detect
    
    local result
    result=$(uname() { echo "FreeBSD"; }; get_docker_install_guidance)
    
    assert_contains "https://docs.docker.com/get-docker/" "$result" "Install guidance should provide generic URL for unknown OS"
}

test_print_docker_status_report_all_working() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    export _mock_docker_info_output="Server Version: 24.0.7"
    export _mock_docker_info_exit_code=0
    export _mock_docker_compose_output="Docker Compose version v2.21.0"
    
    source_docker_detect
    
    local result
    result=$(print_docker_status_report)
    
    assert_contains "Docker CLI" "$result" "Status report should mention Docker CLI" && \
    assert_contains "Installed" "$result" "Status report should show Installed status" && \
    assert_contains "24.0.7" "$result" "Status report should show CLI version" && \
    assert_contains "Running" "$result" "Status report should show daemon running"
}

test_print_docker_status_report_nothing_installed() {
    export _mock_has_docker="false"
    
    source_docker_detect
    
    local result
    result=$(print_docker_status_report)
    
    assert_contains "Not installed" "$result" "Status report should show Not installed for CLI"
}

# ==============================================================================
# IDEMPOTENCY TESTS
# ==============================================================================

test_multiple_source_guard() {
    export _mock_has_docker="true"
    export _mock_docker_cli_output="Docker version 24.0.7, build afdd53b"
    
    source_docker_detect
    local first_result
    first_result=$(check_docker_cli)
    
    source_docker_detect
    local second_result
    second_result=$(check_docker_cli)
    
    assert_equals "$first_result" "$second_result" "Multiple sourcing should produce same results"
}

# ==============================================================================
# MAIN TEST RUNNER
# ==============================================================================

main() {
    echo "=========================================="
    echo "Docker Detection Library Test Suite"
    echo "=========================================="
    
    # CLI Detection Tests
    run_test "CLI Installed Detection" test_cli_installed
    run_test "CLI Not Installed Detection" test_cli_not_installed
    run_test "CLI Version Parsing" test_cli_version_parsing_different_format
    
    # Daemon Detection Tests
    run_test "Daemon Running Detection" test_daemon_running
    run_test "Daemon Not Running Detection" test_daemon_not_running
    run_test "Daemon Permission Denied Detection" test_daemon_permission_denied
    run_test "Daemon CLI Not Installed" test_daemon_cli_not_installed
    run_test "Daemon Connection Refused" test_daemon_connection_refused
    run_test "Daemon Unresponsive (Timeout)" test_daemon_unresponsive
    
    # Compose Detection Tests
    run_test "Compose v2 Installed Detection" test_compose_v2_installed
    run_test "Compose v1 Installed Detection" test_compose_v1_installed
    run_test "Compose Not Installed Detection" test_compose_not_installed
    run_test "Compose No Docker CLI" test_compose_no_docker_cli
    
    # Aggregated Status Tests
    run_test "Full Status All Working" test_get_docker_status_all_working
    run_test "Full Status Nothing Installed" test_get_docker_status_nothing_installed
    
    # Status Parsing Tests
    run_test "Parse Status CLI" test_parse_docker_status_cli
    run_test "Parse Status DAEMON" test_parse_docker_status_daemon
    run_test "Parse Status COMPOSE" test_parse_docker_status_compose
    run_test "Parse Status Invalid Component" test_parse_docker_status_invalid
    
    # Helper Function Tests
    run_test "is_docker_operational True" test_is_docker_operational_true
    run_test "is_docker_operational False" test_is_docker_operational_false
    run_test "is_compose_available True" test_is_compose_available_true
    run_test "is_compose_available False" test_is_compose_available_false
    
    # Guidance Function Tests
    run_test "Permission Guidance Output" test_permission_guidance_output
    run_test "Daemon Not Running Guidance" test_daemon_not_running_guidance_output
    
    # OS-Specific Guidance Tests
    run_test "macOS Docker Guidance" test_macos_docker_guidance
    run_test "WSL Docker Guidance" test_wsl_docker_guidance
    run_test "Linux Docker Guidance - Common Header" test_linux_docker_guidance_common_header
    run_test "Linux Docker Guidance - Common Footer" test_linux_docker_guidance_common_footer
    run_test "Linux Docker Guidance - Common Docs URL" test_linux_docker_guidance_common_docs_url
    run_test "Get Install Guidance - macOS" test_get_docker_install_guidance_macos
    run_test "Get Install Guidance - WSL (env)" test_get_docker_install_guidance_wsl
    run_test "Get Install Guidance - Linux Fallback" test_get_docker_install_guidance_linux_fallback
    run_test "Get Install Guidance - Unknown OS" test_get_docker_install_guidance_unknown_os
    run_test "Print Status Report - All Working" test_print_docker_status_report_all_working
    run_test "Print Status Report - Nothing Installed" test_print_docker_status_report_nothing_installed
    
    # Idempotency Tests
    run_test "Multiple Source Guard" test_multiple_source_guard
    
    echo ""
    echo "=========================================="
    echo "Test Results"
    echo "=========================================="
    echo "Total Tests:  $TESTS_RUN"
    echo "Passed:       $TESTS_PASSED"
    echo "Failed:       $TESTS_FAILED"
    
    if [[ $TESTS_FAILED -gt 0 ]]; then
        echo ""
        echo "Failed Tests:"
        for test in "${FAILED_TESTS[@]}"; do
            echo "  - $test"
        done
        echo ""
        echo "✗ TEST SUITE FAILED"
        exit 1
    else
        echo ""
        echo "✓ ALL TESTS PASSED"
        exit 0
    fi
}

main "$@"

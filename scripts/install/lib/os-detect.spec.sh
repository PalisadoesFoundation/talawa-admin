#!/bin/bash
# ==============================================================================
# Talawa Admin - OS Detection Library Test Suite
# ==============================================================================
# Automated tests for os-detect.sh using fixture-based testing.
# Creates temporary filesystem fixtures to simulate different OS environments.
#
# Usage:
#   bash scripts/install/lib/os-detect.spec.sh
#   # or
#   ./scripts/install/lib/os-detect.spec.sh
#
# Test Coverage:
#   - macOS detection
#   - Debian/Ubuntu detection
#   - RHEL/Fedora detection
#   - WSL detection (all variants)
#   - Caching and idempotency
#   - Variable exports
#   - Unknown OS fallback
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_TEMP_DIR=""
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

setup_test_env() {
    TEST_TEMP_DIR="$(mktemp -d -t talawa-os-detect-test.XXXXXX)"
    export TEST_TEMP_DIR
}

cleanup_test_env() {
    if [[ -n "$TEST_TEMP_DIR" ]] && [[ -d "$TEST_TEMP_DIR" ]]; then
        rm -rf "$TEST_TEMP_DIR"
    fi
}

trap cleanup_test_env EXIT INT TERM

create_fixture() {
    local fixture_name="$1"
    local fixture_dir="$TEST_TEMP_DIR/$fixture_name"
    mkdir -p "$fixture_dir/etc" "$fixture_dir/proc"
    echo "$fixture_dir"
}

write_os_release() {
    local fixture_dir="$1"
    local content="$2"
    echo -e "$content" > "$fixture_dir/etc/os-release"
}

write_proc_version() {
    local fixture_dir="$1"
    local content="$2"
    echo "$content" > "$fixture_dir/proc/version"
}

create_debian_version() {
    local fixture_dir="$1"
    local version="$2"
    echo "$version" > "$fixture_dir/etc/debian_version"
}

create_redhat_release() {
    local fixture_dir="$1"
    local content="$2"
    echo "$content" > "$fixture_dir/etc/redhat-release"
}

source_with_fixture() {
    local fixture_dir="$1"
    
    export OS_TYPE=""
    export OS_DISPLAY_NAME=""
    export IS_WSL=false
    export _OS_DETECTED=false
    
    export _OS_DETECT_TEST_MODE=1
    export _OS_DETECT_ROOT="$fixture_dir"
    
    local os_detect_path="$SCRIPT_DIR/os-detect.sh"
    
    # shellcheck source=scripts/install/lib/os-detect.sh
    source "$os_detect_path"
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

run_test() {
    local test_name="$1"
    local test_func="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    echo ""
    echo "Running: $test_name"
    
    if $test_func; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ PASSED"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        FAILED_TESTS+=("$test_name")
        echo "  ✗ FAILED"
    fi
}

test_macos_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "macos")
    
    export _TEST_OS_OVERRIDE="Darwin"
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "macos" "$OS_TYPE" "OS_TYPE should be macos" && \
    assert_equals "macOS" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be macOS" && \
    assert_equals "false" "$IS_WSL" "IS_WSL should be false"
}

test_debian_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "debian")
    
    write_os_release "$fixture_dir" "ID=ubuntu\nVERSION_ID=\"22.04\"\nNAME=\"Ubuntu\""
    create_debian_version "$fixture_dir" "12.0"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "debian" "$OS_TYPE" "OS_TYPE should be debian" && \
    assert_equals "Debian/Ubuntu" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be Debian/Ubuntu" && \
    assert_equals "false" "$IS_WSL" "IS_WSL should be false"
}

test_redhat_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "redhat")
    
    write_os_release "$fixture_dir" "ID=fedora\nVERSION_ID=\"38\"\nNAME=\"Fedora Linux\""
    create_redhat_release "$fixture_dir" "Fedora release 38 (Thirty Eight)"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "redhat" "$OS_TYPE" "OS_TYPE should be redhat" && \
    assert_equals "RHEL/CentOS/Fedora" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be RHEL/CentOS/Fedora" && \
    assert_equals "false" "$IS_WSL" "IS_WSL should be false"
}

test_wsl_debian_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "wsl-debian")
    
    write_proc_version "$fixture_dir" "Linux version 5.15.0-1-Microsoft-standard-WSL2"
    write_os_release "$fixture_dir" "ID=ubuntu\nVERSION_ID=\"22.04\"\nNAME=\"Ubuntu\""
    create_debian_version "$fixture_dir" "12.0"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "wsl-debian" "$OS_TYPE" "OS_TYPE should be wsl-debian" && \
    assert_equals "WSL (Debian/Ubuntu)" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be WSL (Debian/Ubuntu)" && \
    assert_equals "true" "$IS_WSL" "IS_WSL should be true"
}

test_wsl_redhat_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "wsl-redhat")
    
    write_proc_version "$fixture_dir" "Linux version 5.15.0 (WSL2)"
    write_os_release "$fixture_dir" "ID=fedora\nVERSION_ID=\"38\"\nNAME=\"Fedora Linux\""
    create_redhat_release "$fixture_dir" "Fedora release 38"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "wsl-redhat" "$OS_TYPE" "OS_TYPE should be wsl-redhat" && \
    assert_equals "WSL (RHEL/CentOS/Fedora)" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be WSL (RHEL/CentOS/Fedora)" && \
    assert_equals "true" "$IS_WSL" "IS_WSL should be true"
}

test_wsl_unknown_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "wsl-unknown")
    
    write_proc_version "$fixture_dir" "Linux version 5.15.0-Microsoft (WSL)"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "unknown" "$OS_TYPE" "OS_TYPE should be unknown for unrecognized WSL distro" && \
    assert_equals "WSL (Unknown)" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be WSL (Unknown)" && \
    assert_equals "true" "$IS_WSL" "IS_WSL should be true"
}

test_wsl_env_var_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "wsl-env")
    
    write_os_release "$fixture_dir" "ID=ubuntu\nNAME=\"Ubuntu\""
    
    export WSL_DISTRO_NAME="Ubuntu-22.04"
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    unset WSL_DISTRO_NAME
    
    assert_equals "wsl-debian" "$OS_TYPE" "OS_TYPE should be wsl-debian with WSL_DISTRO_NAME" && \
    assert_equals "true" "$IS_WSL" "IS_WSL should be true with WSL_DISTRO_NAME"
}

test_unknown_os_detection() {
    local fixture_dir
    fixture_dir=$(create_fixture "unknown")
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    assert_equals "unknown" "$OS_TYPE" "OS_TYPE should be unknown" && \
    assert_equals "Unknown OS" "$OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be Unknown OS" && \
    assert_equals "false" "$IS_WSL" "IS_WSL should be false"
}

test_caching_behavior() {
    local fixture_dir
    fixture_dir=$(create_fixture "cache-test")
    
    export _TEST_OS_OVERRIDE="Darwin"
    source_with_fixture "$fixture_dir"
    
    detect_os
    local first_type="$OS_TYPE"
    local first_detected="$_OS_DETECTED"
    
    detect_os
    local second_type="$OS_TYPE"
    local second_detected="$_OS_DETECTED"
    
    assert_equals "$first_type" "$second_type" "OS_TYPE should be cached" && \
    assert_equals "true" "$first_detected" "_OS_DETECTED should be true after first call" && \
    assert_equals "true" "$second_detected" "_OS_DETECTED should remain true after second call"
}

test_idempotency() {
    local fixture_dir
    fixture_dir=$(create_fixture "idempotency")
    
    write_os_release "$fixture_dir" "ID=ubuntu\nNAME=\"Ubuntu\""
    create_debian_version "$fixture_dir" "12.0"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir"
    
    detect_os
    local call1_type="$OS_TYPE"
    local call1_name="$OS_DISPLAY_NAME"
    local call1_wsl="$IS_WSL"
    
    detect_os
    local call2_type="$OS_TYPE"
    local call2_name="$OS_DISPLAY_NAME"
    local call2_wsl="$IS_WSL"
    
    detect_os
    local call3_type="$OS_TYPE"
    local call3_name="$OS_DISPLAY_NAME"
    local call3_wsl="$IS_WSL"
    
    assert_equals "$call1_type" "$call2_type" "OS_TYPE should be identical (call 1 vs 2)" && \
    assert_equals "$call2_type" "$call3_type" "OS_TYPE should be identical (call 2 vs 3)" && \
    assert_equals "$call1_name" "$call2_name" "OS_DISPLAY_NAME should be identical (call 1 vs 2)" && \
    assert_equals "$call2_name" "$call3_name" "OS_DISPLAY_NAME should be identical (call 2 vs 3)" && \
    assert_equals "$call1_wsl" "$call2_wsl" "IS_WSL should be identical (call 1 vs 2)" && \
    assert_equals "$call2_wsl" "$call3_wsl" "IS_WSL should be identical (call 2 vs 3)"
}

test_get_os_display_name_function() {
    local fixture_dir
    fixture_dir=$(create_fixture "display-name")
    
    export _TEST_OS_OVERRIDE="Darwin"
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    local display_name
    display_name=$(get_os_display_name)
    
    assert_equals "macOS" "$display_name" "get_os_display_name should return correct value" && \
    assert_equals "$OS_DISPLAY_NAME" "$display_name" "get_os_display_name should match OS_DISPLAY_NAME"
}

test_exported_variables() {
    local fixture_dir
    fixture_dir=$(create_fixture "export-test")
    
    export _TEST_OS_OVERRIDE="Darwin"
    source_with_fixture "$fixture_dir"
    
    detect_os
    
    # Capture expected values from parent shell
    local expected_OS_TYPE="$OS_TYPE"
    local expected_OS_DISPLAY_NAME="$OS_DISPLAY_NAME"
    local expected_IS_WSL="$IS_WSL"
    local expected_OS_DETECTED="$_OS_DETECTED"
    
    # Verify each variable is exported with correct value in subshells
    local subshell_OS_TYPE subshell_OS_DISPLAY_NAME subshell_IS_WSL subshell_OS_DETECTED
    subshell_OS_TYPE=$(bash -c 'echo "${OS_TYPE-}"')
    subshell_OS_DISPLAY_NAME=$(bash -c 'echo "${OS_DISPLAY_NAME-}"')
    subshell_IS_WSL=$(bash -c 'echo "${IS_WSL-}"')
    subshell_OS_DETECTED=$(bash -c 'echo "${_OS_DETECTED-}"')
    
    assert_equals "$expected_OS_TYPE" "$subshell_OS_TYPE" "OS_TYPE should be exported with correct value" && \
    assert_equals "$expected_OS_DISPLAY_NAME" "$subshell_OS_DISPLAY_NAME" "OS_DISPLAY_NAME should be exported with correct value" && \
    assert_equals "$expected_IS_WSL" "$subshell_IS_WSL" "IS_WSL should be exported with correct value" && \
    assert_equals "$expected_OS_DETECTED" "$subshell_OS_DETECTED" "_OS_DETECTED should be exported with correct value"
}

test_is_wsl_reset() {
    local fixture_dir1 fixture_dir2
    fixture_dir1=$(create_fixture "wsl-reset-1")
    fixture_dir2=$(create_fixture "wsl-reset-2")
    
    write_proc_version "$fixture_dir1" "Linux version 5.15.0-Microsoft-WSL2"
    write_os_release "$fixture_dir1" "ID=ubuntu\nNAME=\"Ubuntu\""
    create_debian_version "$fixture_dir1" "12.0"
    
    write_os_release "$fixture_dir2" "ID=ubuntu\nNAME=\"Ubuntu\""
    create_debian_version "$fixture_dir2" "12.0"
    
    unset _TEST_OS_OVERRIDE
    source_with_fixture "$fixture_dir2"
    detect_os
    
    local non_wsl_is_wsl="$IS_WSL"
    local non_wsl_detected="$_OS_DETECTED"
    
    source_with_fixture "$fixture_dir1"
    detect_os
    
    local wsl_is_wsl="$IS_WSL"
    local wsl_detected="$_OS_DETECTED"
    
    assert_equals "false" "$non_wsl_is_wsl" "IS_WSL should be false for non-WSL" && \
    assert_equals "true" "$non_wsl_detected" "_OS_DETECTED should be true after first detection" && \
    assert_equals "true" "$wsl_is_wsl" "IS_WSL should be true for WSL after reset" && \
    assert_equals "true" "$wsl_detected" "_OS_DETECTED should be true after second detection"
}

main() {
    echo "=========================================="
    echo "OS Detection Library Test Suite"
    echo "=========================================="
    
    setup_test_env
    
    run_test "macOS Detection" test_macos_detection
    run_test "Debian/Ubuntu Detection" test_debian_detection
    run_test "RHEL/Fedora Detection" test_redhat_detection
    run_test "WSL Debian Detection" test_wsl_debian_detection
    run_test "WSL RHEL Detection" test_wsl_redhat_detection
    run_test "WSL Unknown Detection" test_wsl_unknown_detection
    run_test "WSL Environment Variable Detection" test_wsl_env_var_detection
    run_test "Unknown OS Detection" test_unknown_os_detection
    run_test "Caching Behavior" test_caching_behavior
    run_test "Idempotency (Multiple Calls)" test_idempotency
    run_test "get_os_display_name Function" test_get_os_display_name_function
    run_test "Exported Variables" test_exported_variables
    run_test "IS_WSL Reset on Detection" test_is_wsl_reset
    
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

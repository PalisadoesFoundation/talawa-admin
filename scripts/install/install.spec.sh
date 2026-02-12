#!/bin/bash
# ==============================================================================
# Talawa Admin - Main Install Script Test Suite
# ==============================================================================
# Tests for scripts/install/install.sh covering:
#   - Flag parsing (--help, --skip-docker-check, --non-interactive, --dry-run, --verbose)
#   - Unknown flag rejection
#   - Missing library detection
#   - Wrapper path delegation
#   - Non-interactive mode
#   - Dry-run mode (no side effects)
#
# Usage:
#   bash scripts/install/install.spec.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_SCRIPT="$SCRIPT_DIR/install.sh"
WRAPPER_SCRIPT="$SCRIPT_DIR/../install.sh"
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

run_test() {
    local test_name="$1"
    local test_func="$2"

    TESTS_RUN=$((TESTS_RUN + 1))
    echo ""
    echo "Running: $test_name"

    if ( "$test_func" ); then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "  ✓ PASSED"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        FAILED_TESTS+=("$test_name")
        echo "  ✗ FAILED"
    fi
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
    local haystack="$1"
    local needle="$2"
    local message="${3:-Assertion failed}"

    if [[ "$haystack" == *"$needle"* ]]; then
        return 0
    else
        echo "  ✗ FAILED: $message"
        echo "    Expected to contain: '$needle'"
        echo "    In: '$haystack'"
        return 1
    fi
}

assert_not_contains() {
    local haystack="$1"
    local needle="$2"
    local message="${3:-Assertion failed}"

    if [[ "$haystack" != *"$needle"* ]]; then
        return 0
    else
        echo "  ✗ FAILED: $message"
        echo "    Expected NOT to contain: '$needle'"
        echo "    In: '$haystack'"
        return 1
    fi
}

# ==============================================================================
# TEST: --help flag
# ==============================================================================
test_help_flag() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --help 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "--help should exit with 0" && \
    assert_contains "$output" "Usage:" "--help should show Usage" && \
    assert_contains "$output" "--skip-docker-check" "--help should list --skip-docker-check" && \
    assert_contains "$output" "--non-interactive" "--help should list --non-interactive" && \
    assert_contains "$output" "--dry-run" "--help should list --dry-run" && \
    assert_contains "$output" "--verbose" "--help should list --verbose"
}

# ==============================================================================
# TEST: Unknown flag rejection
# ==============================================================================
test_unknown_flag() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --invalid-flag 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "6" "$exit_code" "Unknown flag should exit with E_INVALID_ARG (6)" && \
    assert_contains "$output" "Unknown option" "Should report unknown option"
}

# ==============================================================================
# TEST: --dry-run does not execute pnpm install
# ==============================================================================
test_dry_run_no_side_effects() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "--dry-run should exit with 0" && \
    assert_contains "$output" "[DRY]" "Output should contain [DRY] markers" && \
    assert_contains "$output" "DRY RUN" "Output should indicate dry run mode" && \
    assert_not_contains "$output" "Dependency installation failed" "Should not attempt real install" && \
    assert_not_contains "$output" "Running pnpm install" "Should not run pnpm install" && \
    assert_not_contains "$output" "fnm not found, installing" "Should not attempt fnm install" && \
    assert_not_contains "$output" "Node.js not found, installing" "Should not attempt Node.js install" && \
    assert_not_contains "$output" "pnpm not found, installing" "Should not attempt pnpm install"
}

# ==============================================================================
# TEST: --dry-run shows all steps
# ==============================================================================
test_dry_run_shows_steps() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_contains "$output" "Step 1" "Should show Step 1 (OS detection)" && \
    assert_contains "$output" "Step 2" "Should show Step 2 (Docker)" && \
    assert_contains "$output" "Step 3" "Should show Step 3 (Node.js)" && \
    assert_contains "$output" "Step 4" "Should show Step 4 (Dependencies)" && \
    assert_contains "$output" "Step 5" "Should show Step 5 (Summary)"
}

# ==============================================================================
# TEST: --skip-docker-check skips Docker step
# ==============================================================================
test_skip_docker_check() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive --skip-docker-check 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "--skip-docker-check should exit with 0" && \
    assert_contains "$output" "Docker check skipped" "Should indicate Docker was skipped"
}

# ==============================================================================
# TEST: --verbose enables extra output
# ==============================================================================
test_verbose_flag() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive --verbose 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "--verbose should exit with 0" && \
    assert_contains "$output" "[VERBOSE]" "Verbose mode should produce [VERBOSE] output" && \
    assert_contains "$output" "Script directory" "Verbose should show script directory"
}

# ==============================================================================
# TEST: Missing library detection
# ==============================================================================
test_missing_library_detection() {
    _TEST_TEMP_DIR="$(mktemp -d -t talawa-install-test.XXXXXX)"
    trap 'rm -rf "$_TEST_TEMP_DIR"' EXIT

    cp "$INSTALL_SCRIPT" "$_TEST_TEMP_DIR/install.sh"
    mkdir -p "$_TEST_TEMP_DIR/lib"
    cp "$SCRIPT_DIR/lib/common.sh" "$_TEST_TEMP_DIR/lib/"

    local output exit_code
    output="$(bash "$_TEST_TEMP_DIR/install.sh" 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "1" "$exit_code" "Missing libs should exit with 1" && \
    assert_contains "$output" "Required library not found" "Should report missing library"
}

# ==============================================================================
# TEST: Wrapper script delegates to install/install.sh
# ==============================================================================
test_wrapper_delegates() {
    if [[ ! -f "$WRAPPER_SCRIPT" ]]; then
        echo "  ✗ FAILED: Wrapper script not found at $WRAPPER_SCRIPT"
        return 1
    fi

    local output exit_code
    output="$(bash "$WRAPPER_SCRIPT" --help 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Wrapper --help should exit with 0" && \
    assert_contains "$output" "Usage:" "Wrapper should delegate --help to main script"
}

# ==============================================================================
# TEST: Wrapper passes through all flags
# ==============================================================================
test_wrapper_passthrough_flags() {
    if [[ ! -f "$WRAPPER_SCRIPT" ]]; then
        echo "  ✗ FAILED: Wrapper script not found at $WRAPPER_SCRIPT"
        return 1
    fi

    local output exit_code
    output="$(bash "$WRAPPER_SCRIPT" --dry-run --non-interactive --skip-docker-check --verbose 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Wrapper should pass through all flags" && \
    assert_contains "$output" "[DRY]" "Wrapper should delegate dry-run" && \
    assert_contains "$output" "[VERBOSE]" "Wrapper should delegate verbose" && \
    assert_contains "$output" "Docker check skipped" "Wrapper should delegate skip-docker-check"
}

# ==============================================================================
# TEST: Script is executable
# ==============================================================================
test_script_is_executable() {
    if [[ -x "$INSTALL_SCRIPT" ]]; then
        return 0
    else
        echo "  ✗ FAILED: $INSTALL_SCRIPT is not executable"
        return 1
    fi
}

# ==============================================================================
# TEST: Dry-run from different working directory
# ==============================================================================
test_works_from_different_cwd() {
    _TEST_CWD_TEMP_DIR="$(mktemp -d -t talawa-cwd-test.XXXXXX)"
    trap 'rm -rf "$_TEST_CWD_TEMP_DIR"' EXIT

    local output exit_code
    output="$(cd "$_TEST_CWD_TEMP_DIR" && bash "$INSTALL_SCRIPT" --dry-run --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Should work from different cwd" && \
    assert_contains "$output" "Step 1" "Should still show steps from different cwd"
}

# ==============================================================================
# TEST: Non-interactive mode runs without prompts
# ==============================================================================
test_non_interactive_mode() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive </dev/null 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Non-interactive dry-run should succeed without stdin"
}

# ==============================================================================
# TEST: --dry-run uses placeholder versions (no real file I/O)
# ==============================================================================
test_dry_run_placeholder_versions() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Dry-run should exit with 0" && \
    assert_contains "$output" "project-defined" "Dry-run should use placeholder instead of reading files" && \
    assert_not_contains "$output" "required_node_version" "Should not leak function names"
}

# ==============================================================================
# TEST: Combined --dry-run --verbose --skip-docker-check
# ==============================================================================
test_combined_flags() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --verbose --skip-docker-check --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Combined flags should exit with 0" && \
    assert_contains "$output" "[DRY RUN]" "Should show dry-run banner" && \
    assert_contains "$output" "[VERBOSE]" "Should show verbose output" && \
    assert_contains "$output" "Docker check skipped" "Should skip docker" && \
    assert_contains "$output" "Script directory" "Verbose should show script directory" && \
    assert_contains "$output" "non-interactive" "Verbose should note non-interactive mode"
}

# ==============================================================================
# TEST: Multiple unknown flags reports first unknown
# ==============================================================================
test_multiple_unknown_flags() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --bad-flag --worse-flag 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "6" "$exit_code" "Unknown flags should exit with E_INVALID_ARG (6)" && \
    assert_contains "$output" "Unknown option" "Should report unknown option" && \
    assert_contains "$output" "--bad-flag" "Should identify the first unknown flag"
}

# ==============================================================================
# TEST: --dry-run summary step content
# ==============================================================================
test_dry_run_summary() {
    local output exit_code
    output="$(bash "$INSTALL_SCRIPT" --dry-run --non-interactive 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "0" "$exit_code" "Dry-run should exit with 0" && \
    assert_contains "$output" "Step 5" "Should show Step 5 (Summary)" && \
    assert_contains "$output" "[DRY] Would display installation summary" "Should show dry summary message"
}

# ==============================================================================
# TEST: Wrapper passes through unknown flag error
# ==============================================================================
test_wrapper_unknown_flag() {
    if [[ ! -f "$WRAPPER_SCRIPT" ]]; then
        echo "  ✗ FAILED: Wrapper script not found at $WRAPPER_SCRIPT"
        return 1
    fi

    local output exit_code
    output="$(bash "$WRAPPER_SCRIPT" --invalid-flag 2>&1)" && exit_code=$? || exit_code=$?

    assert_equals "6" "$exit_code" "Wrapper should propagate error exit code" && \
    assert_contains "$output" "Unknown option" "Wrapper should propagate error message"
}

# ==============================================================================
# MAIN
# ==============================================================================
main() {
    echo "=========================================="
    echo "Install Script Test Suite"
    echo "=========================================="

    run_test "--help flag shows usage" test_help_flag
    run_test "Unknown flag is rejected" test_unknown_flag
    run_test "--dry-run has no side effects" test_dry_run_no_side_effects
    run_test "--dry-run shows all steps" test_dry_run_shows_steps
    run_test "--skip-docker-check skips Docker" test_skip_docker_check
    run_test "--verbose enables extra output" test_verbose_flag
    run_test "Missing library detection" test_missing_library_detection
    run_test "Wrapper delegates to main script" test_wrapper_delegates
    run_test "Wrapper passes through flags" test_wrapper_passthrough_flags
    run_test "Script is executable" test_script_is_executable
    run_test "Works from different cwd" test_works_from_different_cwd
    run_test "Non-interactive mode" test_non_interactive_mode
    run_test "--dry-run uses placeholder versions" test_dry_run_placeholder_versions
    run_test "Combined flags work together" test_combined_flags
    run_test "Multiple unknown flags" test_multiple_unknown_flags
    run_test "--dry-run summary step" test_dry_run_summary
    run_test "Wrapper propagates unknown flag error" test_wrapper_unknown_flag

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

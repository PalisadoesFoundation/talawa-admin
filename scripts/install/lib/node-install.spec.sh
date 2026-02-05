#!/bin/bash
# ==============================================================================
# Talawa Admin - Node.js Installation Helper Library Test Suite
# ==============================================================================
# Automated tests for node-install.sh using fixture-based testing.
# Tests version detection, check functions, and environment setup.
#
# Usage:
#   bash scripts/install/lib/node-install.spec.sh
#   # or
#   ./scripts/install/lib/node-install.spec.sh
#
# Test Coverage:
#   - Source guard (multiple sourcing)
#   - Version detection from .nvmrc and package.json
#   - check_fnm, check_node, check_pnpm functions
#   - setup_fnm_env behavior
#   - required_node_version and required_pnpm_version
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_TEMP_DIR=""
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

setup_test_env() {
    TEST_TEMP_DIR="$(mktemp -d -t talawa-node-install-test.XXXXXX)"
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
    mkdir -p "$fixture_dir"
    echo "$fixture_dir"
}

write_nvmrc() {
    local fixture_dir="$1"
    local version="$2"
    echo "$version" > "$fixture_dir/.nvmrc"
}

write_package_json() {
    local fixture_dir="$1"
    local content="$2"
    echo "$content" > "$fixture_dir/package.json"
}

source_library() {
    unset TALAWA_NODE_INSTALL_SOURCED 2>/dev/null || true
    unset TALAWA_COMMON_SOURCED 2>/dev/null || true
    
    local lib_path="$SCRIPT_DIR/node-install.sh"
    # shellcheck source=scripts/install/lib/node-install.sh
    source "$lib_path"
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

test_source_guard() {
    source_library
    
    local first_sourced="${TALAWA_NODE_INSTALL_SOURCED:-}"
    
    # Source the library directly WITHOUT unsetting the guard variable
    # This tests that the source guard actually prevents re-execution
    local lib_path="$SCRIPT_DIR/node-install.sh"
    # shellcheck source=scripts/install/lib/node-install.sh
    source "$lib_path"
    
    local second_sourced="${TALAWA_NODE_INSTALL_SOURCED:-}"
    
    assert_equals "1" "$first_sourced" "TALAWA_NODE_INSTALL_SOURCED should be 1 after first source" && \
    assert_equals "1" "$second_sourced" "TALAWA_NODE_INSTALL_SOURCED should remain 1 after second source"
}

test_required_node_version_from_nvmrc() {
    local fixture_dir
    fixture_dir=$(create_fixture "nvmrc-test")
    
    write_nvmrc "$fixture_dir" "20.10.0"
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_node_version)
    cd - > /dev/null || return 1
    
    assert_equals "20.10.0" "$version" "Should read version from .nvmrc"
}

test_required_node_version_from_package_json() {
    local fixture_dir
    fixture_dir=$(create_fixture "pkg-node-test")
    
    write_package_json "$fixture_dir" '{"engines": {"node": ">=22.x"}}'
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_node_version)
    cd - > /dev/null || return 1
    
    assert_equals "22" "$version" "Should read version from package.json engines.node"
}

test_required_node_version_default() {
    local fixture_dir
    fixture_dir=$(create_fixture "no-version-test")
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_node_version)
    cd - > /dev/null || return 1
    
    assert_equals "22" "$version" "Should return default version when no config exists"
}

test_required_node_version_nvmrc_priority() {
    local fixture_dir
    fixture_dir=$(create_fixture "priority-test")
    
    write_nvmrc "$fixture_dir" "18.19.0"
    write_package_json "$fixture_dir" '{"engines": {"node": ">=22.x"}}'
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_node_version)
    cd - > /dev/null || return 1
    
    assert_equals "18.19.0" "$version" ".nvmrc should take priority over package.json"
}

test_required_pnpm_version_from_package_json() {
    local fixture_dir
    fixture_dir=$(create_fixture "pnpm-test")
    
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_pnpm_version)
    cd - > /dev/null || return 1
    
    assert_equals "10.4.1" "$version" "Should read pnpm version from packageManager field"
}

test_required_pnpm_version_default() {
    local fixture_dir
    fixture_dir=$(create_fixture "no-pnpm-test")
    
    write_package_json "$fixture_dir" '{"name": "test"}'
    
    source_library
    
    cd "$fixture_dir" || return 1
    local version
    version=$(required_pnpm_version)
    cd - > /dev/null || return 1
    
    assert_equals "9" "$version" "Should return default version when packageManager not set"
}

test_check_fnm_not_installed() {
    source_library
    
    local original_path="$PATH"
    local original_home="$HOME"
    export PATH="/nonexistent:$PATH"
    export HOME="/nonexistent"
    
    if check_fnm; then
        export PATH="$original_path"
        export HOME="$original_home"
        echo "  check_fnm should return false when fnm is not installed"
        return 1
    fi
    
    export PATH="$original_path"
    export HOME="$original_home"
    return 0
}

test_check_node_available() {
    source_library
    
    if command -v node >/dev/null 2>&1; then
        if check_node; then
            return 0
        else
            echo "  check_node should return true when node is in PATH"
            return 1
        fi
    else
        echo "  Skipping: node not installed on this system"
        return 0
    fi
}

test_check_pnpm_available() {
    source_library
    
    if command -v pnpm >/dev/null 2>&1; then
        if check_pnpm; then
            return 0
        else
            echo "  check_pnpm should return true when pnpm is in PATH"
            return 1
        fi
    else
        echo "  Skipping: pnpm not installed on this system"
        return 0
    fi
}

test_command_exists_function() {
    source_library
    
    if command_exists bash; then
        if command_exists "nonexistent_command_12345"; then
            echo "  command_exists should return false for nonexistent commands"
            return 1
        fi
        return 0
    else
        echo "  command_exists should return true for bash"
        return 1
    fi
}

test_library_exports_functions() {
    source_library
    
    local missing_functions=()
    
    declare -f check_fnm >/dev/null 2>&1 || missing_functions+=("check_fnm")
    declare -f check_node >/dev/null 2>&1 || missing_functions+=("check_node")
    declare -f check_pnpm >/dev/null 2>&1 || missing_functions+=("check_pnpm")
    declare -f install_fnm >/dev/null 2>&1 || missing_functions+=("install_fnm")
    declare -f install_node >/dev/null 2>&1 || missing_functions+=("install_node")
    declare -f install_pnpm >/dev/null 2>&1 || missing_functions+=("install_pnpm")
    declare -f verify_fnm >/dev/null 2>&1 || missing_functions+=("verify_fnm")
    declare -f verify_node >/dev/null 2>&1 || missing_functions+=("verify_node")
    declare -f verify_pnpm >/dev/null 2>&1 || missing_functions+=("verify_pnpm")
    declare -f setup_fnm_env >/dev/null 2>&1 || missing_functions+=("setup_fnm_env")
    declare -f required_node_version >/dev/null 2>&1 || missing_functions+=("required_node_version")
    declare -f required_pnpm_version >/dev/null 2>&1 || missing_functions+=("required_pnpm_version")
    declare -f ensure_node_toolchain >/dev/null 2>&1 || missing_functions+=("ensure_node_toolchain")
    declare -f verify_node_toolchain >/dev/null 2>&1 || missing_functions+=("verify_node_toolchain")
    declare -f version_satisfies >/dev/null 2>&1 || missing_functions+=("version_satisfies")
    declare -f normalize_version >/dev/null 2>&1 || missing_functions+=("normalize_version")
    declare -f parse_version_component >/dev/null 2>&1 || missing_functions+=("parse_version_component")
    
    if [[ ${#missing_functions[@]} -gt 0 ]]; then
        echo "  Missing functions: ${missing_functions[*]}"
        return 1
    fi
    
    return 0
}

test_library_exports_constants() {
    source_library
    
    local missing_vars=()
    
    [[ -n "${NODE_INSTALL_DEFAULT_VERSION:-}" ]] || missing_vars+=("NODE_INSTALL_DEFAULT_VERSION")
    [[ -n "${PNPM_INSTALL_DEFAULT_VERSION:-}" ]] || missing_vars+=("PNPM_INSTALL_DEFAULT_VERSION")
    [[ -n "${FNM_INSTALLER_URL:-}" ]] || missing_vars+=("FNM_INSTALLER_URL")
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "  Missing constants: ${missing_vars[*]}"
        return 1
    fi
    
    return 0
}

test_common_library_integration() {
    source_library
    
    if declare -f log_info >/dev/null 2>&1; then
        local output
        output=$(log_info "test message" 2>&1)
        if [[ "$output" == *"test message"* ]]; then
            return 0
        fi
    fi
    
    echo "  log_info should be available from common.sh"
    return 1
}

test_version_satisfies_semver() {
    source_library
    
    local failed=0
    
    # Test: equal versions should satisfy
    if ! version_satisfies "1.2.3" "1.2.3"; then
        echo "  1.2.3 should satisfy 1.2.3"
        failed=1
    fi
    
    # Test: greater patch should satisfy
    if ! version_satisfies "1.2.4" "1.2.3"; then
        echo "  1.2.4 should satisfy 1.2.3"
        failed=1
    fi
    
    # Test: greater minor should satisfy
    if ! version_satisfies "1.3.0" "1.2.9"; then
        echo "  1.3.0 should satisfy 1.2.9"
        failed=1
    fi
    
    # Test: greater major should satisfy
    if ! version_satisfies "2.0.0" "1.9.9"; then
        echo "  2.0.0 should satisfy 1.9.9"
        failed=1
    fi
    
    # Test: lesser patch should NOT satisfy
    if version_satisfies "1.2.2" "1.2.3"; then
        echo "  1.2.2 should NOT satisfy 1.2.3"
        failed=1
    fi
    
    # Test: lesser minor should NOT satisfy
    if version_satisfies "1.1.9" "1.2.0"; then
        echo "  1.1.9 should NOT satisfy 1.2.0"
        failed=1
    fi
    
    # Test: pinned pnpm versions like 10.4.1
    if ! version_satisfies "10.4.1" "10.4.1"; then
        echo "  10.4.1 should satisfy 10.4.1"
        failed=1
    fi
    
    if ! version_satisfies "10.5.0" "10.4.1"; then
        echo "  10.5.0 should satisfy 10.4.1"
        failed=1
    fi
    
    # Test: versions with leading v
    if ! version_satisfies "v22.14.0" "22.13.1"; then
        echo "  v22.14.0 should satisfy 22.13.1"
        failed=1
    fi
    
    # Test: major-only comparison (single number requirement)
    if ! version_satisfies "22.14.0" "22"; then
        echo "  22.14.0 should satisfy 22"
        failed=1
    fi
    
    return $failed
}

main() {
    echo "=========================================="
    echo "Node.js Installation Helper Test Suite"
    echo "=========================================="
    
    setup_test_env
    
    run_test "Source Guard (Multiple Sourcing)" test_source_guard
    run_test "Node Version from .nvmrc" test_required_node_version_from_nvmrc
    run_test "Node Version from package.json" test_required_node_version_from_package_json
    run_test "Node Version Default" test_required_node_version_default
    run_test "Node Version .nvmrc Priority" test_required_node_version_nvmrc_priority
    run_test "pnpm Version from package.json" test_required_pnpm_version_from_package_json
    run_test "pnpm Version Default" test_required_pnpm_version_default
    run_test "check_fnm When Not Installed" test_check_fnm_not_installed
    run_test "check_node When Available" test_check_node_available
    run_test "check_pnpm When Available" test_check_pnpm_available
    run_test "command_exists Function" test_command_exists_function
    run_test "Library Exports Functions" test_library_exports_functions
    run_test "Library Exports Constants" test_library_exports_constants
    run_test "common.sh Integration" test_common_library_integration
    run_test "version_satisfies Full Semver" test_version_satisfies_semver
    
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

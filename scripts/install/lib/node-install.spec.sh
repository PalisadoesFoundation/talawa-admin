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

# Create a stub executable that outputs specified content and returns specified exit code
create_stub_executable() {
    local dir="$1"
    local name="$2"
    local output="${3:-}"
    local exit_code="${4:-0}"

    mkdir -p "$dir"
    cat > "$dir/$name" << EOF
#!/bin/bash
if [[ "\$1" == "--version" ]] || [[ "\$1" == "-v" ]]; then
    echo "$output"
    exit $exit_code
fi
if [[ "\$1" == "env" ]]; then
    echo "# fnm env stub"
    exit 0
fi
echo "$output"
exit $exit_code
EOF
    chmod +x "$dir/$name"
}

# Create a curl stub that writes content to the -o output file
# Usage: create_curl_stub <bin_dir> <exit_code> [line1] [line2] ...
create_curl_stub() {
    local bin_dir="$1"
    local exit_code="$2"
    shift 2

    mkdir -p "$bin_dir"
    cat > "$bin_dir/curl" << STUBEOF
#!/bin/bash
prev=""
output_file=""
for arg in "\$@"; do
    if [[ "\$prev" == "-o" ]]; then
        output_file="\$arg"
    fi
    prev="\$arg"
done
if [[ -n "\$output_file" ]]; then
STUBEOF

    # Add each line to the output file
    for line in "$@"; do
        printf '%s\n' "    echo '$line' >> \"\$output_file\"" >> "$bin_dir/curl"
    done

    cat >> "$bin_dir/curl" << STUBEOF
fi
exit $exit_code
STUBEOF

    chmod +x "$bin_dir/curl"
}

# Save and restore PATH/HOME for isolated tests
save_env() {
    SAVED_PATH="$PATH"
    SAVED_HOME="$HOME"
    SAVED_FNM_DIR="${FNM_DIR:-}"
}

restore_env() {
    export PATH="$SAVED_PATH"
    export HOME="$SAVED_HOME"
    if [[ -n "$SAVED_FNM_DIR" ]]; then
        export FNM_DIR="$SAVED_FNM_DIR"
    else
        unset FNM_DIR 2>/dev/null || true
    fi
}

source_library() {
    # NOTE: TALAWA_NODE_INSTALL_SOURCED is declared readonly in node-install.sh (line 21),
    # so the unset below silently fails and the source guard prevents re-sourcing.
    # This means source_library() is effectively a no-op after the first load, and
    # eval overrides (e.g., in test_ensure_node_toolchain_*) persist across tests.
    # Alternatives: run tests in a subshell, or reset stubbed state explicitly.
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
    save_env
    
    export PATH="/nonexistent"
    export HOME="/nonexistent"
    unset FNM_DIR 2>/dev/null || true
    
    if check_fnm; then
        restore_env
        echo "  check_fnm should return false when fnm is not installed"
        return 1
    fi
    
    restore_env
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

# Test setup_fnm_env when fnm is already in PATH
test_setup_fnm_env_in_path() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fnm-in-path")
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0
    
    export PATH="$fixture_dir/bin:$PATH"
    export HOME="$fixture_dir"
    
    local result=0
    if ! setup_fnm_env; then
        echo "  setup_fnm_env should return 0 when fnm is in PATH"
        result=1
    fi
    
    restore_env
    return $result
}

# Test setup_fnm_env finding fnm in $HOME/.local/share/fnm
test_setup_fnm_env_local_share() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fnm-local-share")
    mkdir -p "$fixture_dir/.local/share/fnm"
    create_stub_executable "$fixture_dir/.local/share/fnm" "fnm" "fnm 1.35.0" 0
    
    export PATH="/nonexistent"
    export HOME="$fixture_dir"
    unset FNM_DIR 2>/dev/null || true
    
    local result=0
    if ! setup_fnm_env; then
        echo "  setup_fnm_env should return 0 when fnm is in ~/.local/share/fnm"
        result=1
    fi
    
    restore_env
    return $result
}

# Test setup_fnm_env finding fnm in $HOME/.fnm
test_setup_fnm_env_home_fnm() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fnm-home-fnm")
    mkdir -p "$fixture_dir/.fnm"
    create_stub_executable "$fixture_dir/.fnm" "fnm" "fnm 1.35.0" 0
    
    export PATH="/nonexistent"
    export HOME="$fixture_dir"
    unset FNM_DIR 2>/dev/null || true
    
    local result=0
    if ! setup_fnm_env; then
        echo "  setup_fnm_env should return 0 when fnm is in ~/.fnm"
        result=1
    fi
    
    restore_env
    return $result
}

# Test setup_fnm_env using FNM_DIR environment variable
test_setup_fnm_env_fnm_dir() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fnm-dir-env")
    mkdir -p "$fixture_dir/custom-fnm"
    create_stub_executable "$fixture_dir/custom-fnm" "fnm" "fnm 1.35.0" 0
    
    export PATH="/nonexistent"
    export HOME="/nonexistent"
    export FNM_DIR="$fixture_dir/custom-fnm"
    
    local result=0
    if ! setup_fnm_env; then
        echo "  setup_fnm_env should return 0 when fnm is in FNM_DIR"
        result=1
    fi
    
    restore_env
    return $result
}

# Test setup_fnm_env returns 1 when fnm not found anywhere
test_setup_fnm_env_not_found() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fnm-not-found")
    
    export PATH="/nonexistent"
    export HOME="$fixture_dir"
    unset FNM_DIR 2>/dev/null || true
    
    local result=0
    if setup_fnm_env; then
        echo "  setup_fnm_env should return 1 when fnm is not found"
        result=1
    fi
    
    restore_env
    return $result
}

# Test verify_node with stub node returning version
test_verify_node_with_stub() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-node-stub")
    
    create_stub_executable "$fixture_dir/bin" "node" "v22.14.0" 0
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0
    write_nvmrc "$fixture_dir" "22"
    
    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"
    
    source_library
    
    cd "$fixture_dir" || return 1
    local result=0
    if ! verify_node 2>/dev/null; then
        echo "  verify_node should pass with node v22.14.0 and requirement 22"
        result=1
    fi
    cd - > /dev/null || return 1
    
    restore_env
    return $result
}

# Test verify_node skips comparison for non-numeric requirements
test_verify_node_nonnumeric_requirement() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-node-lts")
    
    create_stub_executable "$fixture_dir/bin" "node" "v22.14.0" 0
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0
    write_nvmrc "$fixture_dir" "lts/*"
    
    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"
    
    source_library
    
    cd "$fixture_dir" || return 1
    local result=0
    local output
    output=$(verify_node 2>&1)
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        echo "  verify_node should pass for non-numeric requirement lts/* (exit code: $exit_code)"
        result=1
    fi
    if [[ "$output" != *"skipping"* ]]; then
        echo "  verify_node should log warning about skipping comparison (output: $output)"
        result=1
    fi
    cd - > /dev/null || return 1
    
    restore_env
    return $result
}

# Test verify_node handles v-prefixed requirements correctly
test_verify_node_v_prefix_requirement() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-node-v-prefix")
    
    create_stub_executable "$fixture_dir/bin" "node" "v22.14.0" 0
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0
    write_nvmrc "$fixture_dir" "v22.0.0"
    
    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"
    
    source_library
    
    cd "$fixture_dir" || return 1
    local result=0
    if ! verify_node 2>/dev/null; then
        echo "  verify_node should handle v-prefixed requirements correctly"
        result=1
    fi
    cd - > /dev/null || return 1
    
    restore_env
    return $result
}

# Test check_fnm with stub in different locations
test_check_fnm_locations() {
    source_library
    save_env

    local failed=0

    # Test: fnm in PATH
    unset FNM_DIR 2>/dev/null || true
    local fixture1
    fixture1=$(create_fixture "check-fnm-path")
    create_stub_executable "$fixture1/bin" "fnm" "fnm 1.35.0" 0
    export PATH="$fixture1/bin:$SAVED_PATH"
    export HOME="/nonexistent"

    if ! check_fnm; then
        echo "  check_fnm should find fnm in PATH"
        failed=1
    fi
    
    # Test: fnm in ~/.local/share/fnm
    unset FNM_DIR 2>/dev/null || true
    local fixture2
    fixture2=$(create_fixture "check-fnm-local")
    mkdir -p "$fixture2/.local/share/fnm"
    create_stub_executable "$fixture2/.local/share/fnm" "fnm" "fnm 1.35.0" 0
    export PATH="/usr/bin:/bin"
    export HOME="$fixture2"
    
    if ! check_fnm; then
        echo "  check_fnm should find fnm in ~/.local/share/fnm"
        failed=1
    fi
    
    # Test: fnm in ~/.fnm
    unset FNM_DIR 2>/dev/null || true
    local fixture3
    fixture3=$(create_fixture "check-fnm-home")
    mkdir -p "$fixture3/.fnm"
    create_stub_executable "$fixture3/.fnm" "fnm" "fnm 1.35.0" 0
    export PATH="/usr/bin:/bin"
    export HOME="$fixture3"
    
    if ! check_fnm; then
        echo "  check_fnm should find fnm in ~/.fnm"
        failed=1
    fi
    
    restore_env
    return $failed
}

# Test verify_pnpm with stub pnpm
test_verify_pnpm_with_stub() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-pnpm-stub")
    
    create_stub_executable "$fixture_dir/bin" "pnpm" "10.4.1" 0
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'
    
    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"
    
    source_library
    
    cd "$fixture_dir" || return 1
    local result=0
    if ! verify_pnpm 2>/dev/null; then
        echo "  verify_pnpm should pass with pnpm 10.4.1 matching requirement"
        result=1
    fi
    cd - > /dev/null || return 1
    
    restore_env
    return $result
}

test_ensure_node_toolchain_fail_fast() {
    source_library
    save_env
    
    local fixture_dir
    fixture_dir=$(create_fixture "fail-fast")
    export HOME="$fixture_dir"
    export PATH="/nonexistent:$SAVED_PATH"
    
    local orig_check_fnm orig_install_fnm orig_check_node orig_install_node
    orig_check_fnm="$(declare -f check_fnm)"
    orig_install_fnm="$(declare -f install_fnm)"
    orig_check_node="$(declare -f check_node)"
    orig_install_node="$(declare -f install_node)"
    
    eval 'check_fnm() { return 1; }'
    eval 'install_fnm() { return 1; }'
    eval 'check_node() { return 1; }'
    eval 'install_node() { return 1; }'
    
    local output exit_code result=0
    set +e
    output=$(ensure_node_toolchain --fail-fast 2>&1)
    exit_code=$?
    set -euo pipefail
    
    if [[ $exit_code -eq 0 ]]; then
        echo "  ensure_node_toolchain --fail-fast should return non-zero on fnm failure"
        result=1
    fi
    
    if [[ "$output" != *"fnm installation failed"* ]]; then
        echo "  ensure_node_toolchain --fail-fast should report fnm failure"
        result=1
    fi
    
    if [[ "$output" == *"Node.js is available"* ]] || [[ "$output" == *"Node.js installation failed"* ]]; then
        echo "  ensure_node_toolchain --fail-fast should not attempt Node.js install after fnm fails"
        result=1
    fi
    
    eval "$orig_check_fnm"
    eval "$orig_install_fnm"
    eval "$orig_check_node"
    eval "$orig_install_node"
    restore_env
    return $result
}

test_ensure_node_toolchain_no_fail_fast() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "no-fail-fast")
    export HOME="$fixture_dir"
    export PATH="/nonexistent:$SAVED_PATH"

    local orig_check_fnm orig_install_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    orig_install_fnm="$(declare -f install_fnm)"

    eval 'check_fnm() { return 1; }'
    eval 'install_fnm() { return 1; }'

    local output exit_code result=0
    set +e
    output=$(ensure_node_toolchain 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  ensure_node_toolchain should return non-zero when install fails"
        result=1
    fi

    if [[ "$output" != *"Some toolchain components failed"* ]]; then
        echo "  ensure_node_toolchain should report partial failure"
        result=1
    fi

    # When fnm fails, dependent checks (node, pnpm) should be skipped
    if [[ "$output" != *"Skipping Node.js check"* ]]; then
        echo "  ensure_node_toolchain should skip Node.js check when fnm fails"
        result=1
    fi

    if [[ "$output" != *"Skipping pnpm check"* ]]; then
        echo "  ensure_node_toolchain should skip pnpm check when fnm fails"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_install_fnm"
    restore_env
    return $result
}

# ==============================================================================
# install_fnm tests
# ==============================================================================

# Test install_fnm returns early when fnm is already installed
test_install_fnm_already_installed() {
    source_library
    save_env

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 0; }'

    local result=0
    local output
    output=$(install_fnm 2>&1)
    if [[ $? -ne 0 ]]; then
        echo "  install_fnm should return 0 when fnm is already installed"
        result=1
    fi
    if [[ "$output" != *"already installed"* ]]; then
        echo "  install_fnm should report fnm is already installed"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test install_fnm fails when curl is not available
test_install_fnm_no_curl() {
    source_library
    save_env

    local orig_check_fnm orig_command_exists
    orig_check_fnm="$(declare -f check_fnm)"
    orig_command_exists="$(declare -f command_exists)"

    eval 'check_fnm() { return 1; }'
    eval 'command_exists() { [[ "$1" != "curl" ]]; }'

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail when curl is not available"
        result=1
    fi
    if [[ "$output" != *"curl is required"* ]]; then
        echo "  install_fnm should report curl is required"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_command_exists"
    restore_env
    return $result
}

# Test install_fnm fails when curl download fails
test_install_fnm_curl_download_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-curl-fail")
    # Create a curl stub that always fails
    create_curl_stub "$fixture_dir/bin" 1

    local orig_check_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    eval 'check_fnm() { return 1; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail when curl download fails"
        result=1
    fi
    if [[ "$output" != *"Failed to download"* ]]; then
        echo "  install_fnm should report download failure"
        result=1
    fi

    eval "$orig_check_fnm"
    restore_env
    return $result
}

# Test install_fnm fails when downloaded file has invalid shebang
test_install_fnm_invalid_shebang() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-bad-shebang")
    # curl stub that writes a file WITHOUT valid shebang
    create_curl_stub "$fixture_dir/bin" 0 "NOT A VALID SCRIPT" "install_fnm FNM_DIR"

    local orig_check_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    eval 'check_fnm() { return 1; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail with invalid shebang"
        result=1
    fi
    if [[ "$output" != *"valid shell shebang"* ]]; then
        echo "  install_fnm should report invalid shebang (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    restore_env
    return $result
}

# Test install_fnm fails when downloaded file has no fnm markers
test_install_fnm_no_markers() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-no-markers")
    # curl stub writes valid shebang but NO fnm markers
    create_curl_stub "$fixture_dir/bin" 0 "#!/bin/bash" "echo hello world"

    local orig_check_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    eval 'check_fnm() { return 1; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail with no fnm markers"
        result=1
    fi
    if [[ "$output" != *"does not appear to be a valid fnm installer"* ]]; then
        echo "  install_fnm should report invalid fnm installer (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    restore_env
    return $result
}

# Test install_fnm fails when bash installer execution fails
test_install_fnm_installer_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-exec-fail")
    # curl stub writes a valid-looking installer that will fail when executed
    create_curl_stub "$fixture_dir/bin" 0 "#!/bin/bash" "# install_fnm FNM_DIR marker" "exit 1"

    local orig_check_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    eval 'check_fnm() { return 1; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail when installer script exits non-zero"
        result=1
    fi
    if [[ "$output" != *"fnm installation failed"* ]]; then
        echo "  install_fnm should report installation failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    restore_env
    return $result
}

# Test install_fnm fails when setup_fnm_env fails after install
test_install_fnm_setup_env_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-env-fail")
    # curl stub writes a valid installer that succeeds
    create_curl_stub "$fixture_dir/bin" 0 "#!/bin/bash" "# install_fnm FNM_DIR marker" "exit 0"

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"
    eval 'check_fnm() { return 1; }'
    eval 'setup_fnm_env() { return 1; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_fnm should fail when setup_fnm_env fails"
        result=1
    fi
    if [[ "$output" != *"could not set up environment"* ]]; then
        echo "  install_fnm should report environment setup failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test install_fnm succeeds end-to-end
test_install_fnm_success() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-success")
    # curl stub writes a valid installer that succeeds
    create_curl_stub "$fixture_dir/bin" 0 "#!/bin/bash" "# install_fnm FNM_DIR marker" "exit 0"

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"
    eval 'check_fnm() { return 1; }'
    eval 'setup_fnm_env() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_fnm should succeed (exit code: $exit_code, output: $output)"
        result=1
    fi
    if [[ "$output" != *"fnm installed successfully"* ]]; then
        echo "  install_fnm should report success (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# ==============================================================================
# verify_fnm tests
# ==============================================================================

# Test verify_fnm succeeds with working fnm stub
test_verify_fnm_success() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "verify-fnm-ok")
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0

    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    local result=0
    if ! verify_fnm 2>/dev/null; then
        echo "  verify_fnm should pass with working fnm"
        result=1
    fi

    restore_env
    return $result
}

# Test verify_fnm fails when fnm is not in PATH
test_verify_fnm_missing_in_path() {
    source_library
    save_env

    export PATH="/nonexistent"
    export HOME="/nonexistent"

    local orig_setup_fnm_env orig_command_exists
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"
    orig_command_exists="$(declare -f command_exists)"

    eval 'setup_fnm_env() { return 0; }'
    eval 'command_exists() { [[ "$1" != "fnm" ]]; }'

    local result=0 output exit_code
    set +e
    output=$(verify_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_fnm should fail when fnm is not available in PATH"
        result=1
    fi
    if [[ "$output" != *"fnm is not available in PATH"* ]]; then
        echo "  verify_fnm should report missing fnm in PATH (output: $output)"
        result=1
    fi

    eval "$orig_setup_fnm_env"
    eval "$orig_command_exists"
    restore_env
    return $result
}

# Test verify_fnm fails when setup_fnm_env fails (fnm not found anywhere)
test_verify_fnm_not_found() {
    source_library
    save_env

    export PATH="/nonexistent"
    export HOME="/nonexistent"
    unset FNM_DIR 2>/dev/null || true

    local result=0 exit_code
    set +e
    verify_fnm >/dev/null 2>&1
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_fnm should fail when fnm is not found"
        result=1
    fi

    restore_env
    return $result
}

# Test verify_fnm fails when fnm --version fails
test_verify_fnm_version_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "verify-fnm-ver-fail")
    # fnm stub that returns 0 for env but fails for --version
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "env" ]]; then
    echo "# fnm env stub"
    exit 0
fi
if [[ "${1:-}" == "--version" ]]; then
    exit 1
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"

    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    local result=0 output exit_code
    set +e
    output=$(verify_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_fnm should fail when fnm --version fails"
        result=1
    fi

    restore_env
    return $result
}

# ==============================================================================
# install_node tests
# ==============================================================================

# Test install_node fails when fnm not found and install_fnm fails
test_install_node_no_fnm() {
    source_library
    save_env

    local orig_check_fnm orig_install_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    orig_install_fnm="$(declare -f install_fnm)"

    eval 'check_fnm() { return 1; }'
    eval 'install_fnm() { return 1; }'

    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_node should fail when fnm cannot be installed"
        result=1
    fi
    if [[ "$output" != *"Cannot install Node.js without fnm"* ]]; then
        echo "  install_node should report fnm dependency failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_install_fnm"
    restore_env
    return $result
}

# Test install_node fails when setup_fnm_env fails
test_install_node_env_fails() {
    source_library
    save_env

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 1; }'

    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_node should fail when setup_fnm_env fails"
        result=1
    fi
    if [[ "$output" != *"Failed to set up fnm environment"* ]]; then
        echo "  install_node should report fnm env failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test install_node fails when fnm install fails
test_install_node_fnm_install_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-node-fnm-fail")
    # fnm stub that fails on "install" subcommand
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "env" ]]; then
    echo "# fnm env stub"
    exit 0
fi
if [[ "${1:-}" == "install" ]]; then
    exit 1
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"
    write_nvmrc "$fixture_dir" "22"

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_node should fail when fnm install fails"
        result=1
    fi
    if [[ "$output" != *"Failed to install Node.js"* ]]; then
        echo "  install_node should report installation failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test install_node fails when fnm use fails
test_install_node_fnm_use_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-node-use-fail")
    # fnm stub: install succeeds, use fails
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "env" ]]; then
    echo "# fnm env stub"
    exit 0
fi
if [[ "${1:-}" == "install" ]]; then
    exit 0
fi
if [[ "${1:-}" == "use" ]]; then
    exit 1
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"
    write_nvmrc "$fixture_dir" "22"

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_node should fail when fnm use fails"
        result=1
    fi
    if [[ "$output" != *"Failed to activate Node.js"* ]]; then
        echo "  install_node should report activation failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test install_node succeeds end-to-end
test_install_node_success() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-node-ok")
    # fnm stub: install and use both succeed
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "env" ]]; then
    echo "# fnm env stub"
    exit 0
fi
if [[ "${1:-}" == "install" ]]; then
    exit 0
fi
if [[ "${1:-}" == "use" ]]; then
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"
    write_nvmrc "$fixture_dir" "22"

    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_node should succeed (exit: $exit_code, output: $output)"
        result=1
    fi
    if [[ "$output" != *"Node.js installed and activated"* ]]; then
        echo "  install_node should report success (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# ==============================================================================
# verify_node version mismatch test
# ==============================================================================

# Test verify_node fails on version mismatch
test_verify_node_version_mismatch() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-node-mismatch")

    create_stub_executable "$fixture_dir/bin" "node" "v18.0.0" 0
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0
    write_nvmrc "$fixture_dir" "22.0.0"

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(verify_node 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_node should fail when installed version < required"
        result=1
    fi
    if [[ "$output" != *"version mismatch"* ]]; then
        echo "  verify_node should report version mismatch (output: $output)"
        result=1
    fi

    restore_env
    return $result
}

# ==============================================================================
# install_pnpm tests
# ==============================================================================

# Test install_pnpm fails when node is not available and install_node fails
test_install_pnpm_no_node() {
    source_library
    save_env

    local orig_check_node orig_install_node
    orig_check_node="$(declare -f check_node)"
    orig_install_node="$(declare -f install_node)"

    eval 'check_node() { return 1; }'
    eval 'install_node() { return 1; }'

    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_pnpm should fail when node cannot be installed"
        result=1
    fi
    if [[ "$output" != *"Cannot install pnpm without Node.js"* ]]; then
        echo "  install_pnpm should report node dependency failure (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    eval "$orig_install_node"
    restore_env
    return $result
}

# Test install_pnpm fails when corepack enable fails and sudo is not available
test_install_pnpm_corepack_no_sudo() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-no-sudo")
    # corepack stub that always fails
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node orig_command_exists
    orig_check_node="$(declare -f check_node)"
    orig_command_exists="$(declare -f command_exists)"

    eval 'check_node() { return 0; }'
    # sudo not available, corepack available
    eval 'command_exists() { [[ "$1" != "sudo" ]]; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_pnpm should fail when corepack fails and sudo unavailable"
        result=1
    fi
    if [[ "$output" != *"Failed to enable corepack"* ]]; then
        echo "  install_pnpm should report corepack failure (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    eval "$orig_command_exists"
    restore_env
    return $result
}

# Test install_pnpm fails when sudo is available but not passwordless
test_install_pnpm_sudo_needs_password() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-sudo-pw")
    mkdir -p "$fixture_dir/bin"
    # corepack stub that fails
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    # sudo stub: "sudo -n true" fails (needs password)
    cat > "$fixture_dir/bin/sudo" << 'STUBEOF'
#!/bin/bash
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/sudo"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_pnpm should fail when sudo needs password"
        result=1
    fi
    if [[ "$output" != *"passwordless sudo is not available"* ]]; then
        echo "  install_pnpm should report passwordless sudo unavailable (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
}

# Test install_pnpm fails when corepack prepare fails
test_install_pnpm_prepare_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-prepare-fail")
    mkdir -p "$fixture_dir/bin"
    # corepack stub: enable succeeds, prepare fails
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "enable" ]]; then
    exit 0
fi
if [[ "${1:-}" == "prepare" ]]; then
    exit 1
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_pnpm should fail when corepack prepare fails"
        result=1
    fi
    if [[ "$output" != *"Failed to prepare pnpm"* ]]; then
        echo "  install_pnpm should report prepare failure (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
}

# Test install_pnpm succeeds end-to-end
test_install_pnpm_success() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-ok")
    mkdir -p "$fixture_dir/bin"
    # corepack stub: enable and prepare succeed
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "enable" ]]; then
    exit 0
fi
if [[ "${1:-}" == "prepare" ]]; then
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_pnpm should succeed (exit: $exit_code, output: $output)"
        result=1
    fi
    if [[ "$output" != *"pnpm installed successfully"* ]]; then
        echo "  install_pnpm should report success (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
}

# ==============================================================================
# verify_node_toolchain tests
# ==============================================================================

# Test verify_node_toolchain succeeds when all components pass
test_verify_node_toolchain_success() {
    source_library
    save_env

    local orig_verify_fnm orig_verify_node orig_verify_pnpm
    orig_verify_fnm="$(declare -f verify_fnm)"
    orig_verify_node="$(declare -f verify_node)"
    orig_verify_pnpm="$(declare -f verify_pnpm)"

    eval 'verify_fnm() { return 0; }'
    eval 'verify_node() { return 0; }'
    eval 'verify_pnpm() { return 0; }'

    local result=0 output exit_code
    set +e
    output=$(verify_node_toolchain 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -ne 0 ]]; then
        echo "  verify_node_toolchain should succeed when all pass"
        result=1
    fi
    if [[ "$output" != *"Node.js toolchain verified"* ]]; then
        echo "  verify_node_toolchain should report verified (output: $output)"
        result=1
    fi

    eval "$orig_verify_fnm"
    eval "$orig_verify_node"
    eval "$orig_verify_pnpm"
    restore_env
    return $result
}

# Test verify_node_toolchain fails when one component fails
test_verify_node_toolchain_partial_failure() {
    source_library
    save_env

    local orig_verify_fnm orig_verify_node orig_verify_pnpm
    orig_verify_fnm="$(declare -f verify_fnm)"
    orig_verify_node="$(declare -f verify_node)"
    orig_verify_pnpm="$(declare -f verify_pnpm)"

    eval 'verify_fnm() { return 0; }'
    eval 'verify_node() { return 1; }'
    eval 'verify_pnpm() { return 0; }'

    local result=0 output exit_code
    set +e
    output=$(verify_node_toolchain 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_node_toolchain should fail when one component fails"
        result=1
    fi
    if [[ "$output" != *"Some toolchain components failed verification"* ]]; then
        echo "  verify_node_toolchain should report partial failure (output: $output)"
        result=1
    fi

    eval "$orig_verify_fnm"
    eval "$orig_verify_node"
    eval "$orig_verify_pnpm"
    restore_env
    return $result
}

# ==============================================================================
# ensure_node_toolchain additional tests
# ==============================================================================

# Test ensure_node_toolchain succeeds when all components are already installed
test_ensure_node_toolchain_all_present() {
    source_library
    save_env

    local orig_check_fnm orig_setup_fnm_env orig_check_node orig_check_pnpm
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"
    orig_check_node="$(declare -f check_node)"
    orig_check_pnpm="$(declare -f check_pnpm)"

    eval 'check_fnm() { return 0; }'
    eval 'setup_fnm_env() { return 0; }'
    eval 'check_node() { return 0; }'
    eval 'check_pnpm() { return 0; }'

    local result=0 output exit_code
    set +e
    output=$(ensure_node_toolchain 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -ne 0 ]]; then
        echo "  ensure_node_toolchain should succeed when all present"
        result=1
    fi
    if [[ "$output" != *"Node.js toolchain is ready"* ]]; then
        echo "  ensure_node_toolchain should report ready (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    eval "$orig_check_node"
    eval "$orig_check_pnpm"
    restore_env
    return $result
}

# Test ensure_node_toolchain rejects unknown arguments
test_ensure_node_toolchain_unknown_arg() {
    source_library
    save_env

    local result=0 output exit_code
    set +e
    output=$(ensure_node_toolchain --bogus 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  ensure_node_toolchain should fail on unknown argument"
        result=1
    fi
    if [[ "$output" != *"Unknown argument"* ]]; then
        echo "  ensure_node_toolchain should report unknown argument (output: $output)"
        result=1
    fi

    restore_env
    return $result
}

# ==============================================================================
# ADDITIONAL TESTS FOR CODE COVERAGE GAPS
# ==============================================================================

# Test install_fnm when check_fnm returns true during installation
test_install_fnm_check_fnm_true_after_install() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-fnm-after-check")
    # Create a curl stub that writes a valid installer
    create_curl_stub "$fixture_dir/bin" 0 "#!/bin/bash" "# install_fnm FNM_DIR marker" "exit 0"

    # Save original check_fnm and setup_fnm_env before mocking
    local orig_check_fnm orig_setup_fnm_env
    orig_check_fnm="$(declare -f check_fnm)"
    orig_setup_fnm_env="$(declare -f setup_fnm_env)"

    # Mock check_fnm to return 1 initially, then 0 after install
    # Use a file-based counter to track calls and avoid shellcheck SC2034
    check_fnm_call_file="$fixture_dir/.check_fnm_count"
    echo 0 > "$check_fnm_call_file"
    eval 'check_fnm() {
        local count
        count=$(cat "'"$check_fnm_call_file"'" 2>/dev/null) || count=0
        count=$((count + 1))
        echo $count > "'"$check_fnm_call_file"'"
        if [[ $count -gt 1 ]]; then
            return 0
        fi
        return 1
    }'
    eval 'setup_fnm_env() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local result=0 output exit_code
    set +e
    output=$(install_fnm 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_fnm should succeed (exit: $exit_code)"
        result=1
    fi

    # Cleanup counter file and restore original functions
    rm -f "$check_fnm_call_file"
    eval "$orig_check_fnm"
    eval "$orig_setup_fnm_env"
    restore_env
    return $result
}

# Test verify_pnpm fails on version mismatch
test_verify_pnpm_version_mismatch() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-pnpm-mismatch")

    # Create stub pnpm returning older version
    create_stub_executable "$fixture_dir/bin" "pnpm" "9.0.0" 0
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(verify_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_pnpm should fail when installed version < required"
        result=1
    fi
    if [[ "$output" != *"version mismatch"* ]]; then
        echo "  verify_pnpm should report version mismatch (output: $output)"
        result=1
    fi

    restore_env
    return $result
}

# Test verify_pnpm with v-prefixed version
test_verify_pnpm_v_prefixed_version() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-pnpm-v-prefix")

    create_stub_executable "$fixture_dir/bin" "pnpm" "v10.4.1" 0
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local result=0
    if ! verify_pnpm 2>/dev/null; then
        echo "  verify_pnpm should handle v-prefixed pnpm version"
        result=1
    fi
    cd - > /dev/null || return 1

    restore_env
    return $result
}

# Test verify_pnpm fails when pnpm --version fails
test_verify_pnpm_version_fails() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-pnpm-ver-fail")

    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/pnpm" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "--version" ]]; then
    exit 1
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/pnpm"

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(verify_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  verify_pnpm should fail when --version fails"
        result=1
    fi
    if [[ "$output" != *"Failed to get pnpm version"* ]]; then
        echo "  verify_pnpm should report version failure (output: $output)"
        result=1
    fi

    restore_env
    return $result
}

# Test ensure_node_toolchain installs all components when missing
test_ensure_node_toolchain_installs_all() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "ensure-all")
    export HOME="$fixture_dir"

    # Create stubs for fnm, node, pnpm
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "env" ]]; then
    echo "# fnm env"
    exit 0
fi
if [[ "$1" == "install" ]] || [[ "$1" == "use" ]]; then
    exit 0
fi
if [[ "$1" == "--version" ]]; then
    echo "fnm 1.35.0"
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"

    cat > "$fixture_dir/bin/node" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "--version" ]]; then
    echo "v22.0.0"
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/node"

    cat > "$fixture_dir/bin/pnpm" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "--version" ]]; then
    echo "10.4.1"
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/pnpm"

    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"

    write_nvmrc "$fixture_dir" "22"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    local orig_check_fnm orig_check_node orig_check_pnpm
    orig_check_fnm="$(declare -f check_fnm)"
    orig_check_node="$(declare -f check_node)"
    orig_check_pnpm="$(declare -f check_pnpm)"

    # All components return not installed initially
    eval 'check_fnm() { 
        if [[ -f "$HOME/.fnm_installed" ]]; then
            return 0
        fi
        return 1
    }'
    eval 'check_node() { 
        if [[ -f "$HOME/.node_installed" ]]; then
            return 0
        fi
        return 1
    }'
    eval 'check_pnpm() { 
        if [[ -f "$HOME/.pnpm_installed" ]]; then
            return 0
        fi
        return 1
    }'

    # Mock install functions to touch marker files
    local orig_install_fnm orig_install_node orig_install_pnpm
    orig_install_fnm="$(declare -f install_fnm)"
    orig_install_node="$(declare -f install_node)"
    orig_install_pnpm="$(declare -f install_pnpm)"

    eval 'install_fnm() { touch "$HOME/.fnm_installed"; return 0; }'
    eval 'install_node() { touch "$HOME/.node_installed"; return 0; }'
    eval 'install_pnpm() { touch "$HOME/.pnpm_installed"; return 0; }'

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(ensure_node_toolchain 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  ensure_node_toolchain should succeed when all install (exit: $exit_code)"
        result=1
    fi
    if [[ "$output" != *"Node.js toolchain is ready"* ]]; then
        echo "  ensure_node_toolchain should report ready (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_check_node"
    eval "$orig_check_pnpm"
    eval "$orig_install_fnm"
    eval "$orig_install_node"
    eval "$orig_install_pnpm"
    restore_env
    return $result
}

# Test ensure_node_toolchain with --fail-fast when node install fails
test_ensure_node_toolchain_fail_fast_node() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "fail-fast-node")
    export HOME="$fixture_dir"
    export PATH="/nonexistent:$SAVED_PATH"

    local orig_check_fnm orig_install_fnm orig_check_node orig_install_node
    orig_check_fnm="$(declare -f check_fnm)"
    orig_install_fnm="$(declare -f install_fnm)"
    orig_check_node="$(declare -f check_node)"
    orig_install_node="$(declare -f install_node)"

    eval 'check_fnm() { return 0; }'
    eval 'install_fnm() { return 0; }'
    eval 'check_node() { return 1; }'
    eval 'install_node() { return 1; }'

    local output exit_code result=0
    set +e
    output=$(ensure_node_toolchain --fail-fast 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  ensure_node_toolchain --fail-fast should fail when node install fails"
        result=1
    fi
    if [[ "$output" != *"Node.js installation failed"* ]]; then
        echo "  ensure_node_toolchain should report node failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_install_fnm"
    eval "$orig_check_node"
    eval "$orig_install_node"
    restore_env
    return $result
}

# Test ensure_node_toolchain with --fail-fast when pnpm install fails
test_ensure_node_toolchain_fail_fast_pnpm() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "fail-fast-pnpm")
    export HOME="$fixture_dir"
    export PATH="/nonexistent:$SAVED_PATH"

    local orig_check_fnm orig_check_node orig_check_pnpm orig_install_pnpm
    orig_check_fnm="$(declare -f check_fnm)"
    orig_check_node="$(declare -f check_node)"
    orig_check_pnpm="$(declare -f check_pnpm)"
    orig_install_pnpm="$(declare -f install_pnpm)"

    eval 'check_fnm() { return 0; }'
    eval 'check_node() { return 0; }'
    eval 'check_pnpm() { return 1; }'
    eval 'install_pnpm() { return 1; }'

    local output exit_code result=0
    set +e
    output=$(ensure_node_toolchain --fail-fast 2>&1)
    exit_code=$?
    set -euo pipefail

    if [[ $exit_code -eq 0 ]]; then
        echo "  ensure_node_toolchain --fail-fast should fail when pnpm install fails"
        result=1
    fi
    if [[ "$output" != *"pnpm installation failed"* ]]; then
        echo "  ensure_node_toolchain should report pnpm failure (output: $output)"
        result=1
    fi

    eval "$orig_check_fnm"
    eval "$orig_check_node"
    eval "$orig_check_pnpm"
    eval "$orig_install_pnpm"
    restore_env
    return $result
}

# Test install_node when fnm is already available
test_install_node_fnm_already_installed() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-node-fnmpresent")
    mkdir -p "$fixture_dir/bin"

    cat > "$fixture_dir/bin/fnm" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "env" ]]; then
    echo "# fnm env"
    exit 0
fi
if [[ "$1" == "install" ]] || [[ "$1" == "use" ]]; then
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/fnm"

    write_nvmrc "$fixture_dir" "22"

    local orig_check_fnm
    orig_check_fnm="$(declare -f check_fnm)"
    eval 'check_fnm() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_node 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_node should succeed when fnm already present (exit: $exit_code)"
        result=1
    fi

    eval "$orig_check_fnm"
    restore_env
    return $result
}

# Test verify_node handles empty required version gracefully
test_verify_node_empty_required_version() {
    local fixture_dir
    fixture_dir=$(create_fixture "verify-node-empty-req")

    create_stub_executable "$fixture_dir/bin" "node" "v22.14.0" 0
    create_stub_executable "$fixture_dir/bin" "fnm" "fnm 1.35.0" 0

    # Don't create .nvmrc or package.json to trigger default

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local result=0
    if ! verify_node 2>/dev/null; then
        echo "  verify_node should work with default version when no config"
        result=1
    fi
    cd - > /dev/null || return 1

    restore_env
    return $result
}

# Test required_node_version with jq parsing
test_required_node_version_jq_parsing() {
    local fixture_dir
    fixture_dir=$(create_fixture "node-version-jq")

    # Create a package.json with engines.node
    write_package_json "$fixture_dir" '{"engines": {"node": ">=20.5.0"}}'

    # Create a jq stub
    mkdir -p "$fixture_dir/bin"
    cat > "$fixture_dir/bin/jq" << 'STUBEOF'
#!/bin/bash
# Simple jq stub that returns the engines.node value
if [[ "$*" == *".engines.node"* ]]; then
    echo ">=20.5.0"
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/jq"

    save_env
    export PATH="$fixture_dir/bin:$SAVED_PATH"
    export HOME="$fixture_dir"

    source_library

    cd "$fixture_dir" || return 1
    local version
    version=$(required_node_version)
    cd - > /dev/null || return 1

    local result=0
    # Should extract version without >= prefix
    if [[ "$version" != "20.5.0" ]]; then
        echo "  required_node_version should parse engines.node with jq (got: $version)"
        result=1
    fi

    restore_env
    return $result
}

# Test install_pnpm when corepack enable succeeds without sudo
test_install_pnpm_corepack_no_sudo_needed() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-no-sudo-need")
    mkdir -p "$fixture_dir/bin"

    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "enable" ]]; then
    exit 0
fi
if [[ "$1" == "prepare" ]]; then
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"

    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_pnpm should succeed when corepack works without sudo (exit: $exit_code)"
        result=1
    fi
    if [[ "$output" != *"pnpm installed successfully"* ]]; then
        echo "  install_pnpm should report success (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
}

# Test version_satisfies with empty values
test_version_satisfies_empty_values() {
    source_library

    local result=0

    if version_satisfies "" "1.0.0"; then
        echo "  version_satisfies should fail with empty installed version"
        result=1
    fi

    if version_satisfies "1.0.0" ""; then
        echo "  version_satisfies should fail with empty required version"
        result=1
    fi

    return $result
}

# Test version_satisfies with non-numeric components
test_version_satisfies_non_numeric() {
    source_library

    local result=0

    if version_satisfies "latest" "1.0.0"; then
        echo "  version_satisfies should fail with non-numeric installed"
        result=1
    fi

    if version_satisfies "1.0.0" "lts/*"; then
        echo "  version_satisfies should fail with non-numeric required"
        result=1
    fi

    return $result
}

# Test normalize_version with various inputs
test_normalize_version_various() {
    source_library

    local result=0
    local output

    output=$(normalize_version "v1.2.3")
    if [[ "$output" != "1.2.3" ]]; then
        echo "  normalize_version should strip lowercase v (got: $output)"
        result=1
    fi

    output=$(normalize_version "V1.2.3")
    if [[ "$output" != "1.2.3" ]]; then
        echo "  normalize_version should strip uppercase V (got: $output)"
        result=1
    fi

    output=$(normalize_version "1.2.3")
    if [[ "$output" != "1.2.3" ]]; then
        echo "  normalize_version should keep clean version (got: $output)"
        result=1
    fi

    return $result
}

# Test parse_version_component with edge cases
test_parse_version_component_edge_cases() {
    source_library

    local result=0
    local output

    # Component beyond available parts should return 0
    output=$(parse_version_component "1.2" 2)
    if [[ "$output" != "0" ]]; then
        echo "  parse_version_component should return 0 for missing patch (got: $output)"
        result=1
    fi

    output=$(parse_version_component "1" 1)
    if [[ "$output" != "0" ]]; then
        echo "  parse_version_component should return 0 for missing minor (got: $output)"
        result=1
    fi

    return $result
}

# Test required_pnpm_version with various packageManager formats
test_required_pnpm_version_formats() {
    source_library

    local fixture_dir
    fixture_dir=$(create_fixture "pnpm-version-formats")
    local result=0

    # Test with pnpm@X.Y.Z format
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'
    cd "$fixture_dir" || return 1
    local version
    version=$(required_pnpm_version)
    if [[ "$version" != "10.4.1" ]]; then
        echo "  required_pnpm_version should parse pnpm@10.4.1 (got: $version)"
        result=1
    fi
    cd - > /dev/null || return 1

    # Test with pnpm@X.Y.Z+sha256... format
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1+sha256.abc123"}'
    cd "$fixture_dir" || return 1
    version=$(required_pnpm_version)
    if [[ "$version" != "10.4.1" ]]; then
        echo "  required_pnpm_version should parse pnpm@10.4.1+sha (got: $version)"
        result=1
    fi
    cd - > /dev/null || return 1

    return $result
}

# Test install_pnpm succeeds with passwordless sudo fallback
test_install_pnpm_sudo_passwordless() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-sudo-ok")
    mkdir -p "$fixture_dir/bin"
    # corepack stub: fails without sudo
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
if [[ "${1:-}" == "enable" ]]; then
    exit 1
fi
if [[ "${1:-}" == "prepare" ]]; then
    exit 0
fi
exit 0
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    # sudo stub: -n true succeeds, -n corepack enable succeeds
    cat > "$fixture_dir/bin/sudo" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "-n" ]]; then
    shift
    if [[ "$1" == "true" ]]; then
        exit 0
    fi
    if [[ "$1" == "corepack" ]]; then
        exit 0
    fi
fi
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/sudo"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -ne 0 ]]; then
        echo "  install_pnpm should succeed with passwordless sudo (exit: $exit_code, output: $output)"
        result=1
    fi
    if [[ "$output" != *"pnpm installed successfully"* ]]; then
        echo "  install_pnpm should report success with sudo fallback (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
}

# Test install_pnpm fails when sudo -n corepack enable fails
test_install_pnpm_sudo_corepack_fails() {
    source_library
    save_env

    local fixture_dir
    fixture_dir=$(create_fixture "install-pnpm-sudo-cp-fail")
    mkdir -p "$fixture_dir/bin"
    # corepack stub that always fails
    cat > "$fixture_dir/bin/corepack" << 'STUBEOF'
#!/bin/bash
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/corepack"
    # sudo stub: -n true succeeds, -n corepack enable fails
    cat > "$fixture_dir/bin/sudo" << 'STUBEOF'
#!/bin/bash
if [[ "$1" == "-n" ]]; then
    shift
    if [[ "$1" == "true" ]]; then
        exit 0
    fi
    if [[ "$1" == "corepack" ]]; then
        exit 1
    fi
fi
exit 1
STUBEOF
    chmod +x "$fixture_dir/bin/sudo"
    write_package_json "$fixture_dir" '{"packageManager": "pnpm@10.4.1"}'

    local orig_check_node
    orig_check_node="$(declare -f check_node)"
    eval 'check_node() { return 0; }'

    export PATH="$fixture_dir/bin:$SAVED_PATH"

    cd "$fixture_dir" || return 1
    local result=0 output exit_code
    set +e
    output=$(install_pnpm 2>&1)
    exit_code=$?
    set -euo pipefail
    cd - > /dev/null || return 1

    if [[ $exit_code -eq 0 ]]; then
        echo "  install_pnpm should fail when sudo corepack enable fails"
        result=1
    fi
    if [[ "$output" != *"Failed to enable corepack with sudo"* ]]; then
        echo "  install_pnpm should report sudo corepack failure (output: $output)"
        result=1
    fi

    eval "$orig_check_node"
    restore_env
    return $result
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
    run_test "setup_fnm_env in PATH" test_setup_fnm_env_in_path
    run_test "setup_fnm_env ~/.local/share/fnm" test_setup_fnm_env_local_share
    run_test "setup_fnm_env ~/.fnm" test_setup_fnm_env_home_fnm
    run_test "setup_fnm_env FNM_DIR" test_setup_fnm_env_fnm_dir
    run_test "setup_fnm_env not found" test_setup_fnm_env_not_found
    run_test "verify_node with stub" test_verify_node_with_stub
    run_test "verify_node non-numeric requirement" test_verify_node_nonnumeric_requirement
    run_test "verify_node v-prefix requirement" test_verify_node_v_prefix_requirement
    run_test "check_fnm locations" test_check_fnm_locations
    run_test "verify_pnpm with stub" test_verify_pnpm_with_stub
    run_test "ensure_node_toolchain --fail-fast" test_ensure_node_toolchain_fail_fast
    run_test "ensure_node_toolchain without --fail-fast" test_ensure_node_toolchain_no_fail_fast
    run_test "install_fnm already installed" test_install_fnm_already_installed
    run_test "install_fnm no curl" test_install_fnm_no_curl
    run_test "install_fnm curl download fails" test_install_fnm_curl_download_fails
    run_test "install_fnm invalid shebang" test_install_fnm_invalid_shebang
    run_test "install_fnm no markers" test_install_fnm_no_markers
    run_test "install_fnm installer fails" test_install_fnm_installer_fails
    run_test "install_fnm setup env fails" test_install_fnm_setup_env_fails
    run_test "install_fnm success" test_install_fnm_success
    run_test "verify_fnm success" test_verify_fnm_success
    run_test "verify_fnm missing in PATH" test_verify_fnm_missing_in_path
    run_test "verify_fnm not found" test_verify_fnm_not_found
    run_test "verify_fnm version fails" test_verify_fnm_version_fails
    run_test "install_node no fnm" test_install_node_no_fnm
    run_test "install_node env fails" test_install_node_env_fails
    run_test "install_node fnm install fails" test_install_node_fnm_install_fails
    run_test "install_node fnm use fails" test_install_node_fnm_use_fails
    run_test "install_node success" test_install_node_success
    run_test "verify_node version mismatch" test_verify_node_version_mismatch
    run_test "install_pnpm no node" test_install_pnpm_no_node
    run_test "install_pnpm corepack no sudo" test_install_pnpm_corepack_no_sudo
    run_test "install_pnpm sudo needs password" test_install_pnpm_sudo_needs_password
    run_test "install_pnpm prepare fails" test_install_pnpm_prepare_fails
    run_test "install_pnpm success" test_install_pnpm_success
    run_test "install_pnpm sudo passwordless" test_install_pnpm_sudo_passwordless
    run_test "install_pnpm sudo corepack fails" test_install_pnpm_sudo_corepack_fails
    run_test "verify_node_toolchain success" test_verify_node_toolchain_success
    run_test "verify_node_toolchain partial failure" test_verify_node_toolchain_partial_failure
    run_test "ensure_node_toolchain all present" test_ensure_node_toolchain_all_present
    run_test "ensure_node_toolchain unknown arg" test_ensure_node_toolchain_unknown_arg

    # ==============================================================================
    # Additional tests for code coverage gaps
    # ==============================================================================
    # NOTE: Tests that override library functions (using eval) MUST save the
    # original function definition first and restore it after the test. This
    # prevents function stubs from leaking into later tests.
    #
    # Pattern:
    #   local orig_check_fnm
    #   orig_check_fnm="$(declare -f check_fnm)"
    #   eval 'check_fnm() { ... }'
    #   # ... run test ...
    #   eval "$orig_check_fnm"
    #
    # Examples in this test suite:
    #   - test_ensure_node_toolchain_fail_fast, test_ensure_node_toolchain_no_fail_fast
    #   - test_install_fnm_check_fnm_true_after_install, test_install_fnm_already_installed
    #   - test_install_node_fnm_already_installed
    #
    # Tests using this pattern: check_fnm, install_fnm, check_node, install_node,
    # check_pnpm, install_pnpm, verify_fnm, verify_node, verify_pnpm, setup_fnm_env

    run_test "install_fnm check_fnm after install" test_install_fnm_check_fnm_true_after_install
    run_test "verify_pnpm version mismatch" test_verify_pnpm_version_mismatch
    run_test "verify_pnpm v-prefixed version" test_verify_pnpm_v_prefixed_version
    run_test "verify_pnpm version fails" test_verify_pnpm_version_fails
    run_test "ensure_node_toolchain installs all" test_ensure_node_toolchain_installs_all
    run_test "ensure_node_toolchain fail-fast node" test_ensure_node_toolchain_fail_fast_node
    run_test "ensure_node_toolchain fail-fast pnpm" test_ensure_node_toolchain_fail_fast_pnpm
    run_test "install_node fnm already installed" test_install_node_fnm_already_installed
    run_test "verify_node empty required version" test_verify_node_empty_required_version
    run_test "required_node_version jq parsing" test_required_node_version_jq_parsing
    run_test "install_pnpm corepack no sudo needed" test_install_pnpm_corepack_no_sudo_needed
    run_test "version_satisfies empty values" test_version_satisfies_empty_values
    run_test "version_satisfies non-numeric" test_version_satisfies_non_numeric
    run_test "normalize_version various" test_normalize_version_various
    run_test "parse_version_component edge cases" test_parse_version_component_edge_cases
    run_test "required_pnpm_version formats" test_required_pnpm_version_formats

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

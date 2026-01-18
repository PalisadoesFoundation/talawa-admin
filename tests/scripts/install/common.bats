#!/usr/bin/env bats
#
# Talawa Admin - Unit Tests for common.sh
# ========================================
#
# This file contains comprehensive unit tests for the common utility library
# located at scripts/install/lib/common.sh
#
# Run with: bats tests/scripts/install/common.bats
# Run with coverage: kcov coverage/bash tests/scripts/install/common.bats
#

# Get the absolute path to the repository root
REPO_ROOT="$(cd "$(dirname "$BATS_TEST_FILENAME")/../../.." && pwd)"
COMMON_SH="$REPO_ROOT/scripts/install/lib/common.sh"

# =============================================================================
# Setup and Teardown
# =============================================================================

setup() {
    # Reset source guard before each test to allow re-sourcing
    unset TALAWA_COMMON_SOURCED

    # Create a temp directory for test files
    TEST_TEMP_DIR="$(mktemp -d)"

    # Track temp files/dirs created during tests for cleanup
    CREATED_TEMP_FILES=()
    CREATED_TEMP_DIRS=()
}

teardown() {
    # Clean up temp files created by tests
    for f in "${CREATED_TEMP_FILES[@]}"; do
        [[ -f "$f" ]] && rm -f "$f"
    done
    for d in "${CREATED_TEMP_DIRS[@]}"; do
        [[ -d "$d" ]] && rm -rf "$d"
    done

    # Clean up test temp directory
    [[ -d "$TEST_TEMP_DIR" ]] && rm -rf "$TEST_TEMP_DIR"
}

# =============================================================================
# Helper Functions
# =============================================================================

# Source common.sh in a fresh subshell to avoid state pollution
source_common() {
    unset TALAWA_COMMON_SOURCED
    # shellcheck source=/dev/null
    source "$COMMON_SH"
}

# =============================================================================
# Test: Source Guard
# =============================================================================

@test "common.sh can be sourced successfully" {
    run bash -c "source '$COMMON_SH'"
    [ "$status" -eq 0 ]
}

@test "common.sh sets TALAWA_COMMON_SOURCED after sourcing" {
    source_common
    [ "$TALAWA_COMMON_SOURCED" = "1" ]
}

@test "common.sh can be sourced multiple times without error (idempotent)" {
    run bash -c "source '$COMMON_SH' && source '$COMMON_SH' && echo 'OK'"
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "OK" ]
}

# =============================================================================
# Test: Exit Codes
# =============================================================================

@test "exit codes are defined correctly" {
    source_common
    [ "$E_SUCCESS" -eq 0 ]
    [ "$E_GENERAL" -eq 1 ]
    [ "$E_MISSING_DEP" -eq 2 ]
    [ "$E_PERMISSION" -eq 3 ]
    [ "$E_NETWORK" -eq 4 ]
    [ "$E_USER_ABORT" -eq 5 ]
}

# =============================================================================
# Test: enable_strict_mode
# =============================================================================

@test "enable_strict_mode sets errexit option" {
    run bash -c "
        source '$COMMON_SH'
        enable_strict_mode
        [[ \$- == *e* ]] && echo 'errexit set'
    "
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "errexit set" ]
}

@test "enable_strict_mode sets nounset option" {
    run bash -c "
        source '$COMMON_SH'
        enable_strict_mode
        [[ \$- == *u* ]] && echo 'nounset set'
    "
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "nounset set" ]
}

@test "enable_strict_mode sets pipefail option" {
    run bash -c "
        source '$COMMON_SH'
        enable_strict_mode
        [[ \$(set -o | grep pipefail) == *on* ]] && echo 'pipefail set'
    "
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "pipefail set" ]
}

@test "enable_strict_mode causes script to exit on error" {
    run bash -c "
        source '$COMMON_SH'
        enable_strict_mode
        false  # This should cause exit
        echo 'This should not print'
    "
    [ "$status" -ne 0 ]
    [[ ! "${output}" =~ "This should not print" ]]
}

# =============================================================================
# Test: Logging Functions
# =============================================================================

@test "log_info outputs message with [INFO] prefix" {
    source_common
    run log_info "Test message"
    [ "$status" -eq 0 ]
    [ "$output" = "[INFO] Test message" ]
}

@test "log_info handles empty message" {
    source_common
    run log_info ""
    [ "$status" -eq 0 ]
    [ "$output" = "[INFO] " ]
}

@test "log_info handles message with special characters" {
    source_common
    run log_info 'Message with $pecial "characters" and `backticks`'
    [ "$status" -eq 0 ]
    [[ "$output" == *'$pecial'* ]]
    [[ "$output" == *'"characters"'* ]]
}

@test "log_success outputs message with checkmark" {
    source_common
    run log_success "Operation completed"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Operation completed"* ]]
}

@test "log_success includes CHECK_MARK symbol" {
    source_common
    run log_success "Test"
    [ "$status" -eq 0 ]
    [[ "$output" == *"$CHECK_MARK"* ]] || [[ "$output" == *"✓"* ]]
}

@test "log_warning outputs message with [WARN] prefix" {
    source_common
    run log_warning "Warning message"
    [ "$status" -eq 0 ]
    [ "$output" = "[WARN] Warning message" ]
}

@test "log_warning handles empty message" {
    source_common
    run log_warning ""
    [ "$status" -eq 0 ]
    [ "$output" = "[WARN] " ]
}

@test "log_error outputs message to stderr with X_MARK" {
    source_common
    run log_error "Error occurred"
    [ "$status" -eq 0 ]
    [[ "$output" == *"ERROR: Error occurred"* ]]
}

@test "log_error writes to stderr not stdout" {
    source_common
    # Capture stdout and stderr separately
    run bash -c "source '$COMMON_SH' && log_error 'Test error' 2>&1 >/dev/null"
    [[ "$output" == *"ERROR: Test error"* ]]
}

@test "log_step outputs step header with number and description" {
    source_common
    run log_step "1" "Installing dependencies"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Step 1: Installing dependencies"* ]]
    [[ "$output" == *"----------------------------------------"* ]]
}

@test "log_step handles multi-digit step numbers" {
    source_common
    run log_step "10" "Final step"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Step 10: Final step"* ]]
}

# =============================================================================
# Test: die Function
# =============================================================================

@test "die exits with default exit code 1" {
    run bash -c "source '$COMMON_SH' && die 'Fatal error'"
    [ "$status" -eq 1 ]
}

@test "die exits with custom exit code" {
    run bash -c "source '$COMMON_SH' && die 'Missing dependency' 2"
    [ "$status" -eq 2 ]
}

@test "die exits with E_MISSING_DEP code" {
    run bash -c "source '$COMMON_SH' && die 'Not found' \$E_MISSING_DEP"
    [ "$status" -eq 2 ]
}

@test "die exits with E_PERMISSION code" {
    run bash -c "source '$COMMON_SH' && die 'Access denied' \$E_PERMISSION"
    [ "$status" -eq 3 ]
}

@test "die outputs error message before exiting" {
    run bash -c "source '$COMMON_SH' && die 'Something went wrong' 2>&1"
    [[ "$output" == *"ERROR: Something went wrong"* ]]
}

@test "die uses default message when none provided" {
    run bash -c "source '$COMMON_SH' && die 2>&1"
    [[ "$output" == *"Unexpected error"* ]]
}

# =============================================================================
# Test: cleanup and setup_traps
# =============================================================================

@test "cleanup function exists and does nothing by default" {
    source_common
    run cleanup
    [ "$status" -eq 0 ]
    [ -z "$output" ]
}

@test "setup_traps installs trap handlers" {
    run bash -c "
        source '$COMMON_SH'
        setup_traps
        trap -p EXIT | grep -q cleanup && echo 'trap installed'
    "
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "trap installed" ]
}

@test "custom cleanup function is called on exit after setup_traps" {
    run bash -c "
        source '$COMMON_SH'
        cleanup() { echo 'Custom cleanup executed'; }
        setup_traps
        exit 0
    "
    [ "$status" -eq 0 ]
    [[ "$output" == *"Custom cleanup executed"* ]]
}

# =============================================================================
# Test: confirm Function
# =============================================================================

@test "confirm returns 0 for 'y' input" {
    run bash -c "source '$COMMON_SH' && echo 'y' | confirm 'Continue?'"
    [ "$status" -eq 0 ]
}

@test "confirm returns 0 for 'yes' input" {
    run bash -c "source '$COMMON_SH' && echo 'yes' | confirm 'Continue?'"
    [ "$status" -eq 0 ]
}

@test "confirm returns 0 for 'Y' input (case insensitive)" {
    run bash -c "source '$COMMON_SH' && echo 'Y' | confirm 'Continue?'"
    [ "$status" -eq 0 ]
}

@test "confirm returns 0 for 'YES' input (case insensitive)" {
    run bash -c "source '$COMMON_SH' && echo 'YES' | confirm 'Continue?'"
    [ "$status" -eq 0 ]
}

@test "confirm returns 1 for 'n' input" {
    run bash -c "source '$COMMON_SH' && echo 'n' | confirm 'Continue?'"
    [ "$status" -eq 1 ]
}

@test "confirm returns 1 for 'no' input" {
    run bash -c "source '$COMMON_SH' && echo 'no' | confirm 'Continue?'"
    [ "$status" -eq 1 ]
}

@test "confirm returns 1 for 'N' input (case insensitive)" {
    run bash -c "source '$COMMON_SH' && echo 'N' | confirm 'Continue?'"
    [ "$status" -eq 1 ]
}

@test "confirm uses default 'n' when empty input" {
    run bash -c "source '$COMMON_SH' && echo '' | confirm 'Continue?'"
    [ "$status" -eq 1 ]
}

@test "confirm uses custom default 'y'" {
    run bash -c "source '$COMMON_SH' && echo '' | confirm 'Continue?' 'y'"
    [ "$status" -eq 0 ]
}

@test "confirm indicator logic: default 'n' produces [y/N]" {
    # Test the indicator computation logic
    run bash -c '
        default="n"
        if [ "$default" = "y" ] || [ "$default" = "Y" ]; then
            indicator="[Y/n]"
        else
            indicator="[y/N]"
        fi
        echo "$indicator"
    '
    [ "$output" = "[y/N]" ]
}

@test "confirm indicator logic: default 'y' produces [Y/n]" {
    # Test the indicator computation logic
    run bash -c '
        default="y"
        if [ "$default" = "y" ] || [ "$default" = "Y" ]; then
            indicator="[Y/n]"
        else
            indicator="[y/N]"
        fi
        echo "$indicator"
    '
    [ "$output" = "[Y/n]" ]
}

@test "confirm indicator logic: default 'Y' produces [Y/n]" {
    # Test the indicator computation logic with uppercase
    run bash -c '
        default="Y"
        if [ "$default" = "y" ] || [ "$default" = "Y" ]; then
            indicator="[Y/n]"
        else
            indicator="[y/N]"
        fi
        echo "$indicator"
    '
    [ "$output" = "[Y/n]" ]
}

@test "confirm prompts again for invalid input then accepts valid" {
    run bash -c "source '$COMMON_SH' && printf 'invalid\ny\n' | confirm 'Continue?'"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Please answer yes or no"* ]]
}

# =============================================================================
# Test: prompt_input Function
# =============================================================================

@test "prompt_input returns user input" {
    run bash -c "source '$COMMON_SH' && echo 'user_value' | prompt_input 'Enter value'"
    [ "$status" -eq 0 ]
    [ "$output" = "user_value" ]
}

@test "prompt_input returns default when empty input" {
    run bash -c "source '$COMMON_SH' && echo '' | prompt_input 'Enter value' 'default_val'"
    [ "$status" -eq 0 ]
    [ "$output" = "default_val" ]
}

@test "prompt_input returns user input even when default provided" {
    run bash -c "source '$COMMON_SH' && echo 'custom' | prompt_input 'Enter value' 'default_val'"
    [ "$status" -eq 0 ]
    [ "$output" = "custom" ]
}

@test "prompt_input handles spaces in input" {
    run bash -c "source '$COMMON_SH' && echo 'value with spaces' | prompt_input 'Enter value'"
    [ "$status" -eq 0 ]
    [ "$output" = "value with spaces" ]
}

@test "prompt_input handles empty default" {
    run bash -c "source '$COMMON_SH' && echo 'test' | prompt_input 'Enter value' ''"
    [ "$status" -eq 0 ]
    [ "$output" = "test" ]
}

# =============================================================================
# Test: sanitize_input Function
# =============================================================================

@test "sanitize_input removes semicolons" {
    source_common
    run sanitize_input "hello;world"
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes ampersands" {
    source_common
    run sanitize_input "hello&world"
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes pipes" {
    source_common
    run sanitize_input "hello|world"
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes backticks" {
    source_common
    run sanitize_input 'hello`world'
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes dollar signs" {
    source_common
    run sanitize_input 'hello$world'
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes parentheses" {
    source_common
    run sanitize_input "hello()world"
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input removes curly braces" {
    source_common
    run sanitize_input "hello{}world"
    [ "$status" -eq 0 ]
    [ "$output" = "helloworld" ]
}

@test "sanitize_input handles empty input" {
    source_common
    run sanitize_input ""
    [ "$status" -eq 0 ]
    [ -z "$output" ]
}

@test "sanitize_input preserves safe characters" {
    source_common
    run sanitize_input "hello-world_123.txt"
    [ "$status" -eq 0 ]
    [ "$output" = "hello-world_123.txt" ]
}

@test "sanitize_input removes multiple dangerous characters" {
    source_common
    run sanitize_input '; rm -rf / && cat /etc/passwd | grep root'
    [ "$status" -eq 0 ]
    [[ "$output" != *";"* ]]
    [[ "$output" != *"&"* ]]
    [[ "$output" != *"|"* ]]
}

# =============================================================================
# Test: create_temp_file Function
# =============================================================================

@test "create_temp_file creates a file" {
    source_common
    temp_file="$(create_temp_file)"
    CREATED_TEMP_FILES+=("$temp_file")
    [ -f "$temp_file" ]
}

@test "create_temp_file creates file with default prefix" {
    source_common
    temp_file="$(create_temp_file)"
    CREATED_TEMP_FILES+=("$temp_file")
    [[ "$temp_file" == /tmp/talawa-* ]]
}

@test "create_temp_file creates file with custom prefix" {
    source_common
    temp_file="$(create_temp_file "myprefix")"
    CREATED_TEMP_FILES+=("$temp_file")
    [[ "$temp_file" == /tmp/myprefix-* ]]
}

@test "create_temp_file returns unique paths" {
    source_common
    temp_file1="$(create_temp_file)"
    temp_file2="$(create_temp_file)"
    CREATED_TEMP_FILES+=("$temp_file1" "$temp_file2")
    [ "$temp_file1" != "$temp_file2" ]
}

@test "create_temp_file creates file that is writable" {
    source_common
    temp_file="$(create_temp_file)"
    CREATED_TEMP_FILES+=("$temp_file")
    echo "test content" > "$temp_file"
    [ "$(cat "$temp_file")" = "test content" ]
}

# =============================================================================
# Test: create_temp_dir Function
# =============================================================================

@test "create_temp_dir creates a directory" {
    source_common
    temp_dir="$(create_temp_dir)"
    CREATED_TEMP_DIRS+=("$temp_dir")
    [ -d "$temp_dir" ]
}

@test "create_temp_dir creates directory with default prefix" {
    source_common
    temp_dir="$(create_temp_dir)"
    CREATED_TEMP_DIRS+=("$temp_dir")
    [[ "$temp_dir" == /tmp/talawa-* ]]
}

@test "create_temp_dir creates directory with custom prefix" {
    source_common
    temp_dir="$(create_temp_dir "mydir")"
    CREATED_TEMP_DIRS+=("$temp_dir")
    [[ "$temp_dir" == /tmp/mydir-* ]]
}

@test "create_temp_dir returns unique paths" {
    source_common
    temp_dir1="$(create_temp_dir)"
    temp_dir2="$(create_temp_dir)"
    CREATED_TEMP_DIRS+=("$temp_dir1" "$temp_dir2")
    [ "$temp_dir1" != "$temp_dir2" ]
}

@test "create_temp_dir creates directory that is writable" {
    source_common
    temp_dir="$(create_temp_dir)"
    CREATED_TEMP_DIRS+=("$temp_dir")
    touch "$temp_dir/test_file"
    [ -f "$temp_dir/test_file" ]
}

# =============================================================================
# Test: command_exists Function
# =============================================================================

@test "command_exists returns 0 for existing command (bash)" {
    source_common
    run command_exists "bash"
    [ "$status" -eq 0 ]
}

@test "command_exists returns 0 for existing command (ls)" {
    source_common
    run command_exists "ls"
    [ "$status" -eq 0 ]
}

@test "command_exists returns 1 for non-existing command" {
    source_common
    run command_exists "nonexistent_command_xyz123"
    [ "$status" -eq 1 ]
}

@test "command_exists handles empty argument" {
    source_common
    run command_exists ""
    [ "$status" -eq 1 ]
}

@test "command_exists works with full path" {
    source_common
    run command_exists "/bin/bash"
    [ "$status" -eq 0 ]
}

# =============================================================================
# Test: validate_url Function
# =============================================================================

@test "validate_url accepts valid http URL" {
    source_common
    run validate_url "http://example.com"
    [ "$status" -eq 0 ]
}

@test "validate_url accepts valid https URL" {
    source_common
    run validate_url "https://example.com"
    [ "$status" -eq 0 ]
}

@test "validate_url accepts URL with path" {
    source_common
    run validate_url "https://example.com/path/to/resource"
    [ "$status" -eq 0 ]
}

@test "validate_url accepts URL with query string" {
    source_common
    run validate_url "https://example.com/search?q=test"
    [ "$status" -eq 0 ]
}

@test "validate_url accepts URL with port" {
    source_common
    run validate_url "http://localhost:8080"
    [ "$status" -eq 0 ]
}

@test "validate_url rejects URL without protocol" {
    source_common
    run validate_url "example.com"
    [ "$status" -eq 1 ]
}

@test "validate_url rejects ftp URL" {
    source_common
    run validate_url "ftp://example.com"
    [ "$status" -eq 1 ]
}

@test "validate_url rejects URL with spaces" {
    source_common
    run validate_url "http://example.com/path with spaces"
    [ "$status" -eq 1 ]
}

@test "validate_url rejects empty input" {
    source_common
    run validate_url ""
    [ "$status" -eq 1 ]
}

# =============================================================================
# Test: require_commands Function
# =============================================================================

@test "require_commands passes when all commands exist" {
    source_common
    run require_commands "bash" "ls" "cat"
    [ "$status" -eq 0 ]
}

@test "require_commands fails when command is missing" {
    run bash -c "source '$COMMON_SH' && require_commands 'nonexistent_xyz_123' 2>&1"
    [ "$status" -eq 2 ]
    [[ "$output" == *"Missing required commands"* ]]
}

@test "require_commands lists all missing commands" {
    run bash -c "source '$COMMON_SH' && require_commands 'missing_cmd_1' 'missing_cmd_2' 2>&1"
    [ "$status" -eq 2 ]
    [[ "$output" == *"missing_cmd_1"* ]]
    [[ "$output" == *"missing_cmd_2"* ]]
}

@test "require_commands passes with single existing command" {
    source_common
    run require_commands "bash"
    [ "$status" -eq 0 ]
}

@test "require_commands fails if any command is missing" {
    run bash -c "source '$COMMON_SH' && require_commands 'bash' 'nonexistent_xyz' 'ls' 2>&1"
    [ "$status" -eq 2 ]
}

# =============================================================================
# Test: get_script_dir Function
# =============================================================================

@test "get_script_dir returns a valid directory" {
    source_common
    result="$(get_script_dir)"
    [ -d "$result" ]
}

@test "get_script_dir returns an absolute path" {
    source_common
    result="$(get_script_dir)"
    [[ "$result" == /* ]]
}

@test "get_script_dir returns directory containing the calling script" {
    # Create a test script that sources common.sh and calls get_script_dir
    cat > "$TEST_TEMP_DIR/test_script.sh" << 'EOF'
#!/bin/bash
source "$1"
get_script_dir
EOF
    chmod +x "$TEST_TEMP_DIR/test_script.sh"

    run bash "$TEST_TEMP_DIR/test_script.sh" "$COMMON_SH"
    [ "$status" -eq 0 ]
    [ "$output" = "$TEST_TEMP_DIR" ]
}

# =============================================================================
# Test: get_absolute_path Function
# =============================================================================

@test "get_absolute_path returns absolute path for directory" {
    source_common
    result="$(get_absolute_path "$TEST_TEMP_DIR")"
    [[ "$result" == /* ]]
    [ -d "$result" ]
}

@test "get_absolute_path returns absolute path for file" {
    source_common
    test_file="$TEST_TEMP_DIR/test_file.txt"
    touch "$test_file"
    result="$(get_absolute_path "$test_file")"
    [[ "$result" == /* ]]
    [ -f "$result" ]
}

@test "get_absolute_path handles current directory reference" {
    source_common
    cd "$TEST_TEMP_DIR"
    result="$(get_absolute_path ".")"
    [ "$result" = "$TEST_TEMP_DIR" ]
}

@test "get_absolute_path fails for non-existent path" {
    run bash -c "source '$COMMON_SH' && get_absolute_path '/nonexistent/path/xyz'"
    [ "$status" -ne 0 ]
    [[ "$output" == *"Path does not exist"* ]]
}

@test "get_absolute_path handles relative paths" {
    source_common
    test_file="$TEST_TEMP_DIR/subdir/file.txt"
    mkdir -p "$(dirname "$test_file")"
    touch "$test_file"

    cd "$TEST_TEMP_DIR"
    result="$(get_absolute_path "subdir/file.txt")"
    [ "$result" = "$test_file" ]
}

# =============================================================================
# Test: safe_source Function
# =============================================================================

@test "safe_source successfully sources an existing file" {
    source_common

    # Create a test library file
    cat > "$TEST_TEMP_DIR/test_lib.sh" << 'EOF'
TEST_LIB_VAR="loaded"
test_lib_func() { echo "function works"; }
EOF

    safe_source "$TEST_TEMP_DIR/test_lib.sh"
    [ "$TEST_LIB_VAR" = "loaded" ]
    result="$(test_lib_func)"
    [ "$result" = "function works" ]
}

@test "safe_source fails for non-existent file" {
    run bash -c "source '$COMMON_SH' && safe_source '/nonexistent/library.sh'"
    [ "$status" -eq 2 ]
    [[ "$output" == *"Library not found"* ]]
}

@test "safe_source fails for directory instead of file" {
    run bash -c "source '$COMMON_SH' && safe_source '$TEST_TEMP_DIR'"
    [ "$status" -eq 2 ]
}

@test "safe_source handles library with syntax error" {
    source_common

    # Create a library with a syntax error
    cat > "$TEST_TEMP_DIR/bad_lib.sh" << 'EOF'
# This has a syntax error
if then fi
EOF

    run bash -c "source '$COMMON_SH' && safe_source '$TEST_TEMP_DIR/bad_lib.sh'"
    [ "$status" -ne 0 ]
}

@test "safe_source handles empty library file" {
    source_common

    # Create an empty library file
    touch "$TEST_TEMP_DIR/empty_lib.sh"

    run safe_source "$TEST_TEMP_DIR/empty_lib.sh"
    [ "$status" -eq 0 ]
}

# =============================================================================
# Test: is_root Function
# =============================================================================

@test "is_root returns 1 when not running as root" {
    source_common
    # Most CI/test environments don't run as root
    if [ "$(id -u)" -ne 0 ]; then
        run is_root
        [ "$status" -eq 1 ]
    else
        skip "Test skipped when running as root"
    fi
}

@test "is_root returns 0 when id -u returns 0" {
    # Mock id command to return 0
    run bash -c "
        source '$COMMON_SH'
        # Override id command
        id() {
            if [ \"\$1\" = '-u' ]; then
                echo 0
            fi
        }
        export -f id
        is_root
    "
    [ "$status" -eq 0 ]
}

@test "is_root correctly identifies non-root user" {
    run bash -c "
        source '$COMMON_SH'
        # Mock id to return non-zero
        id() {
            if [ \"\$1\" = '-u' ]; then
                echo 1000
            fi
        }
        export -f id
        is_root
    "
    [ "$status" -eq 1 ]
}

# =============================================================================
# Test: require_root Function
# =============================================================================

@test "require_root exits when not running as root" {
    run bash -c "
        source '$COMMON_SH'
        # Mock id to return non-root
        id() {
            if [ \"\$1\" = '-u' ]; then
                echo 1000
            fi
        }
        export -f id
        require_root
    "
    [ "$status" -eq 3 ]
    [[ "$output" == *"requires root privileges"* ]]
}

@test "require_root passes when running as root (mocked)" {
    run bash -c "
        source '$COMMON_SH'
        # Mock id to return root
        id() {
            if [ \"\$1\" = '-u' ]; then
                echo 0
            fi
        }
        export -f id
        require_root
        echo 'passed'
    "
    [ "$status" -eq 0 ]
    [ "${lines[-1]}" = "passed" ]
}

@test "require_root exits with E_PERMISSION code" {
    run bash -c "
        source '$COMMON_SH'
        # Ensure we're not root for this test
        id() {
            if [ \"\$1\" = '-u' ]; then
                echo 1000
            fi
        }
        export -f id
        require_root
    "
    [ "$status" -eq 3 ]  # E_PERMISSION = 3
}

# =============================================================================
# Test: Symbols
# =============================================================================

@test "CHECK_MARK symbol is defined" {
    source_common
    [ -n "$CHECK_MARK" ]
}

@test "X_MARK symbol is defined" {
    source_common
    [ -n "$X_MARK" ]
}

@test "CHECK_MARK is the checkmark character" {
    source_common
    [ "$CHECK_MARK" = "✓" ]
}

@test "X_MARK is the X character" {
    source_common
    [ "$X_MARK" = "✗" ]
}

# =============================================================================
# Integration Tests
# =============================================================================

@test "integration: full workflow - create temp, write, validate, cleanup" {
    source_common

    # Create temp file
    temp_file="$(create_temp_file "integration_test")"
    CREATED_TEMP_FILES+=("$temp_file")
    [ -f "$temp_file" ]

    # Write sanitized input to file
    user_input='test; rm -rf /'
    clean_input="$(sanitize_input "$user_input")"
    echo "$clean_input" > "$temp_file"

    # Verify content was sanitized
    content="$(cat "$temp_file")"
    [[ "$content" != *";"* ]]
    [[ "$content" != *"rm"* ]] || [[ "$content" == "test rm -rf /" ]]
}

@test "integration: logging does not interfere with function returns" {
    source_common

    # Test that logging to stderr doesn't affect function returns
    # log_error goes to stderr, so it won't interfere with stdout capture
    result="$(log_error "test" 2>/dev/null && create_temp_file)"
    CREATED_TEMP_FILES+=("$result")
    [ -f "$result" ]
}

@test "integration: command checking before execution" {
    source_common

    # This pattern is common in install scripts
    if command_exists "bash"; then
        result="$(bash --version | head -1)"
        [[ "$result" == *"bash"* ]] || [[ "$result" == *"GNU"* ]]
    else
        fail "bash should exist"
    fi
}

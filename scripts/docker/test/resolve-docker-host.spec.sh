#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
TARGET_SCRIPT="${ROOT_DIR}/scripts/docker/resolve-docker-host.sh"
# Test harness uses regular files as socket stand-ins.
export TEST_HARNESS_ALLOW_REGULAR_SOCKET_PATHS=true

TOTAL=0
PASSED=0
FAILED=0

assert_eq() {
  local expected="$1"
  local actual="$2"
  local message="$3"
  if [[ "$expected" == "$actual" ]]; then
    return 0
  fi
  echo "  expected: $expected" >&2
  echo "  actual:   $actual" >&2
  echo "  message:  $message" >&2
  return 1
}

assert_contains() {
  local haystack="$1"
  local needle="$2"
  local message="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    return 0
  fi
  echo "  expected substring: $needle" >&2
  echo "  actual output:      $haystack" >&2
  echo "  message:            $message" >&2
  return 1
}

run_test() {
  local name="$1"
  local fn="$2"
  local status
  TOTAL=$((TOTAL + 1))
  echo "Running: $name"

  set +e
  ( set -e; "$fn" )
  status=$?
  set -e

  if [[ $status -eq 0 ]]; then
    echo "  PASSED"
    PASSED=$((PASSED + 1))
  else
    echo "  FAILED"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

test_rootless_mode_uses_runtime_dir_socket() {
  local tmp runtime_dir rootless_socket output expected
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootless_socket="${runtime_dir}/docker.sock"
  mkdir -p "$runtime_dir"
  : > "$rootless_socket"
  output="$("$TARGET_SCRIPT" --mode rootless --runtime-dir "$runtime_dir")"
  expected="unix://${runtime_dir}/docker.sock"
  assert_eq "$expected" "$output" "rootless mode should use runtime dir socket"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_auto_mode_falls_back_to_rootful_socket() {
  local tmp runtime_dir rootful_socket output expected
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  mkdir -p "$runtime_dir"
  : > "$rootful_socket"
  output="$("$TARGET_SCRIPT" --mode auto --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket")"
  expected="unix://${rootful_socket}"
  assert_eq "$expected" "$output" "auto mode should use rootful socket when rootless socket is absent"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_auto_mode_prefers_rootless_socket_when_present() {
  local tmp runtime_dir rootful_socket rootless_socket output expected
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  rootless_socket="${runtime_dir}/docker.sock"
  mkdir -p "$runtime_dir"
  : > "$rootful_socket"
  : > "$rootless_socket"
  output="$("$TARGET_SCRIPT" --mode auto --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket")"
  expected="unix://${rootless_socket}"
  assert_eq "$expected" "$output" "auto mode should prefer rootless socket when present"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_emit_export_format() {
  local tmp runtime_dir rootful_socket output expected
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  mkdir -p "$runtime_dir"
  : > "$rootful_socket"
  output="$("$TARGET_SCRIPT" --mode rootful --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket" --emit-export)"
  expected="export DOCKER_HOST=unix://${rootful_socket}"
  assert_eq "$expected" "$output" "emit-export should print shell export statement"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_invalid_mode_errors() {
  local tmp stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  stderr="${tmp}/stderr"

  if "$TARGET_SCRIPT" --mode invalid >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded for invalid mode" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "Invalid mode: invalid" "invalid mode should fail with explicit error"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_missing_mode_value_errors() {
  local tmp stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  stderr="${tmp}/stderr"

  if "$TARGET_SCRIPT" --mode >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded without --mode value" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "Missing value for --mode" "missing --mode value should fail"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_missing_runtime_dir_value_errors() {
  local tmp stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  stderr="${tmp}/stderr"

  if "$TARGET_SCRIPT" --mode rootless --runtime-dir >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded without --runtime-dir value" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "Missing value for --runtime-dir" "missing --runtime-dir value should fail"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_missing_rootful_socket_value_errors() {
  local tmp stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  stderr="${tmp}/stderr"

  if "$TARGET_SCRIPT" --mode rootful --rootful-socket >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded without --rootful-socket value" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "Missing value for --rootful-socket" "missing --rootful-socket value should fail"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_auto_mode_no_sockets_errors() {
  local tmp runtime_dir rootful_socket stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  stderr="${tmp}/stderr"
  mkdir -p "$runtime_dir"

  if "$TARGET_SCRIPT" --mode auto --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket" >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded when no sockets exist" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "No Docker socket found" "auto mode should fail when both sockets are absent"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

test_rootful_mode_missing_socket_errors() {
  local tmp runtime_dir rootful_socket stderr
  tmp="$(mktemp -d)"
  trap 'rm -rf "'"$tmp"'"' INT TERM EXIT
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  stderr="${tmp}/stderr"
  mkdir -p "$runtime_dir"

  if "$TARGET_SCRIPT" --mode rootful --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket" >"${tmp}/stdout" 2>"$stderr"; then
    echo "  command unexpectedly succeeded when rootful socket is missing" >&2
    rm -rf "$tmp"
    trap - INT TERM EXIT
    return 1
  fi

  assert_contains "$(cat "$stderr")" "Rootful socket not found" "rootful mode should fail when rootful socket is absent"
  rm -rf "$tmp"
  trap - INT TERM EXIT
}

main() {
  echo "=========================================="
  echo "resolve-docker-host Test Suite"
  echo "=========================================="
  echo ""

  run_test "Rootless mode uses runtime dir socket" test_rootless_mode_uses_runtime_dir_socket
  run_test "Auto mode falls back to rootful socket" test_auto_mode_falls_back_to_rootful_socket
  run_test "Auto mode prefers rootless socket" test_auto_mode_prefers_rootless_socket_when_present
  run_test "Emit export format" test_emit_export_format
  run_test "Invalid mode fails" test_invalid_mode_errors
  run_test "Missing --mode value fails" test_missing_mode_value_errors
  run_test "Missing --runtime-dir value fails" test_missing_runtime_dir_value_errors
  run_test "Missing --rootful-socket value fails" test_missing_rootful_socket_value_errors
  run_test "Auto mode with no sockets fails" test_auto_mode_no_sockets_errors
  run_test "Rootful mode with missing socket fails" test_rootful_mode_missing_socket_errors

  echo "=========================================="
  echo "Test Results"
  echo "=========================================="
  echo "Total Tests:  $TOTAL"
  echo "Passed:       $PASSED"
  echo "Failed:       $FAILED"
  echo ""

  if [[ $FAILED -eq 0 ]]; then
    echo "ALL TESTS PASSED"
    exit 0
  fi
  echo "SOME TESTS FAILED"
  exit 1
}

main "$@"

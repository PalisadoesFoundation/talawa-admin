#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
TARGET_SCRIPT="${ROOT_DIR}/scripts/docker/resolve-docker-host.sh"

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

run_test() {
  local name="$1"
  local fn="$2"
  TOTAL=$((TOTAL + 1))
  echo "Running: $name"
  if "$fn"; then
    echo "  ✓ PASSED"
    PASSED=$((PASSED + 1))
  else
    echo "  ✗ FAILED"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

test_rootless_mode_uses_runtime_dir_socket() {
  local tmp runtime_dir output expected
  tmp="$(mktemp -d)"
  runtime_dir="${tmp}/runtime"
  mkdir -p "$runtime_dir"
  output="$("$TARGET_SCRIPT" --mode rootless --runtime-dir "$runtime_dir")"
  expected="unix://${runtime_dir}/docker.sock"
  rm -rf "$tmp"
  assert_eq "$expected" "$output" "rootless mode should always use runtime dir socket"
}

test_auto_mode_falls_back_to_rootful_socket() {
  local tmp runtime_dir rootful_socket output expected
  tmp="$(mktemp -d)"
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  mkdir -p "$runtime_dir"
  : > "$rootful_socket"
  output="$("$TARGET_SCRIPT" --mode auto --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket")"
  expected="unix://${rootful_socket}"
  rm -rf "$tmp"
  assert_eq "$expected" "$output" "auto mode should use rootful socket when rootless socket is absent"
}

test_auto_mode_prefers_rootless_socket_when_present() {
  local tmp runtime_dir rootful_socket rootless_socket output expected
  tmp="$(mktemp -d)"
  runtime_dir="${tmp}/runtime"
  rootful_socket="${tmp}/rootful.sock"
  rootless_socket="${runtime_dir}/docker.sock"
  mkdir -p "$runtime_dir"
  : > "$rootful_socket"
  : > "$rootless_socket"
  output="$("$TARGET_SCRIPT" --mode auto --runtime-dir "$runtime_dir" --rootful-socket "$rootful_socket")"
  expected="unix://${rootless_socket}"
  rm -rf "$tmp"
  assert_eq "$expected" "$output" "auto mode should prefer rootless socket when present"
}

test_emit_export_format() {
  local tmp runtime_dir output expected
  tmp="$(mktemp -d)"
  runtime_dir="${tmp}/runtime"
  mkdir -p "$runtime_dir"
  output="$("$TARGET_SCRIPT" --mode rootful --runtime-dir "$runtime_dir" --rootful-socket "${tmp}/rootful.sock" --emit-export)"
  expected="export DOCKER_HOST=unix://${tmp}/rootful.sock"
  rm -rf "$tmp"
  assert_eq "$expected" "$output" "emit-export should print shell export statement"
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

  echo "=========================================="
  echo "Test Results"
  echo "=========================================="
  echo "Total Tests:  $TOTAL"
  echo "Passed:       $PASSED"
  echo "Failed:       $FAILED"
  echo ""

  if [[ $FAILED -eq 0 ]]; then
    echo "✓ ALL TESTS PASSED"
    exit 0
  fi
  echo "✗ SOME TESTS FAILED"
  exit 1
}

main "$@"

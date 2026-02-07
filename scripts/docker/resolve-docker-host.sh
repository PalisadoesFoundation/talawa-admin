#!/usr/bin/env bash
set -euo pipefail

MODE="auto"
RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/${UID}}"
ROOTFUL_SOCKET="/var/run/docker.sock"
EMIT_EXPORT="false"
WARN_DOCKER_GROUP="false"

usage() {
  cat <<'EOF'
Usage: resolve-docker-host.sh [options]

Options:
  --mode <auto|rootless|rootful>  Docker host resolution mode (default: auto)
  --runtime-dir <path>            Runtime dir used for rootless socket
  --rootful-socket <path>         Rootful socket path (default: /var/run/docker.sock)
  --emit-export                   Print `export DOCKER_HOST=...` instead of raw value
  --warn-if-docker-group          Emit warning when running rootless while in docker group
  --help                          Show this message
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --runtime-dir)
      RUNTIME_DIR="${2:-}"
      shift 2
      ;;
    --rootful-socket)
      ROOTFUL_SOCKET="${2:-}"
      shift 2
      ;;
    --emit-export)
      EMIT_EXPORT="true"
      shift
      ;;
    --warn-if-docker-group)
      WARN_DOCKER_GROUP="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "auto" && "$MODE" != "rootless" && "$MODE" != "rootful" ]]; then
  echo "Invalid mode: $MODE" >&2
  exit 1
fi

rootless_socket="${RUNTIME_DIR%/}/docker.sock"

if [[ "$MODE" == "rootless" ]]; then
  resolved="unix://${rootless_socket}"
elif [[ "$MODE" == "rootful" ]]; then
  resolved="unix://${ROOTFUL_SOCKET}"
else
  if [[ -S "$rootless_socket" || -e "$rootless_socket" ]]; then
    resolved="unix://${rootless_socket}"
  else
    resolved="unix://${ROOTFUL_SOCKET}"
  fi
fi

if [[ "$WARN_DOCKER_GROUP" == "true" && "$resolved" == "unix://${rootless_socket}" ]]; then
  if id -nG | tr ' ' '\n' | grep -qx docker; then
    echo "Warning: current user is in docker group while rootless mode is selected." >&2
  fi
fi

if [[ "$EMIT_EXPORT" == "true" ]]; then
  printf 'export DOCKER_HOST=%q\n' "$resolved"
else
  printf '%s\n' "$resolved"
fi

#!/usr/bin/env bash
#
# =============================================================================
# Pre-Commit Python Checks
# =============================================================================
#
# Initializes a Python virtual environment and runs all Python-based
# validation and policy checks used by CI.
#
# Checks include:
# - Formatting and linting (black, flake8, pydocstyle)
# - Documentation and translation validation
# - File complexity limits
# - Security checks via external, checksum-verified scripts
# - CSS policy checks on staged files
#
# External Script Caching:
# - Centralized scripts are downloaded from PalisadoesFoundation/.github
# - Cached locally to reduce network dependency
# - SHA256 verification ensures script integrity
#
# Design Notes:
# - Supports Windows via cmd.exe execution
# - Uses null-delimited file lists for safety
# - Falls back gracefully when no staged files are present
#
# =============================================================================
set -euo pipefail

. "$(git rev-parse --show-toplevel)/.husky/scripts/staged-files.sh"

cleanup() {
  [ -n "${CSS_TMP:-}" ] && rm -f "$CSS_TMP"
  cleanup_staged_cache 2>/dev/null || true
}

trap cleanup EXIT

# =============================================================================
# Configuration constants
# =============================================================================

# Maximum allowed lines per file before triggering complexity warnings.
# This helps prevent large, hard-to-maintain files from being committed.
MAX_FILE_LINES=600

# Cache duration (in hours) for externally downloaded scripts.
# Reduces network dependency while ensuring periodic updates.
SCRIPT_CACHE_HOURS=24

STAGED_SRC_FILE="${1:-}"
if [ -z "$STAGED_SRC_FILE" ]; then
  echo "Error: staged file list path is required." >&2
  exit 1
fi

echo "Initializing Python virtual environment..."
VENV_BIN=$(./.husky/scripts/venv.sh) || exit 1

if command -v cmd.exe >/dev/null 2>&1; then
  set -- cmd.exe //c "$VENV_BIN"
else
  set -- "$VENV_BIN"
fi

echo "Running Python formatting and lint checks..."

"$@" -m black --check .github
"$@" -m pydocstyle .github
"$@" -m flake8 .github

echo "Running Python CI parity checks..."

"$@" .github/workflows/scripts/check_docstrings.py --directories .github
"$@" .github/workflows/scripts/compare_translations.py --directory public/locales
"$@" .github/workflows/scripts/countline.py \
  --lines "$MAX_FILE_LINES" \
  --files ./.github/workflows/config/countline_excluded_file_list.txt

if [ ! -s "$STAGED_SRC_FILE" ]; then
  echo "No staged source files detected. Skipping file-based Python checks."
  exit 0
fi


echo "Running translation checks on staged files..."
xargs -0 "$@" .github/workflows/scripts/translation_check.py --files < "$STAGED_SRC_FILE"

echo "Running disable statements check..."

SCRIPT_URL="https://raw.githubusercontent.com/PalisadoesFoundation/.github/main/.github/workflows/scripts/disable_statements_check.py"
SCRIPT_DIR=".github-central/.github/workflows/scripts"
SCRIPT_PATH="$SCRIPT_DIR/disable_statements_check.py"
CACHE_MAX_AGE_HOURS="$SCRIPT_CACHE_HOURS"

# NOTE:
# The SHA256 checksum below is intentional and acts as a security guard.
# This script is downloaded from an external repository and must be verified
# before execution to prevent running unreviewed or tampered code.
#
# If the upstream script changes, this checksum WILL change and the hook will fail.
# This is expected behavior and forces a conscious review of upstream changes.
# After verifying the update is safe, regenerate and update the checksum here.
EXPECTED_SHA="0b4184cffc6dba3607798cd54e57e99944c36cc01775cfcad68b95b713196e08"

mkdir -p "$SCRIPT_DIR"

NEEDS_DOWNLOAD=true

FILE_MOD_TIME=""

if [ -f "$SCRIPT_PATH" ]; then
 OS_TYPE=$(uname -s)

  case "$OS_TYPE" in
    Darwin*)
      # macOS
      FILE_MOD_TIME=$(stat -f %m "$SCRIPT_PATH" 2>/dev/null || true)
      ;;
    Linux*)
      # Linux
      FILE_MOD_TIME=$(stat -c %Y "$SCRIPT_PATH" 2>/dev/null || true)
      ;;
    MINGW*|MSYS*|CYGWIN*)
      # Windows (Git Bash)
      if command -v powershell.exe >/dev/null 2>&1; then
        FILE_MOD_TIME=$(powershell.exe -NoProfile -Command \
          "(Get-Item \"${SCRIPT_PATH}\").LastWriteTime.ToUnixTimeSeconds()" \
          2>/dev/null || true)
      fi
      ;;
    *)
      echo "Unsupported OS detected: $OS_TYPE : disabling script cache"
      FILE_MOD_TIME=""
      ;;
  esac

  if [ -n "$FILE_MOD_TIME" ]; then
    CURRENT_TIME=$(date +%s 2>/dev/null || python3 -c "import time; print(int(time.time()))" 2>/dev/null || python -c "import time; print(int(time.time()))")
    AGE_HOURS=$(( (CURRENT_TIME - FILE_MOD_TIME) / 3600 ))

    if [ "$AGE_HOURS" -lt "$CACHE_MAX_AGE_HOURS" ]; then
      NEEDS_DOWNLOAD=false
    fi
  else
    echo "Warning: Unable to determine cache age; forcing re-download"
    NEEDS_DOWNLOAD=true
  fi
fi


if [ "$NEEDS_DOWNLOAD" = true ]; then
  echo "Downloading disable_statements_check.py..."

  TEMP_FILE=$(mktemp)

  if command -v curl >/dev/null 2>&1; then
    curl -sSfL "$SCRIPT_URL" -o "$TEMP_FILE"
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$TEMP_FILE" "$SCRIPT_URL"
  else
    echo "Error: Neither curl nor wget is installed."
    exit 1
  fi

  if command -v shasum >/dev/null 2>&1; then
    ACTUAL_SHA=$(shasum -a 256 "$TEMP_FILE" | awk '{print $1}')
  elif command -v sha256sum >/dev/null 2>&1; then
    ACTUAL_SHA=$(sha256sum "$TEMP_FILE" | awk '{print $1}')
  else
    echo "Error: No SHA256 checksum tool available."
    exit 1
  fi

  if [ "$ACTUAL_SHA" != "$EXPECTED_SHA" ]; then
    echo "Security error: SHA256 checksum mismatch."
    echo "Expected: $EXPECTED_SHA"
    echo "Actual:   $ACTUAL_SHA"
    rm -f "$TEMP_FILE"
    exit 1
  fi

  mv "$TEMP_FILE" "$SCRIPT_PATH"
  chmod +x "$SCRIPT_PATH"
fi

xargs -0 "$@" "$SCRIPT_PATH" --files < "$STAGED_SRC_FILE"


echo "Running CSS policy checks..."

# CSS Policy Check
# Exclude src/utils/ (utility/helper functions) and src/types/ (type definitions)
# as they cannot contain UI styling code
CSS_TMP=$(mktemp)

get_staged_files '' '^src/utils/|^src/types/' > "$CSS_TMP"

if [ -s "$CSS_TMP" ]; then
  xargs -0 "$@" \
    .github/workflows/scripts/css_check.py --files < "$CSS_TMP"
fi

echo "Python checks completed."

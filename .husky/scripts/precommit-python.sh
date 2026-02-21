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
# - Centralized policy checks via auto-fetched scripts
# - CSS policy checks on staged files
#
# External Script Handling:
# - Scripts downloaded from PalisadoesFoundation/.github
# - Cached locally (24h) to reduce network dependency
# - Format/syntax validation (shebang, Python syntax, file size)
# - Falls back to cached version on download/validation failure
#
# Design Notes:
# - Supports Windows via cmd.exe execution
# - Uses null-delimited file lists for safety
# - Zero manual maintenance required
#
# =============================================================================
set -euo pipefail

. "$(git rev-parse --show-toplevel)/.husky/scripts/staged-files.sh"

cleanup() {
  [ -n "${CSS_TMP:-}" ] && rm -f "$CSS_TMP"
  [ -n "${FETCH_TMP:-}" ] && rm -f "$FETCH_TMP"
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
REPO_OWNER="PalisadoesFoundation"
REPO_NAME=".github"
CENTRAL_SCRIPTS_DIR=".github-central/.github/workflows/scripts"

if [ -z "$STAGED_SRC_FILE" ]; then
  echo "Error: staged file list path is required." >&2
  exit 1
fi

# =============================================================================
# Auto-fetch external scripts with validation
# =============================================================================

fetch_and_validate() {
  local script_name="$1"
  local python_bin="$2"
  local dest="$CENTRAL_SCRIPTS_DIR/$script_name"
  local url="https://raw.githubusercontent.com/$REPO_OWNER/$REPO_NAME/main/.github/workflows/scripts/$script_name"
  local cache_mins=$((SCRIPT_CACHE_HOURS * 60))
  local file_size
  
  mkdir -p "$(dirname "$dest")"
  
  # Use cached version if fresh
  if [ -f "$dest" ] && find "$dest" -mmin -$cache_mins 2>/dev/null | grep -q .; then
    return 0
  fi
  
  echo "Fetching $script_name..."
  
  # Create unique temp file and register for cleanup
  FETCH_TMP=$(mktemp "${dest}.XXXXXX")
  
  # Download with timeout and retry
  if ! curl -fsSL --max-time 30 --retry 2 "$url" -o "$FETCH_TMP" 2>/dev/null; then
    rm -f "$FETCH_TMP"
    FETCH_TMP=""
    if [ -f "$dest" ]; then
      echo "Warning: Download failed, using cached version of $script_name" >&2
      return 0
    fi
    echo "Error: Failed to download $script_name and no cache available" >&2
    return 1
  fi
  
  # Validate: must be Python file with valid shebang
  if ! head -n 1 "$FETCH_TMP" | grep -qE '^\s*#!.*\bpython([0-9.]+)?\b'; then
    echo "Warning: $script_name doesn't have a valid Python shebang, using cached version" >&2
    rm -f "$FETCH_TMP"
    FETCH_TMP=""
    [ -f "$dest" ] && return 0
    return 1
  fi
  
  # Validate: Python syntax must be correct
  if ! "$python_bin" -m py_compile "$FETCH_TMP" 2>/dev/null; then
    echo "Warning: $script_name has syntax errors, using cached version" >&2
    rm -f "$FETCH_TMP"
    FETCH_TMP=""
    [ -f "$dest" ] && return 0
    return 1
  fi
  
  # Validate: reject suspiciously small files (error pages)
  file_size=$(wc -c < "$FETCH_TMP" | tr -d ' ')
  if [ "$file_size" -lt 200 ]; then
    echo "Warning: $script_name too small ($file_size bytes), using cached version" >&2
    rm -f "$FETCH_TMP"
    FETCH_TMP=""
    [ -f "$dest" ] && return 0
    return 1
  fi
  
  # All validations passed
  mv "$FETCH_TMP" "$dest"
  FETCH_TMP=""
}

# =============================================================================
# Python environment setup
# =============================================================================

echo "Initializing Python virtual environment..."
VENV_BIN=$(./.husky/scripts/venv.sh) || exit 1

UNAME_OUT=$(uname -s 2>/dev/null || echo "")
if echo "$UNAME_OUT" | grep -qiE 'mingw|msys|cygwin'; then
  set -- cmd.exe //c "$VENV_BIN"
else
  set -- "$VENV_BIN"
fi

# Store the Python interpreter for validation functions
PYTHON_INTERPRETER="$1"

echo "Running Python formatting and lint checks..."

"$@" -m black --check .github
"$@" -m pydocstyle --convention=google --add-ignore=D415,D205 .github
"$@" -m flake8 --docstring-convention google --ignore E402,E722,E203,F401,W503 .github

echo "Running Python CI parity checks..."

"$@" .github/workflows/scripts/compare_translations.py --directory public/locales

if [ ! -s "$STAGED_SRC_FILE" ]; then
  echo "No staged source files detected. Skipping file-based Python checks."
  exit 0
fi

echo "Running translation checks on staged files..."
xargs -0 "$@" .github/workflows/scripts/translation_check.py --files < "$STAGED_SRC_FILE"

echo "Running centralized Python policy checks..."


echo "Running disable statements check..."
fetch_and_validate "disable_statements_check.py" "$PYTHON_INTERPRETER"
xargs -0 "$@" "$CENTRAL_SCRIPTS_DIR/disable_statements_check.py" --files < "$STAGED_SRC_FILE"

echo "Running docstring compliance check..."
fetch_and_validate "check_docstrings.py" "$PYTHON_INTERPRETER"
"$@" "$CENTRAL_SCRIPTS_DIR/check_docstrings.py" --directories .github

echo "Running line count enforcement check..."
fetch_and_validate "countline.py" "$PYTHON_INTERPRETER"
"$@" "$CENTRAL_SCRIPTS_DIR/countline.py" \
  --lines "$MAX_FILE_LINES" \
  --files ./.github/workflows/config/countline_excluded_file_list.txt



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

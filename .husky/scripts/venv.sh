#!/bin/sh
#
# Bootstrap script for Python virtual environment.
# Validates venv exists, locates the venv Python executable (cross-platform),
# installs dependencies from requirements.txt, and outputs the Python path.
# Used by pre-commit hooks to run Python-based CI checks locally.
#

set -eu

REPO_ROOT=$(git rev-parse --show-toplevel)

VENV_DIR="$REPO_ROOT/venv"

# Check if venv exists, if not create it
if [ ! -d "$VENV_DIR" ]; then
  echo "Virtual environment not found. Creating one..."
  if command -v python3 >/dev/null 2>&1; then
    python3 -m venv "$VENV_DIR" || {
      echo "Error: Failed to create virtual environment"
      exit 1
    }
  elif command -v python >/dev/null 2>&1; then
    python -m venv "$VENV_DIR" || {
      echo "Error: Failed to create virtual environment"
      exit 1
    }
  else
    echo "Error: Python not found"
    exit 1
  fi
fi

# Locate Python executable
if [ -x "$VENV_DIR/bin/python" ]; then
  VENV_PY="$VENV_DIR/bin/python"
elif [ -x "$VENV_DIR/Scripts/python.exe" ]; then
  VENV_PY="$VENV_DIR/Scripts/python.exe"
else
  echo "Error: Python executable not found in venv."
  echo "Checked: $VENV_DIR/bin/python and $VENV_DIR/Scripts/python.exe"
  exit 1
fi

LOCK_FILE=$(git rev-parse --git-path venv-setup.lock)
exec 9>"$LOCK_FILE"

if command -v flock >/dev/null 2>&1; then
  flock 9
else
  echo "Warning: flock not available, proceeding without lock" >&2
fi

# Check if requirements file exists
REQUIREMENTS_FILE="$REPO_ROOT/.github/workflows/requirements.txt"
if [ ! -f "$REQUIREMENTS_FILE" ]; then
  echo "Warning: Requirements file not found at $REQUIREMENTS_FILE"
  echo "Skipping dependency installation."
else
  # Install deps
  "$VENV_PY" -m pip install -q --disable-pip-version-check -r "$REQUIREMENTS_FILE" || {
    echo "Error: Failed to install Python dependencies"
    exit 1
  }
fi

if command -v cygpath >/dev/null 2>&1; then
  VENV_PY=$(cygpath -u "$VENV_PY")
fi

echo "$VENV_PY"
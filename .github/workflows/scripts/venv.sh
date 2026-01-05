#!/usr/bin/env sh
#
# Bootstrap script for Python virtual environment.
# Validates venv exists, locates the venv Python executable (cross-platform),
# installs dependencies from requirements.txt, and outputs the Python path.
# Used by pre-commit hooks to run Python-based CI checks locally.
#

set -eu

REPO_ROOT=$(git rev-parse --show-toplevel)

VENV_DIR="$REPO_ROOT/venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "Error: Virtual environment not found at $VENV_DIR"
    echo "Please create it manually with: python -m venv venv"
    exit 1
fi

if [ -x "$VENV_DIR/bin/python" ]; then
  VENV_PY="$VENV_DIR/bin/python"
elif [ -x "$VENV_DIR/Scripts/python.exe" ]; then
  VENV_PY="$VENV_DIR/Scripts/python.exe"
else
  echo "Error: Python executable not found in venv."
  echo "Checked: $VENV_DIR/bin/python and $VENV_DIR/Scripts/python.exe"
  exit 1
fi

# Install deps
"$VENV_PY" -m pip install -q --disable-pip-version-check -r "$REPO_ROOT/.github/workflows/requirements.txt"

echo "$VENV_PY"
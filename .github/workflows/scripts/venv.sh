#!/usr/bin/env sh

set -e

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
  exit 1
fi

# Install deps
if ! "$VENV_PY" -m pip check >/dev/null 2>&1; then
  "$VENV_PY" -m pip install -q --disable-pip-version-check -r "$REPO_ROOT/.github/workflows/requirements.txt"
fi

echo "$VENV_PY"
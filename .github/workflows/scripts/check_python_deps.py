#!/usr/bin/env python3
"""
Checks required Python dependencies for CI parity.

This script verifies that all Python dependencies listed in
`.github/workflows/requirements.txt` are installed in the
current Python environment. It exits with a non-zero status
if any dependency is missing.
"""

import sys
import importlib.util
from pathlib import Path


REQUIREMENTS_FILE = Path(".github/workflows/requirements.txt")


def get_missing_dependencies() -> list[str]:
    """Return a list of missing Python dependencies.
    
    Args:
        None

    Returns:
        list[str]: A list of missing dependency names.
    """
    missing: list[str] = []

    if not REQUIREMENTS_FILE.exists():
        return missing

    for line in REQUIREMENTS_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        package = line.split("==")[0].replace("-", "_")
        if importlib.util.find_spec(package) is None:
            missing.append(package)

    return missing


def main() -> None:
    """Run the Python dependency validation check.
    
    Exits with status code 1 if required dependencies are missing.

    Args:
        None

    Returns:
        None
    """
    missing = get_missing_dependencies()

    if missing:
        print("ERROR: Missing required Python dependencies:")
        for dep in missing:
            print(f"  - {dep}")
        print("\nInstall them using:")
        print(f"  pip install -r {REQUIREMENTS_FILE}")
        sys.exit(1)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Checks required Python dependencies for CI parity.

This script verifies that all Python dependencies listed in
`.github/workflows/requirements.txt` are installed in the
current Python environment. It exits with a non-zero status
if any dependency is missing.
"""

import sys
from pathlib import Path
from importlib.metadata import distributions
import re

REQUIREMENTS_FILE = Path(".github/workflows/requirements.txt")


def get_missing_dependencies() -> list[str]:
    """Return a list of missing Python dependencies.

    Args:
        None

    Returns:
        list[str]: A list of missing dependency names.
    """
    missing: list[str] = []
    installed_packages = {
        dist.metadata["Name"].lower() for dist in distributions()
    }

    if not REQUIREMENTS_FILE.exists():
        print(f"ERROR: Requirements file not found: {REQUIREMENTS_FILE}")
        sys.exit(1)

    for line in REQUIREMENTS_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        match = re.match(r"^([a-zA-Z0-9_-]+)", line)
        if not match:
            continue

        package = match.group(1).lower()
        if package.lower() not in installed_packages:
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

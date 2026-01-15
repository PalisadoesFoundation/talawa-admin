"""Check if sensitive files have been modified."""

import argparse
import os
import re
import sys
from typing import List


def load_patterns(config_file: str) -> List[str]:
    """Load regex patterns from a configuration file.

    Args:
        config_file: Path to the configuration file containing regex patterns.

    Returns:
        List[str]: A list of regex patterns.
    """
    if not os.path.exists(config_file):
        print(f"Error: Configuration file '{config_file}' not found.")
        sys.exit(1)

    with open(config_file, "r") as f:
        # Read lines, strip whitespace, and ignore empty lines or comments
        patterns = [
            line.strip()
            for line in f
            if line.strip() and not line.strip().startswith("#")
        ]
    return patterns


def check_files(
    files: List[str], directories: List[str], patterns: List[str]
) -> List[str]:
    """Check files against sensitive patterns.

    Args:
        files: List of file paths to check.
        directories: List of directories to walk and check files within.
        patterns: List of regex patterns to match against.

    Returns:
        List[str]: A list of files that match any of the sensitive patterns.
    """
    sensitive_files = []

    # Compile patterns for efficiency
    compiled_patterns = [re.compile(p) for p in patterns]

    # Process individual files
    for file_path in files:
        for pattern in compiled_patterns:
            if pattern.search(file_path):
                sensitive_files.append(file_path)
                break  # match found, move to next file

    # Process directories
    for directory in directories:
        for root, _, filenames in os.walk(directory):
            for filename in filenames:
                full_path = os.path.join(root, filename)
                # Normalize path separators to forward slashes for consistency
                full_path = full_path.replace(os.path.sep, "/")
                for pattern in compiled_patterns:
                    if pattern.search(full_path):
                        sensitive_files.append(full_path)
                        break

    return sorted(list(set(sensitive_files)))


def main():
    """Run the sensitive file check.

    Args:
        None

    Returns:
        None
    """
    parser = argparse.ArgumentParser(
        description="Check if sensitive files have been modified."
    )
    parser.add_argument(
        "--config",
        required=True,
        help="Path to the configuration file containing regex patterns.",
    )
    parser.add_argument(
        "--files",
        nargs="*",
        default=[],
        help="List of files to check.",
    )
    parser.add_argument(
        "--directories",
        nargs="*",
        default=[],
        help="List of directories to check.",
    )

    args = parser.parse_args()

    patterns = load_patterns(args.config)
    sensitive_files = check_files(args.files, args.directories, patterns)

    if sensitive_files:
        print("::error::Unauthorized changes detected in sensitive files:")
        print("")
        for file in sensitive_files:
            print(f"- {file}")
        print("")
        print("To override:")
        print("Add the 'ignore-sensitive-files-pr' label to this PR.")
        sys.exit(1)

    # No sensitive files found
    sys.exit(0)


if __name__ == "__main__":
    main()

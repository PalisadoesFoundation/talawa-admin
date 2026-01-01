#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Sensitive File Checker Script.

Methodology:
    Checks if any of the provided files match the sensitive file patterns
    defined in a configuration file.

    This script enforces security practices in the project by validating
    pull requests against a list of sensitive files.

Note:
    This script complies with our python3 coding and documentation standards.
    It complies with:

        1) Pylint
        2) Pydocstyle
        3) Flake8
        4) Python Black
        5) Python docstring_parser

"""
import argparse
import re
import sys


def load_patterns(config_path: str) -> list[re.Pattern]:
    """Load regex patterns from a configuration file.

    Args:
        config_path (str): Path to the configuration file.

    Returns:
        list: A list of compiled regex objects.

    Raises:
        FileNotFoundError: If the config file does not exist.
        re.error: If a regex pattern is invalid.
    """
    patterns = []
    try:
        with open(config_path, encoding="utf-8") as file:
            for line in file:
                pattern = line.strip()
                if pattern and not pattern.startswith("#"):
                    patterns.append(re.compile(pattern))
    except FileNotFoundError:
        print(f"Error: Configuration file not found at {config_path}")
        sys.exit(1)
    except re.error as e:
        print(f"Error: Invalid regex pattern in config file: {e}")
        sys.exit(1)
    if not patterns:
        print(f"Error: No valid patterns found in configuration file: {config_path}")
        sys.exit(1)
    return patterns


def check_files(files: list[str], patterns: list[re.Pattern]) -> list[str]:
    """Check if any file matches any of the sensitive patterns.

    Args:
        files (list): List of file paths to check.
        patterns (list): List of compiled regex objects.

    Returns:
        list: A list of matching sensitive files.
    """
    sensitive_files = []
    for file_path in files:
        for pattern in patterns:
            if pattern.search(file_path):
                sensitive_files.append(file_path)
                break
    return sensitive_files


def arg_parser_resolver() -> argparse.Namespace:
    """Resolve the CLI arguments provided by the user.

    Args: None

    Returns:
        result: Parsed argument object
    """
    parser = argparse.ArgumentParser(
        description="Check for sensitive file changes."
    )
    parser.add_argument(
        "--config",
        type=str,
        required=True,
        help="Path to the configuration file containing regex patterns.",
    )
    parser.add_argument(
        "--files",
        type=str,
        nargs="+",
        default=[],
        help="List of files to check.",
    )
    parser.add_argument(
        "--files-from",
        type=str,
        help=(
            "Path to a file containing a list of files to check "
            "(null-terminated or newline-separated)."
        ),
    )
    return parser.parse_args()


def main() -> None:
    """Execute the script's main functionality.

    Args:
        None

    Returns:
        None

    This function serves as the entry point for the script. It performs
    the following tasks:

    1. Parses command line arguments.
    2. Loads sensitive file patterns from the config file.
    3. Checks the provided files against the patterns.
    4. Exits with an error if sensitive files are found.
    """
    args = arg_parser_resolver()

    if args.files and args.files_from:
        print("Error: Arguments --files and --files-from are mutually exclusive.")
        sys.exit(1)

    files_to_check = []
    if args.files:
        # Flatten file list and handle newlines (fix for shell quoting)
        for item in args.files:
            files_to_check.extend(
                [f.strip() for f in item.split("\n") if f.strip()]
            )
    elif args.files_from:
        try:
            with open(args.files_from, "rb") as f:
                content = f.read()
                # Check if content has null bytes, implying null-terminated (-z)
                if b"\0" in content:
                    files_to_check = [
                        f.decode("utf-8", errors="surrogateescape")
                        for f in content.split(b"\0")
                        if f
                    ]
                else:
                    files_to_check = [
                        f.decode("utf-8", errors="surrogateescape").strip()
                        for f in content.split(b"\n")
                        if f.strip()
                    ]
        except FileNotFoundError:
            print(f"Error: File list file not found at {args.files_from}")
            sys.exit(1)
    else:
        print("No files provided to check.")
        sys.exit(0)

    patterns = load_patterns(args.config)
    sensitive_files = check_files(files_to_check, patterns)

    if sensitive_files:
        print("::error::Unauthorized changes detected in sensitive files:")
        print("")
        for file in sensitive_files:
            print(f"- {file}")
        print("")
        print("To override:")
        print("Add the 'ignore-sensitive-files-pr' label to this PR.")
        sys.exit(1)

    print("No sensitive files detected.")


if __name__ == "__main__":
    main()

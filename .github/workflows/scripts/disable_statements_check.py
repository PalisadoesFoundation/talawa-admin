#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Consolidated Disable Statements Checker Script.

Methodology:

    Recursively analyzes TypeScript files in the specified directories or
    checks specific files to ensure they do not contain disable statements
    for eslint, code coverage, or test skipping.

    This script enforces proper code quality practices in the project.

Note:
    This script complies with our python3 coding and documentation standards.
    It complies with:

        1) Pylint
        2) Pydocstyle
        3) Pycodestyle
        4) Flake8
        5) Python Black

"""

import argparse
import inspect
import os
import re
import sys


class DisableStatementsChecker:
    """Check for disable statements in TypeScript files."""

    def __init__(self):
        """Initialize checker with violations tracking."""
        self.violations_found = False

    def check_eslint_disable(self, file_path):
        """Check for eslint-disable statements.

        Args:
            file_path (str): Path to the TypeScript file to check.
        """
        pattern = re.compile(
            r"\/\/.*eslint-disable.*|\/\*[\s\S]*?eslint-disable[\s\S]*?\*\/",
            re.IGNORECASE | re.DOTALL,
        )
        self._check_pattern(file_path, pattern, "eslint-disable")

    def check_istanbul_ignore(self, file_path):
        """Check for istanbul ignore statements.

        Args:
            file_path (str): Path to the TypeScript file to check.
        """
        pattern = re.compile(
            r"/\*\s*istanbul\s+ignore"
            r".*?\*/|//?\s*istanbul\s+ignore(?:\s+(?:next|-line))?[^\n]*",
            re.IGNORECASE,
        )
        self._check_pattern(file_path, pattern, "istanbul-ignore")

    def check_it_skip(self, file_path):
        """Check for it.skip statements.

        Args:
            file_path (str): Path to the TypeScript file to check.
        """
        pattern = re.compile(r"\bit\.skip\s*\(", re.IGNORECASE)
        self._check_pattern(file_path, pattern, "it.skip")

    def _check_pattern(self, file_path, pattern, disable_type) -> None:
        """Check file for pattern and report violations.

        Args:
            file_path (str): Path to the file to check.
            pattern (re.Pattern): Compiled regex pattern to search for.
            disable_type (str): Type of disable statement being checked.
        """
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()

            for match in pattern.finditer(content):
                line_num = content.count("\n", 0, match.start()) + 1
                print(
                    f"Error: File {file_path} contains {disable_type} "
                    f"statement at line {line_num}."
                )
                self.violations_found = True
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        except PermissionError:
            print(f"Permission denied: {file_path}")
        except (IOError, OSError) as e:
            print(f"Error reading file {file_path}: {e}")

    def check_files_or_directories(self, files_or_dirs) -> None:
        """Check files or directories for disable statements.

        Args:
            files_or_dirs (list): List of files or directories to check.
        """
        for item in files_or_dirs:
            if os.path.isdir(item):
                for root, _, files in os.walk(item):
                    if "node_modules" in root:
                        continue
                    for file_name in files:
                        if self._is_typescript_file(file_name):
                            file_path = os.path.join(root, file_name)
                            self._run_all_checks(file_path)
            elif os.path.isfile(item) and self._is_typescript_file(item):
                self._run_all_checks(item)

    def _is_typescript_file(self, filename) -> bool:
        """Check if file is a TypeScript file (excluding test files).

        Args:
            filename (str): Name of the file to check.

        Returns:
            bool: True if it's a TypeScript file, False otherwise.
        """
        return (
            filename.endswith((".ts", ".tsx"))
            and not filename.endswith((
                ".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx"
            ))
        )

    def _run_all_checks(self, file_path) -> None:
        """Automatically run all check methods on a file.

        Args:
            file_path (str): Path to the file to check.
        """
        for name, method in inspect.getmembers(self, predicate=inspect.ismethod):
            if name.startswith("check_") and not name.startswith("check_files"):
                method(file_path)


def arg_parser_resolver() -> argparse.Namespace:
    """Resolve the CLI arguments provided by the user.

    Returns:
        argparse.Namespace: Parsed argument object.
    """
    parser = argparse.ArgumentParser(
        description="Check TypeScript files for disable statements."
    )
    parser.add_argument(
        "--files",
        type=str,
        nargs="+",
        default=[],
        help="List of files to check for disable statements.",
    )
    parser.add_argument(
        "--directory",
        type=str,
        nargs="+",
        default=[os.getcwd()],
        help="One or more directories to check for disable statements.",
    )
    return parser.parse_args()


def main() -> None:
    """Execute the script's main functionality.

    This function serves as the entry point for the script. It performs
    the following tasks:
    1. Validates and retrieves the files or directories to check from
       command line arguments.
    2. Checks files or directories for disable statements.
    3. Provides informative messages based on the analysis.
    4. Exits with an error if disable statements are found.

    Raises:
        SystemExit: If disable statements are found during execution.
    """
    args = arg_parser_resolver()
    files_or_dirs = args.files if args.files else args.directory

    checker = DisableStatementsChecker()
    checker.check_files_or_directories(files_or_dirs)

    if checker.violations_found:
        print("Disable statements check failed. Exiting with error.")
        sys.exit(1)

    print("Disable statements check completed successfully.")


if __name__ == "__main__":
    main()

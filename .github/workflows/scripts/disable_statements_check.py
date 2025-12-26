#!/usr/bin/env python3
"""Consolidated script to check for disable statements in code files.

This script checks for:
- eslint-disable comments
- istanbul ignore comments
- it.skip statements in test files

Usage:
    python disable_statements_check.py --files file1.js file2.ts
    python disable_statements_check.py --directory src/
"""

import argparse
import inspect
import re
import sys
from pathlib import Path


class DisableStatementsChecker:
    """Checker for various disable statements in code files."""

    def check_eslint_disable(self, content: str, file_path: str) -> list[str]:
        """Check for eslint-disable comments.

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        pattern = re.compile(r"//\s*eslint-disable", re.IGNORECASE)

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found eslint-disable comment"
            )

        return violations

    def check_istanbul_ignore(self, content: str, file_path: str) -> list[str]:
        """Check for istanbul ignore comments.

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        pattern = re.compile(
            r"/\*\s*istanbul\s+ignore\s+\w+\s*\*/", re.IGNORECASE | re.DOTALL
        )

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found istanbul ignore comment"
            )

        return violations

    def check_it_skip(self, content: str, file_path: str) -> list[str]:
        """Check for it.skip statements in test files.

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        pattern = re.compile(r"\bit\.skip\s*\(", re.IGNORECASE)

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found it.skip statement"
            )

        return violations

    def check_file(self, file_path: str) -> list[str]:
        """Check a single file for disable statements.

        Args:
            file_path: Path to the file to check.

        Returns:
            violations: List of violation messages.
        """
        # Skip checking the test file to avoid self-referential issues
        if file_path.endswith("test_disable_statements_check.py"):
            return []

        try:
            with open(file_path, encoding="utf-8") as f:
                content = f.read()
        except (OSError, UnicodeDecodeError) as e:
            return [f"{file_path}: Error reading file - {e}"]

        violations = []

        # Auto-discover check methods
        for name, method in inspect.getmembers(
            self, predicate=inspect.ismethod
        ):
            if name.startswith("check_") and name not in (
                "check_file",
                "check_files",
                "check_directory",
            ):
                violations.extend(method(content, file_path))

        return violations

    def check_files(self, file_paths: list[str]) -> list[str]:
        """Check multiple files for disable statements.

        Args:
            file_paths: List of file paths to check.

        Returns:
            all_violations: List of violation messages from all files.
        """
        all_violations = []
        for file_path in file_paths:
            violations = self.check_file(file_path)
            all_violations.extend(violations)
        return all_violations

    def check_directory(self, directory: str) -> list[str]:
        """Check all relevant files in a directory.

        Args:
            directory: Directory path to check recursively.

        Returns:
            violations: List of violation messages from all files in directory.
        """
        extensions = {".js", ".jsx", ".ts", ".tsx"}
        file_paths = []

        for ext in extensions:
            file_paths.extend(Path(directory).rglob(f"*{ext}"))

        return self.check_files([str(p) for p in file_paths])


def main() -> None:
    """Execute the main functionality of the disable statements checker.

    Args:
        None

    Returns:
        None
    """
    parser = argparse.ArgumentParser(
        description="Check for disable statements in code files"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--files", nargs="+", help="Files to check")
    group.add_argument("--directory", help="Directory to check recursively")

    args = parser.parse_args()

    checker = DisableStatementsChecker()

    if args.files:
        violations = checker.check_files(args.files)
    else:
        violations = checker.check_directory(args.directory)

    if violations:
        for violation in violations:
            print(violation)
        sys.exit(1)
    else:
        print("No disable statements found.")


if __name__ == "__main__":
    main()

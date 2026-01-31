#!/usr/bin/env python3
"""Consolidated script to check for disable statements in code files.

This script checks for:
- eslint-disable comments
- biome-ignore comments
- @ts-ignore comments
- check-sanitization-disable comments
- istanbul ignore comments
- it.skip statements in test files

The script automatically detects which patterns exist in your files.
No repository-type specification is needed - patterns are naturally specific.

Usage:
    python disable_statements_check.py --files file1.js file2.ts
    python disable_statements_check.py --directory src/

    # --repo parameter is deprecated but still accepted for backward compatibility
    python disable_statements_check.py --repo=api --files file1.js file2.ts
"""

import argparse
import inspect
import os
import re
import sys
from pathlib import Path


class DisableStatementsChecker:
    """Checker for various disable statements in code files."""

    def check_eslint_disable(self, content: str, file_path: str) -> list[str]:
        """Check for eslint-disable comments (Admin-specific).

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

    def check_biome_disable(self, content: str, file_path: str) -> list[str]:
        """Check for biome-ignore comments (API-specific).

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        pattern = re.compile(
            r"//\s*biome-ignore.*$", re.IGNORECASE | re.MULTILINE
        )

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found biome-ignore comment. "
                "Please remove and ensure code adheres to Biome rules."
            )

        return violations

    def check_ts_ignore(self, content: str, file_path: str) -> list[str]:
        """Check for @ts-ignore comments (API-specific).

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        pattern = re.compile(r"(?://|/\*)\s*@ts-ignore(?:\s+|$)")

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found @ts-ignore comment"
            )

        return violations

    def check_sanitization_disable(
        self, content: str, file_path: str
    ) -> list[str]:
        """Check for check-sanitization-disable comments (API-specific).

        IMPORTANT: Only lowercase form accepted, requires justification.

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        # Case-sensitive pattern to enforce canonical lowercase form
        pattern = re.compile(
            r"//\s*check-sanitization-disable(?:\s*:\s*(.*))?$",
            re.MULTILINE,
        )

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            justification = match.group(1)

            if not justification or not justification.strip():
                violations.append(
                    f"{file_path}:{line_num}: Sanitization disable comment "
                    "missing justification. Format: "
                    "// check-sanitization-disable: <reason>"
                )
            elif len(justification.strip()) < 10:
                violations.append(
                    f"{file_path}:{line_num}: Justification too short "
                    f"({len(justification.strip())} chars). "
                    "Minimum 10 characters required."
                )

        return violations

    def check_istanbul_ignore(self, content: str, file_path: str) -> list[str]:
        """Check for istanbul ignore comments (shared between API and Admin).

        Args:
            content: File content to check.
            file_path: Path to the file being checked.

        Returns:
            violations: List of violation messages.
        """
        violations = []
        # Match both // and /* */ variants to support API patterns
        pattern = re.compile(
            r"//\s*istanbul\s+ignore(?:\s+(?:next|-line))?[^\n]*|"
            r"/\*\s*istanbul\s+ignore\s+(?:next|-line)\s*\*/",
            re.IGNORECASE,
        )

        for match in pattern.finditer(content):
            line_num = content[: match.start()].count("\n") + 1
            violations.append(
                f"{file_path}:{line_num}: Found istanbul ignore comment. "
                "Please add appropriate tests."
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
        pattern = re.compile(r"\bit\.skip\s*\(")

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
        # Skip checking this script itself and Python test files
        basename = os.path.basename(file_path)
        if basename == "disable_statements_check.py" or file_path.endswith(
            ".py"
        ):
            return []

        # Check if it's a test file
        is_test_file = file_path.endswith(
            (".test.ts", ".spec.ts", ".test.tsx", ".spec.tsx")
        )

        try:
            with open(file_path, encoding="utf-8") as f:
                content = f.read()
        except (OSError, UnicodeDecodeError) as e:
            return [f"{file_path}: Error reading file - {e}"]

        violations = []

        # Auto-discover and run all check methods
        # Patterns are naturally specific - they only match in files where they exist
        for name, method in inspect.getmembers(
            self, predicate=inspect.ismethod
        ):
            if name.startswith("check_") and name not in (
                "check_file",
                "check_files",
                "check_directory",
            ):
                # Skip coverage checks for test files
                if is_test_file and name == "check_istanbul_ignore":
                    continue

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

    parser.add_argument(
        "--repo",
        choices=["api", "admin"],
        default=None,
        help="[DEPRECATED] Repository type (no longer needed - kept for backward compatibility)",
    )

    args = parser.parse_args()

    # Show deprecation warning if --repo is used
    if args.repo is not None:
        print(
            "Warning: --repo parameter is deprecated and no longer needed.\n"
            "The script now automatically runs all checks.\n"
            "Patterns are naturally specific to their respective codebases.\n",
            file=sys.stderr,
        )

    checker = DisableStatementsChecker()

    # Note: repo parameter is ignored (kept for backward compatibility)
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

#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Check TypeScript files for CSS violations and embedded CSS."""
import argparse
import os
import re
import sys
from collections import namedtuple

# Define namedtuples for storing results
Violation = namedtuple("Violation", ["file_path", "css_file", "reason"])
CorrectImport = namedtuple("CorrectImport", ["file_path", "css_file"])
EmbeddedViolation = namedtuple("EmbeddedViolation", ["file_path", "css_codes"])
CSSCheckResult = namedtuple(
    "CSSCheckResult", ["violations", "correct_imports", "embedded_violations"]
)


def check_embedded_css(content: str) -> list:
    """Check for embedded CSS in the content.

    Args:
        content: The content of the file to check.

    Returns:
        list: A list of embedded CSS violations found.
    """
    color_code_pattern = r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b"
    violations = []

    for line_number, line in enumerate(content.splitlines(), start=1):
        matches = re.findall(color_code_pattern, line)
        for match in matches:
            violations.append((line_number, match))

    return violations


def process_typescript_file(
    file_path,
    directory,
    allowed_css_patterns,
    violations,
    correct_css_imports,
    embedded_css_violations,
):
    """Process a TypeScript file for CSS violations and correct CSS imports.

    Args:
        file_path: Path to the TypeScript file to process.
        directory: Base directory being scanned.
        allowed_css_patterns: List of allowed CSS file patterns.
        violations: List to store CSS violations.
        correct_css_imports: List to store correct CSS imports.
        embedded_css_violations: List to store embedded CSS violations.

    Returns:
        None: This function modifies provided lists & does not return any value.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except (IOError, UnicodeDecodeError) as e:
        print(f"Error reading file {file_path}: {e}")
        return

    # Check for CSS imports with an improved regex pattern
    css_imports = re.findall(r'import\s+.*?["\'](.+?\.css)["\']', content)
    found_correct_import = False
    for css_file in css_imports:
        base_path = os.path.dirname(file_path)
        css_file_path = os.path.normpath(os.path.join(base_path, css_file))
        if not os.path.exists(css_file_path):
            src_dir = os.path.abspath(directory)
            css_file_path = os.path.join(src_dir, css_file)

        if not os.path.exists(css_file_path):
            violations.append(Violation(file_path, css_file, "File not found"))
        elif any(
            css_file.endswith(pattern) for pattern in allowed_css_patterns
        ):
            correct_css_imports.append(CorrectImport(file_path, css_file))
            found_correct_import = True
        else:
            violations.append(Violation(file_path, css_file, "Invalid import"))

    # Fail if no correct import of app.module.css is found
    if not found_correct_import:
        violations.append(
            Violation(file_path, "app.module.css", "Missing required import")
        )

    # Check for embedded CSS
    embedded_css = check_embedded_css(content)
    if embedded_css:
        embedded_css_violations.append(
            EmbeddedViolation(file_path, embedded_css)
        )


def check_files(
    directories: list,
    files: list,
    exclude_files: list,
    exclude_directories: list,
    allowed_css_patterns: list,
) -> CSSCheckResult:
    """Scan directories and specific files for TS files and their violations.

    This function checks TypeScript files in given directories for violations.

    Args:
        directories: List of directories to scan for TypeScript files.
        files: List of specific files to check.
        exclude_files: List of file paths to exclude from the scan.
        exclude_directories: List of directories to exclude from the scan.
        allowed_css_patterns: List of allowed CSS patterns for validation.

    Returns:
        CSSCheckResult: A result object containing:
            - violations: List of CSS violations found.
            - correct_css_imports: List of correct CSS imports.
            - embedded_css_violations: List of embedded CSS violations.
    """
    violations = []
    correct_css_imports = []
    embedded_css_violations = []

    exclude_files = set(os.path.abspath(file) for file in exclude_files)
    exclude_directories = set(
        os.path.abspath(dir) for dir in exclude_directories
    )

    for directory in directories:
        directory = os.path.abspath(directory)

        for root, _, files_in_dir in os.walk(directory):
            if any(
                root.startswith(exclude_dir)
                for exclude_dir in exclude_directories
            ):
                continue

            for file in files_in_dir:
                file_path = os.path.abspath(os.path.join(root, file))
                if file_path in exclude_files:
                    continue

                if file.endswith((".ts", ".tsx")) and not any(
                    pattern in root
                    for pattern in [
                        "__tests__",
                        ".test.",
                        ".spec.",
                        "test/",
                        "tests/",
                    ]
                ):
                    process_typescript_file(
                        file_path,
                        directory,
                        allowed_css_patterns,
                        violations,
                        correct_css_imports,
                        embedded_css_violations,
                    )

                # Fail if CSS file exists in the same directory
                if file.endswith(".css") and root == os.path.dirname(
                    file_path
                ):
                    violations.append(
                        Violation(
                            file_path, file, "CSS file in same directory"
                        )
                    )

    # Process individual files explicitly listed
    for file_path in files:
        file_path = os.path.abspath(file_path)
        if file_path not in exclude_files and file_path.endswith(
            (".ts", ".tsx")
        ):
            process_typescript_file(
                file_path,
                os.path.dirname(file_path),
                allowed_css_patterns,
                violations,
                correct_css_imports,
                embedded_css_violations,
            )

    return CSSCheckResult(
        violations, correct_css_imports, embedded_css_violations
    )


def validate_directories_input(input_directories):
    """Validate that the --directories input is correctly formatted.

    Args:
        input_directories: A list of file or directory paths to validate.

    Returns:
        validated_dirs: A list containing validated directory paths.
        If the input is a file, its parent directory is added to the list.

    Raises:
        ValueError: If a path is neither a valid file nor a directory.
    """
    validated_dirs = []
    for path in input_directories:
        if os.path.isdir(path):
            validated_dirs.append(path)
        elif os.path.isfile(path):
            validated_dirs.append(os.path.dirname(path))
        else:
            raise ValueError(
                f"Invalid path: {path}. Must be an existing file or directory."
            )
    return validated_dirs


def main():
    """Main function to run the CSS check.

    This function serves as the entry point to run the CSS check. It processes
    directories and files, checks for CSS violations, and prints the results.

    Args:
        None

    Returns:
        None: This function does not return any value. It prints the results
        and exits with a code indicating success (0) or failure (1).
    """
    parser = argparse.ArgumentParser(
        description="Check for CSS violations in TypeScript files."
    )
    parser.add_argument(
        "--directories",
        nargs="+",
        required=False,
        help="List of directories to check for CSS violations.",
    )
    parser.add_argument(
        "--files",
        nargs="*",
        default=[],
        help="Specific files to check for CSS violations.",
    )
    parser.add_argument(
        "--exclude_files",
        nargs="*",
        default=[],
        help="Specific files to exclude from analysis.",
    )
    parser.add_argument(
        "--exclude_directories",
        nargs="*",
        default=[],
        help="Directories to exclude from analysis.",
    )
    parser.add_argument(
        "--allowed_css_patterns",
        nargs="*",
        default=["app.module.css"],
        help="Allowed CSS file patterns.",
    )
    parser.add_argument(
        "--show_success",
        action="store_true",
        help="Show successful CSS imports.",
    )
    args = parser.parse_args()

    if not args.directories and not args.files:
        parser.error(
            "At least one of --directories or --files must be provided."
        )

    try:
        directories = (
            validate_directories_input(args.directories)
            if args.directories
            else []
        )
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

    result = check_files(
        directories=directories,
        files=args.files,
        exclude_files=args.exclude_files,
        exclude_directories=args.exclude_directories,
        allowed_css_patterns=args.allowed_css_patterns,
    )

    output = []
    exit_code = 0
    if result.violations:
        output.append("CSS Import Violations:")
        for violation in result.violations:
            output.append(
                f"- {violation.file_path}: "
                f"{violation.css_file} ({violation.reason})"
            )
        exit_code = 1

    if result.embedded_violations:
        output.append("\nEmbedded CSS Violations:")
        for violation in result.embedded_violations:
            for css_code in violation.css_codes:
                output.append(
                    f"- {violation.file_path}: "
                    f"has embedded color code `{css_code}`. use CSS variable "
                    f"in src/style/app.module.css."
                )
        exit_code = 1

    if output:
        print("\n".join(output))
        print(
            "Please address the above CSS violations:\n"
            "1. For invalid CSS imports,\n"
            "   ensure you're using the correct import syntax and file paths.\n"
            "2. For embedded CSS,\n"
            "   move the CSS to appropriate stylesheet\n"
            "   files and import them correctly.\n"
            "3. Make sure to use only the allowed CSS patterns\n"
            "   as specified in the script arguments.\n"
            "4. Check that all imported CSS files\n"
            "   exist in the specified locations.\n"
            "5. Ensure each TypeScript file has exactly\n"
            "   one import of the allowed CSS file.\n"
            "6. Remove any CSS files from the same\n"
            "   directory as TypeScript files."
        )

    if args.show_success and result.correct_imports:
        print("\nCorrect CSS Imports:")
        for import_ in result.correct_imports:
            print(f"- {import_.file_path}: {import_.css_file}")

    sys.exit(exit_code)


if __name__ == "__main__":
    main()

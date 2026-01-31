#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Check TypeScript files for CSS violations and embedded CSS."""

import argparse
import os
import re
import sys
from collections import namedtuple

# Define namedtuple for storing detailed violations
DetailedViolation = namedtuple(
    "DetailedViolation",
    [
        "file_path",
        "line_number",
        "violation_type",
        "code_snippet",
        "description",
    ],
)
CSSCheckResult = namedtuple("CSSCheckResult", ["violations"])


def check_embedded_styles(
    content: str, file_path: str
) -> list[DetailedViolation]:
    """Check for embedded CSS and style violations in the content.

    Args:
        content: The content of the file to check.
        file_path: Path to the file being checked.

    Returns:
        list: A list of DetailedViolation objects found.
    """
    violations = []
    lines = content.splitlines()

    # Pattern definitions
    patterns = {
        "hex_color": {
            "regex": r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b",
            "description": """Hex color code found.
            Use CSS variables from stylesheet instead.""",
        },
        "rgb_color": {
            "regex": (
                r"\brgba?\s*\(\s*"
                r"\d+\s*,\s*"
                r"\d+\s*,\s*"
                r"\d+\s*"
                r"(?:,\s*[\d.]+\s*)?"
                r"\)"
            ),
            "description": """RGB/RGBA color code found.
            Use CSS variables from stylesheet instead.""",
        },
        "hsl_color": {
            "regex": (
                r"\bhsla?\s*\(\s*"
                r"\d+\s*,\s*"
                r"\d+%\s*,\s*"
                r"\d+%\s*"
                r"(?:,\s*[\d.]+\s*)?"
                r"\)"
            ),
            "description": """HSL/HSLA color code found.
            Use CSS variables from stylesheet instead.""",
        },
        "inline_style_object": {
            "regex": r"style\s*=\s*\{\{",
            "description": """Inline style object found.
            Move styles to CSS file and use className instead.""",
        },
        "inline_style_string": {
            "regex": r'style\s*=\s*["\']',
            "description": """Inline style string found.
            Move styles to CSS file and use className instead.""",
        },
        "camelcase_css_property": {
            "regex": (
                r"\b(?:"
                r"backgroundColor|fontSize|fontFamily|fontWeight|lineHeight|"
                r"marginTop|marginBottom|marginLeft|marginRight|"
                r"paddingTop|paddingBottom|paddingLeft|paddingRight|"
                r"borderRadius|boxShadow|textAlign|textDecoration|"
                r"zIndex|maxWidth|minWidth|maxHeight|minHeight"
                r")\s*[:=]"
            ),
            "description": """Camelcase CSS property found.
            Move styles to CSS file and use className instead.""",
        },
        "pixel_value": {
            "regex": (
                r":\s*"
                r"['\"]?"
                r"\d+(?:px|em|rem|vh|vw|%)"
                r"['\"]?"
                r"(?=\s*[,}])"
            ),
            "description": """Direct size value assignment found.
            Move styles to CSS file and use className instead.""",
        },
    }

    in_block_comment = False

    for line_number, line in enumerate(lines, start=1):
        # Skip comments and import statements
        stripped_line = line.strip()
        if stripped_line.startswith(("import ", "import{", "import(")):
            continue

        result = ""
        i = 0
        while i < len(line):
            if in_block_comment:
                if line[i : i + 2] == "*/":
                    in_block_comment = False
                    i += 2
                else:
                    i += 1
            else:
                if line[i : i + 2] == "/*":
                    in_block_comment = True
                    i += 2
                elif line[i : i + 2] == "//":
                    break
                else:
                    result += line[i]
                    i += 1
        code_line = result

        if not code_line.strip():
            continue

        # Check for URL references (skip these as they're not style violations)
        if (
            "url(" in code_line.lower()
            or "href=" in code_line.lower()
            or "src=" in code_line.lower()
        ):
            # Skip hex codes in URLs
            continue

        for violation_type, pattern_info in patterns.items():
            matches = re.finditer(pattern_info["regex"], code_line)
            for match in matches:
                if violation_type == "camelcase_css_property":
                    # Check if it's actually in a style context
                    preceding_text = code_line[: match.start()].strip()
                    if not any(
                        keyword in preceding_text
                        for keyword in ["style", "css", "Style", "CSS"]
                    ):
                        if "{" not in code_line[: match.start()]:
                            continue
                if violation_type == "pixel_value":
                    # Look for style-related keywords nearby
                    context_window = code_line[
                        max(0, match.start() - 30) : min(
                            len(code_line), match.end() + 30
                        )
                    ]
                    if not any(
                        keyword in context_window
                        for keyword in [
                            "style",
                            "Style",
                            "width",
                            "height",
                            "size",
                            "margin",
                            "padding",
                        ]
                    ):
                        continue

                violations.append(
                    DetailedViolation(
                        file_path=file_path,
                        line_number=line_number,
                        violation_type=violation_type,
                        code_snippet=match.group(0),
                        description=pattern_info["description"],
                    )
                )

    return violations


def process_typescript_file(
    file_path: str, all_violations: list[DetailedViolation]
) -> None:
    """Process a TypeScript file for CSS violations.

    Args:
        file_path: Path to the TypeScript file to process.
        all_violations: List to store violations found.

    Returns:
        None: This function modifies the provided list.
    """
    try:
        with open(file_path, encoding="utf-8") as f:
            content = f.read()
    except (OSError, UnicodeDecodeError) as e:
        print(f"Error reading file {file_path}: {e}", file=sys.stderr)
        return

    # Check for embedded styles
    violations = check_embedded_styles(content, file_path)
    all_violations.extend(violations)


def check_files(
    directories: list,
    files: list,
    exclude_files: list,
    exclude_directories: list,
) -> CSSCheckResult:
    """Scan directories and specific files for TS files and their violations.

    Args:
        directories: List of directories to scan for TypeScript files.
        files: List of specific files to check.
        exclude_files: List of file paths to exclude from the scan.
        exclude_directories: List of directories to exclude from the scan.

    Returns:
        CSSCheckResult: A result object containing violations found.
    """
    all_violations = []

    exclude_files = set(os.path.abspath(file) for file in exclude_files)
    exclude_directories = set(
        os.path.abspath(dir) for dir in exclude_directories
    )

    for directory in directories:
        directory = os.path.abspath(directory)

        for root, _, files_in_dir in os.walk(directory):
            root_dirname = os.path.basename(root)

            if root_dirname in {"__tests__", "test", "tests"} or any(
                root.startswith(exclude_dir)
                for exclude_dir in exclude_directories
            ):
                continue

            for file in files_in_dir:
                file_path = os.path.abspath(os.path.join(root, file))
                if file_path in exclude_files:
                    continue

                if file.endswith((".ts", ".tsx")) and not any(
                    pattern in file for pattern in [".test.", ".spec."]
                ):
                    process_typescript_file(file_path, all_violations)

    # Process individual files explicitly listed
    for file_path in files:
        file_path = os.path.abspath(file_path)
        file_name = os.path.basename(file_path)
        if (
            file_path not in exclude_files
            and file_path.endswith((".ts", ".tsx"))
            and not any(
                pattern in file_name for pattern in [".test.", ".spec."]
            )
        ):
            process_typescript_file(file_path, all_violations)

    return CSSCheckResult(violations=all_violations)


def validate_directories_input(input_directories: list[str]) -> list[str]:
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


def format_violation_output(violations: list[DetailedViolation]) -> str:
    """Format violations for human-readable output.

    Args:
        violations: List of violations to format.

    Returns:
        output: A formatted string containing all violations and a summary.
    """
    if not violations:
        return ""

    output_lines = ["=" * 80]
    output_lines.append("EMBEDDED CSS VIOLATIONS FOUND")
    output_lines.append("=" * 80)
    output_lines.append("")

    # Group violations by file
    violations_by_file = {}
    for violation in violations:
        if violation.file_path not in violations_by_file:
            violations_by_file[violation.file_path] = []
        violations_by_file[violation.file_path].append(violation)

    # Sort files for consistent output
    for file_path in sorted(violations_by_file.keys()):
        file_violations = violations_by_file[file_path]
        output_lines.append(f"File: {file_path}")
        output_lines.append("-" * 80)

        # Sort violations by line number
        for violation in sorted(file_violations, key=lambda v: v.line_number):
            output_lines.append(
                f"  Line {violation.line_number}: [{violation.violation_type}]"
            )
            output_lines.append(f"    Code: {violation.code_snippet}")
            output_lines.append(f"    Issue: {violation.description}")
            output_lines.append("")

        output_lines.append("")

    output_lines.append("=" * 80)
    output_lines.append("SUMMARY")
    output_lines.append("=" * 80)
    output_lines.append(f"Total violations: {len(violations)}")
    output_lines.append(f"Files affected: {len(violations_by_file)}")
    output_lines.append("")
    output_lines.append("Please address these violations by:")
    output_lines.append("1. Moving all styles to CSS files")
    output_lines.append("2. Using className instead of inline styles")
    output_lines.append("3. Defining colors and sizes as CSS variables")
    output_lines.append("4. Importing and using CSS modules properly")
    output_lines.append("")

    return "\n".join(output_lines)


def main():
    """Run the CSS check.

    Args:
        None

    Returns:
        None
    """
    parser = argparse.ArgumentParser(description="""Check for embedded CSS and
       style violations in TypeScript files.""")
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
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    result = check_files(
        directories=directories,
        files=args.files,
        exclude_files=args.exclude_files,
        exclude_directories=args.exclude_directories,
    )

    if result.violations:
        print(format_violation_output(result.violations))
        sys.exit(1)
    else:
        print("✓ No embedded CSS violations found.")
        sys.exit(0)


if __name__ == "__main__":
    main()

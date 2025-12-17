#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Check TypeScript files for CSS violations and embedded CSS."""
import argparse
import os
import re
import sys
from collections import namedtuple

# Define namedtuples for storing results
Violation = namedtuple("Violation", ["file_path", "line_number", "violation_type", "details"])
CSSCheckResult = namedtuple("CSSCheckResult", ["violations"])


def check_embedded_css(content: str, file_path: str) -> list:
    """Check for embedded CSS in the content.

    Args:
        content: The content of the file to check.
        file_path: Path to the file being checked.    

    Returns:
        list: A list of embedded CSS violations found.
    """
    violations = []
    lines = content.splitlines()
    
    # Pattern 1: Hex color codes (e.g., #fff, #000000)
    hex_color_pattern = r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b"
    
    # Pattern 2: Inline JSX style attributes (e.g., style={{ color: 'red' }})
    jsx_inline_style_pattern = r'style\s*=\s*\{\{[^}]+\}\}'
    
    # Pattern 3: HTML style attributes (e.g., style="color: red;")
    html_inline_style_pattern = r'style\s*=\s*["\'][^"\']+["\']'
    
    for line_number, line in enumerate(lines, start=1):
        # Skip comments and import statements
        stripped_line = line.strip()
        if stripped_line.startswith('//') or stripped_line.startswith('/*') or 'import' in stripped_line:
            continue
            
        # Check for hex color codes
        hex_matches = re.findall(hex_color_pattern, line)
        for match in hex_matches:
            violations.append(
                Violation(
                    file_path=file_path,
                    line_number=line_number,
                    violation_type="Hex Color Code",
                    details=f"Embedded hex color '{match}' found. Use CSS variables from app.module.css instead."
                )
            )
        
        # Check for JSX inline styles
        jsx_style_matches = re.finditer(jsx_inline_style_pattern, line)
        for match in jsx_style_matches:
            violations.append(
                Violation(
                    file_path=file_path,
                    line_number=line_number,
                    violation_type="Inline JSX Style",
                    details=f"Inline JSX style attribute detected: '{match.group()}'. Move styles to CSS file."
                )
            )
        
        # Check for HTML inline styles
        html_style_matches = re.finditer(html_inline_style_pattern, line)
        for match in html_style_matches:
            violations.append(
                Violation(
                    file_path=file_path,
                    line_number=line_number,
                    violation_type="Inline HTML Style",
                    details=f"Inline HTML style attribute detected. Move styles to CSS file."
                )
            )
    
    return violations


def process_typescript_file(file_path: str, violations: list) -> None:
    """Process a TypeScript file for CSS violations.
    
    Args:
        file_path: Path to the TypeScript file to process.
        violations: List to store violations.
    
    Returns:
        None: This function modifies the violations list in place.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except (IOError, UnicodeDecodeError) as e:
        print(f"Error reading file {file_path}: {e}")
        return
    
    # Check for embedded CSS violations
    embedded_violations = check_embedded_css(content, file_path)
    violations.extend(embedded_violations)


def check_files(
    directories: list,
    files: list,
    exclude_files: list,
    exclude_directories: list,
) -> CSSCheckResult:
    """Scan directories and specific files for TS files and their violations.
    
    This function checks TypeScript files in given directories for CSS violations.
    
    Args:
        directories: List of directories to scan for TypeScript files.
        files: List of specific files to check.
        exclude_files: List of file paths to exclude from the scan.
        exclude_directories: List of directories to exclude from the scan.
    
    Returns:
        CSSCheckResult: A result object containing violations found.
    """
    violations = []
    
    exclude_files = set(os.path.abspath(file) for file in exclude_files)
    exclude_directories = set(
        os.path.abspath(dir) for dir in exclude_directories
    )
    
    # Process directories
    for directory in directories:
        directory = os.path.abspath(directory)
        for root, _, files_in_dir in os.walk(directory):
            # Skip excluded directories
            if any(
                root.startswith(exclude_dir)
                for exclude_dir in exclude_directories
            ):
                continue
            
            for file in files_in_dir:
                file_path = os.path.abspath(os.path.join(root, file))
                
                # Skip excluded files
                if file_path in exclude_files:
                    continue
                
                # Process TypeScript files (excluding test files)
                if file.endswith((".ts", ".tsx")) and not any(
                    pattern in root or pattern in file
                    for pattern in [
                        "__tests__",
                        ".test.",
                        ".spec.",
                        "test/",
                        "tests/",
                        ".stories.",
                        "Mock",
                    ]
                ):
                    process_typescript_file(file_path, violations)
    
    # Process individual files explicitly listed
    for file_path in files:
        file_path = os.path.abspath(file_path)
        if file_path not in exclude_files and file_path.endswith(
            (".ts", ".tsx")
        ):
            process_typescript_file(file_path, violations)
    
    return CSSCheckResult(violations)


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
        description="Check for embedded CSS and style violations in TypeScript files."
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
    )
    
    exit_code = 0
    
    if result.violations:
        print("=" * 80)
        print("CSS VIOLATIONS DETECTED")
        print("=" * 80)
        print()
        
        # Group violations by file
        violations_by_file = {}
        for violation in result.violations:
            if violation.file_path not in violations_by_file:
                violations_by_file[violation.file_path] = []
            violations_by_file[violation.file_path].append(violation)
        
        # Print violations grouped by file
        for file_path, file_violations in sorted(violations_by_file.items()):
            print(f"File: {file_path}")
            print("-" * 80)
            for violation in sorted(file_violations, key=lambda x: x.line_number):
                print(f"  Line {violation.line_number}: [{violation.violation_type}]")
                print(f"    {violation.details}")
                print()
        
        print("=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"Total violations found: {len(result.violations)}")
        print(f"Files affected: {len(violations_by_file)}")
        print()
        print("HOW TO FIX:")
        print("1. For hex color codes: Use CSS variables from src/style/app.module.css")
        print("2. For inline styles: Move styles to separate CSS/module.css files")
        print("3. Import and use CSS modules in your components")
        print("=" * 80)
        
        exit_code = 1
    else:
        print("✓ No CSS violations found!")
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
"""Check TypeScript files for CSS violations and embedded CSS."""

import argparse
import os
import re
import sys


def check_embedded_css(content: str) -> list:
    """
    Check for embedded CSS in the content.

    Args:
        content: The content of the file to check.

    Returns:
        A list of embedded CSS violations found.
    """
    embedded_css_pattern = r"#([0-9a-fA-F]{3}){1,2}"  # Matches CSS color codes
    return re.findall(embedded_css_pattern, content)


def check_files(
    directory: str, exclude_files: list, exclude_directories: list, allowed_css_patterns: list
) -> tuple:
    """
    Check TypeScript files for CSS violations and print correct CSS imports.

    Args:
        directory: The directory to check.
        exclude_files: List of files to exclude from analysis.
        exclude_directories: List of directories to exclude from analysis.
        allowed_css_patterns: List of allowed CSS file patterns.

    Returns:
        A tuple containing lists of violations, correct CSS imports, and embedded CSS violations.
    """
    violations = []
    correct_css_imports = []
    embedded_css_violations = []

    # Normalize exclude paths
    exclude_files = set(os.path.abspath(file) for file in exclude_files)
    exclude_directories = set(os.path.abspath(dir) for dir in exclude_directories)

    for root, _, files in os.walk(directory):
        # Skip excluded directories
        if any(root.startswith(exclude_dir) for exclude_dir in exclude_directories):
            continue

        for file in files:
            file_path = os.path.abspath(os.path.join(root, file))

            # Skip excluded files
            if file_path in exclude_files:
                continue

            # Process TypeScript files
            if file.endswith((".ts", ".tsx")) and "test" not in root:
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except (IOError, UnicodeDecodeError) as e:
                    print(f"Error reading file {file_path}: {e}")
                    continue

                # Check for CSS imports with an improved regex pattern
                css_imports = re.findall(
                    r'import\s+.*?["\'](.*?\.css)["\'];', content
                )
                for css_file in css_imports:
                    # Check if the CSS import matches the allowed patterns
                    if any(css_file.endswith(pattern) for pattern in allowed_css_patterns):
                        correct_css_imports.append(
                            f"Correct CSS import ({css_file}) in {file_path}"
                        )
                    else:
                        violations.append(
                            f"Invalid CSS import ({css_file}) in {file_path}"
                        )

                # Check for embedded CSS
                embedded_css = check_embedded_css(content)
                if embedded_css:
                    embedded_css_violations.append(
                        f"Embedded CSS found in {file_path}: {', '.join(embedded_css)}"
                    )

    return violations, correct_css_imports, embedded_css_violations


def main():
    """Run the CSS check script."""
    parser = argparse.ArgumentParser(
        description="Check for CSS violations in TypeScript files."
    )
    parser.add_argument("--directory", required=True, help="Directory to check.")
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
    args = parser.parse_args()

    violations, correct_css_imports, embedded_css_violations = check_files(
        directory=args.directory,
        exclude_files=args.exclude_files,
        exclude_directories=args.exclude_directories,
        allowed_css_patterns=args.allowed_css_patterns,
    )

    if violations:
        print("\nCSS Import Violations:")
        print("\n".join(violations))

    if embedded_css_violations:
        print("\nEmbedded CSS Violations:")
        print("\n".join(embedded_css_violations))

    if correct_css_imports:
        print("\nCorrect CSS Imports:")
        print("\n".join(correct_css_imports))
    else:
        print("\nNo correct CSS imports found.")

    if violations or embedded_css_violations:
        sys.exit(1)  # Exit with error code if violations found
    else:
        print("\nNo CSS violations found.")
        sys.exit(0)  # Exit with success code


if __name__ == "__main__":
    main()

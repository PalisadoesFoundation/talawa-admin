"""
i18n Translation Tag Checker.

This module provides functionality to scan source files for translation tags
and validate them against locale JSON files.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from collections.abc import Iterable
from pathlib import Path


def get_translation_keys(json_data: dict, prefix: str = "") -> set[str]:
    """
    Recursively extract all dot-notation keys from a nested dictionary.

    Args:
        json_data: The dictionary containing translation data.
        prefix: The current key prefix for recursion.

    Returns:
        A set of flattened translation keys.
    """
    keys = set()
    for key, value in json_data.items():
        full_key = f"{prefix}{key}"
        if isinstance(value, dict):
            keys.update(get_translation_keys(value, f"{full_key}."))
        else:
            keys.add(full_key)
    return keys


def find_translation_tags(content_or_path: str | Path) -> set[str]:
    """
    Extract translation tags from a string or file path using regex.

    Args:
        content_or_path: String content or Path object to a source file.

    Returns:
        A set of unique translation tags found.
    """
    tags = set()
    regex = r"(?:(?:\bi18n)\.)?\bt\(\s*['\"]([^'\" \n\r\t]+)['\"]"

    if isinstance(content_or_path, Path):
        try:
            with open(content_or_path, encoding="utf-8") as file:
                content = file.read()
        except (OSError, UnicodeDecodeError):
            return tags
    else:
        content = content_or_path

    matches = re.findall(regex, content)
    for match in matches:
        if ":" in match:
            match = match.split(":")[-1]
        tags.add(match)
    return tags


def load_locale_keys(locales_path: str) -> set[str]:
    """
    Load all translation keys from common, translation, and error JSON files.

    Args:
        locales_path: Path to the directory containing locale JSON files.

    Returns:
        A set of all valid translation keys.

    Raises:
        FileNotFoundError: If the locales_path does not exist.
    """
    valid_keys = set()
    path = Path(locales_path)
    if not path.exists():
        raise FileNotFoundError(f"Locales path not found: {locales_path}")

    files_to_load = ["common.json", "translation.json", "errors.json"]
    for filename in files_to_load:
        file_path = path / filename
        if file_path.exists():
            try:
                with open(file_path, encoding="utf-8") as file:
                    data = json.load(file)
                    valid_keys.update(get_translation_keys(data))
            except (json.JSONDecodeError, OSError):
                continue

    if not valid_keys:
        print(f"Warning: No translation keys found in {locales_path}")

    return valid_keys


def get_target_files(
    files: list[str] | None,
    directories: list[str] | None,
    extensions: Iterable[str],
) -> list[Path]:
    """
    Collect and filter files for scanning based on extensions and exclusions.

    Args:
        files: Specific file paths to include.
        directories: Directories to recursively scan.
        extensions: Iterable of file extensions to include.

    Returns:
        A list of filtered Path objects.
    """
    target_files = []

    if files:
        for file_item in files:
            path = Path(file_item)
            if path.exists() and any(
                file_item.endswith(ext) for ext in extensions
            ):
                target_files.append(path)

    if directories:
        for directory in directories:
            path = Path(directory)
            if path.exists():
                for ext in extensions:
                    target_files.extend(path.rglob(f"*{ext}"))

    test_patterns = (
        ".spec.tsx",
        ".test.tsx",
        ".spec.ts",
        ".test.ts",
        ".spec.jsx",
        ".test.jsx",
        ".spec.js",
        ".test.js",
    )
    return [f for f in target_files if not str(f).endswith(test_patterns)]


def main() -> None:
    """Entry point for the translation checker CLI."""
    parser = argparse.ArgumentParser(
        description="Search for and validate translation tags."
    )
    parser.add_argument("--files", nargs="+", help="Specific files to check")
    parser.add_argument(
        "--directories", nargs="+", help="Directories to search"
    )
    parser.add_argument(
        "--locales-dir",
        default="public/locales/en",
        help="Locales directory",
    )
    parser.add_argument(
        "--extensions",
        nargs="+",
        default=[".ts", ".tsx", ".js", ".jsx"],
        help="File extensions to scan",
    )

    args = parser.parse_args()

    try:
        valid_keys = load_locale_keys(args.locales_dir)
        dirs = args.directories if args.directories else []
        if not args.files and not dirs:
            dirs = ["src"]

        target_files = get_target_files(args.files, dirs, args.extensions)
        missing_keys = defaultdict(list)

        for filepath in target_files:
            found_tags = find_translation_tags(filepath)
            for tag in found_tags:
                if tag not in valid_keys:
                    missing_keys[str(filepath)].append(tag)

        if missing_keys:
            for filepath, tags in missing_keys.items():
                print(f"File: {filepath}")
                for tag in sorted(set(tags)):
                    print(f"  - Missing key: {tag}")
            sys.exit(1)
        else:
            print("All translation tags validated successfully.")
            sys.exit(0)

    except FileNotFoundError as err:
        print(f"Error: {err}")
        sys.exit(2)


if __name__ == "__main__":
    main()

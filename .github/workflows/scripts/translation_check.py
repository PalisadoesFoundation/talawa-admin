"""Validates i18n translation tags against locale JSON files.

Note:
    Prop-passed `t` cannot be reliably detected without AST-based analysis.
    This script uses regex heuristics to enforce `useTranslation()` usage.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def get_keys(data: dict, prefix: str = "") -> set[str]:
    """Flatten nested translation JSON into dot-notation keys.

    Args:
        data: Parsed JSON dictionary containing translation keys.
        prefix: Prefix used for nested key traversal.

    Returns:
        keys: A set of flattened translation keys.
    """
    keys: set[str] = set()
    for key, value in data.items():
        if isinstance(value, dict):
            keys.update(get_keys(value, f"{prefix}{key}."))
        else:
            keys.add(f"{prefix}{key}")
    return keys


def get_translation_keys(data: dict) -> set[str]:
    """Extract translation keys from parsed locale JSON.

    Args:
        data: Parsed JSON dictionary.

    Returns:
        translation_keys: A set of translation keys.
    """
    return get_keys(data)


def load_locale_keys(locales_dir: str | Path) -> set[str]:
    """Load all valid translation keys from locale JSON files.

    Args:
        locales_dir: Path to the locale directory.

    Returns:
        keys: A set of all valid translation keys.

    Raises:
        FileNotFoundError: If the locale directory does not exist.
    """
    base = Path(locales_dir)
    if not base.exists():
        raise FileNotFoundError(locales_dir)

    keys: set[str] = set()

    for name in ("common.json", "translation.json", "errors.json"):
        path = base / name
        if path.exists():
            try:
                keys.update(
                    get_keys(json.loads(path.read_text(encoding="utf-8")))
                )
            except (json.JSONDecodeError, OSError) as exc:
                print(
                    f"Warning: Failed to parse {path}: {exc}",
                    file=sys.stderr,
                )

    if not keys:
        print(
            f"Warning: No translation keys found in {base}",
            file=sys.stderr,
        )

    return keys


def find_translation_tags(
    source: str | Path, file_name: str | None = None
) -> set[str]:
    """Find and collect translation tags from a source file or string.

    Handles keyPrefix option in useTranslation calls by prefixing
    the extracted keys with the keyPrefix value. Tags from both
    useTranslation-sourced t() calls and i18n.t() calls are collected.

    Args:
        source: File path or raw source string.
        file_name: Optional file name for reporting warnings.

    Returns:
        found_tags: A set of detected translation keys.
    """
    if isinstance(source, Path):
        try:
            content = source.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            return set()
    else:
        content = source

    # Extract keyPrefix from useTranslation only
    key_prefix_pattern = (
        r"useTranslation\s*\([^)]*keyPrefix\s*:\s*['\"]([^'\"]+)['\"]"
    )
    key_prefixes = re.findall(key_prefix_pattern, content)

    if len(key_prefixes) > 1:
        display_name = (
            str(source)
            if isinstance(source, Path)
            else (file_name or "source")
        )
        print(
            f"Warning: Multiple keyPrefixes found in {display_name}. "
            f"Using first: '{key_prefixes[0]}'. Found: {key_prefixes}",
            file=sys.stderr,
        )

    primary_prefix = key_prefixes[0] if key_prefixes else None

    # Find translation tags
    tags = re.findall(
        r"(?:(?:\bi18n)\.)?\bt\(\s*['\"]([^'\" \n]+)['\"]",
        content,
    )

    result = set()
    for tag in tags:
        clean_tag = tag.split(":")[-1]

        if "." in clean_tag or primary_prefix is None:
            result.add(clean_tag)
        else:
            result.add(f"{primary_prefix}.{clean_tag}")

    return result


def get_target_files(
    files: list[str] | None = None,
    directories: list[str] | None = None,
    exclude: list[str] | None = None,
) -> list[Path]:
    """Resolve target source files for translation validation.

    Args:
        files: Explicit list of files to scan.
        directories: Directories to recursively scan.
        exclude: Filename patterns to exclude.

    Returns:
        target_files: A list of source file paths.

    Raises:
        FileNotFoundError: If the default src directory is missing.
    """
    exclude = exclude or []
    targets: list[Path] = []

    if files:
        for file_path in files:
            path = Path(file_path)
            if path.exists() and path.is_file():
                targets.append(path)
            else:
                print(
                    f"Warning: File not found: {file_path}",
                    file=sys.stderr,
                )

    if directories:
        for directory in directories:
            dir_path = Path(directory)
            if dir_path.exists() and dir_path.is_dir():
                targets.extend(dir_path.rglob("*"))
            else:
                print(
                    f"Warning: Directory not found: {directory}",
                    file=sys.stderr,
                )

    if not files and not directories:
        src_path = Path("src")
        if not src_path.exists() or not src_path.is_dir():
            raise FileNotFoundError("Default 'src' directory not found")
        targets = list(src_path.rglob("*"))

    return [
        path
        for path in targets
        if path.suffix in {".ts", ".tsx", ".js", ".jsx"}
        and not any(path.name.endswith(x) or x in path.parts for x in exclude)
        and ".spec." not in path.name
        and ".test." not in path.name
    ]


def check_file(path: Path, valid_keys: set[str]) -> tuple | None:
    """Check a source file for translation violations.

    Args:
        path: Path to the source file to check.
        valid_keys: Set of all valid translation keys from the locale files.

    Returns:
        errors: A tuple containing the error type ("error" or "missing") and
            either a single lint error message or a list of missing keys.
            Returns None if no violations are found.
    """
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None

    # Detect usage patterns (excluding i18n.t via negative lookbehind)
    uses_standalone_t = re.search(
        r"(?<!i18n)\bt\(\s*['\"]", content, re.MULTILINE
    )
    uses_i18n_t = re.search(r"\bi18n\.t\(\s*['\"]", content)
    uses_use_translation = re.search(r"useTranslation\s*\(", content)

    if uses_standalone_t and not uses_i18n_t and not uses_use_translation:
        return (
            "error",
            "Translation lint error: `t()` used without `useTranslation()`. "
            "Fix: Import and call useTranslation() from 'react-i18next'. "
            "Do not pass `t` as a prop.",
        )

    tags = find_translation_tags(content, file_name=str(path))
    missing = sorted(tag for tag in tags if tag not in valid_keys)

    return ("missing", missing) if missing else None


def main() -> None:
    """CLI entry point for translation validation.

    This function parses command-line arguments, loads translation keys,
    validates translation tag usage across source files, and exits with
    appropriate status codes based on the results.

    Args:
        None

    Returns:
        None

    Raises:
        SystemExit: Exits with status code 0 on success, 1 if missing
            translation keys are found, or 2 for configuration errors.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("--files", nargs="*", default=[])
    parser.add_argument("--directories", nargs="*", default=[])
    parser.add_argument("--locales-dir", default="public/locales/en")
    args = parser.parse_args()

    try:
        valid_keys = load_locale_keys(args.locales_dir)
    except FileNotFoundError as exc:
        print(
            f"Error: Locale directory not found: {exc}",
            file=sys.stderr,
        )
        sys.exit(2)

    try:
        targets = get_target_files(args.files, args.directories)
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(2)

    errors: dict[str, tuple[str, str | list[str]]] = {}
    for path in targets:
        result = check_file(path, valid_keys)
        if result:
            errors[str(path)] = result

    if errors:
        for file, (error_type, result) in errors.items():
            print(f"File: {file}")
            if error_type == "error":
                print(f"  - Error: {result}")
            else:
                for tag in result:
                    print(f"  - Missing: {tag}")
        sys.exit(1)

    print("All translation tags validated successfully")
    sys.exit(0)


if __name__ == "__main__":
    main()

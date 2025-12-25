"""Validates i18n translation tags against locale JSON files."""

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
        A set of flattened translation keys.
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
        A set of translation keys.
    """
    return get_keys(data)


def load_locale_keys(locales_dir: str | Path) -> set[str]:
    """Load all valid translation keys from locale JSON files.

    Args:
        locales_dir: Path to the locale directory.

    Returns:
        A set of all valid translation keys.

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
            except (json.JSONDecodeError, OSError) as e:
                print(f"Warning: Failed to parse {path}: {e}", file=sys.stderr)
                continue

    if not keys:
        print(f"Warning: No translation keys found in {base}", file=sys.stderr)

    return keys


def find_translation_tags(source: str | Path) -> set[str]:
    """Find all translation tags used inside a source file or string.

    Args:
        source: File path or raw source string.

    Returns:
        A set of detected translation keys.
    """
    if isinstance(source, Path):
        try:
            content = source.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            return set()
    else:
        content = source

    tags = re.findall(
        r"(?:(?:\bi18n)\.)?\bt\(\s*['\"]([^'\" \n]+)['\"]",
        content,
    )

    # Extract key from namespace-qualified tags
    # (e.g., "common:hello" -> "hello")

    return {tag.split(":")[-1] for tag in tags if tag.split(":")[-1]}


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
        A list of source file paths.
    """
    exclude = exclude or []
    targets: list[Path] = []

    if files:
        for f in files:
            path = Path(f)
            if path.exists() and path.is_file():
                targets.append(path)
            else:
                print(f"Warning: File not found: {f}", file=sys.stderr)

    if directories:
        for directory in directories:
            targets.extend(Path(directory).rglob("*"))

    if not files and not directories:
        targets = list(Path("src").rglob("*"))

    return [
        path
        for path in targets
        if path.suffix in {".ts", ".tsx", ".js", ".jsx"}
        and not any(path.name.endswith(x) or x in path.parts for x in exclude)
        and ".spec." not in path.name
        and ".test." not in path.name
    ]


def check_file(path: Path, valid_keys: set[str]) -> list[str]:
    """Check a file for missing translation keys.

    Args:
        path: File path to check.
        valid_keys: Set of valid translation keys.

    Returns:
        A sorted list of missing translation keys.
    """
    return sorted(
        tag for tag in find_translation_tags(path) if tag not in valid_keys
    )


def main() -> None:
    """CLI entry point for translation validation.

    Returns:
        None. Exits with status code 1 if missing translations are found.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("--files", nargs="*", default=[])
    parser.add_argument("--directories", nargs="*", default=[])
    parser.add_argument("--locales-dir", default="public/locales/en")
    args = parser.parse_args()

    valid_keys = load_locale_keys(args.locales_dir)
    targets = get_target_files(args.files, args.directories)

    errors = {
        str(path): missing
        for path in targets
        if (missing := check_file(path, valid_keys))
    }

    if errors:
        for file, tags in errors.items():
            print(
                f"File: {file}\n"
                + "\n".join(f"  - Missing: {tag}" for tag in tags)
            )
        sys.exit(1)

    print("All translation tags validated successfully")
    sys.exit(0)


if __name__ == "__main__":
    main()

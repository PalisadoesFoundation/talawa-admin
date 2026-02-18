"""Validates i18n translation tags against locale JSON files."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def get_keys(data: dict, prefix: str = "") -> set[str]:
    """Flatten nested translation JSON into dot-notation keys."""
    keys: set[str] = set()
    for key, value in data.items():
        if isinstance(value, dict):
            keys.update(get_keys(value, f"{prefix}{key}."))
        else:
            keys.add(f"{prefix}{key}")
    return keys


def get_translation_keys(data: dict) -> set[str]:
    """Extract translation keys from parsed locale JSON."""
    return get_keys(data)


def load_locale_keys(locales_dir: str | Path) -> set[str]:
    """Load all valid translation keys from locale JSON files."""
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


def find_translation_tags(source: str | Path) -> set[str]:
    """Find all translation tags used inside a source file or string.

    Handles keyPrefix option in useTranslation calls by prefixing
    the extracted keys with the keyPrefix value.

    Direct `t()` usage requires useTranslation().
    `i18n.t()` usage is allowed.
    """
    if isinstance(source, Path):
        try:
            content = source.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            return set()
    else:
        content = source

    # Detect usage patterns
    uses_direct_t = re.search(r"\bt\(\s*['\"]", content)
    uses_i18n_t = re.search(r"\bi18n\.t\(\s*['\"]", content)
    uses_use_translation = re.search(r"useTranslation\s*\(", content)

    # Enforce correct usage
    if uses_direct_t and not uses_i18n_t and not uses_use_translation:
        raise ValueError(
            "Translation lint error: `t()` used without `useTranslation()`. "
            "Fix: Import and call useTranslation() from 'react-i18next'. "
            "Do not pass `t` as a prop."
        )

    # Extract keyPrefix from useTranslation only
    key_prefix_pattern = (
        r"useTranslation\s*\([^)]*keyPrefix\s*:\s*['\"]([^'\"]+)['\"]"
    )
    key_prefixes = re.findall(key_prefix_pattern, content)

    if len(key_prefixes) > 1:
        file_name = str(source) if isinstance(source, Path) else "source"
        print(
            f"Warning: Multiple keyPrefixes found in {file_name}. "
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
    """Resolve target source files for translation validation."""
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


def check_file(path: Path, valid_keys: set[str]) -> list[str]:
    """Check a file for missing translation keys."""
    try:
        tags = find_translation_tags(path)
    except ValueError as exc:
        return [str(exc)]

    return sorted(tag for tag in tags if tag not in valid_keys)


def main() -> None:
    """CLI entry point for translation validation."""
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

    errors: dict[str, list[str]] = {}
    for path in targets:
        missing = check_file(path, valid_keys)
        if missing:
            errors[str(path)] = missing

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

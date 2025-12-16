#!/usr/bin/env python3
"""Check translation usage in source files against locale translation JSONs.

This script scans specified files and/or directories for translation tags
(commonly `t('key')`, `t("key")`, `i18n.t('key')`, `i18n.t("key")`) and
validates that every key found in source code exists in all locale files
found under the provided locales directory.

Exit codes
----------
0  : success (no missing translations)
1  : missing translations found
2  : configuration / usage error (bad args, no locale files, etc.)

Example:
    python .github/workflows/scripts/check_translation_usage.py \
        --directories src \
        --locales-dir public/locales \
        --extensions .ts .tsx .js .jsx

The script is intentionally conservative: it only extracts literal string keys
passed as the first argument to `t(...)` or `i18n.t(...)`. Template-literal or
computed keys are not matched.
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import sys
from pathlib import Path
from collections.abc import Iterable


_TRANSLATION_CALL_RE = re.compile(
    r"""(?:(?:\bi18n)\.)?\bt\(\s*(['"])([^'"\n]+?)\1\s*(?:[,)\}])""",
    re.MULTILINE,
)

_DEFAULT_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    """Parse command-line arguments.
    Args:
        argv: Optional sequence of arguments to parse. If None, uses sys.argv.

    Returns:
        Parsed argument namespace containing all CLI arguments.
    """
    parser = argparse.ArgumentParser(
        description=(
            "Validate that translation keys used in source files "
            "exist in locale JSON files."
        )
    )

    parser.add_argument(
        "--files",
        nargs="+",
        help="Specific file paths to scan (can be repeated).",
    )
    parser.add_argument(
        "--directories",
        nargs="+",
        help="Directories to recursively scan for source files.",
    )
    parser.add_argument(
        "--locales-dir",
        required=True,
        help="Path to the locales directory (e.g. public/locales).",
    )
    parser.add_argument(
        "--extensions",
        nargs="+",
        default=list(_DEFAULT_EXTENSIONS),
        help=(
            "File extensions to scan "
            f"(default: {' '.join(sorted(_DEFAULT_EXTENSIONS))})."
        ),
    )
    parser.add_argument(
        "--ignore",
        nargs="*",
        default=["node_modules", ".git", "dist", "build"],
        help=(
            "Glob patterns or directory names to ignore when scanning "
            "directories."
        ),
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose output.",
    )
    parser.add_argument(
        "--allow-missing-locales",
        action="store_true",
        help=(
            "If set, skip languages that don't have a translation.json file "
            "(default: treat missing locale files as error)."
        ),
    )

    return parser.parse_args(list(argv) if argv is not None else None)


def is_ignored(path: Path, ignore_patterns: List[str]) -> bool:
    """Return True if `path` matches any ignore pattern."""
    str_path = str(path)
    for pat in ignore_patterns:
        if fnmatch.fnmatch(str_path, pat) or pat in path.parts:
            return True
    return False


def collect_files(
    files: List[str] | None,
    directories: List[str] | None,
    extensions: Set[str],
    ignore_patterns: List[str],
    verbose: bool = False,
) -> list[Path]:
    # pylint: disable=too-many-locals, too-many-branches
    """Collect target files from the provided file paths and directories."""
    collected: List[Path] = []

    if files:
        for f in files:
            p = Path(f)
            if not p.exists():
                print(f"Warning: specified file does not exist: {f}")
                continue
            if p.is_file() and p.suffix in extensions:
                if not is_ignored(p, ignore_patterns):
                    collected.append(p)
                elif verbose:
                    print(f"Skipping ignored file {p}")
            elif verbose:
                print(f"Skipping file with unsupported extension {p}")

    if directories:
        for d in directories:
            root = Path(d)
            if not root.exists():
                print(f"Warning: specified directory does not exist: {d}")
                continue
            for dirpath, dirnames, filenames in os.walk(root):
                dirnames[:] = [
                    dn
                    for dn in dirnames
                    if not is_ignored(Path(dirpath) / dn, ignore_patterns)
                ]
                for fname in filenames:
                    path = Path(dirpath) / fname
                    if path.suffix in extensions and not is_ignored(
                        path, ignore_patterns
                    ):
                        collected.append(path)

    seen = set()
    deduped: List[Path] = []
    for p in collected:
        resolved = p.resolve()
        if resolved not in seen:
            seen.add(resolved)
            deduped.append(p)

    if verbose:
        print(f"Collected {len(deduped)} files to scan.")

    return deduped


def extract_keys_from_text(text: str) -> Set[str]:
    """Extract translation keys from a text blob using regex."""
    keys: Set[str] = set()
    for match in _TRANSLATION_CALL_RE.finditer(text):
        key = match.group(2).strip()
        if key:
            keys.add(key)
    return keys


def extract_keys_from_file(path: Path) -> Set[str]:
    """Extract translation keys from a file."""
    try:
        raw = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        raw = path.read_text(encoding="utf-8", errors="ignore")
    return extract_keys_from_text(raw)


def flatten_json(obj: object, prefix: str = "") -> Set[str]:
    """Flatten nested JSON-like dict into dot notation keys."""
    keys: Set[str] = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_prefix = f"{prefix}.{k}" if prefix else k
            keys.update(flatten_json(v, new_prefix))
    elif prefix:
        keys.add(prefix)
    return keys


def load_locales(
    locales_dir: str,
    verbose: bool = False,
) -> dict[str, set[str]]:
    """Load all locales from locales_dir."""
    base = Path(locales_dir)
    if not base.exists() or not base.is_dir():
        raise FileNotFoundError(
            f"Locales directory not found: {locales_dir!s}"
        )

    locales: Dict[str, Set[str]] = {}
    for child in sorted(base.iterdir()):
        if child.is_dir():
            translation_file = child / "translation.json"
            if not translation_file.exists():
                continue
            data = json.loads(translation_file.read_text(encoding="utf-8"))
            locales[child.name] = flatten_json(data)
            if verbose:
                print(f"Loaded locale '{child.name}'")

    if not locales:
        raise FileNotFoundError(
            f"No locales with translation.json found under: {locales_dir!s}"
        )

    return locales


def compare_keys(
    used_keys: Set[str],
    locales: Dict[str, Set[str]],
) -> dict[str, list[str]]:
    """Compare used keys against locale keys."""
    missing: Dict[str, List[str]] = {}
    for key in sorted(used_keys):
        missing_langs = [
            lang for lang, keys in locales.items() if key not in keys
        ]
        if missing_langs:
            missing[key] = missing_langs
    return missing


def print_report(
    missing: Dict[str, List[str]],
    verbose: bool = False,
) -> None:
    """Print a human-friendly missing-translation report."""
    if not missing:
        print(
            "✅ All translation keys used in source files are present "
            "in all locales."
        )
        return

    print("❌ Missing translations detected:\n")
    for key, langs in missing.items():
        print(f"Key: {key}")
        print(f"  Missing in: {', '.join(langs)}\n")

    if verbose:
        total_missing = len(missing)
        total_entries = sum(len(langs) for langs in missing.values())
        print(
            f"Summary: {total_missing} missing keys across "
            f"{total_entries} missing entries."
        )


def main(argv: Iterable[str] | None = None) -> int:
    """Run the main entrypoint."""
    args = parse_args(argv)

    extensions = {
        ext if ext.startswith(".") else f".{ext}" for ext in args.extensions
    }

    targets = collect_files(
        files=args.files,
        directories=args.directories,
        extensions=extensions,
        ignore_patterns=list(args.ignore),
        verbose=args.verbose,
    )

    if not targets:
        print(
            "No target source files collected to scan. "
            "Please pass --files or --directories."
        )
        return 2

    used_keys: Set[str] = set()
    for p in targets:
        used_keys.update(extract_keys_from_file(p))

    if not used_keys:
        print("No translation keys found in scanned files.")
        return 0

    locales = load_locales(args.locales_dir, verbose=args.verbose)
    missing = compare_keys(used_keys, locales)
    print_report(missing, verbose=args.verbose)

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

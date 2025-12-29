#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Translation Tag Check (keyPrefix-aware).

Validates that translation keys used in changed source files exist in English
locale files under public/locales/en. Supports i18next keyPrefix resolution from
useTranslation('translation'|'common'|'errors', { keyPrefix: '...' }).
Skips non-literal keys and test files by design.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from typing import Dict, List, Optional, Set, Tuple

# Source of truth for EN locales
EN_LOCALES: Dict[str, str] = {
    "translation": "public/locales/en/translation.json",
    "common": "public/locales/en/common.json",
    "errors": "public/locales/en/errors.json",
}

# Literal translation calls
# t('key') or i18n.t('key')
T_LIT = re.compile(r"(?:\bi18n\s*\.\s*)?\bt\s*\(\s*['\"](?P<key>[^'\"\)]+)['\"]", re.DOTALL)
# tCommon('key')
T_COMMON_LIT = re.compile(r"\btCommon\s*\(\s*['\"](?P<key>[^'\"\)]+)['\"]", re.DOTALL)

# Loose matcher for useTranslation(...) capturing the first two comma-separated args.
# This tolerates newlines, extra whitespace, and additional options.
USE_T_CALL = re.compile(
    r"useTranslation\s*\(\s*(?P<arg1>[^,)]*)(?:\s*,\s*(?P<arg2>\{[^)]*\}))?\s*\)",
    re.DOTALL,
)

# Quoted namespace in arg1
ARG1_NS = re.compile(r"^\s*['\"](?P<ns>translation|common|errors)['\"]\s*$")

# keyPrefix anywhere in the options object (arg2)
ARG2_PREFIX = re.compile(r"keyPrefix\s*:\s*['\"](?P<prefix>[^'\"\n]+)['\"]", re.DOTALL)


def flatten(obj, base: str = "") -> Set[str]:
    """
    Recursively flattens a nested translation object into a set of dot-notated keys.

    Args:
        obj (dict | list | str | int | float | bool | None): JSON value to flatten.
        base (str): Current key prefix while recursing.

    Returns:
        set[str]: All discovered dot-notated keys including intermediate nodes.
    """
    out: Set[str] = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            nb = f"{base}.{k}" if base else k
            out.add(nb)
            out |= flatten(v, nb)
    elif isinstance(obj, list):
        for v in obj:
            out |= flatten(v, base)
    # primitives contribute nothing new
    return out


def load_locale_keys() -> Dict[str, Set[str]]:
    """
    Loads and flattens English locale namespaces into key sets.

    Reads public/locales/en/translation.json, common.json, and errors.json and
    produces a mapping from namespace to the flattened set of keys.

    Returns:
        dict[str, set[str]]: Mapping of namespace name to its flattened key set.
    """
    keys_by_ns: Dict[str, Set[str]] = {}
    for ns, path in EN_LOCALES.items():
        if not os.path.exists(path):
            print(f"[warn] Missing locale file: {path}", file=sys.stderr)
            keys_by_ns[ns] = set()
            continue
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            keys_by_ns[ns] = flatten(data)
        except Exception as e:
            print(f"[error] Failed to read/parse {path}: {e}", file=sys.stderr)
            keys_by_ns[ns] = set()
    return keys_by_ns


def discover_ns_prefixes(src: str) -> List[Tuple[str, Optional[str]]]:
    """
    Discovers useTranslation namespace and keyPrefix pairs in a source file.

    Matches patterns like:
        useTranslation('translation', { keyPrefix: 'dashboard' })
        useTranslation('common')
        useTranslation()

    If no calls are found, defaults to [('translation', None)].

    Args:
        src (str): File contents to scan.

    Returns:
        list[tuple[str, str | None]]: (namespace, keyPrefix) pairs in order found.
    """
    pairs: List[Tuple[str, Optional[str]]] = []
    for m in USE_T_CALL.finditer(src):
        arg1 = (m.group("arg1") or "").strip()
        arg2 = m.group("arg2") or ""
        # Determine namespace (defaults to 'translation')
        ns = "translation"
        mns = ARG1_NS.match(arg1)
        if mns:
            ns = mns.group("ns")

        # Determine keyPrefix if present anywhere in arg2 object
        prefix: Optional[str] = None
        mp = ARG2_PREFIX.search(arg2)
        if mp:
            prefix = mp.group("prefix").strip()

        pair = (ns, prefix)
        if pair not in pairs:
            pairs.append(pair)

    if not pairs:
        pairs.append(("translation", None))
    return pairs


def literal_t_keys(src: str) -> List[Tuple[str, str]]:
    """
    Extracts literal translation calls with string keys.

    Detects t('...'), i18n.t('...'), and tCommon('...') with literal string
    arguments only (dynamic expressions are ignored).

    Args:
        src (str): File contents to scan.

    Returns:
        list[tuple[str, str]]: A list of (kind, key) where kind is 't' or 'tCommon'.
    """
    out: List[Tuple[str, str]] = []
    for m in T_LIT.finditer(src):
        out.append(("t", m.group("key")))
    for m in T_COMMON_LIT.finditer(src):
        out.append(("tCommon", m.group("key")))
    return out


def keyPrefix_hint(ns_prefixes: List[Tuple[str, Optional[str]]], key: str) -> str:
    """
    Returns a suggested fully-qualified key using the first discovered keyPrefix.

    Args:
        ns_prefixes (list[tuple[str, str | None]]): Discovered (namespace, keyPrefix) pairs.
        key (str): The unqualified translation key.

    Returns:
        str: Suggested fully-qualified key (e.g., 'dashboard.viewAll') or the original key.
    """
    for _, prefix in ns_prefixes:
        if prefix:
            return f"{prefix}.{key}"
    return key


def validate_file(path: str, keys_by_ns: Dict[str, Set[str]]) -> List[str]:
    """
    Validates translation calls in a single file against loaded locale keys.

    For t('key') calls, the function tests both:
        - prefix + '.' + key for each discovered (namespace, keyPrefix), and
        - key at the namespace root for each discovered namespace.
    For tCommon('key'), the function validates only against the 'common' namespace.

    Args:
        path (str): Path to the file being validated.
        keys_by_ns (dict[str, set[str]]): Flattened locale keys indexed by namespace.

    Returns:
        list[str]: A list of human-readable error messages; empty if the file is valid.
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            src = f.read()
    except Exception as e:
        return [f"{path}: cannot read file: {e}"]

    ns_prefixes = discover_ns_prefixes(src)
    calls = literal_t_keys(src)

    errors: List[str] = []
    for kind, key in calls:
        if kind == "tCommon":
            valid = key in keys_by_ns.get("common", set())
            if not valid:
                errors.append(f"{path}: missing key in common.json -> {key}")
            continue

        valid = False
        for ns, prefix in ns_prefixes:
            ns_keys = keys_by_ns.get(ns, set())
            if prefix and f"{prefix}.{key}" in ns_keys:
                valid = True
                break
            if key in ns_keys:
                valid = True
                break

        if not valid:
            discovered = ", ".join(
                [f"{ns}:{p or '(no prefix)'}" for ns, p in ns_prefixes]
            )
            hint = keyPrefix_hint(ns_prefixes, key)
            errors.append(
                f"{path}: missing key for t('{key}'). Checked → [{discovered}]. "
                f"Hint: if keyPrefix is used, ensure '{hint}' exists."
            )

    return errors


def main(argv: List[str]) -> int:
    """
    CLI entry point for the translation tag check.

    Args:
        argv (list[str]): Command-line arguments; expects '--files <paths...>'.

    Returns:
        int: Process exit code (0 on success, non-zero on validation failure).
    """
    parser = argparse.ArgumentParser(description="Translation tag check (keyPrefix-aware).")
    parser.add_argument("--files", nargs="+", help="List of changed files to check", required=True)
    args = parser.parse_args(argv)

    keys_by_ns = load_locale_keys()
    all_errors: List[str] = []

    # Only check source files; ignore tests by convention
    exts = (".ts", ".tsx", ".js", ".jsx")
    for path in args.files:
        if not path.endswith(exts):
            continue
        if ".spec." in path or ".test." in path:
            continue
        if not os.path.exists(path):
            # The diff may include deleted/renamed files
            continue
        all_errors.extend(validate_file(path, keys_by_ns))

    if all_errors:
        print("Translation tag check failed:\n", file=sys.stderr)
        for e in all_errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print("Translation tag check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
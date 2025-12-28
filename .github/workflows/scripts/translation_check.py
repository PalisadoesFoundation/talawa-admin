#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import argparse
import json
import os
import re
import sys
from typing import Dict, Set, List, Tuple, Optional

# Paths to English locale files used as the source of truth
EN_LOCALES = {
    "translation": "public/locales/en/translation.json",
    "common": "public/locales/en/common.json",
    "errors": "public/locales/en/errors.json",
}

# Regexes to detect useTranslation calls and t() usages
# Matches: useTranslation('translation', { keyPrefix: 'dashboard' })
USE_T_WITH_PREFIX = re.compile(
    r"useTranslation\s*\(\s*(?:['\"](?P<ns>translation|common|errors)['\"])?\s*,\s*\{\s*keyPrefix\s*:\s*['\"](?P<prefix>[^'\"\s]+)['\"]\s*\}\s*\)"
)
# Matches: useTranslation('translation') or useTranslation() (defaults to 'translation')
USE_T_NO_PREFIX = re.compile(
    r"useTranslation\s*\(\s*(?:['\"](?P<ns>translation|common|errors)['\"])?\s*\)"
)

# Matches: t('key'), i18n.t('key'), tCommon('key')
T_LIT = re.compile(r"(?:\bi18n\s*\.\s*)?\bt\s*\(\s*['\"](?P<key>[^'\"\)]+)['\"]")
T_COMMON_LIT = re.compile(r"\btCommon\s*\(\s*['\"](?P<key>[^'\"\)]+)['\"]")

def flatten(obj, base="") -> Set[str]:
    out: Set[str] = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            nb = f"{base}.{k}" if base else k
            out.add(nb)
            out |= flatten(v, nb)
    elif isinstance(obj, list):
        # Lists do not contribute new dot-keys directly
        for i, v in enumerate(obj):
            out |= flatten(v, base)
    return out

def load_locale_keys() -> Dict[str, Set[str]]:
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
    Returns a list of (namespace, keyPrefix or None) discovered in the file.
    If no namespace is given, default to 'translation'.
    """
    pairs: List[Tuple[str, Optional[str]]] = []

    # useTranslation(..., { keyPrefix: 'x' })
    for m in USE_T_WITH_PREFIX.finditer(src):
        ns = m.group("ns") or "translation"
        prefix = m.group("prefix")
        pairs.append((ns, prefix))

    # useTranslation('ns') or useTranslation()
    for m in USE_T_NO_PREFIX.finditer(src):
        ns = m.group("ns") or "translation"
        # Only add a (ns, None) if we didn't already record this ns with any prefix
        if (ns, None) not in pairs:
            pairs.append((ns, None))
    if not pairs:
        # Default assumption: translation namespace without prefix
        pairs.append(("translation", None))
    return pairs

def literal_t_keys(src: str) -> List[Tuple[str, str]]:
    """
    Collect (kind, key) where kind in {'t','tCommon'} with only string-literal keys.
    """
    out: List[Tuple[str, str]] = []
    for m in T_LIT.finditer(src):
        out.append(("t", m.group("key")))
    for m in T_COMMON_LIT.finditer(src):
        out.append(("tCommon", m.group("key")))
    return out

def validate_file(path: str, keys_by_ns: Dict[str, Set[str]]) -> List[str]:
    """
    Returns a list of missing-key error strings for this file.
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
            # Force common namespace, no prefix handling for tCommon by convention
            valid = (key in keys_by_ns.get("common", set()))
            if not valid:
                errors.append(f"{path}: missing key in common.json -> {key}")
            continue

        # kind == 't' (default). Try combinations:
        # 1) any discovered (ns, prefix) → ns + '.' + prefix + '.' + key
        # 2) any discovered (ns, None)   → ns + '.' + key (top-level)
        valid = False
        for ns, prefix in ns_prefixes:
            ns_keys = keys_by_ns.get(ns, set())
            if prefix:
                if f"{prefix}.{key}" in ns_keys:
                    valid = True
                    break
            # also accept exact key at ns root
            if key in ns_keys:
                valid = True
                break
        if not valid:
            # Build a helpful hint
            discovered = ", ".join(
                [f"{ns}:{p or '(no prefix)'}" for ns, p in ns_prefixes]
            )
            errors.append(
                f"{path}: missing key for t('{key}'). Checked → [{discovered}]. "
                f"Hint: if keyPrefix is used, ensure '{keyPrefix_hint(ns_prefixes, key)}' exists."
            )

    return errors

def keyPrefix_hint(ns_prefixes: List[Tuple[str, Optional[str]]], key: str) -> str:
    for ns, prefix in ns_prefixes:
        if prefix:
            return f"{prefix}.{key}"
    return key

def main(argv: List[str]) -> int:
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
            # The job may list deleted paths; skip safely
            continue
        errs = validate_file(path, keys_by_ns)
        all_errors.extend(errs)

    if all_errors:
        print("Translation tag check failed:\n", file=sys.stderr)
        for e in all_errors:
            print(f"  - {e}", file=sys.stderr)
        return 1

    print("Translation tag check passed.")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
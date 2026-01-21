#!/usr/bin/env bash
#
# Shared helpers for staged file detection and filtering.
#

set -euo pipefail

_STAGED_CACHE_FILE=""

cleanup_staged_cache() {
  [ -n "${_STAGED_CACHE_FILE:-}" ] && rm -f "$_STAGED_CACHE_FILE"
}


get_staged_files() {
  include="${1:-}"
  exclude="${2:-}"

  if [ -z "$_STAGED_CACHE_FILE" ]; then
    _STAGED_CACHE_FILE=$(mktemp)
    git diff --cached -z --name-only --diff-filter=ACMRT > "$_STAGED_CACHE_FILE" || true
  fi

  if [ -z "$include" ] && [ -z "$exclude" ]; then
    cat "$_STAGED_CACHE_FILE"
    return
  fi

  if [ -n "$include" ] && [ -n "$exclude" ]; then
    # Use perl for cross-platform null-delimited filtering
    perl -0 -ne "print if m{$include} && !m{$exclude}" "$_STAGED_CACHE_FILE" || true
    return
  fi

  if [ -n "$include" ]; then
    perl -0 -ne "print if m{$include}" "$_STAGED_CACHE_FILE" || true
    return
  fi

  perl -0 -ne "print if !m{$exclude}" "$_STAGED_CACHE_FILE" || true
}
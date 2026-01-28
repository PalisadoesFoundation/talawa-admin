#!/usr/bin/env bash
#
# =============================================================================
# Pre-Commit Node.js Checks
# =============================================================================
#
# Runs all Node.js-related validations on staged files to ensure
# code quality and CI parity before commits are created.
#
# Checks include:
# - Documentation generation and ToC updates
# - Code formatting and linting
# - TypeScript type checking
# - i18n validation on staged files
# - Dependency and dead-code analysis (Knip)
# - Policy checks (MinIO, mocks, localStorage usage)
#
# Design Notes:
# - Exits early if no staged source files are provided
# - Uses pnpm for consistency with project tooling
# - Keeps behavior aligned with CI to avoid surprises
#
# =============================================================================
set -euo pipefail

PIDS=()
cleanup_bg() {
  for pid in "${PIDS[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
}
trap cleanup_bg EXIT

STAGED_SRC_FILE="$1"

[ ! -s "$STAGED_SRC_FILE" ] && {
  echo "Skipping Node.js checks (no staged source files)..."
  exit 0
}

echo "Running Node.js pre-commit checks..."

pnpm run generate-docs &
PID_DOCS=$!
PIDS+=("$PID_DOCS")

pnpm run format:fix || exit 1
pnpm run lint-staged || exit 1

pnpm run typecheck &
PID_TYPECHECK=$!
PIDS+=("$PID_TYPECHECK")

wait "$PID_DOCS"; STATUS_DOCS=$?
wait "$PID_TYPECHECK"; STATUS_TYPECHECK=$?
if [ "$STATUS_DOCS" -ne 0 ] || [ "$STATUS_TYPECHECK" -ne 0 ]; then
  echo "Background task failure"
  exit 1
fi

xargs -0 pnpm run check-i18n -- --staged < "$STAGED_SRC_FILE"

# MinIO compliance check (prevent unsupported upload patterns)
echo "Running MinIO compliance check (policy enforcement)..."
node .github/workflows/scripts/check-minio-compliance.cjs || exit 1

pnpm run update:toc || exit 1
pnpm run check:pom || exit 1

npx knip --include files,exports,nsExports,nsTypes &
PID_KNIP1=$!
PIDS+=("$PID_KNIP1")

npx knip --config knip.deps.json --include dependencies &
PID_KNIP2=$!
PIDS+=("$PID_KNIP2")

wait "$PID_KNIP1"; STATUS_KNIP1=$?
wait "$PID_KNIP2"; STATUS_KNIP2=$?
if [ "$STATUS_KNIP1" -ne 0 ] || [ "$STATUS_KNIP2" -ne 0 ]; then
  echo "Background task failure"
  exit 1
fi

pnpm run check-mock-cleanup || exit 1
pnpm run check-route-prefix || exit 1
pnpm run check-localstorage || exit 1

git add docs/docs/auto-docs

echo "Node.js checks completed successfully."

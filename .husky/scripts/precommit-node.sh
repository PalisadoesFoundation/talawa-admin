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

STAGED_SRC_FILE="$1"

[ ! -s "$STAGED_SRC_FILE" ] && exit 0

echo "Running Node.js pre-commit checks..."

pnpm run generate-docs &
PID_DOCS=$!

pnpm run format:fix || exit 1
pnpm run lint-staged || exit 1

pnpm run typecheck &
PID_TYPECHECK=$!

wait "$PID_DOCS" || { echo "Documentation generation failed"; exit 1; }
wait "$PID_TYPECHECK" || { echo "Type checking failed"; exit 1; }

xargs -0 pnpm run check-i18n -- --staged < "$STAGED_SRC_FILE"

# MinIO compliance check (prevent unsupported upload patterns)
echo "Running MinIO compliance check (policy enforcement)..."
node .github/workflows/scripts/check-minio-compliance.cjs || exit 1

pnpm run update:toc || exit 1
pnpm run check:pom || exit 1

npx knip --include files,exports,nsExports,nsTypes &
PID_KNIP1=$!

npx knip --config knip.deps.json --include dependencies &
PID_KNIP2=$!

wait "$PID_KNIP1" || exit 1
wait "$PID_KNIP2" || exit 1

pnpm run check-mock-cleanup || exit 1
pnpm run check-localstorage || exit 1

git add docs/docs/auto-docs

echo "Node.js checks completed successfully."

#!/usr/bin/env sh
#
# Pre-commit script for Node.js checks.
# Runs formatters, linters, type checks, and various CI parity checks on staged files.
# Used by pre-commit hooks to enforce code quality before commits.
#
set -euo pipefail

STAGED_SRC_FILE="$1"

[ ! -s "$STAGED_SRC_FILE" ] && exit 0

echo "Running Node.js pre-commit checks..."

pnpm run generate-docs
git add docs/docs/auto-docs
pnpm run format:fix
pnpm run lint-staged
pnpm run typecheck
xargs -0 < "$STAGED_SRC_FILE" pnpm run check-i18n -- --staged

# MinIO compliance check (prevent unsupported upload patterns)
echo "Running MinIO compliance check (policy enforcement)..."
node .github/workflows/scripts/check-minio-compliance.cjs || exit 1

pnpm run update:toc
pnpm run check:pom
npx knip --include files,exports,nsExports,nsTypes
npx knip --config knip.deps.json --include dependencies
pnpm run check-mock-cleanup
pnpm run check-localstorage

echo "Node.js checks completed successfully."

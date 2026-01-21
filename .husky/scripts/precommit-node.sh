#!/bin/sh
#
# Pre-commit script for Node.js checks.
# Runs formatters, linters, type checks, and various CI parity checks on staged files.
# Used by pre-commit hooks to enforce code quality before commits.
#

set -eu

STAGED_SRC_FILE="$1"

if [ ! -s "$STAGED_SRC_FILE" ]; then
  exit 0
fi

echo "Running Node.js pre-commit checks..."

pnpm run generate-docs || exit 1
pnpm run format:fix || exit 1
pnpm run lint-staged || exit 1
pnpm run typecheck || exit 1
xargs -0 -a "$STAGED_SRC_FILE" pnpm run check-i18n -- --staged || exit 1

# MinIO compliance check (prevent unsupported upload patterns)
echo "Running MinIO compliance check (policy enforcement)..."
node .github/workflows/scripts/check-minio-compliance.cjs || exit 1

pnpm run update:toc || exit 1
pnpm run check:pom || exit 1
npx knip --include files,exports,nsExports,nsTypes || exit 1
npx knip --config knip.deps.json --include dependencies || exit 1
pnpm run check-mock-cleanup || exit 1
pnpm run check-localstorage || exit 1

echo "Node.js checks completed successfully."
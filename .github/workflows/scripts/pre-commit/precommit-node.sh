#!/usr/bin/env sh
#
# Pre-commit script for Node.js checks.
# Runs formatters, linters, type checks, and various CI parity checks on staged files.
# Used by pre-commit hooks to enforce code quality before commits.
#
set -e

STAGED_SRC="$1"

if [ -z "$STAGED_SRC" ]; then
  echo "No staged files detected. Skipping Node.js checks."
  exit 0
fi

echo "Running Node.js pre-commit checks..."

pnpm run generate-docs
pnpm run format:fix
pnpm run lint-staged
pnpm run typecheck
pnpm run check-i18n -- --staged "$STAGED_SRC"

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

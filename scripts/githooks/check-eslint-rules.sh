#!/bin/bash

set -euo pipefail

echo "Running ESLint rule tests..."
pnpm test:eslint-rules

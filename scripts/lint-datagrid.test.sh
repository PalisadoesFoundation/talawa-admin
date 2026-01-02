#!/bin/bash

# Test suite for lint-datagrid.sh
# This tests detection, exit codes, and edge cases

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LINT_SCRIPT="$SCRIPT_DIR/lint-datagrid.sh"
TEST_DIR="$(mktemp -d)"
ORIGINAL_DIR="$(pwd)"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Cleanup function
cleanup() {
  cd "$ORIGINAL_DIR"
  rm -rf "$TEST_DIR"
}
trap cleanup EXIT

# Test helper functions
announce_test() {
  echo -e "${YELLOW}TEST: $1${NC}"
  ((TESTS_RUN++))
}

pass_test() {
  echo -e "${GREEN}✓ PASS${NC}"
  ((TESTS_PASSED++))
  echo ""
}

fail_test() {
  echo -e "${RED}✗ FAIL: $1${NC}"
  ((TESTS_FAILED++))
  echo ""
}

# Setup test environment
cd "$TEST_DIR"
mkdir -p src/screens/Dashboard
mkdir -p src/components
mkdir -p src/shared-components

# ============================================================================
# Test 1: Detect @mui/x-data-grid import in src/screens
# ============================================================================
announce_test "Detect @mui/x-data-grid import in src/screens"

cat > src/screens/Dashboard/Dashboard.tsx <<'EOF'
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function Dashboard() {
  return <div>Dashboard</div>;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Test 2: Detect <DataGrid usage in src/screens
# ============================================================================
announce_test "Detect <DataGrid usage in src/screens"

cat > src/screens/Dashboard/Dashboard.tsx <<'EOF'
import React from 'react';

export default function Dashboard() {
  return <DataGrid rows={[]} columns={[]} />;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Test 3: Pass when using DataGridWrapper in src/screens
# ============================================================================
announce_test "Pass when using DataGridWrapper in src/screens"

cat > src/screens/Dashboard/Dashboard.tsx <<'EOF'
import React from 'react';
import DataGridWrapper from '@/shared-components/DataGridWrapper';

export default function Dashboard() {
  return <DataGridWrapper rows={[]} columns={[]} />;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $?"
fi

# ============================================================================
# Test 4: Ignore forbidden patterns outside src/screens
# ============================================================================
announce_test "Ignore forbidden patterns outside src/screens"

cat > src/components/SomeComponent.tsx <<'EOF'
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function SomeComponent() {
  return <DataGrid rows={[]} columns={[]} />;
}
EOF

cat > src/shared-components/Wrapper.tsx <<'EOF'
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function Wrapper() {
  return <DataGrid rows={[]} columns={[]} />;
}
EOF

# Clean src/screens
cat > src/screens/Dashboard/Dashboard.tsx <<'EOF'
import React from 'react';

export default function Dashboard() {
  return <div>Clean</div>;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $? (should ignore files outside src/screens)"
fi

# ============================================================================
# Test 5: Handle empty src/screens directory
# ============================================================================
announce_test "Handle empty src/screens directory"

rm -rf src/screens/*

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $?"
fi

# ============================================================================
# Test 6: Handle nested files in src/screens
# ============================================================================
announce_test "Detect forbidden pattern in deeply nested src/screens file"

mkdir -p src/screens/Dashboard/Components/Table
cat > src/screens/Dashboard/Components/Table/UserTable.tsx <<'EOF'
import { DataGrid } from '@mui/x-data-grid';
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Test 7: Handle multiple pattern matches in same file
# ============================================================================
announce_test "Detect multiple forbidden patterns in same file"

cat > src/screens/Test.tsx <<'EOF'
import { DataGrid } from '@mui/x-data-grid';

export default function Test() {
  return <DataGrid rows={[]} />;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Test 8: Pass with no forbidden patterns in src/screens
# ============================================================================
announce_test "Pass with clean files in src/screens"

rm -rf src/screens/*
mkdir -p src/screens/Dashboard

cat > src/screens/Dashboard/Dashboard.tsx <<'EOF'
import React from 'react';
import DataGridWrapper from '@/shared-components/DataGridWrapper';

export default function Dashboard() {
  return (
    <div>
      <DataGridWrapper rows={[]} columns={[]} />
    </div>
  );
}
EOF

cat > src/screens/Dashboard/Settings.tsx <<'EOF'
import React from 'react';

export default function Settings() {
  return <div>Settings</div>;
}
EOF

if bash "$LINT_SCRIPT" > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $?"
fi

# ============================================================================
# Test 9: Lint-staged mode - check specific file with forbidden pattern
# ============================================================================
announce_test "Lint-staged mode: detect forbidden pattern in specified file"

cat > src/screens/Bad.tsx <<'EOF'
import { DataGrid } from '@mui/x-data-grid';
EOF

if bash "$LINT_SCRIPT" src/screens/Bad.tsx > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Test 10: Lint-staged mode - pass for clean file
# ============================================================================
announce_test "Lint-staged mode: pass for clean file"

cat > src/screens/Good.tsx <<'EOF'
import React from 'react';
export default function Good() {}
EOF

if bash "$LINT_SCRIPT" src/screens/Good.tsx > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $?"
fi

# ============================================================================
# Test 11: Lint-staged mode - ignore files outside src/screens
# ============================================================================
announce_test "Lint-staged mode: ignore files outside src/screens"

cat > src/components/Outside.tsx <<'EOF'
import { DataGrid } from '@mui/x-data-grid';
EOF

if bash "$LINT_SCRIPT" src/components/Outside.tsx > /dev/null 2>&1; then
  pass_test
else
  fail_test "Expected exit code 0 but got $? (should ignore non-src/screens files)"
fi

# ============================================================================
# Test 12: Lint-staged mode - multiple files, some with forbidden patterns
# ============================================================================
announce_test "Lint-staged mode: multiple files with mixed patterns"

cat > src/screens/File1.tsx <<'EOF'
import React from 'react';
EOF

cat > src/screens/File2.tsx <<'EOF'
import { DataGrid } from '@mui/x-data-grid';
EOF

if bash "$LINT_SCRIPT" src/screens/File1.tsx src/screens/File2.tsx > /dev/null 2>&1; then
  fail_test "Expected exit code 1 but got 0"
else
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 1 ]; then
    pass_test
  else
    fail_test "Expected exit code 1 but got $EXIT_CODE"
  fi
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "======================================"
echo "Test Results"
echo "======================================"
echo -e "Total tests run: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed.${NC}"
  exit 1
fi

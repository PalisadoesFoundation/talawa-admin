#!/bin/bash

# Script to check that ALL test files have proper afterEach cleanup
# to prevent mock leakage and ensure test isolation

echo "🔍 Checking for proper mock cleanup in all test files..."

# Find all .spec.ts and .spec.tsx files in src/
files_without_cleanup=$(find src/ \( -iname "*.spec.tsx" -o -iname "*.spec.ts" \) \
  | while read -r file; do
      # Check if file uses vi.fn, vi.mock, or spyOn (indicating it uses mocks)
      if grep -q -E "(vi\.fn|vi\.mock|spyOn)" "$file"; then
        # Check if file has afterEach with proper cleanup
        if ! grep -q -E "afterEach.*\(.*vi\.(restoreAllMocks|clearAllMocks|resetAllMocks)" "$file"; then
          echo "$file"
        fi
      fi
    done)

if [ -n "$files_without_cleanup" ]; then
  echo ""
  echo "❌ Error: The following test files use mocks but lack proper afterEach cleanup:"
  echo ""
  echo "$files_without_cleanup"
  echo ""
  echo "💡 To fix this, add an afterEach block with vi.restoreAllMocks(), vi.clearAllMocks(), or vi.resetAllMocks()"
  echo ""
  echo "Example:"
  echo ""
  echo "  afterEach(() => {"
  echo "    vi.restoreAllMocks();"
  echo "  });"
  echo ""
  echo "This ensures test isolation and prevents mock leakage between tests."
  echo ""
  exit 1
else
  echo "✅ All test files have proper mock cleanup!"
  exit 0
fi

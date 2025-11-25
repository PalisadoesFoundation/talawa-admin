#!/bin/bash

# Script to check that ALL test files have proper afterEach cleanup
# to prevent mock leakage and ensure test isolation
# 
# This script is designed to minimize false positives for CI/CD integration

echo "🔍 Checking for proper mock cleanup in all test files..."

# Find all .spec.ts and .spec.tsx files in src/
files_without_cleanup=$(find src/ \( -iname "*.spec.tsx" -o -iname "*.spec.ts" \) \
  | while read -r file; do
      # Check if file uses mocking functions (vi.fn, vi.mock, spyOn)
      # EXCLUDE commented lines to avoid false positives
      if grep -v "^[[:space:]]*//.*vi\." "$file" | grep -q -E "(vi\.fn|vi\.mock|spyOn)"; then
        
        # Check if file has ANY form of afterEach block
        if ! grep -q "afterEach" "$file"; then
          # No afterEach at all - definite issue
          echo "$file"
          continue
        fi
        
        # File has afterEach - check if it contains proper cleanup
        # Check within 10 lines of afterEach for cleanup methods
        has_cleanup=false
        
        # Check if ANY afterEach block contains cleanup methods
        if grep -A 10 "afterEach" "$file" | grep -q -E "vi\.(restoreAllMocks|clearAllMocks|resetAllMocks|resetModules)"; then
          has_cleanup=true
        fi
        
        # Additional check: sometimes cleanup is in beforeEach instead (less common but valid)
        if grep -A 5 "beforeEach" "$file" | grep -q -E "vi\.(restoreAllMocks|clearAllMocks|resetAllMocks|resetModules)"; then
          has_cleanup=true
        fi
        
        # If no cleanup found, flag the file
        if [ "$has_cleanup" = false ]; then
          echo "$file"
        fi
      fi
    done)

if [ -n "$files_without_cleanup" ]; then
  file_count=$(echo "$files_without_cleanup" | wc -l | tr -d ' ')
  echo ""
  echo "❌ Found $file_count test file(s) that may need mock cleanup review:"
  echo ""
  echo "$files_without_cleanup"
  echo ""
  echo "💡 These files use mocks (vi.fn, vi.mock, spyOn) but may be missing cleanup."
  echo ""
  echo "✨ Recommended fix - add to your test file:"
  echo ""
  echo "  afterEach(() => {"
  echo "    vi.restoreAllMocks();  // Recommended for most cases"
  echo "  });"
  echo ""
  echo "OR for module mocks:"
  echo ""
  echo "  afterEach(() => {"
  echo "    vi.resetModules();     // For vi.mock() module mocks"
  echo "  });"
  echo ""
  echo "📚 Why this matters: Proper cleanup prevents mock leakage between tests,"
  echo "   ensuring test isolation and avoiding flaky tests."
  echo ""
  echo "⚠️  If you believe this is a false positive, please verify your test file"
  echo "   has proper cleanup, or contact the maintainers for assistance."
  echo ""
  exit 1
else
  echo "✅ All test files have proper mock cleanup!"
  exit 0
fi

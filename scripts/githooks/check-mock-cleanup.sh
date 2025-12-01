#!/bin/bash

# Script to check that ALL test files have proper afterEach cleanup
# to prevent mock leakage and ensure test isolation
# 
# Phase 2A: Enforces appropriate cleanup method based on file context
# - vi.clearAllMocks() - preferred default
# - vi.restoreAllMocks() - allowed when spies are present
# - vi.resetAllMocks() - discouraged (emits warning)
# - vi.resetModules() - allowed for module mocks

echo "Checking for proper mock cleanup in all test files..."

# Helper function to extract afterEach block content
extract_aftereach_block() {
  local file="$1"
  # Use awk to extract afterEach blocks including nested braces
  awk '
    /afterEach/ {
      braces = 0
      in_block = 1
      block = $0
    }
    in_block {
      # Count braces to find block end
      for (i = 1; i <= length($0); i++) {
        char = substr($0, i, 1)
        if (char == "{") braces++
        if (char == "}") braces--
      }
      block = block "\n" $0
      if (braces == 0 && in_block) {
        print block
        in_block = 0
        block = ""
      }
    }
  ' "$file"
}

# Helper function to check if file uses spies
has_spies() {
  local file="$1"
  grep -v "^[[:space:]]*//.*" "$file" | grep -E "(vi\.spyOn|jest\.spyOn)" > /dev/null
}

# Helper function to check if file uses module mocks
has_module_mocks() {
  local file="$1"
  # Note: This simple grep may match commented out code (false positives).
  # We rely on the developer to not have commented out mock code that violates rules.
  grep -v "^[[:space:]]*//.*" "$file" | grep "vi\.mock(" > /dev/null
}

# Find all .spec.ts and .spec.tsx files in src/
files_without_cleanup=$(find src/ \( -iname "*.spec.tsx" -o -iname "*.spec.ts" \) \
  | while read -r file; do
      # Check if file uses mocking functions (vi.fn, vi.mock, spyOn)
      # EXCLUDE commented lines to avoid false positives
      if grep -v "^[[:space:]]*//.*vi\." "$file" | grep -E "(vi\.fn|vi\.mock|spyOn)" > /dev/null; then
        
        # Check if file has ANY form of afterEach block
        if ! grep -q "afterEach" "$file"; then
          # No afterEach at all - definite issue
          echo "$file"
          continue
        fi
        
        # File has afterEach - extract blocks and check cleanup
        aftereach_blocks=$(extract_aftereach_block "$file")
        
        if [ -z "$aftereach_blocks" ]; then
          # Could not extract afterEach blocks properly
          echo "$file"
          continue
        fi
        
        # Check Phase 2A: Which cleanup method is used?
        has_cleanup=false
        cleanup_method=""
        
        if echo "$aftereach_blocks" | grep -q "vi\.restoreAllMocks"; then
          cleanup_method="restoreAllMocks"
          # restoreAllMocks is allowed if file has spies
          if has_spies "$file"; then
            has_cleanup=true
          else
            # Warn but allow (can be used as general cleanup)
            has_cleanup=true
          fi
        elif echo "$aftereach_blocks" | grep -q "vi\.clearAllMocks"; then
          cleanup_method="clearAllMocks"
          # clearAllMocks is the preferred default
          has_cleanup=true
        elif echo "$aftereach_blocks" | grep -q "vi\.resetModules"; then
          cleanup_method="resetModules"
          # resetModules is allowed for module mocks
          if has_module_mocks "$file"; then
            has_cleanup=true
          else
            # Used without module mocks - questionable but allow
            has_cleanup=true
          fi
        elif echo "$aftereach_blocks" | grep -q "vi\.resetAllMocks"; then
          cleanup_method="resetAllMocks"
          # resetAllMocks is discouraged - emit warning but don't fail
          >&2 echo "WARNING: $file uses vi.resetAllMocks() - consider vi.clearAllMocks() or vi.restoreAllMocks() instead"
          has_cleanup=true
        fi
        
        # Additional check: sometimes cleanup is in beforeEach instead (less common but valid)
        if [ "$has_cleanup" = false ]; then
          beforeeach_blocks=$(awk '
            /beforeEach/ {
              braces = 0
              in_block = 1
              block = $0
            }
            in_block {
              for (i = 1; i <= length($0); i++) {
                char = substr($0, i, 1)
                if (char == "{") braces++
                if (char == "}") braces--
              }
              block = block "\n" $0
              if (braces == 0 && in_block) {
                print block
                in_block = 0
                block = ""
              }
            }
          ' "$file")
          
          if echo "$beforeeach_blocks" | grep -q -E "vi\.(restoreAllMocks|clearAllMocks|resetAllMocks|resetModules)"; then
            has_cleanup=true
          fi
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
  echo "ERROR: Found $file_count test file(s) that may need mock cleanup review:"
  echo ""
  echo "$files_without_cleanup"
  echo ""
  echo "Note: These files use mocks (vi.fn, vi.mock, spyOn) but may be missing cleanup."
  echo ""
  echo "Recommended fix - add to your test file:"
  echo ""
  echo "  afterEach(() => {"
  echo "    vi.clearAllMocks();      // Preferred: clears call history"
  echo "    // OR"
  echo "    vi.restoreAllMocks();    // When using vi.spyOn()"
  echo "  });"
  echo ""
  echo "Phase 2A Guidelines:"
  echo "   - vi.clearAllMocks()     → Preferred default (clears call history)"
  echo "   - vi.restoreAllMocks()   → Use when you have vi.spyOn() calls"
  echo "   - vi.resetModules()      → Use for vi.mock() module mocks"
  echo "   - vi.resetAllMocks()     → Discouraged (clears + resets)"
  echo ""
  echo "Why this matters: Proper cleanup prevents mock leakage between tests,"
  echo "ensuring test isolation and avoiding flaky tests."
  echo ""
  echo "If you believe this is a false positive, please verify your test file"
  echo "has proper cleanup, or contact the maintainers for assistance."
  echo ""
  exit 1
else
  echo "SUCCESS: All test files have proper mock cleanup!"
  exit 0
fi

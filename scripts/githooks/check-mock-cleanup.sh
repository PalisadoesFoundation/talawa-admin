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
files_without_cleanup=$(find src/ \( -iname "*.spec.tsx" -o -iname "*.spec.ts" -o -iname "*.test.tsx" -o -iname "*.test.ts" \) \
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
          # shellcheck disable=SC2034
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

# Additional validation: Check for window/document manipulation without cleanup
echo "Checking for window/document manipulation and timer usage..."

files_with_global_issues=$(find src/ \( -iname "*.spec.tsx" -o -iname "*.spec.ts" -o -iname "*.test.tsx" -o -iname "*.test.ts" \) \
  | while read -r file; do
      has_issue=false
      issue_data=""
      
      # Check for window manipulation (assignments like window.x = ...)
      if grep -n -v "^[[:space:]]*//.*" "$file" | grep -E "window\.[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*=" > /dev/null; then
        # Check for explicit cleanup patterns
        has_cleanup=false
        
        # Look for window restoration patterns
        if grep -q -E "(delete window\.|window\.[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*=[[:space:]]*(undefined|original|saved))" "$file" || \
           grep -q -E "(const|let|var)[[:space:]]+original.*window" "$file" || \
           grep -q -E "Object\.defineProperty\(window.*original" "$file"; then
          # Check if cleanup is in afterEach/beforeEach
          if grep -q "afterEach" "$file" || grep -q "beforeEach" "$file"; then
            has_cleanup=true
          fi
        fi
        
        if [ "$has_cleanup" = false ]; then
          # Get line numbers and snippets
          line_info=$(grep -n -v "^[[:space:]]*//.*" "$file" | grep -E "window\.[a-zA-Z_][a-zA-Z0-9_]*[[:space:]]*=" | head -1)
          line_num=$(echo "$line_info" | cut -d: -f1)
          snippet=$(echo "$line_info" | cut -d: -f2- | sed 's/^[[:space:]]*//' | cut -c1-60)
          has_issue=true
          issue_data="${issue_data}window-manipulation|${line_num}|${snippet};"
        fi
      fi
      
      # Check for document.addEventListener without cleanup
      if grep -n -v "^[[:space:]]*//.*" "$file" | grep "document\.addEventListener" > /dev/null; then
        # Check for explicit removeEventListener or cleanup
        has_cleanup=false
        
        if grep -q "document\.removeEventListener" "$file" || \
           grep -q "removeEventListener" "$file" || \
           (grep -q "afterEach" "$file" && grep -A 10 "afterEach" "$file" | grep -q "removeEventListener"); then
          has_cleanup=true
        fi
        
        if [ "$has_cleanup" = false ]; then
          line_info=$(grep -n -v "^[[:space:]]*//.*" "$file" | grep "document\.addEventListener" | head -1)
          line_num=$(echo "$line_info" | cut -d: -f1)
          snippet=$(echo "$line_info" | cut -d: -f2- | sed 's/^[[:space:]]*//' | cut -c1-60)
          has_issue=true
          issue_data="${issue_data}document-listeners|${line_num}|${snippet};"
        fi
      fi
      
      # Check for fake timers usage
      if grep -n -v "^[[:space:]]*//.*" "$file" | grep -E "vi\.useFakeTimers\(" > /dev/null; then
        # Check for proper timer cleanup
        aftereach_blocks=$(extract_aftereach_block "$file")
        if ! echo "$aftereach_blocks" | grep -q "vi\.clearAllTimers\|vi\.useRealTimers"; then
          line_info=$(grep -n -v "^[[:space:]]*//.*" "$file" | grep -E "vi\.useFakeTimers\(" | head -1)
          line_num=$(echo "$line_info" | cut -d: -f1)
          snippet=$(echo "$line_info" | cut -d: -f2- | sed 's/^[[:space:]]*//' | cut -c1-60)
          has_issue=true
          issue_data="${issue_data}fake-timers|${line_num}|${snippet};"
        fi
      fi
      
      # Report file if it has any issues
      if [ "$has_issue" = true ]; then
        echo "${file}::${issue_data}"
      fi
    done)

# Report findings
exit_code=0

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
  exit_code=1
fi

if [ -n "$files_with_global_issues" ]; then
  echo ""
  echo "WARNING: Found test file(s) with potential global state issues:"
  echo ""
  
  # Parse and group issues by type with details
  declare -a window_issues
  declare -a listener_issues
  declare -a timer_issues
  
  while IFS='::' read -r filepath issue_data; do
    # Parse multiple issues from the same file
    IFS=';' read -ra ISSUES <<< "$issue_data"
    for issue in "${ISSUES[@]}"; do
      if [ -z "$issue" ]; then continue; fi
      
      IFS='|' read -r issue_type line_num snippet <<< "$issue"
      
      case "$issue_type" in
        window-manipulation)
          window_issues+=("$filepath:$line_num|$snippet")
          ;;
        document-listeners)
          listener_issues+=("$filepath:$line_num|$snippet")
          ;;
        fake-timers)
          timer_issues+=("$filepath:$line_num|$snippet")
          ;;
      esac
    done
  done <<< "$files_with_global_issues"
  
  if [ ${#window_issues[@]} -gt 0 ]; then
    echo "Files with window manipulation needing cleanup:"
    for entry in "${window_issues[@]}"; do
      IFS='|' read -r location snippet <<< "$entry"
      echo "  - $location"
      echo "      $snippet"
    done
    echo ""
    echo "Fix: Save and restore window properties:"
    echo "  const originalLocation = window.location;"
    echo "  afterEach(() => { window.location = originalLocation; });"
    echo ""
  fi
  
  if [ ${#listener_issues[@]} -gt 0 ]; then
    echo "Files with document event listeners needing cleanup:"
    for entry in "${listener_issues[@]}"; do
      IFS='|' read -r location snippet <<< "$entry"
      echo "  - $location"
      echo "      $snippet"
    done
    echo ""
    echo "Fix: Remove event listeners in cleanup:"
    echo "  afterEach(() => {"
    echo "    document.removeEventListener('event', handler);"
    echo "  });"
    echo ""
  fi
  
  if [ ${#timer_issues[@]} -gt 0 ]; then
    echo "Files using fake timers without proper cleanup:"
    for entry in "${timer_issues[@]}"; do
      IFS='|' read -r location snippet <<< "$entry"
      echo "  - $location"
      echo "      $snippet"
    done
    echo ""
    echo "Fix: Clear and restore timers:"
    echo "  afterEach(() => {"
    echo "    vi.clearAllTimers();"
    echo "    vi.useRealTimers();"
    echo "  });"
    echo ""
  fi
  
  echo "NOTE: These are warnings to improve test isolation."
  echo "They won't fail the build but should be addressed for reliable tests."
  echo ""
fi

if [ $exit_code -eq 1 ]; then
  echo "If you believe this is a false positive, please verify your test file"
  echo "has proper cleanup, or contact the maintainers for assistance."
  echo ""
  exit 1
else
  echo "SUCCESS: All test files have proper mock cleanup!"
  exit 0
fi

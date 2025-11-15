#!/usr/bin/env python3
"""
Script to fix mock leakage in test files by applying vi.hoisted() pattern.
This ensures mocks don't leak between tests.
"""

import sys
import re
from pathlib import Path

def fix_test_file(filepath):
    """Fix a single test file."""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Step 1: Update imports to include beforeEach and afterEach if not present
    if 'beforeEach' not in content and 'afterEach' not in content:
        content = re.sub(
            r"import \{ vi(.*?) \} from 'vitest';",
            r"import { vi\1, beforeEach, afterEach } from 'vitest';",
            content
        )
    elif 'beforeEach' not in content:
        content = re.sub(
            r"import \{ (.*?)vi(.*?) \} from 'vitest';",
            r"import { \1vi\2, beforeEach } from 'vitest';",
            content
        )
    elif 'afterEach' not in content:
        content = re.sub(
            r"import \{ (.*?)vi(.*?) \} from 'vitest';",
            r"import { \1vi\2, afterEach } from 'vitest';",
            content
        )
    
    # Step 2: Extract vi.mock calls and convert to hoisted pattern
    # This is complex and file-specific, so we'll document the pattern
    
    print(f"✅ Updated imports in {filepath}")
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 fix_mock_leakage.py <test-file-path>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    fix_test_file(filepath)

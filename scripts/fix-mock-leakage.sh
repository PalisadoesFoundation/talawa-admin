#!/bin/bash

# Script to fix mock leakage in test files
# This script applies the vi.hoisted() pattern to prevent mock leakage between tests

FIX_FILE=$1

if [ -z "$FIX_FILE" ]; then
    echo "Usage: $0 <test-file-path>"
    exit 1
fi

echo "Fixing mock leakage in: $FIX_FILE"

# Backup the original file
cp "$FIX_FILE" "$FIX_FILE.backup"

echo "✅ Backup created at: $FIX_FILE.backup"
echo "Now manually apply the vi.hoisted() pattern and add beforeEach/afterEach cleanup"

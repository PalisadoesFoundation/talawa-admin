@palisadoes 

I sincerely apologize for the issue with PR #4565. I've now identified and fixed the root cause in PR #4629.

# Root Cause Analysis

The coverage upload failure occurred due to two critical issues:

**1. Invalid Coverage Merging**

Each shard was generating its own `lcov.info` file, which we attempted to merge using `lcov-result-merger`. However, this tool concatenates files rather than properly merging them, resulting in malformed coverage data with duplicate line entries. Codecov rightfully rejected these invalid files, leading to the "No coverage report uploaded" error.

**2. Lack of Validation**

Empty or invalid coverage files could pass through without validation, further contributing to the problem.

# Solution Implemented

I've completely overhauled the coverage merging approach:

**1. Switched to `nyc merge`**

Instead of `lcov-result-merger`, we now use `nyc merge` which:
- Merges JSON coverage data intelligently (not concatenation)
- Properly handles overlapping coverage from multiple shards
- Generates a valid `lcov.info` file that Codecov accepts

**2. Added Comprehensive Validation**

- Validates that all coverage files exist and are non-empty before merging
- Fail-fast error handling with clear error messages
- Ensures merged coverage file is valid before upload

**3. Workflow Improvements**

- Simplified matrix configuration (removed redundant `total_shards` array)
- Consolidated validation logic to prevent redundant checks
- Better error reporting for debugging

# Verification

The fix is confirmed working:
- All 4 shards passing consistently
- Coverage successfully uploaded to Codecov: 92.64%
- Codecov properly reporting coverage data on PR #4629
- No "No coverage report uploaded" errors

I've tested this thoroughly and would greatly appreciate if you could review PR #4629 when you have a chance. Thank you for your patience and understanding.

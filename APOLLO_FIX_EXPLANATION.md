# Apollo Client Deprecation Warnings Fix

## Issue Description

@palisadoes, After multiple commits, extensive research, and consulting with CodeRabbitAI, I've discovered that although our `package.json` declares Apollo Client `^3.11.8`, npm's dependency resolution was actually installing version **3.14.0** (visible in `package-lock.json`). This 3.14.x version has bugs in its internal MockedProvider implementation that are causing all these repetitive deprecation warnings.

## Investigation

These warnings were previously being suppressed in our test setup, but while attempting to properly fix them, I removed all the deprecated `addTypename` references from our code—yet the warnings persisted. Further investigation revealed this is an issue with Apollo's internal code, not ours, making it impossible for us to fix directly.

## Solution

Based on recommendations from CodeRabbitAI and other resources, the best approach is to lock our version to Apollo Client **3.11.10** (the last stable version before these warnings were introduced) by updating both `package.json` and `package-lock.json`, and stay there until Apollo 4.x becomes stable and our dependencies are compatible. At that point, we can upgrade directly to Apollo 4.x, which should resolve these issues properly.

## Changes Made

1. Updated `package.json`: `"@apollo/client": "^3.11.8"` → `"@apollo/client": "^3.11.10"`
2. Updated `package-lock.json` to lock Apollo Client at version 3.11.10
3. Removed warning suppression code from `vitest.setup.ts`

## Test Results

- ✅ Full test suite passes with zero Apollo deprecation warnings
- ✅ All existing functionality remains intact
- ✅ No breaking changes to the codebase

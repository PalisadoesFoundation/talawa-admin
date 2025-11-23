@palisadoes 

# Summary of Changes & Fixes

This PR addresses issues that arose from **three main sources**: 
1. **Test isolation** exposing interdependency errors
2. **Pre-existing lint violations** exposed when modifying files (since our linter only checks altered files)
3. **Actual errors caused by the pnpm migration (#4745)**

Here is what I changed and why:

## 1. Test Isolation & Fixing Large Test Files (Screens Folder)
**The Problem:** 
*   While isolating tests in the screens folder, I discovered many tests were **interdependent** (relying on shared state or side effects). Isolation caused these fragile tests to fail.
*   Modifying these files exposed **pre-existing lint errors** that had been there all along but were never checked (our linter only checks *altered* files).
*   Some test files exceeded the **600-line limit**.

**The Fix:**
*   I split large test files (`.spec.tsx` files) into smaller parts to comply with the 600-line limit.
*   Fixed all the exposed lint errors.
*   Properly isolated all tests and implemented robust mocking strategies to ensure tests run independently without relying on each other.

**Why This Matters:** Independent, isolated tests are more reliable and prevent false positives/negatives. They also make debugging easier since failures are localized to specific test cases rather than cascading from test interdependencies.

## 2. Improved `UserPasswordUpdate`
**The Change:** I replaced `window.location.reload()` with a simple form reset.

**Why:** Suggested by **CodeRabbitAI**. Reloading the whole page is bad for user experience and makes testing very hard. Resetting the state is much cleaner and standard for SPAs.

**Why This Matters:** This change improves user experience by eliminating the jarring page reload flash, maintains application state that shouldn't be lost, and makes the component significantly easier to test in our JSDOM environment.

## 3. Fixed `check_pom.js` (Broken by pnpm Migration)
**The Problem:** The pnpm migration updated the `glob` package but didn't update `check_pom.js` to use the new API.

**The Fix:** I updated `check_pom.js` to work correctly with the new `glob` version.

**Why This Matters:** The POM (Page Object Model) check is critical for maintaining our Cypress test quality standards. Without this fix, the pre-commit hook was failing and blocking all commits.

## 4. Better Coverage Reports
**The Change:** I excluded `*.mocks.ts` files from test coverage.

**Why:** Confirmed with **CodeRabbitAI**. These are test fixtures, not source code. Including them made our coverage numbers inaccurate.

**Why This Matters:** Accurate coverage metrics help us identify genuinely untested code paths. Including mock/fixture files artificially inflated our line counts and diluted our actual source code coverage percentages.

## 5. `package.json` Fixes (pnpm Migration Cleanup)
*   **Removed `lcov-result-merger`:** This was added during the pnpm migration, but we don't need it because we already use the more efficient `nyc`.
*   **Fixed Apollo Client:** The pnpm migration caused `@apollo/client` to drift to an unstable beta version (`3.4.0-beta.19`) because `resolutions` took precedence. I have pinned it to **3.13.0** to fix errors and ensure stability.

**Why This Matters:** Removing redundant dependencies reduces bundle size and maintenance overhead. Pinning Apollo Client to a stable version prevents `addTypename` deprecation errors and ensures consistent behavior across all environments.

## 6. Code Cleanup
*   **GraphQL Service:** Fixed type errors and lint warnings by adding proper TypeScript types and removing `any` usage.
*   **Utils:** Added missing tests for utility functions to improve coverage.

**Why This Matters:** Type safety catches bugs at compile time rather than runtime, and comprehensive unit tests for utilities ensure these foundational functions work correctly across all use cases.

## 7. Faster CI/CD (`pull_request.yml`)
I implemented optimizations planned during the sharding work:
*   **Smarter Reporting:** The "Merge Report" now runs **only if all test shards pass**. This prevents uploading incomplete data to Codecov which is what used to happen when one or more shards failed.
*   **Parallel Docs Check:** The documentation check now runs **in parallel** with tests, instead of blocking them. This saves **2-3 minutes** per run.

**Why This Matters:** These optimizations save developer time on every PR (faster feedback loops), reduce Codecov API usage (preventing incomplete reports), and allow developers to see test results without waiting for unrelated documentation checks to complete first.

## Conclusion
This PR fixes errors caused by the pnpm migration, addresses pre-existing lint violations exposed during test isolation, and resolves test interdependence issues. It also optimizes the CI pipeline for better efficiency.

Kindly let me know if everything is fine, in case not please let me know what to change and fix.

---
id: testing
title: Testing
slug: /developer-resources/testing
sidebar_position: 60
---

## Introduction

It is important to test our code. If you are a contributor, please follow the guidance on this page.

### Developers using Microsoft Windows

All our workflows use Linux based commands, therefore if you are a developer who codes in Microsoft Windows then we strongly suggest that you use the Windows Subsystem for Linux (WSL) as your command line interface (CLI).

### UI/UX Testing

If you have loaded the API sample database, then you can login using the credentials found on the [testing page of the API documentation website](https://docs-api.talawa.io/docs/developer-resources/testing/)

## Pre-commit Hooks

To ensure the quality of the code in our pull requests, we have implemented hooks that run a series of scripts with each commit. These include scripts that:

1. Generate dooumentation from TypeDoc for the https://docs-admin.talawa.io website for easy cross referenced documentation for all methods, functions and classes
2. Fix formatting using `prettier`
3. Lints the code
4. Validate types using typecheck
5. Update markdown table of contents
6. Check for unused exports
7. Check for unused dependencies
8. Validate that testing uses mock cleanup correctly
9. Check for Page Object Model (POM) compliance for E2E tests
10. Check for hard coded text in screens that should be translated.

The full list of checks can be found in this file:

```
.husky/pre-commit
```

If violations are found, the commit is blocked with clear fix instructions.

:::warning

Our pull request checks also validate whether the pre-commit hooks have been applied and will fail if they were not. It is highly advised not to bypass the pre-commit hooks.

Make sure your last `git commit` before a `git push` does not bypass the hooks, and that all errors are corrected.

Only `git push` when the `git commit` checks pass.

:::

### Bypassing Hooks

You can bypass the pre-commit checks using the `--no-verify` flag with the `git commit` command.

```bash
git commit -m "message" --no-verify
```

:::warning

Our pull request checks also validate whether the pre-commit hooks have been applied and will fail if they were not. It is highly advised not to bypass the pre-commit hooks.

Make sure your last `git commit` before a `git push` does not bypass the hooks, and that all errors are corrected.

Only `git push` when the `git commit` checks pass.

:::

## Linting and Formatting

All pull requests must have code that is properly linted and formatted to ensure uniformity across the repository.

Before opening a PR, run the following scripts to automatically lint and format the code:

```bash
pnpm run lint:fix
pnpm run format:fix
```

Both scripts also have a `check` counterpart, which is used by GitHub CI to ensure that the code is properly formatted.
You can run these scripts yourself to ensure that your pull request doesn't fail due to linting and formatting errors:

```bash
pnpm run lint:check
pnpm run format:check
```

## Vitest Testing

This project uses [Vitest](https://vitest.dev/) as the testing framework.

### Running Tests

- **Run all tests:**

  ```bash
  pnpm run test
  ```

- **Run a single test file:**

  ```bash
  pnpm run test /path/to/test/file
  ```

- **Watch tests for changes:**
  ```bash
  pnpm run test:watch
  ```
  This opens the Vitest UI for interactive testing.

### Test Coverage

- **View coverage for all test files:**

  ```bash
  pnpm run test:coverage
  ```

- **View coverage for a single test file:**

  ```bash
  pnpm run test:coverage /path/to/test/file
  ```

- **Generate HTML coverage report:**
  ```bash
  pnpm run test:coverage
  genhtml coverage/lcov.info -o coverage
  ```
  The `genhtml` command is part of the Linux `lcov` package. Similar packages are available for Windows and MacOS.

### Test Sharding

For improved performance, especially in CI/CD environments, you can run tests in parallel using sharding:

```bash
pnpm run test:shard
```

To run a specific shard, use environment variables:

```bash
SHARD_INDEX=1 SHARD_COUNT=4 pnpm run test:shard
```

This divides the test suite into 4 parts and runs the 1st part. This is particularly useful for:

- Running tests in parallel across multiple CI jobs
- Faster test execution on multi-core systems
- Reducing overall test suite runtime

You can also run sharded tests with coverage:

```bash
pnpm run test:shard:coverage
```

### Test Isolation and Mock Cleanup

**IMPORTANT:** Proper test isolation is critical for reliable tests. All test files that use mocks MUST clean them up in `afterEach` to prevent mock leakage between tests.

#### The Mock Cleanup Rule

Every test file that uses `vi.mock()`, `vi.fn()`, or `vi.spyOn()` **MUST** include:

```typescript
describe('YourComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Your tests here
});
```

> **Why This Matters:** Without proper cleanup, mocks from one test can leak into others, causing:
>
> - Flaky tests that pass/fail randomly
> - Tests that fail when run in different orders
> - Hard-to-debug test failures in CI
> - False positives/negatives

#### Multi-Layer Enforcement

We enforce mock isolation through **three layers** to catch issues as early as possible:

##### ESLint (Real-time IDE Feedback)

A custom ESLint rule (`vitest-isolation/require-aftereach-cleanup`) detects missing mock cleanup **as you type**. Your IDE will show inline errors when:

- Test files use `vi.fn()`, `vi.mock()`, or `vi.spyOn()` without `afterEach` cleanup
- `afterEach` exists but is missing cleanup methods

The rule provides **autofix** capability - your IDE can automatically insert the proper `afterEach` block.

##### CI Check (GitHub Actions)

The `Check-Mock-Isolation` job runs on every PR to ensure repository-wide compliance.

**Run locally before pushing:**

```bash
pnpm run check-mock-cleanup
```

#### Best Practices

**DO:**

```typescript
// Good: Cleanup after each test
describe('MyComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('test 1', () => {
    const mockFn = vi.fn();
    // test code
  });
});
```

```typescript
// Good: Use beforeEach for setup, afterEach for cleanup
describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear call history
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original implementations
  });
});
```

```typescript
// Good: Combine with other cleanup
afterEach(() => {
  cleanup(); // React Testing Library cleanup
  vi.restoreAllMocks(); // Mock cleanup
  clearAllItems(); // LocalStorage cleanup 
});
```

**DON'T:**

```typescript
// Bad: No cleanup - mocks leak between tests
describe('MyComponent', () => {
  it('test 1', () => {
    const mockFn = vi.fn();
    // Without cleanup, mockFn persists to next test!
  });
});
```

```typescript
// Bad: Only using clearAllMocks() - doesn't restore implementations
afterEach(() => {
  vi.clearAllMocks(); // Not enough!
});
```

```typescript
// Bad: Module-level mocks without cleanup
vi.mock('some-module'); // At top of file

describe('MyComponent', () => {
  // Missing afterEach cleanup!
});
```

#### Common Patterns

**Pattern 1: Component with Module Mocks**

```typescript
// Top of file
vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

describe('MyComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // Required!
  });

  it('navigates correctly', () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    // test code
  });
});
```

**Pattern 2: Spy on Functions**

```typescript
describe('MyComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // Always restore spies!
  });

  it('calls console.log', () => {
    const spy = vi.spyOn(console, 'log');
    // test code
    expect(spy).toHaveBeenCalled();
  });
});
```

**Pattern 3: Function Mocks**

```typescript
describe('MyComponent', () => {
  const mockCallback = vi.fn();

  afterEach(() => {
    vi.restoreAllMocks(); // Restores mockCallback
  });

  it('calls callback', () => {
    render(<MyComponent onSubmit={mockCallback} />);
    // test code
  });
});
```

#### When to Use Each Cleanup Method

| Method                 | Use Case                       | What It Does                                   |
| ---------------------- | ------------------------------ | ---------------------------------------------- |
| `vi.restoreAllMocks()` | **Default - use in afterEach** | Restores all mocks to original implementations |
| `vi.clearAllMocks()`   | In beforeEach if needed        | Clears call history but keeps mocks active     |
| `vi.resetAllMocks()`   | Rarely needed                  | Clears history AND resets return values        |
| `vi.resetModules()`    | For `vi.mock()` of modules     | Clears module cache (less common)              |

> **Rule of Thumb:** Use `vi.restoreAllMocks()` in `afterEach` for 99% of cases.

#### Advanced: Global State Cleanup

**Timer Cleanup:**

```typescript
describe('Component with timers', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('uses fake timers', () => {
    vi.useFakeTimers();
    // test code
  });
});
```

**Window/Document Cleanup:**

```typescript
describe('Component modifying globals', () => {
  const originalLocation = window.location;

  afterEach(() => {
    window.location = originalLocation;
    // Remove any added event listeners
    document.removeEventListener('click', handler);
  });

  it('modifies window', () => {
    window.location.href = 'test';
  });
});
```

#### Troubleshooting

**ESLint Error: "Test file uses mocks but is missing afterEach cleanup"**

- Your IDE detected missing cleanup in real-time
- Apply ESLint autofix or manually add `afterEach(() => { vi.restoreAllMocks(); })`

**Pre-commit Hook Failed: "Check Mock Cleanup"**

- The script found test files with missing cleanup
- Review the error output for specific files and fix suggestions
- Bypass if absolutely needed: `git commit --no-verify`

**CI Error: "Check Mock Isolation failed"**

- Same validation as pre-commit but caught in CI
- Add `afterEach(() => { vi.restoreAllMocks(); })` to flagged files

**Tests pass locally but fail in CI:**

- Likely mock leakage - ensure all test files have `afterEach` cleanup
- Run tests in shuffle mode: `pnpm run test -- --sequence.shuffle`
- Check for window/document/timer manipulation without cleanup

**Tests fail in different order or when run together:**

- Classic sign of mock leakage
- Add `afterEach(() => { vi.restoreAllMocks(); })` to affected files
- If using fake timers, add `vi.clearAllTimers()` and `vi.useRealTimers()`

**Warning about window/document/timer usage:**

- These are non-blocking warnings to improve test isolation
- While they don't fail builds, addressing them prevents flaky tests
- Follow the fix suggestions in the warning output

### Code Coverage Standards

- The current code coverage of the repository: [![codecov](https://codecov.io/gh/PalisadoesFoundation/talawa-admin/branch/develop/graph/badge.svg?token=II0R0RREES)](https://codecov.io/gh/PalisadoesFoundation/talawa-admin)
- The currently acceptable coverage rate can be found in the [GitHub Pull Request workflow file](../../../../.github/workflows/pull-request.yml). Search for the value below the line containing `min_coverage`.

## Cypress End-to-End Testing

Cypress is used for end-to-end testing to ensure the application works correctly from a user's perspective.
To read more about Cypress testing, please refer to the [Our end to end testing with Cypress guide](./e2e-testing.md).

## Debugging Tests

You can see the output of failing tests in your browser using the `vitest` UI:

```bash
pnpm run test:watch
```

This opens an interactive UI where you can:\n- View test results in real-time

- Debug failing tests
- Re-run specific tests
- View detailed error messages and stack traces

## Husky for Git Hooks

We are using the package `Husky` to run git hooks that run according to different git workflows.

### pre-commit hook

We run a pre-commit hook which automatically runs code quality checks each time you make a commit and also fixes some of the issues. This includes:

- Documentation generation
- Code formatting and linting
- Type checking
- **Mock isolation validation** (`check-mock-cleanup.sh`)
- Unused file/dependency detection

The mock isolation check ensures all test files with mocks have proper cleanup before you commit. This catches issues early, before they reach CI.

If you don't want these pre-commit checks running on each commit, you can manually opt out of it using the `--no-verify` flag with your commit message as shown:-

```bash
git commit -m "commit message" --no-verify
```

> **Note:** Only bypass the pre-commit hook if absolutely necessary. It's designed to catch common issues and save CI time.

### post-merge hook

We are also running a post-merge(post-pull) hook which will automatically run "pnpm install" only if there is any change made to package.json file so that the developer has all the required dependencies when pulling files from remote.

If you don't want this hook to run, you can manually opt out of this using the `--no-verify` flag while using the merge command `git pull`:

```bash
git pull --no-verify
```

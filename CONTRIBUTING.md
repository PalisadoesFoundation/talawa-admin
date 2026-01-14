# Contributing to Talawa-Admin

Thank you for your interest in contributing to Talawa Admin. Regardless of the size of the contribution you make, all contributions are welcome and are appreciated.

If you are new to contributing to open source, please read the Open Source Guides on [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/).

## Table of Contents

<!-- toc -->

- [General](#general)
- [Testing and Code Quality](#testing-and-code-quality)
  - [Quick Reference](#quick-reference)
- [Mock Isolation Guidelines](#mock-isolation-guidelines)
  - [Required Cleanup Pattern](#required-cleanup-pattern)
  - [Enforcement Layers](#enforcement-layers)
  - [Local Validation](#local-validation)
  - [Common Violations and Fixes](#common-violations-and-fixes)
  - [Why This Matters](#why-this-matters)
- [Making Contributions](#making-contributions)

<!-- tocstop -->

## General

Please read the [Palisadoes Contributing Guidelines](https://developer.palisadoes.org/docs/contributor-guide/contributing).

## Testing and Code Quality

For detailed information about testing, linting, formatting, and code coverage, please refer to our comprehensive [Testing Guide](docs/docs/docs/developer-resources/testing.md).

For security guidelines regarding token handling and authentication, please refer to our [Security Guidelines](docs/docs/docs/developer-resources/security.md).

### Quick Reference

**Testing:**
- Run all tests: `pnpm run test`
- Run specific test: `pnpm run test /path/to/test/file`
- Run with coverage: `pnpm run test:coverage`
- Run with sharding: `pnpm run test:shard`

**Linting and Formatting:**
- Fix linting issues: `pnpm run lint:fix`
- Fix formatting issues: `pnpm run format:fix`
- Check linting: `pnpm run lint:check`
- Check formatting: `pnpm run format:check`

**Cypress E2E Testing:**
- See the [Cypress Guide](cypress/README.md) for end-to-end testing

For complete documentation including test sharding, code coverage setup, debugging, and git hooks, visit the [Testing Guide](docs/docs/docs/developer-resources/testing.md).

## Mock Isolation Guidelines

Proper mock isolation is **critical** for reliable tests and enables parallel test execution (12-shard CI). All test files using mocks **MUST** include cleanup to prevent mock leakage.

### Required Cleanup Pattern

Every test file using `vi.fn()`, `vi.mock()`, or `vi.spyOn()` must include:

```typescript
describe('YourComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // or vi.clearAllMocks()
  });
  
  // Your tests here
});
```

### Enforcement Layers

We enforce mock isolation through multiple layers:

1. **ESLint (Real-time IDE feedback)**: Custom rule detects missing cleanup as you code
2. **Pre-commit Hook**: Runs `check-mock-cleanup.sh` before commits
3. **CI Check**: GitHub Actions validates all test files

### Local Validation

Before committing, you can run:

```bash
# Check mock cleanup
pnpm run check-mock-cleanup

# Run ESLint on test files
pnpm run lint:check
```

### Common Violations and Fixes

**Missing cleanup:**
```typescript
// Bad - no cleanup
describe('Test', () => {
  it('test', () => {
    const mock = vi.fn();
  });
});
```

**Correct pattern:**
```typescript
// Good - has cleanup
describe('Test', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('test', () => {
    const mock = vi.fn();
  });
});
```

**Window/Timer manipulation without cleanup:**
```typescript
// Bad - modifies global state
it('test', () => {
  window.location.href = 'test';
  vi.useFakeTimers();
});
```

**Correct pattern:**
```typescript
// Good - restores global state  
describe('Test', () => {
  const originalLocation = window.location;
  
  afterEach(() => {
    window.location = originalLocation;
    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
```

### Why This Matters

- **Prevents flaky tests**: Tests won't fail randomly or when run in different orders
- **Enables parallelization**: Our 12-shard CI provides 4x speedup (only possible with isolation)
- **Improves reliability**: Guarantees tests are independent and reproducible

For comprehensive guidance, see the [Testing Guide](docs/docs/docs/developer-resources/testing.md#test-isolation-and-mock-cleanup).

## Making Contributions   

1. After making changes you can add them to git locally using `git add <file_name>`(to add changes only in a particular file) or `git add .` (to add all changes).
1. After adding the changes you need to commit them using `git commit -m '<commit message>'`(look at the commit guidelines below for commit messages).
1. Once you have successfully commited your changes, you need to push the changes to the forked repo on github using: `git push origin <branch_name>`.(Here branch name must be name of the branch you want to push the changes to.)
1. Now create a pull request to the Talawa-admin repository from your forked repo. Open an issue regarding the same and link your PR to it.
1. Ensure the test suite passes, either locally or on CI once a PR has been created.
1. Review and address comments on your pull request if requested.

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

## Linting and Formatting

All pull requests must have code that is properly linted and formatted to ensure uniformity across the repository.

Before opening a PR, run the following scripts to automatically lint and format the code:

```bash
npm run lint:fix
npm run format:fix
```

Both scripts also have a `check` counterpart, which is used by GitHub CI to ensure that the code is properly formatted.
You can run these scripts yourself to ensure that your pull request doesn't fail due to linting and formatting errors:

```bash
npm run lint:check
npm run format:check
```

## Vitest Testing

This project uses [Vitest](https://vitest.dev/) as the testing framework.

### Running Tests

- **Run all tests:**
  ```bash
  npm run test
  ```

- **Run a single test file:**
  ```bash
  npm run test /path/to/test/file
  ```

- **Watch tests for changes:**
  ```bash
  npm run test:watch
  ```
  This opens the Vitest UI for interactive testing.

### Test Coverage

- **View coverage for all test files:**
  ```bash
  npm run test:coverage
  ```

- **View coverage for a single test file:**
  ```bash
  npm run test:coverage /path/to/test/file
  ```

- **Generate HTML coverage report:**
  ```bash
  npm run test:coverage
  genhtml coverage/lcov.info -o coverage
  ```
  The `genhtml` command is part of the Linux `lcov` package. Similar packages are available for Windows and MacOS.

### Test Sharding

For improved performance, especially in CI/CD environments, you can run tests in parallel using sharding:

```bash
npm run test:shard
```

To run a specific shard, use environment variables:

```bash
SHARD_INDEX=1 SHARD_COUNT=4 npm run test:shard
```

This divides the test suite into 4 parts and runs the 1st part. This is particularly useful for:
- Running tests in parallel across multiple CI jobs
- Faster test execution on multi-core systems
- Reducing overall test suite runtime

You can also run sharded tests with coverage:

```bash
npm run test:shard:coverage
```

### Code Coverage Standards

- The current code coverage of the repository: [![codecov](https://codecov.io/gh/PalisadoesFoundation/talawa-admin/branch/develop/graph/badge.svg?token=II0R0RREES)](https://codecov.io/gh/PalisadoesFoundation/talawa-admin)
- The currently acceptable coverage rate can be found in the [GitHub Pull Request workflow file](.github/workflows/pull-requests.yml). Search for the value below the line containing `min_coverage`.

## Cypress End-to-End Testing

Cypress is used for end-to-end testing to ensure the application works correctly from a user's perspective.
To read more about Cypress testing, please refer to the [Cypress Guide](../../../../cypress/README.md).

## Debugging Tests

You can see the output of failing tests in your browser using the `vitest` UI:

```bash
npm run test:watch
```

This opens an interactive UI where you can:\n- View test results in real-time
- Debug failing tests
- Re-run specific tests
- View detailed error messages and stack traces

## Husky for Git Hooks

We are using the package `Husky` to run git hooks that run according to different git workflows.

### pre-commit hook

We run a pre-commit hook which automatically runs code quality checks each time you make a commit and also fixes some of the issues. This way you don't have to run them manually each time.

If you don't want these pre-commit checks running on each commit, you can manually opt out of it using the `--no-verify` flag with your commit message as shown:-

```bash
git commit -m "commit message" --no-verify
```

### post-merge hook

We are also running a post-merge(post-pull) hook which will automatically run "npm install" only if there is any change made to package.json file so that the developer has all the required dependencies when pulling files from remote.

If you don't want this hook to run, you can manually opt out of this using the `--no-verify` flag while using the merge command `git pull`:

```bash
git pull --no-verify
```

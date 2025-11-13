# Contributing to Talawa-Admin

Thank you for your interest in contributing to Talawa Admin. Regardless of the size of the contribution you make, all contributions are welcome and are appreciated.

If you are new to contributing to open source, please read the Open Source Guides on [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/).

## Table of Contents

<!-- toc -->

- [General](#general)
- [Linting and Formatting](#linting-and-formatting)
- [Testing:](#testing)
  - [Vitest Testing](#vitest-testing)
  - [Cypress End to End Testing](#cypress-end-to-end-testing)
  - [Test Code Coverage:](#test-code-coverage)

<!-- tocstop -->

## General

Please read the [Palisadoes Contributing Guidelines](https://github.com/PalisadoesFoundation/.github/blob/main/profile/CONTRIBUTING.md).

## Linting and Formatting

All the pull requests must have code that is properly linted and formatted, so that uniformity across the repository can be ensured.

Before opening a PR, you can run the following scripts to automatically lint and format the code properly:

```
npm run lint:fix
npm run format:fix
```

Both of these scripts also have a `check` counterpart, which would be used by the GitHub CI to ensure that the code is properly formatted.
You can run the following scripts yourself to ensure that your pull request doesn't fail due to linting and formatting errors:

```
npm run lint:check
npm run format:check
```

## Testing:

This section outlines the different testing strategies and tools used in this project. It includes instructions on running tests, viewing code coverage, and debugging. Following these guidelines ensures code reliability and maintains the project's high standards for quality.

### Vitest Testing

   - Running a single test:
      ```
      npm run test /path/to/test/file
      ```
   - Running all tests:
      ```
      npm run test
      ```
   - Viewing the code coverage of a single test file:
      ```
      npm run test:coverage /path/to/test/file
      ```
   - Viewing the code coverage of all test files:
      ```
      npm run test:coverage
      ```
   - Watching tests for changes:
      ```
      npm run test:watch
      ```
### Cypress End to End Testing 

   - Cypress is used for end-to-end testing to ensure the application works correctly from a user's perspective.
   To read more about Cypress testing, please refer to the [Cypress Guide](cypress/README.md).

### Test Code Coverage:

   1. _General Information_
      - The current code coverage of the repo is: [![codecov](https://codecov.io/gh/PalisadoesFoundation/talawa-admin/branch/develop/graph/badge.svg?token=II0R0RREES)](https://codecov.io/gh/PalisadoesFoundation/talawa-admin)
      - You can determine the percentage test coverage of your code by running these two commands in sequence:
         ```
         npm install
         npm run test --watchAll=false --coverage
         genhtml coverage/lcov.info -o coverage
         ```
      - The output of the `npm run test` command will give you a tablular coverage report per file
      - The overall coverage rate will be visible on the penultimate line of the `genhtml` command's output.
      - The `genhtml` command is part of the Linux `lcov` package. Similar packages can be found for Windows and MacOS.
      - The currently acceptable coverage rate can be found in the [GitHub Pull Request file](.github/workflows/pull-requests.yml). Search for the value below the line containing `min_coverage`.
   2. _Testing Individual Files_
      - You can test an individual file by running this command:
         ```
         npm run test --watchAll=false /path/to/test/file
         ```
      - You can get the test coverage report for that file by running this command. The report will list all tests in the suite. Those tests that are not run will have zero values. You will need to look for the output line relevant to your test file.
         ```
         npm run test --watchAll=false --coverage /path/to/test/file
         ```
   3. _Creating your code coverage account_

      - You can also see your code coverage online for your fork of the repo. This is provided by `codecov.io`

         1. Go to this link: `https://app.codecov.io/gh/XXXX/YYYY` where XXXX is your GitHub account username and YYYY is the name of the repository
         2. Login to `codecov.io` using your GitHub account, and add your **repo** and **branches** to the `codecov.io` dashboard.
               ![Debugging Test Demo](/public/images/codecov/authorise-codecov-github.jpg)
         3. Remember to add the `Repository Upload Token` for your forked repo. This can be found under `Settings` of your `codecov.io` account.

         4. Click on Setup Repo option
               ![Debugging Test Demo](</public/images/codecov/homescrenn%20(1).jpg>)
         5. Use the value of this token to create a secret named CODE_COV for your forked repo.
               [![Code-cov-token.jpg](/public/images/codecov/Code-cov-token.jpg)]()
               [![addd-your-key.jpg](/public/images/codecov/addd-your-key.jpg)]()
         6. You will see your code coverage reports with every push to your repo after following these steps
               [![results.jpg](/public/images/codecov/results.jpg)]()   

1. After making changes you can add them to git locally using `git add <file_name>`(to add changes only in a particular file) or `git add .` (to add all changes).
1. After adding the changes you need to commit them using `git commit -m '<commit message>'`(look at the commit guidelines below for commit messages).
1. Once you have successfully commited your changes, you need to push the changes to the forked repo on github using: `git push origin <branch_name>`.(Here branch name must be name of the branch you want to push the changes to.)
1. Now create a pull request to the Talawa-admin repository from your forked repo. Open an issue regarding the same and link your PR to it.
1. Ensure the test suite passes, either locally or on CI once a PR has been created.
1. Review and address comments on your pull request if requested.

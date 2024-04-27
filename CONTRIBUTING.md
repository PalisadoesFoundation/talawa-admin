# Contributing to Talawa-Admin

Thank you for your interest in contributing to Talawa Admin. Regardless of the size of the contribution you make, all contributions are welcome and are appreciated.

If you are new to contributing to open source, please read the Open Source Guides on [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/).

## Table of Contents

<!-- toc -->

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
  - [Our Development Process](#our-development-process)
    - [Issues](#issues)
    - [Pull Requests](#pull-requests)
    - [Branching Strategy](#branching-strategy)
    - [Conflict Resolution](#conflict-resolution)
  - [Contributing Code](#contributing-code)
- [Internships](#internships)
- [Community](#community)

<!-- tocstop -->

## Code of Conduct

A safe environment is required for everyone to contribute. Read our [Code of Conduct Guide](CODE_OF_CONDUCT.md) to understand what this means. Let us know immediately if you have unacceptable experiences in this area.

No one should fear voicing their opinion. Respones must be respectful.

## Ways to Contribute

If you are ready to start contributing code right away, get ready!

1. Join our Slack and introduce yourself. See details on how to join below in the Community section.
   1. This repository has its own dedicated channel.
   1. There are many persons on the various channels who are willing to assist you in getting started.
1. Take a look at our issues (**_after reading our guidelines below_**):
   1. We have a list of [good first issues](https://github.com/PalisadoesFoundation/talawa-admin/labels/good%20first%20issue) that contain challenges with a limited scope for beginners.
   1. There are issues for creating tests for our code base. We need to increase reliablility. Try those issues, or create your own for files that don't already have tests. This is another good strategy for beginners.
   1. There are [dormant issues on which nobody has worked for some time](https://github.com/PalisadoesFoundation/talawa-admin/issues?q=is%3Aopen+is%3Aissue+label%3Ano-issue-activity). These are another place to start
   1. There may also be [dormant PRs on which nobody has worked for some time](https://github.com/PalisadoesFoundation/talawa-admin/issues?q=is%3Aopen+is%3Aissue+label%3Ano-issue-activity+label%3Ano-pr-activity)!
1. Create an issue based on a bug you have found or a feature you would like to add. We value meaningful sugestions and will prioritize them.

Welcome aboard!

### Our Development Process

We utilize GitHub issues and pull requests to keep track of issues and contributions from the community.

#### Issues

Make sure you are following [issue report guidelines](ISSUE_GUIDELINES.md) available here before creating any new issues on Talawa Admin project.

#### Pull Requests

[Pull Request guidelines](PR_GUIDELINES.md) is best resource to follow to start working on open issues.

#### Branching Strategy

For Talawa Admin, we had employed the following branching strategy to simplify the development process and to ensure that only stable code is pushed to the `main` branch:

- `develop`: For unstable code and bug fixing
- `main`: Where the stable production ready code lies. This is our default branch.

#### Conflict Resolution

When multiple developers are working on issues there is bound to be a conflict of interest (not to be confused with git conflicts) among issues, PRs or even ideas. Usually these conflicts are resolved in a **First Come First Serve** basis however there are certain exceptions to it.

- In the cases where you feel your potential issues could be an extension or in conflict with other PRs it is important to ask the author of the PR in the slack channel or in their PRs or issues themselves why he/she did not write code for something that would require minimal effort on their part.
- Based on basic courtesy, it is good practice to let the person who created a function apply and test that function when needed.
- Last but not the least, communication is important make sure to talk to other contributors, in these cases, in slack channel or in a issue/PR thread.
- As a last resort the Admins would be responsible for deciding how to resolve this conflict.

### Contributing Code

Code contributions to Talawa come in the form of pull requests. These are done by forking the repo and making changes locally.

Make sure you have read the [Documentation for Setting up the Project](https://github.com/PalisadoesFoundation/talawa-admin#project-setup)

The process of proposing a change to Talawa Admin can be summarized as:

1. Fork the Talawa Admin repository and branch off `develop`.
1. Your newly forked repository can be cloned locally using `git clone <YOUR FORKED REPO URL>`.
1. Make the Palisadoes Foundation's repo your `git upstream` for your local repo.
1. Make the desired changes to the Talawa Admin project.
1. Run the app and test your changes.
1. If you've added code, then test suites must be added.

   1. **_General_:**

      1. We need to get to 100% test coverage for the app. We periodically increase the desired test coverage for our pull requests to meet this goal.
      1. Pull requests that don't meet the minimum test coverage levels will not be accepted. This may mean that you will have to create tests for code you did not write. You can decide which part of the code base needs additional tests if this happens to you.

   2. **_Testing_:**

      1. Test using this set of commands:

         ```
         npm install
         npm run test --watchAll=false --coverage
         ```

      2. Debug tests in browser

         You can see the output of failing tests in broswer by running `jest-preview` package before running your tests

         ```
         npm install
         npm run jest-preview
         npm run test --watchAll=false --coverage
         ```

         You don't need to re-run the `npm run jest-preview` command each time, simply run the `npm run test` command if the Jest Preview server is already running in the background, it'll automatically detect any failing tests and show the preview at `http://localhost:3336` as shown in this screenshot -

         ![Debugging Test Demo](./public/images/jest-preview.webp)

   3. **_Test Code Coverage_:**

      1. _General Information_
         1. The current code coverage of the repo is: [![codecov](https://codecov.io/gh/PalisadoesFoundation/talawa-admin/branch/develop/graph/badge.svg?token=II0R0RREES)](https://codecov.io/gh/PalisadoesFoundation/talawa-admin)
         2. You can determine the percentage test coverage of your code by running these two commands in sequence:
            ```
            npm install
            npm run test --watchAll=false --coverage
            genhtml coverage/lcov.info -o coverage
            ```
         3. The output of the `npm run test` command will give you a tablular coverage report per file
         4. The overall coverage rate will be visible on the penultimate line of the `genhtml` command's output.
         5. The `genhtml` command is part of the Linux `lcov` package. Similar packages can be found for Windows and MacOS.
         6. The currently acceptable coverage rate can be found in the [GitHub Pull Request file](.github/workflows/pull-requests.yml). Search for the value below the line containing `min_coverage`.
      2. _Testing Individual Files_
         1. You can test an individual file by running this command:
            ```
            npm run test --watchAll=false /path/to/test/file
            ```
         2. You can get the test coverage report for that file by running this command. The report will list all tests in the suite. Those tests that are not run will have zero values. You will need to look for the output line relevant to your test file.
            ```
            npm run test --watchAll=false --coverage /path/to/test/file
            ```
      3. _Creating your code coverage account_

         1. You can also see your code coverage online for your fork of the repo. This is provided by `codecov.io`

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

## Internships

If you are participating in any of the various internship programs we are members of, then please read the [introduction guides on our documentation website](https://docs.talawa.io/docs/).

## Community

There are many ways to communicate with the community.

1. The Palisadoes Foundation has a Slack channel where members can assist with support and clarification. Visit the [Talawa GitHub repository home page](https://github.com/PalisadoesFoundation/talawa) for the link to join our slack channel.
1. We also have a technical email list run by [freelists.org](https://www.freelists.org/). Search for "palisadoes" and join. Members on this list are also periodically added to our marketing email list that focuses on less technical aspects of our work.

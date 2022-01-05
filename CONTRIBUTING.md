# Contributing to Talawa-Admin

Thank you for your interest in contributing to Talawa Admin. Regardless of the size of the contribution you make, all contributions are welcome and are appreciated.

If you are new to contributing to open source, please read the Open Source Guides on [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/).

## Code of Conduct

A safe environment is required for everyone to contribute. Read our [Code of Conduct Guide](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/CODE_OF_CONDUCT.md) to understand what this means. Let us know immediately if you have unacceptable experiences in this area.

No one should fear voicing their opinion. Respones must be respectful.

## Ways to Contribute

If you are ready to start contributing code right away, we have a list of [good first issues](https://github.com/PalisadoesFoundation/talawa-admin/labels/good%20first%20issue) that contain issues with a limited scope.

### Our Development Process

We utilize GitHub issues and pull requests to keep track of issues and contributions from the community.

#### Issues

Make sure you are following [issue report guidelines](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/issue-guidelines.md) available here before creating any new issues on Talawa Admin project.

#### Pull Requests

[Pull Request guidelines](https://github.com/PalisadoesFoundation/talawa-admin/blob/master/PR-guidelines.md) is best resource to follow to start working on open issues.

#### Git Flow

For Talawa Admin, we utilize the GitFlow branching model. GitFlow is geared towards efficiently tracking development and managing releases. The model makes parallel development efforts easy and safe by isolating new development efforts from completed work.

The different types of branches we may use are:

- Feature branches (feature/branch-name)
- Release branches (release/1.XX)
- Bug branches (bugfix/branch-name)
- Hotfix branches (hotfix/branch-name)

Detailed document containing how GitFlow works: https://nvie.com/posts/a-successful-git-branching-model/

### Contributing Code

Code contributions to Talawa come in the form of pull requests. These are done by forking the repo and making changes locally.

Make sure you have read the [Documentation for Setting up the Project](https://github.com/PalisadoesFoundation/talawa-admin#project-setup)

The process of proposing a change to Talawa Admin can be summarized as:

1. Fork the Talawa Admin repository and branch off `master`.
1. The repository can be cloned locally using `git clone <forked repo url>`.
1. Make the desired changes to the Talawa Admin project.
1. Run the app and test your changes.
1. If you've added code that should be tested, write tests.
1. After making changes you can add them to git locally using `git add <file_name>`(to add changes only in a particular file) or `git add .` (to add all changes).
1. After adding the changes you need to commit them using `git commit -m '<commit message>'`(look at the commit guidelines below for commit messages).
1. Once you have successfully commited your changes, you need to push the changes to the forked repo on github using: `git push origin <branch_name>`.(Here branch name must be name of the branch you want to push the changes to.)
1. Now create a pull request to the Talawa-admin repository from your forked repo. Open an issue regarding the same and link your PR to it.
1. Ensure the test suite passes, either locally or on CI once a PR has been created.
1. Review and address comments on your pull request if requested.

### Internships

We have internship partnerships with a number of organizations. See below for more details.

#### GSoC

If you are participating in the 2021 Summer of Code, please read more about us and our processes [here](https://palisadoesfoundation.github.io/talawa-docs/docs/internships/gsoc/gsoc-introduction)

#### GitHub Externship

If you are participating in the 2021 GitHub Externship, please read more about us and our processes [here](https://palisadoesfoundation.github.io/talawa-docs/docs/internships/github/github-introduction)

### Community
There are many ways to communicate with the community.

1. The Palisadoes Foundation has a Slack channel where members can assist with support and clarification. Visit [slack.palisadoes.org](http://slack.palisadoes.org) to join our slack channel.
1. We also have a technical email list run by [freelists.org](https://www.freelists.org/). Search for "palisadoes" and join. Members on this list are also periodically added to our marketing email list that focuses on less technical aspects of our work.

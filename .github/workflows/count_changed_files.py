#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Script to limit number of file changes in single PR.

Methodology:

    Analyses the Pull request to find if the count of file changed in a PR
    exceeds a pre-defined nummber 20

    This scripts encourages contributors to align with project practices,
    reducing the likelihood of unintentional merges into incorrect branches.

NOTE:

    This script complies with our python3 coding and documentation standards.
    It complies with:

        1) Pylint
        2) Pydocstyle
        3) Pycodestyle
        4) Flake8

"""

import os
import sys


def _count_changed_files(base_branch, current_branch):
    """
    Count the number of changed files between two branches.

    Args:
        base_branch (str): The base branch.
        current_branch (str): The current branch.

    Returns:
        int: The number of changed files.

    Raises:
        SystemExit: If an error occurs during execution.
    """
    try:
        base_branch = f"origin/{base_branch}"
        current_branch = f"origin/{current_branch}"
        # Run git command to get the list of changed files
        command = f"git diff --name-only {base_branch}...{current_branch} | wc -l"
        file_count = int(os.popen(command).read().strip())
        return file_count
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def main():
    """
    Execute the script's main functionality.

    This function serves as the entry point for the script. It performs
    the following tasks:
    1. Validates and retrieves the base branch and current commit from
       command line arguments.
    2. Counts the number of changed files between the specified branches.
    3. Checks if the count of changed files exceeds the acceptable
       limit (20).
    4. Provides informative messages based on the analysis.

    Raises:
        SystemExit: If an error occurs during execution.
    """
    try:
        # Get base branch and current commit
        base_branch = sys.argv[1]
        print(base_branch)
        current_branch = sys.argv[2]
        print(current_branch)

        # Count changed files
        file_count = _count_changed_files(base_branch, current_branch)

        print(f"Number of changed files: {file_count}")

        # Check if the count exceeds 20
        if file_count > 20:
            print(
                "Error: Too many files (greater than 20) changed in the pull request."
            )
            print("Possible issues:")
            print("- Contributor may be merging into an incorrect branch.")
            print(
                "- Source branch may be incorrect please use develop as source branch."
            )
            sys.exit(1)

    except IndexError:
        print(
            "Error: Please provide base branch and current commit as command line arguments."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()

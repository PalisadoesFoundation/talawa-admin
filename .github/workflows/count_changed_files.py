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

import sys
import argparse
import subprocess


def _count_changed_files(base_branch, PR_branch):
    """
    Count the number of changed files between two branches.

    Args:
        base_branch (str): The base branch.
        PR_branch (str): The PR branch.

    Returns:
        int: The number of changed files.

    Raises:
        SystemExit: If an error occurs during execution.
    """
    base_branch = f"origin/{base_branch}"
    PR_branch = f"origin/{PR_branch}"
    try:
        # Run git command to get the list of changed files
        command = f"git diff --name-only {base_branch}...{PR_branch} | wc -l"
        process = subprocess.Popen(
            command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, error = process.communicate()

        if process.returncode != 0:
            raise Exception(f"Error running git diff command: {error.decode('utf-8')}")

        file_count = int(output.strip())
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    return file_count


def _arg_parser_resolver():
    """Resolve the CLI arguments provided by the user.

    Args:
        None

    Returns:
        result: Parsed argument object

    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--base_branch",
        type=str,
        required=True,
        help="Base branch where pull request should be made."
    ),
    parser.add_argument(
        "--PR_branch",
        type=str,
        required=True,
        help="PR branch from where the pull request is made.",
    ),
    parser.add_argument(
        "--file_count",
        type=int,
        default=20,
        help="Number of files changes allowed in a single commit")
    return parser.parse_args()


def main():
    """
    Execute the script's main functionality.

    This function serves as the entry point for the script. It performs
    the following tasks:
    1. Validates and retrieves the base branch and PR commit from
       command line arguments.
    2. Counts the number of changed files between the specified branches.
    3. Checks if the count of changed files exceeds the acceptable
       limit (20).
    4. Provides informative messages based on the analysis.

    Raises:
        SystemExit: If an error occurs during execution.
    """

    args = _arg_parser_resolver()
    base_branch = args.base_branch
    print(f"You are trying to merge on branch: {base_branch}")  # Print for verification
    PR_branch = args.PR_branch
    print(
        f"You are making commit from your branch: {PR_branch}"
    )  # Print for verification
    # Count changed files
    file_count = _count_changed_files(base_branch, PR_branch)
    print(f"Number of changed files: {file_count}")
    # Check if the count exceeds 20
    if file_count > args.file_count:
        print("Error: Too many files (greater than 20) changed in the pull request.")
        print("Possible issues:")
        print("- Contributor may be merging into an incorrect branch.")
        print("- Source branch may be incorrect please use develop as source branch.")
        sys.exit(1)


if __name__ == "__main__":
    main()

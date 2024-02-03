#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""Script to limit the number of file changes in a single PR.

Methodology:

    Analyzes the Pull request to find if the count of file changes in a PR
    exceeds a pre-defined number 20.
    Checks for unauthorized file changes based on a list of sensitive files.

This script encourages contributors to align with project practices,
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


def _count_changed_files(base_branch, pr_branch, sensitive_files):
    """
    Count the number of changed files between two branches.

    Args:
        base_branch (str): The base branch.
        pr_branch (str): The PR branch.
        sensitive_files (list): List of sensitive files.

    Returns:
        int: The number of changed files.

    Raises:
        SystemExit: If an error occurs during execution.
    """
    base_branch = f"origin/{base_branch}"
    pr_branch = f"origin/{pr_branch}"

    command = f"git diff --name-only {base_branch}...{pr_branch}"

    try:
        # Run git command to get the list of changed files
        process = subprocess.Popen(
            command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, error = process.communicate()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    
    changed_files = output.decode("utf-8").strip().split("\n")
    unauthorized_changes = [file for file in changed_files if any(file.startswith(sf) for sf in sensitive_files)]

    file_count = len(changed_files)
    return file_count, unauthorized_changes


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
        help="Base branch where a pull request should be made."
    )
    parser.add_argument(
        "--pr_branch",
        type=str,
        required=True,
        help="PR branch from where the pull request is made.",
    )
    parser.add_argument(
        "--file_count",
        type=int,
        default=20,
        help="Number of files changes allowed in a single commit")
    parser.add_argument(
        "--sensitive_files",
        nargs='+',
        default=[
            '.github/',
            'env.example',
            '.husky/',
            'scripts/',
            'package.json',
            'tsconfig.json',
            '.gitignore',
            '.eslintrc.json',
            '.eslintignore',
            'vite.config.ts',
            'docker-compose.yaml',
            'Dockerfile',
            'CODEOWNERS',
            'LICENSE',
            'setup.ts'
        ],
        help="List of sensitive files and directories."
    )
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
    4. Checks for unauthorized file changes based on a list of sensitive files.
    5. Provides informative messages based on the analysis.

    Raises:
        SystemExit: If an error occurs during execution.
    """

    args = _arg_parser_resolver()

    base_branch = args.base_branch
    pr_branch = args.pr_branch

    print(f"You are trying to merge on branch: {base_branch}")
    print(f"You are making a commit from your branch: {pr_branch}")

    # Count changed files and check for unauthorized changes
    file_count, unauthorized_changes = _count_changed_files(
        base_branch, pr_branch, args.sensitive_files
    )
    print(f"Number of changed files: {file_count}")

    # Check if the count exceeds the allowed limit
    if file_count > args.file_count:
        print("Error: Too many files (greater than 20) changed in the pull request.")
        print("Possible issues:")
        print("- Contributor may be merging into an incorrect branch.")
        print("- Source branch may be incorrect; please use 'develop' as the source branch.")
        sys.exit(1)

    # Check for unauthorized changes
    if unauthorized_changes:
        print("Error: Unauthorized changes detected. Please review the list of modified files:")
        for file in unauthorized_changes:
            print(f" - {file}")
        sys.exit(1)


if __name__ == "__main__":
    main()

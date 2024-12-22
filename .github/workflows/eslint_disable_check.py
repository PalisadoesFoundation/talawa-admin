#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
"""ESLint Checker Script.

Methodology:

    Recursively analyzes TypeScript files in the specified directory
    to ensure they do not contain eslint-disable statements.

    This script enforces code quality practices in the project.

NOTE:
    This script complies with our python3 coding and documentation standards.
    It complies with:

        1) Pylint
        2) Pydocstyle
        3) Pycodestyle
        4) Flake8
        5) Python Black

"""

import os
import re
import argparse
import sys


def has_eslint_disable(file_path):
    """
    Check if a TypeScript file contains eslint-disable statements.

    Args:
        file_path (str): Path to the TypeScript file.

    Returns:
        bool: True if eslint-disable statement is found, False otherwise.
    """
    eslint_disable_pattern = re.compile(
        r"""\/\/\s*eslint-disable(?:-next-line
        |-line)?[^\n]*|\/\*\s*eslint-disable[^\*]*\*\/""",
        re.IGNORECASE,
    )

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
            return bool(eslint_disable_pattern.search(content))
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return False
    except PermissionError:
        print(f"Permission denied: {file_path}")
        return False
    except (IOError, OSError) as e:
        print(f"Error reading file {file_path}: {e}")
        return False


def check_eslint(directories):
    """
    Recursively check TypeScript files for eslint-disable statements.

    Args:
        directories (list): List of directories.

    Returns:
        bool: True if eslint-disable statement is found, False otherwise.
    """
    eslint_found = False

    for directory in directories:
        if not os.path.exists(directory):
            print(
                f"""Error: The specified directory '{directory}' does not
                exist."""
            )
            sys.exit(1)
        for root, _, files in os.walk(directory):
            for file_name in files:
                if (
                    file_name.endswith(".tsx")
                    and not file_name.endswith(".test.tsx")
                   ):
                    file_path = os.path.join(root, file_name)
                    if has_eslint_disable(file_path):
                        print(
                            f"""File {file_path} contains eslint-disable
                              statement."""
                        )
                        eslint_found = True

        setup_path = os.path.join(directory, "setup.ts")
        if os.path.exists(setup_path) and has_eslint_disable(setup_path):
            print(
                f"""Setup file {setup_path} contains eslint-disable
                statement."""
            )
            eslint_found = True

    return eslint_found


def arg_parser_resolver():
    """Resolve the CLI arguments provided by the user.

    Returns:
        result: Parsed argument object
    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--directory",
        type=str,
        nargs="+",
        default=[os.getcwd()],
        help="""One or more directories to check for eslint disable
        statements (default: current directory).""",
    )
    return parser.parse_args()


def main():
    """
    Execute the script's main functionality.

    This function serves as the entry point for the script. It performs
    the following tasks:
    1. Validates and retrieves the directory to check from
       command line arguments.
    2. Recursively checks TypeScript files for eslint-disable statements.
    3. Provides informative messages based on the analysis.
    4. Exits with an error if eslint-disable statements are found.

    Raises:
        SystemExit: If an error occurs during execution.
    """
    args = arg_parser_resolver()
    # Check eslint in the specified directory
    eslint_found = check_eslint(args.directory)

    if eslint_found:
        print("ESLint-disable check failed. Exiting with error.")
        sys.exit(1)

    print("ESLint-disable check completed successfully.")


if __name__ == "__main__":
    main()

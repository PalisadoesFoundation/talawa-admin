import sys
import argparse
import subprocess
import glob


def _count_changed_files(base_branch, pr_branch):
    """
    Count the number of changed files between two branches.
    Args:
        base_branch (str): The base branch.
        pr_branch (str): The PR branch.
    Returns:
        list: List of changed files.
    Raises:
        SystemExit: If an error occurs during execution.
    """
    base_branch = f"origin/{base_branch}"
    pr_branch = f"origin/{pr_branch}"

    command = f"git diff --name-only {base_branch}...{pr_branch} --diff-filter=ACMRT | xargs"

    try:
        # Run git command to get the list of changed files
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        output, error = process.communicate()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    changed_files = [file.strip() for file in output.split(" ") if file.strip()]
    return changed_files


def _check_unauthorized_changes(changed_files, sensitive_files):
    """
    Check for unauthorized file changes.
    Args:
        changed_files (list): List of changed files.
        sensitive_files (list): List of sensitive files.
    Returns:
        list: Unauthorized changes.
    """
    unauthorized_changes = [
        file
        for file in changed_files
        if any(glob.fnmatch.fnmatch(file, sf) for sf in sensitive_files)
    ]
    return unauthorized_changes


def _arg_parser_resolver():
    """Resolve the CLI arguments provided by the user.
    Returns:
        result: Parsed argument object
    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--base_branch",
        type=str,
        required=True,
        help="Base branch where a pull request should be made.",
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
        help="Number of files changes allowed in a single commit",
    )
    parser.add_argument(
        "--sensitive_files",
        type=str,
        required=True,
        help="Path to a file containing a list of sensitive files and directories.",
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Print verbose output."
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
    errors = []

    if args.verbose:
        print(f"You are trying to merge on branch: {base_branch}")
        print(f"You are making a commit from your branch: {pr_branch}")

    

    # Read sensitive files from the provided file
    with open(args.sensitive_files, "r") as sensitive_file:
        sensitive_files = [line.strip() for line in sensitive_file]

    # Count changed files
    changed_files = _count_changed_files(base_branch, pr_branch)
    if args.verbose:
        print(f"Number of changed files: {len(changed_files)}")

    # Check if the count exceeds the allowed limit
    if len(changed_files) > args.file_count:
        errors.append(
            f"Error: Too many files, {len(changed_files)} changed in the pull request.\n  - Contributor may be merging into an incorrect branch."
        )

    # Check for unauthorized changes
    unauthorized_changes = _check_unauthorized_changes(
        changed_files, sensitive_files
    )
    if unauthorized_changes:
        errors.append(
            "Error: Unauthorized changes detected. Please review the list of modified files:"
        )
        for file in unauthorized_changes:
            errors.append(f" - {file}")

    # Print accumulated errors and exit if there are any
    if errors:
        for error in errors:
            print(error)
        sys.exit(1)
    else:
        if args.verbose:
            print("No unauthorized changes detected. Test passed.")


if __name__ == "__main__":
    main()

import os
import sys

def count_changed_files(base_branch, current_branch):
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
    try:
        # Get base branch and current commit
        base_branch = sys.argv[1]
        print(base_branch)
        current_branch = sys.argv[2]
        print(current_branch)

        # Count changed files
        file_count = count_changed_files(base_branch, current_branch)

        print(f"Number of changed files: {file_count}")

        # Check if the count exceeds 20
        if file_count > 20:
            print("Error: Too many files (greater than 20) changed in the pull request.")
            print("Possible issues:")
            print("- Contributor may be merging into an incorrect branch.")
            print("- Source branch may be incorrect please use develop as source branch.")
            sys.exit(1)

    except IndexError:
        print("Error: Please provide base branch and current commit as command line arguments.")
        sys.exit(1)

if __name__ == "__main__":
    main()

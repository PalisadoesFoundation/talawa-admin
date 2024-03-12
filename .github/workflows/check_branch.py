import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python branch_check.py <source_branch> <target_branch>")
        sys.exit(1)

    source_branch = sys.argv[1]
    target_branch = sys.argv[2]

    if source_branch == target_branch:
        print(f"Failed: Source and target branches are the same ({source_branch})")
        sys.exit(1)
    else:
        print("Passed: Source and target branches are different")
        sys.exit(0)

if __name__ == "__main__":
    main()

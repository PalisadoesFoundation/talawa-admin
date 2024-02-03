#!/usr/bin/env python3

import os

print("List of unauthorized files changed:")
# Add your list of sensitive files and directories here
SENSITIVE_FILES = [
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
]

UNAUTHORIZED_CHANGES = False

changed_files = os.popen(f'git diff --name-only {os.getenv("GITHUB_EVENT_BEFORE") or "HEAD^"}').read().splitlines()

for file in changed_files:
    for sensitive_file in SENSITIVE_FILES:
        if file.startswith(sensitive_file):
            print(f" - {file}")
            UNAUTHORIZED_CHANGES = True

if UNAUTHORIZED_CHANGES:
    print("Unauthorized changes detected. Please review the list of modified files above.")
    exit(1)

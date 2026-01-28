#!/bin/bash
set -e

# Update develop
git checkout develop
git pull upstream develop

# List of branches to create and their scope (pattern to match)
# Format: "branch_name|pattern_to_include|exclusion_pattern"

# Batch 1: App Entry (src/App.tsx, src/index.tsx) & Core Components (src/components/...)
# Batch 2: Org Settings
# Batch 3: Admin Portal Part 1
# Batch 4: Admin Portal Part 2
# Batch 5: Cleanup & Utils

# For now, let's just create the 5 branches first
branches=(
  "feature-notification-toast-batch1-app-core-6172"
  "feature-notification-toast-batch2-org-settings-6172"
  "feature-notification-toast-batch3-admin-p1-6172"
  "feature-notification-toast-batch4-admin-p2-6172"
  "feature-notification-toast-batch5-utils-6172"
)

for branch in "${branches[@]}"; do
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    echo "Branch $branch already exists"
  else
    echo "Creating branch $branch from develop"
    git checkout develop
    git checkout -b "$branch"
  fi
done

echo "All 5 batch branches created successfully!"

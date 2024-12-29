#!/bin/bash

echo "Step 1: Checking CodeRabbit.ai approval..."

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set"
  exit 1
fi

echo "Fetching PR reviews from GitHub API..."
rate_limit=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/rate_limit")
remaining=$(echo "$rate_limit" | jq '.rate.remaining')

if [ "$remaining" -lt 1 ]; then
  echo "Error: GitHub API rate limit exceeded. Please try again later."
  exit 1
fi

reviews=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/${{ github.repository }}/pulls/${{ github.event.pull_request.number }}/reviews")

if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch PR reviews."
  exit 1
fi

echo "Checking if the response is valid JSON..."
if ! echo "$reviews" | jq . >/dev/null 2>&1; then
  echo "Error: Invalid JSON response from GitHub API."
  echo "Response received: $reviews"
  exit 1
fi

echo "Parsing the latest review by each user..."
latest_reviews=$(echo "$reviews" | jq -c '[.[]] | group_by(.user.login) | map(max_by(.submitted_at))')

echo "Printing all latest review user logins and states:"
echo "$latest_reviews" | jq -r '.[] | "User: \(.user.login), State: \(.state)"'

echo "Checking approval status of 'coderabbitai[bot]'..."
approval_state=$(echo "$latest_reviews" | jq -r '[.[] | select(.user.login == "coderabbitai[bot]" and .state == "APPROVED")] | length')

echo "Approval count for CodeRabbit.ai: $approval_state"

if [[ "$approval_state" =~ ^[0-9]+$ ]] && [[ $approval_state -gt 0 ]]; then
  echo "Success: PR approved by CodeRabbit.ai."
else
  echo "Error: PR is not approved by CodeRabbit.ai."
  exit 1
fi

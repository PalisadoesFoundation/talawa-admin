#!/bin/bash
echo "Step 1: Fetching all PR reviews with pagination..."

page=1
all_reviews="[]"

while true; do
  echo "Fetching page $page..."
  response=$(curl -s -f -H "Authorization: token $GITHUB_TOKEN" \
    "https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}/reviews?per_page=100&page=$page")
  
  if [ "$(echo "$response" | jq '. | length')" -eq 0 ]; then
    echo "No more reviews to fetch."
    break
  fi

  all_reviews=$(echo "$all_reviews" "$response" | jq -s 'add')
  page=$((page + 1))
done

echo "Debug: Combined reviews from all pages:"
echo "$all_reviews" | jq '.'

reviews="$all_reviews"

echo "Step 2: Parsing the latest review by each user..."
latest_reviews=$(echo "$reviews" | jq -c '[.[]] | group_by(.user.login) | map(max_by(.submitted_at))') || {
  echo "Error: Failed to process reviews JSON"
  exit 1
}

if [ "$latest_reviews" = "null" ] || [ -z "$latest_reviews" ]; then
  echo "Error: Invalid reviews data"
  exit 1
fi

echo "Debug: Grouped latest reviews:"
echo "$latest_reviews" | jq '.'

echo "Step 3: Printing all latest review user logins and states:"
echo "$latest_reviews" | jq -r '.[] | "User: \(.user.login), State: \(.state)"'

echo "Step 4: Checking approval status of 'coderabbitai[bot]'..."
approval_state=$(echo "$latest_reviews" | jq -r '[.[] | select(.user.login == "coderabbitai[bot]" and .state == "APPROVED")] | length')

echo "Approval count for CodeRabbit.ai: $approval_state"

if [[ "$approval_state" =~ ^[0-9]+$ ]] && [[ $approval_state -gt 0 ]]; then
  echo "Success: PR approved by CodeRabbit.ai."
else
  echo "Error: PR is not approved by CodeRabbit.ai."
  exit 1
fi
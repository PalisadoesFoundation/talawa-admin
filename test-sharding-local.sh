#!/bin/bash

# Script to test sharding and coverage merging locally
# This simulates what happens in CI

echo "🧪 Testing Sharded Coverage Locally"
echo "===================================="
echo ""

# Clean up previous coverage
echo "🧹 Cleaning up old coverage data..."
rm -rf coverage coverage-shards
mkdir -p coverage-shards

# Set memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Run each shard
TOTAL_SHARDS=4

for SHARD in {1..4}; do
  echo ""
  echo "📊 Running Shard $SHARD/$TOTAL_SHARDS..."
  
  export SHARD_INDEX=$SHARD
  export SHARD_COUNT=$TOTAL_SHARDS
  
  # Run the shard
  npm run test:shard:coverage
  
  # Check if it succeeded
  if [ $? -eq 0 ]; then
    echo "✅ Shard $SHARD completed successfully"
    
    # Copy coverage to shard directory
    if [ -d "coverage/vitest" ]; then
      mkdir -p "coverage-shards/coverage-shard-$SHARD"
      cp -r coverage/vitest/* "coverage-shards/coverage-shard-$SHARD/"
      echo "📦 Copied coverage for shard $SHARD"
    else
      echo "⚠️  No coverage directory found for shard $SHARD"
    fi
    
    # Clean up for next shard
    rm -rf coverage
  else
    echo "❌ Shard $SHARD failed"
    exit 1
  fi
done

echo ""
echo "🔄 Merging coverage from all shards..."
echo "======================================"

# Install merge tools
npm install --no-save nyc @vitest/coverage-istanbul

# Create directories
mkdir -p coverage/vitest coverage/tmp

# Check for JSON files
JSON_FILES=$(find coverage-shards -name "coverage-*.json" -type f 2>/dev/null | head -1)

if [ -n "$JSON_FILES" ]; then
  echo "📊 Found JSON coverage files - using nyc merge"
  
  # Copy all JSON files from all shards to temp directory
  for shard_dir in coverage-shards/coverage-shard-*/; do
    shard_name=$(basename "$shard_dir")
    if [ -d "${shard_dir}.tmp-1-1" ]; then
      echo "  📂 Processing $shard_name..."
      cp "${shard_dir}.tmp-1-1"/coverage-*.json "./coverage/tmp/" 2>/dev/null || true
    fi
  done
  
  # Check if we got any files
  JSON_COUNT=$(find coverage/tmp -name "coverage-*.json" 2>/dev/null | wc -l)
  echo "  Found $JSON_COUNT JSON coverage files"
  
  if [ "$JSON_COUNT" -gt 0 ]; then
    # Merge using nyc
    echo "  🔄 Merging with nyc..."
    npx nyc merge ./coverage/tmp ./coverage/vitest/coverage-final.json
    
    # Generate lcov from merged JSON
    echo "  📝 Generating lcov report..."
    npx nyc report --reporter=lcov --report-dir=./coverage/vitest --temp-dir=./coverage/vitest
    
    if [ -f "./coverage/vitest/lcov.info" ]; then
      echo "✅ Merge successful!"
      echo "📈 Merged file size: $(wc -l < ./coverage/vitest/lcov.info) lines"
      echo ""
      echo "First 30 lines of merged coverage:"
      head -30 ./coverage/vitest/lcov.info
    else
      echo "❌ Failed to generate lcov.info"
      exit 1
    fi
  else
    echo "❌ No JSON coverage files found to merge"
    exit 1
  fi
else
  echo "❌ No JSON coverage files found in any shard"
  echo "Checking what files exist:"
  find coverage-shards -type f | head -20
  exit 1
fi

echo ""
echo "✅ Local sharding test complete!"
echo ""
echo "To view coverage report, run: npx http-server coverage/vitest -o"

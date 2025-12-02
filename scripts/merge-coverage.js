#!/usr/bin/env node
/**
 * Custom script to merge multiple coverage-final.json files into a single coverage file.
 * This replaces nyc merge which has compatibility issues with Node.js v24.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Merges multiple coverage JSON files into a single coverage object
 * @param {string[]} coverageFiles - Array of paths to coverage JSON files
 * @returns {Object} Merged coverage object
 */
function mergeCoverageFiles(coverageFiles) {
  const mergedCoverage = {};

  for (const filePath of coverageFiles) {
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Coverage file not found: ${filePath}`);
      continue;
    }

    try {
      const coverageData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Merge coverage data
      for (const [sourceFile, fileCoverage] of Object.entries(coverageData)) {
        if (!mergedCoverage[sourceFile]) {
          // First time seeing this file, use its coverage
          mergedCoverage[sourceFile] = { ...fileCoverage };
        } else {
          // Merge coverage for files that appear in multiple shards
          const existing = mergedCoverage[sourceFile];
          const incoming = fileCoverage;

          // Merge statement coverage
          if (incoming.s) {
            if (!existing.s) existing.s = {};
            for (const [stmtId, count] of Object.entries(incoming.s)) {
              existing.s[stmtId] = (existing.s[stmtId] || 0) + (count || 0);
            }
          }

          // Merge branch coverage
          if (incoming.b) {
            if (!existing.b) existing.b = {};
            for (const [branchId, branches] of Object.entries(incoming.b)) {
              if (!existing.b[branchId]) {
                existing.b[branchId] = [...branches];
              } else {
                const maxLen = Math.max(
                  existing.b[branchId].length,
                  branches.length,
                );
                existing.b[branchId] = Array.from(
                  { length: maxLen },
                  (_, idx) =>
                    (existing.b[branchId][idx] || 0) + (branches[idx] || 0),
                );
              }
            }
          }

          // Merge function coverage
          if (incoming.f) {
            if (!existing.f) existing.f = {};
            for (const [funcId, count] of Object.entries(incoming.f)) {
              existing.f[funcId] = (existing.f[funcId] || 0) + (count || 0);
            }
          }

          // Merge line coverage
          if (incoming.l) {
            if (!existing.l) existing.l = {};
            for (const [lineId, count] of Object.entries(incoming.l)) {
              existing.l[lineId] = (existing.l[lineId] || 0) + (count || 0);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading coverage file ${filePath}:`, error.message);
      // Continue processing other files instead of exiting immediately
      // Only exit if this is a critical error
      if (error.code === 'ENOENT' || error.code === 'EACCES') {
        // File system errors are critical
        process.exit(1);
      }
      // JSON parse errors might be recoverable, continue with other files
    }
  }

  return mergedCoverage;
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node merge-coverage.js <input-dir> <output-file>');
  console.error(
    'Example: node merge-coverage.js ./coverage/tmp ./.nyc_output/coverage-final.json',
  );
  process.exit(1);
}

const inputDir = args[0];
const outputFile = args[1];

// Find all JSON coverage files in the input directory
if (!fs.existsSync(inputDir)) {
  console.error(`Error: Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

const files = fs.readdirSync(inputDir);
const coverageFiles = files
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.join(inputDir, file));

if (coverageFiles.length === 0) {
  console.error(`Error: No JSON coverage files found in ${inputDir}`);
  process.exit(1);
}

console.log(`Found ${coverageFiles.length} coverage files to merge:`);
coverageFiles.forEach((file) => console.log(`  - ${file}`));

// Merge coverage files
console.log('Merging coverage files...');
const mergedCoverage = mergeCoverageFiles(coverageFiles);

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write merged coverage to output file
try {
  // Validate merged coverage is not empty
  const fileCount = Object.keys(mergedCoverage).length;
  if (fileCount === 0) {
    console.error('Error: Merged coverage is empty!');
    process.exit(1);
  }

  // Write the file
  fs.writeFileSync(outputFile, JSON.stringify(mergedCoverage, null, 2), 'utf8');

  // Verify the file was written correctly
  if (!fs.existsSync(outputFile)) {
    console.error(`Error: Output file was not created: ${outputFile}`);
    process.exit(1);
  }

  const fileSize = fs.statSync(outputFile).size;
  if (fileSize === 0) {
    console.error(`Error: Output file is empty: ${outputFile}`);
    process.exit(1);
  }

  // Verify it's valid JSON by reading it back
  try {
    const verifyContent = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    if (Object.keys(verifyContent).length === 0) {
      console.error(
        'Error: Merged coverage file contains no data after verification',
      );
      process.exit(1);
    }
  } catch (parseError) {
    console.error(
      'Error: Merged coverage file is not valid JSON:',
      parseError.message,
    );
    process.exit(1);
  }

  console.log(
    `Successfully merged coverage from ${coverageFiles.length} files into ${outputFile}`,
  );
  console.log(`Merged coverage contains ${fileCount} files`);

  // Exit with success code
  process.exit(0);
} catch (error) {
  console.error(`Error writing merged coverage file:`, error.message);
  process.exit(1);
}

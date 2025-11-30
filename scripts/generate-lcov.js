#!/usr/bin/env node
/**
 * Script to generate LCOV report from istanbul coverage JSON file.
 * This replaces nyc report which has compatibility issues with Node.js v24.
 */

import fs from 'node:fs';
import path from 'node:path';
/**
 * Converts istanbul coverage JSON to LCOV format
 * @param {Object} coverageData - Coverage data from istanbul
 * @param {string} basePath - Base path for source files
 * @returns {string} LCOV formatted string
 */
function jsonToLcov(coverageData, basePath = process.cwd()) {
  const lines = [];

  for (const [filePath, fileCoverage] of Object.entries(coverageData)) {
    // Skip if no coverage data
    if (!fileCoverage || typeof fileCoverage !== 'object') {
      continue;
    }

    // Get absolute file path
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(basePath, filePath);

    // Normalize path separators for LCOV format
    const normalizedPath = absolutePath.replace(/\\/g, '/');

    // Start of file record
    lines.push(`SF:${normalizedPath}`);

    // Function coverage
    if (fileCoverage.f) {
      let funcIndex = 0;
      for (const [funcId, count] of Object.entries(fileCoverage.f)) {
        funcIndex++;
        // Extract function name and line from function ID if possible
        // Function IDs in istanbul are typically like "0" or "1"
        lines.push(
          `FN:${funcId},${fileCoverage.fnMap?.[funcId]?.name || `function_${funcId}`}`,
        );
        lines.push(
          `FNDA:${count || 0},${fileCoverage.fnMap?.[funcId]?.name || `function_${funcId}`}`,
        );
      }
      if (funcIndex > 0) {
        lines.push(`FNF:${funcIndex}`);
        lines.push(
          `FNH:${Object.values(fileCoverage.f).filter((c) => c > 0).length}`,
        );
      }
    }

    // Branch coverage
    if (fileCoverage.b) {
      let branchIndex = 0;
      for (const [branchId, branches] of Object.entries(fileCoverage.b)) {
        if (Array.isArray(branches)) {
          branches.forEach((count, idx) => {
            branchIndex++;
            const branchInfo =
              fileCoverage.branchMap?.[branchId]?.locations?.[idx];
            if (branchInfo) {
              lines.push(
                `BRDA:${branchInfo.start.line},${branchInfo.start.column},${branchId},${idx},${count || 0}`,
              );
            }
          });
        }
      }
      if (branchIndex > 0) {
        lines.push(`BRF:${branchIndex}`);
        const coveredBranches = Object.values(fileCoverage.b)
          .flat()
          .filter((c) => c > 0).length;
        lines.push(`BRH:${coveredBranches}`);
      }
    }

    // Line coverage - use statement coverage to infer line coverage
    // This is the most reliable approach as istanbul coverage JSON primarily uses statement coverage
    if (fileCoverage.s && fileCoverage.statementMap) {
      const statementMap = fileCoverage.statementMap;
      const linesWithStatements = new Map();

      // Aggregate statement coverage by line number
      for (const [stmtId, count] of Object.entries(fileCoverage.s)) {
        const stmtInfo = statementMap[stmtId];
        if (stmtInfo && stmtInfo.start) {
          const lineNum = stmtInfo.start.line;
          const currentHits = linesWithStatements.get(lineNum) || 0;
          // Use the maximum count for the line (if multiple statements on same line)
          linesWithStatements.set(lineNum, Math.max(currentHits, count || 0));
        }
      }

      // Write line coverage data
      const sortedLines = Array.from(linesWithStatements.keys()).sort(
        (a, b) => a - b,
      );
      for (const lineNum of sortedLines) {
        lines.push(`DA:${lineNum},${linesWithStatements.get(lineNum)}`);
      }

      if (sortedLines.length > 0) {
        lines.push(`LF:${sortedLines.length}`);
        const coveredLines = Array.from(linesWithStatements.values()).filter(
          (hits) => hits > 0,
        ).length;
        lines.push(`LH:${coveredLines}`);
      }
    } else if (fileCoverage.l) {
      // If line coverage is directly available, use it
      const lineCounts = fileCoverage.l;
      const sortedLineIds = Object.keys(lineCounts).sort((a, b) => {
        // Try to parse as numbers if possible
        const aNum = parseInt(a, 10);
        const bNum = parseInt(b, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });

      for (const lineId of sortedLineIds) {
        const parsed = parseInt(lineId, 10);
        const lineNum = Number.isNaN(parsed) ? lineId : parsed;
        lines.push(`DA:${lineNum},${lineCounts[lineId] || 0}`);
      }

      if (sortedLineIds.length > 0) {
        lines.push(`LF:${sortedLineIds.length}`);
        const coveredLines = sortedLineIds.filter(
          (id) => (lineCounts[id] || 0) > 0,
        ).length;
        lines.push(`LH:${coveredLines}`);
      }
    }

    // End of file record
    lines.push('end_of_record');
  }

  return lines.join('\n') + '\n';
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node generate-lcov.js <input-json> <output-lcov>');
  console.error(
    'Example: node generate-lcov.js ./.nyc_output/coverage-final.json ./coverage/vitest/lcov.info',
  );
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];

// Read coverage JSON
if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file does not exist: ${inputFile}`);
  process.exit(1);
}

try {
  const coverageData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  // Generate LCOV format
  const lcovContent = jsonToLcov(coverageData);

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write LCOV file
  fs.writeFileSync(outputFile, lcovContent, 'utf8');

  const fileCount = Object.keys(coverageData).length;
  console.log(`Successfully generated LCOV report from ${inputFile}`);
  console.log(`Coverage data contains ${fileCount} files`);
  console.log(`LCOV report written to ${outputFile}`);
} catch (error) {
  console.error(`Error generating LCOV report:`, error.message);
  process.exit(1);
}

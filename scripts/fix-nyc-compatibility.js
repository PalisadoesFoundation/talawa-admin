#!/usr/bin/env node
/**
 * Postinstall script to fix nyc compatibility with Node.js v24
 * This creates a wrapper for nyc that intercepts merge and report commands
 * and uses our custom scripts instead
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixNycCompatibility() {
  // Find nyc installation - check both regular and pnpm structures
  const possiblePaths = [
    path.join(process.cwd(), 'node_modules', 'nyc', 'index.js'),
    path.join(
      process.cwd(),
      'node_modules',
      '.pnpm',
      'nyc@17.1.0',
      'node_modules',
      'nyc',
      'index.js',
    ),
  ];

  let nycPath = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      nycPath = possiblePath;
      break;
    }
  }

  if (!nycPath) {
    console.log('nyc not found, skipping compatibility fix');
    return;
  }

  try {
    let content = fs.readFileSync(nycPath, 'utf8');

    // Check if already patched
    if (content.includes('NYC_WRAPPER_V24')) {
      console.log('nyc already wrapped for Node.js v24 compatibility');
      return;
    }

    console.log('Creating nyc wrapper for Node.js v24 compatibility...');

    // Find the project root (where scripts/ directory is)
    let projectRoot = process.cwd();
    let scriptsDir = path.join(projectRoot, 'scripts');
    while (
      !fs.existsSync(scriptsDir) &&
      projectRoot !== path.dirname(projectRoot)
    ) {
      projectRoot = path.dirname(projectRoot);
      scriptsDir = path.join(projectRoot, 'scripts');
    }

    if (!fs.existsSync(scriptsDir)) {
      console.error('Could not find scripts directory');
      return;
    }

    // Create wrapper content with correct paths
    const wrapperContent = `#!/usr/bin/env node
// NYC_WRAPPER_V24 - Wrapper to fix Node.js v24 compatibility
// This intercepts the nyc call and uses our custom merge/report scripts

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find project root
let projectRoot = process.cwd();
let scriptsDir = path.join(projectRoot, 'scripts');
while (!fs.existsSync(scriptsDir) && projectRoot !== path.dirname(projectRoot)) {
  projectRoot = path.dirname(projectRoot);
  scriptsDir = path.join(projectRoot, 'scripts');
}

const args = process.argv.slice(2);
const command = args[0];

// Check if this is a merge or report command
if (command === 'merge') {
  // Use our custom merge script
  const inputDir = args[1] || './coverage/tmp';
  const outputFile = args[2] || './.nyc_output/coverage-final.json';
  const mergeScript = path.join(scriptsDir, 'merge-coverage.js');
  
  if (fs.existsSync(mergeScript)) {
    const child = spawn('node', [mergeScript, inputDir, outputFile], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    child.on('exit', (code) => process.exit(code || 0));
  } else {
    console.error('Merge script not found:', mergeScript);
    process.exit(1);
  }
} else if (command === 'report') {
  // Parse report arguments
  const reporterIndex = args.indexOf('--reporter');
  const reportDirIndex = args.indexOf('--report-dir');
  
  let reporter = 'lcov';
  let reportDir = './coverage/vitest';
  
  if (reporterIndex !== -1 && args[reporterIndex + 1]) {
    reporter = args[reporterIndex + 1];
  }
  if (reportDirIndex !== -1 && args[reportDirIndex + 1]) {
    reportDir = args[reportDirIndex + 1];
  }
  
  if (reporter === 'lcov') {
    // Use our custom LCOV generator
    const inputFile = './.nyc_output/coverage-final.json';
    const outputFile = path.join(reportDir, 'lcov.info');
    const generateScript = path.join(scriptsDir, 'generate-lcov.js');
    
    if (fs.existsSync(generateScript) && fs.existsSync(inputFile)) {
      const child = spawn('node', [generateScript, inputFile, outputFile], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      child.on('exit', (code) => process.exit(code || 0));
    } else {
      console.error('LCOV generation script not found or input file missing');
      console.error('Looking for:', generateScript);
      console.error('Input file exists:', fs.existsSync(inputFile));
      process.exit(1);
    }
  } else {
    // For other reporters, we can't use original nyc due to Node.js v24 issues
    console.error('Only lcov reporter is supported with Node.js v24 compatibility wrapper');
    process.exit(1);
  }
} else {
  // For other commands, we can't use original nyc due to Node.js v24 issues
  console.error('Only "merge" and "report" commands are supported with Node.js v24 compatibility wrapper');
  console.error('Command received:', command);
  process.exit(1);
}
`;

    // Backup original
    const backupPath = nycPath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(nycPath, backupPath);
    }

    // Replace the main file with wrapper
    fs.writeFileSync(nycPath, wrapperContent, 'utf8');
    fs.chmodSync(nycPath, '755');

    console.log(
      'Successfully created nyc wrapper for Node.js v24 compatibility',
    );
  } catch (error) {
    console.error('Error creating nyc wrapper:', error.message);
    // Don't fail the install if patching fails
  }
}

fixNycCompatibility();

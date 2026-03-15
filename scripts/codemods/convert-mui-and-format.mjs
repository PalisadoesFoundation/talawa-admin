#!/usr/bin/env node
/**
 * Wrapper script for the MUI import codemod.
 *
 * This script runs the MUI codemod that converts barrel imports
 * (e.g. `@mui/material`, `@mui/icons-material`) to safe deep imports,
 * and then formats the modified files using Prettier.
 *
 * Example conversion:
 *   import { Dialog } from '@mui/material'
 *   → import Dialog from '@mui/material/Dialog'
 *
 * Usage:
 *   pnpm convert-mui:fix --files <file1> <file2> ...
 *
 * Example:
 *   pnpm convert-mui:fix --files src/components/Button.tsx
 *
 * Only the converted files are formatted to avoid running
 * formatting across the entire repository.
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');

const args = process.argv.slice(2);

if (!args.includes('--files')) {
  console.error(
    'Error: --files flag is required.\n' +
      'Usage: pnpm convert-mui:fix --files <file1> <file2> ...\n\n' +
      'Examples:\n' +
      '  pnpm convert-mui:fix --files src/components/Button.tsx\n' +
      '  pnpm convert-mui:fix --files src/screens/**/*.tsx src/components/**/*.tsx',
  );
  process.exitCode = 1;
  process.exit(1);
}

const runCommand = (cmd, cmdArgs) => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, { cwd: root, stdio: 'inherit', shell: true });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${cmd} failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  try {
    console.log(
      '📦 Converting MUI barrel imports to deep imports...\n',
    );

    // Run the codemod with the provided files
    await runCommand('node', ['scripts/codemods/convert-mui-imports.js', ...args]);

    console.log(
      '\n✨ Formatting converted files...\n',
    );

    // Extract file paths from args
    const filesIndex = args.indexOf('--files');
    const files = args.slice(filesIndex + 1);

    // Run prettier directly on only the converted files
    // (avoids running the global format:fix which reformats the entire codebase)
    await runCommand('pnpm', [
      'exec',
      'prettier',
      '--write',
      ...files,
    ]);

    console.log(
      '\n✅ MUI import conversion and formatting completed!\n',
    );
  } catch (error) {
    console.error(
      '❌ Error:',
      error.message,
      '\n',
    );
    process.exitCode = 1;
  }
};

main();

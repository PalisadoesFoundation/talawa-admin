#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/**
 * Runs the MUI import conversion codemod, then formats the converted files.
 * Usage: node scripts/convert-mui-and-format.mjs --files <file1> <file2> ...
 */

const args = process.argv.slice(2);

if (!args.includes('--files')) {
  console.error(
    '\u001b[31mError: --files flag is required.\u001b[0m\n' +
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
    // Build a single string so shell:true doesn't trigger DEP0190 (args-array warning).
    // Quotes args that contain spaces; works on Windows, macOS, and Linux.
    const fullCmd = [cmd, ...cmdArgs.map((a) => (a.includes(' ') ? `"${a}"` : a))].join(' ');
    const child = spawn(fullCmd, { cwd: root, stdio: 'inherit', shell: true });

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
      '\u001b[1m\u001b[36m📦 Converting MUI barrel imports to deep imports...\u001b[0m\n',
    );

    // Run the codemod with the provided files
    await runCommand('node', ['scripts/convert-mui-imports.js', ...args]);

    console.log(
      '\n\u001b[1m\u001b[36m✨ Formatting converted files...\u001b[0m\n',
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
      '\n\u001b[1m\u001b[32m✅ MUI import conversion and formatting completed!\u001b[0m\n',
    );
  } catch (error) {
    console.error(
      '\u001b[1m\u001b[31m❌ Error:\u001b[0m',
      error.message,
      '\n',
    );
    process.exitCode = 1;
  }
};

main();

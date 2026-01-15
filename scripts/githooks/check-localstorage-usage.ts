#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import type { ExecSyncOptionsWithStringEncoding } from 'child_process';

const args: string[] = process.argv.slice(2);
const scanEntireRepo: boolean = args.includes('--scan-entire-repo');

const containsSkipComment = (file: string): boolean => {
  try {
    const content = readFileSync(file, 'utf-8');
    return content.includes('// SKIP_LOCALSTORAGE_CHECK');
  } catch (error) {
    console.error(
      `Error reading file ${file}:`,
      error instanceof Error ? error.message : error,
    );
    return false;
  }
};

/**
 * Retrieves the list of files to check.
 * Cross-platform compatible: works on Linux, Windows, and MacOS.
 */
const getModifiedFiles = (): string[] => {
  try {
    const options: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' };
    let result: string;

    if (scanEntireRepo) {
      // Get all tracked files without using grep (not available on Windows)
      result = execSync('git ls-files', options);
    } else {
      result = execSync('git diff --cached --name-only', options);
    }

    // Handle both LF and CRLF line endings for cross-platform compatibility
    const files = result
      .trim()
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter((file) => file.length > 0);

    if (scanEntireRepo) {
      // Filter for TypeScript files only when scanning entire repo
      // This replaces the grep command for cross-platform compatibility
      return files.filter((file) => /\.(ts|tsx)$/.test(file));
    }

    return files;
  } catch (error) {
    console.error(
      'Error fetching modified files:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

const files: string[] = getModifiedFiles();
const filesWithLocalStorage: string[] = [];

const checkLocalStorageUsage = (file: string): void => {
  if (!file) {
    return;
  }

  // Normalize path separators for cross-platform compatibility
  const normalizedFile = file.replace(/\\/g, '/');
  const fileName = path.basename(normalizedFile);

  // Skip files with specific names, paths, extensions, or containing a skip comment
  if (
    fileName === 'check-localstorage-usage.ts' || // Updated extension
    fileName === 'useLocalstorage.test.ts' ||
    fileName === 'useLocalstorage.ts' ||
    fileName === 'localStorageMock.ts' || // Test utility that implements localStorage mock
    fileName === 'localStorageMock.spec.ts' || // Tests for localStorage mock utility
    fileName === 'vitest.setup.ts' || // Clears localStorage after each test providing test isolation
    fileName === 'eslint.config.js' || // Configuration file defining rules about localStorage
    normalizedFile.endsWith('.md') || // Skip documentation files
    normalizedFile.startsWith('docs/') || // Skip auto-generated docs
    normalizedFile.startsWith('cypress/') || // Skip Cypress E2E tests
    containsSkipComment(file)
  ) {
    console.log(`Skipping file: ${file}`);
    return;
  }

  try {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');

      if (
        content.includes('localStorage.getItem') ||
        content.includes('localStorage.setItem') ||
        content.includes('localStorage.removeItem') ||
        content.includes('localStorage.clear')
      ) {
        filesWithLocalStorage.push(file);
      }
    } else {
      console.log(`File ${file} does not exist.`);
    }
  } catch (error) {
    console.error(
      `Error reading file ${file}:`,
      error instanceof Error ? error.message : error,
    );
  }
};

files.forEach(checkLocalStorageUsage);

if (filesWithLocalStorage.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '\nError: Found usage of localStorage');
  console.error('\nFiles with localStorage usage:');
  filesWithLocalStorage.forEach((file) => console.error(file));

  console.info(
    '\x1b[34m%s\x1b[0m',
    '\nInfo: Consider using custom hook functions.',
  );
  console.info(
    'Please use the getItem, setItem, removeItem and clearAllItems functions provided by the custom hook useLocalStorage.\n',
  );

  process.exit(1);
}

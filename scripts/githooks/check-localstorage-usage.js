#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const args = process.argv.slice(2);
const scanEntireRepo = args.includes('--scan-entire-repo');

const containsSkipComment = (file) => {
  try {
    const content = readFileSync(file, 'utf-8');
    return content.includes('// SKIP_LOCALSTORAGE_CHECK');
  } catch (error) {
    console.error(`Error reading file ${file}:`, error.message);
    return false;
  }
};

const getModifiedFiles = () => {
  try {
    if (scanEntireRepo) {
      const result = execSync('git ls-files "*.ts" "*.tsx"', {
        encoding: 'utf-8',
      });
      return result.trim().split(/\r?\n/).filter(Boolean);
    }

    const result = execSync('git diff --cached --name-only', {
      encoding: 'utf-8',
    });
    return result.trim().split('\n');
  } catch (error) {
    console.error('Error fetching modified files:', error.message);
    process.exit(1);
  }
};

const files = getModifiedFiles();

const filesWithLocalStorage = [];

const checkLocalStorageUsage = (file) => {
  if (!file) {
    return;
  }

  const fileName = path.basename(file);

  // Skip files with specific names or containing a skip comment
  if (
    fileName === 'check-localstorage-usage.js' ||
    fileName === 'useLocalstorage.test.ts' ||
    fileName === 'useLocalstorage.ts' ||
    containsSkipComment(file)
  ) {
    console.log(`Skipping file: ${file}`);
    return;
  }

  try {
    const absolutePath = path.resolve(file);
    if (existsSync(absolutePath)) {
      // Quick check if file might be binary
      const buffer = readFileSync(absolutePath, { flag: 'r' });

      if (buffer.includes(0)) {
        console.log(`Skipping binary file: ${file}`);
        return;
      }

      const content = buffer.toString('utf-8');

      if (
        content.includes('localStorage.getItem') ||
        content.includes('localStorage.setItem') ||
        content.includes('localStorage.removeItem')
      ) {
        filesWithLocalStorage.push(file);
      }
    } else {
      console.log(`File ${file} does not exist.`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${file}`);
    } else if (error.code === 'EACCES') {
      console.error(`Permission denied: ${file}`);
    } else {
      console.error(`Error reading file ${file}:`, error.message);
    }
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
    'Please use the getItem, setItem, and removeItem functions provided by the custom hook useLocalStorage.\n',
  );

  process.exit(1);
}

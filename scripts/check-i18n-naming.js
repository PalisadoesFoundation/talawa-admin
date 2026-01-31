#!/usr/bin/env node

/**
 * i18n Translation Key Naming Convention Checker
 *
 * This script validates that all translation keys in the common.json file
 * follow the camelCase naming convention. It scans the JSON file and identifies
 * keys that violate the convention by:
 * - Starting with uppercase letters
 * - Containing spaces, underscores, or dashes
 * - Using special characters
 *
 * The script provides detailed error reports including:
 * - Line numbers where violations occur
 * - Specific issues with each key
 * - Suggested camelCase alternatives
 *
 * Exit codes:
 * - 0: All keys follow camelCase convention
 * - 1: Violations detected
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/locales/en/common.json');
const localesDir = path.join(__dirname, '../public/locales');
const localeFilePaths = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .flatMap((dirent) =>
    ['common.json', 'translation.json'].map((file) =>
      path.join(localesDir, dirent.name, file),
    ),
  );

/**
 * Checks if a string follows camelCase convention.
 * Valid camelCase: starts with lowercase, contains only letters and numbers.
 *
 * @param {string} str - The string to check
 * @returns {boolean} True if the string is camelCase, false otherwise
 * @example
 * isCamelCase('myKey'); // true
 * isCamelCase('MyKey'); // false (starts with uppercase)
 * isCamelCase('my_key'); // false (contains underscore)
 */
const isCamelCase = (str) => {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
};

/**
 * Identifies specific violations in a key's naming.
 *
 * @param {string} key - The key to analyze
 * @returns {string[]} Array of violation descriptions
 * @example
 * getViolations('My_Key'); // ['Starts with uppercase', 'Contains underscores or dashes']
 */
const getViolations = (key) => {
  const violations = [];

  if (/^[A-Z]/.test(key)) {
    violations.push('Starts with uppercase');
  }
  if (/\s/.test(key)) {
    violations.push('Contains spaces');
  }
  if (/[_-]/.test(key)) {
    violations.push('Contains underscores or dashes');
  }
  if (/[^a-zA-Z0-9]/.test(key)) {
    violations.push('Contains special characters');
  }

  return violations;
};

/**
 * Suggests a camelCase version of a key.
 *
 * @param {string} key - The key to convert
 * @returns {string} Suggested camelCase version
 * @example
 * suggestCamelCase('My_Key'); // 'myKey'
 * suggestCamelCase('SOME KEY'); // 'someKey'
 */
const suggestCamelCase = (key) => {
  return key
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * Finds the line number of a key in the JSON file content.
 *
 * @param {string} content - The file content
 * @param {string} keyPath - The full path to the key (e.g., 'parent.child.key')
 * @returns {number|null} The 1-indexed line number, or null if not found
 */
const findKeyLineNumber = (content, keyPath) => {
  const lines = content.split('\n');
  const searchKey = keyPath.split('.').pop();
  const searchPattern = `"${searchKey}"`;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchPattern)) {
      return i + 1;
    }
  }
  return null;
};

/**
 * Recursively traverses a JSON object to find all non-camelCase keys.
 *
 * @param {object} obj - The JSON object to traverse
 * @param {string} content - The original file content for line number lookup
 * @param {string} prefix - Current path prefix for nested keys
 * @returns {Array<{key: string, lineNumber: number|null, violations: string[], suggestion: string}>}
 *          Array of violation objects
 */
const findInvalidKeys = (obj, content, prefix = '') => {
  const invalid = [];

  for (const key in obj) {
    const fullPath = prefix ? `${prefix}.${key}` : key;

    if (!isCamelCase(key)) {
      const lineNumber = findKeyLineNumber(content, fullPath);
      const violations = getViolations(key);
      const suggestion = suggestCamelCase(key);

      invalid.push({
        key: fullPath,
        lineNumber,
        violations,
        suggestion,
      });
    }

    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      invalid.push(...findInvalidKeys(value, content, fullPath));
    }
  }
  return invalid;
};

/**
 * Main validation function.
 * Reads the common.json file, checks for violations, and reports results.
 */
const runValidation = () => {
  console.log('Checking i18n key naming conventions...\n');

  try {
    const filesToCheck = localeFilePaths.length ? localeFilePaths : [filePath];
    const missing = filesToCheck.filter((file) => !fs.existsSync(file));
    if (missing.length > 0) {
      missing.forEach((file) => console.error(`❌ File not found: ${file}`));
      process.exit(1);
    }

    const invalidKeys = filesToCheck.flatMap((file) => {
      const content = fs.readFileSync(file, 'utf8');
      const json = JSON.parse(content);
      return findInvalidKeys(json, content).map((violation) => ({
        ...violation,
        file,
      }));
    });

    if (invalidKeys.length > 0) {
      console.error(`❌ Found ${invalidKeys.length} non-camelCase key(s):\n`);

      invalidKeys.forEach(
        ({ file, key, lineNumber, violations, suggestion }) => {
          const relPath = path.relative(process.cwd(), file);
          console.error(
            `  • ${relPath}: ${key}${lineNumber ? ` (line ${lineNumber})` : ''}`,
          );
          violations.forEach((v) => console.error(`    ❌ ${v}`));
          if (suggestion !== key) {
            console.error(`    ✅ Suggested: ${suggestion}`);
          }
          console.error('');
        },
      );

      process.exit(1);
    } else {
      console.log('✅ All keys follow camelCase convention');
    }
  } catch (error) {
    console.error('❌ Error processing file:', error.message);
    process.exit(1);
  }
};

// Run validation if executed directly
if (process.argv[1] === __filename) {
  runValidation();
}

export {
  isCamelCase,
  findInvalidKeys,
  runValidation,
  filePath,
  getViolations,
  suggestCamelCase,
};

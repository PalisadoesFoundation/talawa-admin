#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Verifies no hardcoded values remain after migration
 *
 * Usage: pnpm run validate-tokens
 * Options:
 *   --files <file...>     Validate specific files (space-separated list)
 *   --staged             Validate staged files only
 *   --scan-entire-repo   Ignore file lists and scan all source files
 *   --warn               Log warnings without failing
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

interface IValidationResult {
  file: string;
  line: number;
  match: string;
  type: 'color' | 'spacing' | 'font-size' | 'font-weight';
}

export const PATTERNS = {
  color: /#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?/g,
  spacingPx:
    /(?:padding|margin|width|height|gap|top|right|bottom|left):\s*(?:\d+px\s*)+/g,
  fontSize: /font-size:\s*\d+px/g,
  fontWeight: /font-weight:\s*[1-9]00/g,
};

const normalizePath = (file: string): string => file.split(path.sep).join('/');

const getFlagValues = (args: string[], flag: string): string[] => {
  const values: string[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === flag) {
      let j = i + 1;
      for (; j < args.length; j += 1) {
        const next = args[j];
        if (next.startsWith('--')) {
          break;
        }
        values.push(next);
      }
      i = j - 1;
      continue;
    }

    if (arg.startsWith(`${flag}=`)) {
      const value = arg.slice(flag.length + 1);
      if (value) {
        values.push(value);
      }
    }
  }

  return values;
};

const args = process.argv.slice(2);
const warnOnly: boolean = args.includes('--warn') || args.includes('--warning');
const scanEntireRepo: boolean = args.includes('--scan-entire-repo');
const hasFilesFlag: boolean =
  !scanEntireRepo &&
  args.some((arg) => arg === '--files' || arg.startsWith('--files='));
const filesFromArgs: string[] = hasFilesFlag
  ? getFlagValues(args, '--files')
  : [];
const stagedOnly: boolean =
  args.includes('--staged') && !scanEntireRepo && !hasFilesFlag;

export const shouldSkipFile = (file: string): boolean => {
  const normalized = normalizePath(file);
  return (
    normalized.includes('node_modules') ||
    normalized.includes('build') ||
    normalized.includes('dist') ||
    normalized.includes('/tokens/') ||
    normalized === 'src/assets/css/app.css' ||
    normalized.startsWith('src/style/tokens/')
  );
};

export const isSrcFile = (file: string): boolean =>
  normalizePath(file).startsWith('src/');

export const getStagedFiles = (): string[] => {
  try {
    const output = execSync(
      'git diff --cached --name-only --diff-filter=ACMRT',
      {
        encoding: 'utf-8',
      },
    ).trim();
    return output ? output.split('\n') : [];
  } catch (error) {
    console.error(
      'Error reading staged files:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

export const filterByExtensions = (
  files: string[],
  extensions: Set<string>,
): string[] => files.filter((file) => extensions.has(path.extname(file)));

export async function validateFiles(
  pattern: string,
  files?: string[],
): Promise<IValidationResult[]> {
  const filesToCheck = files ?? (await glob(pattern));
  const results: IValidationResult[] = [];

  for (const file of filesToCheck) {
    if (!isSrcFile(file) || shouldSkipFile(file)) {
      continue;
    }

    let content: string;
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (error) {
      console.error(error);
      continue;
    }
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const colorMatches = line.match(PATTERNS.color);
      if (colorMatches) {
        colorMatches.forEach((match) => {
          results.push({
            file,
            line: index + 1,
            match,
            type: 'color',
          });
        });
      }

      const spacingMatches = line.match(PATTERNS.spacingPx);
      if (spacingMatches) {
        spacingMatches.forEach((match) => {
          results.push({
            file,
            line: index + 1,
            match,
            type: 'spacing',
          });
        });
      }

      const fontSizeMatches = line.match(PATTERNS.fontSize);
      if (fontSizeMatches) {
        fontSizeMatches.forEach((match) => {
          results.push({
            file,
            line: index + 1,
            match,
            type: 'font-size',
          });
        });
      }

      const fontWeightMatches = line.match(PATTERNS.fontWeight);
      if (fontWeightMatches) {
        fontWeightMatches.forEach((match) => {
          results.push({
            file,
            line: index + 1,
            match,
            type: 'font-weight',
          });
        });
      }
    });
  }

  return results;
}

export async function main() {
  console.log('Validating design token usage...\n');

  const filesFromFlags = hasFilesFlag
    ? Array.from(new Set(filesFromArgs.filter((file) => file.trim() !== '')))
    : [];
  const stagedFiles = stagedOnly ? getStagedFiles() : [];
  const tsExtensions = new Set(['.ts', '.tsx']);
  const cssExtensions = new Set(['.css', '.scss', '.sass']);

  const tsFiles = hasFilesFlag
    ? filterByExtensions(filesFromFlags, tsExtensions)
    : stagedFiles.length > 0
      ? filterByExtensions(stagedFiles, tsExtensions)
      : undefined;
  const cssFiles = hasFilesFlag
    ? filterByExtensions(filesFromFlags, cssExtensions)
    : stagedFiles.length > 0
      ? filterByExtensions(stagedFiles, cssExtensions)
      : undefined;

  const tsResults = await validateFiles('src/**/*.{ts,tsx}', tsFiles);
  const cssResults = await validateFiles('src/**/*.{css,scss,sass}', cssFiles);

  const allResults = [...tsResults, ...cssResults];

  if (allResults.length === 0) {
    console.log('No hardcoded values found. All files use design tokens.\n');
    process.exit(0);
  }

  const log = warnOnly ? console.warn : console.error;
  log(`Found ${allResults.length} hardcoded values:\n`);

  const byType = allResults.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, IValidationResult[]>,
  );

  Object.entries(byType).forEach(([type, results]) => {
    log(`- ${type.toUpperCase()} (${results.length} instances):`);
    results.slice(0, 10).forEach((result) => {
      log(`  ${result.file}:${result.line} -> ${result.match}`);
    });
    if (results.length > 10) {
      log(`  ... and ${results.length - 10} more`);
    }
  });

  log('\nRun migration script to fix these issues.\n');
  if (!warnOnly) {
    process.exit(1);
  }
}

const isExecutedAsScript =
  process.argv[1] &&
  normalizePath(path.resolve(process.argv[1])) ===
    normalizePath(fileURLToPath(import.meta.url));

if (isExecutedAsScript) {
  main().catch((error) => {
    console.error('Error running validation:', error);
    process.exit(1);
  });
}

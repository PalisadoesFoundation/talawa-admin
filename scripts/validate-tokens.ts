#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Verifies no hardcoded values remain after migration
 *
 * Usage: pnpm run validate-tokens
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

interface IValidationResult {
  file: string;
  line: number;
  match: string;
  type: 'color' | 'spacing' | 'font-size' | 'font-weight';
}

const PATTERNS = {
  color: /#[0-9a-fA-F]{3,6}/g,
  spacingPx:
    /(?:padding|margin|width|height|gap|top|right|bottom|left):\s*\d+px/g,
  fontSize: /font-size:\s*\d+px/g,
  fontWeight: /font-weight:\s*[4-7]\d0/g,
};

const args = process.argv.slice(2);
const warnOnly: boolean = args.includes('--warn') || args.includes('--warning');
const scanEntireRepo: boolean = args.includes('--scan-entire-repo');
const stagedOnly: boolean = args.includes('--staged') && !scanEntireRepo;

const normalizePath = (file: string): string => file.split(path.sep).join('/');

const shouldSkipFile = (file: string): boolean => {
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

const isSrcFile = (file: string): boolean =>
  normalizePath(file).startsWith('src/');

const getStagedFiles = (): string[] => {
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

const filterByExtensions = (
  files: string[],
  extensions: Set<string>,
): string[] => files.filter((file) => extensions.has(path.extname(file)));

async function validateFiles(
  pattern: string,
  files?: string[],
): Promise<IValidationResult[]> {
  const filesToCheck = files ?? (await glob(pattern));
  const results: IValidationResult[] = [];

  for (const file of filesToCheck) {
    if (!isSrcFile(file) || shouldSkipFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
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

async function main() {
  console.log('Validating design token usage...\n');

  const stagedFiles = stagedOnly ? getStagedFiles() : [];
  const tsExtensions = new Set(['.ts', '.tsx']);
  const cssExtensions = new Set(['.css', '.scss', '.sass']);

  const tsFiles =
    stagedFiles.length > 0
      ? filterByExtensions(stagedFiles, tsExtensions)
      : undefined;
  const cssFiles =
    stagedFiles.length > 0
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

main().catch((error) => {
  console.error('Error running validation:', error);
  process.exit(1);
});

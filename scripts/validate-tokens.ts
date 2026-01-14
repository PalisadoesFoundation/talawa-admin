#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Verifies no hardcoded values remain after migration
 * For more details, see docs/docs/docs/developer-resources/design-token-system.md
 *
 * Usage: npx tsx scripts/validate-tokens.ts
 * Options:
 *   --files <file...>     Validate specific files (space-separated list); checks added lines unless --all is set
 *   --staged              Validate staged files only; checks added lines unless --all is set
 *   --all                 When used with --files or --staged, scan entire files
 *   --scan-entire-repo    Ignore file lists and scan all source files
 *   --warn                Log warnings without failing
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

interface IValidationResult {
  file: string;
  line: number;
  match: string;
  type: 'color' | 'spacing' | 'font-size' | 'font-weight';
}

type LineFilter = (file: string, lineNumber: number) => boolean;

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
const checkAll: boolean = args.includes('--all');
const hasFilesFlag: boolean =
  !scanEntireRepo &&
  args.some((arg) => arg === '--files' || arg.startsWith('--files='));
const filesFromArgs: string[] = hasFilesFlag
  ? getFlagValues(args, '--files')
  : [];
const stagedOnly: boolean =
  args.includes('--staged') && !scanEntireRepo && !hasFilesFlag;
const checkAddedLinesOnly: boolean =
  !checkAll && !scanEntireRepo && (hasFilesFlag || stagedOnly);

export const shouldSkipFile = (file: string): boolean => {
  const normalized = normalizePath(file);
  return (
    normalized.includes('node_modules') ||
    normalized.includes('build') ||
    normalized.includes('dist') ||
    normalized.includes('/tokens/') ||
    normalized === 'src/style/app-fixed.module.css' ||
    normalized === 'src/assets/css/app.css' ||
    normalized === 'src/style/app-fixed.module.css' ||
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

export const toRepoRelativePath = (file: string): string => {
  const relative = path.isAbsolute(file)
    ? path.relative(process.cwd(), file)
    : file;
  return normalizePath(relative);
};

export const parseAddedLineNumbers = (diff: string): Set<number> => {
  const addedLines = new Set<number>();
  let newLine = 0;

  diff.split('\n').forEach((line) => {
    if (line.startsWith('@@')) {
      const match = /@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
      if (match) {
        newLine = Number.parseInt(match[1], 10);
      }
      return;
    }

    if (line.startsWith('+++') || line.startsWith('---')) {
      return;
    }

    if (line.startsWith('+')) {
      if (newLine > 0) {
        addedLines.add(newLine);
      }
      newLine += 1;
      return;
    }

    if (line.startsWith(' ')) {
      newLine += 1;
    }
  });

  return addedLines;
};

export const getStagedAddedLines = (file: string): Set<number> => {
  const repoPath = toRepoRelativePath(file);
  if (!repoPath) {
    return new Set();
  }

  try {
    const result = spawnSync(
      'git',
      ['diff', '--cached', '-U0', '--', repoPath],
      {
        encoding: 'utf-8',
      },
    );
    if (result.error) {
      throw result.error;
    }
    const diff = result.stdout;
    return parseAddedLineNumbers(diff);
  } catch (error) {
    console.error(
      `Error reading staged diff for ${repoPath}:`,
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

export const getAddedLinesByFile = (
  files: string[],
): Map<string, Set<number>> => {
  const addedLinesByFile = new Map<string, Set<number>>();

  files.forEach((file) => {
    addedLinesByFile.set(normalizePath(file), getStagedAddedLines(file));
  });

  return addedLinesByFile;
};

export const formatCount = (count: number, label: string): string =>
  `${count} ${label}${count === 1 ? '' : 's'}`;

export async function validateFiles(
  pattern: string,
  files?: string[],
  lineFilter?: LineFilter,
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
      const lineNumber = index + 1;
      if (lineFilter && !lineFilter(file, lineNumber)) {
        return;
      }

      const colorMatches = line.match(PATTERNS.color);
      if (colorMatches) {
        colorMatches.forEach((match) => {
          results.push({
            file,
            line: lineNumber,
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
            line: lineNumber,
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
            line: lineNumber,
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
            line: lineNumber,
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

  const filesForDiff = new Set<string>();
  if (tsFiles) {
    tsFiles.forEach((file) => filesForDiff.add(file));
  }
  if (cssFiles) {
    cssFiles.forEach((file) => filesForDiff.add(file));
  }

  const addedLinesByFile =
    checkAddedLinesOnly && filesForDiff.size > 0
      ? getAddedLinesByFile(Array.from(filesForDiff))
      : undefined;

  const lineFilter = addedLinesByFile
    ? (file: string, lineNumber: number): boolean => {
        const allowedLines = addedLinesByFile.get(normalizePath(file));
        return !!allowedLines && allowedLines.has(lineNumber);
      }
    : undefined;

  const tsResults = await validateFiles(
    'src/**/*.{ts,tsx}',
    tsFiles,
    lineFilter,
  );
  const cssResults = await validateFiles(
    'src/**/*.{css,scss,sass}',
    cssFiles,
    lineFilter,
  );

  const allResults = [...tsResults, ...cssResults];

  if (allResults.length === 0) {
    console.log('No hardcoded values found. All files use design tokens.\n');
    process.exit(0);
  }

  const log = warnOnly ? console.warn : console.error;
  const fileCount = new Set(
    allResults.map((result) => normalizePath(result.file)),
  ).size;
  const heading = warnOnly
    ? 'Design token validation warnings'
    : 'Design token validation failed';
  log(heading);
  log(
    `Found ${formatCount(allResults.length, 'hardcoded value')} across ${formatCount(
      fileCount,
      'file',
    )}.`,
  );

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

  log('\nFix the values above and re-run the check.\n');
  log('Replace hardcoded values with tokens from src/style/tokens.\n');
  log(
    'Refer: docs/docs/docs/developer-resources/design-token-system.md for more details.\n',
  );
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

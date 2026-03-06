#!/usr/bin/env node
/**
 * check-pagination-usage.ts
 *
 * Linter that prevents `src/screens/**` files from using raw pagination
 * patterns that should be replaced by the `PaginationControl` shared component.
 *
 * @remarks
 * Banned patterns (in non-test, non-exempted screen files):
 * - `paginationModel`              – MUI DataGrid controlled pagination state
 * - `onPaginationModelChange`      – MUI DataGrid pagination callback
 * - `Rows per page`                – inline string (outside PaginationControl)
 * - `<Pagination`                  – direct MUI / custom Pagination import
 *
 * Escape hatch: add `// SKIP_PAGINATION_CHECK` anywhere in the file.
 *
 * Modes (mutually exclusive, evaluated in order):
 * - `--staged`              check staged files that match src/screens/**
 * - `--scan-entire-repo`    check all tracked files under src/screens/**
 * - `--files <f1> <f2>...`  check the explicitly provided list of files
 *
 * Exits 0 on success, 1 on violations.
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import type { ExecSyncOptionsWithStringEncoding } from 'child_process';
import path from 'path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Regex patterns considered violations in screen files. */
const BANNED_PATTERNS: RegExp[] = [
  /paginationModel/,
  /onPaginationModelChange/,
  /Rows per page/,
  /<Pagination\b/,
];

/** Glob that restricts which files we care about. */
const SCREEN_FILE_RE = /^src[\\/]screens[\\/].*\.(ts|tsx)$/;

/** Skip spec / test files (they may legitimately reference these patterns). */
const TEST_FILE_RE = /\.(spec|test)\.(ts|tsx)$/;

/** Skip the escape-hatch comment. */
const SKIP_COMMENT = '// SKIP_PAGINATION_CHECK';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const isStaged = args.includes('--staged');
const isScanRepo = args.includes('--scan-entire-repo');
const filesIdx = args.indexOf('--files');
const hasExplicitFiles = filesIdx !== -1;

// ---------------------------------------------------------------------------
// File resolution
// ---------------------------------------------------------------------------

function getFiles(): string[] {
  const opts: ExecSyncOptionsWithStringEncoding = { encoding: 'utf-8' };

  if (isStaged) {
    const raw = execSync('git diff --cached --name-only', opts);
    return raw
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);
  }

  if (isScanRepo) {
    const raw = execSync(
      'git ls-files -- "src/screens/**/*.ts" "src/screens/**/*.tsx"',
      opts,
    );
    return raw
      .trim()
      .split('\n')
      .filter((f) => f.length > 0);
  }

  if (hasExplicitFiles) {
    return args.slice(filesIdx + 1).filter((f) => f.length > 0);
  }

  // Default: staged files (same as --staged)
  const raw = execSync('git diff --cached --name-only', opts);
  return raw
    .trim()
    .split('\n')
    .filter((f) => f.length > 0);
}

// ---------------------------------------------------------------------------
// Per-file check
// ---------------------------------------------------------------------------

interface IViolation {
  file: string;
  line: number;
  pattern: string;
  content: string;
}

function checkFile(filePath: string): IViolation[] {
  const violations: IViolation[] = [];
  const basename = path.basename(filePath);

  // Only check screen files matching our glob
  if (!SCREEN_FILE_RE.test(filePath.replace(/\\/g, '/'))) return violations;

  // Skip test files
  if (TEST_FILE_RE.test(basename)) return violations;

  if (!existsSync(filePath)) return violations;

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    console.warn(
      `[check-pagination-usage] Could not read ${filePath}, skipping.`,
    );
    return violations;
  }

  // Escape hatch
  if (content.includes(SKIP_COMMENT)) {
    console.log(`[check-pagination-usage] Skipping ${filePath} (escape hatch)`);
    return violations;
  }

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: i + 1,
          pattern: pattern.source,
          content: line.trim(),
        });
      }
    }
  }

  return violations;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const files = getFiles();
const allViolations: IViolation[] = [];

for (const file of files) {
  const v = checkFile(file);
  allViolations.push(...v);
}

if (allViolations.length > 0) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '\n❌ check-pagination-usage: Banned pagination pattern(s) detected in src/screens/**\n',
  );

  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}  [${v.pattern}]`);
    console.error(`    ${v.content}\n`);
  }

  console.info(
    '\x1b[34m%s\x1b[0m',
    'ℹ️  Use <PaginationControl> from shared-components/PaginationControl instead.',
  );
  console.info(
    'To suppress for a file, add `// SKIP_PAGINATION_CHECK` anywhere in that file.\n',
  );

  process.exit(1);
}

console.log(
  '\x1b[32m%s\x1b[0m',
  '✅ check-pagination-usage: No banned pagination patterns found.',
);
process.exit(0);

#!/usr/bin/env node

/**
 * Design Token Validation Script
 * Verifies no hardcoded values remain after migration
 * For more details, see docs/docs/docs/developer-resources/design-token-system.md
 *
 * Usage: pnpm exec tsx scripts/validate-tokens.ts
 * Options:
 *   --files \<file...\>    Validate specific files (space-separated list); entire file content is checked
 *   --staged --all        Validate entire content of staged files only (both flags required)
 *   --scan-entire-repo    Ignore file lists and scan all source files
 *
 * Note: --staged cannot be combined with --files or --scan-entire-repo.
 *
 * Detected patterns:
 *   - Hex colors (#fff, #ffffff, #ffffffaa)
 *   - RGB/RGBA colors (rgb(0,0,0), rgba(0,0,0,0.5))
 *   - HSL/HSLA colors (hsl(0,0%,0%), hsla(0,0%,0%,0.5))
 *   - CSS spacing properties with px/rem/em values
 *   - CSS font-size with px/rem/em values
 *   - CSS font-weight with numeric values (100-900)
 *   - CSS line-height with px values
 *   - CSS border-radius with px/rem/em values
 *   - CSS border with px values and colors
 *   - CSS box-shadow with hardcoded values
 *   - TSX inline styles with camelCase properties (marginTop, paddingLeft, fontSize, etc.)
 *   - MUI sx prop patterns
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

/**
 * Allowed validation categories for design token checks.
 *
 * **CSS categories** (for .css/.scss files):
 * - `'color'` - Hex colors (#fff, #ffffff), RGB/RGBA, and HSL/HSLA color values
 * - `'spacing'` - Margin, padding, gap, width, height, and positional properties with px/rem/em units
 * - `'font-size'` - Font size declarations with px/rem/em units
 * - `'font-weight'` - Numeric font weight values (100-900)
 * - `'line-height'` - Line height with px/rem/em units
 * - `'border-radius'` - Border radius with px/rem/em units
 * - `'border'` - Border width and full border declarations with hardcoded values
 * - `'box-shadow'` - Box shadow with hardcoded offset/blur/spread values and colors
 * - `'outline'` - Outline width and full outline declarations
 *
 * **TSX categories** (for inline styles in .ts/.tsx files):
 * - `'tsx-color'` - Color values in camelCase style properties (color, backgroundColor, etc.)
 * - `'tsx-spacing'` - Spacing in camelCase (marginTop, paddingLeft, width, height, gap, etc.)
 * - `'tsx-font-size'` - fontSize property with hardcoded values
 * - `'tsx-font-weight'` - fontWeight property with numeric values
 * - `'tsx-line-height'` - lineHeight property with px/rem/em units
 * - `'tsx-border-radius'` - borderRadius property with hardcoded values
 * - `'tsx-outline'` - outline/outlineWidth properties with hardcoded values
 */
export type ValidationResultType =
  | 'color'
  | 'spacing'
  | 'font-size'
  | 'font-weight'
  | 'line-height'
  | 'border-radius'
  | 'border'
  | 'box-shadow'
  | 'outline'
  | 'tsx-spacing'
  | 'tsx-font-size'
  | 'tsx-font-weight'
  | 'tsx-color'
  | 'tsx-line-height'
  | 'tsx-border-radius'
  | 'tsx-outline';

/**
 * Models a single validation finding representing a hardcoded value
 * that should be replaced with a design token.
 */
interface IValidationResult {
  /** Absolute or relative path to the file containing the violation */
  file: string;
  /** 1-based line number where the violation was found */
  line: number;
  /** The matched text that triggered the violation (e.g., "padding: 8px", "#ffffff") */
  match: string;
  /** Category of the violation indicating which design token type should be used */
  type: ValidationResultType;
}

/**
 * CSS Patterns for detecting hardcoded values
 */
export const CSS_PATTERNS = {
  // Color patterns
  hexColor: /#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?/g,
  rgbColor:
    /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+)?\s*\)/gi,
  hslColor:
    /hsla?\(\s*\d{1,3}\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*(,\s*[\d.]+)?\s*\)/gi,

  // Spacing patterns - matches px, rem, em values
  // Note: padding and margin are handled exclusively by spacingShorthand to avoid double-counting
  spacingPx:
    /(?:width|height|gap|top|right|bottom|left|inset):\s*-?[\d.]+(px|rem|em)(\s+-?[\d.]+(px|rem|em))*/gi,
  // Shorthand spacing - handles all padding/margin patterns (single and multi-value)
  spacingShorthand:
    /(?:padding|margin):\s*-?[\d.]+(px|rem|em)(\s+-?[\d.]+(px|rem|em))*/gi,

  // Typography patterns
  fontSize: /font-size:\s*[\d.]+(px|rem|em)/gi,
  fontWeight: /font-weight:\s*[1-9]00/g,
  lineHeightPx: /line-height:\s*[\d.]+(px|rem|em)/gi,

  // Border patterns
  borderRadius: /border-radius:\s*[\d.]+(px|rem|em)(\s+[\d.]+(px|rem|em))*/gi,
  borderWidth:
    /border(-top|-right|-bottom|-left)?(-width)?:\s*[\d.]+(px|rem|em)/gi,
  borderFull:
    /border(-top|-right|-bottom|-left)?:\s*[\d.]+(px|rem|em)\s+\w+\s+#[0-9a-fA-F]{3,8}/gi,

  // Box shadow with hardcoded values
  boxShadow:
    /box-shadow:\s*(-?[\d.]+(px|rem|em)\s*){2,4}(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi,

  // Outline patterns
  outlineWidth: /outline(-width)?:\s*[\d.]+(px|rem|em)/gi,
  outlineFull:
    /outline:\s*[\d.]+(px|rem|em)\s+\w+\s+(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))/gi,
};

/**
 * TSX/JS Patterns for detecting hardcoded values in inline styles
 * Matches patterns like: marginTop: 8, marginTop: '8px', fontSize: 16
 */
export const TSX_PATTERNS = {
  // Spacing camelCase properties with numeric or string px/rem/em values
  spacingCamelCase:
    /(?:margin|padding)(?:Top|Right|Bottom|Left|Inline|Block|InlineStart|InlineEnd|BlockStart|BlockEnd)?:\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+)/gi,
  // Width/height with hardcoded values
  dimensionsCamelCase:
    /(?:width|height|minWidth|minHeight|maxWidth|maxHeight|gap|rowGap|columnGap|top|right|bottom|left):\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+)/gi,

  // Font size in TSX
  fontSizeCamelCase:
    /fontSize:\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+)/gi,

  // Font weight in TSX (numeric values)
  fontWeightCamelCase: /fontWeight:\s*(?:'?[1-9]00'?|"[1-9]00"|[1-9]00)/gi,

  // Line height in TSX
  lineHeightCamelCase:
    /lineHeight:\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+(?:px|rem|em))/gi,

  // Border radius in TSX
  borderRadiusCamelCase:
    /borderRadius:\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+)/gi,

  // Colors in TSX (hex, rgb, hsl)
  colorCamelCase:
    /(?:color|backgroundColor|borderColor|background):\s*(?:'#[0-9a-fA-F]{3,8}'|"#[0-9a-fA-F]{3,8}"|'rgba?\([^']+\)'|"rgba?\([^"]+\)"|'hsla?\([^']+\)'|"hsla?\([^"]+\)")/gi,

  // Outline in TSX
  outlineCamelCase:
    /(?:outline|outlineWidth):\s*(?:'[^']*(?:px|rem|em)'|"[^"]*(?:px|rem|em)"|[\d.]+)/gi,
};

/**
 * Allowlist patterns - values that should NOT be flagged
 * These are valid CSS values that happen to match our patterns
 */
const ALLOWLIST_PATTERNS = [
  // CSS var() usage is always allowed
  /var\(--[^)]+\)/,
  // calc() expressions are allowed (they may contain tokens)
  /calc\([^)]+\)/,
  // CSS custom property definitions (in :root or token files)
  /--[\w-]+:\s*/,
  // 0 values without units are valid CSS (allow whitespace, semicolon, comma, or end-of-line)
  /:\s*0(?:px|rem|em)?(?:\s|;|,|$)/,
  // Percentage values
  /:\s*[\d.]+%/,
  // Common allowed numeric values in specific contexts
  /z-index:\s*\d+/,
  /opacity:\s*[\d.]+/,
  /flex:\s*[\d.]+/,
  /flex-grow:\s*[\d.]+/,
  /flex-shrink:\s*[\d.]+/,
  /order:\s*-?\d+/,
  /animation-duration:\s*[\d.]+m?s/,
  /animation-delay:\s*[\d.]+m?s/,
  /transition:\s*[^;]+[\d.]+m?s/,
  /transition-duration:\s*[\d.]+m?s/,
  /transition-delay:\s*[\d.]+m?s/,
  // Media query breakpoints - hardcoded values are allowed
  /@media[^{]*\(\s*(?:min|max)-(?:width|height):\s*[\d.]+(px|rem|em)\s*\)/,
  /@media[^{]*\(\s*width:\s*[\d.]+(px|rem|em)\s*\)/,
  /@media[^{]*\(\s*height:\s*[\d.]+(px|rem|em)\s*\)/,
];

const normalizePath = (file: string): string => file.split(path.sep).join('/');

/**
 * Check if a match is enclosed within var() or calc() parentheses.
 * Finds the nearest preceding "var(" or "calc(" and verifies its closing ")" occurs after the match.
 */
const isInsideVarOrCalc = (
  line: string,
  matchIndex: number,
  matchEnd: number,
): boolean => {
  // Find the nearest preceding var( or calc(
  const varIndex = line.lastIndexOf('var(', matchIndex);
  const calcIndex = line.lastIndexOf('calc(', matchIndex);
  const openerIndex = Math.max(varIndex, calcIndex);

  if (openerIndex === -1) {
    return false;
  }

  // Find the closing parenthesis for this opener
  // We need to handle nested parentheses
  let depth = 1;
  const openerEnd =
    openerIndex + (line.slice(openerIndex).startsWith('var(') ? 4 : 5);

  for (let i = openerEnd; i < line.length; i++) {
    if (line[i] === '(') {
      depth++;
    } else if (line[i] === ')') {
      depth--;
      if (depth === 0) {
        // Found the closing parenthesis - check if match is inside
        return matchEnd <= i;
      }
    }
  }

  return false;
};

/**
 * Check if a line should be skipped based on allowlist patterns
 */
const isAllowlisted = (line: string, match: string): boolean => {
  const matchIndex = line.indexOf(match);
  if (matchIndex === -1) return false;

  const matchEnd = matchIndex + match.length;

  // Check if the match is inside a var() or calc() expression
  if (isInsideVarOrCalc(line, matchIndex, matchEnd)) {
    return true;
  }

  // Check against allowlist patterns using the full line
  for (const pattern of ALLOWLIST_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;

    // Find all matches of the pattern in the line
    let patternMatch;
    while ((patternMatch = pattern.exec(line)) !== null) {
      const patternStart = patternMatch.index;
      const patternEnd = patternStart + patternMatch[0].length;

      // Check if the violation match overlaps with or is contained in this allowlist pattern match
      // i18n-ignore-next-line
      if (matchIndex >= patternStart && matchEnd <= patternEnd) {
        return true;
      }

      // For non-global patterns, break after first match
      if (!pattern.global) break;
    }
  }

  const zeroValuePattern = /:\s*0(?:px|rem|em)?$/;
  if (zeroValuePattern.test(match)) {
    return true;
  }

  return false;
};

/**
 * Strip inline comment fragments from a line, returning only the code portion.
 * Removes trailing single-line comments, self-contained block comments,
 * and content after an unclosed block comment start.
 */
const stripInlineComments = (line: string): string => {
  let result = line;

  // Remove trailing // comments (but not inside strings)
  // Simple approach: find // not preceded by : (to avoid URLs like http://)
  const singleLineCommentIndex = result.search(/(?<!:)\/\//);
  if (singleLineCommentIndex !== -1) {
    result = result.slice(0, singleLineCommentIndex);
  }

  // Remove self-contained /* ... */ fragments
  result = result.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');

  // If a block comment starts but doesn't close, keep only the part before /*
  const blockStartIndex = result.indexOf('/*');
  if (blockStartIndex !== -1 && !result.includes('*/')) {
    result = result.slice(0, blockStartIndex);
  }

  return result;
};

/**
 * Check if a line is a comment based on line content and block comment state.
 * @param line - The line content to check
 * @param inBlockComment - Whether we're currently inside a block comment
 * @returns Object with isComment flag, updated inBlockComment state, and code portion to validate
 */
const checkCommentState = (
  line: string,
  inBlockComment: boolean,
): { isComment: boolean; inBlockComment: boolean; codePortion: string } => {
  const trimmed = line.trim();

  // If we're inside a block comment, check for end
  if (inBlockComment) {
    if (trimmed.includes('*/')) {
      // Line contains end of block comment
      // Check if there's code after the closing */
      const closeIndex = trimmed.indexOf('*/') + 2;
      const afterClose = trimmed.slice(closeIndex).trim();
      if (afterClose.length > 0) {
        // There's code after the comment ends - return only that code portion
        const lineCloseIndex = line.indexOf('*/') + 2;
        const codeAfter = stripInlineComments(line.slice(lineCloseIndex));
        return {
          isComment: false,
          inBlockComment: false,
          codePortion: codeAfter,
        };
      }
      // Only comment content on this line
      return { isComment: true, inBlockComment: false, codePortion: '' };
    }
    // Still inside block comment
    return { isComment: true, inBlockComment: true, codePortion: '' };
  }

  // Check for single-line comments
  if (
    trimmed.startsWith('//') ||
    trimmed.startsWith('<!--') ||
    trimmed.endsWith('-->')
  ) {
    return { isComment: true, inBlockComment: false, codePortion: '' };
  }

  // Check for block comment start
  if (trimmed.includes('/*')) {
    if (trimmed.includes('*/')) {
      // Self-contained block comment on this line
      // Only treat as comment if the entire line is a comment (starts with /*)
      if (trimmed.startsWith('/*')) {
        return { isComment: true, inBlockComment: false, codePortion: '' };
      }
      // There's code before or around the comment (e.g., "color: #fff; /* note */")
      // Strip the comment and return the code portion
      const codePortion = stripInlineComments(line);
      return { isComment: false, inBlockComment: false, codePortion };
    }
    // Block comment starts but doesn't end on this line
    // Check if there's code before the /* (e.g., "color: #fff; /*")
    if (trimmed.startsWith('/*')) {
      // Entire line starts with comment
      return { isComment: true, inBlockComment: true, codePortion: '' };
    }
    // There's code before the block comment starts - return only the code before /*
    const codePortion = stripInlineComments(line);
    return { isComment: false, inBlockComment: true, codePortion };
  }

  // No comments - strip any trailing // comments just in case
  const codePortion = stripInlineComments(line);
  return { isComment: false, inBlockComment: false, codePortion };
};

/**
 * Check if file is a TypeScript/TSX file
 */
const isTsxFile = (file: string): boolean => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.ts' || ext === '.tsx';
};

/**
 * Check if file is a CSS/SCSS file
 */
const isCssFile = (file: string): boolean => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.css' || ext === '.scss' || ext === '.sass';
};

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

export const shouldSkipFile = (file: string): boolean => {
  const normalized = normalizePath(file);
  return (
    normalized.includes('node_modules') ||
    normalized.includes('build') ||
    normalized.includes('dist') ||
    normalized.includes('/tokens/') ||
    normalized === 'src/style/app-fixed.module.css' ||
    normalized === 'src/assets/css/app.css' ||
    normalized.startsWith('src/test-utils/validate-tokens') ||
    normalized.startsWith('src/style/tokens/')
  );
};

export const isSrcFile = (file: string): boolean => {
  const normalized = normalizePath(file);
  // Handle both relative paths (src/...) and absolute paths (..../src/...)
  return normalized.startsWith('src/') || normalized.includes('/src/');
};

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

export const formatCount = (count: number, label: string): string =>
  `${count} ${label}${count === 1 ? '' : 's'}`;

/**
 * Helper to add matches from a pattern to results
 */
const addMatches = (
  line: string,
  pattern: RegExp,
  type: ValidationResultType,
  file: string,
  lineNumber: number,
  results: IValidationResult[],
): void => {
  // Reset regex lastIndex for global patterns
  pattern.lastIndex = 0;
  const matches = line.match(pattern);
  if (matches) {
    matches.forEach((match) => {
      if (!isAllowlisted(line, match)) {
        results.push({
          file,
          line: lineNumber,
          match,
          type,
        });
      }
    });
  }
};

/**
 * Validate CSS files for hardcoded values
 */
const validateCssLine = (
  line: string,
  file: string,
  lineNumber: number,
  results: IValidationResult[],
  isCommentLine: boolean,
): void => {
  // Skip comments
  if (isCommentLine) return;

  // Color patterns
  addMatches(line, CSS_PATTERNS.hexColor, 'color', file, lineNumber, results);
  addMatches(line, CSS_PATTERNS.rgbColor, 'color', file, lineNumber, results);
  addMatches(line, CSS_PATTERNS.hslColor, 'color', file, lineNumber, results);

  // Spacing patterns
  addMatches(
    line,
    CSS_PATTERNS.spacingPx,
    'spacing',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.spacingShorthand,
    'spacing',
    file,
    lineNumber,
    results,
  );

  // Typography patterns
  addMatches(
    line,
    CSS_PATTERNS.fontSize,
    'font-size',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.fontWeight,
    'font-weight',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.lineHeightPx,
    'line-height',
    file,
    lineNumber,
    results,
  );

  // Border patterns
  addMatches(
    line,
    CSS_PATTERNS.borderRadius,
    'border-radius',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.borderWidth,
    'border',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.borderFull,
    'border',
    file,
    lineNumber,
    results,
  );

  // Box shadow
  addMatches(
    line,
    CSS_PATTERNS.boxShadow,
    'box-shadow',
    file,
    lineNumber,
    results,
  );

  // Outline patterns
  addMatches(
    line,
    CSS_PATTERNS.outlineWidth,
    'outline',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    CSS_PATTERNS.outlineFull,
    'outline',
    file,
    lineNumber,
    results,
  );
};

/**
 * Validate TSX/TS files for hardcoded values in inline styles
 */
const validateTsxLine = (
  line: string,
  file: string,
  lineNumber: number,
  results: IValidationResult[],
  isCommentLine: boolean,
): void => {
  // Skip comments
  if (isCommentLine) return;

  // TSX spacing patterns (marginTop, paddingLeft, etc.)
  addMatches(
    line,
    TSX_PATTERNS.spacingCamelCase,
    'tsx-spacing',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    TSX_PATTERNS.dimensionsCamelCase,
    'tsx-spacing',
    file,
    lineNumber,
    results,
  );

  // TSX typography patterns
  addMatches(
    line,
    TSX_PATTERNS.fontSizeCamelCase,
    'tsx-font-size',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    TSX_PATTERNS.fontWeightCamelCase,
    'tsx-font-weight',
    file,
    lineNumber,
    results,
  );
  addMatches(
    line,
    TSX_PATTERNS.lineHeightCamelCase,
    'tsx-line-height',
    file,
    lineNumber,
    results,
  );

  // TSX border radius
  addMatches(
    line,
    TSX_PATTERNS.borderRadiusCamelCase,
    'tsx-border-radius',
    file,
    lineNumber,
    results,
  );

  // TSX color patterns
  addMatches(
    line,
    TSX_PATTERNS.colorCamelCase,
    'tsx-color',
    file,
    lineNumber,
    results,
  );

  // TSX outline
  addMatches(
    line,
    TSX_PATTERNS.outlineCamelCase,
    'tsx-outline',
    file,
    lineNumber,
    results,
  );

  // Also check for CSS patterns in template literals and style objects
  // Hex colors are common in TSX files
  addMatches(
    line,
    CSS_PATTERNS.hexColor,
    'tsx-color',
    file,
    lineNumber,
    results,
  );
};

/**
 * Validates files for hardcoded values using the given glob pattern.
 * @param pattern - Glob pattern to select files when `files` is not provided.
 * @param files - Optional explicit list of files to validate.
 * @returns Promise resolving to the list of validation results.
 */
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
    const isTs = isTsxFile(file);
    const isCss = isCssFile(file);

    let inBlockComment = false;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      const commentState = checkCommentState(line, inBlockComment);
      inBlockComment = commentState.inBlockComment;

      // Use the code portion (with comments stripped) for validation
      const lineToValidate = commentState.codePortion;

      if (isCss) {
        validateCssLine(
          lineToValidate,
          file,
          lineNumber,
          results,
          commentState.isComment,
        );
      } else if (isTs) {
        validateTsxLine(
          lineToValidate,
          file,
          lineNumber,
          results,
          commentState.isComment,
        );
      }
    });
  }

  return results;
}

/**
 * CLI entry point for design token validation.
 * @returns Promise<void>
 */
export async function main() {
  console.log('Validating design token usage...\n');

  if (args.includes('--staged') && (hasFilesFlag || scanEntireRepo)) {
    console.error(
      'Conflicting flags: --staged cannot be combined with --files or --scan-entire-repo.',
    );
    process.exit(1);
  }

  if (stagedOnly && !checkAll) {
    console.error(
      'Use --staged --all to validate the entire content of staged files.',
    );
    process.exit(1);
  }

  const filesFromFlags = hasFilesFlag
    ? Array.from(new Set(filesFromArgs.filter((file) => file.trim() !== '')))
    : [];
  const stagedFiles = stagedOnly ? getStagedFiles() : [];
  if (stagedOnly && stagedFiles.length === 0) {
    console.log('No staged files to validate.\n');
    process.exit(0);
  }
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

  const fileCount = new Set(
    allResults.map((result) => normalizePath(result.file)),
  ).size;
  const heading = 'Design token validation failed';
  console.error(`\n${heading}`);
  console.error('='.repeat(heading.length));
  console.error(
    `Found ${formatCount(allResults.length, 'hardcoded value')} across ${formatCount(
      fileCount,
      'file',
    )}.\n`,
  );

  // Group results by category (CSS vs TSX) and then by type
  const cssTypes = [
    'color',
    'spacing',
    'font-size',
    'font-weight',
    'line-height',
    'border-radius',
    'border',
    'box-shadow',
    'outline',
  ];
  const tsxTypes = [
    'tsx-color',
    'tsx-spacing',
    'tsx-font-size',
    'tsx-font-weight',
    'tsx-line-height',
    'tsx-border-radius',
    'tsx-outline',
  ];

  const byType = allResults.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, IValidationResult[]>,
  );

  // Display CSS violations
  const cssViolations = cssTypes.filter((type) => byType[type]?.length > 0);
  if (cssViolations.length > 0) {
    console.error('📄 CSS/SCSS Violations:');
    console.error('-'.repeat(40));
    cssViolations.forEach((type) => {
      const results = byType[type];
      console.error(`  ${type.toUpperCase()} (${results.length} instances):`);
      results.slice(0, 5).forEach((result) => {
        console.error(`    ${result.file}:${result.line} -> ${result.match}`);
      });
      if (results.length > 5) {
        console.error(`    ... and ${results.length - 5} more`);
      }
    });
    console.error('');
  }

  // Display TSX violations
  const tsxViolations = tsxTypes.filter((type) => byType[type]?.length > 0);
  if (tsxViolations.length > 0) {
    console.error('⚛️  TSX/TS Inline Style Violations:');
    console.error('-'.repeat(40));
    tsxViolations.forEach((type) => {
      const results = byType[type];
      const displayType = type.replace('tsx-', '').toUpperCase();
      console.error(`  ${displayType} (${results.length} instances):`);
      results.slice(0, 5).forEach((result) => {
        console.error(`    ${result.file}:${result.line} -> ${result.match}`);
      });
      if (results.length > 5) {
        console.error(`    ... and ${results.length - 5} more`);
      }
    });
    console.error('');
  }

  console.error('\nFix the values above and re-run the check.\n');
  console.error(
    'Replace hardcoded values with tokens from src/style/tokens.\n',
  );
  console.error(
    'Refer: docs/docs/docs/developer-resources/design-token-system.md for more details.\n',
  );
  process.exit(1);
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

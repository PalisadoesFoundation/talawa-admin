#!/usr/bin/env node

/**
 * Detect non-internationalized user-visible text in the src/ tree.
 * Exits with code 1 when violations are found.
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const SRC_DIR = path.join(process.cwd(), 'src');

const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const TEST_PATTERNS = [
  /\.spec\./i,
  /\.test\./i,
  /__tests__/i,
  /__mocks__/i,
  /\.mock\./i,
];

const USER_VISIBLE_ATTRS = [
  'placeholder',
  'title',
  'aria-label',
  'alt',
  'label',
  'aria-placeholder',
  'aria-valuetext',
  'aria-roledescription',
];

// Attributes that should never be checked (CSS, routing, technical attributes)
const NON_USER_VISIBLE_ATTRS = [
  'className',
  'class',
  'style',
  'to',
  'href',
  'src',
  'id',
  'data-testid',
  'data-test-id',
  'data-cy',
  'data-id',
  'testid',
  'key',
  'ref',
  'onClick',
  'onChange',
  'onSubmit',
  'onBlur',
  'onFocus',
  'onKeyDown',
  'onKeyUp',
  'type',
  'value',
  'name',
  'role',
  'tabIndex',
  'aria-hidden',
  'aria-describedby',
  'aria-labelledby',
  'aria-expanded',
  'aria-selected',
  'aria-checked',
  'aria-disabled',
  'aria-required',
  'aria-invalid',
  'aria-busy',
  'aria-live',
  'aria-atomic',
  'aria-relevant',
  'aria-modal',
  'aria-controls',
  'aria-owns',
  'aria-haspopup',
  'aria-orientation',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-sort',
  'aria-readonly',
  'aria-multiline',
  'aria-multiselectable',
  'aria-autocomplete',
  'aria-activedescendant',
  'aria-colcount',
  'aria-colindex',
  'aria-colspan',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowspan',
  'aria-posinset',
  'aria-setsize',
  'aria-level',
  'aria-current',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-keyshortcuts',
  'aria-rowindextext',
  'aria-colindextext',
];

const POSIX_SEP = path.posix.sep;

const parseArgs = (args) => {
  const files = [];
  let diffOnly = false;
  let staged = false;
  let base = null;
  let head = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--staged') {
      diffOnly = true;
      staged = true;
      continue;
    }
    if (arg === '--diff' || arg === '--diff-only') {
      diffOnly = true;
      continue;
    }
    if (arg === '--base' || arg.startsWith('--base=')) {
      const value = arg === '--base' ? args[i + 1] : arg.split('=')[1];
      if (arg === '--base') i += 1;
      if (value) base = value;
      continue;
    }
    if (arg === '--head' || arg.startsWith('--head=')) {
      const value = arg === '--head' ? args[i + 1] : arg.split('=')[1];
      if (arg === '--head') i += 1;
      if (value) head = value;
      continue;
    }

    files.push(arg);
  }

  return { files, diffOnly, staged, base, head };
};

const stripDiffPrefix = (filePath) => filePath.replace(/^[ab]\//, '');

const parseUnifiedDiff = (diffText) => {
  const filesToLines = new Map();
  let currentFile = null;
  let newLineNum = 0;
  let inHunk = false;

  const addLine = (filePath, lineNumber) => {
    if (!filesToLines.has(filePath)) {
      filesToLines.set(filePath, new Set());
    }
    filesToLines.get(filePath).add(lineNumber);
  };

  diffText.split('\n').forEach((line) => {
    if (line.startsWith('+++ ')) {
      const rawPath = line.slice(4).split('\t')[0].trim();
      if (rawPath === '/dev/null') {
        currentFile = null;
        inHunk = false;
        return;
      }
      currentFile = path.resolve(process.cwd(), stripDiffPrefix(rawPath));
      inHunk = false;
      return;
    }

    const hunkMatch = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (hunkMatch) {
      newLineNum = Number(hunkMatch[1]);
      inHunk = true;
      return;
    }

    if (!currentFile || !inHunk) return;

    if (line.startsWith('+') && !line.startsWith('+++')) {
      addLine(currentFile, newLineNum);
      newLineNum += 1;
      return;
    }

    if (line.startsWith('-') && !line.startsWith('---')) {
      return;
    }

    if (line.startsWith(' ')) {
      newLineNum += 1;
    }
  });

  return filesToLines;
};

const getDiffLineMap = ({ staged, files, base, head }) => {
  const args = ['diff', '-U0'];
  if (staged) args.push('--cached');
  if (!staged && base && head) args.push(`${base}...${head}`);
  if (files.length > 0) {
    args.push('--', ...files);
  }

  const result = spawnSync('git', args, { encoding: 'utf-8' });
  if (result.error || result.status > 1) {
    const details =
      result.error?.message || result.stderr?.trim() || 'git diff failed';
    throw new Error(details);
  }

  return parseUnifiedDiff(result.stdout || '');
};

const isUnderSrc = (filePath) =>
  filePath === SRC_DIR || filePath.startsWith(`${SRC_DIR}${path.sep}`);

/**
 * Recursively walks a directory tree and returns all file paths.
 * Silently ignores directories that cannot be read.
 *
 * @param {string} dir - The directory path to traverse
 * @returns {string[]} Array of absolute file paths found in the directory tree
 * @example
 * const files = walk('/path/to/src');
 * // Returns: ['/path/to/src/file1.js', '/path/to/src/sub/file2.tsx', ...]
 */
const walk = (dir) => {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const resolved = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(resolved));
    } else {
      files.push(resolved);
    }
  }
  return files;
};

/**
 * Determines whether a file should be analyzed for i18n violations.
 * Filters out non-source files (wrong extension) and test/mock files.
 *
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file should be analyzed, false otherwise
 * @example
 * shouldAnalyzeFile('src/component.tsx'); // true
 * shouldAnalyzeFile('src/component.test.tsx'); // false
 * shouldAnalyzeFile('README.md'); // false
 */
const shouldAnalyzeFile = (filePath) => {
  const ext = path.extname(filePath);
  if (!FILE_EXTENSIONS.includes(ext)) return false;

  // Normalize separators so test/mock exclusions work cross-platform
  const normalizedPath = filePath.split(path.sep).join(POSIX_SEP);
  return !TEST_PATTERNS.some((pattern) => pattern.test(normalizedPath));
};

/**
 * Removes JavaScript/TypeScript comments from source code while preserving
 * line numbers (replaces block comment content with newlines).
 * This ensures that line numbers in violation reports remain accurate.
 *
 * @param {string} content - The source code content to process
 * @returns {string} The content with comments removed, line numbers preserved
 * @example
 * const code = 'const x = 1; // comment\n/* block *\/';
 * const stripped = stripComments(code);
 * // Returns: 'const x = 1; \n          '
 */
const stripComments = (content) =>
  content
    // block comments – strip text but preserve newlines so line numbers stay stable
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ''))
    // line comments – drop everything after `//` but keep leading whitespace/newline
    .replace(/(^|\s)\/\/.*$/gm, '$1');

/**
 * Checks if a specific line should be ignored based on i18n-ignore directives.
 * Supports two ignore patterns:
 * - `// i18n-ignore-line` on the current line
 * - `// i18n-ignore-next-line` on the previous line
 *
 * @param {string[]} originalLines - Array of original source code lines (before comment stripping)
 * @param {number} lineIndex - Zero-based index of the line to check
 * @returns {boolean} True if the line should be ignored, false otherwise
 * @example
 * const lines = ['// i18n-ignore-next-line', '<div>Hello</div>'];
 * hasIgnoreComment(lines, 1); // true
 */
const hasIgnoreComment = (originalLines, lineIndex) => {
  // Check current line
  if (lineIndex < originalLines.length) {
    const currentLine = originalLines[lineIndex];
    // Only i18n-ignore-line applies to current line
    if (/\/\/\s*i18n-ignore-line/i.test(currentLine)) return true;
  }

  // Check previous line (for i18n-ignore-next-line)
  if (lineIndex > 0) {
    const prevLine = originalLines[lineIndex - 1];
    if (/\/\/\s*i18n-ignore-next-line/i.test(prevLine)) {
      return true;
    }
  }

  return false;
};

/**
 * Counts words in text using Unicode-aware regex patterns.
 * A "word" is defined as any sequence of letter characters in any script (Latin, Cyrillic, CJK, etc.).
 *
 * @param {string} text - The text to analyze
 * @returns {number} The number of words found
 * @example
 * countWords('Hello world'); // 2
 * countWords('こんにちは'); // 1
 * countWords('123-456'); // 0 (no letter characters)
 */
const countWords = (text) => {
  // Unicode-aware word detection: sequences of letters in any script
  const words = text.match(/\p{L}+/gu);
  return words ? words.length : 0;
};

/**
 * Determines if text appears to be a URL or URL-like pattern.
 * Matches absolute URLs (http/https), relative paths (/path), data URLs,
 * and common API/routing patterns (e.g., "api/v1/users", "id=123").
 *
 * @param {string} text - The text to check
 * @returns {boolean} True if the text looks like a URL, false otherwise
 * @example
 * looksLikeUrl('https://example.com'); // true
 * looksLikeUrl('/home'); // true
 * looksLikeUrl('api/v1/users'); // true
 * looksLikeUrl('Hello'); // false
 */
const looksLikeUrl = (text) => {
  const trimmed = text.trim();
  // Check for URLs starting with http://, https://, /, data:, or common URL patterns
  if (/^(https?:\/\/|\/|data:)/i.test(trimmed)) return true;
  // Check for URL-like patterns (e.g., "orgstore/id=", "path/to/resource", "api/v1/endpoint")
  // Must have at least one slash or equals sign to be considered a URL pattern
  // Single words like "Link" should not be considered URLs
  if (
    /^[a-z0-9]+(\/[a-z0-9\-_=]+)+(\?[^`]*)?$/i.test(trimmed) ||
    /^[a-z0-9]+\/[a-z0-9\-_=]+/i.test(trimmed) ||
    /^[a-z0-9]+=[a-z0-9\-_=]+/i.test(trimmed)
  )
    return true;
  return false;
};

/**
 * Determines if text appears to be a date/time format string.
 * Matches common date format patterns like "YYYY-MM-DD", "HH:mm:ss",
 * complex formats with brackets like "YYYY-MM-DD[Z]", and Intl.DateTimeFormat
 * tokens like "full", "medium", "numeric", "2-digit".
 *
 * @param {string} text - The text to check
 * @returns {boolean} True if the text looks like a date format, false otherwise
 * @example
 * looksLikeDateFormat('YYYY-MM-DD'); // true
 * looksLikeDateFormat('HH:mm:ss.SSS[Z]'); // true
 * looksLikeDateFormat('full'); // true (Intl token)
 * looksLikeDateFormat('Hello'); // false
 */
const looksLikeDateFormat = (text) => {
  const trimmed = text.trim();
  // Common date format patterns
  const dateFormatPatterns = [
    /^[YMDHmsS]+([\/\-\s:\.][YMDHmsS]+)+$/i, // YYYY-MM-DD, MM/DD/YYYY, HH:mm:ss
    /^[YMDHmsS]+([\/\-\s:\.T][YMDHmsS]+)*\[[^\]]+\][YMDHmsS]*$/i, // YYYY-MM-DDTHH:mm:ss.SSS[Z]
    /^(short|long|narrow|numeric|2-digit|full|medium)$/i, // Intl.DateTimeFormat tokens
  ];
  return dateFormatPatterns.some((pattern) => pattern.test(trimmed));
};

/**
 * Determines if text appears to be a regular expression pattern.
 * Matches pure regex syntax (e.g., "^$.*+?") or text containing common
 * regex metacharacters (brackets, quantifiers, anchors, etc.).
 *
 * @param {string} text - The text to check
 * @returns {boolean} True if the text looks like a regex pattern, false otherwise
 * @example
 * looksLikeRegexPattern('[a-z]+'); // true
 * looksLikeRegexPattern('\\d{4}'); // true
 * looksLikeRegexPattern('^start'); // true
 * looksLikeRegexPattern('Hello'); // false
 */
const looksLikeRegexPattern = (text) => {
  const trimmed = text.trim();
  // Only pure regex syntax (no alphabetic characters)
  if (/^[.*+?^${}()|[\]\\\/\-]+$/.test(trimmed)) return true;
  // Character classes like [a-z], [A-Z0-9], etc.
  if (/\[[^\]]*[a-z]-[a-z][^\]]*\]/i.test(trimmed)) return true;
  // Regex quantifiers attached to patterns like \d{4}, \w+
  if (/\\[dDwWsS][*+?{]/.test(trimmed)) return true;
  return false;
};

/**
 * Determines if a match is within a code context that should be skipped
 * (not flagged as an i18n violation). Skips developer-facing contexts like:
 * - console.* calls
 * - throw Error statements
 * - GraphQL queries (gql)
 * - RegExp constructors and regex literals
 * - JSON.stringify/parse
 * - Date formatting calls (.format)
 * - String method calls (.match, .replace, .search, .split)
 * - TypeScript type annotations
 *
 * @param {string} line - The full line of code containing the match
 * @param {number} matchIndex - The character index where the match starts in the line
 * @returns {boolean} True if the match is in a skip context, false otherwise
 * @example
 * isInSkipContext('console.log("debug")', 12); // true
 * isInSkipContext('<div>Hello</div>', 5); // false
 */
const isInSkipContext = (line, matchIndex) => {
  const beforeMatch = line.substring(0, matchIndex);
  const afterMatch = line.substring(matchIndex);

  // Skip console.log/error/warn/info/debug messages
  if (/console\.(log|error|warn|info|debug)\s*\(/.test(beforeMatch)) {
    return true;
  }

  // Skip throw new Error(...) statements
  if (/throw\s+new\s+Error\s*\(/.test(beforeMatch)) {
    return true;
  }

  // Skip GraphQL queries (gql`...`)
  if (/gql\s*`/.test(beforeMatch)) {
    return true;
  }

  // Skip new RegExp(...) or /pattern/ regex literals
  if (/new\s+RegExp\s*\(/.test(beforeMatch) || /\/[^\/]+\//.test(beforeMatch)) {
    return true;
  }

  // Skip JSON.stringify/parse
  if (/JSON\.(stringify|parse)\s*\(/.test(beforeMatch)) {
    return true;
  }

  // Skip .format() calls (date formatting) - only if we're inside the format call
  // Check if there's a .format( with an unclosed parenthesis before the match
  const formatMatch = beforeMatch.match(/\.format\s*\(/g);
  if (formatMatch) {
    const openParens = (beforeMatch.match(/\(/g) || []).length;
    const closeParens = (beforeMatch.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      return true;
    }
  }

  // Skip .match() or .replace() with regex patterns - only if we're inside the call
  const methodMatch = beforeMatch.match(/\.(match|replace|search|split)\s*\(/g);
  if (methodMatch) {
    const openParens = (beforeMatch.match(/\(/g) || []).length;
    const closeParens = (beforeMatch.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      return true;
    }
  }

  // Skip TypeScript type annotations: ): Type => or : Type = or Promise<Type>
  // Be more specific - don't match JSX attributes (which have < before them)
  if (
    /:\s*\w+\s*=>/.test(beforeMatch + afterMatch) ||
    /\):\s*\w+/.test(beforeMatch) ||
    /Promise\s*</.test(beforeMatch + afterMatch) ||
    // Only match type annotations, not JSX attributes or other patterns
    (/\w+\s*:\s*\w+\s*[=,;]/.test(beforeMatch + afterMatch) &&
      !/</.test(beforeMatch)) // Don't match if there's a < before (likely JSX)
  ) {
    return true;
  }

  return false;
};

/**
 * Determines if a string is allowed (should not be flagged as a violation).
 * Allows empty strings, strings with only template variables, URLs,
 * date formats, regex patterns, and strings with zero words.
 *
 * @param {string} text - The text to check
 * @returns {boolean} True if the string is allowed (skip it), false if it should be flagged
 * @example
 * isAllowedString(''); // true (empty)
 * isAllowedString('${variable}'); // true (only variable)
 * isAllowedString('https://example.com'); // true (URL)
 * isAllowedString('Hello world'); // false (should be translated)
 */
const isAllowedString = (text) => {
  const value = text.trim();
  if (!value) return true;
  if (value.includes('${')) {
    const staticText = value.replace(/\${.*?}/g, '').trim();
    return countWords(staticText) === 0;
  }
  if (looksLikeUrl(value)) return true;
  if (looksLikeDateFormat(value)) return true;
  if (looksLikeRegexPattern(value)) return true;
  // Flag if there is at least one word (single-word UI text should be translated)
  return countWords(value) === 0;
};

/**
 * Converts a file path to POSIX format (forward slashes) for consistent
 * cross-platform output. This ensures Windows paths (C:\path\to\file)
 * are displayed with forward slashes (C:/path/to/file).
 *
 * @param {string} filePath - The file path to convert
 * @returns {string} The path with POSIX-style separators
 * @example
 * toPosixPath('C:\\Users\\name\\file.tsx'); // 'C:/Users/name/file.tsx'
 * toPosixPath('src/component.tsx'); // 'src/component.tsx' (unchanged)
 */
const toPosixPath = (filePath) => filePath.split(path.sep).join(POSIX_SEP);

/**
 * Extracts the attribute name from a line of code at a specific position.
 * Finds the most recent attribute assignment (attr=) before the match index.
 * Handles standard HTML attributes (placeholder, title) and hyphenated
 * attributes (data-testid, aria-label).
 *
 * @param {string} line - The line of code to analyze
 * @param {number} matchIndex - The character index to look backwards from
 * @returns {string|null} The lowercase attribute name, or null if no attribute found
 * @example
 * getAttributeName('<div title="text" placeholder="...">', 30); // 'placeholder'
 * getAttributeName('<input data-testid="search">', 20); // 'data-testid'
 * getAttributeName('<div>text</div>', 5); // null
 */
const getAttributeName = (line, matchIndex) => {
  // Look backwards from the match to find the attribute name
  const beforeMatch = line.substring(0, matchIndex);
  // Find all attribute assignments and get the last one before the match
  // This handles cases like: className={`btn ${styles.x}`} or className="btn"
  const allAttrMatches = [
    ...beforeMatch.matchAll(/(\w+(?:-\w+)*(?::\w+)?)\s*=\s*/g),
  ];
  if (allAttrMatches.length > 0) {
    // Get the last (most recent) attribute match
    const lastMatch = allAttrMatches[allAttrMatches.length - 1];
    return lastMatch[1].toLowerCase();
  }
  return null;
};

/**
 * Scans a file for non-internationalized user-visible text violations.
 * Detects hardcoded text in:
 * - JSX text nodes (between tags)
 * - User-visible attributes (placeholder, title, aria-label, alt, label)
 * - Template literals in JSX expressions
 * - Toast messages
 *
 * Respects i18n-ignore directives and skips various technical contexts
 * (TypeScript types, CSS classes, URLs, date formats, regex patterns, etc.).
 *
 * @param {string} filePath - Absolute path to the file to scan
 * @param {Set<number> | null} [lineFilter] - Optional set of 1-based line
 *          numbers to scan when only checking changed lines
 * @returns {Array<{line: number, text: string}>} Array of violations found,
 *          each containing the line number and the violating text
 * @example
 * const violations = collectViolations('/path/to/Component.tsx');
 * // Returns: [
 * //   { line: 10, text: 'Hello World' },
 * //   { line: 15, text: 'Click here' }
 * // ]
 */
const collectViolations = (filePath, lineFilter = null) => {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return [];
  }

  const originalLines = content.split('\n');
  const strippedContent = stripComments(content);
  const lines = strippedContent.split('\n');
  const violations = [];

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1;

    if (lineFilter && !lineFilter.has(lineNumber)) {
      return;
    }

    // Skip if line has ignore comment
    if (hasIgnoreComment(originalLines, idx)) {
      return;
    }

    const importLike = /^\s*(import|require)\b/.test(line);
    if (importLike) return;

    // Skip if the line is a function declaration (including export, generics, arrow functions)
    const functionDeclOrArrowPattern = /^(export\s+)?(async\s+)?function\s*\w*\s*(<[^>]*>)?\s*\([^)]*\)\s*\{|^(export\s+)?(const|let|var)\s+\w+\s*(?::[^=]*)?=\s*\([^)]*\)\s*=>/;
    if (functionDeclOrArrowPattern.test(line.trim())) {
      return;
    }

    // JSX text between tags - improved to avoid matching TypeScript types
    // Only match if it's clearly JSX (has < and > with text between)
    // Exclude patterns that look like TypeScript generics or function signatures
    const jsxRegex = />\s*([^<>{}\n]+?)\s*</g;
    let jsxMatch;
    while ((jsxMatch = jsxRegex.exec(line)) !== null) {
      const text = jsxMatch[1];
      const matchIndex = jsxMatch.index;

      // Skip if in a context that should be ignored
      if (isInSkipContext(line, matchIndex)) {
        continue;
      }

      // Skip if this looks like TypeScript type annotation
      // Check if there's a colon, arrow, or Promise-like pattern nearby
      const beforeMatch = line.substring(0, matchIndex);
      const afterMatch = line.substring(matchIndex + jsxMatch[0].length);
      const fullContext = beforeMatch + afterMatch;

      // Skip if it looks like a type annotation: ): Type => or : Type = or Promise<Type>
      // Be more specific to avoid false positives with JSX
      if (
        /:\s*\w+\s*=>/.test(fullContext) ||
        /\):\s*\w+/.test(beforeMatch) ||
        /Promise\s*</.test(fullContext) ||
        // Only match type annotations, not JSX attributes or other patterns
        (/\w+\s*:\s*\w+\s*[=,;]/.test(fullContext) && !/</.test(beforeMatch)) // Don't match if there's a < before (likely JSX)
      ) {
        continue;
      }

      // Skip if this looks like JavaScript code (comparison operators, logical operators)
      // Patterns like: age >= 18 && age <= 40, x === y, a != b, etc.
      if (
        /(>=|<=|==|!=|===|!==|&&|\|\|)\s*\d+/.test(text) || // Comparison with numbers
        /\d+\s*(>=|<=|==|!=|===|!==|&&|\|\|)/.test(text) || // Number before operator
        /(return|const|let|var|if|while|for)\s+.*(>=|<=|==|!=|===|!==)/.test(
          beforeMatch,
        ) || // Code keywords before comparison
        /\.(filter|map|reduce|find|some|every)\s*\(/.test(beforeMatch) // Array methods
      ) {
        continue;
      }

      if (!isAllowedString(text)) {
        violations.push({ line: lineNumber, text });
      }
    }

    // Multi-line JSX text detection
    // Check if current line is text content between JSX tags (not on same line as tags)
    if (idx > 0 && idx < lines.length - 1) {
      const prevLine = lines[idx - 1];
      const nextLine = lines[idx + 1];
      const trimmedLine = line.trim();

      // Check if we're between JSX tags:
      // - Previous line ends with > (opening tag)
      // - Current line has text (not empty, not starting with <)
      // - Next line starts with </ (closing tag) or current line ends with </
      const prevEndsWithTag = />\s*$/.test(prevLine);
      const nextStartsWithClosingTag = /^\s*<\//.test(nextLine);
      const lineEndsWithClosingTag = /<\//.test(line);
      const isTextLine =
        trimmedLine.length > 0 &&
        !trimmedLine.startsWith('<') &&
        !trimmedLine.startsWith('{') &&
        !trimmedLine.startsWith('//') &&
        !trimmedLine.startsWith('/*');

      if (
        prevEndsWithTag &&
        isTextLine &&
        (nextStartsWithClosingTag || lineEndsWithClosingTag)
      ) {
        // This line is JSX text content between tags
        const text = trimmedLine;
        const matchIndex = line.indexOf(text);

        // Skip if in a context that should be ignored
        if (!isInSkipContext(line, matchIndex)) {
          // Skip if this looks like JavaScript code
          if (
            !/(>=|<=|==|!=|===|!==|&&|\|\|)\s*\d+/.test(text) &&
            !/\d+\s*(>=|<=|==|!=|===|!==|&&|\|\|)/.test(text) &&
            !/(return|const|let|var|if|while|for)\s+.*(>=|<=|==|!=|===|!==)/.test(
              prevLine,
            )
          ) {
            if (!isAllowedString(text)) {
              violations.push({ line: lineNumber, text });
            }
          }
        }
      }
    }

    // Template literals in JSX expressions with hardcoded text
    // But only if they're not in className, style, or routing attributes
    // Handle nested template literals by tracking backtick depth
    const templateLiterals = [];
    let templateStart = -1;
    let backtickDepth = 0;
    let inTemplateLiteral = false;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === '`') {
        if (!inTemplateLiteral) {
          // Start of a template literal
          templateStart = i;
          inTemplateLiteral = true;
          backtickDepth = 1;
        } else {
          // Check if this is a nested template literal opening ${`
          if (i > 0 && line[i - 1] === '{' && i > 1 && line[i - 2] === '$') {
            // Nested template literal opening ${`
            backtickDepth++;
          } else {
            // Closing backtick
            backtickDepth--;
            if (backtickDepth === 0) {
              // Complete template literal found
              const fullText = line.substring(templateStart + 1, i);
              templateLiterals.push({ fullText, matchIndex: templateStart });
              inTemplateLiteral = false;
            }
          }
        }
      }
    }

    // Process each complete template literal
    for (const templateMatch of templateLiterals) {
      const fullText = templateMatch.fullText;
      const matchIndex = templateMatch.matchIndex;

      // Only process template literals that are inside JSX expressions (after {)
      // or are clearly JSX content (not in strings, comments, etc.)
      const beforeMatch = line.substring(0, matchIndex);
      // Check if this template literal is inside a JSX expression { ... }
      // Look backwards for an opening brace { that hasn't been closed
      let braceCount = 0;
      let foundJsxExpression = false;
      for (let i = beforeMatch.length - 1; i >= 0; i--) {
        if (beforeMatch[i] === '}') braceCount++;
        else if (beforeMatch[i] === '{') {
          if (braceCount === 0) {
            foundJsxExpression = true;
            break;
          }
          braceCount--;
        }
      }

      // Skip if not in a JSX expression context (unless it's clearly user-visible)
      if (!foundJsxExpression) {
        // Still check if it's in a JSX attribute context
        const templateLength = fullText.length + 2; // +2 for backticks
        const afterMatch = line.substring(matchIndex + templateLength);
        if (!/^\s*=/.test(afterMatch) && !/=\s*$/.test(beforeMatch)) {
          continue;
        }
      }

      // Skip if in a context that should be ignored
      if (isInSkipContext(line, matchIndex)) {
        continue;
      }

      // Check what attribute this template literal is in
      const attributeName = getAttributeName(line, matchIndex);

      // Also check if the line contains className=, style=, to=, etc. before this match
      // This is a fallback for cases where getAttributeName might not work perfectly
      // Check for any non-user-visible attribute assignment before the template literal
      // Pattern: attributeName = { or attributeName = " or attributeName = '
      const hasNonUserVisibleAttr = NON_USER_VISIBLE_ATTRS.some((attr) => {
        // Escape special regex characters in attribute name
        const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escapedAttr}\\s*=\\s*['"\`{]`, 'i');
        return pattern.test(beforeMatch);
      });

      // Also check if the template literal content looks like CSS classes
      // and the line contains className (heuristic for className template literals)
      // Expanded to include common CSS utility classes and patterns
      const commonCssPatterns = [
        /\b(btn|primary|secondary|danger|warning|info|success|lg|sm|md|xl|container|wrapper|flex|grid|row|col)\b/i,
        /\b(m-|p-|d-|text-|bg-|border-|rounded|shadow|hover|active|disabled|shimmer|mx-|my-|px-|py-|ms-|me-|mt-|mb-|pt-|pb-|ps-|pe-)\d*/i,
        /\b(fi\s+fi-|fa\s+fa-)/i, // Font icons: "fi fi-xx" or "fa fa-xx"
        /\$\{styles\.\w+\}/, // CSS modules
        /\?\s*['"`]?\w+['"`]?\s*:/, // Ternary operators in className (conditional classes)
        /\w+\s*===\s*['"`]?\w+['"`]?\s*\?/, // Conditional checks
      ];
      const looksLikeCssClasses =
        /className/i.test(beforeMatch) &&
        commonCssPatterns.some((pattern) => pattern.test(fullText));

      // Skip if it's in a non-user-visible attribute
      if (attributeName && NON_USER_VISIBLE_ATTRS.includes(attributeName)) {
        continue;
      }

      // Also skip if we detected a non-user-visible attribute in the line
      if (hasNonUserVisibleAttr) {
        continue;
      }

      // Skip if it looks like CSS classes in a className attribute
      if (looksLikeCssClasses) {
        continue;
      }

      // Strip out variables FIRST (including nested template literals)
      // Remove ${...} patterns, but be careful with nested backticks
      let staticText = fullText;
      // Remove nested template literals ${`...`}
      staticText = staticText.replace(/\$\{[^`]*`[^`]*`[^}]*\}/g, '');
      // Remove simple ${var} patterns
      staticText = staticText.replace(/\$\{[^}]*\}/g, '');
      staticText = staticText.trim();

      // If it's a URL-like pattern, allow it
      if (looksLikeUrl(staticText) || looksLikeUrl(fullText)) {
        continue;
      }

      // If it's a date format pattern, allow it
      if (looksLikeDateFormat(staticText) || looksLikeDateFormat(fullText)) {
        continue;
      }

      if (staticText && !isAllowedString(staticText)) {
        violations.push({ line: lineNumber, text: fullText });
      }
    }

    // Attribute values likely user-visible
    const attrRegex = new RegExp(
      // Allow empty strings and basic escaped characters
      `\\b(${USER_VISIBLE_ATTRS.join('|')})\\s*=\\s*(['"\`])((?:\\\\.|(?!\\2)[^\\\\])*)\\2`,
      'gi',
    );
    let attrMatch;
    while ((attrMatch = attrRegex.exec(line)) !== null) {
      const text = attrMatch[3];
      const matchIndex = attrMatch.index;

      // Skip if in a context that should be ignored
      if (isInSkipContext(line, matchIndex)) {
        continue;
      }

      if (!isAllowedString(text)) {
        violations.push({ line: lineNumber, text });
      }
    }

    // Toast messages
    const toastRegex =
      /toast\.(error|success|warning|info)\s*\(\s*(['"`])((?:\\.|(?!\2).)*?)\2/gi;
    let toastMatch;
    while ((toastMatch = toastRegex.exec(line)) !== null) {
      const text = toastMatch[3];
      if (!isAllowedString(text)) {
        violations.push({ line: lineNumber, text });
      }
    }

    // Note: We intentionally skip generic string literal checks to reduce
    // false positives on class names, test IDs, inline styles, and
    // non-UI/internal strings. Detection focuses on:
    // - JSX text nodes
    // - User-visible attributes (placeholder, title, aria-label, alt, label)
    // - Toast messages
  });

  return violations;
};

/**
 * Main entry point for the i18n detection script.
 * Processes command-line arguments or scans the entire src/ directory.
 * Collects violations from all applicable files and outputs results.
 * Exits with code 0 if no violations found, or code 1 if violations exist.
 *
 * @returns {void} Does not return; exits the process with appropriate exit code
 * @example
 * // From command line:
 * // node check-i18n.js src/Component.tsx
 * // node check-i18n.js (scans entire src/ directory)
 * // node check-i18n.js --staged (scans added lines in staged diff)
 * // node check-i18n.js --diff (scans added lines in working tree diff)
 * // Command variants in this repo:
 * // pnpm run check-i18n (scan entire src/ directory)
 * // pnpm run check-i18n -- src/Component.tsx (scan full file)
 * // pnpm run check-i18n -- --staged (scan added lines in staged diff)
 * // pnpm run check-i18n -- --staged src/Component.tsx (scan added staged lines in file)
 * // pnpm run check-i18n -- --diff (scan added lines in working tree diff)
 * // pnpm run check-i18n -- --diff src/Component.tsx (scan added working tree lines in file)
 * // pnpm run check-i18n -- --diff --base <base_sha> --head <head_sha> (scan added lines between refs)
 * // pnpm run check-i18n -- --diff --base <base_sha> --head <head_sha> src/Component.tsx
 */
const main = () => {
  const {
    files: cliFiles,
    diffOnly,
    staged,
    base,
    head,
  } = parseArgs(process.argv.slice(2));
  if (cliFiles.length === 0 && !fs.existsSync(SRC_DIR)) {
    console.log('No files to scan for i18n violations.');
    process.exit(0);
  }

  let changedLinesByFile = null;
  if (diffOnly) {
    try {
      changedLinesByFile = getDiffLineMap({
        staged,
        files: cliFiles,
        base,
        head,
      });
    } catch (error) {
      console.error(`Error: Unable to read git diff (${error.message}).`);
      process.exit(1);
    }
  }

  let targets = [];
  if (diffOnly) {
    const diffFiles = Array.from(changedLinesByFile.keys());
    const diffTargets =
      cliFiles.length > 0 ? diffFiles : diffFiles.filter((file) => isUnderSrc(file));
    targets = diffTargets
      .filter((file) => fs.existsSync(file))
      .filter((file) => shouldAnalyzeFile(file));
  } else {
    const allFiles =
      cliFiles.length > 0
        ? cliFiles
        : walk(SRC_DIR).map((p) => path.relative(process.cwd(), p));
    targets = allFiles
      .map((file) => path.resolve(process.cwd(), file))
      .filter((file) => fs.existsSync(file))
      .filter((file) => shouldAnalyzeFile(file));
  }

  if (!targets.length) {
    console.log(
      diffOnly
        ? 'No changed lines to scan for i18n violations.'
        : 'No files to scan for i18n violations.',
    );
    process.exit(0);
  }

  const results = {};

  for (const file of targets) {
    const lineFilter = diffOnly ? changedLinesByFile.get(file) : null;
    const violations = collectViolations(file, lineFilter);
    if (violations.length) {
      results[file] = violations;
    }
  }

  const filesWithIssues = Object.keys(results);
  if (!filesWithIssues.length) {
    console.log('No non-internationalized user-visible text found.');
    process.exit(0);
  }

  console.log(
    'The following files contain non-internationalized user-visible text:\n',
  );
  filesWithIssues.forEach((file) => {
    const relativePath = toPosixPath(path.relative(process.cwd(), file));
    results[file].forEach((violation) => {
      console.log(
        `${relativePath}:${violation.line} -> ${JSON.stringify(violation.text)}`,
      );
    });
    console.log();
  });

  process.exit(1);
};

main();

import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const spawnSyncMock = vi.hoisted(() => vi.fn());
const execSyncMock = vi.hoisted(() => vi.fn());
const readFileSyncMock = vi.hoisted(() => vi.fn());

vi.mock('child_process', () => ({
  spawnSync: spawnSyncMock,
  execSync: execSyncMock,
  default: {
    spawnSync: spawnSyncMock,
    execSync: execSyncMock,
  },
}));

vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    default: {
      ...actual,
      readFileSync: readFileSyncMock,
    },
    readFileSync: readFileSyncMock,
  };
});

import {
  filterByExtensions,
  formatCount,
  getAddedLinesByFile,
  getStagedAddedLines,
  getStagedFiles,
  isSrcFile,
  parseAddedLineNumbers,
  shouldSkipFile,
  toRepoRelativePath,
  validateFiles,
} from '../../scripts/validate-tokens';

beforeEach(() => {
  spawnSyncMock.mockReset();
  execSyncMock.mockReset();
  readFileSyncMock.mockReset();
  vi.clearAllMocks();
});

describe('parseAddedLineNumbers', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('handles empty diff', () => {
    const result = parseAddedLineNumbers('');

    expect(Array.from(result)).toEqual([]);
  });

  test('handles diff with only removed lines', () => {
    const diff = ['@@ -1,3 +1,1 @@', '-removed1', '-removed2', ' context'].join(
      '\n',
    );

    const result = parseAddedLineNumbers(diff);

    expect(Array.from(result)).toEqual([]);
  });

  test('handles malformed hunk headers gracefully', () => {
    const diff = ['@@ invalid @@', '+should be ignored'].join('\n');

    const result = parseAddedLineNumbers(diff);

    expect(Array.from(result)).toEqual([]);
  });

  test('tracks consecutive context lines before an addition', () => {
    const diff = [
      '@@ -1,3 +10,3 @@',
      ' line1',
      ' line2',
      ' line3',
      '+added',
    ].join('\n');

    const result = parseAddedLineNumbers(diff);

    expect(Array.from(result)).toEqual([13]);
  });

  test('captures added lines across multiple hunks', () => {
    const diff = [
      'diff --git a/file.css b/file.css',
      '--- a/file.css',
      '+++ b/file.css',
      '@@ -1,3 +1,4 @@',
      ' line1',
      '+added1',
      '-line2',
      ' line3',
      '@@ -10,0 +12,2 @@',
      '+added2',
      '+added3',
    ].join('\n');

    const result = parseAddedLineNumbers(diff);

    expect(Array.from(result)).toEqual([2, 12, 13]);
  });

  test('ignores additions before a hunk header', () => {
    const diff = ['+++ b/file.css', '+orphan'].join('\n');

    const result = parseAddedLineNumbers(diff);

    expect(Array.from(result)).toEqual([]);
  });
});

describe('formatCount', () => {
  test('uses singular for a count of one', () => {
    expect(formatCount(1, 'file')).toBe('1 file');
  });

  test('uses plural for zero and many', () => {
    expect(formatCount(0, 'file')).toBe('0 files');
    expect(formatCount(2, 'file')).toBe('2 files');
  });
});

describe('toRepoRelativePath', () => {
  test('normalizes relative paths', () => {
    const relativePath = path.join('src', 'style', 'app-fixed.module.css');

    expect(toRepoRelativePath(relativePath)).toBe(
      'src/style/app-fixed.module.css',
    );
  });

  test('normalizes absolute paths to repo-relative paths', () => {
    const absolutePath = path.join(
      process.cwd(),
      'src',
      'style',
      'app-fixed.module.css',
    );

    expect(toRepoRelativePath(absolutePath)).toBe(
      'src/style/app-fixed.module.css',
    );
  });
});

describe('getStagedAddedLines', () => {
  test('returns empty set for empty file path', () => {
    const result = getStagedAddedLines('');

    expect(result.size).toBe(0);
    expect(spawnSyncMock).not.toHaveBeenCalled();
  });

  test('returns line numbers from the staged diff', () => {
    const diff = ['@@ -1,0 +1,2 @@', '+first', '+second'].join('\n');
    spawnSyncMock.mockReturnValue({
      stdout: diff,
      error: undefined,
    });

    const absolutePath = path.join(
      process.cwd(),
      'src',
      'style',
      'app-fixed.module.css',
    );
    const result = getStagedAddedLines(absolutePath);

    expect(Array.from(result)).toEqual([1, 2]);
    expect(spawnSyncMock).toHaveBeenCalledWith(
      'git',
      ['diff', '--cached', '-U0', '--', 'src/style/app-fixed.module.css'],
      { encoding: 'utf-8' },
    );
  });

  test('exits with error code when git command fails', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    spawnSyncMock.mockReturnValue({
      stdout: '',
      error: new Error('git command failed'),
    });

    const absolutePath = path.join(process.cwd(), 'src', 'test.css');

    expect(() => getStagedAddedLines(absolutePath)).toThrow(
      'process.exit called',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading staged diff'),
      'git command failed',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe('getAddedLinesByFile', () => {
  test('returns empty map for empty file array', () => {
    const result = getAddedLinesByFile([]);

    expect(result.size).toBe(0);
    expect(spawnSyncMock).not.toHaveBeenCalled();
  });

  test('maps files to their added line numbers', () => {
    const files = [
      path.join('src', 'style', 'a.css'),
      path.join('src', 'style', 'b.css'),
    ];

    spawnSyncMock.mockImplementation((_command, args) => {
      const file = Array.isArray(args) ? (args[4] ?? '') : '';
      const diffs: Record<string, string> = {
        'src/style/a.css': ['@@ -1,0 +1,1 @@', '+alpha'].join('\n'),
        'src/style/b.css': ['@@ -2,0 +2,2 @@', '+bravo', '+charlie'].join('\n'),
      };

      return {
        stdout: diffs[file] ?? '',
        error: undefined,
      };
    });

    const result = getAddedLinesByFile(files);

    expect(Array.from(result.keys())).toEqual([
      'src/style/a.css',
      'src/style/b.css',
    ]);
    expect(Array.from(result.get('src/style/a.css') ?? [])).toEqual([1]);
    expect(Array.from(result.get('src/style/b.css') ?? [])).toEqual([2, 3]);
    expect(spawnSyncMock).toHaveBeenCalledTimes(2);
  });
});

describe('shouldSkipFile', () => {
  test('skips node_modules files', () => {
    expect(shouldSkipFile('node_modules/package/index.js')).toBe(true);
    expect(shouldSkipFile('src/node_modules/test.ts')).toBe(true);
  });

  test('skips build and dist directories', () => {
    expect(shouldSkipFile('build/output.js')).toBe(true);
    expect(shouldSkipFile('dist/bundle.css')).toBe(true);
  });

  test('skips token files', () => {
    expect(shouldSkipFile('src/style/tokens/colors.css')).toBe(true);
    expect(shouldSkipFile('/tokens/spacing.css')).toBe(true);
  });

  test('skips allowlisted files', () => {
    expect(shouldSkipFile('src/style/app-fixed.module.css')).toBe(true);
    expect(shouldSkipFile('src/assets/css/app.css')).toBe(true);
  });

  test('skips validate-tokens test files', () => {
    expect(shouldSkipFile('src/test-utils/validate-tokens.test.ts')).toBe(true);
    expect(
      shouldSkipFile('src/test-utils/validate-tokens-patterns.test.ts'),
    ).toBe(true);
  });

  test('does not skip regular source files', () => {
    expect(shouldSkipFile('src/components/Button.tsx')).toBe(false);
    expect(shouldSkipFile('src/style/button.module.css')).toBe(false);
  });
});

describe('isSrcFile', () => {
  test('returns true for files starting with src/', () => {
    expect(isSrcFile('src/components/Button.tsx')).toBe(true);
    expect(isSrcFile('src/style/app.css')).toBe(true);
  });

  test('returns true for absolute paths containing /src/', () => {
    expect(isSrcFile('/Users/user/project/src/index.ts')).toBe(true);
  });

  test('returns false for non-src files', () => {
    expect(isSrcFile('scripts/validate.ts')).toBe(false);
    expect(isSrcFile('config/vite.config.ts')).toBe(false);
  });
});

describe('filterByExtensions', () => {
  test('filters files by given extensions', () => {
    const files = ['file.ts', 'file.tsx', 'file.js', 'file.css'];
    const tsExtensions = new Set(['.ts', '.tsx']);

    const result = filterByExtensions(files, tsExtensions);

    expect(result).toEqual(['file.ts', 'file.tsx']);
  });

  test('returns empty array when no files match', () => {
    const files = ['file.js', 'file.html'];
    const cssExtensions = new Set(['.css', '.scss']);

    const result = filterByExtensions(files, cssExtensions);

    expect(result).toEqual([]);
  });

  test('returns empty array for empty input', () => {
    const result = filterByExtensions([], new Set(['.ts']));

    expect(result).toEqual([]);
  });
});

describe('getStagedFiles', () => {
  test('returns list of staged files', () => {
    execSyncMock.mockReturnValue('src/file1.ts\nsrc/file2.tsx\n');

    const result = getStagedFiles();

    expect(result).toEqual(['src/file1.ts', 'src/file2.tsx']);
    expect(execSyncMock).toHaveBeenCalledWith(
      'git diff --cached --name-only --diff-filter=ACMRT',
      { encoding: 'utf-8' },
    );
  });

  test('returns empty array when no staged files', () => {
    execSyncMock.mockReturnValue('');

    const result = getStagedFiles();

    expect(result).toEqual([]);
  });

  test('exits with error when git command fails', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    execSyncMock.mockImplementation(() => {
      throw new Error('git command failed');
    });

    expect(() => getStagedFiles()).toThrow('process.exit called');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error reading staged files:',
      'git command failed',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe('validateFiles', () => {
  test('returns empty array for empty file list', async () => {
    const result = await validateFiles('src/**/*.css', []);

    expect(result).toEqual([]);
  });

  test('skips non-src files', async () => {
    readFileSyncMock.mockReturnValue('color: #fff;');

    const result = await validateFiles('**/*.css', ['scripts/test.css']);

    expect(result).toEqual([]);
  });

  test('skips files that should be skipped', async () => {
    readFileSyncMock.mockReturnValue('color: #fff;');

    const result = await validateFiles('**/*.css', [
      'src/style/tokens/colors.css',
    ]);

    expect(result).toEqual([]);
  });

  test('detects hardcoded hex colors in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { color: #fff; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe('color');
    expect(result[0].match).toBe('#fff');
  });

  test('detects hardcoded spacing in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { padding: 8px; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe('spacing');
  });

  test('detects hardcoded font-size in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { font-size: 16px; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe('font-size');
  });

  test('detects hardcoded font-weight in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { font-weight: 700; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe('font-weight');
  });

  test('detects hardcoded border-radius in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { border-radius: 4px; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].type).toBe('border-radius');
  });

  test('detects hardcoded box-shadow in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { box-shadow: 2px 4px 8px #000; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.some((r) => r.type === 'box-shadow')).toBe(true);
  });

  test('detects hardcoded outline in CSS files', async () => {
    readFileSyncMock.mockReturnValue('.test { outline: 2px solid #000; }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result.some((r) => r.type === 'outline')).toBe(true);
  });

  test('detects hardcoded colors in TSX files', async () => {
    readFileSyncMock.mockReturnValue(
      "const style = { backgroundColor: '#ffffff' };",
    );

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result.some((r) => r.type === 'tsx-color')).toBe(true);
  });

  test('detects hardcoded spacing in TSX files', async () => {
    readFileSyncMock.mockReturnValue("const style = { marginTop: '16px' };");

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result.some((r) => r.type === 'tsx-spacing')).toBe(true);
  });

  test('detects hardcoded fontSize in TSX files', async () => {
    readFileSyncMock.mockReturnValue('const style = { fontSize: 16 };');

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result.some((r) => r.type === 'tsx-font-size')).toBe(true);
  });

  test('detects hardcoded fontWeight in TSX files', async () => {
    readFileSyncMock.mockReturnValue('const style = { fontWeight: 700 };');

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result.some((r) => r.type === 'tsx-font-weight')).toBe(true);
  });

  test('detects hardcoded borderRadius in TSX files', async () => {
    readFileSyncMock.mockReturnValue("const style = { borderRadius: '8px' };");

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result.some((r) => r.type === 'tsx-border-radius')).toBe(true);
  });

  test('skips comments in CSS files', async () => {
    readFileSyncMock.mockReturnValue('/* color: #fff; */');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result).toEqual([]);
  });

  test('skips comments in TSX files', async () => {
    readFileSyncMock.mockReturnValue("// backgroundColor: '#fff'");

    const result = await validateFiles('**/*.tsx', ['src/components/Test.tsx']);

    expect(result).toEqual([]);
  });

  test('allows var() usage', async () => {
    readFileSyncMock.mockReturnValue('.test { color: var(--primary-color); }');

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result).toEqual([]);
  });

  test('applies lineFilter when provided', async () => {
    readFileSyncMock.mockReturnValue(
      '.line1 { color: #fff; }\n.line2 { color: #000; }',
    );

    const lineFilter = (_file: string, lineNumber: number): boolean =>
      lineNumber === 1;
    const result = await validateFiles(
      '**/*.css',
      ['src/style/test.css'],
      lineFilter,
    );

    expect(result.length).toBe(1);
    expect(result[0].line).toBe(1);
  });

  test('handles file read errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    readFileSyncMock.mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = await validateFiles('**/*.css', ['src/style/test.css']);

    expect(result).toEqual([]);
    consoleErrorSpy.mockRestore();
  });
});

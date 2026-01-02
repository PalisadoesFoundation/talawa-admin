import path from 'path';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const spawnSyncMock = vi.hoisted(() => vi.fn());

vi.mock('child_process', () => ({
  spawnSync: spawnSyncMock,
  default: {
    spawnSync: spawnSyncMock,
  },
}));

import {
  formatCount,
  getAddedLinesByFile,
  getStagedAddedLines,
  parseAddedLineNumbers,
  toRepoRelativePath,
} from '../../scripts/validate-tokens';

beforeEach(() => {
  spawnSyncMock.mockReset();
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

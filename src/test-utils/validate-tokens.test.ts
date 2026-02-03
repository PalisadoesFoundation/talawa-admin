import { beforeEach, describe, expect, test, vi } from 'vitest';

const execSyncMock = vi.hoisted(() => vi.fn());
const readFileSyncMock = vi.hoisted(() => vi.fn());

vi.mock('child_process', () => ({
  execSync: execSyncMock,
  default: {
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
  getStagedFiles,
  isSrcFile,
  shouldSkipFile,
  validateFiles,
} from '../../scripts/validate-tokens';

beforeEach(() => {
  execSyncMock.mockReset();
  readFileSyncMock.mockReset();
  vi.clearAllMocks();
});

describe('formatCount', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('uses singular for a count of one', () => {
    expect(formatCount(1, 'file')).toBe('1 file');
  });

  test('uses plural for zero and many', () => {
    expect(formatCount(0, 'file')).toBe('0 files');
    expect(formatCount(2, 'file')).toBe('2 files');
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

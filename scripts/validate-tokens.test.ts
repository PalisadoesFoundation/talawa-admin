import { afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import { execSync } from 'child_process';
import { glob } from 'glob';

// Mock dependencies
vi.mock('fs');
vi.mock('child_process');
vi.mock('glob', () => ({
  glob: vi.fn(),
}));

const originalArgv = [...process.argv];

const setArgv = (args: string[]) => {
  process.argv = ['node', 'vitest', ...args];
};

const loadModule = async () => import('./validate-tokens');

const resetPatterns = (patterns: Record<string, RegExp>) => {
  Object.values(patterns).forEach((pattern) => {
    pattern.lastIndex = 0;
  });
};

afterEach(() => {
  process.argv = [...originalArgv];
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.resetModules();
});

describe('validate-tokens', () => {
  describe('Pattern matching', () => {
    it('should match valid 3-digit hex colors', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'color: #abc; background: #123;'.match(PATTERNS.color);

      expect(matches).toEqual(['#abc', '#123']);
    });

    it('should match valid 6-digit hex colors', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'color: #abcdef; border-color: #123456;'.match(
        PATTERNS.color,
      );

      expect(matches).toEqual(['#abcdef', '#123456']);
    });

    it('should not match invalid hex colors', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'color: #12; background: #zzzzzz;'.match(PATTERNS.color);

      expect(matches).toBeNull();
    });

    it('should match hardcoded px spacing values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'padding: 8px; margin:0px; gap: 12px;'.match(
        PATTERNS.spacingPx,
      );

      expect(matches).toEqual(['padding: 8px', 'margin:0px', 'gap: 12px']);
    });

    it('should not match non-px spacing values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'padding: 1rem; border: 2px; top: -4px;'.match(
        PATTERNS.spacingPx,
      );

      expect(matches).toBeNull();
    });

    it('should match hardcoded font-size values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'font-size: 14px; font-size:0px;'.match(
        PATTERNS.fontSize,
      );

      expect(matches).toEqual(['font-size: 14px', 'font-size:0px']);
    });

    it('should not match non-px font-size values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'font-size: 1rem; font-size: 12pt;'.match(
        PATTERNS.fontSize,
      );

      expect(matches).toBeNull();
    });

    it('should match valid font-weight values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'font-weight: 100; font-weight:900;'.match(
        PATTERNS.fontWeight,
      );

      expect(matches).toEqual(['font-weight: 100', 'font-weight:900']);
    });

    it('should not match invalid font-weight values', async () => {
      setArgv([]);
      const { PATTERNS } = await loadModule();
      resetPatterns(PATTERNS);

      const matches = 'font-weight: 950; font-weight: 50;'.match(
        PATTERNS.fontWeight,
      );

      expect(matches).toBeNull();
    });
  });

  describe('File filtering', () => {
    it('should skip node_modules', async () => {
      setArgv([]);
      const { shouldSkipFile } = await loadModule();

      expect(shouldSkipFile('node_modules/react/index.js')).toBe(true);
    });

    it('should skip token files', async () => {
      setArgv([]);
      const { shouldSkipFile } = await loadModule();

      expect(shouldSkipFile('src/styles/tokens/file.css')).toBe(true);
      expect(shouldSkipFile('src/assets/css/app.css')).toBe(true);
      expect(shouldSkipFile('src/style/tokens/vars.css')).toBe(true);
    });

    it('should process src files', async () => {
      setArgv([]);
      const { isSrcFile } = await loadModule();

      expect(isSrcFile('src/components/Button.tsx')).toBe(true);
      expect(isSrcFile('scripts/validate-tokens.ts')).toBe(false);
    });

    it('should filter by extensions', async () => {
      setArgv([]);
      const { filterByExtensions } = await loadModule();

      const files = ['src/a.ts', 'src/b.tsx', 'src/c.css', 'README.md'];
      const result = filterByExtensions(files, new Set(['.ts', '.tsx']));

      expect(result).toEqual(['src/a.ts', 'src/b.tsx']);
    });
  });

  describe('Git integration', () => {
    it('should parse staged files correctly', async () => {
      setArgv([]);
      const execSyncMock = vi.mocked(execSync);
      execSyncMock.mockReturnValue('src/a.ts\nsrc/b.css\n');

      const { getStagedFiles } = await loadModule();
      const result = getStagedFiles();

      expect(execSyncMock).toHaveBeenCalledWith(
        'git diff --cached --name-only --diff-filter=ACMRT',
        { encoding: 'utf-8' },
      );
      expect(result).toEqual(['src/a.ts', 'src/b.css']);
    });

    it('should handle git errors gracefully', async () => {
      setArgv([]);
      const execSyncMock = vi.mocked(execSync);
      execSyncMock.mockImplementation(() => {
        throw new Error('git failed');
      });

      const errorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);

      const { getStagedFiles } = await loadModule();
      const result = getStagedFiles();

      expect(errorSpy).toHaveBeenCalledWith(
        'Error reading staged files:',
        'git failed',
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });

  describe('File validation', () => {
    it('should detect hardcoded colors in files', async () => {
      setArgv([]);
      const { validateFiles } = await loadModule();

      vi.spyOn(fs, 'readFileSync').mockReturnValue("const color = '#abc';");

      const results = await validateFiles('src/**/*.{ts,tsx}', [
        'src/components/Example.ts',
      ]);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        file: 'src/components/Example.ts',
        line: 1,
        match: '#abc',
        type: 'color',
      });
    });

    it('should handle unreadable files gracefully', async () => {
      setArgv([]);
      const { validateFiles } = await loadModule();

      const readError = new Error('unreadable file');
      const readFileSpy = vi
        .spyOn(fs, 'readFileSync')
        .mockImplementation(() => {
          throw readError;
        });
      const errorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      const results = await validateFiles('src/**/*.{ts,tsx}', [
        'src/components/Unreadable.ts',
      ]);

      expect(readFileSpy).toHaveBeenCalledWith(
        'src/components/Unreadable.ts',
        'utf-8',
      );
      expect(errorSpy).toHaveBeenCalledWith(readError);
      expect(results).toEqual([]);
    });
  });

  describe('CLI flags', () => {
    it('should use --files list when provided', async () => {
      setArgv([
        '--files',
        'src/components/Example.ts',
        'src/styles/app.css',
        'README.md',
      ]);
      const { main } = await loadModule();

      const execSyncMock = vi.mocked(execSync);
      const globMock = vi.mocked(glob);

      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
        if (filePath === 'src/components/Example.ts') {
          return 'const value = "token";';
        }
        return 'body { color: var(--color-primary); }';
      });

      const logSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);

      await main();

      expect(execSyncMock).not.toHaveBeenCalled();
      expect(globMock).not.toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(
        logSpy.mock.calls.some((call) =>
          String(call[0]).includes('No hardcoded values found'),
        ),
      ).toBe(true);
    });

    it('should exit 0 when staged files are clean', async () => {
      setArgv(['--staged']);
      const { main } = await loadModule();

      const execSyncMock = vi.mocked(execSync);
      execSyncMock.mockReturnValue(
        'src/components/Example.ts\nsrc/styles/app.css',
      );

      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
        if (filePath === 'src/components/Example.ts') {
          return 'const value = "token";';
        }
        return 'body { color: var(--color-primary); }';
      });

      const logSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);

      await main();

      expect(execSyncMock).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(
        logSpy.mock.calls.some((call) =>
          String(call[0]).includes('No hardcoded values found'),
        ),
      ).toBe(true);
    });

    it('should enable warn-only mode with --warn flag', async () => {
      setArgv(['--warn', '--staged']);
      const { main } = await loadModule();

      const execSyncMock = vi.mocked(execSync);
      execSyncMock.mockReturnValue(
        'src/components/Example.ts\nsrc/styles/app.css',
      );

      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath) => {
        if (filePath === 'src/components/Example.ts') {
          return "const color = '#abc';";
        }
        return 'body { font-size: 14px; }';
      });

      const warnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const errorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);

      await main();

      expect(execSyncMock).toHaveBeenCalled();
      expect(exitSpy).not.toHaveBeenCalled();
      expect(
        warnSpy.mock.calls.some((call) => String(call[0]).includes('Found')),
      ).toBe(true);
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('should scan entire repo with --scan-entire-repo', async () => {
      setArgv(['--scan-entire-repo', '--staged']);
      const { main } = await loadModule();

      const execSyncMock = vi.mocked(execSync);
      const globMock = vi.mocked(glob);

      globMock.mockImplementation((pattern: string | string[]) => {
        const normalizedPattern = Array.isArray(pattern)
          ? pattern.join(',')
          : pattern;
        if (normalizedPattern.includes('{ts,tsx}')) {
          return Promise.resolve(['src/components/Example.ts']);
        }
        if (normalizedPattern.includes('{css,scss,sass}')) {
          return Promise.resolve(['src/styles/app.css']);
        }
        return Promise.resolve([]);
      });

      vi.spyOn(fs, 'readFileSync').mockImplementation(() => 'color: #abc;');

      const errorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      const logSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation((() => undefined) as never);

      await main();

      expect(execSyncMock).not.toHaveBeenCalled();
      expect(globMock).toHaveBeenCalledWith('src/**/*.{ts,tsx}');
      expect(globMock).toHaveBeenCalledWith('src/**/*.{css,scss,sass}');
      expect(logSpy).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(
        errorSpy.mock.calls.some((call) => String(call[0]).includes('Found')),
      ).toBe(true);
    });
  });
});

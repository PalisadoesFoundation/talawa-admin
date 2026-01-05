import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import {
  makeTempDir,
  writeTempFile,
  cleanupTempDirs,
  scriptPath,
} from './check-i18n.test-utils.js';

const spawnSyncMock = vi.hoisted(() => vi.fn());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const moduleTempRoot = path.join(__dirname, '__tmp_modules__');
let sharedModuleDir = null;
let checkI18nModulePromise = null;
let sharedWorkspaceRoot = null;
let cwdSpy = null;

vi.mock('child_process', () => {
  const mock = spawnSyncMock;
  return {
    spawnSync: mock,
    default: { spawnSync: mock },
  };
});

class ExitError extends Error {
  constructor(code) {
    super(`process.exit: ${code}`);
    this.code = code;
  }
}

const loadCheckI18nModule = async () => {
  if (checkI18nModulePromise) {
    return checkI18nModulePromise;
  }
  const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
  const stripped = scriptContent.replace(/\r?\nmain\(\);\s*$/u, '\n');
  fs.mkdirSync(moduleTempRoot, { recursive: true });
  sharedModuleDir = fs.mkdtempSync(path.join(moduleTempRoot, 'check-i18n-'));
  const modulePath = path.join(sharedModuleDir, 'check-i18n.exposed.js');
  fs.writeFileSync(
    modulePath,
    `${stripped}\nexport { parseArgs, parseUnifiedDiff, getDiffLineMap, isUnderSrc, collectViolations, main };\n`,
  );
  checkI18nModulePromise = import(pathToFileURL(modulePath).href);
  return checkI18nModulePromise;
};

const runMain = (mainFn) => {
  const logs = [];
  const errors = [];
  const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
    logs.push(args.map(String).join(' '));
  });
  const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
    errors.push(args.map(String).join(' '));
  });
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new ExitError(code);
  });

  let exitCode;
  try {
    mainFn();
  } catch (err) {
    if (err instanceof ExitError) {
      exitCode = err.code;
    } else {
      throw err;
    }
  } finally {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  }

  return { exitCode, logs, errors };
};

const withArgv = (args, fn) => {
  const original = process.argv;
  process.argv = ['node', 'check-i18n.js', ...args];
  try {
    return fn();
  } finally {
    process.argv = original;
  }
};

const writeSharedFile = (relativePath, content) => {
  if (!sharedWorkspaceRoot) {
    throw new Error('Shared workspace not initialized');
  }
  const filePath = path.join(sharedWorkspaceRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
};

const resetSharedSrc = () => {
  if (!sharedWorkspaceRoot) return;
  const srcDir = path.join(sharedWorkspaceRoot, 'src');
  fs.rmSync(srcDir, { recursive: true, force: true });
  fs.mkdirSync(srcDir, { recursive: true });
};

beforeAll(async () => {
  sharedWorkspaceRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'i18n-detector-workspace-'),
  );
  fs.mkdirSync(path.join(sharedWorkspaceRoot, 'src'), { recursive: true });
  cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(sharedWorkspaceRoot);
  await loadCheckI18nModule();
});

afterAll(() => {
  if (cwdSpy) cwdSpy.mockRestore();
  if (sharedModuleDir) {
    fs.rmSync(sharedModuleDir, { recursive: true, force: true });
  }
  if (sharedWorkspaceRoot) {
    fs.rmSync(sharedWorkspaceRoot, { recursive: true, force: true });
  }
});

beforeEach(() => {
  spawnSyncMock.mockReset();
  spawnSyncMock.mockReturnValue({ status: 0, stdout: '', stderr: '' });
  resetSharedSrc();
});

afterEach(() => {
  cleanupTempDirs();
});

describe.sequential('check-i18n diff and CLI behavior', () => {
  it('parses diff flags and file arguments', async () => {
    const { parseArgs } = await loadCheckI18nModule();

    expect(parseArgs([])).toEqual({
      files: [],
      diffOnly: false,
      staged: false,
      base: null,
      head: null,
    });
    expect(parseArgs(['--diff', 'src/a.tsx'])).toEqual({
      files: ['src/a.tsx'],
      diffOnly: true,
      staged: false,
      base: null,
      head: null,
    });
    expect(parseArgs(['--diff-only', 'a', 'b'])).toEqual({
      files: ['a', 'b'],
      diffOnly: true,
      staged: false,
      base: null,
      head: null,
    });
    expect(parseArgs(['--staged', 'file.tsx'])).toEqual({
      files: ['file.tsx'],
      diffOnly: true,
      staged: true,
      base: null,
      head: null,
    });
    expect(
      parseArgs([
        '--diff',
        '--base',
        'origin/develop',
        '--head',
        'feature',
        'src/with-diff.tsx',
      ]),
    ).toEqual({
      files: ['src/with-diff.tsx'],
      diffOnly: true,
      staged: false,
      base: 'origin/develop',
      head: 'feature',
    });
  });

  it('tracks added lines across files in unified diff', async () => {
    const { parseUnifiedDiff } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/one.tsx b/src/one.tsx',
      'index 111..222 100644',
      '--- a/src/one.tsx',
      '+++ b/src/one.tsx',
      '@@ -1,2 +1,3 @@',
      ' line1',
      '+added line',
      ' line2',
      'diff --git a/src/two.tsx b/src/two.tsx',
      'index 333..444 100644',
      '--- a/src/two.tsx',
      '+++ b/src/two.tsx',
      '@@ -4,0 +5,2 @@',
      '+new1',
      '+new2',
    ].join('\n');

    const map = parseUnifiedDiff(diffText);
    const fileOne = path.resolve(process.cwd(), 'src/one.tsx');
    const fileTwo = path.resolve(process.cwd(), 'src/two.tsx');

    expect(map.has(fileOne)).toBe(true);
    expect(map.has(fileTwo)).toBe(true);
    expect([...map.get(fileOne)]).toEqual([2]);
    expect([...map.get(fileTwo)]).toEqual([5, 6]);
  });

  it('ignores deleted files and malformed hunks', async () => {
    const { parseUnifiedDiff } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/deleted.tsx b/src/deleted.tsx',
      'deleted file mode 100644',
      '--- a/src/deleted.tsx',
      '+++ /dev/null',
      '@@ -1,1 +0,0 @@',
      '-gone',
      'diff --git a/src/skip.tsx b/src/skip.tsx',
      '--- a/src/skip.tsx',
      '+++ b/src/skip.tsx',
      '+not in hunk',
    ].join('\n');

    const map = parseUnifiedDiff(diffText);
    expect(map.size).toBe(0);
  });

  it('returns an empty map for empty diffs', async () => {
    const { parseUnifiedDiff } = await loadCheckI18nModule();
    const map = parseUnifiedDiff('');
    expect(map.size).toBe(0);
  });

  it('builds git diff args and parses output', async () => {
    const { getDiffLineMap } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/one.tsx b/src/one.tsx',
      '--- a/src/one.tsx',
      '+++ b/src/one.tsx',
      '@@ -0,0 +1,2 @@',
      '+first',
      '+second',
    ].join('\n');

    spawnSyncMock.mockReturnValue({ status: 0, stdout: diffText, stderr: '' });

    const map = getDiffLineMap({
      staged: true,
      files: ['src/one.tsx'],
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'git',
      ['diff', '-U0', '--cached', '--', 'src/one.tsx'],
      { encoding: 'utf-8' },
    );

    const filePath = path.resolve(process.cwd(), 'src/one.tsx');
    expect([...map.get(filePath)]).toEqual([1, 2]);
  });

  it('builds git diff args for base/head comparisons', async () => {
    const { getDiffLineMap } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/compare.tsx b/src/compare.tsx',
      '--- a/src/compare.tsx',
      '+++ b/src/compare.tsx',
      '@@ -2,0 +3,1 @@',
      '+<div>Added</div>',
    ].join('\n');

    spawnSyncMock.mockReturnValue({ status: 0, stdout: diffText, stderr: '' });

    const map = getDiffLineMap({
      staged: false,
      base: 'origin/develop',
      head: 'feature',
      files: ['src/compare.tsx'],
    });

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'git',
      ['diff', '-U0', 'origin/develop...feature', '--', 'src/compare.tsx'],
      { encoding: 'utf-8' },
    );

    const filePath = path.resolve(process.cwd(), 'src/compare.tsx');
    expect([...map.get(filePath)]).toEqual([3]);
  });

  it('throws when git diff returns an error status', async () => {
    const { getDiffLineMap } = await loadCheckI18nModule();
    spawnSyncMock.mockReturnValue({
      status: 2,
      stderr: 'fatal: not a git repository',
    });

    expect(() => getDiffLineMap({ staged: false, files: [] })).toThrow(
      'fatal: not a git repository',
    );
  });

  it('throws when git diff fails to spawn', async () => {
    const { getDiffLineMap } = await loadCheckI18nModule();
    spawnSyncMock.mockReturnValue({
      error: new Error('spawn failed'),
      status: 1,
      stderr: '',
    });

    expect(() => getDiffLineMap({ staged: false, files: [] })).toThrow(
      'spawn failed',
    );
  });

  it('returns an empty map for empty git diffs', async () => {
    const { getDiffLineMap } = await loadCheckI18nModule();
    spawnSyncMock.mockReturnValue({ status: 0, stdout: '', stderr: '' });

    const map = getDiffLineMap({ staged: false, files: [] });
    expect(map.size).toBe(0);
  });

  it('detects paths under src with edge cases', async () => {
    const { isUnderSrc } = await loadCheckI18nModule();

    const srcDir = path.join(sharedWorkspaceRoot, 'src');
    expect(isUnderSrc(srcDir)).toBe(true);
    expect(isUnderSrc(path.join(srcDir, 'components'))).toBe(true);
    expect(isUnderSrc(path.join(sharedWorkspaceRoot, 'src-other'))).toBe(false);
    expect(isUnderSrc(path.join(sharedWorkspaceRoot, 'other', 'file.tsx'))).toBe(false);
  });

  it('filters violations by line when a line filter is provided', async () => {
    const { collectViolations } = await loadCheckI18nModule();
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'sample.tsx',
      '<div>One</div>\n<div>Two</div>\n',
    );

    const filtered = collectViolations(file, new Set([2]));
    expect(filtered).toEqual([{ line: 2, text: 'Two' }]);

    const skipped = collectViolations(file, new Set([3]));
    expect(skipped).toEqual([]);

    const all = collectViolations(file, null);
    expect(all.map((violation) => violation.text)).toEqual(['One', 'Two']);
  });

  it('scans src by default and exits 1 on violations', async () => {
    writeSharedFile('src/bad.tsx', '<div>Hardcoded</div>');
    const { main } = await loadCheckI18nModule();
    const result = withArgv([], () => runMain(main));
    expect(result.exitCode).toBe(1);
    const output = result.logs.join('\n');
    expect(output).toContain('src/bad.tsx');
    expect(output).toContain('Hardcoded');
  });

  it('scans only changed lines in diff mode', async () => {
    writeSharedFile('src/changed.tsx', '<div>Old</div>\n<div>New</div>\n');
    const { main } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/changed.tsx b/src/changed.tsx',
      'index 111..222 100644',
      '--- a/src/changed.tsx',
      '+++ b/src/changed.tsx',
      '@@ -1,0 +2,1 @@',
      '+<div>New</div>',
    ].join('\n');

    spawnSyncMock.mockReturnValue({ status: 0, stdout: diffText, stderr: '' });

    const result = withArgv(['--diff'], () => runMain(main));
    expect(result.exitCode).toBe(1);
    const output = result.logs.join('\n');
    expect(output).toContain('New');
    expect(output).not.toContain('Old');
  });

  it('reports no targets when diff output is empty', async () => {
    const { main } = await loadCheckI18nModule();
    spawnSyncMock.mockReturnValue({ status: 0, stdout: '', stderr: '' });
    const result = withArgv(['--diff'], () => runMain(main));
    expect(result.exitCode).toBe(0);
    expect(result.logs.join('\n')).toContain(
      'No changed lines to scan for i18n violations.',
    );
  });

  it('reports git diff errors in diff mode', async () => {
    const { main } = await loadCheckI18nModule();
    spawnSyncMock.mockReturnValue({
      status: 2,
      stderr: 'fatal: not a git repository',
    });
    const result = withArgv(['--diff'], () => runMain(main));
    expect(result.exitCode).toBe(1);
    expect(result.errors.join('\n')).toContain('Unable to read git diff');
  });

  it('passes --cached to git diff for staged scans', async () => {
    writeSharedFile('src/ok.tsx', '<div>{t("ok")}</div>');
    const { main } = await loadCheckI18nModule();
    const diffText = [
      'diff --git a/src/ok.tsx b/src/ok.tsx',
      '--- a/src/ok.tsx',
      '+++ b/src/ok.tsx',
      '@@ -0,0 +1,1 @@',
      '+<div>{t("ok")}</div>',
    ].join('\n');

    spawnSyncMock.mockReturnValue({ status: 0, stdout: diffText, stderr: '' });

    const result = withArgv(['--staged'], () => runMain(main));

    expect(spawnSyncMock).toHaveBeenCalledWith(
      'git',
      ['diff', '-U0', '--cached'],
      { encoding: 'utf-8' },
    );
    expect(result.exitCode).toBe(0);
    expect(result.logs.join('\n')).toContain(
      'No non-internationalized user-visible text found.',
    );
  });
});

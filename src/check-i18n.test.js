import { describe, it, expect, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptPath = path.resolve(__dirname, '..', 'scripts', 'check-i18n.js');
const fixturesDir = path.resolve(__dirname, '..', 'scripts', '__fixtures__');

const tempDirs = [];

const runScript = (targets, options = {}) => {
  const { env, ...rest } = options;
  const res = spawnSync(process.execPath, [scriptPath, ...targets], {
    encoding: 'utf-8',
    env: { ...process.env, ...(env ?? {}), FORCE_COLOR: '0', NO_COLOR: '1' },
    timeout: 30_000,
    ...rest,
  });
  if (res.error) throw res.error;
  return res;
};

const makeTempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-detector-'));
  tempDirs.push(dir);
  return dir;
};

const writeTempFile = (dir, relPath, content) => {
  const filePath = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
};

afterEach(() => {
  tempDirs.forEach((dir) => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
  tempDirs.length = 0;
});

describe('check-i18n script', () => {
  it('fails with violations in violations.tsx', () => {
    const res = runScript([path.join(fixturesDir, 'violations.tsx')]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('violations.tsx');
    expect(res.stdout).toContain('Welcome to Dashboard');
    expect(res.stdout).toContain('Enter your name');
    expect(res.stdout).toContain('Something went wrong');
  });

  it('fails with mixed content in mixed.tsx', () => {
    const res = runScript([path.join(fixturesDir, 'mixed.tsx')]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('mixed.tsx');
    expect(res.stdout).toContain('This text is hardcoded');
    expect(res.stdout).toContain('Type here');
    expect(res.stdout).not.toContain('common.title');
  });

  it('passes for fully translated correct.tsx', () => {
    const res = runScript([path.join(fixturesDir, 'correct.tsx')]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain(
      'No non-internationalized user-visible text found.',
    );
  });

  it('passes for allowed edge cases', () => {
    const res = runScript([path.join(fixturesDir, 'edge-cases.tsx')]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain(
      'No non-internationalized user-visible text found.',
    );
  });

  it('reports path:line in output for violations', () => {
    const res = runScript([path.join(fixturesDir, 'violations.tsx')]);
    expect(res.status).toBe(1);
    expect(res.stdout).toMatch(/violations\.tsx:\d+ -> ".*"/);
  });

  it('exits 1 when multiple files passed with any violations', () => {
    const files = [
      path.join(fixturesDir, 'correct.tsx'),
      path.join(fixturesDir, 'violations.tsx'),
    ];
    const res = runScript(files);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('violations.tsx');
  });

  it('exits 0 when multiple files have no violations', () => {
    const files = [
      path.join(fixturesDir, 'correct.tsx'),
      path.join(fixturesDir, 'edge-cases.tsx'),
    ];
    const res = runScript(files);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain(
      'No non-internationalized user-visible text found.',
    );
  });

  it('prints message and exits 0 when an input file does not exist', () => {
    const missing = path.join(fixturesDir, 'does-not-exist.tsx');
    const res = runScript([missing]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan for i18n violations.');
  });

  it('excludes test/mock patterns via shouldAnalyzeFile', () => {
    const tmp = makeTempDir();
    const excluded = writeTempFile(
      tmp,
      'foo.spec.tsx',
      'export const x = <div>Hardcoded</div>;',
    );
    const res = runScript([excluded]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan for i18n violations.');
  });

  it('strips comments but preserves line numbers', () => {
    const tmp = makeTempDir();
    const commented = writeTempFile(
      tmp,
      'commented.tsx',
      [
        '/* comment line 1 */',
        '// single line comment',
        '<div>Hardcoded</div>',
      ].join('\n'),
    );
    const res = runScript([commented]);
    expect(res.status).toBe(1);
    expect(res.stdout).toMatch(/commented\.tsx:3 -> "Hardcoded"/);
  });

  it('walks src by default when no args provided', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      path.join('src', 'bad.tsx'),
      'export const bad = <span>Bad text</span>;',
    );
    const res = runScript([], { cwd: tmp });
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('src/bad.tsx');
    expect(res.stdout).toContain('Bad text');
    expect(fs.existsSync(file)).toBe(true);
  });

  it('detects hardcoded label attribute', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'label-test.tsx',
      '<input label="Username" />',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Username');
  });

  it('detects hardcoded aria-placeholder attribute', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'aria-placeholder-test.tsx',
      '<div contenteditable="true" aria-placeholder="Enter text here"></div>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Enter text here');
  });

  // Test file exclusion patterns
  it('excludes .test. files', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'component.test.tsx',
      '<div>Hardcoded test text</div>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan');
  });

  it('excludes __tests__ directories', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      path.join('__tests__', 'component.tsx'),
      '<div>Hardcoded test text</div>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan');
  });

  it('excludes __mocks__ directories', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      path.join('__mocks__', 'module.tsx'),
      '<div>Hardcoded mock text</div>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan');
  });

  it('excludes .mock. files', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(tmp, 'api.mock.tsx', '<div>Hardcoded</div>');
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan');
  });

  // Allowance filters
  it('allows empty strings', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'empty.tsx',
      '<input placeholder="" />\n<span></span>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No non-internationalized');
  });

  it('flags template literals with hardcoded text', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'template.tsx',
      'const name = "John";\n<div>{`Hello ${name}`}</div>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Hello');
  });

  it('allows URLs (http://, /, data:)', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'urls.tsx',
      [
        '<a title="https://example.com">Link</a>',
        '<img alt="/assets/logo.png" />',
        '<link href="data:image/png;base64,abc" />',
      ].join('\n'),
    );
    const res = runScript([file]);
    // "Link" is still a violation, but URLs in attributes should pass
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Link');
    expect(res.stdout).not.toContain('https://example.com');
    expect(res.stdout).not.toContain('/assets/logo.png');
  });

  it('allows strings without words (numbers, symbols)', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'symbols.tsx',
      '<div>123</div>\n<span>$</span>\n<span>→</span>\n<span>...</span>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No non-internationalized');
  });

  // Unicode-aware word counting
  it('detects unicode text as violations', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'unicode.tsx',
      '<div>Привет мир</div>\n<span>你好世界</span>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Привет мир');
    expect(res.stdout).toContain('你好世界');
  });

  // Toast message detection
  it('detects all toast variants', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'toasts.tsx',
      [
        'toast.error("Error message");',
        'toast.success("Success message");',
        'toast.warning("Warning message");',
        'toast.info("Info message");',
      ].join('\n'),
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Error message');
    expect(res.stdout).toContain('Success message');
    expect(res.stdout).toContain('Warning message');
    expect(res.stdout).toContain('Info message');
  });

  it('detects toast messages with apostrophes and special characters', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'toast-special.tsx',
      'toast.error("Can\'t proceed with this action");',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain("Can't proceed");
  });

  // All user-visible attributes
  it('detects all user-visible attributes', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'attrs.tsx',
      [
        '<input placeholder="Placeholder text" />',
        '<div title="Title text">Content</div>',
        '<button aria-label="Aria label text">Click</button>',
        '<img alt="Alt text" />',
        '<option label="Label text">Option</option>',
      ].join('\n'),
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Placeholder text');
    expect(res.stdout).toContain('Title text');
    expect(res.stdout).toContain('Aria label text');
    expect(res.stdout).toContain('Alt text');
    expect(res.stdout).toContain('Label text');
  });

  // File extension filtering
  it('only processes .ts, .tsx, .js, .jsx files', () => {
    const tmp = makeTempDir();
    const cssFile = writeTempFile(
      tmp,
      'styles.css',
      '.class { content: "Hardcoded"; }',
    );
    const jsonFile = writeTempFile(tmp, 'data.json', '{"text": "Hardcoded"}');
    const tsFile = writeTempFile(tmp, 'component.tsx', '<div>Hardcoded</div>');

    // CSS and JSON should be ignored
    const resCss = runScript([cssFile]);
    expect(resCss.status).toBe(0);
    expect(resCss.stdout).toContain('No files to scan');

    const resJson = runScript([jsonFile]);
    expect(resJson.status).toBe(0);
    expect(resJson.stdout).toContain('No files to scan');

    // TSX should be processed
    const resTsx = runScript([tsFile]);
    expect(resTsx.status).toBe(1);
    expect(resTsx.stdout).toContain('Hardcoded');
  });

  // Output format validation
  it('groups violations by file with blank line separation', () => {
    const tmp = makeTempDir();
    writeTempFile(tmp, 'file1.tsx', '<div>Text one</div>');
    writeTempFile(tmp, 'file2.tsx', '<div>Text two</div>');
    const res = runScript([
      path.join(tmp, 'file1.tsx'),
      path.join(tmp, 'file2.tsx'),
    ]);
    expect(res.status).toBe(1);
    // Check that output contains both files
    expect(res.stdout).toContain('file1.tsx');
    expect(res.stdout).toContain('file2.tsx');
    const i1 = res.stdout.indexOf('file1.tsx');
    const i2 = res.stdout.indexOf('file2.tsx');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(res.stdout.slice(i1, i2)).toContain('\n\n');
    // Check header message
    expect(res.stdout).toContain('non-internationalized user-visible text');
  });

  // Cross-platform path normalization
  it('outputs POSIX-style paths regardless of platform', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      path.join('src', 'components', 'Button.tsx'),
      '<button>Click</button>',
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    // Should use forward slashes in output
    expect(res.stdout).toMatch(/src\/components\/Button\.tsx/);
    // Should not contain backslashes in path
    expect(res.stdout).not.toMatch(/src\\components\\Button\.tsx/);
  });

  // Skip import lines
  it('skips import statements', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'imports.tsx',
      [
        'import React from "react";',
        'import { Button } from "./Button";',
        'require("some-module");',
        '<div>Actual violation</div>',
      ].join('\n'),
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Actual violation');
    expect(res.stdout).not.toContain('react');
    expect(res.stdout).not.toContain('Button');
    expect(res.stdout).not.toContain('some-module');
  });

  // Multi-line block comment handling
  it('handles multi-line block comments correctly', () => {
    const tmp = makeTempDir();
    const file = writeTempFile(
      tmp,
      'multiline-comment.tsx',
      [
        '/*',
        ' * This is a comment',
        ' * with multiple lines',
        ' */',
        '<div>Real text</div>',
      ].join('\n'),
    );
    const res = runScript([file]);
    expect(res.status).toBe(1);
    expect(res.stdout).toMatch(/multiline-comment\.tsx:5 -> "Real text"/);
  });

  // Error handling in walk() - directory traversal errors
  it('walks src directory and detects violations', () => {
    const tmp = makeTempDir();
    writeTempFile(tmp, path.join('src', 'valid.tsx'), '<div>Valid text</div>');
    const res = runScript([], { cwd: tmp });
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Valid text');
  });

  it('returns empty array for non-existent directory in walk()', () => {
    const tmp = makeTempDir();
    const res = runScript([], { cwd: tmp });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan for i18n violations.');
  });

  it('gracefully handles when src is a file (invalid directory)', () => {
    const tmp = makeTempDir();
    // Make a file named "src" so walk() gets ENOTDIR and returns []
    fs.writeFileSync(path.join(tmp, 'src'), 'not a directory');
    const res = runScript([], { cwd: tmp });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('No files to scan for i18n violations.');
  });

  // Error handling in collectViolations()
  it('continues when a target path is a directory with .tsx extension', () => {
    const tmp = makeTempDir();
    // Valid file with a violation
    writeTempFile(tmp, 'bad.tsx', '<div>Bad text</div>');
    // Directory that looks like a .tsx file -> triggers readFileSync error (EISDIR)
    const dirAsFile = path.join(tmp, 'not-a-file.tsx');
    fs.mkdirSync(dirAsFile);

    const res = runScript([path.join(tmp, 'bad.tsx'), dirAsFile]);
    expect(res.status).toBe(1);
    expect(res.stdout).toContain('Bad text');
  });

  it('skips unreadable target and reports no files when only directory-like target passed', () => {
    const tmp = makeTempDir();
    const dirAsFile = path.join(tmp, 'unreadable.tsx');
    fs.mkdirSync(dirAsFile);

    const res = runScript([dirAsFile]);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain(
      'No non-internationalized user-visible text found.',
    );
  });
});

import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

import { deleteReadmeFiles } from '../../../scripts/delete-readmes.js';

const createFile = (filePath: string, contents = ''): void => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
};

const hasFile = (filePath: string): boolean => fs.existsSync(filePath);

describe('deleteReadmeFiles', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(tmpdir(), 'delete-readmes-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('removes README.md files recursively while keeping other files intact', () => {
    const rootReadme = path.join(tempDir, 'README.md');
    const nestedDir = path.join(tempDir, 'nested');
    const nestedReadme = path.join(nestedDir, 'README.md');
    const nestedFile = path.join(nestedDir, 'keep.txt');

    createFile(rootReadme, '# Root readme');
    createFile(nestedReadme, '# Nested readme');
    createFile(nestedFile, 'persistent data');

    deleteReadmeFiles(tempDir);

    expect(hasFile(rootReadme)).toBe(false);
    expect(hasFile(nestedReadme)).toBe(false);
    expect(hasFile(nestedFile)).toBe(true);
  });

  it('exits gracefully when the directory is missing', () => {
    const missingPath = path.join(tempDir, 'missing');

    expect(() => deleteReadmeFiles(missingPath)).not.toThrow();
    expect(hasFile(missingPath)).toBe(false);
  });
});

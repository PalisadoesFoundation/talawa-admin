import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  filesToSkip,
  findTsxFiles,
  containsTsDocComment,
  run,
} from '../../../.github/workflows/check-tsdoc.js';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(tmpdir(), 'check-tsdoc-'));
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe('check-tsdoc workflow script', () => {
  it('findTsxFiles gathers .tsx files recursively while skipping tests and configured files', async () => {
    const componentPath = path.join(tempDir, 'Component.tsx');
    const specPath = path.join(tempDir, 'Component.spec.tsx');
    const skippedPath = path.join(tempDir, 'index.tsx');

    const nestedDir = path.join(tempDir, 'nested');
    await mkdir(nestedDir, { recursive: true });
    const nestedComponentPath = path.join(nestedDir, 'Nested.tsx');
    const nestedSkippedPath = path.join(nestedDir, 'OrgPostCard.tsx');

    await writeFile(componentPath, 'export const Component = () => null;');
    await writeFile(specPath, 'export const ComponentSpec = () => null;');
    await writeFile(skippedPath, 'export const SkipMe = () => null;');
    await writeFile(nestedComponentPath, 'export const Nested = () => null;');
    await writeFile(nestedSkippedPath, 'export const SkipNested = () => null;');

    const files = (await findTsxFiles(tempDir)) as string[];
    const normalised = files.map((file: string) => path.normalize(file)).sort();

    expect(normalised).toEqual(
      [componentPath, nestedComponentPath]
        .map((file) => path.normalize(file))
        .sort(),
    );
  });

  it('containsTsDocComment detects presence of TSDoc blocks', async () => {
    const withDoc = path.join(tempDir, 'WithDoc.tsx');
    const withoutDoc = path.join(tempDir, 'WithoutDoc.tsx');

    await writeFile(
      withDoc,
      '/**\n * Example\n */\nexport const WithDoc = () => null;',
    );
    await writeFile(withoutDoc, 'export const WithoutDoc = () => null;');

    await expect(containsTsDocComment(withDoc)).resolves.toBe(true);
    await expect(containsTsDocComment(withoutDoc)).resolves.toBe(false);
  });

  it('run exits with failure when files lack TSDoc comments', async () => {
    const fileWithoutDoc = path.join(tempDir, 'NeedsDocs.tsx');
    await writeFile(fileWithoutDoc, 'export const NeedsDocs = () => null;');

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit-${code}`);
    }) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(run(tempDir)).rejects.toThrow('exit-1');
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(errorSpy).toHaveBeenCalledWith(
        `No TSDoc comment found in file: ${fileWithoutDoc}`,
      );
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('run completes without exiting when all files are documented', async () => {
    const documentedFile = path.join(tempDir, 'Documented.tsx');
    await writeFile(
      documentedFile,
      '/**\n * My component documentation\n */\nexport const Documented = () => null;',
    );

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit-${code}`);
    }) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(run(tempDir)).resolves.toBeUndefined();
      expect(exitSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});

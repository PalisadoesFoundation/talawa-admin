import { realpathSync as realpathSyncFn } from 'fs';
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  findTsxFiles,
  containsTsDocComment,
  run,
  shouldRunCli,
  handleCliInvocation,
} from 'utils/tsdocChecker';

let tempDir: string;

type Resolver = typeof realpathSyncFn;

const makeResolver = (fn: (filePath: string) => string): Resolver => {
  const resolver = fn as unknown as Resolver;
  (resolver as unknown as { native: Resolver }).native = resolver;
  return resolver;
};

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

  it('findTsxFiles logs an error when a directory cannot be read', async () => {
    const missingDir = path.join(tempDir, 'does-not-exist');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const files = await findTsxFiles(missingDir);
      expect(files).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Error reading directory ${missingDir}`),
      );
    } finally {
      consoleSpy.mockRestore();
    }
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

  it('containsTsDocComment logs and returns false when file read fails', async () => {
    const missingFile = path.join(tempDir, 'missing.tsx');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(containsTsDocComment(missingFile)).resolves.toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Error reading file ${missingFile}`),
      );
    } finally {
      consoleSpy.mockRestore();
    }
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

describe('shouldRunCli', () => {
  it('returns true when invoked path resolves to module path', () => {
    const fakePath = '/tmp/script.js';
    const resolver = makeResolver(() => fakePath);
    const result = shouldRunCli(['node', fakePath], resolver, fakePath);

    expect(result).toBe(true);
  });

  it('returns false when resolver throws or paths do not match', () => {
    const fakePath = '/tmp/script.js';

    expect(
      shouldRunCli(
        ['node', fakePath],
        makeResolver(() => {
          throw new Error('boom');
        }),
        fakePath,
      ),
    ).toBe(false);

    expect(
      shouldRunCli(
        ['node', fakePath],
        makeResolver(() => '/other/path'),
        fakePath,
      ),
    ).toBe(false);
  });

  it('returns false when no invocation argument is supplied', () => {
    expect(shouldRunCli(['node'])).toBe(false);
  });
});

describe('handleCliInvocation', () => {
  const modulePath = '/tmp/check-tsdoc.js';
  const resolver = makeResolver(() => modulePath);

  it('does nothing when script is not executed directly', async () => {
    const runSpy = vi.fn();

    await expect(
      handleCliInvocation(runSpy, ['node'], resolver, modulePath),
    ).resolves.toBeUndefined();

    expect(runSpy).not.toHaveBeenCalled();
  });

  it('runs CLI and allows success without exiting', async () => {
    const runSpy = vi.fn().mockResolvedValue(undefined);
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(
        handleCliInvocation(runSpy, ['node', modulePath], resolver, modulePath),
      ).resolves.toBeUndefined();

      expect(runSpy).toHaveBeenCalledTimes(1);
      expect(exitSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('logs and exits when the CLI run fails', async () => {
    const runSpy = vi.fn().mockRejectedValue(new Error('boom'));
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
      throw new Error('exit');
    }) as never);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await expect(
        handleCliInvocation(runSpy, ['node', modulePath], resolver, modulePath),
      ).rejects.toThrow('exit');

      expect(runSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith('check-tsdoc failed: boom');
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });
});

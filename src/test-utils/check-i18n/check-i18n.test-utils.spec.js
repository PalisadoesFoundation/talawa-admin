import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as childProcess from 'child_process';

const spawnSyncMock = vi.hoisted(() => vi.fn());

vi.mock('child_process', () => {
  const mock = spawnSyncMock;
  return {
    spawnSync: mock,
    default: { spawnSync: mock },
  };
});

import {
  runScript,
  makeTempDir,
  writeTempFile,
  cleanupTempDirs,
  scriptPath,
  fixturesDir,
} from './check-i18n.test-utils';

describe('check-i18n test utils', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanupTempDirs();
  });

  describe('path exports', () => {
    it('exposes scriptPath and fixturesDir', () => {
      expect(scriptPath.endsWith(path.join('scripts', 'check-i18n.js'))).toBe(
        true,
      );
      expect(fs.existsSync(scriptPath)).toBe(true);
      expect(fs.existsSync(fixturesDir)).toBe(true);
    });
  });

  describe('File system helpers', () => {
    it('makeTempDir creates a directory', () => {
      const dir = makeTempDir();
      expect(fs.existsSync(dir)).toBe(true);
      expect(fs.statSync(dir).isDirectory()).toBe(true);
    });

    it('writeTempFile writes content to a file', () => {
      const dir = makeTempDir();
      const filePath = writeTempFile(dir, 'test.txt', 'hello world');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello world');
    });

    it('writeTempFile creates nested directories', () => {
      const dir = makeTempDir();
      const filePath = writeTempFile(dir, 'nested/dir/test.txt', 'hello world');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello world');
    });

    it('cleanupTempDirs removes directories created by helpers', () => {
      const dir1 = makeTempDir();
      const dir2 = makeTempDir();
      expect(fs.existsSync(dir1)).toBe(true);
      expect(fs.existsSync(dir2)).toBe(true);
      cleanupTempDirs();
      expect(fs.existsSync(dir1)).toBe(false);
      expect(fs.existsSync(dir2)).toBe(false);
    });
  });

  describe('runScript', () => {
    beforeEach(() => {
      spawnSyncMock.mockReset();
      spawnSyncMock.mockReturnValue({ status: 0, stdout: 'ok', stderr: '' });
    });

    it('calls spawnSync with merged env, cwd, and default timeout', () => {
      const original = process.env.TEST_VAR;
      try {
        process.env.TEST_VAR = 'kept';

        const result = runScript(['--flag'], {
          env: { TEST_VAR: 'abc', EXTRA: '1' },
          cwd: '/tmp/workspace',
          stdio: 'pipe',
        });

        const [execPath, args, options] = spawnSyncMock.mock.calls[0];
        expect(execPath).toBe(process.execPath);
        expect(args[0]).toBe(scriptPath);
        expect(args[1]).toBe('--flag');
        expect(options.env.TEST_VAR).toBe('abc');
        expect(options.env.EXTRA).toBe('1');
        expect(options.env.FORCE_COLOR).toBe('0');
        expect(options.env.NO_COLOR).toBe('1');
        expect(options.cwd).toBe('/tmp/workspace');
        expect(options.timeout).toBe(30_000);
        expect(result).toEqual({ status: 0, stdout: 'ok', stderr: '' });
        expect(process.env.TEST_VAR).toBe('kept');
      } finally {
        process.env.TEST_VAR = original;
      }
    });

    it('uses scriptContent when provided and leaves a temp file to clean', () => {
      const result = runScript(['--arg'], {
        scriptContent: 'console.log("hi")',
        stdio: 'pipe',
      });

      expect(spawnSyncMock).toHaveBeenCalledTimes(1);
      const [, args] = spawnSyncMock.mock.calls[0];
      const targetScript = args[0];
      expect(targetScript).not.toBe(scriptPath);
      expect(fs.existsSync(targetScript)).toBe(true);
      expect(result).toEqual({ status: 0, stdout: 'ok', stderr: '' });

      cleanupTempDirs();
      expect(fs.existsSync(path.dirname(targetScript))).toBe(false);
    });

    it('retries EBADF errors with backoff then succeeds', () => {
      const waitSpy = vi.spyOn(Atomics, 'wait').mockReturnValue('ok');
      spawnSyncMock
        .mockReturnValueOnce({ error: { code: 'EBADF' } })
        .mockReturnValueOnce({ status: 0, stdout: 'recovered', stderr: '' });

      const result = runScript(['--retry']);

      expect(spawnSyncMock).toHaveBeenCalledTimes(2);
      expect(waitSpy).toHaveBeenCalledWith(
        expect.any(Int32Array),
        0,
        0,
        expect.any(Number),
      );
      expect(result).toEqual({ status: 0, stdout: 'recovered', stderr: '' });

      waitSpy.mockRestore();
    });

    it('skips waiting when computed backoff is non-positive', () => {
      const waitSpy = vi
        .spyOn(Atomics, 'wait')
        .mockImplementation(() => {
          throw new Error('should not wait');
        });
      const minSpy = vi.spyOn(Math, 'min').mockReturnValue(0);

      spawnSyncMock
        .mockReturnValueOnce({ error: { code: 'EBADF' } })
        .mockReturnValueOnce({ status: 0, stdout: 'fast', stderr: '' });

      const result = runScript(['--retry-fast']);

      expect(result).toEqual({ status: 0, stdout: 'fast', stderr: '' });
      expect(spawnSyncMock).toHaveBeenCalledTimes(2);
      expect(minSpy).toHaveBeenCalled();
      expect(waitSpy).not.toHaveBeenCalled();

      minSpy.mockRestore();
      waitSpy.mockRestore();
    });

    it('throws non-EBADF errors immediately', () => {
      const error = new Error('boom');
      spawnSyncMock.mockReturnValue({ error });

      expect(() => runScript(['--fail-fast'])).toThrow(error);
      expect(spawnSyncMock).toHaveBeenCalledTimes(1);
    });

    it('stops after exhausting EBADF retries', () => {
      spawnSyncMock.mockReturnValue({ error: { code: 'EBADF' } });

      try {
        runScript(['--never']);
      } catch (err) {
        expect(err.code).toBe('EBADF');
      }
      expect(spawnSyncMock).toHaveBeenCalledTimes(8);
    });
  });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import {
  runScript,
  makeTempDir,
  writeTempFile,
  cleanupTempDirs,
  scriptPath,
} from './check-i18n.test-utils';

describe('check-i18n test utils', () => {
  describe('File system helpers', () => {
    afterEach(() => {
      cleanupTempDirs();
    });

    it('makeTempDir creates a directory', () => {
      const dir = makeTempDir();
      expect(fs.existsSync(dir)).toBe(true);
      const stats = fs.statSync(dir);
      expect(stats.isDirectory()).toBe(true);
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

    it('cleanupTempDirs removes directories', () => {
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
    const mockScript = `#!/usr/bin/env node
      const args = process.argv.slice(2);
      if (args.includes('--fail')) {
        console.error('Error occurred');
        process.exit(1);
      }
      if (args.includes('--throw')) {
        throw new Error('Runtime error');
      }
      if (args.includes('--env')) {
        console.log('ENV_VAR=' + process.env.TEST_VAR);
      }
      if (args.includes('--cwd')) {
        console.log('CWD=' + process.cwd());
      }
      console.log('Success');
      console.info('Info message');
      console.warn('Warning message');
    `;

    afterEach(() => {
      cleanupTempDirs();
    });

    it('executes the script and captures stdout/stderr', async () => {
      const result = await runScript([], { scriptContent: mockScript });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Success');
      expect(result.stdout).toContain('Info message');
      expect(result.stderr).toContain('Warning message');
    });

    it('handles process.exit(code)', async () => {
      const result = await runScript(['--fail'], { scriptContent: mockScript });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Error occurred');
    });

    it('handles thrown errors', async () => {
      const result = await runScript(['--throw'], {
        scriptContent: mockScript,
      });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Runtime error');
    });

    it('sets environment variables', async () => {
      const result = await runScript(['--env'], {
        scriptContent: mockScript,
        env: { TEST_VAR: 'test-value' },
      });
      expect(result.stdout).toContain('ENV_VAR=test-value');
    });

    it('restores existing environment variables', async () => {
      process.env.EXISTING_VAR = 'original';
      await runScript([], {
        env: { EXISTING_VAR: 'modified' },
      });
      expect(process.env.EXISTING_VAR).toBe('original');
      delete process.env.EXISTING_VAR;
    });

    it('sets current working directory', async () => {
      const tempDir = makeTempDir();
      const result = await runScript(['--cwd'], {
        scriptContent: mockScript,
        cwd: tempDir,
      });
      const normalizedTempDir = fs.realpathSync(tempDir);
      expect(result.stdout).toContain(`CWD=${normalizedTempDir}`);
    });
  });
});

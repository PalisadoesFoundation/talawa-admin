import path from 'path';
import { mkdir, copyFile } from 'fs/promises';
import { backupEnvFile } from './backupEnvFile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs/promises', () => {
  const mocks = {
    mkdir: vi.fn(),
    copyFile: vi.fn(),
  };
  return {
    ...mocks,
    default: mocks, // This line fixes the "No default export" error
  };
});

describe('backupEnvFile', () => {
  const mockCwd = '/test/path';
  const originalCwd = process.cwd;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();

    vi.restoreAllMocks();
  });

  it('should create backup successfully', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockDate = new Date('2026-01-15T12:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    const result = await backupEnvFile();

    expect(mkdir).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });

    const expectedTimestamp = '2026-01-15T12-00-00-000Z';
    const expectedPath = path.join(
      mockCwd,
      '.backup',
      `.env-backup-${expectedTimestamp}`,
    );
    expect(copyFile).toHaveBeenCalledWith('.env', expectedPath);
    expect(result).toBe(expectedPath);
    vi.useRealTimers();
  });

  it.only('should throw error when directory creation fails', async () => {
    const mockError = new Error('EACCES: permission denied');
    vi.mocked(mkdir).mockRejectedValue(mockError);

    await expect(backupEnvFile()).rejects.toThrow('EACCES: permission denied');
  });

  it('should throw errors when the file copy fails', async () => {
    vi.mocked(copyFile).mockRejectedValue(
      new Error('EACCES: permission denied'),
    );

    await expect(backupEnvFile()).rejects.toThrow('EACCES: permission denied');
  });

  it('should use the correct ISO format with hyphens instead of colons/dots', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const backupPath = await backupEnvFile();

    // Verify timestamp replacement logic: 2026-01-15T12:00:00.000Z -> 2026-01-15T12-00-00-000Z
    expect(copyFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringMatching(/2026-01-15T12-00-00-000Z$/),
    );
  });
});

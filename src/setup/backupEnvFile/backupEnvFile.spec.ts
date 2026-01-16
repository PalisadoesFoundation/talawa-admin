import path from 'path';
import { mkdir, copyFile, access } from 'fs/promises';
import { backupEnvFile } from './backupEnvFile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs/promises', () => {
  const mocks = {
    mkdir: vi.fn(),
    copyFile: vi.fn(),
    access: vi.fn(),
  };
  return {
    ...mocks,
    default: mocks, // This line fixes the "No default export" error
  };
});

describe('backupEnvFile', () => {
  const mockCwd = '/test/path';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create backup and return backup path', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockEpochMs = 1234567890000;
    const mockEpochSec = Math.floor(mockEpochMs / 1000);
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    const result = await backupEnvFile();

    const expectedDir = path.join(mockCwd, '.backup');
    const expectedFile = `.env.${mockEpochSec}`;
    const expectedPath = path.join(expectedDir, expectedFile);

    expect(mkdir).toHaveBeenCalledWith(expectedDir, { recursive: true });
    expect(copyFile).toHaveBeenCalledWith(
      path.join(mockCwd, '.env'),
      expectedPath,
    );
    expect(result).toBe(expectedPath);
    dateNowSpy.mockRestore();
  });

  it('should throw error when directory creation fails', async () => {
    const mockError = new Error('EACCES: permission denied');
    vi.mocked(mkdir).mockRejectedValue(mockError);
    vi.mocked(access).mockRejectedValue(mockError);

    await expect(backupEnvFile()).rejects.toThrow('EACCES: permission denied');
  });

  it('should return null when .env file does not exist', async () => {
    const enoentError = Object.assign(new Error('File not found'), {
      code: 'ENOENT',
    });

    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockRejectedValue(enoentError);

    const result = await backupEnvFile();

    expect(result).toBeNull();
    expect(copyFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No .env file found'),
    );
  });

  it('should throw when access fails with non-ENOENT error', async () => {
    const error = Object.assign(new Error('Permission denied'), {
      code: 'EACCES',
    });

    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockRejectedValue(error);

    await expect(backupEnvFile()).rejects.toThrow('Failed to backup .env file');
  });

  it('should throw errors when the file copy fails', async () => {
    vi.mocked(copyFile).mockRejectedValue(
      new Error('EACCES: permission denied'),
    );

    await expect(backupEnvFile()).rejects.toThrow('EACCES: permission denied');
  });
});

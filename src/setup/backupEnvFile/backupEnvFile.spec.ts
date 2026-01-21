import path from 'path';
import inquirer from 'inquirer';
import { mkdir, copyFile, access } from 'fs/promises';
import { backupEnvFile } from './backupEnvFile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs/promises');
vi.mock('inquirer');

describe('backupEnvFile', () => {
  const mockCwd = '/test/path';
  const originalCwd = process.cwd;

  beforeEach(() => {
    vi.clearAllMocks();
    process.cwd = vi.fn(() => mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.cwd = originalCwd;
    vi.restoreAllMocks();
  });

  it('should create backup when user confirms', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockEpochMs = 1234567890000;
    const mockEpochSec = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);
    const expectedPath = path.join(mockCwd, '.backup', `.env.${mockEpochSec}`);

    const result = await backupEnvFile();

    expect(mkdir).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });
    expect(copyFile).toHaveBeenCalledWith(
      path.join(mockCwd, '.env'),
      path.join(mockCwd, '.backup', `.env.${mockEpochSec}`),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`.env.${mockEpochSec}`),
    );
    expect(result).toBe(expectedPath);
  });

  it('should not create backup when user declines', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: false });

    const result = await backupEnvFile();

    expect(mkdir).not.toHaveBeenCalled();
    expect(copyFile).not.toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('should ensure .backup directory exists when backing up', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockEpochMs = 1234567890000;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    const result = await backupEnvFile();

    expect(mkdir).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });
    expect(result).not.toBeNull();
  });

  it('should handle missing .env file gracefully', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockResolvedValue(undefined);
    const enoentError = Object.assign(new Error('File not found'), {
      code: 'ENOENT',
    });
    vi.mocked(access).mockRejectedValue(enoentError);

    const result = await backupEnvFile();

    expect(copyFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No .env file found'),
    );
    expect(result).toBe(null);
  });

  it('should throw error when directory creation fails', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockRejectedValue(new Error('Permission denied'));
    vi.spyOn(Date, 'now').mockReturnValue(1234567890000);

    await expect(backupEnvFile()).rejects.toThrow(
      'Failed to backup .env file: Permission denied',
    );
  });

  it('should throw error when file copy fails', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockRejectedValue(new Error('Disk full'));
    vi.spyOn(Date, 'now').mockReturnValue(1234567890000);

    await expect(backupEnvFile()).rejects.toThrow(
      'Failed to backup .env file: Disk full',
    );
  });

  it('should use correct epoch timestamp format', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(access).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockEpochMs = 1609459200000;
    const mockEpochSec = 1609459200;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    const result = await backupEnvFile();

    expect(copyFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(`.env.${mockEpochSec}`),
    );
    expect(result).toContain(`.env.${mockEpochSec}`);
  });
});

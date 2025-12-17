import path from 'path';
import inquirer from 'inquirer';
import { backupEnvFile } from './backupEnvFile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Use vi.hoisted to create mock functions that are available when vi.mock is hoisted
const { mockMkdir, mockCopyFile, mockAccess } = vi.hoisted(() => ({
  mockMkdir: vi.fn(),
  mockCopyFile: vi.fn(),
  mockAccess: vi.fn(),
}));

vi.mock('fs/promises', () => {
  const mock = {
    mkdir: (...args: unknown[]) => mockMkdir(...args),
    copyFile: (...args: unknown[]) => mockCopyFile(...args),
    access: (...args: unknown[]) => mockAccess(...args),
  };
  return {
    ...mock,
    default: mock,
  };
});

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
    mockMkdir.mockResolvedValue(undefined);
    mockAccess.mockResolvedValue(undefined);
    mockCopyFile.mockResolvedValue(undefined);

    const mockEpochMs = 1234567890000;
    const mockEpochSec = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    await backupEnvFile();

    expect(mockMkdir).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });
    expect(mockCopyFile).toHaveBeenCalledWith(
      path.join(mockCwd, '.env'),
      path.join(mockCwd, '.backup', `.env.${mockEpochSec}`),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`.env.${mockEpochSec}`),
    );
  });

  it('should not create backup when user declines', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: false });

    await backupEnvFile();

    expect(mockMkdir).not.toHaveBeenCalled();
    expect(mockCopyFile).not.toHaveBeenCalled();
  });

  it('should ensure .backup directory exists when backing up', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    mockMkdir.mockResolvedValue(undefined);
    mockAccess.mockResolvedValue(undefined);
    mockCopyFile.mockResolvedValue(undefined);

    const mockEpochMs = 1234567890000;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    await backupEnvFile();

    expect(mockMkdir).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });
  });

  it('should handle missing .env file gracefully', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    mockMkdir.mockResolvedValue(undefined);
    const enoentError = Object.assign(new Error('File not found'), {
      code: 'ENOENT',
    });
    mockAccess.mockRejectedValue(enoentError);

    await backupEnvFile();

    expect(mockCopyFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No .env file found'),
    );
  });

  it('should throw error when directory creation fails', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    mockMkdir.mockRejectedValue(new Error('Permission denied'));
    vi.spyOn(Date, 'now').mockReturnValue(1234567890000);

    await expect(backupEnvFile()).rejects.toThrow(
      'Failed to backup .env file: Permission denied',
    );
  });

  it('should throw error when file copy fails', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    mockMkdir.mockResolvedValue(undefined);
    mockAccess.mockResolvedValue(undefined);
    mockCopyFile.mockRejectedValue(new Error('Disk full'));
    vi.spyOn(Date, 'now').mockReturnValue(1234567890000);

    await expect(backupEnvFile()).rejects.toThrow(
      'Failed to backup .env file: Disk full',
    );
  });

  it('should use correct epoch timestamp format', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    mockMkdir.mockResolvedValue(undefined);
    mockAccess.mockResolvedValue(undefined);
    mockCopyFile.mockResolvedValue(undefined);

    const mockEpochMs = 1609459200000;
    const mockEpochSec = 1609459200;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpochMs);

    await backupEnvFile();

    expect(mockCopyFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(`.env.${mockEpochSec}`),
    );
  });
});

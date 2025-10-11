import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { backupEnvFile } from './backupEnvFile';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs');
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
    vi.mocked(fs.existsSync).mockReturnValue(true); // Both .backup dir and .env exist
    vi.mocked(fs.copyFileSync).mockReturnValue(undefined);

    const mockEpoch = 1234567890;
    vi.spyOn(Date, 'now').mockReturnValue(mockEpoch * 1000);

    await backupEnvFile();

    // Should NOT call mkdirSync since directory already exists
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).toHaveBeenCalledWith(
      path.join(mockCwd, '.env'),
      path.join(mockCwd, '.backup', `.env.${mockEpoch}`),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(`.env.${mockEpoch}`),
    );
  });

  it('should not create backup when user declines', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: false });

    await backupEnvFile();

    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });

  it('should create .backup directory if it does not exist', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(fs.existsSync)
      .mockReturnValueOnce(false) // .backup dir doesn't exist
      .mockReturnValueOnce(true); // .env file exists
    vi.mocked(fs.mkdirSync).mockReturnValue(undefined);
    vi.mocked(fs.copyFileSync).mockReturnValue(undefined);

    await backupEnvFile();

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(mockCwd, '.backup'), {
      recursive: true,
    });
  });

  it('should handle missing .env file gracefully', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(fs.existsSync)
      .mockReturnValueOnce(true) // .backup dir exists
      .mockReturnValueOnce(false); // .env file doesn't exist

    await backupEnvFile();

    expect(fs.copyFileSync).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('No .env file found'),
    );
  });

  it('should throw error when backup fails', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.copyFileSync).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    await expect(backupEnvFile()).rejects.toThrow(
      'Failed to backup .env file: Permission denied',
    );
  });

  it('should use correct epoch timestamp format', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({ shouldBackup: true });
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.copyFileSync).mockReturnValue(undefined);

    const mockEpoch = 1609459200; // 2021-01-01 00:00:00 UTC
    vi.spyOn(Date, 'now').mockReturnValue(mockEpoch * 1000);

    await backupEnvFile();

    expect(fs.copyFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(`.env.${mockEpoch}`),
    );
  });
});

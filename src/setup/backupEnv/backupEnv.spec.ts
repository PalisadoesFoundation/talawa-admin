import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { backupEnv } from './backupEnv';

/**
 * This file contains unit tests for the `backupEnv` function.
 *
 * The tests cover:
 * - Behavior when the `.env` file does not exist.
 * - Proper creation of the `.backup` directory (if missing).
 * - Correct copying of the `.env` file to the `.backup` directory with an epoch-based filename.
 *
 * These tests utilize Vitest for test execution and mock the `fs` module to simulate file operations.
 */

// Mock the fs module so we can simulate file system operations
vi.mock('fs');

describe('backupEnv', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should skip backup if .env does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      const pathString = filePath.toString();

      return !pathString.includes('.env');
    });

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    backupEnv();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'No existing .env file found. Skipping backup.',
    );

    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.copyFileSync).not.toHaveBeenCalled();
  });

  it('should create the .backup directory if it does not exist and copy the .env file', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      const pathString = filePath.toString();
      if (pathString.includes('.env')) {
        return true;
      }
      if (pathString.includes('.backup')) {
        return false;
      }
      return false;
    });

    const mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
      return undefined;
    });
    const copyFileSyncSpy = vi
      .spyOn(fs, 'copyFileSync')
      .mockImplementation(() => {});

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    backupEnv();

    expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);

    expect(copyFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(copyFileSyncSpy).toHaveBeenCalledWith(
      '.env',
      expect.stringContaining('.backup/.env.'),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Backup created:'),
    );
  });

  it('should not recreate the .backup directory if it already exists', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath: fs.PathLike) => {
      const pathString = filePath.toString();
      return pathString.includes('.env') || pathString.includes('.backup');
    });

    const mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync');
    const copyFileSyncSpy = vi
      .spyOn(fs, 'copyFileSync')
      .mockImplementation(() => {});

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    backupEnv();

    expect(mkdirSyncSpy).not.toHaveBeenCalled();

    expect(copyFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(copyFileSyncSpy).toHaveBeenCalledWith(
      '.env',
      expect.stringContaining('.backup/.env.'),
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Backup created:'),
    );
  });
});

import { vi } from 'vitest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

vi.mock('node:fs/promises');

import path from 'path';
import { mkdir, copyFile } from 'node:fs/promises';
import { backupEnvFile } from './backupEnvFile';

describe('backupEnvFile', () => {
  const mockCwd = '/test/path';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('creates a backup directory and copies the .env file', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const result = await backupEnvFile();

    const expectedBackupDir = path.join(mockCwd, '.backup');
    const expectedBackupPath = path.join(
      expectedBackupDir,
      '.env-backup-2023-01-01T12-00-00-000Z',
    );

    expect(mkdir).toHaveBeenCalledWith(expectedBackupDir, {
      recursive: true,
    });

    expect(copyFile).toHaveBeenCalledWith('.env', expectedBackupPath);

    expect(result).toBe(expectedBackupPath);
  });

  it('uses ISO timestamp format with ":" and "." replaced', async () => {
    vi.mocked(mkdir).mockResolvedValue(undefined);
    vi.mocked(copyFile).mockResolvedValue(undefined);

    const mockTime = '2023-10-27T14:30:05.123Z';
    vi.setSystemTime(new Date(mockTime));

    const result = await backupEnvFile();

    const expectedTimestamp = '2023-10-27T14-30-05-123Z';

    expect(result).toContain(`.env-backup-${expectedTimestamp}`);
    expect(copyFile).toHaveBeenCalledWith(
      '.env',
      expect.stringContaining(`.env-backup-${expectedTimestamp}`),
    );
  });
});

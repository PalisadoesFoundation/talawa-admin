import fs from 'fs';
import { checkEnvFile } from './checkEnvFile';
import { vi } from 'vitest';

vi.mock('fs');

describe('checkEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if .env file already exists', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env';
    });

    const result = checkEnvFile();

    expect(result).toBe(true);
  });

  it('should create .env if it does not exist but .env.example exists', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env.example';
    });

    const writeFileSyncMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    const result = checkEnvFile();

    expect(writeFileSyncMock).toHaveBeenCalledWith('.env', '', 'utf8');
    expect(result).toBe(true);
  });

  it('should return false and log an error if .env and .env.example do not exist', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false);
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = checkEnvFile();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Setup requires .env.example to proceed.\n',
    );
    expect(result).toBe(false);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});

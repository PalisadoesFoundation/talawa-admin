import fs from 'fs';
import { checkEnvFile, modifyEnvFile } from './checkEnvFile';
import { vi } from 'vitest';

/**
 * This file contains unit tests for the `modifyEnvFile` function.
 *
 * The tests cover:
 * - Behavior when the `.env` file is missing required keys and appending them appropriately.
 * - Ensuring no changes are made when all keys are present in the `.env` file.
 *
 * These tests utilize Vitest for test execution and mock the `fs` module to simulate file operations.
 */

vi.mock('fs');

describe('modifyEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should append missing keys to the .env file', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const envExampleContent =
      'EXISTING_KEY=existing_value\nNEW_KEY=default_value\n';

    vi.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(envContent)
      .mockReturnValueOnce(envExampleContent)
      .mockReturnValueOnce(envExampleContent);

    vi.spyOn(fs, 'appendFileSync');

    modifyEnvFile();

    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '.env',
      'NEW_KEY=default_value\n',
    );
  });

  it('should not append anything if all keys are present', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const envExampleContent = 'EXISTING_KEY=existing_value\n';

    vi.spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(envContent)
      .mockReturnValueOnce(envExampleContent);

    vi.spyOn(fs, 'appendFileSync');

    modifyEnvFile();

    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });
});

describe('checkEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return true if .env file already exists', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((file) => file === '.env');

    const result = checkEnvFile();

    expect(result).toBe(true);
  });

  it('should create .env if it does not exist but .env.example exists', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(
      (file) => file === '.env.example',
    );

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

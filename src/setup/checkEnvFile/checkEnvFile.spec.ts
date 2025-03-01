import fs from 'fs';
import dotenv from 'dotenv';
import { checkEnvFile } from './checkEnvFile';
import { vi, describe, it, expect, beforeEach } from 'vitest';

/**
 * This file contains unit tests for the `checkEnvFile` function.
 *
 * The tests cover:
 * - Behavior when the `.env` file is missing required keys and appending them appropriately.
 * - Ensuring no changes are made when all keys are present in the `.env` file.
 *
 * These tests utilize Vitest for test execution and mock the `fs` module to simulate file operations.
 */

vi.mock('fs');
vi.mock('dotenv');

describe('checkEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(dotenv.config).mockImplementation(() => ({ parsed: {} }));
  });

  it('should create a new .env file from the .env.example file if the .env file is missing', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const copyFileSyncMock = vi
      .mocked(fs.copyFileSync)
      .mockImplementation(() => undefined);

    vi.mocked(fs.readFileSync).mockImplementation(() => {
      return Buffer.from('KEY=value');
    });

    vi.mocked(dotenv.parse).mockReturnValue({ KEY: 'value' });

    checkEnvFile();

    expect(copyFileSyncMock).toHaveBeenCalledWith('.env.example', '.env');
  });

  it('should append missing keys to the .env file', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const envContent = { EXISTING_KEY: 'existing_value' };
    const envExampleContent = {
      EXISTING_KEY: 'existing_value',
      NEW_KEY: 'default_value',
    };

    vi.mocked(fs.readFileSync).mockImplementation((path) => {
      if (String(path) === '.env') {
        return Buffer.from('EXISTING_KEY=existing_value\n');
      } else if (String(path) === '.env.example') {
        return Buffer.from(
          'EXISTING_KEY=existing_value\nNEW_KEY=default_value\n',
        );
      }
      return Buffer.from('');
    });

    const parseMock = vi.mocked(dotenv.parse);
    parseMock.mockImplementationOnce(() => envContent); // First call for .env
    parseMock.mockImplementationOnce(() => envExampleContent); // Second call for .env.example
    parseMock.mockImplementationOnce(() => envExampleContent); // Third call for .env.example again

    const appendFileSyncMock = vi
      .mocked(fs.appendFileSync)
      .mockImplementation(() => undefined);

    checkEnvFile();

    expect(appendFileSyncMock).toHaveBeenCalledWith(
      '.env',
      'NEW_KEY=default_value\n',
    );
  });

  it('should not append anything if all keys are present', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    vi.mocked(fs.readFileSync).mockImplementation(() => {
      return Buffer.from('EXISTING_KEY=existing_value\n');
    });

    vi.mocked(dotenv.parse).mockReturnValue({ EXISTING_KEY: 'existing_value' });

    const appendFileSyncMock = vi
      .mocked(fs.appendFileSync)
      .mockImplementation(() => undefined);

    checkEnvFile();

    expect(appendFileSyncMock).not.toHaveBeenCalled();
  });

  it('should append multiple missing keys to the .env file', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    const envContent = { EXISTING_KEY: 'existing_value' };
    const envExampleContent = {
      EXISTING_KEY: 'existing_value',
      NEW_KEY1: 'default_value1',
      NEW_KEY2: 'default_value2',
    };

    vi.mocked(fs.readFileSync).mockImplementation((path) => {
      if (String(path) === '.env') {
        return Buffer.from('EXISTING_KEY=existing_value\n');
      } else if (String(path) === '.env.example') {
        return Buffer.from(
          'EXISTING_KEY=existing_value\nNEW_KEY1=default_value1\nNEW_KEY2=default_value2\n',
        );
      }
      return Buffer.from('');
    });

    const parseMock = vi.mocked(dotenv.parse);
    parseMock.mockImplementationOnce(() => envContent); // First call for .env
    parseMock.mockImplementationOnce(() => envExampleContent); // Second call for .env.example
    parseMock.mockImplementationOnce(() => envExampleContent); // Third call for .env.example again

    const appendFileSyncMock = vi
      .mocked(fs.appendFileSync)
      .mockImplementation(() => undefined);

    checkEnvFile();

    expect(appendFileSyncMock).toHaveBeenCalledTimes(2);
    expect(appendFileSyncMock).toHaveBeenCalledWith(
      '.env',
      'NEW_KEY1=default_value1\n',
    );
    expect(appendFileSyncMock).toHaveBeenCalledWith(
      '.env',
      'NEW_KEY2=default_value2\n',
    );
  });
});

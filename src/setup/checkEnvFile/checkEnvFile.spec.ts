import fs from 'fs';
import { checkEnvFile } from './checkEnvFile';
import { vi } from 'vitest';

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

describe('checkEnvFile', () => {
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

    checkEnvFile();

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

    checkEnvFile();

    expect(fs.appendFileSync).not.toHaveBeenCalled();
  });
});

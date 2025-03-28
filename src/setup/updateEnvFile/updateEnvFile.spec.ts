import fs from 'fs';
import updateEnvFile from './updateEnvFile';
import { vi, describe, it, expect, beforeEach } from 'vitest';

/**
 * Unit tests for the `updateEnvFile` function.
 *
 * These tests verify:
 * - Updating an existing key in the `.env` file.
 * - Appending a new key if it does not exist in the `.env` file.
 * - Handling an empty `.env` file.
 */

vi.mock('fs');

describe('updateEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should update an existing key in the .env file', () => {
    const envContent = 'EXISTING_KEY=old_value\nANOTHER_KEY=another_value\n';
    const updatedEnvContent =
      'EXISTING_KEY=new_value\nANOTHER_KEY=another_value\n';

    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi.spyOn(fs, 'writeFileSync');

    updateEnvFile('EXISTING_KEY', 'new_value');

    // Verify that the updated content is written to the file
    expect(writeMock).toHaveBeenCalledWith('.env', updatedEnvContent, 'utf8');
  });

  it('should append a new key if it does not exist in the .env file', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const newKey = 'NEW_KEY=new_value';

    // Mock file system read and append operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const appendMock = vi.spyOn(fs, 'appendFileSync');

    updateEnvFile('NEW_KEY', 'new_value');

    // Verify that the new key is appended to the file
    expect(appendMock).toHaveBeenCalledWith('.env', `\n${newKey}`, 'utf8');
  });

  it('should handle an empty .env file and append the new key', () => {
    const envContent = '';
    const newKey = 'NEW_KEY=new_value';

    // Mock file system read and append operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const appendMock = vi.spyOn(fs, 'appendFileSync');

    updateEnvFile('NEW_KEY', 'new_value');

    // Verify that the new key is appended to the file
    expect(appendMock).toHaveBeenCalledWith('.env', `\n${newKey}`, 'utf8');
  });

  it('should correctly handle keys with special characters', () => {
    const envContent = 'EXISTING_KEY=old_value\n';
    const updatedEnvContent = 'EXISTING_KEY=value_with=special_characters\n';

    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi.spyOn(fs, 'writeFileSync');

    updateEnvFile('EXISTING_KEY', 'value_with=special_characters');

    // Verify that the updated content is written to the file
    expect(writeMock).toHaveBeenCalledWith('.env', updatedEnvContent, 'utf8');
  });

  it('should log an error when file system operations fail', () => {
    // Use existing console.error spy for verification
    const consoleErrorSpy = vi.spyOn(console, 'error');
    // Mock readFileSync to throw an error
    vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('Simulated file system error');
    });
    // This call should trigger the catch block and log the error
    updateEnvFile('TEST_KEY', 'test_value');
    // Verify that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating the .env file:',
      expect.any(Error),
    );
  });

  it('should handle file system errors during append operation', () => {
    // Mock readFileSync to throw ENOENT error
    vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      const error = new Error(
        'ENOENT: no such file or directory',
      ) as NodeJS.ErrnoException;
      error.code = 'ENOENT';
      throw error;
    });

    // Mock appendFileSync to throw error
    vi.spyOn(fs, 'appendFileSync').mockImplementationOnce(() => {
      throw new Error('Failed to append');
    });

    // Call the function
    updateEnvFile('TEST_KEY', 'test_value');

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Error updating the .env file:',
      expect.any(Error),
    );
  });
});

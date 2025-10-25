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
    // Ensure .env is considered present by default in these tests
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
  });

  it('should update an existing key in the .env file', () => {
    const envContent = 'EXISTING_KEY=old_value\nANOTHER_KEY=another_value\n';
    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('EXISTING_KEY', 'new_value');

    // Verify that the updated content is written to the file and contains both keys
    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written).toContain('EXISTING_KEY=new_value');
    expect(written).toContain('ANOTHER_KEY=another_value');
    // Ensure the key occurs only once
    const occurrences = (written.match(/EXISTING_KEY=/g) || []).length;
    expect(occurrences).toBe(1);
  });

  it('should append a new key if it does not exist in the .env file', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('NEW_KEY', 'new_value');

    // Verify that the new key is present in the written file
    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written.trim().endsWith('NEW_KEY=new_value')).toBeTruthy();
  });

  it('should handle an empty .env file and append the new key', () => {
    const envContent = '';
    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('NEW_KEY', 'new_value');

    // Verify that the new key is present in the written file
    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written.trim()).toBe('NEW_KEY=new_value');
  });

  it('should correctly handle keys with special characters', () => {
    const envContent = 'EXISTING_KEY=old_value\n';
    // Mock file system read and write operations
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('EXISTING_KEY', 'value_with=special_characters');

    // Verify that the updated content is written to the file and contains the value
    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written).toContain('EXISTING_KEY=value_with=special_characters');
  });

  it('should log an error when file system operations fail', () => {
    // Use existing console.error spy for verification
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    // Mock readFileSync to throw an error
    vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      throw new Error('Simulated file system error');
    });

    // The function should rethrow; assert that it throws and logged
    expect(() => updateEnvFile('TEST_KEY', 'test_value')).toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating the .env file:',
      expect.any(Error),
    );
  });

  it('should handle file system errors during append operation', () => {
    // Mock readFileSync to throw ENOENT error
    vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
      const error = new Error('ENOENT: no such file or directory');
      (error as { code?: string }).code = 'ENOENT';
      throw error;
    });

    // Mock appendFileSync to throw error
    vi.spyOn(fs, 'appendFileSync').mockImplementationOnce(() => {
      throw new Error('Failed to append');
    });

    // Call the function and expect it to throw and log
    expect(() => updateEnvFile('TEST_KEY', 'test_value')).toThrow();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating the .env file:',
      expect.any(Error),
    );
  });

  it('should reject invalid keys with regex special characters', () => {
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('A=1\n');

    expect(() => updateEnvFile('KEY.TEST', 'v')).toThrow(
      /Invalid env key: KEY.TEST/,
    );
    expect(() => updateEnvFile('KEY*', 'v')).toThrow(/Invalid env key: KEY\*/);
    expect(() => updateEnvFile('KEY[1]', 'v')).toThrow(
      /Invalid env key: KEY\[1\]/,
    );
  });

  it('should handle files without trailing newline', () => {
    const envContent = 'A=1'; // no trailing newline
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('B', '2');

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written).toContain('A=1');
    expect(written).toContain('B=2');
    // Ensure file ends with newline
    expect(/\r?\n$/.test(written)).toBeTruthy();
  });

  it('should correctly update keys at beginning and end of file', () => {
    const envContent = 'KEY_START=1\nMIDDLE=2\nKEY_END=3';
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('KEY_END', 'updated');

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written).toContain('KEY_START=1');
    expect(written).toContain('MIDDLE=2');
    expect(written).toContain('KEY_END=updated');
    // KEY_END should appear only once
    const occurrences = (written.match(/KEY_END=/g) || []).length;
    expect(occurrences).toBe(1);
  });

  it('should collapse multiple consecutive blank lines', () => {
    const envContent = 'A=1\n\n\n\nB=2\n\n\n';
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('C', '3');

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    // Should not have 3 or more consecutive newlines
    expect(/(\r?\n){3,}/.test(written)).toBeFalsy();
  });
});

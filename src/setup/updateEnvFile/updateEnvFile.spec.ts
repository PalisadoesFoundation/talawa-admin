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

  it('should not throw errors when .env file does not exist and create the file with the key', () => {
    const newKey = 'NEW_KEY=new_value';

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
});

import fs from 'fs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import updateEnvFile from './updateEnvFile';

vi.mock('fs');

describe('updateEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a new .env file if it does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');

    updateEnvFile('PORT', '3000');

    expect(writeFileMock).toHaveBeenCalled();
    const lastCall = writeFileMock.mock.calls.at(-1);
    expect(lastCall).toBeTruthy();
    const writtenContent = lastCall ? lastCall[1] : '';
    expect(writtenContent).toContain('PORT=3000');
    expect(writtenContent).toContain(
      '# Frontend port number to run the app on.',
    );
  });

  it('should remove all contiguous comment blocks when updating a key', () => {
    const envContent = `
# Frontend port number to run the app on.

# Frontend port number to run the app on.

# Frontend port number to run the app on.
PORT=3000
`;
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('PORT', '4321');

    const written = writeFileMock.mock.calls[0][1];
    // Should have exactly ONE comment line for PORT
    const commentCount = (
      String(written).match(/# Frontend port number/g) || []
    ).length;
    expect(commentCount).toBe(1);
    expect(written).toContain('PORT=4321');
  });

  it('should update an existing key in the .env file (remove old value even if commented)', () => {
    const envContent = `
# PORT=1234
PORT=8080
ANOTHER_KEY=VALUE
`;
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('PORT', '9000');

    const written = writeFileMock.mock.calls[0][1];
    expect(written).toContain('PORT=9000');
    expect(written).toContain('# Frontend port number to run the app on.');
    expect(written).not.toMatch(/8080/);
  });

  it('should append new key with description if not present', () => {
    const envContent = 'EXISTING_KEY=123\n';
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('REACT_APP_TALAWA_URL', 'http://localhost/graphql');

    const written = writeFileMock.mock.calls[0][1];
    expect(written).toContain('REACT_APP_TALAWA_URL=http://localhost/graphql');
    expect(written).toContain('# GraphQL endpoint for the Talawa backend.');
  });

  it('should handle keys not in PARAM_DESCRIPTIONS', () => {
    const envContent = 'EXISTING_KEY=value\n';
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('UNKNOWN_KEY', 'some_value');

    const written = writeFileMock.mock.calls[0][1];
    expect(written).toContain('# No description available.');
    expect(written).toContain('UNKNOWN_KEY=some_value');
  });

  it('should handle empty value correctly', () => {
    const envContent = 'EXISTING_KEY=1\n';
    vi.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
    const writeFileMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    updateEnvFile('ALLOW_LOGS', '');

    const written = writeFileMock.mock.calls[0][1];
    expect(written).toContain('ALLOW_LOGS=');
  });

  it('should log an error if fs operations throw', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    vi.spyOn(fs, 'existsSync').mockImplementationOnce(() => {
      throw new Error('boom');
    });

    updateEnvFile('PORT', '4000');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating the .env file:',
      expect.any(Error),
    );
  });
});

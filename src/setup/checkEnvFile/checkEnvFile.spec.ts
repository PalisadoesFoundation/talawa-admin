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
    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env';
    });
    vi.spyOn(fs, 'readFileSync')
      // .env
      .mockReturnValueOnce(envContent)
      // .env.example
      .mockReturnValueOnce(envExampleContent);

    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    modifyEnvFile();

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    // Should preserve existing value and include the missing key with an empty value
    expect(written).toContain('EXISTING_KEY=existing_value');
    expect(written).toContain('NEW_KEY=');
  });

  it('should not append anything if all keys are present', () => {
    const envContent = 'EXISTING_KEY=existing_value\n';
    const envExampleContent = 'EXISTING_KEY=existing_value\n';
    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env';
    });
    vi.spyOn(fs, 'readFileSync')
      // .env
      .mockReturnValueOnce(envContent)
      // .env.example
      .mockReturnValueOnce(envExampleContent);

    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    modifyEnvFile();

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    // The existing key should be present and preserved once
    const occurrences = (written.match(/EXISTING_KEY=/g) || []).length;
    expect(occurrences).toBe(1);
  });

  it('should use preferred order and concise descriptions when rebuilding .env', () => {
    const envContent = 'REACT_APP_TALAWA_URL=https://api.local\n';
    const envExampleContent = `# Talawa URL
REACT_APP_TALAWA_URL=
# Docker URL for internal calls
REACT_APP_DOCKER_TALAWA_URL=
    `;

    // existsSync true for .env and .env.example
    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env' || file === '.env.example';
    });

    // readFileSync called for .env then .env.example
    vi.spyOn(fs, 'readFileSync')
      // .env
      .mockReturnValueOnce(envContent)
      // .env.example
      .mockReturnValueOnce(envExampleContent);

    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    modifyEnvFile();

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;

    // Preferred key should appear and keep existing value
    expect(written).toContain('REACT_APP_TALAWA_URL=https://api.local');
    // Docker key should be present and the concise description from code should be used
    expect(written).toContain('REACT_APP_DOCKER_TALAWA_URL=');
    expect(written).toContain('# Talawa API URL to use from inside Docker');
  });

  it('should use example comments when conciseDescriptions entry is missing', () => {
    const envContent = '';
    const envExampleContent = `# Example comment for SOME_KEY
SOME_KEY=
`;

    vi.spyOn(fs, 'existsSync').mockImplementation((file: fs.PathLike) => {
      return file === '.env' || file === '.env.example';
    });

    vi.spyOn(fs, 'readFileSync')
      // .env
      .mockReturnValueOnce(envContent)
      // .env.example
      .mockReturnValueOnce(envExampleContent);

    const writeMock = vi
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    modifyEnvFile();

    expect(writeMock).toHaveBeenCalled();
    const written = writeMock.mock.calls[0][1] as string;
    expect(written).toContain('# Example comment for SOME_KEY');
    expect(written).toContain('SOME_KEY=');
  });
});

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

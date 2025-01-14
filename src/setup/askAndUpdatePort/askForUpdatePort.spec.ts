import { describe, it, expect, vi } from 'vitest';
import askAndUpdatePort from './askAndUpdatePort';
import { askForCustomPort } from 'setup/askForCustomPort/askForCustomPort';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import inquirer from 'inquirer';

vi.mock('setup/askForCustomPort/askForCustomPort');
vi.mock('setup/updateEnvFile/updateEnvFile');
vi.mock('inquirer');

describe('askAndUpdatePort', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should update the port when user confirms and provides a valid port', async () => {
    // Mock user confirmation and valid port
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(3000);

    // Act
    await askAndUpdatePort();

    // Assert
    expect(updateEnvFile).toHaveBeenCalledWith('PORT', '3000');
  });

  it('should not update the port when user declines', async () => {
    // Mock user declining by returning false
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: false,
    });

    // Act
    await askAndUpdatePort();

    // Assert
    expect(updateEnvFile).not.toHaveBeenCalled();
  });

  it('should throw an error for an invalid port', async () => {
    // Mock user confirmation and invalid port
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(800);

    // Act & Assert
    await expect(askAndUpdatePort()).rejects.toThrowError(
      'Port must be between 1024 and 65535',
    );
  });
});

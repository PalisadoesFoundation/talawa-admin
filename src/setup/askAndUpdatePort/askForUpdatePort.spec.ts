import { describe, it, expect, vi } from 'vitest';
import askAndUpdatePort from './askAndUpdatePort';
import { askForCustomPort } from 'setup/askForCustomPort/askForCustomPort';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import * as inquirer from 'inquirer';

// Mock dependencies
vi.mock('inquirer', () => ({
  ...inquirer,
  prompt: vi.fn(),
}));

vi.mock('setup/askForCustomPort/askForCustomPort', () => ({
  askForCustomPort: vi.fn(),
}));

vi.mock('setup/updateEnvFile/updateEnvFile', () => ({
  updateEnvFile: vi.fn(),
}));

describe('askAndUpdatePort', () => {
  it('should update the port when user confirms and provides a valid port', async () => {
    vi.mocked(askForCustomPort).mockResolvedValueOnce(3000);

    // Act
    await askAndUpdatePort();

    // Assert
    expect(updateEnvFile).toHaveBeenCalledWith('PORT', '3000');
  });

  it('should not update the port when user declines', async () => {
    // Act
    await askAndUpdatePort();

    // Assert
    expect(updateEnvFile).not.toHaveBeenCalled();
  });

  it('should throw an error for an invalid port', async () => {
    vi.mocked(askForCustomPort).mockResolvedValueOnce(800); // Invalid port

    // Act & Assert
    await expect(askAndUpdatePort()).rejects.toThrow(
      'Port must be between 1024 and 65535',
    );
  });
});

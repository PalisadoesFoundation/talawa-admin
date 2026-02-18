import { describe, it, expect, vi, afterEach } from 'vitest';
import askAndUpdatePort from './askAndUpdatePort';
import { askForCustomPort } from 'setup/askForCustomPort/askForCustomPort';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import inquirer from 'inquirer';

vi.mock('setup/askForCustomPort/askForCustomPort');
vi.mock('setup/updateEnvFile/updateEnvFile');
// Fix Inquirer mock for v12+
vi.mock('inquirer', async () => {
  const actual = await vi.importActual('inquirer');
  return {
    default: {
      ...actual,
      prompt: vi.fn(),
    },
  };
});

describe('askAndUpdatePort', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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

  it('should update the port to default when user declines', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: false,
    });

    await askAndUpdatePort();

    expect(updateEnvFile).toHaveBeenCalledWith('PORT', '4321');
  });

  it('should throw an error for an invalid port below 1024', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(800);

    await expect(askAndUpdatePort()).rejects.toThrowError(
      'Port must be between 1024 and 65535',
    );
  });

  it('should throw an error for an invalid port above 65535', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(70000);

    await expect(askAndUpdatePort()).rejects.toThrowError(
      'Port must be between 1024 and 65535',
    );
  });
});

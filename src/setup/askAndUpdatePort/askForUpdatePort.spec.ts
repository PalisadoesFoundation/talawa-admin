import { describe, it, expect, vi, afterEach } from 'vitest';
import askAndUpdatePort from './askAndUpdatePort';
import { askForCustomPort } from 'setup/askForCustomPort/askForCustomPort';
import { writeEnvParameter } from 'setup/updateEnvFile/updateEnvFile';
import inquirer from 'inquirer';

vi.mock('setup/askForCustomPort/askForCustomPort');
vi.mock('setup/updateEnvFile/updateEnvFile');
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
    vi.clearAllMocks();
  });

  it('should update the port with comment when user confirms and provides valid port', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(3000);

    await askAndUpdatePort();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'PORT',
      '3000',
      'Port for development server without Docker'
    );
  });

  it('should set default port when user declines custom port', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: false,
    });

    await askAndUpdatePort();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'PORT',
      '4321',
      'Port for development server without Docker'
    );
    expect(askForCustomPort).not.toHaveBeenCalled();
  });

  it('should throw error for port below valid range', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(800);

    await expect(askAndUpdatePort()).rejects.toThrowError(
      'Port must be between 1024 and 65535'
    );
  });

  it('should throw error for port above valid range', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(70000);

    await expect(askAndUpdatePort()).rejects.toThrowError(
      'Port must be between 1024 and 65535'
    );
  });

  it('should accept minimum valid port', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(1024);

    await askAndUpdatePort();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'PORT',
      '1024',
      'Port for development server without Docker'
    );
  });

  it('should accept maximum valid port', async () => {
    vi.mocked(inquirer.prompt).mockResolvedValueOnce({
      shouldSetCustomPortResponse: true,
    });
    vi.mocked(askForCustomPort).mockResolvedValueOnce(65535);

    await askAndUpdatePort();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'PORT',
      '65535',
      'Port for development server without Docker'
    );
  });
});
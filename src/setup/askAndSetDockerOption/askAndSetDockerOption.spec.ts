import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('inquirer', async () => {
  const actual = await vi.importActual('inquirer');
  return {
    default: {
      ...actual,
      prompt: vi.fn(),
    },
  };
});

vi.mock('setup/updateEnvFile/updateEnvFile', () => ({
  default: vi.fn(),
  writeEnvParameter: vi.fn(),
}));

vi.mock('setup/askForDocker/askForDocker', () => ({
  askForDocker: vi.fn(),
}));

import askAndSetDockerOption from './askAndSetDockerOption';
import inquirer from 'inquirer';
import { writeEnvParameter } from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';

describe('askAndSetDockerOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set up Docker with proper comments when user selects yes', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as Mock).mockResolvedValueOnce('8080');

    await askAndSetDockerOption();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'USE_DOCKER',
      'YES',
      'Enable Docker-based deployment'
    );
    expect(writeEnvParameter).toHaveBeenCalledWith(
      'DOCKER_PORT',
      '8080',
      'Port for Docker container'
    );
  });

  it('should set up without Docker and initialize PORT when user selects no', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: false,
    });

    await askAndSetDockerOption();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'USE_DOCKER',
      'NO',
      'Enable Docker-based deployment'
    );
    expect(writeEnvParameter).toHaveBeenCalledWith(
      'PORT',
      '',
      'Port for development server without Docker'
    );
  });

  it('should handle numeric port values', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as Mock).mockResolvedValueOnce(4321);

    await askAndSetDockerOption();

    expect(writeEnvParameter).toHaveBeenCalledWith(
      'DOCKER_PORT',
      '4321',
      'Port for Docker container'
    );
  });

  it('should handle errors when askForDocker fails', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as Mock).mockRejectedValueOnce(new Error('Docker error'));

    await expect(askAndSetDockerOption()).rejects.toThrow('Docker error');
  });

  it('should display Docker setup instructions', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as Mock).mockResolvedValueOnce('3000');

    await askAndSetDockerOption();

    expect(consoleLogSpy).toHaveBeenCalledWith('Setting up with Docker...');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('docker build -t talawa-admin')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('docker run -d -p 3000:3000')
    );
  });

  it('should display non-Docker setup message', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: false,
    });

    await askAndSetDockerOption();

    expect(consoleLogSpy).toHaveBeenCalledWith('Setting up without Docker...');
  });
});
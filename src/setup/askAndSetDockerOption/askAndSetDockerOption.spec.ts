import type { Mock } from 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules
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
}));

vi.mock('setup/askForDocker/askForDocker', () => ({
  askForDocker: vi.fn(),
}));

// Import after mocking
import askAndSetDockerOption from './askAndSetDockerOption';
import inquirer from 'inquirer';
import updateEnvFile from 'setup/updateEnvFile/updateEnvFile';
import { askForDocker } from 'setup/askForDocker/askForDocker';

describe('askAndSetDockerOption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set up Docker in rootless mode when user selects yes', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      dockerMode: 'ROOTLESS',
    });
    (askForDocker as Mock).mockResolvedValueOnce('8080');

    await askAndSetDockerOption();

    expect(updateEnvFile).toHaveBeenCalledWith('USE_DOCKER', 'YES');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_MODE', 'ROOTLESS');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_PORT', '8080');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('rootless'),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('docker/docker-compose.rootless.dev.yaml'),
    );
  });

  it('should set up Docker in rootful mode', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      dockerMode: 'ROOTFUL',
    });
    (askForDocker as Mock).mockResolvedValueOnce('4321');

    await askAndSetDockerOption();

    expect(updateEnvFile).toHaveBeenCalledWith('USE_DOCKER', 'YES');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_MODE', 'ROOTFUL');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_PORT', '4321');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('docker/docker-compose.dev.yaml'),
    );
  });

  it('should set up without Docker when user selects no', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: false,
    });

    await askAndSetDockerOption();

    expect(updateEnvFile).toHaveBeenCalledWith('USE_DOCKER', 'NO');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_MODE', 'ROOTFUL');
  });

  it('should handle errors when askForDocker fails', async () => {
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (inquirer.prompt as unknown as Mock).mockResolvedValueOnce({
      dockerMode: 'ROOTFUL',
    });
    (askForDocker as Mock).mockRejectedValueOnce(new Error('Docker error'));

    await expect(askAndSetDockerOption()).rejects.toThrow('Docker error');
  });
});

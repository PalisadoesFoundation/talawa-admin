import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

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
  });

  it('should set up Docker when user selects yes', async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as jest.Mock).mockResolvedValueOnce(8080);

    await askAndSetDockerOption();

    expect(updateEnvFile).toHaveBeenCalledWith('USE_DOCKER', 'YES');
    expect(updateEnvFile).toHaveBeenCalledWith('DOCKER_PORT', 8080);
  });

  it('should set up without Docker when user selects no', async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({
      useDocker: false,
    });

    await askAndSetDockerOption();

    expect(updateEnvFile).toHaveBeenCalledWith('USE_DOCKER', 'NO');
  });

  it('should handle errors when askForDocker fails', async () => {
    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({
      useDocker: true,
    });
    (askForDocker as jest.Mock).mockRejectedValueOnce(
      new Error('Docker error'),
    );

    await expect(askAndSetDockerOption()).rejects.toThrow('Docker error');
  });
});

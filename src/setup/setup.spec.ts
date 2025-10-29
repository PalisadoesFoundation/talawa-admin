import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { main } from './setup';
import * as utils from './utils';
import * as checkEnvFile from './checkEnvFile/checkEnvFile';
import * as backupEnvFile from './backupEnvFile/backupEnvFile';
import inquirer from 'inquirer';

vi.mock('inquirer');
vi.mock('./utils');
vi.mock('./checkEnvFile/checkEnvFile');
vi.mock('./backupEnvFile/backupEnvFile');

describe('Talawa Admin Setup', () => {
  let processExitSpy: MockInstance;
  let consoleErrorSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as (code?: number) => never);
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(checkEnvFile, 'checkEnvFile').mockReturnValue(true);
    vi.spyOn(backupEnvFile, 'backupEnvFile').mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should setup for non-docker and no recaptcha', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockResolvedValueOnce({ useDocker: false }); // askForDocker
    promptMock.mockResolvedValueOnce({ shouldUseRecaptcha: false }); // askForRecaptcha
    promptMock.mockResolvedValueOnce({ shouldLogErrors: false }); // askForLogErrors

    const updateEnvFileSpy = vi.spyOn(utils, 'updateEnvFile');

    await main();

    expect(updateEnvFileSpy).toHaveBeenCalledWith({
      USE_DOCKER: 'NO',
      PORT: '4321',
      REACT_APP_TALAWA_URL: 'http://localhost:4000/graphql',
      REACT_APP_BACKEND_WEBSOCKET_URL: 'ws://localhost:4000/graphql',
      REACT_APP_USE_RECAPTCHA: 'no',
      ALLOW_LOGS: 'no',
    });
  });

  it('should setup for docker and with recaptcha', async () => {
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockResolvedValueOnce({ useDocker: true }); // askForDocker
    promptMock.mockResolvedValueOnce({ dockerPort: '1234' }); // docker port
    promptMock.mockResolvedValueOnce({ shouldUseRecaptcha: true }); // askForRecaptcha
    promptMock.mockResolvedValueOnce({ recaptchaSiteKeyInput: 'test-key' }); // recaptcha key
    promptMock.mockResolvedValueOnce({ shouldLogErrors: true }); // askForLogErrors

    const updateEnvFileSpy = vi.spyOn(utils, 'updateEnvFile');

    await main();

    expect(updateEnvFileSpy).toHaveBeenCalledWith({
      USE_DOCKER: 'YES',
      DOCKER_PORT: '1234',
      REACT_APP_DOCKER_TALAWA_URL: 'http://host.docker.internal:4000/graphql',
      REACT_APP_DOCKER_BACKEND_WEBSOCKET_URL:
        'ws://host.docker.internal:4000/graphql',
      REACT_APP_USE_RECAPTCHA: 'yes',
      REACT_APP_RECAPTCHA_SITE_KEY: 'test-key',
      ALLOW_LOGS: 'yes',
    });
  });

  it('should exit if checkEnvFile returns false', async () => {
    vi.spyOn(checkEnvFile, 'checkEnvFile').mockReturnValue(false);
    const updateEnvFileSpy = vi.spyOn(utils, 'updateEnvFile');

    await main();

    expect(updateEnvFileSpy).not.toHaveBeenCalled();
  });

  it('should handle errors during setup', async () => {
    const mockError = new Error('Inquirer failed');
    const promptMock = vi.spyOn(inquirer, 'prompt');
    promptMock.mockRejectedValue(mockError);

    await main();

    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Setup failed:', mockError);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});

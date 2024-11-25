import inquirer from 'inquirer';
import { askForDocker } from './askForDocker'; // Adjust the import path if necessary

jest.mock('inquirer');

describe('askForDocker', () => {
  test('should return default docker port if user provides no input for dockerAppPort', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: true,
      dockerAppPort: '4321',
      containerName: 'talawa-admin',
    });

    const result = await askForDocker();
    expect(result.dockerAppPort).toBe('4321');
  });

  test('should return user-provided docker port', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: true,
      dockerAppPort: '8080',
      containerName: 'talawa-admin',
    });

    const result = await askForDocker();
    expect(result.dockerAppPort).toBe('8080');
  });

  test('should return default container name if user provides no input', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: true,
      dockerAppPort: '4321',
      containerName: 'talawa-admin',
    });

    const result = await askForDocker();
    expect(result.containerName).toBe('talawa-admin');
  });

  test('should return user-provided container name', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: true,
      dockerAppPort: '4321',
      containerName: 'my-docker-container',
    });

    const result = await askForDocker();
    expect(result.containerName).toBe('my-docker-container');
  });

  test('should default to useDocker = true', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: true,
      dockerAppPort: '4321',
      containerName: 'talawa-admin',
    });

    const result = await askForDocker();
    expect(result.useDocker).toBe(true);
  });

  test('should return false for useDocker if user selects "no"', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
      useDocker: false,
      dockerAppPort: '4321',
      containerName: 'talawa-admin',
    });

    const result = await askForDocker();
    expect(result.useDocker).toBe(false);
  });
});

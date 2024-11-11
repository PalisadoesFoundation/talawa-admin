import fs from 'fs';
import inquirer from 'inquirer';
import { askForTalawaApiUrl } from './askForTalawaApiUrl';

jest.mock('fs');
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

describe('WebSocket URL Configuration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should convert http URL to ws WebSocket URL', async () => {
    const endpoint = 'http://example.com/graphql';
    const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');

    expect(websocketUrl).toBe('ws://example.com/graphql');
  });

  test('should convert https URL to wss WebSocket URL', async () => {
    const endpoint = 'https://example.com/graphql';
    const websocketUrl = endpoint.replace(/^http(s)?:\/\//, 'ws$1://');

    expect(websocketUrl).toBe('wss://example.com/graphql');
  });

  test('should retain default WebSocket URL if no new endpoint is provided', async () => {
    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ endpoint: 'http://localhost:4000/graphql/' });
    await askForTalawaApiUrl();

    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });
});

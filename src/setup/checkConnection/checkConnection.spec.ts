import { checkConnection } from './checkConnection';
import { vi, describe, beforeEach, it, expect } from 'vitest';
vi.mock('node-fetch');

global.fetch = vi.fn((url) => {
  if (url === 'http://example.com/graphql/') {
    const responseInit: ResponseInit = {
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    return Promise.resolve(new Response(JSON.stringify({}), responseInit));
  } else {
    const errorResponseInit: ResponseInit = {
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers({ 'Content-Type': 'text/plain' }),
    };
    return Promise.reject(new Response('Error', errorResponseInit));
  }
});

describe('checkConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return true and log success message if the connection is successful', async () => {
    vi.spyOn(console, 'log').mockImplementation((string) => string);
    const result = await checkConnection('http://example.com/graphql/');

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      '\nChecking Talawa-API connection....',
    );
    expect(console.log).toHaveBeenCalledWith(
      '\nConnection to Talawa-API successful! 🎉',
    );
  });

  it('should return false and log error message if the connection fails', async () => {
    vi.spyOn(console, 'log').mockImplementation((string) => string);
    const result = await checkConnection(
      'http://example_not_working.com/graphql/',
    );

    expect(result).toBe(false);
    expect(console.log).toHaveBeenCalledWith(
      '\nChecking Talawa-API connection....',
    );
    expect(console.log).toHaveBeenCalledWith(
      '\nTalawa-API service is unavailable. Is it running? Check your network connectivity too.',
    );
  });
});

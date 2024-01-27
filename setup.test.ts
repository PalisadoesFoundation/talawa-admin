//Import necessary packages
import inquirer from 'inquirer';
import {
  checkConnection,
  isValidUrl,
  askForTalawaApiUrl,
  askForCustomPort,
} from './setup.ts'; // replace 'your-file' with the actual file name

// Mock the fetch function globally
global.fetch = jest.fn();

describe('checkConnection', () => {
  it('returns false when the fetch fails', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject('API is down')
    );
    const url = 'http://localhost:4000/graphql/';
    const result = await checkConnection(url);
    expect(result).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('returns true for a valid URL', () => {
    const url = 'http://localhost:4000/graphql/';
    expect(isValidUrl(url)).toBe(true);
  });

  it('returns false for an invalid URL', () => {
    const url = 'not a valid URL';
    expect(isValidUrl(url)).toBe(false);
  });
});

jest.mock('inquirer');

describe('askForTalawaApiUrl', () => {
  it('returns the endpoint entered by the user', async () => {
    const mockEndpoint = 'http://localhost:4000/graphql/';
    (
      inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>
    ).mockResolvedValueOnce({ endpoint: mockEndpoint });
    const endpoint = await askForTalawaApiUrl();
    expect(endpoint).toBe(mockEndpoint);
  });
});

describe('askForCustomPort', () => {
  it('returns the port entered by the user', async () => {
    const mockPort = 4321;
    (
      inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>
    ).mockResolvedValueOnce({ customPort: mockPort });
    const port = await askForCustomPort();
    expect(port).toBe(mockPort);
  });
});

import { describe, it, expect, vi } from 'vitest';
import convertToBase64 from './convertToBase64';

describe('convertToBase64', () => {
  it('should return a base64-encoded string when given a file', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const result = await convertToBase64(file);
    expect(result).toMatch(/^data:text\/plain;base64,[a-zA-Z0-9+/]+={0,2}$/);
  });

  it('should return an empty string when given an invalid file', async () => {
    const file = {} as File;
    const result = await convertToBase64(file);
    expect(result).toBe('');
  });

  it('should handle errors thrown by FileReader', async () => {
    // Arrange
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const mockFileReader = vi
      .spyOn(global, 'FileReader')
      .mockImplementationOnce(() => {
        throw new Error('Test error');
      });

    // Act
    const result = await convertToBase64(file);

    // Assert
    expect(mockFileReader).toHaveBeenCalledTimes(1);
    expect(mockFileReader).toHaveBeenCalledWith();
    expect(result).toBe('');
    mockFileReader.mockRestore();
  });
});

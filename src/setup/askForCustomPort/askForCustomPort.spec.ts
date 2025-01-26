import { describe, it, expect, vi, beforeEach } from 'vitest';
import inquirer from 'inquirer';
import { askForCustomPort, validatePort } from './askForCustomPort';

vi.mock('inquirer');

describe('askForCustomPort', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic port validation', () => {
    it('should return default port if user provides no input', async () => {
      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        customPort: '4321',
      });

      const result = await askForCustomPort();
      expect(result).toBe(4321);
    });

    it('should return user-provided port', async () => {
      vi.spyOn(inquirer, 'prompt').mockResolvedValueOnce({
        customPort: '8080',
      });

      const result = await askForCustomPort();
      expect(result).toBe(8080);
    });

    it('should return validation error if port not between 1 and 65535', () => {
      expect(validatePort('abcd')).toBe(
        'Please enter a valid port number between 1 and 65535.',
      );
      expect(validatePort('-1')).toBe(
        'Please enter a valid port number between 1 and 65535.',
      );
      expect(validatePort('70000')).toBe(
        'Please enter a valid port number between 1 and 65535.',
      );
    });
  });

  describe('retry mechanism', () => {
    it('should handle invalid port input and prompt again', async () => {
      vi.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ customPort: 'abcd' })
        .mockResolvedValueOnce({ customPort: '8080' });

      const result = await askForCustomPort();
      expect(result).toBe(8080);
    });

    it('should return default port after maximum retry attempts', async () => {
      vi.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt1' })
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt2' })
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt3' })
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt4' })
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt5' })
        .mockResolvedValueOnce({ customPort: 'invalid-port-attempt6' });

      const result = await askForCustomPort();
      expect(result).toBe(4321);
    });
  });

  describe('reserved ports', () => {
    it('should return user-provided port after confirming reserved port', async () => {
      vi.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: true });

      const result = await askForCustomPort();
      expect(result).toBe(80);
    });

    it('should re-prompt user for port if reserved port confirmation is denied', async () => {
      vi.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '8080' });

      const result = await askForCustomPort();
      expect(result).toBe(8080);
    });

    it('should return default port if reserved port confirmation is denied after maximum retry attempts', async () => {
      vi.spyOn(inquirer, 'prompt')
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '80' })
        .mockResolvedValueOnce({ confirmPort: false })
        .mockResolvedValueOnce({ customPort: '80' });

      const result = await askForCustomPort();
      expect(result).toBe(4321);
    });
  });
});

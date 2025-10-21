import fs from 'fs';
import updateEnvFile, { writeEnvParameter } from './updateEnvFile';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('fs');

describe('updateEnvFile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('backward compatibility mode (without comment)', () => {
    it('should update an existing key', () => {
      const envContent = 'EXISTING_KEY=old_value\nANOTHER_KEY=another_value\n';
      const updatedEnvContent =
        'EXISTING_KEY=new_value\nANOTHER_KEY=another_value\n';

      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      updateEnvFile('EXISTING_KEY', 'new_value');

      expect(writeMock).toHaveBeenCalledWith('.env', updatedEnvContent, 'utf8');
    });

    it('should append a new key if it does not exist', () => {
      const envContent = 'EXISTING_KEY=existing_value\n';

      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
      const appendMock = vi.spyOn(fs, 'appendFileSync');

      updateEnvFile('NEW_KEY', 'new_value');

      expect(appendMock).toHaveBeenCalledWith('.env', '\nNEW_KEY=new_value', 'utf8');
    });

    it('should handle numeric values', () => {
      const envContent = 'PORT=3000\n';
      const updatedEnvContent = 'PORT=4321\n';

      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(envContent);
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      updateEnvFile('PORT', 4321);

      expect(writeMock).toHaveBeenCalledWith('.env', updatedEnvContent, 'utf8');
    });
  });

  describe('writeEnvParameter with comments', () => {
    it('should write parameter with comment to empty file', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      writeEnvParameter('TEST_KEY', 'test_value', 'Test description');

      expect(writeMock).toHaveBeenCalledWith(
        '.env',
        '# Test description\nTEST_KEY=test_value\n',
        'utf8'
      );
    });

    it('should write parameter with proper spacing to non-empty file', () => {
      const existing = 'EXISTING=value\n';
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(existing);
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      writeEnvParameter('NEW_KEY', 'new_value', 'New description');

      expect(writeMock).toHaveBeenCalledWith(
        '.env',
        'EXISTING=value\n\n# New description\nNEW_KEY=new_value\n',
        'utf8'
      );
    });

    it('should remove duplicate entries before writing', () => {
      const existing = '# Old comment\nTEST_KEY=old_value\nOTHER=value\n';
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce(existing);
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      writeEnvParameter('TEST_KEY', 'new_value', 'New comment');

      const written = writeMock.mock.calls[0][1] as string;
      expect(written).not.toContain('old_value');
      expect(written).toContain('# New comment\nTEST_KEY=new_value');
    });

    it('should handle empty values', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      writeEnvParameter('EMPTY_KEY', '', 'Description for empty value');

      expect(writeMock).toHaveBeenCalledWith(
        '.env',
        '# Description for empty value\nEMPTY_KEY=\n',
        'utf8'
      );
    });

    it('should handle special characters in values', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      writeEnvParameter('URL', 'http://example.com/path?param=value', 'API URL');

      expect(writeMock).toHaveBeenCalledWith(
        '.env',
        '# API URL\nURL=http://example.com/path?param=value\n',
        'utf8'
      );
    });

    it('should handle numeric values with comments', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      const writeMock = vi.spyOn(fs, 'writeFileSync');

      updateEnvFile('PORT', 8080, 'Port number');

      expect(writeMock).toHaveBeenCalledWith(
        '.env',
        '# Port number\nPORT=8080\n',
        'utf8'
      );
    });
  });

  describe('error handling', () => {
    it('should log error when readFileSync fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      vi.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
        throw new Error('Read error');
      });

      updateEnvFile('TEST_KEY', 'test_value');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating the .env file:',
        expect.any(Error)
      );
    });

    it('should throw error when writeEnvParameter fails', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValueOnce('');
      vi.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
        throw new Error('Write error');
      });
      const consoleErrorSpy = vi.spyOn(console, 'error');

      expect(() =>
        writeEnvParameter('KEY', 'value', 'comment')
      ).toThrow('Write error');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
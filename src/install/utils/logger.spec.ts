import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSpinner,
  logError,
  logInfo,
  logStep,
  logSuccess,
  logWarning,
} from './logger';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('logSuccess', () => {
    it('should log success message with checkmark', () => {
      logSuccess('Test message');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Test message');
    });
  });

  describe('logError', () => {
    it('should log error message with X mark', () => {
      logError('Test error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Test error');
    });
  });

  describe('logWarning', () => {
    it('should log warning message with warning symbol', () => {
      logWarning('Test warning');
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️  Test warning');
    });
  });

  describe('logInfo', () => {
    it('should log info message with info symbol', () => {
      logInfo('Test info');
      expect(consoleLogSpy).toHaveBeenCalledWith('ℹ️  Test info');
    });
  });

  describe('logStep', () => {
    it('should log step message with package symbol', () => {
      logStep('Test step');
      expect(consoleLogSpy).toHaveBeenCalledWith('\n📦 Test step');
    });
  });

  describe('createSpinner', () => {
    it('should create a spinner instance', () => {
      const spinner = createSpinner('Loading...');
      expect(spinner).toHaveProperty('start');
      expect(spinner).toHaveProperty('succeed');
      expect(spinner).toHaveProperty('fail');
      expect(spinner).toHaveProperty('stop');
    });

    it('should start spinner and write to stdout', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();

      expect(writeSpy).toHaveBeenCalled();

      spinner.stop();
      writeSpy.mockRestore();
    });

    it('should write initial frame and message when started', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();

      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Loading...'),
      );

      spinner.stop();
      writeSpy.mockRestore();
    });

    it('should set up interval to animate frames', async () => {
      vi.useFakeTimers();
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();

      expect(writeSpy).toHaveBeenCalledWith('⠋ Loading...');

      await vi.advanceTimersByTimeAsync(100);

      expect(writeSpy).toHaveBeenCalledWith('\r');
      expect(writeSpy).toHaveBeenCalledWith('⠙ Loading...');

      await vi.advanceTimersByTimeAsync(100);
      expect(writeSpy).toHaveBeenCalledWith('⠹ Loading...');

      spinner.stop();
      vi.useRealTimers();
      writeSpy.mockRestore();
    });

    it('should succeed spinner and log message', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();
      spinner.succeed('Done!');

      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Done!');

      writeSpy.mockRestore();
    });

    it('should fail spinner and log error', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();
      spinner.fail('Failed!');

      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed!');

      writeSpy.mockRestore();
    });

    it('should stop spinner without logging', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);
      const spinner = createSpinner('Loading...');

      spinner.start();
      spinner.stop();

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      writeSpy.mockRestore();
    });
  });
});

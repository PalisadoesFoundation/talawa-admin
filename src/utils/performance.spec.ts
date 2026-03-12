import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, debounceInput } from 'utils/performance';

describe('performance utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should only call function once for multiple rapid calls', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 300);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      vi.advanceTimersByTime(300);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 300);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should not execute again within wait period', () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 300);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounceInput', () => {
    it('should delay function execution with default wait time', () => {
      const func = vi.fn();
      const debouncedFunc = debounceInput(func);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should delay function execution with custom wait time', () => {
      const func = vi.fn();
      const debouncedFunc = debounceInput(func, 500);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should use trailing: true by default', () => {
      const func = vi.fn();
      const debouncedFunc = debounceInput(func, 300);

      debouncedFunc();
      vi.advanceTimersByTime(150);
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(150);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });
});

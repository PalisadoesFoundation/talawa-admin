import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, debounceInput } from 'utils/performance';

describe('performance utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('debounce basic: calls only once after wait', () => {
    const fn = vi.fn();
    const d = debounce(fn, 50);
    d('a');
    d('b');
    d('c');

    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(49);
    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throttle basic: limits calls within window', () => {
    const fn = vi.fn();
    // Use explicit options to make behavior deterministic
    const t = throttle(fn, 50, { leading: true, trailing: false });

    t('a'); // Called immediately (leading edge)
    t('b'); // Ignored (within 50ms window)
    t('c'); // Ignored (within 50ms window)

    // Leading edge fired on first call
    expect(fn).toHaveBeenCalledTimes(1);

    // Still within throttle window
    vi.advanceTimersByTime(49);
    expect(fn).toHaveBeenCalledTimes(1);

    // Window has passed
    vi.advanceTimersByTime(1);
    t('d'); // Should be called (new window)
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('debounceInput: default wait (300ms) and trailing behaviour', () => {
    const fn = vi.fn();
    const d = debounceInput(fn);
    d('x');

    // default leading should be false -> not called immediately
    expect(fn).toHaveBeenCalledTimes(0);

    // Not called before 300ms
    vi.advanceTimersByTime(299);
    expect(fn).toHaveBeenCalledTimes(0);

    // Called after 300ms
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('debounceInput: custom wait and trailing behaviour', () => {
    const fn = vi.fn();
    const d = debounceInput(fn, 100);
    d('1');
    d('2');

    // not called immediately
    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(99);
    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('debounceInput: cancel() prevents pending invocation', () => {
    const fn = vi.fn();
    const d = debounceInput(fn, 100);

    d('a');
    // cancel the pending invocation
    d.cancel();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it('debounceInput: flush() immediately invokes pending function', () => {
    const fn = vi.fn();
    const d = debounceInput(fn, 100);

    d('b');
    expect(fn).toHaveBeenCalledTimes(0);

    d.flush();
    expect(fn).toHaveBeenCalledTimes(1);

    // ensure no duplicate trailing call after wait
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('debounceInput: respects leading option', () => {
    const fn = vi.fn();
    const d = debounceInput(fn, 100, { leading: true, trailing: false });

    d('first');
    // leading should invoke immediately
    expect(fn).toHaveBeenCalledTimes(1);

    // subsequent calls within wait should not produce trailing calls
    d('second');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('debounceInput: respects maxWait option', () => {
    const fn = vi.fn();
    const d = debounceInput(fn, 50, { maxWait: 100 });

    // continuous calls that keep resetting the wait
    d('a');
    vi.advanceTimersByTime(30);
    d('b');
    vi.advanceTimersByTime(30);
    d('c');

    // total elapsed since first call is 60ms; not yet at maxWait
    expect(fn).toHaveBeenCalledTimes(0);

    // advance to reach maxWait (100ms from first call)
    vi.advanceTimersByTime(40);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.clearAllMocks();
    // keep fake timers active to respect the global setupTests.ts contract
    vi.useFakeTimers();
  });

  it('should delay execution of the callback until after the delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current.debouncedCallback('first-call');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first-call');
  });

  it('should reset the timer when invoked multiple times quickly', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 200));

    act(() => {
      result.current.debouncedCallback('first');
      result.current.debouncedCallback('second');
    });

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should cancel a pending callback execution', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 150));

    act(() => {
      result.current.debouncedCallback('pending');
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});

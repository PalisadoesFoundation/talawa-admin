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

  it('should use the updated delay when delay changes', () => {
    const callback = vi.fn();

    const { result, rerender } = renderHook(
      ({ delay }) => useDebounce(callback, delay),
      { initialProps: { delay: 100 } },
    );

    act(() => {
      result.current.debouncedCallback('value');
    });

    act(() => {
      result.current.cancel();
    });

    rerender({ delay: 300 });

    act(() => {
      result.current.debouncedCallback('updated');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('updated');
  });

  it('should do nothing when cancel is called with no pending timeout and still work afterwards', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    // Cancel immediately (no timeout scheduled)
    act(() => {
      result.current.cancel();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();

    // Ensure debounce still works after above cancel call
    act(() => {
      result.current.debouncedCallback('run-after-cancel');
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('run-after-cancel');
  });
});

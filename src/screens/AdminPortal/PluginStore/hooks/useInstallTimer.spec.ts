import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useInstallTimer } from './useInstallTimer';
import dayjs from 'dayjs';

describe('useInstallTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return 00:00 when not loading', () => {
    const { result } = renderHook(() => useInstallTimer(false));
    expect(result.current).toBe('00:00');
  });

  it('should start the timer when loading becomes true and update the elapsed time', () => {
    const initialProps = { loading: false };
    const { result, rerender } = renderHook(
      ({ loading }) => useInstallTimer(loading),
      { initialProps },
    );

    vi.setSystemTime(new Date(dayjs().add(1, 'year').toISOString()));

    act(() => {
      rerender({ loading: true });
    });

    act(() => {
      vi.advanceTimersByTime(95 * 1000);
    });

    expect(result.current).toBe('01:35');
  });

  it('should stop and reset the timer when loading becomes false', () => {
    const initialProps = { loading: true };
    const { result, rerender } = renderHook(
      ({ loading }) => useInstallTimer(loading),
      { initialProps },
    );

    act(() => {
      vi.advanceTimersByTime(5 * 1000);
    });
    expect(result.current).toBe('00:05');

    act(() => {
      rerender({ loading: false });
    });

    expect(result.current).toBe('00:00');
  });
});

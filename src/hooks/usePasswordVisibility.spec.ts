import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePasswordVisibility } from './usePasswordVisibility';

describe('usePasswordVisibility', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('defaults showPassword to false', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(result.current.showPassword).toBe(false);
  });

  it('respects custom initialVisible value', () => {
    const { result } = renderHook(() => usePasswordVisibility(true));
    expect(result.current.showPassword).toBe(true);
  });

  it('toggles showPassword correctly', () => {
    const { result } = renderHook(() => usePasswordVisibility());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.togglePassword();
    });
    expect(result.current.showPassword).toBe(true);

    act(() => {
      result.current.togglePassword();
    });
    expect(result.current.showPassword).toBe(false);
  });

  it('keeps multiple hook instances isolated', () => {
    const hookA = renderHook(() => usePasswordVisibility());
    const hookB = renderHook(() => usePasswordVisibility(true));

    act(() => {
      hookA.result.current.togglePassword();
    });

    expect(hookA.result.current.showPassword).toBe(true);
    expect(hookB.result.current.showPassword).toBe(true);
  });
});

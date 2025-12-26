import { renderHook, act } from '@testing-library/react';
import { usePasswordVisibility } from '../../hooks/usePasswordVisibility';

describe('usePasswordVisibility', () => {
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

    act(() => {
      result.current.togglePassword();
    });

    expect(result.current.showPassword).toBe(true);
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

import { renderHook, act } from '@testing-library/react';
import { useFieldValidation } from './useFieldValidation';
import type { IValidationResult } from '../types/Auth/useFieldValidation';

describe('useFieldValidation', () => {
  const validValidator = <T>(value: T): IValidationResult => ({
    isValid: value !== null,
  });

  const invalidValidator = <T>(value: T): IValidationResult => ({
    isValid: false,
    error: String(value),
  });

  it('returns null error initially', () => {
    const { result } = renderHook(() =>
      useFieldValidation(validValidator, 'test'),
    );

    expect(result.current.error).toBeNull();
  });

  it('sets error when validation fails', () => {
    const { result } = renderHook(() =>
      useFieldValidation(invalidValidator, 'test'),
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('test');
  });

  it('clears error correctly', () => {
    const { result } = renderHook(() =>
      useFieldValidation(invalidValidator, 'test'),
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('test');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('returns true for valid value', () => {
    const { result } = renderHook(() =>
      useFieldValidation(validValidator, 'test'),
    );

    let isValid = false;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns false for invalid value', () => {
    const { result } = renderHook(() =>
      useFieldValidation(invalidValidator, 'test'),
    );

    let isValid = true;

    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(false);
    expect(result.current.error).toBe('test');
  });
});

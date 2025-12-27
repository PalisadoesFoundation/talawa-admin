import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  afterEach(() => {
    vi.clearAllMocks();
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

  it('uses default error message when validator omits error', () => {
    const noErrorValidator = (): IValidationResult => ({
      isValid: false,
    });

    const { result } = renderHook(() =>
      useFieldValidation(noErrorValidator, 'test'),
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('Invalid value');
  });

  it('handles null values correctly', () => {
    const { result } = renderHook(() =>
      useFieldValidation<string | null>(validValidator, null),
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('Invalid value');
  });
});

import { renderHook, act } from '@testing-library/react';
import { useFieldValidation } from './useFieldValidation';
import type { IValidationResult } from '../types/Auth/useFieldValidation';
import { vi } from 'vitest';

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

  it('validates automatically when trigger is onChange', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useFieldValidation(invalidValidator, value, 'onChange'),
      { initialProps: { value: 'initial' } },
    );

    expect(result.current.error).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current.error).toBe('updated');
  });

  it('does not auto-validate when trigger is onBlur', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useFieldValidation(invalidValidator, value, 'onBlur'),
      { initialProps: { value: 'initial' } },
    );

    expect(result.current.error).toBeNull();

    rerender({ value: 'updated' });
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('updated');
  });

  it('does not auto-validate when trigger is manual', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useFieldValidation(invalidValidator, value, 'manual'),
      { initialProps: { value: 'initial' } },
    );

    expect(result.current.error).toBeNull();

    rerender({ value: 'updated' });
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.validate();
    });

    expect(result.current.error).toBe('updated');
  });
});

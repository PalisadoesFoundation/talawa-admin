/**
 * Performance utilities for optimizing user interactions
 * Re-exports useDebounce hook and provides convenient wrappers
 */
export { default as useDebounce } from './useDebounce';

/**
 * Creates a debounced version of a function (for non-hook usage)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<TFn extends (...args: any[]) => void>(
  fn: TFn,
  delay: number,
): (...args: Parameters<TFn>) => void {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  let timeoutId: number | null = null;

  return function (this: unknown, ...args: Parameters<TFn>) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  };
}

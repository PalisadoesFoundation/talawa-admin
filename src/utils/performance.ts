/**
 * Performance utilities for optimizing user interactions
 * Re-exports useDebounce hook and provides convenient wrappers
 */
export { default as useDebounce } from './useDebounce';

/**
 * Creates a debounced version of a function (for non-hook usage)
 */
export function debounce<TFn extends (...args: unknown[]) => void>(
  fn: TFn,
  delay: number,
): (...args: unknown[]) => void {
  let timeoutId: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

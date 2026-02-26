import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';

export { debounce, throttle };

/**
 * Debounces an input handler with `leading: false, trailing: true`.
 * @param fn - The function to debounce.
 * @param wait - Debounce delay in milliseconds (default 300).
 * @returns A debounced version of `fn`.
 */
export const debounceInput = <T extends (...args: never[]) => unknown>(
  fn: T,
  wait = 300,
): DebouncedFunc<T> => debounce(fn, wait, { leading: false, trailing: true });

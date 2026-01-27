/**
 * Performance utilities wrapper
 *
 * This module centralizes debounce/throttle utilities for the app so imports
 * remain consistent and bundle-friendly. It re-exports lodash's debounce and
 * throttle and provides a small helper `debounceInput` with sane defaults for
 * text input use-cases.
 *
 * Usage:
 * ```ts
 * import { debounceInput } from 'utils/performance';
 * const debounced = debounceInput((val: string) => setValue(val));
 * // debounced behaves like lodash.debounce
 * ```
 */
import { debounce, throttle } from 'lodash';

/**
 * Options accepted by `debounceInput`.
 */
export interface InterfaceDebounceInputOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

/**
 * Creates a debounced function tailored for input handlers.
 *
 * Defaults:
 * - `wait`: 300 ms
 * - `leading`: false
 * - `trailing`: true
 *
 * The returned function is the same shape as the function returned by
 * `lodash.debounce` (it includes `cancel` and `flush`).
 *
 * @typeParam T - Function type to debounce
 * @param fn - The function to debounce
 * @param wait - Debounce wait time in milliseconds (default: 300)
 * @param options - Optional override for leading/trailing/maxWait
 * @returns Debounced function with `cancel` and `flush` methods
 */
export function debounceInput<T extends (...args: never[]) => unknown>(
  fn: T,
  wait = 300,
  options?: InterfaceDebounceInputOptions,
): T & { cancel: () => void; flush: () => void } {
  const opts = {
    leading: false,
    trailing: true,
    ...(options || {}),
  } as InterfaceDebounceInputOptions;

  // Type casting here keeps the lodash return type compatible with callers
  return debounce(
    fn as (...args: unknown[]) => unknown,
    wait,
    opts,
  ) as unknown as T & {
    cancel: () => void;
    flush: () => void;
  };
}

// Re-export lodash utilities so the rest of the codebase imports from here.
export { debounce, throttle };

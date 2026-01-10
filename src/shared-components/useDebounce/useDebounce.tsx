/**
 * A custom React hook that provides a debounced version of a callback function.
 * The debounced function delays the execution of the callback until after a specified
 * delay has elapsed since the last time it was invoked.
 *
 * @typeParam T - The type of the callback function.
 * @param callback - The function to debounce. It will be executed after the delay
 *   if no new calls are made during that time.
 * @param delay - The debounce delay in milliseconds.
 *
 * @returns An object containing:
 * - `debouncedCallback`: The debounced version of the provided callback function.
 * - `cancel`: A function to cancel any pending execution of the debounced callback.
 *
 * @remarks
 * This hook is useful for scenarios like search input handling, where you want to
 * limit the frequency of function execution to improve performance.
 */
import { useRef, useCallback } from 'react';

function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
): { debouncedCallback: (...args: Parameters<T>) => void; cancel: () => void } {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debouncedCallback, cancel };
}

export default useDebounce;

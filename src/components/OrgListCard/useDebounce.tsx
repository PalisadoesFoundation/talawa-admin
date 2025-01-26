import { useRef, useCallback } from 'react';

/**
 * A custom React hook for debouncing a callback function.
 * It delays the execution of the callback until after a specified delay has elapsed
 * since the last time the debounced function was invoked.
 *
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds to wait before invoking the callback.
 * @returns An object with the `debouncedCallback` function and a `cancel` method to clear the timeout.
 */
function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
): { debouncedCallback: (...args: Parameters<T>) => void; cancel: () => void } {
  const timeoutRef = useRef<number | undefined>();

  /**
   * The debounced version of the provided callback function.
   * This function resets the debounce timer on each call, ensuring the callback
   * is invoked only after the specified delay has elapsed without further calls.
   *
   * @param args - The arguments to pass to the callback when invoked.
   */
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { debouncedCallback, cancel };
}

export default useDebounce;

/**
 * A custom React hook that provides a debounced version of a callback function.
 * See original implementation in components/OrgListCard/useDebounce.tsx
 */
import { useRef, useCallback } from 'react';

function useDebounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number,
): {
  debouncedCallback: (...args: TArgs) => void;
  cancel: () => void;
} {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: TArgs) => {
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

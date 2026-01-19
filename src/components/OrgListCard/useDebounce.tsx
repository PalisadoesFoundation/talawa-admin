/**
 * A custom React hook that provides a debounced version of a callback function.
 * The debounced function delays the execution of the callback until after a specified
 * delay has elapsed since the last time it was invoked.
 *
 * @template T - The type of the callback function.
 * @param callback - The function to debounce. It will be executed after the delay
 * if no new calls are made during that time.
 * @param delay - The debounce delay in milliseconds.
 *
 * @returns An object containing:
 * - `debouncedCallback`: The debounced version of the provided callback function.
 * - `cancel`: A function to cancel any pending execution of the debounced callback.
 *
 * @example
 * ```tsx
 * const { debouncedCallback, cancel } = useDebounce((value) => {
 *   console.log(value);
 * }, 300);
 *
 * debouncedCallback('Hello');
 * // If called again within 300ms, the previous call is canceled.
 * ```
 *
 * @remarks
 * This hook is useful for scenarios like search input handling, where you want to
 * limit the frequency of function execution to improve performance.
 */
// Deprecated: centralized implementation moved to `src/utils/useDebounce.ts`
export { default } from 'utils/useDebounce';

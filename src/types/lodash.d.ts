declare module 'lodash' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean; maxWait?: number },
  ): T & { cancel: () => void };

  // Add other commonly used lodash functions as needed
  export function throttle<T extends (...args: never[]) => unknown>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean },
  ): T & { cancel: () => void };
}

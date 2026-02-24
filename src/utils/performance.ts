import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';
import type { DebouncedFunc } from 'lodash';

export { debounce, throttle };

type UnknownFunction = (...args: unknown[]) => unknown;

export const debounceInput = (
  fn: UnknownFunction,
  wait = 300,
): DebouncedFunc<UnknownFunction> =>
  debounce(fn, wait, { leading: false, trailing: true });

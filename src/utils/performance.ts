import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';

export { debounce, throttle };

export const debounceInput = (fn: (...args: never[]) => void, wait = 300) =>
  debounce(fn, wait, { leading: false, trailing: true }) as ReturnType<
    typeof debounce
  >;

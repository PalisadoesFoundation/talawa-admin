import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

export { debounce, throttle };

export const debounceInput: typeof debounce = (fn, wait = 300) =>
  debounce(fn, wait, { leading: false, trailing: true });

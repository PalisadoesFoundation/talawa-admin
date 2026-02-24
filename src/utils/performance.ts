import debounce from 'lodash-es/debounce';
import throttle from 'lodash-es/throttle';

export { debounce, throttle };

export const debounceInput: typeof debounce = (
  fn: Parameters<typeof debounce>[0],
  wait = 300,
) => debounce(fn, wait, { leading: false, trailing: true });

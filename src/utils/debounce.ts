const debounce = (fn: any, ms = 600): any => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]): any {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export default debounce;

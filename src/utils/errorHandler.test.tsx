type TFunction = (key: string, options?: Record<string, unknown>) => string;

import { errorHandler } from './errorHandler';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Test if errorHandler is working properly', () => {
  const t: TFunction = (key: string) => key;
  const tErrors: TFunction = (key: string, options?: Record<string, unknown>) =>
    key;

  it('should call toast.error with the correct message if error message is "Failed to fetch"', () => {
    const error = new Error('Failed to fetch');
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(tErrors('talawaApiUnavailable'));
  });

  it('should call toast.error with the error message if it is not "Failed to fetch"', () => {
    const error = new Error('Some other error message');
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(error.message);
  });

  it('should call toast.error with the error message if error object is falsy', () => {
    const error = null;
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(
      tErrors('unknownError', { msg: error }),
    );
  });
});

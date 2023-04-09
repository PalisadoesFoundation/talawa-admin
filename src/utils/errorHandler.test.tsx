import { TFunction } from 'react-i18next';
import { errorHandler } from './errorHandler';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Test if errorHandler is working properly', () => {
  const t: TFunction<'translation', string> = (key: string) => key;

  it('should call toast.error with the correct message if error message is "Failed to fetch"', () => {
    const error = { message: 'Failed to fetch' };
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(t('talawaApiUnavailable'));
  });

  it('should call toast.error with the error message if it is not "Failed to fetch"', () => {
    const error = { message: 'Some other error message' };
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(error.message);
  });

  it('should call toast.error with the error message if error object is falsy', () => {
    const error = null;
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(undefined);
  });
});

type TFunction = (key: string, options?: Record<string, unknown>) => string;

import { errorHandler } from './errorHandler';
import { toast } from 'react-toastify';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('Test if errorHandler is working properly', () => {
  const t: TFunction = (key: string) => key;
  const tErrors: TFunction = (
    key: string,
    options?: Record<string, unknown>,
  ) => {
    if (options) {
      console.log(`options are passed, but the function returns only ${key}`);
    }
    return key;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toast.error with the correct message if error message is "Failed to fetch"', async () => {
    const error = new Error('Failed to fetch');
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(tErrors('talawaApiUnavailable'));
  });

  it('should call toast.error with the correct message if error message contains this substring "Value is not a valid phone number"', () => {
    const error = new Error('This value is not a valid phone number');
    errorHandler(t, error);
    expect(toast.error).toHaveBeenCalledWith(tErrors('invalidPhoneNumber'));
  });

  test.each([
    ['EducationGrade', 'invalidEducationGrade'],
    ['EmploymentStatus', 'invalidEmploymentStatus'],
    ['MaritalStatus', 'invalidMaritalStatus'],
  ])('should handle invalid %s error', (field, expectedKey) => {
    const error = new Error(`This value does not exist in "${field}"`);
    errorHandler(t, error);
    expect(toast.error).toHaveBeenCalledWith(tErrors(expectedKey));
  });

  it('should call toast.error with the correct message if error message contains this substring "status code 400"', () => {
    const error = new Error('Server responded with status code 400');
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(tErrors('error400'));
  });

  it('should handle error messages with different cases', () => {
    errorHandler(t, new Error('VALUE IS NOT A VALID PHONE NUMBER'));
    expect(toast.error).toHaveBeenCalledWith(tErrors('invalidPhoneNumber'));

    errorHandler(t, new Error('This Value Does Not Exist in "EducationGrade"'));
    expect(toast.error).toHaveBeenCalledWith(tErrors('invalidEducationGrade'));
  });

  it('should call toast.error with the error message if it is an instance of error but have not matched any error message patterns', () => {
    const error = new Error('Bandhan sent an error message');
    errorHandler(t, error);
    expect(toast.error).toHaveBeenCalledWith(error.message);
  });

  it('should handle different types for the first parameter while still showing error messages', () => {
    errorHandler(undefined, new Error('Some error'));
    expect(toast.error).toHaveBeenCalled();

    errorHandler(null, new Error('Some error'));
    expect(toast.error).toHaveBeenCalled();

    errorHandler({}, new Error('Some error'));
    expect(toast.error).toHaveBeenCalled();
  });

  it('should handle non-null but non-Error objects for the error parameter', () => {
    errorHandler(t, { message: 'Error message in object' });
    expect(toast.error).toHaveBeenCalledWith(
      tErrors('unknownError', { msg: { message: 'Error message in object' } }),
    );

    errorHandler(t, 'Direct error message');
    expect(toast.error).toHaveBeenCalledWith(
      tErrors('unknownError', { msg: 'Direct error message' }),
    );
  });

  it('should call toast.error with the error message if error object is falsy', () => {
    const error = null;
    errorHandler(t, error);

    expect(toast.error).toHaveBeenCalledWith(
      tErrors('unknownError', { msg: error }),
    );
  });
});

import { errorHandler } from './errorHandler';
import { toast } from 'react-toastify';
import { describe, it, expect, vi, beforeEach, afterEach, test } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock i18n to return predictable translated strings
vi.mock('utils/i18n', () => ({
  default: {
    getFixedT: (_lng: unknown, ns: string) => {
      return (key: string, values?: Record<string, unknown>) => {
        if (values && 'msg' in values) {
          return `${ns}:${key}:${JSON.stringify(values.msg)}`;
        }
        return `${ns}:${key}`;
      };
    },
  },
}));

describe('Test if errorHandler is working properly', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call toast.error with the correct message if error message is "Failed to fetch"', async () => {
    const error = new Error('Failed to fetch');
    errorHandler(null, error);

    expect(toast.error).toHaveBeenCalledWith(
      'errors:talawaApiUnavailable',
      expect.any(Object),
    );
  });

  it('should call toast.error with the correct message if error message contains this substring "Value is not a valid phone number"', () => {
    const error = new Error('This value is not a valid phone number');
    errorHandler(null, error);
    expect(toast.error).toHaveBeenCalledWith(
      'errors:invalidPhoneNumber',
      expect.any(Object),
    );
  });

  test.each([
    ['EducationGrade', 'invalidEducationGrade'],
    ['EmploymentStatus', 'invalidEmploymentStatus'],
    ['MaritalStatus', 'invalidMaritalStatus'],
  ])('should handle invalid %s error', (field, expectedKey) => {
    const error = new Error(`This value does not exist in "${field}"`);
    errorHandler(null, error);
    expect(toast.error).toHaveBeenCalledWith(
      `errors:${expectedKey}`,
      expect.any(Object),
    );
  });

  it('should call toast.error with the correct message if error message contains this substring "status code 400"', () => {
    const error = new Error('Server responded with status code 400');
    errorHandler(null, error);

    expect(toast.error).toHaveBeenCalledWith(
      'errors:error400',
      expect.any(Object),
    );
  });

  it('should call toast.error with the correct message if error message contains this substring "organization name already exists"', () => {
    const error = new Error('organization name already exists');
    errorHandler(null, error);

    expect(toast.error).toHaveBeenCalledWith(
      'errors:organizationNameAlreadyExists',
      expect.any(Object),
    );
  });

  it('should call toast.error with the correct message if error message matches account locked pattern', () => {
    const error = new Error(
      'Account temporarily locked due to too many failed login attempts. Please try again later.',
    );
    errorHandler(null, error);

    expect(toast.error).toHaveBeenCalledWith(
      'errors:accountLocked',
      expect.any(Object),
    );
  });

  it('should handle error messages with different cases', () => {
    errorHandler(null, new Error('VALUE IS NOT A VALID PHONE NUMBER'));
    expect(toast.error).toHaveBeenCalledWith(
      'errors:invalidPhoneNumber',
      expect.any(Object),
    );

    vi.clearAllMocks();

    errorHandler(
      null,
      new Error('This Value Does Not Exist in "EducationGrade"'),
    );
    expect(toast.error).toHaveBeenCalledWith(
      'errors:invalidEducationGrade',
      expect.any(Object),
    );
  });

  it('should call toast.error with the error message if it is an instance of error but have not matched any error message patterns', () => {
    const error = new Error('Bandhan sent an error message');
    errorHandler(null, error);
    expect(toast.error).toHaveBeenCalledWith(error.message, expect.any(Object));
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
    errorHandler(null, { message: 'Error message in object' });
    expect(toast.error).toHaveBeenCalledWith(
      'errors:unknownError:"{\\"message\\":\\"Error message in object\\"}"',
      expect.any(Object),
    );

    vi.clearAllMocks();

    errorHandler(null, 'Direct error message');
    expect(toast.error).toHaveBeenCalledWith(
      'errors:unknownError:"Direct error message"',
      expect.any(Object),
    );
  });

  it('should call toast.error with the error message if error object is falsy', () => {
    const error = null;
    errorHandler(null, error);

    expect(toast.error).toHaveBeenCalledWith(
      'errors:unknownError:"null"',
      expect.any(Object),
    );
  });
});

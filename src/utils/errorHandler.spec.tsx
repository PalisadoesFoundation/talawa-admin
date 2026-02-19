import { errorHandler } from './errorHandler';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { cleanup } from '@testing-library/react';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
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
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should call NotificationToast.error with the correct message if error message is "Failed to fetch"', async () => {
    const error = new Error('Failed to fetch');
    errorHandler(null, error);

    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'talawaApiUnavailable',
      namespace: 'errors',
    });
  });

  it('should call NotificationToast.error with the correct message if error message contains this substring "Value is not a valid phone number"', () => {
    const error = new Error('This value is not a valid phone number');
    errorHandler(null, error);
    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'invalidPhoneNumber',
      namespace: 'errors',
    });
  });

  test.each([
    ['EducationGrade', 'invalidEducationGrade'],
    ['EmploymentStatus', 'invalidEmploymentStatus'],
    ['MaritalStatus', 'invalidMaritalStatus'],
  ])('should handle invalid %s error', (field, expectedKey) => {
    const error = new Error(`This value does not exist in "${field}"`);
    errorHandler(null, error);
    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: expectedKey,
      namespace: 'errors',
    });
  });

  it('should call NotificationToast.error with the correct message if error message contains this substring "status code 400"', () => {
    const error = new Error('Server responded with status code 400');
    errorHandler(null, error);

    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'error400',
      namespace: 'errors',
    });
  });

  it('should call NotificationToast.error with the correct message if error message contains this substring "organization name already exists"', () => {
    const error = new Error('organization name already exists');
    errorHandler(null, error);

    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'organizationNameAlreadyExists',
      namespace: 'errors',
    });
  });

  it('should call NotificationToast.error with the correct message if error message matches account locked pattern', () => {
    const error = new Error(
      'Account temporarily locked due to too many failed login attempts. Please try again later.',
    );
    errorHandler(null, error);

    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'accountLocked',
      namespace: 'errors',
    });
  });

  it('should handle error messages with different cases', () => {
    errorHandler(null, new Error('VALUE IS NOT A VALID PHONE NUMBER'));

    expect(NotificationToast.error).toHaveBeenNthCalledWith(1, {
      key: 'invalidPhoneNumber',
      namespace: 'errors',
    });

    errorHandler(
      null,
      new Error('This Value Does Not Exist in "EducationGrade"'),
    );

    expect(NotificationToast.error).toHaveBeenNthCalledWith(2, {
      key: 'invalidEducationGrade',
      namespace: 'errors',
    });
  });

  it('should call NotificationToast.error with the error message if it is an instance of error but have not matched any error message patterns', () => {
    const error = new Error('Bandhan sent an error message');
    errorHandler(null, error);
    expect(NotificationToast.error).toHaveBeenCalledWith(error.message);
  });

  it('should handle different types for the first parameter while still showing error messages', () => {
    errorHandler(undefined, new Error('Some error'));
    expect(NotificationToast.error).toHaveBeenCalled();

    errorHandler(null, new Error('Some error'));
    expect(NotificationToast.error).toHaveBeenCalled();

    errorHandler({}, new Error('Some error'));
    expect(NotificationToast.error).toHaveBeenCalled();
  });

  it('should handle non-null but non-Error objects for the error parameter', () => {
    errorHandler(null, { message: 'Error message in object' });

    expect(NotificationToast.error).toHaveBeenNthCalledWith(1, {
      key: 'unknownError',
      namespace: 'errors',
      values: {
        msg: JSON.stringify({ message: 'Error message in object' }),
      },
    });

    errorHandler(null, 'Direct error message');

    expect(NotificationToast.error).toHaveBeenNthCalledWith(2, {
      key: 'unknownError',
      namespace: 'errors',
      values: {
        msg: 'Direct error message',
      },
    });
  });

  it('should call NotificationToast.error with the error message if error object is falsy', () => {
    const error = null;
    errorHandler(null, error);

    expect(NotificationToast.error).toHaveBeenCalledWith({
      key: 'unknownError',
      namespace: 'errors',
      values: {
        msg: 'null',
      },
    });
  });
});

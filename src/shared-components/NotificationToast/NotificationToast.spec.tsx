import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ToastContainerProps } from 'react-toastify';

const toastMock = vi.hoisted(() => ({
  success: vi.fn(() => 'success-id'),
  error: vi.fn(() => 'error-id'),
  warning: vi.fn(() => 'warning-id'),
  info: vi.fn(() => 'info-id'),
}));

const toastContainerSpy = vi.hoisted(() =>
  vi.fn((props: ToastContainerProps) => {
    return (
      <div
        data-testid="toast-container"
        data-limit={props.limit}
        data-position={props.position}
      />
    );
  }),
);

vi.mock('react-toastify', () => ({
  toast: toastMock,
  ToastContainer: (props: ToastContainerProps) => toastContainerSpy(props),
}));

const getFixedTMock = vi.hoisted(() =>
  vi.fn((_lng: unknown, ns: string) => {
    return (key: string, values?: Record<string, unknown>) => {
      if (values && 'name' in values) {
        return `${ns}:${key}:${String(values.name)}`;
      }
      return `${ns}:${key}`;
    };
  }),
);

const i18nMock = vi.hoisted(() => {
  const instance = {
    getFixedT: getFixedTMock,
    // These are not used by NotificationToast, but included so the mock more
    // closely resembles the real i18next instance export.
    t: vi.fn((key: string) => key),
    changeLanguage: vi.fn(async () => instance),
    language: 'en',
    init: vi.fn(async () => instance),
    use: vi.fn(() => instance),
    on: vi.fn(() => instance),
    off: vi.fn(() => instance),
  };
  return instance;
});

vi.mock('utils/i18n', () => ({
  default: i18nMock,
}));

import {
  NotificationToast,
  NotificationToastContainer,
} from './NotificationToast';

describe('NotificationToast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls toast.success with defaults for a string message', () => {
    const id = NotificationToast.success('Saved');

    expect(id).toBe('success-id');
    expect(toastMock.success).toHaveBeenCalledWith(
      'Saved',
      expect.objectContaining({
        autoClose: 5000,
        position: 'top-right',
      }),
    );
  });

  it('translates an i18n message using the provided namespace', () => {
    const id = NotificationToast.error({
      key: 'talawaApiUnavailable',
      namespace: 'errors',
    });

    expect(id).toBe('error-id');
    expect(getFixedTMock).toHaveBeenCalledWith(null, 'errors');
    expect(toastMock.error).toHaveBeenCalledWith(
      'errors:talawaApiUnavailable',
      expect.any(Object),
    );
  });

  it('merges custom toast options over defaults', () => {
    const id = NotificationToast.warning('Be careful', { autoClose: false });

    expect(id).toBe('warning-id');
    expect(toastMock.warning).toHaveBeenCalledWith(
      'Be careful',
      expect.objectContaining({ autoClose: false }),
    );
  });

  it('calls toast.info with defaults for a string message', () => {
    const id = NotificationToast.info('Information');

    expect(id).toBe('info-id');
    expect(toastMock.info).toHaveBeenCalledWith(
      'Information',
      expect.objectContaining({
        autoClose: 5000,
        position: 'top-right',
      }),
    );
  });

  it('translates an i18n message with interpolation values', () => {
    NotificationToast.success({
      key: 'welcome',
      namespace: 'common',
      values: { name: 'Alice' },
    });

    expect(getFixedTMock).toHaveBeenCalledWith(null, 'common');
    expect(toastMock.success).toHaveBeenCalledWith(
      'common:welcome:Alice',
      expect.any(Object),
    );
  });

  it('uses default namespace when namespace is omitted', () => {
    NotificationToast.error({
      key: 'someError',
      // namespace omitted -> should default to 'common'
    });

    expect(getFixedTMock).toHaveBeenCalledWith(null, 'common');
    expect(toastMock.error).toHaveBeenCalledWith(
      'common:someError',
      expect.any(Object),
    );
  });
});

describe('NotificationToastContainer', () => {
  it('renders ToastContainer with defaults and allows overrides', () => {
    render(<NotificationToastContainer limit={9} />);

    const container = screen.getByTestId('toast-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-limit', '9');
    expect(container).toHaveAttribute('data-position', 'top-right');
    expect(toastContainerSpy).toHaveBeenCalled();
  });

  it('uses default container props when none are provided', () => {
    render(<NotificationToastContainer />);

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveAttribute('data-limit', '5');
    expect(container).toHaveAttribute('data-position', 'top-right');
  });
});

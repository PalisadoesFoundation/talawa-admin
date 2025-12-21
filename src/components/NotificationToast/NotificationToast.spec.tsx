import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const toastMock = vi.hoisted(() => ({
  success: vi.fn(() => 'success-id'),
  error: vi.fn(() => 'error-id'),
  warning: vi.fn(() => 'warning-id'),
  info: vi.fn(() => 'info-id'),
}));

const toastContainerSpy = vi.hoisted(() =>
  vi.fn((props: { limit?: number; position?: string }) => {
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
  ToastContainer: (props: { limit?: number; position?: string }) =>
    toastContainerSpy(props),
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

vi.mock('utils/i18n', () => ({
  default: {
    getFixedT: getFixedTMock,
  },
}));

import {
  NotificationToast,
  NotificationToastContainer,
} from './NotificationToast';

describe('NotificationToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    NotificationToast.error({
      key: 'talawaApiUnavailable',
      namespace: 'errors',
    });

    expect(getFixedTMock).toHaveBeenCalledWith(null, 'errors');
    expect(toastMock.error).toHaveBeenCalledWith(
      'errors:talawaApiUnavailable',
      expect.any(Object),
    );
  });

  it('merges custom toast options over defaults', () => {
    NotificationToast.warning('Be careful', { autoClose: false });

    expect(toastMock.warning).toHaveBeenCalledWith(
      'Be careful',
      expect.objectContaining({ autoClose: false }),
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
});

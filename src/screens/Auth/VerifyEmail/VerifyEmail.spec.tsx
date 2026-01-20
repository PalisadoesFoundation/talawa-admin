import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  VERIFY_EMAIL_MUTATION,
  RESEND_VERIFICATION_EMAIL_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import VerifyEmail from './VerifyEmail';
import i18n from 'utils/i18nForTest';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  warning: vi.fn(),
}));

// Mock utils/i18n to use the test i18n instance for NotificationToast
vi.mock('utils/i18n', async () => {
  const i18n = await import('utils/i18nForTest');
  return {
    default: i18n.default,
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: toastMocks.success,
    error: toastMocks.error,
    warning: toastMocks.warning,
    warn: toastMocks.warn,
  },
}));

const MOCKS = [
  {
    request: {
      query: VERIFY_EMAIL_MUTATION,
      variables: {
        token: 'valid-token',
      },
    },
    result: {
      data: {
        verifyEmail: {
          success: true,
          message: 'Email verified successfully',
          user: {
            id: '123',
            name: 'Test User',
            emailAddress: 'test@example.com',
            isEmailAddressVerified: true,
          },
        },
      },
    },
  },
  {
    request: {
      query: VERIFY_EMAIL_MUTATION,
      variables: {
        token: 'invalid-token',
      },
    },
    error: new Error('Invalid or expired token'),
  },
  {
    request: {
      query: RESEND_VERIFICATION_EMAIL_MUTATION,
    },
    result: {
      data: {
        sendVerificationEmail: {
          success: true,
          message: 'Verification email sent',
        },
      },
    },
  },
];

const resendErrorMock = {
  request: {
    query: RESEND_VERIFICATION_EMAIL_MUTATION,
  },
  error: new Error('User not found'),
};

const link = new StaticMockLink(MOCKS, true);

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('Testing VerifyEmail screen', () => {
  it('Component should be rendered properly with loading state', async () => {
    const mockObj = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: {
          token: 'valid-token',
        },
      },
      result: {
        data: {
          verifyEmail: {
            success: true,
            message: 'Email verified successfully',
            user: {
              id: '123',
              name: 'Test User',
              emailAddress: 'test@example.com',
              isEmailAddressVerified: true,
            },
          },
        },
      },
      delay: 100, // Add delay to see loading state
    };
    const loadingMocks = [mockObj, mockObj];

    render(
      <MockedProvider mocks={loadingMocks}>
        <MemoryRouter initialEntries={['/auth/verify-email?token=valid-token']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // First, loading spinner should be visible
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Then success state after delay
    await waitFor(
      () => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('Should show success state after successful verification', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/auth/verify-email?token=valid-token']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('success-state')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('goToLoginBtn')).toBeInTheDocument();
    expect(toastMocks.success).toHaveBeenCalled();
  });

  it('Should navigate to login when Go to Login button is clicked', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/auth/verify-email?token=valid-token']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('success-state')).toBeInTheDocument();
    });

    const goToLoginBtn = screen.getByTestId('goToLoginBtn');
    // Ensure the link points to the root (login page)
    const linkElement = goToLoginBtn.closest('a');
    expect(linkElement).toHaveAttribute('href', '/');

    await userEvent.click(goToLoginBtn);
    // Since we are using MemoryRouter, we verify it doesn't crash and the state is correct.
    // In a real scenario, we might check if the component for '/' is rendered.
  });

  it('Should show error state when token is missing', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/auth/verify-email']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByTestId('resendVerificationBtn')).toBeInTheDocument();
  });

  it('Should show error state when verification fails', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=invalid-token']}
        >
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('Should successfully resend verification email', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/auth/verify-email']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    const resendBtn = screen.getByTestId('resendVerificationBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalled();
    });
  });

  it('Should handle resend email error', async () => {
    render(
      <MockedProvider mocks={[resendErrorMock]}>
        <MemoryRouter initialEntries={['/auth/verify-email']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    const resendBtn = screen.getByTestId('resendVerificationBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalled();
    });
  });

  it('Should handle resend email failure (api returns false)', async () => {
    const resendFailureMock = {
      request: {
        query: RESEND_VERIFICATION_EMAIL_MUTATION,
      },
      result: {
        data: {
          sendVerificationEmail: {
            success: false,
            message: 'Failed to resend',
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[resendFailureMock]}>
        <MemoryRouter initialEntries={['/auth/verify-email']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    const resendBtn = screen.getByTestId('resendVerificationBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalledWith('Failed to resend');
    });
  });

  it('Should have back to login link in error state', async () => {
    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/auth/verify-email']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    const backLink = screen.getByTestId('backToLoginLink');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while verification is in progress', async () => {
      const loadingMocks = [
        {
          request: {
            query: VERIFY_EMAIL_MUTATION,
            variables: { token: 'slow-token' },
          },
          result: {
            data: {
              verifyEmail: {
                success: true,
                message: 'Verifying...',
                user: null,
              },
            },
          },
          delay: 100,
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks}>
          <MemoryRouter
            initialEntries={['/auth/verify-email?token=slow-token']}
          >
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <VerifyEmail />
              </I18nextProvider>
            </Provider>
          </MemoryRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });
  });

  it('Should show error state when verification success is false', async () => {
    const successFalseMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'fail-token' },
      },
      result: {
        data: {
          verifyEmail: {
            success: false,
            message: 'Verification failed',
            user: null,
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[successFalseMock]}>
        <MemoryRouter initialEntries={['/auth/verify-email?token=fail-token']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });
});

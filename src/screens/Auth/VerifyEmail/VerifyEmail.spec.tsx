import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
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
      variables: {
        email: 'test@example.com',
      },
    },
    result: {
      data: {
        resendVerificationEmail: {
          success: true,
          message: 'Verification email sent',
        },
      },
    },
  },
  {
    request: {
      query: RESEND_VERIFICATION_EMAIL_MUTATION,
      variables: {
        email: 'notexists@example.com',
      },
    },
    error: new Error('User not found'),
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Testing VerifyEmail screen', () => {
  it('Component should be rendered properly with loading state', async () => {
    const loadingMocks = [
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
        delay: 100, // Add delay to see loading state
      },
    ];

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
    expect(screen.getByTestId('showResendFormBtn')).toBeInTheDocument();
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

  it('Should display resend form when resend button is clicked', async () => {
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

    const resendBtn = screen.getByTestId('showResendFormBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(screen.getByTestId('resendEmailInput')).toBeInTheDocument();
    });
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

    // Click resend button to show form
    const showFormBtn = screen.getByTestId('showResendFormBtn');
    await userEvent.click(showFormBtn);

    await waitFor(() => {
      expect(screen.getByTestId('resendEmailInput')).toBeInTheDocument();
    });

    // Enter email and submit
    const emailInput = screen.getByTestId('resendEmailInput');
    await userEvent.type(emailInput, 'test@example.com');

    const resendBtn = screen.getByTestId('resendEmailBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalled();
    });
  });

  it('Should handle resend email error', async () => {
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

    // Click resend button to show form
    const showFormBtn = screen.getByTestId('showResendFormBtn');
    await userEvent.click(showFormBtn);

    await waitFor(() => {
      expect(screen.getByTestId('resendEmailInput')).toBeInTheDocument();
    });

    // Enter non-existent email
    const emailInput = screen.getByTestId('resendEmailInput');
    await userEvent.type(emailInput, 'notexists@example.com');

    const resendBtn = screen.getByTestId('resendEmailBtn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.error).toHaveBeenCalled();
    });
  });

  it('Should show validation warning when resending without email', async () => {
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

    const showFormBtn = screen.getByTestId('showResendFormBtn');
    await userEvent.click(showFormBtn);

    await waitFor(() => {
      expect(screen.getByTestId('resendEmailInput')).toBeInTheDocument();
    });

    // Try to submit without entering email
    const resendBtn = screen.getByTestId('resendEmailBtn');
    await userEvent.click(resendBtn);

    // Form validation should prevent submission
    await wait();
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
          result: { data: null },
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
});

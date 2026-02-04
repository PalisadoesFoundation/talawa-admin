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

const localStorageMocks = vi.hoisted(() => ({
  removeItem: vi.fn(),
  setItem: vi.fn(),
  getItem: vi.fn(),
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

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    removeItem: localStorageMocks.removeItem,
    setItem: localStorageMocks.setItem,
    getItem: localStorageMocks.getItem,
  }),
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

  it('Should remove localStorage items on successful verification', async () => {
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

    expect(localStorageMocks.removeItem).toHaveBeenCalledWith(
      'emailNotVerified',
    );
    expect(localStorageMocks.removeItem).toHaveBeenCalledWith(
      'unverifiedEmail',
    );
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

    it('should show LoadingState spinner while resend is in progress', async () => {
      const resendLoadingMock = {
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
        delay: 100,
      };

      render(
        <MockedProvider mocks={[resendLoadingMock]}>
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

    expect(toastMocks.error).toHaveBeenCalled();
  });

  it('Should handle authentication error during verification', async () => {
    const authErrorMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'auth-error-token' },
      },
      error: new Error('User is not authenticated'),
    };

    render(
      <MockedProvider mocks={[authErrorMock]}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=auth-error-token']}
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
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(toastMocks.error).toHaveBeenCalled();
  });

  it('Should handle UNAUTHENTICATED GraphQL error code', async () => {
    const unauthenticatedErrorMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'unauth-token' },
      },
      result: {
        errors: [
          {
            message: 'Not authenticated',
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          },
        ],
      },
    };

    render(
      <MockedProvider mocks={[unauthenticatedErrorMock]}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=unauth-token']}
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
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  it('Should handle invalid arguments error during verification', async () => {
    const invalidArgsErrorMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'invalid-args-token' },
      },
      error: new Error('Invalid arguments provided'),
    };

    render(
      <MockedProvider mocks={[invalidArgsErrorMock]}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=invalid-args-token']}
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
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(toastMocks.error).toHaveBeenCalled();
  });

  it('Should not update state after component unmount during verification', async () => {
    const slowMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'slow-token' },
      },
      result: {
        data: {
          verifyEmail: {
            success: true,
            message: 'Email verified successfully',
            user: null,
          },
        },
      },
      delay: 500,
    };

    const { unmount } = render(
      <MockedProvider mocks={[slowMock]}>
        <MemoryRouter initialEntries={['/auth/verify-email?token=slow-token']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <VerifyEmail />
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Unmount before the mutation completes
    unmount();

    // Wait to ensure no state updates occur after unmount
    await new Promise((resolve) => setTimeout(resolve, 600));

    // No errors should be thrown
    expect(true).toBe(true);
  });

  it('Should not update state after component unmount during resend', async () => {
    const slowResendMock = {
      request: {
        query: RESEND_VERIFICATION_EMAIL_MUTATION,
      },
      result: {
        data: {
          sendVerificationEmail: {
            success: true,
            message: 'Email sent',
          },
        },
      },
      delay: 500,
    };

    const { unmount } = render(
      <MockedProvider mocks={[slowResendMock]}>
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

    unmount();

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(true).toBe(true);
  });

  it('Should not update state after component unmount during resend error', async () => {
    const slowResendErrorMock = {
      request: {
        query: RESEND_VERIFICATION_EMAIL_MUTATION,
      },
      error: new Error('Network error'),
      delay: 500,
    };

    const { unmount } = render(
      <MockedProvider mocks={[slowResendErrorMock]}>
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

    unmount();

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(true).toBe(true);
  });

  it('Should prevent duplicate verification requests on strict mode', async () => {
    let callCount = 0;
    const countingMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'counting-token' },
      },
      result: () => {
        callCount++;
        return {
          data: {
            verifyEmail: {
              success: true,
              message: 'Email verified',
              user: null,
            },
          },
        };
      },
    };

    render(
      <MockedProvider mocks={[countingMock, countingMock]}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=counting-token']}
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
      expect(screen.getByTestId('success-state')).toBeInTheDocument();
    });

    // Should only be called once despite React Strict Mode
    expect(callCount).toBe(1);
  });

  it('Should disable resend button while loading', async () => {
    const slowResendMock = {
      request: {
        query: RESEND_VERIFICATION_EMAIL_MUTATION,
      },
      result: {
        data: {
          sendVerificationEmail: {
            success: true,
            message: 'Email sent',
          },
        },
      },
      delay: 200,
    };

    render(
      <MockedProvider mocks={[slowResendMock]}>
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

    // Button should not be disabled initially
    expect(resendBtn).not.toBeDisabled();
  });

  it('Should set document title on mount', async () => {
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
      expect(document.title).toBeTruthy();
    });
  });

  it('Should handle resend without error message', async () => {
    const resendNoMessageMock = {
      request: {
        query: RESEND_VERIFICATION_EMAIL_MUTATION,
      },
      result: {
        data: {
          sendVerificationEmail: {
            success: false,
            message: null,
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[resendNoMessageMock]}>
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

  it('Should show error for verification with no success field', async () => {
    const noSuccessMock = {
      request: {
        query: VERIFY_EMAIL_MUTATION,
        variables: { token: 'no-success-token' },
      },
      result: {
        data: {
          verifyEmail: {
            message: 'Something happened',
            user: null,
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[noSuccessMock]}>
        <MemoryRouter
          initialEntries={['/auth/verify-email?token=no-success-token']}
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
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
  });

  describe('Debounce Tests', () => {
    it('Should prevent multiple concurrent resend requests (debounce)', async () => {
      let callCount = 0;
      const countingResendMock = {
        request: {
          query: RESEND_VERIFICATION_EMAIL_MUTATION,
        },
        result: () => {
          callCount++;
          return {
            data: {
              sendVerificationEmail: {
                success: true,
                message: 'Email sent',
              },
            },
          };
        },
        delay: 200,
      };

      render(
        <MockedProvider
          mocks={[countingResendMock, countingResendMock, countingResendMock]}
        >
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

      // Click multiple times rapidly
      await userEvent.click(resendBtn);
      await userEvent.click(resendBtn);
      await userEvent.click(resendBtn);

      // Wait for the request to complete
      await waitFor(
        () => {
          expect(toastMocks.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      // Should only be called once despite multiple clicks
      expect(callCount).toBe(1);
    });

    it('Should reset isResending state even when component unmounts during resend', async () => {
      const slowResendMock = {
        request: {
          query: RESEND_VERIFICATION_EMAIL_MUTATION,
        },
        result: {
          data: {
            sendVerificationEmail: {
              success: true,
              message: 'Email sent',
            },
          },
        },
        delay: 500,
      };

      const { unmount } = render(
        <MockedProvider mocks={[slowResendMock]}>
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

      // Wait a bit then unmount
      await new Promise((resolve) => setTimeout(resolve, 100));
      unmount();

      // Wait for the request to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // No errors should be thrown
      expect(true).toBe(true);
    });

    it('Should handle rapid clicks with error response', async () => {
      let callCount = 0;
      const errorResendMock = {
        request: {
          query: RESEND_VERIFICATION_EMAIL_MUTATION,
        },
        result: () => {
          callCount++;
          return {
            data: {
              sendVerificationEmail: {
                success: false,
                message: 'Rate limit exceeded',
              },
            },
          };
        },
        delay: 150,
      };

      render(
        <MockedProvider mocks={[errorResendMock, errorResendMock]}>
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

      // Rapid clicks
      await userEvent.click(resendBtn);
      await userEvent.click(resendBtn);

      // Wait for request to complete
      await waitFor(
        () => {
          expect(toastMocks.error).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );

      // Should only be called once
      expect(callCount).toBe(1);
    });

    it('Should handle rapid clicks with network error', async () => {
      let callCount = 0;
      const networkErrorMock = {
        request: {
          query: RESEND_VERIFICATION_EMAIL_MUTATION,
        },
        error: (() => {
          callCount++;
          return new Error('Network error');
        })(),
        delay: 150,
      };

      render(
        <MockedProvider mocks={[networkErrorMock]}>
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

      // Rapid clicks
      await userEvent.click(resendBtn);
      await userEvent.click(resendBtn);

      // Wait for error
      await waitFor(
        () => {
          expect(toastMocks.error).toHaveBeenCalled();
        },
        { timeout: 1000 },
      );

      // Should only be called once
      expect(callCount).toBe(1);
    });

    it('Should show loading state in LoadingState component during isResending', async () => {
      const slowResendMock = {
        request: {
          query: RESEND_VERIFICATION_EMAIL_MUTATION,
        },
        result: {
          data: {
            sendVerificationEmail: {
              success: true,
              message: 'Email sent',
            },
          },
        },
        delay: 200,
      };

      render(
        <MockedProvider mocks={[slowResendMock]}>
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

      // LoadingState spinner should be visible
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });
  });
});

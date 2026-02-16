import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
// import i18nForTest from 'utils/i18nForTest';
import ForgotPassword from './ForgotPassword';
import i18n from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import { vi, beforeEach, afterEach, expect, it, describe } from 'vitest';

const { setItem, removeItem, clearAllItems } = useLocalStorage();

const notificationToastMocks = vi.hoisted(() => ({
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
  NotificationToast: notificationToastMocks,
}));

const MOCKS = [
  {
    request: {
      query: FORGOT_PASSWORD_MUTATION,
      variables: {
        otpToken: 'lorem ipsum',
        userOtp: '12345',
        newPassword: 'johnDoe@12345',
      },
    },
    result: {
      data: {
        forgotPassword: true,
      },
    },
  },

  {
    request: {
      query: GENERATE_OTP_MUTATION,
      variables: {
        email: 'johndoe@gmail.com',
      },
    },
    result: {
      data: {
        otp: {
          otpToken: 'otpToken',
        },
      },
    },
  },

  {
    request: {
      query: GENERATE_OTP_MUTATION,
      variables: {
        email: 'notexists@gmail.com',
      },
    },
    error: new Error('User not found'),
  },
];

const MOCKS_INTERNET_UNAVAILABLE = [
  {
    request: {
      query: GENERATE_OTP_MUTATION,
      variables: {
        email: 'johndoe@gmail.com',
      },
    },
    error: new Error('Failed to fetch'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const notWorkingLink = new StaticMockLink([], true);
const talawaApiUnavailableLink = new StaticMockLink(
  MOCKS_INTERNET_UNAVAILABLE,
  true,
);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.forgotPassword ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

beforeEach(() => {
  vi.clearAllMocks();
  setItem('IsLoggedIn', 'FALSE');
});
afterEach(() => {
  clearAllItems();
  vi.clearAllMocks();
});

describe('Testing Forgot Password screen', () => {
  it('Component should be rendered properly', async () => {
    window.history.pushState({}, 'Test page', '/admin/orglist');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Registered Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Otp/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/orglist');
  });

  it('Testing, If user is already loggedIn', async () => {
    setItem('IsLoggedIn', 'TRUE');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  it('Testing get OTP functionality', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('Testing forgot password functionality', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe@12345',
      confirmNewPassword: 'johnDoe@12345',
      email: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await wait();

    await userEvent.type(
      screen.getByPlaceholderText('e.g. 12345'),
      formData.userOtp,
    );
    await userEvent.type(
      screen.getByTestId('newPassword'),
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    setItem('otpToken', 'lorem ipsum');
    await userEvent.click(screen.getByText('Change Password'));
    await wait();
  });

  it('Testing forgot password functionality, if the otp got deleted from the local storage', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'johnDoe',
      email: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await wait();

    await userEvent.type(
      screen.getByPlaceholderText('e.g. 12345'),
      formData.userOtp,
    );
    await userEvent.type(
      screen.getByTestId('newPassword'),
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    removeItem('otpToken');
    await userEvent.click(screen.getByText('Change Password'));
    await wait();
  });

  it('Testing forgot password functionality, when new password and confirm password is not same', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'doeJohn',
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await wait();

    await userEvent.type(
      screen.getByPlaceholderText('e.g. 12345'),
      formData.userOtp,
    );
    await userEvent.type(
      screen.getByTestId('newPassword'),
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );

    await userEvent.click(screen.getByText('Change Password'));
  });

  it('Testing forgot password functionality, when the user is not found', async () => {
    const formData = {
      email: 'notexists@gmail.com',
    };
    // setItem('otpToken', '');
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        translations.emailNotRegistered,
      );
    });
  });

  it('Testing forgot password functionality, when there is an error except unregistered email and api failure', async () => {
    const formData = {
      email: 'testuser@test.com',
    };
    render(
      <MockedProvider link={notWorkingLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.type(
      screen.getByPlaceholderText(/Registered Email/i),
      formData.email,
    );
    await userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.errorSendingMail,
      );
    });
  });

  it('Testing forgot password functionality, when talawa api failed', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
    };
    render(
      <MockedProvider link={talawaApiUnavailableLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );
    await userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        translations.talawaApiUnavailable,
      );
    });
  });

  it('Testing forgot password functionality, when otp token is not present', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'johnDoe',
      email: 'johndoe@gmail.com',
    };

    setItem('otpToken', '');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    await userEvent.click(screen.getByText('Get OTP'));
    await wait();

    await userEvent.type(
      screen.getByPlaceholderText('e.g. 12345'),
      formData.userOtp,
    );
    await userEvent.type(
      screen.getByTestId('newPassword'),
      formData.newPassword,
    );
    await userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    await userEvent.click(screen.getByText('Change Password'));
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while OTP generation is loading', async () => {
      const loadingMocks = [
        {
          request: {
            query: GENERATE_OTP_MUTATION,
            variables: { email: 'test@example.com' },
          },
          result: { data: null },
          delay: 100,
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ForgotPassword />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      // Enter email to trigger OTP request
      await userEvent.type(
        screen.getByPlaceholderText(/Registered email/i),
        'test@example.com',
      );
      await userEvent.click(screen.getByText('Get OTP'));

      // Verify spinner is shown during loading
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    it('should hide spinner and render form after LoadingState completes', async () => {
      const link = new StaticMockLink(MOCKS);
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18n}>
                <ForgotPassword />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(/Registered email/i),
        ).toBeInTheDocument();
        expect(screen.getByText('Get OTP')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});

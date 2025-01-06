import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
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

const { setItem, removeItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
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
  setItem('IsLoggedIn', 'FALSE');
});
afterEach(() => {
  localStorage.clear();
});

describe('Testing Forgot Password screen', () => {
  it('Component should be rendered properly', async () => {
    window.history.pushState({}, 'Test page', '/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
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
    expect(window.location.pathname).toBe('/orglist');
  });

  it('Testing, If user is already loggedIn', async () => {
    setItem('IsLoggedIn', 'TRUE');

    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    setItem('otpToken', 'lorem ipsum');
    userEvent.click(screen.getByText('Change Password'));
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    removeItem('otpToken');
    userEvent.click(screen.getByText('Change Password'));
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );

    userEvent.click(screen.getByText('Change Password'));
  });

  it('Testing forgot password functionality, when the user is not found', async () => {
    const formData = {
      email: 'notexists@gmail.com',
    };
    // setItem('otpToken', '');
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(translations.emailNotRegistered);
    });
  });

  it('Testing forgot password functionality, when there is an error except unregistered email and api failure', async () => {
    render(
      <MockedProvider addTypename={false} link={notWorkingLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.errorSendingMail);
    });
  });

  it('Testing forgot password functionality, when talawa api failed', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
    };
    render(
      <MockedProvider addTypename={false} link={talawaApiUnavailableLink}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );
    userEvent.click(screen.getByText('Get OTP'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email,
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword,
    );
    userEvent.click(screen.getByText('Change Password'));
  });
});

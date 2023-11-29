import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import ForgotPassword from './ForgotPassword';

const MOCKS = [
  {
    request: {
      query: FORGOT_PASSWORD_MUTATION,
      variables: {
        userOtp: '12345',
        newPassword: 'johndoe',
        otpToken: 'otpToken',
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
  localStorage.setItem('IsLoggedIn', 'FALSE');
});
afterEach(() => {
  localStorage.clear();
});

describe('Testing Forgot Password screen', () => {
  test('Component should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Registered Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Otp/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing, If user is already loggedIn', async () => {
    localStorage.setItem('IsLoggedIn', 'TRUE');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Testing get OTP functionality', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();
  });

  test('Testing forgot password functionality', async () => {
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
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword
    );
    localStorage.setItem('otpToken', 'lorem ipsum');
    userEvent.click(screen.getByText('Change Password'));
    await wait();
  });

  test('Testing forgot password functionality, when new password and confirm password is not same', async () => {
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
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword
    );

    userEvent.click(screen.getByText('Change Password'));
  });

  test('Testing forgot password functionality, when otp token is not present', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'johnDoe',
      email: 'johndoe@gmail.com',
    };

    localStorage.setItem('otpToken', '');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
      formData.email
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword
    );
    userEvent.click(screen.getByText('Change Password'));
  });
});

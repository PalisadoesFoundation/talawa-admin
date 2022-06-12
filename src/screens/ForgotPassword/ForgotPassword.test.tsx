import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';

import ForgotPassword from './ForgotPassword';
import { store } from 'state/store';
import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';

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

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

afterEach(() => {
  localStorage.clear();
});

describe('Testing Forgot Password screen', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });

  test('Testing, If user is already loggedIn', async () => {
    localStorage.setItem('IsLoggedIn', 'TRUE');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
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
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText('Registered email'),
      formData.email
    );

    userEvent.click(screen.getByText('Get OTP'));
  });

  test('Testing forgot password functionality', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'johnDoe',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
      formData.confirmNewPassword
    );

    userEvent.click(screen.getByText('Change Password'));
  });

  test('Testing forgot password functionality, when new password and confirm password is not same', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'doeJohn',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

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
    };

    localStorage.setItem('otpToken', '');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <ForgotPassword />
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

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

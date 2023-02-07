import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import 'jest-localstorage-mock';
import 'jest-location-mock';

import LoginPage from './LoginPage';
import {
  LOGIN_MUTATION,
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: 'johndoe@gmail.com',
        password: 'johndoe',
      },
    },
    result: {
      data: {
        login: {
          user: {
            _id: '1',
            userType: 'ADMIN',
            adminApproved: true,
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        register: {
          user: {
            _id: '1',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
  {
    request: {
      query: RECAPTCHA_MUTATION,
      variables: {
        recaptchaToken: null,
      },
    },
    result: {
      data: {
        recaptcha: true,
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

describe('Testing Login Page Screen', () => {
  test('Component Should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    expect(screen.getByText(/Talawa Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/This is/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Talawa Admin Management Portal/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for the seamless management of Talawa Application./i)
    ).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing registration functionality', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'johndoe',
      confirmPassword: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByPlaceholderText('eg. John'), formData.firstName);
    userEvent.type(screen.getByPlaceholderText('eg. Doe'), formData.lastName);
    userEvent.type(screen.getByPlaceholderText('Your Email'), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing registration functionality, when password and confirm password is not same', async () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'johndoe',
      confirmPassword: 'doeJohn',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByPlaceholderText('eg. John'), formData.firstName);
    userEvent.type(screen.getByPlaceholderText('eg. Doe'), formData.lastName);
    userEvent.type(screen.getByPlaceholderText('Your Email'), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing registration functionality, when input is not filled correctly', async () => {
    const formData = {
      firstName: 'J',
      lastName: 'D',
      email: 'johndoe@gmail.com',
      password: 'joe',
      confirmPassword: 'joe',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.type(screen.getByPlaceholderText('eg. John'), formData.firstName);
    userEvent.type(screen.getByPlaceholderText('eg. Doe'), formData.lastName);
    userEvent.type(screen.getByPlaceholderText('Your Email'), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing login modal', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('loginModalBtn'));

    userEvent.click(screen.getByTestId('hideModalBtn'));

    await wait();
  });

  test('Testing login functionality', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('loginModalBtn'));

    userEvent.type(screen.getByPlaceholderText('Enter Email'), formData.email);
    userEvent.type(
      screen.getByPlaceholderText('Enter Password'),
      formData.password
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    await wait();
  });

  test('Testing change language functionality', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('changeLanguageBtn1'));
  });

  test('Testing when language cookie is not set', async () => {
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'i18next=',
    });

    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginPage />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });
});

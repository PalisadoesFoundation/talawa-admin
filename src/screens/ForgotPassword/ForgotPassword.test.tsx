import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify';

import { GENERATE_OTP_MUTATION } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
// import i18nForTest from 'utils/i18nForTest';
import ForgotPassword from './ForgotPassword';
import i18n from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, removeItem } = useLocalStorage();
=======

import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import ForgotPassword from './ForgotPassword';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const MOCKS = [
  {
    request: {
<<<<<<< HEAD
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD

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

=======
];
const link = new StaticMockLink(MOCKS, true);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
<<<<<<< HEAD

const translations = JSON.parse(
  JSON.stringify(
    i18n.getDataByLanguage('en')?.translation.forgotPassword ?? {},
  ),
);

beforeEach(() => {
  setItem('IsLoggedIn', 'FALSE');
=======
beforeEach(() => {
  localStorage.setItem('IsLoggedIn', 'FALSE');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Registered Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Otp/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
    expect(window.location).toBeAt('/orglist');
  });

  test('Testing, If user is already loggedIn', async () => {
<<<<<<< HEAD
    setItem('IsLoggedIn', 'TRUE');
=======
    localStorage.setItem('IsLoggedIn', 'TRUE');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
<<<<<<< HEAD
      formData.confirmNewPassword,
    );
    setItem('otpToken', 'lorem ipsum');
    userEvent.click(screen.getByText('Change Password'));
    await wait();
  });

  test('Testing forgot password functionality, if the otp got deleted from the local storage', async () => {
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
=======
      formData.confirmNewPassword
    );
    localStorage.setItem('otpToken', 'lorem ipsum');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
<<<<<<< HEAD
      formData.confirmNewPassword,
=======
      formData.confirmNewPassword
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByText('Change Password'));
  });

<<<<<<< HEAD
  test('Testing forgot password functionality, when the user is not found', async () => {
    const formData = {
      email: 'notexists@gmail.com',
    };
    // setItem('otpToken', '');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ToastContainer />
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

    expect(
      await screen.findByText(translations.emailNotRegistered),
    ).toBeInTheDocument();
  });

  test('Testing forgot password functionality, when there is an error except unregistered email and api failure', async () => {
    render(
      <MockedProvider addTypename={false} link={notWorkingLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ToastContainer />
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    expect(
      await screen.findByText(translations.errorSendingMail),
    ).toBeInTheDocument();
  });

  test('Testing forgot password functionality, when talawa api failed', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
    };
    render(
      <MockedProvider addTypename={false} link={talawaApiUnavailableLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ToastContainer />
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

    expect(
      await screen.findByText(translations.talawaApiUnavailable),
    ).toBeInTheDocument();
  });

=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  test('Testing forgot password functionality, when otp token is not present', async () => {
    const formData = {
      userOtp: '12345',
      newPassword: 'johnDoe',
      confirmNewPassword: 'johnDoe',
      email: 'johndoe@gmail.com',
    };

<<<<<<< HEAD
    setItem('otpToken', '');
=======
    localStorage.setItem('otpToken', '');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
<<<<<<< HEAD
            <I18nextProvider i18n={i18n}>
=======
            <I18nextProvider i18n={i18nForTest}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              <ForgotPassword />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/Registered email/i),
<<<<<<< HEAD
      formData.email,
=======
      formData.email
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    userEvent.click(screen.getByText('Get OTP'));
    await wait();

    userEvent.type(screen.getByPlaceholderText('e.g. 12345'), formData.userOtp);
    userEvent.type(screen.getByTestId('newPassword'), formData.newPassword);
    userEvent.type(
      screen.getByTestId('confirmNewPassword'),
<<<<<<< HEAD
      formData.confirmNewPassword,
=======
      formData.confirmNewPassword
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    userEvent.click(screen.getByText('Change Password'));
  });
});

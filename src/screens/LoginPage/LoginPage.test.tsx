import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import 'jest-localstorage-mock';
import 'jest-location-mock';
import { StaticMockLink } from 'utils/StaticMockLink';
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

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('Constant/constant.ts', () => ({
  ...jest.requireActual('Constant/constant.ts'),
  REACT_APP_USE_RECAPTCHA: 'yes',
  RECAPTCHA_SITE_KEY: 'xxx',
}));

describe('Talawa-API server fetch check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Checks if Talawa-API resource is loaded successfully', async () => {
    global.fetch = jest.fn(() => Promise.resolve({} as unknown as Response));

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/graphql/');
  });

  test('displays warning message when resource loading fails', async () => {
    const mockError = new Error('Network error');
    global.fetch = jest.fn(() => Promise.reject(mockError));

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <LoginPage />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/graphql/');
  });
});

describe('Testing Login Page Screen', () => {
  test('Component Should be rendered properly', async () => {
    window.location.assign('/orglist');

    render(
      <MockedProvider addTypename={false} link={link}>
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

    expect(screen.getByText(/Admin Portal/i)).toBeInTheDocument();
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    await wait();

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last name/i),
      formData.lastName
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
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
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId(/goToRegisterPortion/i));

    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName
    );
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName
    );
    userEvent.type(screen.getByTestId(/signInEmail/i), formData.email);
    userEvent.type(screen.getByPlaceholderText('Password'), formData.password);
    userEvent.type(
      screen.getByPlaceholderText('Confirm Password'),
      formData.confirmPassword
    );

    userEvent.click(screen.getByTestId('registrationBtn'));
  });

  test('Testing toggle login register portion', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.click(screen.getByTestId('goToLoginPortion'));

    await wait();
  });

  test('Testing login functionality', async () => {
    const formData = {
      email: 'johndoe@gmail.com',
      password: 'johndoe',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password
    );

    userEvent.click(screen.getByTestId('loginBtn'));

    await wait();
  });

  test('Testing password preview feature for login', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    const input = screen.getByTestId('password') as HTMLInputElement;
    const toggleText = screen.getByTestId('showLoginPassword');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing password preview feature for register', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    const input = screen.getByTestId('passwordField') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPassword');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing confirm password preview feature', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    const input = screen.getByTestId('cpassword') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPasswordCon');
    // password should be hidden
    expect(input.type).toBe('password');
    // click the toggle button to show password
    userEvent.click(toggleText);
    expect(input.type).toBe('text');
    // click the toggle button to hide password
    userEvent.click(toggleText);
    expect(input.type).toBe('password');

    await wait();
  });

  test('Testing for the password error warning when user firsts lands on a page', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  test('Testing for the password error warning when user clicks on password field and password is less than 8 character', async () => {
    const password = {
      password: '7',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(screen.getByTestId('passwordField')).toHaveFocus();

    expect(password.password.length).toBeLessThan(8);

    expect(screen.queryByTestId('passwordCheck')).toBeInTheDocument();
  });

  test('Testing for the password error warning when user clicks on password field and password is greater than or equal to 8 character', async () => {
    const password = {
      password: '12345678',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(screen.getByTestId('passwordField')).toHaveFocus();

    expect(password.password.length).toBeGreaterThanOrEqual(8);

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  test('Testing for the password error warning when user clicks on fields except password field and password is less than 8 character', async () => {
    const password = {
      password: '7',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    expect(screen.getByPlaceholderText('Password')).not.toHaveFocus();

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(password.password.length).toBeLessThan(8);

    expect(screen.queryByTestId('passwordCheck')).toBeInTheDocument();
  });

  test('Testing for the password error warning when user clicks on fields except password field and password is greater than or equal to 8 character', async () => {
    const password = {
      password: '12345678',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
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

    userEvent.click(screen.getByTestId('goToRegisterPortion'));

    await wait();

    expect(screen.getByPlaceholderText('Password')).not.toHaveFocus();

    userEvent.type(screen.getByPlaceholderText('Password'), password.password);

    expect(password.password.length).toBeGreaterThanOrEqual(8);

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });
});

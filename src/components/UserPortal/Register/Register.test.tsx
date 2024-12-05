import type { SetStateAction } from 'react';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Register from './Register';
import { toast } from 'react-toastify';

const MOCKS = [
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
        signUp: {
          user: {
            _id: '1',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
];

const formData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'johnDoe',
  confirmPassword: 'johnDoe',
};

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

const setCurrentMode: React.Dispatch<SetStateAction<string>> = jest.fn();

const props = {
  setCurrentMode,
};

describe('Testing Register Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  test('Expect the mode to be changed to Login', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const user = userEvent.setup();
    await user.click(screen.getByTestId('setLoginBtn'));

    expect(setCurrentMode).toHaveBeenCalledWith('login');
  });

  test('Expect toast.error to be called if email input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const user = userEvent.setup();
    await user.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  test('Expect toast.error to be called if password input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  test('Expect toast.error to be called if first name input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);

    userEvent.type(screen.getByTestId('emailInput'), formData.email);

    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  test('Expect toast.error to be called if last name input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);

    userEvent.type(screen.getByTestId('emailInput'), formData.email);

    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);

    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  test("Expect toast.error to be called if confirmPassword doesn't match with password", async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('passwordInput'), formData.password);

    await user.type(screen.getByTestId('emailInput'), formData.email);

    await user.type(screen.getByTestId('firstNameInput'), formData.firstName);

    await user.type(screen.getByTestId('lastNameInput'), formData.lastName);

    await user.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      "Password doesn't match. Confirm Password and try again.",
    );
  });

  test('Expect toast.success to be called if valid credentials are entered.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const user = userEvent.setup();
    await user.type(screen.getByTestId('passwordInput'), formData.password);

    await user.type(
      screen.getByTestId('confirmPasswordInput'),
      formData.confirmPassword,
    );

    await user.type(screen.getByTestId('emailInput'), formData.email);

    await user.type(screen.getByTestId('firstNameInput'), formData.firstName);

    await user.type(screen.getByTestId('lastNameInput'), formData.lastName);

    await user.click(screen.getByTestId('registerBtn'));

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully registered. Please wait for admin to approve your request.',
    );
  });
});

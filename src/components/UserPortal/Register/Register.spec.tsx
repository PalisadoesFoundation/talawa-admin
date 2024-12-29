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
import { vi } from 'vitest';

/**
 * Unit tests for the Register component.
 *
 * 1. **Render test**: Verifies proper rendering of the Register component.
 * 2. **Mode switch to Login**: Ensures that clicking the "setLoginBtn" changes mode to 'login'.
 * 3. **Empty email validation**: Checks if toast.error is triggered for empty email.
 * 4. **Empty password validation**: Ensures toast.error is called for empty password.
 * 5. **Empty first name validation**: Ensures toast.error is called if first name is missing.
 * 6. **Empty last name validation**: Verifies toast.error is triggered if last name is missing.
 * 7. **Password mismatch validation**: Verifies toast.error is shown if confirm password doesn't match.
 * 8. **Successful registration**: Confirms that toast.success is called when valid credentials are entered.
 *
 * GraphQL mock data is used for testing user registration functionality.
 */

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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

const setCurrentMode: React.Dispatch<SetStateAction<string>> = vi.fn();

const props = {
  setCurrentMode,
};

describe('Testing Register Component [User Portal]', () => {
  it('Component should be rendered properly', async () => {
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

  it('Expect the mode to be changed to Login', async () => {
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

    userEvent.click(screen.getByTestId('setLoginBtn'));

    expect(setCurrentMode).toHaveBeenCalledWith('login');
  });

  it('Expect toast.error to be called if email input is empty', async () => {
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

    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  it('Expect toast.error to be called if password input is empty', async () => {
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

  it('Expect toast.error to be called if first name input is empty', async () => {
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

  it('Expect toast.error to be called if last name input is empty', async () => {
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

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);

    userEvent.type(screen.getByTestId('emailInput'), formData.email);

    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);

    userEvent.type(screen.getByTestId('lastNameInput'), formData.lastName);

    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      "Password doesn't match. Confirm Password and try again.",
    );
  });

  it('Expect toast.success to be called if valid credentials are entered.', async () => {
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

    userEvent.type(
      screen.getByTestId('confirmPasswordInput'),
      formData.confirmPassword,
    );

    userEvent.type(screen.getByTestId('emailInput'), formData.email);

    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);

    userEvent.type(screen.getByTestId('lastNameInput'), formData.lastName);

    userEvent.click(screen.getByTestId('registerBtn'));

    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully registered. Please wait for admin to approve your request.',
    );
  });
});

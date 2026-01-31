import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { StaticMockLink } from 'utils/StaticMockLink';
import { LoginForm } from './LoginForm';
import { RECAPTCHA_MUTATION } from 'GraphQl/Mutations/mutations';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { vi, beforeEach, expect, it, describe } from 'vitest';

const MOCKS = [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'johndoe@gmail.com', password: 'johndoe' },
    },
    result: {
      data: {
        signIn: {
          user: {
            id: '1',
            role: 'administrator',
            name: 'John Doe',
            emailAddress: 'johndoe@gmail.com',
            countryCode: 'US',
            avatarURL: 'https://example.com/avatar.jpg',
          },
          authenticationToken: 'authenticationToken',
        },
      },
    },
  },
  {
    request: { query: RECAPTCHA_MUTATION, variables: { recaptchaToken: null } },
    result: { data: { recaptcha: true } },
  },
];

const ERROR_MOCKS = [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'johndoe@gmail.com', password: 'johndoe1' },
    },
    error: new Error('Invalid credentials'),
  },
  {
    request: { query: RECAPTCHA_MUTATION, variables: { recaptchaToken: null } },
    result: { data: { recaptcha: true } },
  },
];

const USER_MOCKS = [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'user@gmail.com', password: 'password' },
    },
    result: {
      data: {
        signIn: {
          user: {
            id: '2',
            role: 'user',
            name: 'Regular User',
            emailAddress: 'user@gmail.com',
            countryCode: 'US',
            avatarURL: '',
          },
          authenticationToken: 'userToken',
        },
      },
    },
  },
  {
    request: { query: RECAPTCHA_MUTATION, variables: { recaptchaToken: null } },
    result: { data: { recaptcha: true } },
  },
];

const link = new StaticMockLink(MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);
const userLink = new StaticMockLink(USER_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('LoginForm Component', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={false} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('loginEmail')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('loginBtn')).toBeInTheDocument();
  });

  it('renders admin login form', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={true} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
  });

  it('renders user login form', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={false} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/User Login/i)).toBeInTheDocument();
  });

  it('Testing password preview feature for login', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={false} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('password') as HTMLInputElement;
    const toggleText = screen.getByTestId('showLoginPassword');
    expect(input.type).toBe('password');
    await userEvent.click(toggleText);
    expect(input.type).toBe('text');
    await userEvent.click(toggleText);
    expect(input.type).toBe('password');
  });

  it('Testing login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe' };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={false} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    await userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password,
    );

    await userEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        user: {
          id: '1',
          role: 'administrator',
          name: 'John Doe',
          emailAddress: 'johndoe@gmail.com',
          countryCode: 'US',
          avatarURL: 'https://example.com/avatar.jpg',
        },
        authenticationToken: 'authenticationToken',
      });
    });
  });

  it('Testing wrong login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe1' };

    render(
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={false} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    await userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password,
    );

    await userEvent.click(screen.getByTestId('loginBtn'));

    await wait();

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('prevents non-admin user from accessing admin login', async () => {
    const formData = { email: 'user@gmail.com', password: 'password' };

    render(
      <MockedProvider addTypename={false} link={userLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <LoginForm isAdmin={true} onSuccess={mockOnSuccess} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    await userEvent.type(
      screen.getByPlaceholderText(/Enter Password/i),
      formData.password,
    );

    await userEvent.click(screen.getByTestId('loginBtn'));

    await wait();

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});

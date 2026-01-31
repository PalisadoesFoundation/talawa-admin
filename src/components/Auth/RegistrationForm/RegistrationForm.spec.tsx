import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { StaticMockLink } from 'utils/StaticMockLink';
import { RegistrationForm } from './RegistrationForm';
import {
  SIGNUP_MUTATION,
  RECAPTCHA_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { vi, beforeEach, expect, it, describe } from 'vitest';

const MOCKS = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'Johndoe@123',
      },
    },
    result: {
      data: {
        signUp: {
          user: {
            id: '1',
            name: 'John Doe',
            emailAddress: 'johndoe@gmail.com',
            role: 'user',
            avatarURL: '',
            countryCode: 'US',
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

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('RegistrationForm Component', () => {
  const mockOnSuccess = vi.fn();
  const organizations = [
    {
      label: 'Unity Foundation(123 Random Street)',
      id: '6437904485008f171cf29924',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <RegistrationForm
                organizations={organizations}
                onSuccess={mockOnSuccess}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('signInEmail')).toBeInTheDocument();
    expect(screen.getByTestId('passwordField')).toBeInTheDocument();
    expect(screen.getByTestId('cpassword')).toBeInTheDocument();
    expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
  });

  it('Testing password preview feature for register', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <RegistrationForm
                organizations={organizations}
                onSuccess={mockOnSuccess}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('passwordField') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPassword');
    expect(input.type).toBe('password');
    await userEvent.click(toggleText);
    expect(input.type).toBe('text');
    await userEvent.click(toggleText);
    expect(input.type).toBe('password');
  });

  it('Testing confirm password preview feature', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <RegistrationForm
                organizations={organizations}
                onSuccess={mockOnSuccess}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('cpassword') as HTMLInputElement;
    const toggleText = screen.getByTestId('showPasswordCon');
    expect(input.type).toBe('password');
    await userEvent.click(toggleText);
    expect(input.type).toBe('text');
    await userEvent.click(toggleText);
    expect(input.type).toBe('password');
  });

  it('Testing registration functionality', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <RegistrationForm
                organizations={organizations}
                onSuccess={mockOnSuccess}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.type(screen.getByPlaceholderText(/Name/i), 'John Doe');
    await userEvent.type(
      screen.getByTestId('signInEmail'),
      'johndoe@gmail.com',
    );
    await userEvent.type(screen.getByTestId('passwordField'), 'Johndoe@123');
    await userEvent.type(screen.getByTestId('cpassword'), 'Johndoe@123');

    await userEvent.click(screen.getByTestId('registrationBtn'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        user: {
          id: '1',
          name: 'John Doe',
          emailAddress: 'johndoe@gmail.com',
          role: 'user',
          avatarURL: '',
          countryCode: 'US',
        },
        authenticationToken: 'authenticationToken',
      });
    });
  });
});

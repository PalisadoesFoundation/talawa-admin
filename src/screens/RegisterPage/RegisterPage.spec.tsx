import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import RegisterPage from './RegisterPage';
import {
  ORGANIZATION_LIST_NO_MEMBERS,
  GET_COMMUNITY_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

// Mock Data
const mocks = [
  {
    request: {
      query: ORGANIZATION_LIST_NO_MEMBERS,
    },
    result: {
      data: {
        organizations: [
          { id: '1', name: 'Org 1', addressLine1: 'Address 1' },
          { id: '2', name: 'Org 2', addressLine1: 'Address 2' },
        ],
      },
    },
  },
  {
    request: {
      query: GET_COMMUNITY_DATA_PG,
    },
    result: {
      data: {
        community: {
          id: 'community-1',
          logoURL: 'https://example.com/logo.png',
          logoMimeType: 'image/png',
          name: 'Test Community',
          websiteURL: 'https://example.com',
        },
      },
    },
  },
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '1',
        email: 'john@example.com',
        password: 'Abc@1234',
        name: 'John Doe',
      },
    },
    result: {
      data: {
        signUp: {
          authenticationToken: 'test-token',
          user: {
            id: 'user-123',
          },
        },
      },
    },
  },
];

// Helper Renderer
const renderComponent = () => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <RegisterPage />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('RegisterPage Component', () => {
  it('should render register page', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('register-text')).toBeInTheDocument();
    });
  });

  it('should show community branding when available', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByTestId('preLoginLogo')).toBeInTheDocument();
    });
  });

  it('should submit registration successfully', async () => {
    renderComponent();

    // Fill First Name
    const firstNameInput = await screen.findByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Fill Last Name
    const lastNameInput = await screen.findByPlaceholderText('Last Name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    // Fill Email
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, {
      target: { value: 'john@example.com' },
    });

    // Fill Password
    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (!pwdNativeInput) throw new Error('Password input not found');
    fireEvent.change(pwdNativeInput, {
      target: { value: 'Abc@1234' },
    });

    // Fill Confirm Password
    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (!confirmNativeInput)
      throw new Error('Confirm password input not found');
    fireEvent.change(confirmNativeInput, {
      target: { value: 'Abc@1234' },
    });

    // Select Organization
    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    // Submit form
    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

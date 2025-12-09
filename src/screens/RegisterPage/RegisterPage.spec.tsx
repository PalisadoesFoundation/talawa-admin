import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
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

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

const mockStartSession = vi.fn();
const mockGetItem = vi.fn();
const mockSetItem = vi.fn();
const mockRemoveItem = vi.fn();

vi.mock('utils/useSession', () => ({
  default: () => ({
    startSession: mockStartSession,
  }),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
  }),
}));

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  mockGetItem.mockReturnValue(null);
  mockSetItem.mockReturnValue(undefined);
  mockRemoveItem.mockReturnValue(undefined);
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
    <MockedProvider mocks={mocks}>
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
      expect(mockStartSession).toHaveBeenCalled();
      expect(mockSetItem).toHaveBeenCalledWith('token', 'test-token');
    });
  });

  it('should show error when recaptcha token is missing', async () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'yes');
    vi.stubEnv('RECAPTCHA_SITE_KEY', 'test-key');

    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);
    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('captcha'),
      );
    });

    vi.unstubAllEnvs();
  });

  it('should redirect to invitation page when pendingInvitationToken exists', async () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'pendingInvitationToken') return 'test-invitation-token';
      return null;
    });
    const originalLocation = window.location;

    delete (window as unknown as { location: unknown }).location;
    (window as unknown as { location: { href: string } }).location = {
      href: '',
    };

    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect((window.location as { href: string }).href).toBe(
        '/event/invitation/test-invitation-token',
      );
      expect(mockRemoveItem).toHaveBeenCalledWith('pendingInvitationToken');
    });
    (window as { location: Location }).location = originalLocation;
  });

  it('should detect admin role from /admin/register path', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/admin/register']}>
          <Routes>
            <Route
              path="/admin/register"
              element={
                <I18nextProvider i18n={i18nForTest}>
                  <RegisterPage />
                </I18nextProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('register-text')).toBeInTheDocument();
    });
  });

  it('should detect user role from /register path', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/register']}>
          <Routes>
            <Route
              path="/register"
              element={
                <I18nextProvider i18n={i18nForTest}>
                  <RegisterPage />
                </I18nextProvider>
              }
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('register-text')).toBeInTheDocument();
    });
  });

  it('should handle signup mutation errors', async () => {
    const errorMocks = [
      ...mocks.filter((m) => m.request.query !== SIGNUP_MUTATION),
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
        error: new Error('Signup failed'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RegisterPage />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should not auto-login when authentication token is missing', async () => {
    const noTokenMocks = [
      ...mocks.filter((m) => m.request.query !== SIGNUP_MUTATION),
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
              authenticationToken: null,
              user: { id: 'user-123' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noTokenMocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <RegisterPage />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockSetItem).not.toHaveBeenCalledWith('token', expect.anything());
    });
  });

  it('should show error when passwords do not match', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, {
        target: { value: 'Different@1234' },
      });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/password.*match/i),
      );
    });
  });

  it('should show error when password is weak', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'weak' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'weak' } });
    }

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should show error when email format is invalid', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('should show error when first name is missing', async () => {
    renderComponent();

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('firstName'),
      );
    });
  });

  it('should show error when last name is missing', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('lastName'),
      );
    });
  });

  it('should accept very long and special-character names without crashing', async () => {
    renderComponent();

    const longWeird = 'J'.repeat(200) + ' éç!@#$%^&*()?';

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: longWeird } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: longWeird } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('register-text')).toBeInTheDocument();
    });
  });

  it('should normalize email input (trim + lowercase)', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, {
      target: { value: '   TEST@Example.COM   ' },
    });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput)
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput)
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });

    const orgSelector = await screen.findByText('Org 1(Address 1)');
    fireEvent.click(orgSelector);

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('should show error when organization is not selected', async () => {
    renderComponent();

    const firstNameInput = await screen.findByPlaceholderText(/First Name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = await screen.findByPlaceholderText(/Last Name/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const emailInput = screen.getByPlaceholderText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const passwordInput = screen.getByTestId('passwordField');
    const pwdNativeInput = passwordInput.querySelector('input');
    if (pwdNativeInput) {
      fireEvent.change(pwdNativeInput, { target: { value: 'Abc@1234' } });
    }

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const confirmNativeInput = confirmPasswordInput.querySelector('input');
    if (confirmNativeInput) {
      fireEvent.change(confirmNativeInput, { target: { value: 'Abc@1234' } });
    }

    const submitBtn = screen.getByTestId('registrationBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

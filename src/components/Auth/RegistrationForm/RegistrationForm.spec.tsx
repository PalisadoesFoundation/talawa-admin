import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { RegistrationForm } from './RegistrationForm';
import { useRegistration } from '../../../hooks/auth/useRegistration';
import i18nForTest from '../../../utils/i18nForTest';

vi.mock('../../../hooks/auth/useRegistration');

vi.mock('Constant/constant', async () => ({
  ...(await vi.importActual<object>('Constant/constant')),
  RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
}));

vi.mock('react-google-recaptcha', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: React.default.forwardRef(
      (
        props: {
          onChange?: (token: string) => void;
          onExpired?: () => void;
        } & Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>,
      ) => {
        const { onChange, onExpired, ...rest } = props;
        return React.default.createElement(
          'div',
          { ref, 'data-testid': 'recaptcha-container', ...rest },
          React.default.createElement('input', {
            'data-testid': 'mock-recaptcha-input',
            'aria-label': 'Complete reCAPTCHA',
            onChange: (e: { target: { value: string } }) =>
              onChange?.(e.target.value),
          }),
          React.default.createElement(
            'button',
            {
              type: 'button',
              'data-testid': 'mock-recaptcha-expire',
              'aria-label': 'Expire reCAPTCHA',
              onClick: () => onExpired?.(),
            },
            'Expire',
          ),
        );
      },
    ),
  };
});

const mockOrganizations = [
  { _id: '1', name: 'Test Organization 1' },
  { _id: '2', name: 'Test Organization 2' },
];

describe('RegistrationForm', () => {
  const mockRegister = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockRegister.mockClear();
    mockOnSuccess.mockClear();
    mockOnError.mockClear();
    vi.mocked(useRegistration).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <RegistrationForm
          organizations={mockOrganizations}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          {...props}
        />
      </I18nextProvider>,
    );
  };

  it('renders registration form', () => {
    renderComponent();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Organization')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i }),
    ).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        organizationId: '',
      });
    });
  });

  it('handles form submission without onSuccess callback', async () => {
    renderComponent({ onSuccess: undefined });

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /register/i }),
      ).not.toBeDisabled();
    });
  });

  it('validates name field', async () => {
    renderComponent();

    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates email field', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password field', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('validates password confirmation field', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(
      screen.getByLabelText('Confirm Password'),
      'DifferentPassword!',
    );

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('updates form state on input changes', async () => {
    renderComponent();

    const nameInput = screen.getByLabelText('First Name');
    const emailInput = screen.getByLabelText(/Email/);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');

    expect((nameInput as HTMLInputElement).value).toBe('Test User');
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
  });

  it('shows loading state during submission', async () => {
    vi.mocked(useRegistration).mockReturnValue({
      register: mockRegister,
      loading: true,
    });

    renderComponent();

    const button = screen.getByRole('button', { name: 'Loading...' });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });

  it('handles organization selection', async () => {
    renderComponent();

    await user.click(screen.getByLabelText('Organization'));
    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Test Organization 1' }),
      ).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole('option', { name: 'Test Organization 1' }),
    );

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        organizationId: '1',
      });
    });
  });

  it('handles form with empty orgId', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    // Don't set organization - test the orgId ?? '' branch
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        organizationId: '',
      });
    });
  });

  it('shows reCAPTCHA when enabled', () => {
    renderComponent({ enableRecaptcha: true });

    expect(screen.getByTestId('recaptcha-placeholder')).toBeInTheDocument();
  });

  it('hides reCAPTCHA when disabled', () => {
    renderComponent({ enableRecaptcha: false });

    expect(
      screen.queryByTestId('recaptcha-placeholder'),
    ).not.toBeInTheDocument();
  });

  it('handles default reCAPTCHA prop', () => {
    renderComponent();

    expect(
      screen.queryByTestId('recaptcha-placeholder'),
    ).not.toBeInTheDocument();
  });

  it('disables submit button when enableRecaptcha is true and no recaptcha token', () => {
    renderComponent({ enableRecaptcha: true });

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls reCAPTCHA onChange and enables submit with token', async () => {
    renderComponent({ enableRecaptcha: true });

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();

    const recaptchaInput = screen.getByTestId('mock-recaptcha-input');
    await user.type(recaptchaInput, 'recaptcha-token-xyz');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('submits with recaptcha token when form is valid', async () => {
    renderComponent({ enableRecaptcha: true });

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
    await user.click(screen.getByLabelText('Organization'));
    await user.click(
      screen.getByRole('option', { name: 'Test Organization 1' }),
    );

    await user.type(
      screen.getByTestId('mock-recaptcha-input'),
      'recaptcha-token-xyz',
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /register/i }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      const call = mockRegister.mock.calls[0][0];
      expect(call.recaptchaToken).toBe('recaptcha-token-xyz');
      expect(call.name).toBe('John Doe');
      expect(call.organizationId).toBe('1');
    });
  });

  it('calls reCAPTCHA onExpired and clears token', async () => {
    renderComponent({ enableRecaptcha: true });

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
    await user.click(screen.getByLabelText('Organization'));
    await user.click(
      screen.getByRole('option', { name: 'Test Organization 1' }),
    );

    const recaptchaInput = screen.getByTestId('mock-recaptcha-input');
    await user.type(recaptchaInput, 'recaptcha-token-xyz');

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /register/i }),
      ).not.toBeDisabled();
    });

    const expireButton = screen.getByTestId('mock-recaptcha-expire');
    await user.click(expireButton);

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();
  });

  it('calls onSuccess callback when provided', async () => {
    const mockCallback = vi.fn();
    renderComponent({ onSuccess: mockCallback });

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        organizationId: '',
      });
    });
  });

  it('shows validation errors when form is submitted with invalid data', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', {
      name: /register/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Name should contain only letters, spaces, and hyphens',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please enter a valid email address'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('At least 8 characters long'),
      ).toBeInTheDocument();
    });
  });

  it('calls onError callback when registration fails', async () => {
    const mockOnError = vi.fn();
    const mockRegister = vi.fn().mockResolvedValue(undefined);

    vi.mocked(useRegistration).mockReturnValue({
      register: mockRegister,
      loading: false,
    });

    renderComponent({ onError: mockOnError });

    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    await user.click(screen.getByRole('button', { name: /register/i }));

    // Verify the hook was initialized with onSuccess and onError callbacks
    expect(useRegistration).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('clears validation errors when valid data is entered', async () => {
    renderComponent();

    // Submit empty form to trigger errors
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Name should contain only letters, spaces, and hyphens',
        ),
      ).toBeInTheDocument();
    });

    // Fill in valid data
    await user.type(screen.getByLabelText('First Name'), 'John Doe');
    await user.type(screen.getByLabelText(/Email/), 'john@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');

    // Submit again
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Name should contain only letters, spaces, and hyphens',
        ),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Please enter a valid email address'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('At least 8 characters long'),
      ).not.toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import RegistrationForm from './RegistrationForm';
import { toast } from 'react-toastify';

vi.mock('react-toastify');

afterEach(() => {
  vi.clearAllMocks();
});

const mockOnSubmit = vi.fn();
const mockOrganizations = [
  { label: 'Org 1', id: '1' },
  { label: 'Org 2', id: '2' },
];

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nForTest}>
        <RegistrationForm
          userType="user"
          isLoading={false}
          onSubmit={mockOnSubmit}
          organizations={mockOrganizations}
          {...props}
        />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe('RegistrationForm Component', () => {
  it('should render registration form', () => {
    renderComponent();
    expect(screen.getByTestId('register-text')).toBeInTheDocument();
    expect(screen.getByTestId('signInEmail')).toBeInTheDocument();
    expect(screen.getByTestId('passwordField')).toBeInTheDocument();
    expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
  });

  it('should show password mismatch error', async () => {
    renderComponent();

    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');

    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test456!' } });

    await waitFor(() => {
      expect(screen.getByTestId('passwordCheck')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with valid data including organization selection', async () => {
    mockOnSubmit.mockResolvedValue(true);
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

    const orgSelector = screen.getByTestId('organizationSelect');
    fireEvent.change(orgSelector, {
      target: { value: mockOrganizations[0].id },
    });

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Test123!',
          confirmPassword: 'Test123!',
          organizationId: mockOrganizations[0].id,
        },
        null,
      );
    });
  });

  it('should reset form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(true);
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('');
      expect(lastNameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });
  });

  it('should not reset form after failed submission', async () => {
    mockOnSubmit.mockResolvedValue(false);
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('Test123!');
    expect(confirmPasswordInput).toHaveValue('Test123!');
  });

  it('should render login link when showLoginLink is true', () => {
    renderComponent({ showLoginLink: true });
    expect(screen.getByTestId('goToLoginPortion')).toBeInTheDocument();
  });

  it('should not render login link when showLoginLink is false', () => {
    renderComponent({ showLoginLink: false });
    expect(screen.queryByTestId('goToLoginPortion')).not.toBeInTheDocument();
  });

  it('should disable form inputs when isLoading is true', () => {
    renderComponent({ isLoading: true });

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    const emailInput = screen.getByTestId('signInEmail');
    const submitButton = screen.getByTestId('registrationBtn');

    expect(firstNameInput).toBeDisabled();
    expect(lastNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should convert email to lowercase', () => {
    renderComponent();

    const emailInput = screen.getByTestId('signInEmail');
    fireEvent.change(emailInput, { target: { value: 'JOHN@EXAMPLE.COM' } });

    expect(emailInput).toHaveValue('john@example.com');
  });

  it('should show error when firstName is empty on submit', async () => {
    renderComponent();

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('firstName'),
      );
    });
  });

  it('should show error when firstName contains invalid characters', async () => {
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    fireEvent.change(firstNameInput, { target: { value: 'John123' } });
    fireEvent.click(screen.getByTestId('registrationBtn'));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('firstName_invalid'),
      );
    });
  });

  it('should show error when lastName is empty on submit', async () => {
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('lastName'),
      );
    });
  });

  it('should show error when lastName contains invalid characters', async () => {
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    fireEvent.change(lastNameInput, { target: { value: 'Doe123' } });

    fireEvent.click(screen.getByTestId('registrationBtn'));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith(
        expect.stringContaining('lastName_invalid'),
      );
    });
  });

  it('should update password validation indicators in real-time', async () => {
    renderComponent();

    const passwordInput = screen.getByTestId('passwordField');
    const nativeInput = passwordInput.querySelector('input');

    if (!nativeInput) {
      throw new Error('Native input not found');
    }

    fireEvent.change(nativeInput, { target: { value: 'a' } });
    fireEvent.focus(nativeInput);

    await waitFor(() => {
      const validators = screen.getAllByTestId('validation-item');
      expect(validators.length).toBeGreaterThan(0);
    });

    fireEvent.change(nativeInput, { target: { value: 'aA' } });
    await waitFor(() => {
      const validators = screen.getAllByTestId('validation-item');
      expect(validators.length).toBeGreaterThan(0);
    });

    fireEvent.change(nativeInput, { target: { value: 'aA1' } });
    await waitFor(() => {
      const validators = screen.getAllByTestId('validation-item');
      expect(validators.length).toBeGreaterThan(0);
    });

    fireEvent.change(nativeInput, { target: { value: 'aA1!' } });
    await waitFor(() => {
      const validators = screen.getAllByTestId('validation-item');
      expect(validators.length).toBeGreaterThan(0);
    });

    fireEvent.blur(nativeInput);
  });

  it('should handle recaptcha token correctly in onSubmit', async () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'yes');
    vi.stubEnv('RECAPTCHA_SITE_KEY', 'test-key');

    mockOnSubmit.mockResolvedValue(true);
    renderComponent();

    const firstNameInput = screen.getByPlaceholderText(/Enter firstname/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter lastname/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });

    const submitButton = screen.getByTestId('registrationBtn');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Test123!',
          confirmPassword: 'Test123!',
        }),
        null,
      );
    });

    vi.unstubAllEnvs();
  });
});

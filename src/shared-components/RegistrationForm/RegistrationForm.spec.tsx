import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import RegistrationForm from './RegistrationForm';

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
          role="user"
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
      expect(
        screen.getByText(/Password_and_Confirm_password_mismatches/i),
      ).toBeInTheDocument();
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

    const orgSelector = screen.getByRole('combobox');
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
});

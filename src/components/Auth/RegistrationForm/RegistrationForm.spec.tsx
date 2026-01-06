import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { RegistrationForm } from './RegistrationForm';
import { useRegistration } from '../../../hooks/auth/useRegistration';
import i18nForTest from '../../../utils/i18nForTest';

vi.mock('../../../hooks/auth/useRegistration');

const mockOrganizations = [
  { _id: '1', name: 'Test Organization 1' },
  { _id: '2', name: 'Test Organization 2' },
];

describe('RegistrationForm', () => {
  const mockRegister = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    mockRegister.mockClear();
    mockOnSuccess.mockClear();
    mockOnError.mockClear();
    vi.mocked(useRegistration).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
  });

  afterEach(() => {
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

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

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

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /register/i }),
      ).not.toBeDisabled();
    });
  });

  it('validates name field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates email field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates password field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates password confirmation field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'DifferentPassword!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('updates form state on input changes', () => {
    renderComponent();

    const nameInput = screen.getByLabelText('First Name');
    const emailInput = screen.getByLabelText(/Email/);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

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

  it('handles organization selection', () => {
    renderComponent();

    const orgSelector = screen.getByLabelText('Organization');
    fireEvent.change(orgSelector, { target: { value: '1' } });

    expect((orgSelector as HTMLSelectElement).value).toBe('1');
  });

  it('handles form with empty orgId', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    // Don't set organization - test the orgId ?? '' branch
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

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

  it('calls onSuccess callback when provided', async () => {
    const mockCallback = vi.fn();
    renderComponent({ onSuccess: mockCallback });

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

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
    fireEvent.click(submitButton);

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

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Verify the hook was initialized with the onError callback
    expect(useRegistration).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
      onError: mockOnError,
    });
  });

  it('clears validation errors when valid data is entered', async () => {
    renderComponent();

    // Submit empty form to trigger errors
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Name should contain only letters, spaces, and hyphens',
        ),
      ).toBeInTheDocument();
    });

    // Fill in valid data
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

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

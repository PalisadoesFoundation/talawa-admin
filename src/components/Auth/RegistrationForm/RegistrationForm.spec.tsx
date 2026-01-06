import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { RegistrationForm } from './RegistrationForm';
import i18nForTest from '../../../utils/i18nForTest';

const mockOrganizations = [
  { _id: '1', name: 'Test Organization 1' },
  { _id: '2', name: 'Test Organization 2' },
];

describe('RegistrationForm', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

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
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText('Name'), {
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

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles form submission without onSuccess callback', async () => {
    renderComponent({ onSuccess: undefined });

    fireEvent.change(screen.getByLabelText('Name'), {
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

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create account/i }),
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

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates email field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates password field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('validates password confirmation field', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Name'), {
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

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('updates form state on input changes', () => {
    renderComponent();

    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText(/Email/);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect((nameInput as HTMLInputElement).value).toBe('Test User');
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
  });

  it('shows loading state during submission', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Name'), {
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

    const button = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles organization selection', () => {
    renderComponent();

    const orgSelector = screen.getByLabelText('Organization');
    fireEvent.change(orgSelector, { target: { value: '1' } });

    expect((orgSelector as HTMLSelectElement).value).toBe('1');
  });

  it('handles form with empty orgId', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText('Name'), {
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
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows reCAPTCHA when enabled', () => {
    renderComponent({ enableRecaptcha: true });

    expect(screen.getByTestId('recaptcha-placeholder')).toBeInTheDocument();
    expect(screen.getByText('reCAPTCHA integration ready')).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText('Name'), {
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

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('shows validation errors when form is submitted with invalid data', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Valid email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('clears validation errors when valid data is entered', async () => {
    renderComponent();

    // Submit empty form to trigger errors
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    // Fill in valid data
    fireEvent.change(screen.getByLabelText('Name'), {
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
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Valid email is required'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Password is required'),
      ).not.toBeInTheDocument();
    });
  });
});

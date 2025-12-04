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
  beforeEach(() => {
    mockOnSubmit.mockClear();
    vi.clearAllMocks();
  });

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

  it('should call onSubmit with valid data', async () => {
    renderComponent();

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');
    const confirmPasswordInput = screen.getByTestId('cpassword');
    const submitButton = screen.getByTestId('registrationBtn');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import LoginForm from './LoginForm';

const mockOnSubmit = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18nForTest}>
        <LoginForm
          role="user"
          isLoading={false}
          onSubmit={mockOnSubmit}
          {...props}
        />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render login form', () => {
    renderComponent();
    expect(screen.getByTestId('loginEmail')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('loginBtn')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    renderComponent();

    const emailInput = screen.getByTestId('loginEmail');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByTestId('loginBtn');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        null,
      );
    });
  });

  it('should show register link when showRegisterLink is true', () => {
    renderComponent({ showRegisterLink: true });
    expect(screen.getByTestId('goToRegisterPortion')).toBeInTheDocument();
  });

  it('should not show register link when showRegisterLink is false', () => {
    renderComponent({ showRegisterLink: false });
    expect(screen.queryByTestId('goToRegisterPortion')).not.toBeInTheDocument();
  });
});

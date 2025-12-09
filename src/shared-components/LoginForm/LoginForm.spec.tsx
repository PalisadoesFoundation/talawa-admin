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

  it('should render recaptcha when REACT_APP_USE_RECAPTCHA is yes and RECAPTCHA_SITE_KEY exists', () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'yes');
    vi.stubEnv('RECAPTCHA_SITE_KEY', 'test-site-key');

    renderComponent();

    const recaptchaContainer = document.querySelector('.googleRecaptcha');
    expect(recaptchaContainer).toBeInTheDocument();

    vi.unstubAllEnvs();
  });

  it('should capture recaptcha token via handleCaptcha', async () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'yes');
    vi.stubEnv('RECAPTCHA_SITE_KEY', 'test-site-key');

    renderComponent();

    const emailInput = screen.getByTestId('loginEmail');
    const passwordInput = screen.getByTestId('password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        null,
      );
    });

    vi.unstubAllEnvs();
  });

  it('should NOT render recaptcha when REACT_APP_USE_RECAPTCHA is not yes', () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'no');
    vi.stubEnv('RECAPTCHA_SITE_KEY', 'test-site-key');

    renderComponent();

    expect(screen.queryByRole('recaptcha')).not.toBeInTheDocument();
  });

  it('should NOT render recaptcha when RECAPTCHA_SITE_KEY is missing', () => {
    vi.stubEnv('REACT_APP_USE_RECAPTCHA', 'yes');
    vi.stubEnv('RECAPTCHA_SITE_KEY', '');

    renderComponent();

    expect(screen.queryByRole('recaptcha')).not.toBeInTheDocument();
  });

  it('should convert email to lowercase before submission', async () => {
    renderComponent();

    const emailInput = screen.getByTestId('loginEmail');
    fireEvent.change(emailInput, { target: { value: 'TEST@EXAMPLE.COM' } });

    fireEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        expect.anything(),
      );
    });
  });
});

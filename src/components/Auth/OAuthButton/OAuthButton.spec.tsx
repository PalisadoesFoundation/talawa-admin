import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { OAuthButton } from './OAuthButton';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

// Mock the theme module
vi.mock('../theme/oauthBrand', () => ({
  brandForProvider: vi.fn((provider) => ({
    icon: <span data-testid={`${provider}-icon`}>Icon</span>,
    displayName: provider === 'GOOGLE' ? 'Google' : 'GitHub',
    className: provider === 'GOOGLE' ? 'google-class' : 'github-class',
  })),
}));

// Mock CSS modules
vi.mock('./OAuthButton.module.css', () => ({
  default: {
    base: 'base',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    fullWidth: 'fullWidth',
    disabled: 'disabled',
    icon: 'icon',
    label: 'label',
    spinner: 'spinner',
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

describe('OAuthButton', () => {
  const mockOnClick = vi.fn();

  const renderWithI18n = (
    ui: React.ReactElement,
  ): ReturnType<typeof render> => {
    return render(<I18nextProvider i18n={i18nForTest}>{ui}</I18nextProvider>);
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  // Test required props
  it('renders with required props', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByTestId('GOOGLE-icon')).toBeInTheDocument();
  });

  // Test onClick handler
  it('calls onClick when clicked', async () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  // Test different providers
  it('renders with GitHub provider', () => {
    renderWithI18n(
      <OAuthButton provider="GITHUB" mode="login" onClick={mockOnClick} />,
    );

    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
    expect(screen.getByTestId('GITHUB-icon')).toBeInTheDocument();
  });

  // Test different modes
  it('renders with register mode', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="register" onClick={mockOnClick} />,
    );

    expect(screen.getByLabelText('GOOGLE register')).toBeInTheDocument();
  });

  it('renders with link mode', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="link" onClick={mockOnClick} />,
    );

    expect(screen.getByLabelText('GOOGLE link')).toBeInTheDocument();
  });

  // Test loading state
  it('renders loading state correctly', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        loading={true}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  // Test disabled state
  it('renders disabled state correctly', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        disabled={true}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('aria-busy');
  });

  // Test that onClick is not called when disabled
  it('does not call onClick when disabled', async () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        disabled={true}
      />,
    );

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  // Test that onClick is not called when loading
  it('does not call onClick when loading', async () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        loading={true}
      />,
    );

    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  // Test fullWidth
  it('applies fullWidth class when fullWidth is true', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        fullWidth={true}
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('fullWidth');
  });

  it('does not apply fullWidth class when fullWidth is false', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        fullWidth={false}
      />,
    );

    expect(screen.getByRole('button')).not.toHaveClass('fullWidth');
  });

  // Test different sizes
  it('applies sm size class', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        size="sm"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('sm');
  });

  it('applies md size class by default', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    expect(screen.getByRole('button')).toHaveClass('md');
  });

  it('applies lg size class', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        size="lg"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('lg');
  });

  // Test custom className
  it('applies custom className', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        className="custom-class"
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('handles undefined className', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        className={undefined}
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Test custom aria-label
  it('uses custom aria-label when provided', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        aria-label="Custom label"
      />,
    );

    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  // Test custom children
  it('renders custom children instead of default text', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick}>
        Custom button text
      </OAuthButton>,
    );

    expect(screen.getByText('Custom button text')).toBeInTheDocument();
    expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
  });

  // Test data attributes
  it('sets correct data attributes', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-provider', 'GOOGLE');
    expect(button).toHaveAttribute('data-mode', 'login');
  });

  // Test CSS classes combination
  it('combines CSS classes correctly when all props are provided', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        disabled={true}
        fullWidth={true}
        size="lg"
        className="custom"
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'base',
      'lg',
      'fullWidth',
      'disabled',
      'custom',
      'google-class',
    );
  });

  // Test aria-busy attribute when not loading
  it('does not set aria-busy when not loading', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        loading={false}
      />,
    );

    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  // Test button type
  it('renders button with type="button"', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  // Test that loading spinner only appears when loading
  it('does not render spinner when not loading', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        loading={false}
      />,
    );

    expect(document.querySelector('.spinner')).not.toBeInTheDocument();
  });

  // Test icon and label structure
  it('renders icon and label with correct classes', () => {
    renderWithI18n(
      <OAuthButton provider="GOOGLE" mode="login" onClick={mockOnClick} />,
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
    expect(document.querySelector('.label')).toBeInTheDocument();
  });

  // Test aria-hidden attributes
  it('sets aria-hidden on icon and spinner', () => {
    renderWithI18n(
      <OAuthButton
        provider="GOOGLE"
        mode="login"
        onClick={mockOnClick}
        loading={true}
      />,
    );

    const icon = document.querySelector('.icon');
    const spinner = document.querySelector('.spinner');

    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });
});

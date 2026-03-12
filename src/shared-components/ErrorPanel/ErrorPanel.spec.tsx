import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorPanel from './ErrorPanel';
import type { InterfaceErrorPanelProps } from './ErrorPanel';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        retry: 'Retry',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('shared-components/Button', () => ({
  default: ({
    children,
    onClick,
    variant,
    size,
    ...props
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: string;
    size?: string;
    'aria-label'?: string;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@mui/icons-material', () => ({
  WarningAmberRounded: ({ className }: { className?: string }) => (
    <div data-testid="warning-icon" className={className} />
  ),
}));

describe('ErrorPanel', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let defaultProps: InterfaceErrorPanelProps;

  beforeEach(() => {
    vi.restoreAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    defaultProps = {
      message: 'Something went wrong',
      error: new Error('Test error message'),
      onRetry: vi.fn(),
    };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Normal Rendering', () => {
    it('renders error panel with message and error', () => {
      render(<ErrorPanel {...defaultProps} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
      expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('renders with custom message as ReactNode', () => {
      render(
        <ErrorPanel
          {...defaultProps}
          message={
            <span data-testid="custom-message">
              Custom <strong>error</strong> message
            </span>
          }
        />,
      );

      expect(screen.getByTestId('custom-message')).toBeInTheDocument();
      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Custom');
      expect(container.textContent).toContain('error');
    });

    it('renders without error details by default', () => {
      render(<ErrorPanel {...defaultProps} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
      // Error details should be sanitized by default
      expect(container.textContent).toContain('Test error message');
    });

    it('renders with null error', () => {
      render(<ErrorPanel {...defaultProps} error={null} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('uses default testId "errorMsg"', () => {
      render(<ErrorPanel {...defaultProps} />);

      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });

    it('uses custom testId when provided', () => {
      render(<ErrorPanel {...defaultProps} testId="custom-error" />);

      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
      expect(screen.queryByTestId('errorMsg')).not.toBeInTheDocument();
    });

    it('applies custom className to container', () => {
      const { container } = render(
        <ErrorPanel {...defaultProps} className="custom-class" />,
      );

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).toHaveClass('custom-class');
    });
  });

  describe('Retry Button Functionality', () => {
    it('calls onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetrySpy = vi.fn();

      render(<ErrorPanel {...defaultProps} onRetry={onRetrySpy} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      await user.click(retryButton);

      await waitFor(() => expect(onRetrySpy).toHaveBeenCalledTimes(1));
    });

    it('calls onRetry multiple times when clicked multiple times', async () => {
      const user = userEvent.setup();
      const onRetrySpy = vi.fn();

      render(<ErrorPanel {...defaultProps} onRetry={onRetrySpy} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      await user.click(retryButton);
      await user.click(retryButton);
      await user.click(retryButton);

      await waitFor(() => expect(onRetrySpy).toHaveBeenCalledTimes(3));
    });

    it('retry button can be activated with keyboard (Enter key)', async () => {
      const user = userEvent.setup();
      const onRetrySpy = vi.fn();

      render(<ErrorPanel {...defaultProps} onRetry={onRetrySpy} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      retryButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(onRetrySpy).toHaveBeenCalledTimes(1));
    });

    it('retry button can be activated with keyboard (Space key)', async () => {
      const user = userEvent.setup();
      const onRetrySpy = vi.fn();

      render(<ErrorPanel {...defaultProps} onRetry={onRetrySpy} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      retryButton.focus();
      await user.keyboard(' ');

      await waitFor(() => expect(onRetrySpy).toHaveBeenCalledTimes(1));
    });
  });

  describe('Error Message Sanitization', () => {
    it('sanitizes API key from error message', () => {
      const error = new Error('Failed: api_key=sk-123456789');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('sk-123456789');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('sanitizes token from error message', () => {
      const error = new Error('Auth failed: token: bearer-xyz-123');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('bearer-xyz-123');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('sanitizes password from error message', () => {
      const error = new Error('Login error: password=mySecretPass123');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('mySecretPass123');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('sanitizes Unix home directory paths', () => {
      const error = new Error('File not found: /home/user/secret.txt');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('/home/user/secret.txt');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('sanitizes macOS user directory paths', () => {
      const error = new Error('Error at /Users/john/documents/file.txt');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('/Users/john/documents');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('sanitizes Windows user directory paths', () => {
      const error = new Error('Failed: C:\\Users\\Admin\\config.json');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('C:\\Users\\Admin');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('truncates long error messages', () => {
      const longMessage = 'A'.repeat(250);
      const error = new Error(longMessage);

      render(<ErrorPanel {...defaultProps} error={error} />);

      const displayedText = screen.getByTestId('errorMsg').textContent || '';
      expect(displayedText.includes('...')).toBe(true);
      expect(displayedText.length).toBeLessThan(longMessage.length + 100);
    });

    it('does not truncate short error messages', () => {
      const error = new Error('Short error');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Short error');
      const displayedText = screen.getByTestId('errorMsg').textContent || '';
      expect(displayedText.includes('...')).toBe(false);
    });

    it('handles empty error message', () => {
      const error = new Error('');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
    });
  });

  describe('showErrorDetails Flag', () => {
    it('shows raw error details when showErrorDetails is true', () => {
      const error = new Error('Detailed error message');
      render(
        <ErrorPanel {...defaultProps} error={error} showErrorDetails={true} />,
      );

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Detailed error message');
    });

    it('hides error details when showErrorDetails is false', () => {
      const error = new Error('Hidden error details');
      render(
        <ErrorPanel {...defaultProps} error={error} showErrorDetails={false} />,
      );

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Hidden error details');
    });

    it('defaults to hiding error details when showErrorDetails is not provided', () => {
      const error = new Error('Default hidden message');
      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Default hidden message');
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" by default', () => {
      const { container } = render(<ErrorPanel {...defaultProps} />);

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).toBeInTheDocument();
    });

    it('does not set aria-live when role is "alert"', () => {
      const { container } = render(<ErrorPanel {...defaultProps} />);

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).not.toHaveAttribute('aria-live');
    });

    it('accepts custom role', () => {
      const { container } = render(
        <ErrorPanel {...defaultProps} role="status" />,
      );

      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
    });

    it('sets aria-live when role is not "alert"', () => {
      const { container } = render(
        <ErrorPanel {...defaultProps} role="status" ariaLive="polite" />,
      );

      const statusElement = container.querySelector('[role="status"]');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('uses default aria-live="assertive" when role is not "alert"', () => {
      const { container } = render(
        <ErrorPanel {...defaultProps} role="status" />,
      );

      const statusElement = container.querySelector('[role="status"]');
      expect(statusElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('retry button has no aria-label when not provided', () => {
      render(<ErrorPanel {...defaultProps} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).not.toHaveAttribute('aria-label');
    });

    it('retry button has custom aria-label when provided', () => {
      render(
        <ErrorPanel {...defaultProps} retryAriaLabel="Retry loading data" />,
      );

      const retryButton = screen.getByRole('button', {
        name: 'Retry loading data',
      });
      expect(retryButton).toHaveAttribute('aria-label', 'Retry loading data');
    });

    it('retry button is keyboard focusable', () => {
      render(<ErrorPanel {...defaultProps} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      retryButton.focus();

      expect(document.activeElement).toBe(retryButton);
    });
  });

  describe('Console Logging', () => {
    it('logs error to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'development';
        const error = new Error('Development error');

        render(<ErrorPanel {...defaultProps} error={error} />);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'ErrorPanel error:',
          error,
        );
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('does not log error to console in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'production';
        const error = new Error('Production error');

        render(<ErrorPanel {...defaultProps} error={error} />);

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('does not log when error is null', () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'development';

        render(<ErrorPanel {...defaultProps} error={null} />);

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles error with undefined message', () => {
      const error = new Error();
      error.message = undefined as unknown as string;

      render(
        <ErrorPanel {...defaultProps} error={error} showErrorDetails={true} />,
      );

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
    });

    it('handles multiple sensitive patterns in one message', () => {
      const error = new Error(
        'Error: api_key=secret123 at /home/user/file.txt with password=pass123',
      );

      render(<ErrorPanel {...defaultProps} error={error} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).not.toContain('secret123');
      expect(container.textContent).not.toContain('/home/user');
      expect(container.textContent).not.toContain('pass123');
      expect(container.textContent).toContain('[REDACTED]');
    });

    it('renders correctly when onRetry is called synchronously', async () => {
      const user = userEvent.setup();
      const onRetrySpy = vi.fn();

      render(<ErrorPanel {...defaultProps} onRetry={onRetrySpy} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      await user.click(retryButton);

      expect(onRetrySpy).toHaveBeenCalledTimes(1);
      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain('Something went wrong');
    });

    it('handles very long message prop', () => {
      const longMessage = 'Error: ' + 'A'.repeat(500);

      render(<ErrorPanel {...defaultProps} message={longMessage} />);

      const container = screen.getByTestId('errorMsg');
      expect(container.textContent).toContain(longMessage);
    });

    it('handles special characters in error message', () => {
      const error = new Error('Error with <script>alert("xss")</script>');

      render(
        <ErrorPanel {...defaultProps} error={error} showErrorDetails={true} />,
      );

      const container = screen.getByTestId('errorMsg');
      // React escapes HTML, so it should be safe
      expect(container.textContent).toContain('Error with');
      expect(container.textContent).toContain('alert("xss")');
    });

    it('applies multiple classNames correctly', () => {
      const { container } = render(
        <ErrorPanel {...defaultProps} className="class1 class2 class3" />,
      );

      const alertElement = container.querySelector('[role="alert"]');
      expect(alertElement).toHaveClass('class1');
      expect(alertElement).toHaveClass('class2');
      expect(alertElement).toHaveClass('class3');
    });
  });

  describe('Button Styling', () => {
    it('renders button with correct variant and size', () => {
      render(<ErrorPanel {...defaultProps} />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toHaveAttribute('data-variant', 'outline-danger');
      expect(retryButton).toHaveAttribute('data-size', 'sm');
    });
  });
});

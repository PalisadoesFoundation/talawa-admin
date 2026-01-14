import React, { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundaryWrapper } from './ErrorBoundaryWrapper';
import type { InterfaceErrorFallbackProps } from 'types/shared-components/ErrorBoundaryWrapper/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Test Component
interface IComponent {
  shouldThrow?: boolean;
  message?: string;
  children?: ReactNode;
}

const TestErrorComponent = ({
  shouldThrow = true,
  message = 'Test error message',
  children,
}: IComponent) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return (
    <div data-testid="normal-component">{children || 'Normal content'}</div>
  );
};

const errorBoundaryI18nProps = {
  fallbackTitle: 'Something went wrong',
  fallbackErrorMessage: 'An unexpected error occurred',
  resetButtonText: 'Try Again',
  resetButtonAriaLabel: 'Try again',
};

describe('ErrorBoundaryWrapper', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
  });

  describe('Normal Rendering (No Error)', () => {
    it('renders children normally when no error occurs', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent shouldThrow={false} />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('normal-component')).toBeInTheDocument();
      expect(screen.getByText('Normal content')).toBeInTheDocument();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('renders multiple children normally', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent shouldThrow={false}>Child 1</TestErrorComponent>
          <TestErrorComponent shouldThrow={false}>Child 2</TestErrorComponent>
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getAllByTestId('normal-component')).toHaveLength(2);
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('logs to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = 'development';

        render(
          <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
            <TestErrorComponent />
          </ErrorBoundaryWrapper>,
        );

        expect(consoleErrorSpy).toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Error Catching and Default Fallback', () => {
    it('catches render errors and displays default fallback UI', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try again' }),
      ).toBeInTheDocument();
    });

    it('displays default message when error has no message', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent message="" />
        </ErrorBoundaryWrapper>,
      );

      expect(
        screen.getByText('An unexpected error occurred'),
      ).toBeInTheDocument();
    });

    it('shows toast notification by default when error occurs', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Test error message',
      );
    });

    it('uses custom errorMessage in toast when provided', () => {
      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          errorMessage="Custom error message"
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Custom error message',
      );
    });

    it('displays default error message in toast when error has no message', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent message="" />
        </ErrorBoundaryWrapper>,
      );

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'An unexpected error occurred',
      );
    });

    it('renders default fallback with custom i18n strings', () => {
      render(
        <ErrorBoundaryWrapper
          fallbackTitle="Quelque chose s'est mal passé"
          fallbackErrorMessage="Une erreur inattendue s'est produite"
          resetButtonText="Réessayer"
          resetButtonAriaLabel="Réessayer"
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(
        screen.getByText("Quelque chose s'est mal passé"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Réessayer' }),
      ).toBeInTheDocument();
    });
  });

  describe('Custom JSX Fallback', () => {
    it('renders custom JSX fallback when provided', () => {
      const customFallback = (
        <div data-testid="custom-fallback">
          <h2>Custom Error UI</h2>
          <p>Something went wrong</p>
        </div>
      );

      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          fallback={customFallback}
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.queryByTestId('error-boundary-fallback'),
      ).not.toBeInTheDocument();
    });

    it('custom JSX fallback takes precedence over default fallback', () => {
      const customFallback = <div data-testid="custom-jsx">Custom JSX</div>;

      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          fallback={customFallback}
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('custom-jsx')).toBeInTheDocument();
      expect(
        screen.queryByText('Something went wrong'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom Fallback Component', () => {
    it('renders custom fallback component when provided', () => {
      const renderCustomFallbackComponent = ({
        error,
        onReset,
      }: InterfaceErrorFallbackProps) => (
        <div data-testid="custom-component-fallback">
          <h2>Custom Component Error</h2>
          <p>Error: {error?.message}</p>
          <button type="button" onClick={onReset} data-testid="custom-reset">
            Reset
          </button>
        </div>
      );

      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          fallbackComponent={renderCustomFallbackComponent}
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(
        screen.getByTestId('custom-component-fallback'),
      ).toBeInTheDocument();
      expect(screen.getByText('Custom Component Error')).toBeInTheDocument();
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
      expect(screen.getByTestId('custom-reset')).toBeInTheDocument();
    });

    it('custom fallback component receives error and onReset props', () => {
      const onResetSpy = vi.fn();
      const renderCustomFallbackComponent = ({
        error,
        onReset,
      }: InterfaceErrorFallbackProps) => {
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('Test error message');
        expect(typeof onReset).toBe('function');

        return (
          <div>
            <button type="button" onClick={onReset} data-testid="test-reset">
              Test Reset
            </button>
          </div>
        );
      };

      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          fallbackComponent={renderCustomFallbackComponent}
          onReset={onResetSpy}
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByTestId('test-reset');
      fireEvent.click(resetButton);

      expect(onResetSpy).toHaveBeenCalledTimes(1);
    });

    it('custom fallback component takes precedence over custom JSX fallback', () => {
      const renderCustomFallbackComponent = () => (
        <div data-testid="component-fallback">Component Fallback</div>
      );
      const customJSX = <div data-testid="jsx-fallback">JSX Fallback</div>;

      render(
        <ErrorBoundaryWrapper
          {...errorBoundaryI18nProps}
          fallback={customJSX}
          fallbackComponent={renderCustomFallbackComponent}
        >
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('component-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('jsx-fallback')).not.toBeInTheDocument();
    });
  });

  describe('onError Callback', () => {
    it('invokes onError callback when error is caught', () => {
      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onError={onErrorSpy}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
      expect(onErrorSpy.mock.calls[0][0].message).toBe('Test error message');
    });

    it('onError callback receives correct error and errorInfo', () => {
      const onErrorSpy = vi.fn();
      const customMessage = 'Custom error for testing';

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onError={onErrorSpy}>
          <TestErrorComponent message={customMessage} />
        </ErrorBoundaryWrapper>,
      );

      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: customMessage,
        }),
        expect.any(Object),
      );
    });
  });

  describe('onReset Callback', () => {
    it('invokes onReset callback when reset button is clicked', async () => {
      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onReset={onResetSpy}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      expect(onResetSpy).toHaveBeenCalledTimes(1);
    });

    it('does not invoke onReset callback when not provided', async () => {
      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      expect(onResetSpy).not.toHaveBeenCalled();
    });

    it('resets error state and renders children after reset', async () => {
      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      const { rerender } = render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onReset={onResetSpy}>
          <TestErrorComponent shouldThrow={true} />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

      // update the children to not throw
      rerender(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent shouldThrow={false} />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      await waitFor(() => {
        expect(screen.getByTestId('normal-component')).toBeInTheDocument();
      });
    });

    it('reset button has type="button" to prevent form submission', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      expect(resetButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Toast Notification Control', () => {
    it('does not show toast when showToast is false', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} showToast={false}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('shows toast when showToast is true', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} showToast={true}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Test error message',
      );
    });
  });

  describe('Accessibility', () => {
    it('default fallback has role="alert"', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const fallback = screen.getByTestId('error-boundary-fallback');
      expect(fallback).toHaveAttribute('role', 'alert');
    });

    it('default fallback has aria-live="assertive"', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const fallback = screen.getByTestId('error-boundary-fallback');
      expect(fallback).toHaveAttribute('aria-live', 'assertive');
    });

    it('reset button has accessible aria-label', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      expect(resetButton).toHaveAttribute('aria-label', 'Try again');
    });

    it('reset button is keyboard focusable', async () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();

      expect(document.activeElement).toBe(resetButton);
    });

    it('reset button can be activated with keyboard (Enter key)', async () => {
      const onResetSpy = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onReset={onResetSpy}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();
      await user.keyboard('{Enter}');

      expect(onResetSpy).toHaveBeenCalledTimes(1);
    });

    it('reset button can be activated with keyboard (Space key)', async () => {
      const onResetSpy = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onReset={onResetSpy}>
          <TestErrorComponent />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();
      await user.keyboard(' ');

      expect(onResetSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple rapid errors', () => {
      const onErrorSpy = vi.fn();

      const { rerender } = render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onError={onErrorSpy}>
          <TestErrorComponent message="First error" />
        </ErrorBoundaryWrapper>,
      );

      expect(onErrorSpy).toHaveBeenCalledTimes(1);

      // Trigger another error
      rerender(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps} onError={onErrorSpy}>
          <TestErrorComponent message="Second error" />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    });

    it('works correctly with empty children', () => {
      render(
        <ErrorBoundaryWrapper {...errorBoundaryI18nProps}>
          {null}
        </ErrorBoundaryWrapper>,
      );

      // Should render without error
      expect(
        screen.queryByTestId('error-boundary-fallback'),
      ).not.toBeInTheDocument();
    });
  });
});

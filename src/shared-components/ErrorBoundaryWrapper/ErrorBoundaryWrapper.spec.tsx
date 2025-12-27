import React, { ReactNode } from 'react';
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; ---- no need for this, I can remove this as cpdebase mein we can use it without importing, config mein defined hai
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundaryWrapper } from './ErrorBoundaryWrapper';
import type {
  InterfaceErrorFallbackProps,
} from 'types/shared-components/ErrorBoundaryWrapper/interface';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Component that throws an error during render
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that throws an error with a specific message
const ThrowCustomError = ({ message }: { message: string }) => {
  throw new Error(message);
};

// Normal component that doesn't throw
const NormalComponent = ({ children }: { children?: ReactNode }) => (
  <div data-testid="normal-component">{children || 'Normal content'}</div>
);

// spy on console.error to suppress during test
const consoleErrorSpyFunction = () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return consoleErrorSpy;
};

describe('ErrorBoundaryWrapper', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Normal Rendering (No Error)', () => {
    it('renders children normally when no error occurs', () => {
      render(
        <ErrorBoundaryWrapper>
          <NormalComponent />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('normal-component')).toBeInTheDocument();
      expect(screen.getByText('Normal content')).toBeInTheDocument();
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('renders multiple children normally', () => {
      render(
        <ErrorBoundaryWrapper>
          <NormalComponent>Child 1</NormalComponent>
          <NormalComponent>Child 2</NormalComponent>
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getAllByTestId('normal-component')).toHaveLength(2);
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('logs to console in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Catching and Default Fallback', () => {
    it('catches render errors and displays default fallback UI', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Try again' }),
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('displays default message when error has no message', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowCustomError message="" />
        </ErrorBoundaryWrapper>,
      );

      expect(
        screen.getByText('An unexpected error occurred'),
      ).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('shows toast notification by default when error occurs', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(toast.error).toHaveBeenCalledWith('Test error message');

      consoleErrorSpy.mockRestore();
    });

    it('uses custom errorMessage in toast when provided', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper errorMessage="Custom error message">
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(toast.error).toHaveBeenCalledWith('Custom error message');

      consoleErrorSpy.mockRestore();
    });

    it('displays default error message in toast when error has no message', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowCustomError message="" />
        </ErrorBoundaryWrapper>,
      );

      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Custom JSX Fallback', () => {
    it('renders custom JSX fallback when provided', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const customFallback = (
        <div data-testid="custom-fallback">
          <h2>Custom Error UI</h2>
          <p>Something went wrong</p>
        </div>
      );

      render(
        <ErrorBoundaryWrapper fallback={customFallback}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(
        screen.queryByTestId('error-boundary-fallback'),
      ).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('custom JSX fallback takes precedence over default fallback', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const customFallback = <div data-testid="custom-jsx">Custom JSX</div>;

      render(
        <ErrorBoundaryWrapper fallback={customFallback}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('custom-jsx')).toBeInTheDocument();
      expect(
        screen.queryByText('Something went wrong'),
      ).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Custom Fallback Component', () => {
    it('renders custom fallback component when provided', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const CustomFallback = ({
        error,
        onReset,
      }: InterfaceErrorFallbackProps) => (
        <div data-testid="custom-component-fallback">
          <h2>Custom Component Error</h2>
          <p>Error: {error?.message}</p>
          <button onClick={onReset} data-testid="custom-reset">
            Reset
          </button>
        </div>
      );

      render(
        <ErrorBoundaryWrapper fallbackComponent={CustomFallback}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(
        screen.getByTestId('custom-component-fallback'),
      ).toBeInTheDocument();
      expect(screen.getByText('Custom Component Error')).toBeInTheDocument();
      expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
      expect(screen.getByTestId('custom-reset')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('custom fallback component receives error and onReset props', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onResetSpy = vi.fn();
      const CustomFallback = ({
        error,
        onReset,
      }: InterfaceErrorFallbackProps) => {
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('Test error message');
        expect(typeof onReset).toBe('function');

        return (
          <div>
            <button onClick={onReset} data-testid="test-reset">
              Test Reset
            </button>
          </div>
        );
      };

      render(
        <ErrorBoundaryWrapper
          fallbackComponent={CustomFallback}
          onReset={onResetSpy}
        >
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByTestId('test-reset');
      fireEvent.click(resetButton);

      expect(onResetSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });

    it('custom fallback component takes precedence over custom JSX fallback', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const CustomFallback = () => (
        <div data-testid="component-fallback">Component Fallback</div>
      );
      const customJSX = <div data-testid="jsx-fallback">JSX Fallback</div>;

      render(
        <ErrorBoundaryWrapper
          fallback={customJSX}
          fallbackComponent={CustomFallback}
        >
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('component-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('jsx-fallback')).not.toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('onError Callback', () => {
    it('invokes onError callback when error is caught', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper onError={onErrorSpy}>
          <ThrowError />
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

      consoleErrorSpy.mockRestore();
    });

    it('onError callback receives correct error and errorInfo', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onErrorSpy = vi.fn();
      const customMessage = 'Custom error for testing';

      render(
        <ErrorBoundaryWrapper onError={onErrorSpy}>
          <ThrowCustomError message={customMessage} />
        </ErrorBoundaryWrapper>,
      );

      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: customMessage,
        }),
        expect.any(Object),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('onReset Callback', () => {
    it('invokes onReset callback when reset button is clicked', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper onReset={onResetSpy}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      expect(onResetSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });

    it('does not invoke onReset callback when not provided', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      expect(onResetSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('resets error state and renders children after reset', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const user = userEvent.setup();
      const onResetSpy = vi.fn();

      const { rerender } = render(
        <ErrorBoundaryWrapper onReset={onResetSpy}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundaryWrapper>,
      );

      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      await user.click(resetButton);

      rerender(
        <ErrorBoundaryWrapper>
          <ThrowError shouldThrow={false} />
        </ErrorBoundaryWrapper>,
      );

      waitFor(() => {
        expect(screen.getByText('No error')).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Toast Notification Control', () => {
    it('does not show toast when showToast is false', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper showToast={false}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(toast.error).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('shows toast when showToast is true', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper showToast={true}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      expect(toast.error).toHaveBeenCalledWith('Test error message');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('default fallback has role="alert"', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const fallback = screen.getByTestId('error-boundary-fallback');
      expect(fallback).toHaveAttribute('role', 'alert');

      consoleErrorSpy.mockRestore();
    });

    it('default fallback has aria-live="assertive"', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const fallback = screen.getByTestId('error-boundary-fallback');
      expect(fallback).toHaveAttribute('aria-live', 'assertive');

      consoleErrorSpy.mockRestore();
    });

    it('reset button has accessible aria-label', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      expect(resetButton).toHaveAttribute('aria-label', 'Try again');

      consoleErrorSpy.mockRestore();
    });

    it('reset button is keyboard focusable', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      render(
        <ErrorBoundaryWrapper>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();

      expect(document.activeElement).toBe(resetButton);

      consoleErrorSpy.mockRestore();
    });

    it('reset button can be activated with keyboard (Enter key)', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onResetSpy = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorBoundaryWrapper onReset={onResetSpy}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();
      await user.keyboard('{Enter}');

      expect(onResetSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });

    it('reset button can be activated with keyboard (Space key)', async () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onResetSpy = vi.fn();
      const user = userEvent.setup();

      render(
        <ErrorBoundaryWrapper onReset={onResetSpy}>
          <ThrowError />
        </ErrorBoundaryWrapper>,
      );

      const resetButton = screen.getByRole('button', { name: 'Try again' });
      resetButton.focus();
      await user.keyboard(' ');

      expect(onResetSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple rapid errors', () => {
      const consoleErrorSpy = consoleErrorSpyFunction();

      const onErrorSpy = vi.fn();

      const { rerender } = render(
        <ErrorBoundaryWrapper onError={onErrorSpy}>
          <ThrowCustomError message="First error" />
        </ErrorBoundaryWrapper>,
      );

      expect(onErrorSpy).toHaveBeenCalledTimes(1);

      // Trigger another error
      rerender(
        <ErrorBoundaryWrapper onError={onErrorSpy}>
          <ThrowCustomError message="Second error" />
        </ErrorBoundaryWrapper>,
      );


      expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('works correctly with empty children', () => {
      render(<ErrorBoundaryWrapper>{null}</ErrorBoundaryWrapper>);

      // Should render without error
      expect(
        screen.queryByTestId('error-boundary-fallback'),
      ).not.toBeInTheDocument();
    });
  });
});

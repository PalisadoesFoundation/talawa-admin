import React from 'react';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { TestWrapper } from './TestWrapper';
import { gql } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { act } from 'react';
import { vi } from 'vitest';

// Mock the imported modules
vi.mock('@apollo/client/testing', async () => {
  const actual = await vi.importActual('@apollo/client/testing');
  return {
    ...actual,
    MockedProvider: ({
      children,
      mocks = [],
    }: {
      children: ReactNode;
      mocks?: MockedResponse[];
    }) => (
      <div data-testid="mocked-provider" data-mocks={JSON.stringify(mocks)}>
        {children}
      </div>
    ),
  };
});

vi.mock('react-i18next', () => ({
  I18nextProvider: ({ children, i18n }: { children: ReactNode; i18n: any }) => (
    <div
      data-testid="i18next-provider"
      data-i18n={i18n ? 'provided' : 'missing'}
    >
      {children}
    </div>
  ),
}));

vi.mock('react-router', () => ({
  BrowserRouter: ({ children }: { children: ReactNode }) => (
    <div data-testid="browser-router">{children}</div>
  ),
}));

vi.mock('utils/i18n', () => ({
  default: 'mocked-i18n-instance',
}));

describe('TestWrapper', () => {
  it('renders without crashing', () => {
    render(
      <TestWrapper>
        <div data-testid="test-child">Test Content</div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders all required providers', () => {
    render(
      <TestWrapper>
        <div>Provider Test</div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('mocked-provider')).toBeInTheDocument();
    expect(screen.getByTestId('i18next-provider')).toBeInTheDocument();
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('passes children through all providers', () => {
    render(
      <TestWrapper>
        <div data-testid="nested-child">Nested Content</div>
      </TestWrapper>,
    );

    const nestedChild = screen.getByTestId('nested-child');
    expect(nestedChild).toBeInTheDocument();
    expect(nestedChild.textContent).toBe('Nested Content');
  });

  it('passes empty mocks array by default', () => {
    render(
      <TestWrapper>
        <div>Default Mocks Test</div>
      </TestWrapper>,
    );

    const mockedProvider = screen.getByTestId('mocked-provider');
    expect(mockedProvider.getAttribute('data-mocks')).toBe('[]');
  });

  it('passes provided mocks to MockedProvider', () => {
    const TEST_QUERY = gql`
      query TestQuery {
        test {
          id
        }
      }
    `;

    const mocks = [
      {
        request: {
          query: TEST_QUERY,
        },
        result: {
          data: {
            test: {
              id: '123',
            },
          },
        },
      },
    ];

    render(
      <TestWrapper mocks={mocks}>
        <div>Mocks Test</div>
      </TestWrapper>,
    );

    const mockedProvider = screen.getByTestId('mocked-provider');
    const passedMocks = JSON.parse(
      mockedProvider.getAttribute('data-mocks') || '[]',
    );

    // Verify the mock was passed (structure will be different after serialization)
    expect(passedMocks).toHaveLength(1);
    expect(passedMocks[0]).toHaveProperty('result');
    expect(passedMocks[0].result).toHaveProperty('data');
    expect(passedMocks[0].result.data).toHaveProperty('test');
  });

  it('works with multiple children', () => {
    render(
      <TestWrapper>
        <div key="1" data-testid="child-1">
          First Child
        </div>
        <div key="2" data-testid="child-2">
          Second Child
        </div>
      </TestWrapper>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('handles async operations within wrapped components', async () => {
    // Create a component with an effect
    const AsyncComponent = () => {
      const [loaded, setLoaded] = React.useState(false);

      React.useEffect(() => {
        // Simulate async operation
        setTimeout(() => {
          setLoaded(true);
        }, 0);
      }, []);

      return (
        <div data-testid="async-component">{loaded ? 'Loaded' : 'Loading'}</div>
      );
    };

    render(
      <TestWrapper>
        <AsyncComponent />
      </TestWrapper>,
    );

    // Initial state
    expect(screen.getByTestId('async-component')).toHaveTextContent('Loading');

    // Wait for state update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    // Updated state
    expect(screen.getByTestId('async-component')).toHaveTextContent('Loaded');
  });

  it('allows error boundaries to catch errors from children', () => {
    // Define types for the error boundary
    interface ErrorBoundaryProps {
      children: ReactNode;
    }

    interface ErrorBoundaryState {
      hasError: boolean;
      error: Error | null;
    }

    // Create a properly typed error boundary for testing
    class TestErrorBoundary extends React.Component<
      ErrorBoundaryProps,
      ErrorBoundaryState
    > {
      constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
          hasError: false,
          error: null,
        };
      }

      static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
          hasError: true,
          error,
        };
      }

      render(): React.ReactNode {
        if (this.state.hasError && this.state.error) {
          return (
            <div data-testid="error-message">{this.state.error.message}</div>
          );
        }
        return this.props.children;
      }
    }

    // Component that throws during render
    const ErrorComponent = (): ReactNode => {
      throw new Error('Test error');
    };

    // Suppress console errors during this test
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <TestWrapper>
        <TestErrorBoundary>
          <ErrorComponent />
        </TestErrorBoundary>
      </TestWrapper>,
    );

    // Verify error boundary caught the error
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error');

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('passes the i18n instance to I18nextProvider', () => {
    render(
      <TestWrapper>
        <div>i18n Test</div>
      </TestWrapper>,
    );

    const i18nextProvider = screen.getByTestId('i18next-provider');
    expect(i18nextProvider.getAttribute('data-i18n')).toBe('provided');
  });
});

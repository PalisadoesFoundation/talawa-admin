import React, { ReactNode } from 'react';

interface TestInterfaceErrorBoundaryProps {
  children: ReactNode;
}

interface TestInterfaceErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class TestErrorBoundary extends React.Component<
  TestInterfaceErrorBoundaryProps,
  TestInterfaceErrorBoundaryState
> {
  constructor(props: TestInterfaceErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): TestInterfaceErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;
    if (hasError && error) {
      return <div data-testid="error-message">{error.message}</div>;
    }
    return children;
  }
}

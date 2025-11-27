import React from 'react';

interface InterfaceMockSuspenseProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const MockSuspense: React.FC<InterfaceMockSuspenseProps> = ({
  children,
  fallback,
}) => (
  <div data-testid="suspense">
    {fallback}
    {children}
  </div>
);

export default MockSuspense;

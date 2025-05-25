import { ReactNode } from 'react';
import type { MockedResponse } from '@apollo/client/testing';

export const MockedCustomProvider = ({
  children,
  mocks = [],
}: {
  children: ReactNode;
  mocks?: MockedResponse[];
}) => (
  <div data-testid="mocked-provider" data-mocks={JSON.stringify(mocks)}>
    {children}
  </div>
);

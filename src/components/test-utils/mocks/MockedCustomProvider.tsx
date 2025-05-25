import React, { ReactNode } from 'react';
import type { MockedResponse } from '@apollo/client/testing';

/**
 * A mock implementation of Apollo's MockedProvider for testing purposes.
 * Allows inspection of provided mocks through data attributes.
 *
 * @param children - Child elements to be wrapped by the provider
 * @param mocks - Array of mock responses for GraphQL operations
 * @returns A div element containing the children with mock data attributes
 */
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

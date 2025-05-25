import { ReactNode } from 'react';
import type { MockedResponse } from '@apollo/client/testing';

/**
 * Props interface for the MockedCustomProvider component
 */
interface MockedCustomProviderProps {
  children: ReactNode;
  mocks?: MockedResponse[];
}

/**
 * Safely serializes mock data, falling back to length if serialization fails
 */
const safeSerializeMocks = (mocks: MockedResponse[]): string => {
  try {
    return JSON.stringify(mocks);
  } catch {
    return `[${mocks.length} mocks]`;
  }
};

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
}: MockedCustomProviderProps): JSX.Element => (
  <div data-testid="mocked-provider" data-mocks={safeSerializeMocks(mocks)}>
    {children}
  </div>
);

import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

/**
 * Interface for MockedCustomProvider props
 */
interface IProps {
  /** The child elements to be rendered within the provider */
  children: React.ReactNode;
  /** Optional array of mock data to be passed to the provider */
  mocks?: unknown[];
}

/**
 * A mock implementation of Apollo's MockedProvider for testing purposes.
 * This provider wraps children in a div and serializes any provided mocks as a data attribute.
 *
 * @param props - The provider props
 * @param props.children - React children to be rendered
 * @param props.mocks - Optional array of mock data
 * @returns A div element containing the children and serialized mocks
 *
 * @example
 * ```tsx
 * const mocks = [{ query: TEST_QUERY, result: { data: { test: 'data' } } }];
 *
 * render(
 *   <MockedCustomProvider mocks={mocks}>
 *     <TestComponent />
 *   </MockedCustomProvider>
 * );
 * ```
 */
export const MockedCustomProvider = ({
  children,
  mocks = [],
}: IProps): ReactJSX.Element => (
  <div data-testid="mocked-provider" data-mocks={JSON.stringify(mocks)}>
    {children}
  </div>
);

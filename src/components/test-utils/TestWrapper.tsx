import React from 'react';
import type { MockedResponse } from '@apollo/react-testing';
import { MockedProvider } from '@apollo/react-testing';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from 'utils/i18n';

/**
 * Props for the TestWrapper component.
 */
interface InterfaceTestWrapperProps {
  /** The React components to be wrapped */
  children: ReactNode;
  /** Optional Apollo GraphQL mocks for testing queries and mutations */
  mocks?: MockedResponse[];
}

/**
 * A wrapper component for testing React components that require Apollo Client, i18n, and Router contexts.
 * Provides the necessary provider context for testing components that use GraphQL, translations, and routing.
 *
 * @example
 * ```tsx
 * const mocks = [{
 *   request: { query: TEST_QUERY },
 *   result: { data: { test: 'data' } }
 * }];
 *
 * render(
 *   <TestWrapper mocks={mocks}>
 *     <ComponentToTest />
 *   </TestWrapper>
 * );
 * ```
 *
 * @param props - The component props
 * @param children - The React components to be wrapped
 * @param mocks - Optional Apollo GraphQL mocks for testing queries and mutations
 * @returns A JSX element with all required providers wrapped around the children
 */
export const TestWrapper = ({
  children,
  mocks = [],
}: InterfaceTestWrapperProps): JSX.Element => (
  <MockedProvider mocks={mocks}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{children}</BrowserRouter>
    </I18nextProvider>
  </MockedProvider>
);

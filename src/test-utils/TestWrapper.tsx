/**
 * A utility component that wraps its children with providers commonly used in tests.
 * This includes:
 * - `MockedProvider` for mocking Apollo GraphQL queries and mutations.
 * - `I18nextProvider` for internationalization support using i18next.
 * - `BrowserRouter` for routing support in React applications.
 *
 * @remarks
 * This component is designed to simplify the setup of unit tests by providing
 * a consistent environment for components that depend on GraphQL, i18n, or routing.
 *
 * @param children - The React components to be wrapped by the test providers.
 * @param mocks - Optional array of Apollo GraphQL mocks for testing queries and mutations.
 *                Defaults to an empty array if not provided.
 *
 * @example
 * ```tsx
 * import { render } from '@testing-library/react';
 * import { TestWrapper } from './TestWrapper';
 * import MyComponent from './MyComponent';
 *
 * const mocks = [
 *   {
 *     request: { query: MY_QUERY },
 *     result: { data: { myField: 'value' } },
 *   },
 * ];
 *
 * render(
 *   <TestWrapper mocks={mocks}>
 *     <MyComponent />
 *   </TestWrapper>
 * );
 * ```
 */
import React from 'react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import i18n from 'utils/i18n';

interface InterfaceTestWrapperProps {
  /** The React components to be wrapped */
  children: ReactNode;
  /** Optional Apollo GraphQL mocks for testing queries and mutations */
  mocks?: MockedResponse[];
}

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

import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

/**
 * Interface for MockBrowserRouter props
 */
interface IProps {
  /** The child elements to be rendered within the router */
  children: React.ReactNode;
}

/**
 * A mock implementation of React Router's BrowserRouter for testing purposes.
 * This component provides a simple wrapper that simulates the router context
 * without actual routing functionality.
 * * @param children - React children to be rendered within the router
 * @returns A div element with router-related test attribute containing the children
 *
 * @example
 * ```tsx
 * render(
 *   <MockBrowserRouter>
 *     <ComponentWithRouting />
 *   </MockBrowserRouter>
 * );
 * ```
 */
export const MockBrowserRouter = ({ children }: IProps): ReactJSX.Element => (
  <div data-testid="browser-router">{children}</div>
);

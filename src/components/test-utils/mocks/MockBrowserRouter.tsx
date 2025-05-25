import React, { ReactNode } from 'react';

/**
 * A mock implementation of BrowserRouter for testing purposes.
 * Wraps children in a div with a test ID for verification in tests.
 *
 * @param children - Child elements to be wrapped by the router
 * @returns A div element containing the children with a test ID
 */
export const MockBrowserRouter = ({ children }: { children: ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

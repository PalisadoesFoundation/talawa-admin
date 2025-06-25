/**
 * A mock implementation of BrowserRouter for testing.
 *
 * @remarks
 * This mock simply renders its children inside a div with a test id.
 *
 * @param children - The child nodes to render.
 * @returns The mocked browser router element.
 */
import React, { ReactNode } from 'react';

const MockBrowserRouter = ({ children }: { children: ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

export default MockBrowserRouter;

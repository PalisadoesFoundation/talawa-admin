import React, { ReactNode } from 'react';

const MockBrowserRouter = ({ children }: { children: ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

export default MockBrowserRouter;

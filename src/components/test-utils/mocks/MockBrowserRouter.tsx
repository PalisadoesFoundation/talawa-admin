import { ReactNode } from 'react';

export const MockBrowserRouter = ({ children }: { children: ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

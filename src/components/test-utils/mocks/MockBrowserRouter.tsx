import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export const MockBrowserRouter = ({ children }: IProps): ReactJSX.Element => (
  <div data-testid="browser-router">{children}</div>
);

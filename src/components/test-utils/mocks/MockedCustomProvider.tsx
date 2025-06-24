import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  mocks?: unknown[];
}

export const MockedCustomProvider = ({
  children,
  mocks = [],
}: IProps): ReactJSX.Element => (
  <div data-testid="mocked-provider" data-mocks={JSON.stringify(mocks)}>
    {children}
  </div>
);

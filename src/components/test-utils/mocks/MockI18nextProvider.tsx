import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

export const MockI18nextProvider = ({ children }: IProps): ReactJSX.Element => (
  <div data-testid="i18next-provider" data-i18n="provided">
    {children}
  </div>
);

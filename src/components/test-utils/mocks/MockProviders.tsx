import React, { ReactNode } from 'react';
import type { MockedResponse } from '@apollo/client/testing';
import type { i18n } from 'i18next';

export const MockedCustomProvider = ({
  children,
  mocks = [],
}: {
  children: ReactNode;
  mocks?: MockedResponse[];
}) => (
  <div data-testid="mocked-provider" data-mocks={JSON.stringify(mocks)}>
    {children}
  </div>
);

export const MockI18nextProvider = ({
  children,
  i18n,
}: {
  children: ReactNode;
  i18n: i18n;
}) => (
  <div data-testid="i18next-provider" data-i18n={i18n ? 'provided' : 'missing'}>
    {children}
  </div>
);

export const MockBrowserRouter = ({ children }: { children: ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

import { ReactNode } from 'react';
import type { i18n } from 'i18next';

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

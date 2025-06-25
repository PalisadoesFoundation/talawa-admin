import type { ReactNode } from 'react';
import type { i18n as I18nType } from 'i18next';

export function I18nextProvider({
  children,
  i18n,
}: {
  children: ReactNode;
  i18n: I18nType;
}) {
  return (
    <div
      data-testid="i18next-provider"
      data-i18n={i18n ? 'provided' : 'missing'}
    >
      {children}
    </div>
  );
}

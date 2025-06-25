/**
 * A mock implementation of the I18nextProvider for testing.
 *
 * @remarks
 * This mock provider renders its children and sets test attributes for i18n presence.
 *
 * @param children - The child nodes to render.
 * @param i18n - The i18n instance (mocked).
 * @returns The mocked provider element.
 */
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

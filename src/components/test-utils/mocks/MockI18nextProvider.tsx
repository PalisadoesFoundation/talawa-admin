import React, { ReactNode } from 'react';
import type { i18n } from 'i18next';

/**
 * A mock implementation of I18nextProvider for testing purposes.
 * Allows verification of i18n instance provision through data attributes.
 *
 * @param children - Child elements to be wrapped by the provider
 * @param i18n - The i18n instance to be provided
 * @returns A div element containing the children with i18n status data attribute
 */
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

import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

/**
 * Interface for MockI18nextProvider props
 */
interface IProps {
  /** The child elements to be rendered within the provider */
  children: React.ReactNode;
}

/**
 * A mock implementation of i18next's I18nextProvider for testing purposes.
 * This component simulates the i18next provider behavior in tests without
 * requiring the actual i18next setup.
 * * @param children - React children to be rendered within the provider
 * @returns A div element with i18next-related test attributes containing the children
 *
 * @example
 * ```tsx
 * render(
 *   <MockI18nextProvider>
 *     <ComponentWithTranslations />
 *   </MockI18nextProvider>
 * );
 * ```
 */
export const MockI18nextProvider = ({ children }: IProps): ReactJSX.Element => (
  <div data-testid="i18next-provider" data-i18n="provided">
    {children}
  </div>
);

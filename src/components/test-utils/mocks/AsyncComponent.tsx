import { ReactJSX } from '@emotion/react/dist/declarations/src/jsx-namespace';
import React from 'react';

/**
 * A test utility component that simulates asynchronous behavior.
 * Initially renders with "Loading" text and updates to "Loaded" after a minimal timeout.
 * Used in test scenarios to verify component behavior with async state changes.
 *
 * @returns A div element with a data-testid that displays either "Loading" or "Loaded"
 *
 * @example
 * ```tsx
 * render(
 *   <TestWrapper>
 *     <AsyncComponent />
 *   </TestWrapper>
 * );
 * // Initially shows "Loading"
 * // After a brief timeout, updates to show "Loaded"
 * ```
 */
export const AsyncComponent = (): ReactJSX.Element => {
  const [text, setText] = React.useState('Loading');

  React.useEffect(() => {
    setTimeout(() => {
      setText('Loaded');
    }, 0);
  }, []);

  return <div data-testid="async-component">{text}</div>;
};

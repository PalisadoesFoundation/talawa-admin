import React from 'react';
import styles from './MainContent.module.css';

/**
 * Props for the `mainContent` component.
 */
interface InterfaceMainContentProps {
  /**
   * The child elements to be rendered inside the main content container.
   */
  children: any;
}

/**
 * A React component that renders a main content container with additional styles.
 *
 * @param props - The properties for the component.
 * @returns  A JSX element containing the main content container with the provided child elements.
 *
 * @example
 * <MainContent>
 *   <p>Main content goes here</p>
 * </MainContent>
 */
function mainContent({ children }: InterfaceMainContentProps): JSX.Element {
  return (
    <div className={styles.maincontainer} data-testid="mainContentCheck">
      {children}
    </div>
  );
}

export default mainContent;

import React from 'react';
import styles from './MainContent.module.css';
interface InterfaceMainContentProps {
  children: any;
}

// TODO: Implement extras plugins
// TODO: Implement additional styles
// id - [plugin/component-name]-main-content if is in plugin
function mainContent({ children }: InterfaceMainContentProps): JSX.Element {
  return (
    <div className={styles.maincontainer} data-testid="mainContentCheck">
      {children}
    </div>
  );
}

export default mainContent;

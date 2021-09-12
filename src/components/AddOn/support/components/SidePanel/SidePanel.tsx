import React from 'react';
import styles from './SidePanel.module.css';
interface SidePanelProps {
  collapse?: boolean;
  children: any;
}

// TODO: Implement Extras Plugin
// id - [plugin-name]-side-panel
function SidePanel({ collapse, children }: SidePanelProps): JSX.Element {
  return (
    <div
      className={`${styles.sidebarcontainer}${
        collapse ? styles.sidebarcollapsed : ''
      }`}
    >
      {children}
    </div>
  );
}

export default SidePanel;

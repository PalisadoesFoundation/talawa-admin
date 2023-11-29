import React from 'react';
import styles from './SidePanel.module.css';
interface InterfaceSidePanelProps {
  collapse?: boolean;
  children: any;
}

// TODO: Implement Extras Plugin
// id - [plugin-name]-side-panel
function sidePanel({
  collapse,
  children,
}: InterfaceSidePanelProps): JSX.Element {
  return (
    <div
      data-testid="SidePanel"
      className={`${styles.sidebarcontainer}${
        collapse ? styles.sidebarcollapsed : ''
      }`}
    >
      {children}
    </div>
  );
}

export default sidePanel;

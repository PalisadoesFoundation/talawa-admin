import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../Settings.module.css';

interface InterfaceSidebarToggleProps {
  hideDrawer: boolean | null;
  setHideDrawer: (value: boolean) => void;
}

const SidebarToggle: React.FC<InterfaceSidebarToggleProps> = ({
  hideDrawer,
  setHideDrawer,
}) => (
  <Button
    className={hideDrawer ? styles.opendrawer : styles.collapseSidebarButton}
    onClick={() => setHideDrawer(!hideDrawer)}
    data-testid={hideDrawer ? 'openMenu' : 'closeMenu'}
  >
    <i
      className={`fa fa-angle-double-${hideDrawer ? 'right' : 'left'}`}
      aria-hidden="true"
    />
  </Button>
);

export default SidebarToggle;

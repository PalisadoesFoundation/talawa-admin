import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../../../style/app-fixed.module.css';

interface InterfaceSidebarToggleProps {
  hideDrawer: boolean | null;
  setHideDrawer: (value: boolean) => void;
}

/**
 * SidebarToggle component.
 *
 * This component renders a button that toggles the visibility of a sidebar.
 * It uses the `hideDrawer` state to determine the current state of the sidebar
 * and toggles it when the button is clicked.
 *
 * @param hideDrawer - A boolean indicating whether the sidebar is hidden.
 * @param setHideDrawer - A function to update the `hideDrawer` state.
 *
 * @returns A button element that toggles the sidebar visibility.
 */
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

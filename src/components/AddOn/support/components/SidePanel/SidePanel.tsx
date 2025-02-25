import React from 'react';
import styles from '../../../../../style/app-fixed.module.css';
import type { InterfaceSidePanelProps } from 'types/AddOn/interface';
/**
 * Props for the `sidePanel` component.
 */

/**
 * A React component that renders a side panel with an optional collapse state.
 *
 * @param  props - The properties for the component.
 * @returns  A JSX element containing the side panel with the provided child elements.
 *
 * @example
 * <SidePanel collapse="true">
 *   <p>Side panel content</p>
 * </SidePanel>
 */
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

/**
 * SidebarToggle Component
 *
 * This component renders a button that toggles the visibility of a sidebar.
 * It uses the `react-bootstrap` Button component for styling and functionality.
 * The button's appearance and behavior are determined by the `hideDrawer` prop.
 *
 * @component
 * @param {InterfaceSidebarToggleProps} props - The props for the SidebarToggle component.
 * @param {boolean | null} props.hideDrawer - A boolean indicating whether the sidebar is hidden.
 *                                            If `true`, the sidebar is hidden; if `false`, it is visible.
 *                                            If `null`, the state is undefined.
 * @param {(value: boolean) => void} props.setHideDrawer - A function to update the `hideDrawer` state.
 *                                                         It toggles the visibility of the sidebar.
 *
 * @returns {JSX.Element} A button element that toggles the sidebar visibility.
 *
 * @example
 * ```tsx
 * const [hideDrawer, setHideDrawer] = useState(false);
 *
 * <SidebarToggle
 *   hideDrawer={hideDrawer}
 *   setHideDrawer={setHideDrawer}
 * />
 * ```
 *
 * @remarks
 * - The button's CSS class is dynamically set based on the `hideDrawer` state.
 * - The button includes an icon that changes direction based on the `hideDrawer` state.
 * - The `data-testid` attribute is used for testing purposes.
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import styles from 'style/app-fixed.module.css';

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

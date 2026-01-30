/**
 * SidebarNavItem Component
 *
 * A reusable navigation item component for sidebars with icon and label support.
 * Handles active/inactive states and adapts to drawer visibility.
 *
 * @param props - Object containing the properties for the SidebarNavItem:
 * @param to - Navigation target URL
 * @param icon - Icon component or element
 * @param label - Display label for the navigation item
 * @param testId - Test ID for testing purposes
 * @param hideDrawer - Whether the drawer is hidden/collapsed
 * @param onClick - Optional click handler
 * @param useSimpleButton - Use simple button style (for org drawers)
 * @param iconType - Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.
 * @param dataCy - Specific data-cy attribute for Cypress testing
 *
 * @returns The rendered SidebarNavItem component
 *
 * @example
 * ```tsx
 * // With SVG icon (default)
 * <SidebarNavItem
 *   to="/dashboard"
 *   icon={<DashboardIcon />}
 *   label="dashboard"
 *   testId="dashboardBtn"
 *   hideDrawer={false}
 * />
 *
 * // With react-icon
 * <SidebarNavItem
 *   to="/notifications"
 *   icon={<FaBell />}
 *   label="notifications"
 *   testId="notificationsBtn"
 *   hideDrawer={false}
 *   iconType="react-icon"
 * />
 * ```
 */

import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SidebarNavItem.module.css';
import type { ISidebarNavItemProps } from '../../types/SidebarNavItem/interface';

const SidebarNavItem = ({
  to,
  icon,
  label,
  testId,
  hideDrawer,
  onClick,
  useSimpleButton = false,
  iconType,
  dataCy,
}: ISidebarNavItemProps): React.ReactElement => {
  const renderIcon = useCallback(
    (isActive: boolean): React.ReactNode => {
      if (!React.isValidElement(icon) || typeof icon.type === 'string') {
        return icon;
      }

      // Use explicit iconType prop for robust icon detection
      const isReactIcon = iconType === 'react-icon';

      if (isReactIcon) {
        // Handle React Icons with style prop
        const existingClassName =
          (icon.props as { className?: string }).className ?? '';
        return React.cloneElement(
          icon as React.ReactElement<{ className?: string }>,
          {
            className: `${existingClassName} ${styles.iconReact} ${
              isActive ? styles.iconReactActive : styles.iconReactInactive
            }`.trim(),
          },
        );
      }

      // Handle SVG icons with fill/stroke props
      return React.cloneElement<React.SVGProps<SVGSVGElement>>(
        icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
        {
          fill: useSimpleButton
            ? isActive
              ? 'var(--bs-black)'
              : 'var(--bs-secondary)'
            : 'none',
          width: 25,
          height: 25,
          stroke: useSimpleButton
            ? undefined
            : isActive
              ? 'var(--sidebar-icon-stroke-active)'
              : 'var(--sidebar-icon-stroke-inactive)',
        },
      );
    },
    [icon, useSimpleButton, iconType],
  );

  return (
    <NavLink
      to={to}
      onClick={onClick}
      data-testid={testId}
      data-cy={dataCy}
      className={(navData) =>
        `${
          useSimpleButton
            ? navData.isActive
              ? styles.leftDrawerActiveButton
              : styles.leftDrawerInactiveButton
            : navData.isActive
              ? styles.sidebarBtnActive
              : styles.sidebarBtn
        } ${useSimpleButton ? styles.simpleButtonHeight : ''}`
      }
    >
      {({ isActive }) => (
        <div className={styles.contentWrapper}>
          <div className={styles.iconWrapper}>{renderIcon(isActive)}</div>
          {!hideDrawer && label}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;

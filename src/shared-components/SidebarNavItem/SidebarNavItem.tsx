/**
 * SidebarNavItem Component
 *
 * A reusable navigation item component for sidebars with icon and label support.
 * Handles active/inactive states and adapts to drawer visibility.
 *
 * @param props - The props for the component
 *
 * @returns React.ReactElement The rendered SidebarNavItem component
 *
 * @example
 * ```tsx
 * // With SVG icon (default)
 * <SidebarNavItem
 *   to="/dashboard"
 *   icon={<DashboardIcon />}
 *   label="Dashboard"
 *   testId="dashboardBtn"
 *   hideDrawer={false}
 * />
 * ```
 *
 * // With react-icon
 * ```tsx
 * <SidebarNavItem
 *   to="/notifications"
 *   icon={<FaBell />}
 *   label="Notifications"
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
        return React.cloneElement(
          icon as React.ReactElement<{ style?: React.CSSProperties }>,
          {
            style: {
              fontSize: 25,
              color: isActive ? '#000000' : 'var(--bs-secondary)',
            },
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
      className={({ isActive }) =>
        useSimpleButton
          ? isActive
            ? styles.leftDrawerActiveButton
            : styles.leftDrawerInactiveButton
          : isActive
            ? styles.sidebarBtnActive
            : styles.sidebarBtn
      }
      data-testid={testId}
      data-cy={dataCy}
      style={useSimpleButton ? { height: '40px' } : undefined}
    >
      {({ isActive }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.iconWrapper}>{renderIcon(isActive)}</div>
          {!hideDrawer && label}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;

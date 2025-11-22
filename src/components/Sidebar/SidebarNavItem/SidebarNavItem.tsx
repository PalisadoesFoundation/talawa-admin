/**
 * SidebarNavItem Component
 *
 * A reusable navigation item component for sidebars with icon and label support.
 * Handles active/inactive states and adapts to drawer visibility.
 *
 * @component
 * @param {ISidebarNavItemProps} props - The props for the component
 * @param {string} props.to - Navigation target URL
 * @param {React.ReactNode} props.icon - Icon component or element
 * @param {string} props.label - Display label for the navigation item
 * @param {string} props.testId - Test ID for testing purposes
 * @param {boolean} props.hideDrawer - Whether the drawer is hidden/collapsed
 * @param {() => void} [props.onClick] - Optional click handler
 * @param {boolean} [props.useSimpleButton] - Use simple button style (for org drawers)
 *
 * @returns {React.ReactElement} The rendered SidebarNavItem component
 *
 * @example
 * ```tsx
 * <SidebarNavItem
 *   to="/dashboard"
 *   icon={<DashboardIcon />}
 *   label="Dashboard"
 *   testId="dashboardBtn"
 *   hideDrawer={false}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import { NavLink } from 'react-router';
import styles from '../../../style/app-fixed.module.css';

export interface ISidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId: string;
  hideDrawer: boolean;
  onClick?: () => void;
  useSimpleButton?: boolean;
}

const SidebarNavItem = ({
  to,
  icon,
  label,
  testId,
  hideDrawer,
  onClick,
  useSimpleButton = false,
}: ISidebarNavItemProps): React.ReactElement => {
  const renderIcon = useCallback(
    (isActive: boolean): React.ReactNode => {
      if (!React.isValidElement(icon) || typeof icon.type === 'string') {
        return icon;
      }

      // Check if it's a React Icon (from react-icons) by checking if it has a displayName or is a function component
      // React Icons typically don't have SVG-specific props and use 'style' instead
      const isReactIcon =
        icon.type &&
        typeof icon.type === 'function' &&
        (icon.type.name?.startsWith('Fa') ||
          icon.type.name?.startsWith('Md') ||
          icon.type.name?.startsWith('Io') ||
          icon.type.name?.startsWith('Bs') ||
          icon.type.name?.startsWith('Ai') ||
          icon.type.name?.startsWith('Fi') ||
          icon.type.name?.startsWith('Gi') ||
          icon.type.name?.startsWith('Hi') ||
          icon.type.name?.startsWith('Ri') ||
          icon.type.name?.startsWith('Si') ||
          icon.type.name?.startsWith('Ti') ||
          icon.type.name?.startsWith('Tb') ||
          icon.type.name?.startsWith('Vsc'));

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
          fontSize: 25,
          stroke: useSimpleButton
            ? undefined
            : isActive
              ? 'var(--sidebar-icon-stroke-active)'
              : 'var(--sidebar-icon-stroke-inactive)',
        },
      );
    },
    [icon, useSimpleButton],
  );

  return (
    <NavLink to={to} onClick={onClick}>
      {({ isActive }) => (
        <button
          type="button"
          className={
            useSimpleButton
              ? isActive
                ? styles.leftDrawerActiveButton
                : styles.leftDrawerInactiveButton
              : isActive
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
          }
          data-testid={testId}
          style={useSimpleButton ? { height: '40px' } : undefined}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.iconWrapper}>{renderIcon(isActive)}</div>
            {!hideDrawer && label}
          </div>
        </button>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;

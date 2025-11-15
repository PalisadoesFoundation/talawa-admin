/**
 * SidebarMenuItem Component
 *
 * A shared component for rendering individual navigation items in the sidebar.
 * Supports both Admin Portal and User Portal styling with consistent active states.
 *
 * @component
 * @param {ISidebarMenuItemProps} props - The props for the component.
 * @param {string} props.to - The navigation path for the menu item.
 * @param {React.ReactNode} props.icon - The icon to display for the menu item.
 * @param {string} props.label - The text label for the menu item.
 * @param {string} props.testId - The data-testid attribute for testing.
 * @param {boolean} props.hideDrawer - Whether the sidebar is collapsed.
 * @param {() => void} [props.onClick] - Optional click handler.
 * @param {'admin' | 'user'} [props.variant='admin'] - The styling variant (admin or user portal).
 *
 * @returns {JSX.Element} The rendered SidebarMenuItem component.
 *
 * @example
 * ```tsx
 * <SidebarMenuItem
 *   to="/dashboard"
 *   icon={<DashboardIcon />}
 *   label="Dashboard"
 *   testId="dashboardBtn"
 *   hideDrawer={false}
 *   variant="admin"
 * />
 * ```
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from 'style/app-fixed.module.css';

export interface ISidebarMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId: string;
  hideDrawer: boolean;
  onClick?: () => void;
  variant?: 'admin' | 'user';
}

const SidebarMenuItem = ({
  to,
  icon,
  label,
  testId,
  hideDrawer,
  onClick,
  variant = 'admin',
}: ISidebarMenuItemProps): JSX.Element => {
  const renderAdminVariant = (isActive: boolean): JSX.Element => {
    const styledIcon =
      React.isValidElement(icon) && typeof icon.type !== 'string'
        ? React.cloneElement<React.SVGProps<SVGSVGElement>>(
            icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
            {
              fill: 'none',
              fontSize: 25,
              stroke: isActive
                ? 'var(--sidebar-icon-stroke-active)'
                : 'var(--sidebar-icon-stroke-inactive)',
            },
          )
        : icon;

    return (
      <button
        className={`${isActive ? styles.sidebarBtnActive : styles.sidebarBtn}`}
        data-testid={testId}
        type="button"
      >
        <div className={styles.iconWrapper}>{styledIcon}</div>
        {!hideDrawer && label}
      </button>
    );
  };

  const renderUserVariant = (isActive: boolean): JSX.Element => {
    let styledIcon = icon;

    if (React.isValidElement(icon) && typeof icon.type !== 'string') {
      // Check if it's a React Icon (like FaBell) by checking if it has style prop
      const iconProps = (
        icon as React.ReactElement<{ style?: React.CSSProperties }>
      ).props;
      if (iconProps.style) {
        // It's a React Icon, update its color
        styledIcon = React.cloneElement(
          icon as React.ReactElement<{ style?: React.CSSProperties }>,
          {
            style: {
              ...iconProps.style,
              color: isActive ? '#000000' : 'var(--bs-secondary)',
            },
          },
        );
      } else {
        // It's an SVG icon
        styledIcon = React.cloneElement<React.SVGProps<SVGSVGElement>>(
          icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
          {
            fill: 'none',
            fontSize: 25,
            stroke: isActive
              ? 'var(--sidebar-icon-stroke-active)'
              : 'var(--sidebar-icon-stroke-inactive)',
          } as React.SVGProps<SVGSVGElement>,
        );
      }
    }

    return (
      <button
        className={`${isActive ? styles.sidebarBtnActive : styles.sidebarBtn}`}
        data-testid={testId}
        type="button"
      >
        <div className={styles.iconWrapper}>{styledIcon}</div>
        {!hideDrawer && label}
      </button>
    );
  };

  return (
    <NavLink to={to} onClick={onClick}>
      {({ isActive }) =>
        variant === 'admin'
          ? renderAdminVariant(isActive)
          : renderUserVariant(isActive)
      }
    </NavLink>
  );
};

export default SidebarMenuItem;

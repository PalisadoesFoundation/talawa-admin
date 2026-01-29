/**
 * SidebarPluginSection Component
 *
 * Renders plugin items in the sidebar with proper icon handling and navigation.
 * Supports both global and organization-specific plugins.
 *
 * @param props - The props for the component
 * @returns The rendered SidebarPluginSection component or null if no plugins
 *
 * @example
 * ```tsx
 * <SidebarPluginSection
 *   pluginItems={pluginDrawerItems}
 *   hideDrawer={false}
 *   orgId="123456"
 *   onItemClick={handleLinkClick}
 * />
 * ```
 */

import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { IDrawerExtension } from 'plugin';
import PluginLogo from 'assets/svgs/plugins.svg?react';
import styles from './SidebarPluginSection.module.css';
import type { ISidebarPluginSectionProps } from '../../types/SidebarPluginSection/interface';

const SidebarPluginSection = ({
  pluginItems,
  hideDrawer,
  orgId,
  onItemClick,
  useSimpleButton = false,
}: ISidebarPluginSectionProps): React.ReactElement | null => {
  const { t: tCommon } = useTranslation('common');

  const renderPluginItem = useCallback(
    (item: IDrawerExtension) => {
      const path = orgId ? item.path.replace(':orgId', orgId) : item.path;

      return (
        <NavLink
          to={path}
          key={item.pluginId}
          onClick={onItemClick}
          className={({ isActive }) =>
            useSimpleButton
              ? isActive
                ? styles.leftDrawerActiveButton
                : styles.leftDrawerInactiveButton
              : isActive
                ? styles.sidebarBtnActive
                : styles.sidebarBtn
          }
          data-testid={`plugin-${item.pluginId}-btn`}
          aria-label={hideDrawer ? item.label : undefined}
          title={hideDrawer ? item.label : undefined}
        >
          <div
            style={
              useSimpleButton
                ? { display: 'flex', alignItems: 'center' }
                : undefined
            }
          >
            <div className={styles.iconWrapper}>
              {item.icon ? (
                <img
                  src={item.icon}
                  alt={hideDrawer ? '' : item.label}
                  aria-hidden={hideDrawer ? 'true' : undefined}
                  className={styles.pluginIcon}
                />
              ) : (
                <PluginLogo
                  fill="none"
                  fontSize={25}
                  stroke="var(--sidebar-icon-stroke-inactive)"
                  aria-hidden="true"
                />
              )}
            </div>
            {!hideDrawer && item.label}
          </div>
        </NavLink>
      );
    },
    [orgId, onItemClick, hideDrawer, useSimpleButton],
  );

  // Don't render if no plugin items
  if (!pluginItems || pluginItems.length === 0) {
    return null;
  }

  return (
    <>
      {!hideDrawer &&
        (useSimpleButton ? (
          <h5
            className={`${styles.titleHeader} ${styles.simpleHeader} text-secondary`}
            data-testid="pluginSettingsHeader"
          >
            {tCommon('plugins')}
          </h5>
        ) : (
          <h4
            className={`${styles.titleHeader} ${styles.regularHeader}`}
            data-testid="pluginSettingsHeader"
          >
            {tCommon('pluginSettings')}
          </h4>
        ))}
      {pluginItems.map((item) => renderPluginItem(item))}
    </>
  );
};

export default SidebarPluginSection;

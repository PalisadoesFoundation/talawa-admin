import type { IDrawerExtension } from 'plugin';

/**
 * Interface for SidebarPluginSection component props.
 *
 * @param pluginItems - Array of plugin drawer items
 * @param hideDrawer - Whether the drawer is hidden/collapsed
 * @param orgId - (Optional) Organization ID for org-specific plugins
 * @param onItemClick - (Optional) Handler for plugin item clicks
 * @param useSimpleButton - (Optional) Use simple button style (for org drawers)
 */
export interface ISidebarPluginSectionProps {
  pluginItems: IDrawerExtension[];
  hideDrawer: boolean;
  orgId?: string;
  onItemClick?: () => void;
  useSimpleButton?: boolean;
}

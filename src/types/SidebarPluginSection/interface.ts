import type { IDrawerExtension } from 'plugin';

/**
 * Interface for SidebarPluginSection component props.
 *
 * @interface ISidebarPluginSectionProps
 * @property {IDrawerExtension[]} pluginItems - Array of plugin drawer items
 * @property {boolean} hideDrawer - Whether the drawer is hidden/collapsed
 * @property {string} [orgId] - Organization ID for org-specific plugins
 * @property {() => void} [onItemClick] - Handler for plugin item clicks
 * @property {boolean} [useSimpleButton] - Use simple button style (for org drawers)
 */
export interface ISidebarPluginSectionProps {
  pluginItems: IDrawerExtension[];
  hideDrawer: boolean;
  orgId?: string;
  onItemClick?: () => void;
  useSimpleButton?: boolean;
}

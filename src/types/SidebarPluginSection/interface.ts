import type { IDrawerExtension } from 'plugin';

/**
 * Interface for SidebarPluginSection component props.
 */
export interface ISidebarPluginSectionProps {
  /** Array of plugin drawer items */
  pluginItems: IDrawerExtension[];
  /** Whether the drawer is hidden/collapsed */
  hideDrawer: boolean;
  /** (Optional) Organization ID for org-specific plugins */
  orgId?: string;
  /** (Optional) Handler for plugin item clicks */
  onItemClick?: () => void;
  /** (Optional) Use simple button style (for org drawers) */
  useSimpleButton?: boolean;
}

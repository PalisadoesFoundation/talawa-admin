import { IPluginMeta } from 'plugin';

/**
 * Props for PluginCard component.
 */
export interface InterfacePluginCardProps {
  plugin: IPluginMeta;
  onManage: (plugin: IPluginMeta) => void;
}

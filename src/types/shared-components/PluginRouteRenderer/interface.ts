import type { ReactNode } from 'react';
import type { IRouteExtension } from '../../../plugin/types';

/**
 * Props for PluginRouteRenderer component.
 */
export interface InterfacePluginRouteRendererProps {
  route: IRouteExtension;
  fallback?: ReactNode;
}

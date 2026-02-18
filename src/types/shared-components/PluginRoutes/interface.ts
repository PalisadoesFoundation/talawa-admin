import type React from 'react';

/**
 * Props for PluginRoutes component.
 */
export interface InterfacePluginRoutesProps {
  userPermissions?: string[];
  isAdmin?: boolean;
  fallback?: React.ReactElement;
}

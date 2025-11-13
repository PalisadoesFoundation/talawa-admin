/**
 * Dynamic Plugin Routes Component
 *
 * This component dynamically renders routes from loaded plugins based on their manifests.
 * Routes are filtered by permissions and admin access levels.
 */

/* eslint-disable react/no-multi-comp */

import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { usePluginRoutes } from '../hooks';
import type { IRouteExtension } from '../types';

interface InterfacePluginRoutesProps {
  userPermissions?: string[];
  isAdmin?: boolean;
  fallback?: React.ReactElement;
}

/**
 * Creates an error component to display when plugin loading fails
 */
export const createPluginErrorComponent = (
  componentName: string,
  pluginId: string,
  errorMessage: string,
): React.ComponentType => {
  return () => (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        margin: '20px',
      }}
    >
      <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>Plugin Error</h3>
      <p style={{ color: '#6c757d', marginBottom: '8px' }}>
        Failed to load component: <strong>{componentName}</strong>
      </p>
      <p style={{ color: '#6c757d', marginBottom: '8px' }}>
        Plugin: <strong>{pluginId}</strong>
      </p>
      <p style={{ color: '#6c757d', fontSize: '14px' }}>{errorMessage}</p>
    </div>
  );
};

/**
 * Handles the resolution of a plugin component from a loaded module
 */
export const resolvePluginComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any,
  componentName: string,
  pluginId: string,
): { default: React.ComponentType } => {
  // Try to get the named export first, then default export
  const Component = module[componentName] || module.default;
  if (!Component) {
    throw new Error(
      `Component '${componentName}' not found in plugin '${pluginId}'`,
    );
  }
  return { default: Component };
};

/**
 * Handles errors that occur during plugin loading
 */
export const handlePluginLoadError = (
  error: Error,
  componentName: string,
  pluginId: string,
): { default: React.ComponentType } => {
  console.error(
    `Failed to load plugin component '${componentName}' from '${pluginId}':`,
    error,
  );
  return {
    default: createPluginErrorComponent(componentName, pluginId, error.message),
  };
};

/**
 * Component that renders plugin routes dynamically
 */
const PluginRoutes: React.FC<InterfacePluginRoutesProps> = ({
  userPermissions = [],
  isAdmin = false,
  fallback = <div>Loading plugin...</div>,
}) => {
  const routes = usePluginRoutes(userPermissions, isAdmin);
  const safeRoutes = Array.isArray(routes) ? routes : [];

  const renderPluginRoute = (route: IRouteExtension) => {
    const componentName = route.component || '';
    const pluginId = route.pluginId || '';

    // Create bound handlers for this specific route
    const handleModuleResolution = (module: unknown) =>
      resolvePluginComponent(module, componentName, pluginId);

    const handleLoadError = (error: Error) =>
      handlePluginLoadError(error, componentName, pluginId);

    // Dynamically import the plugin's main entry point and get the specific component
    const PluginComponent = lazy(() =>
      import(/* @vite-ignore */ `/plugins/${pluginId}/index.ts`)
        .then(handleModuleResolution)
        .catch(handleLoadError),
    );

    return (
      <Route
        key={`${pluginId}-${route.path}`}
        path={route.path}
        element={
          <Suspense fallback={fallback}>
            <PluginComponent />
          </Suspense>
        }
      />
    );
  };

  return <>{safeRoutes.map(renderPluginRoute)}</>;
};

export default PluginRoutes;

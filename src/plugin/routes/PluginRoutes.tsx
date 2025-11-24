/**
 * Dynamic Plugin Routes Component
 *
 * This component dynamically renders routes from loaded plugins based on their manifests.
 * Routes are filtered by permissions and admin access levels.
 */

import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { usePluginRoutes } from '../hooks';
import { dynamicImportPlugin } from '../utils';
import type { IRouteExtension } from '../types';

interface IPluginRoutesProps {
  userPermissions?: string[];
  isAdmin?: boolean;
  fallback?: React.ReactElement;
}

/**
 * Component that renders plugin routes dynamically
 */
const PluginRoutes: React.FC<IPluginRoutesProps> = ({
  userPermissions = [],
  isAdmin = false,
  fallback = <div>Loading plugin...</div>,
}) => {
  const routes = usePluginRoutes(userPermissions, isAdmin);
  const safeRoutes = Array.isArray(routes) ? routes : [];

  const renderPluginRoute = (route: IRouteExtension) => {
    // Dynamically import the plugin's main entry point and get the specific component
    const PluginComponent = lazy(() =>
      dynamicImportPlugin(route.pluginId || '')
        .then((module: unknown) => {
          // Try to get the named export first, then default export
          const moduleObj = module as Record<string, unknown>;
          const Component = moduleObj[route.component] || moduleObj.default;
          if (!Component) {
            throw new Error(
              `Component '${route.component}' not found in plugin '${route.pluginId}'`,
            );
          }
          return { default: Component as React.ComponentType<unknown> };
        })
        .catch((error) => {
          console.error(
            `Failed to load plugin component '${route.component}' from '${route.pluginId}':`,
            error,
          );
          // Return a fallback error component
          return {
            default: () => (
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
                <h3 style={{ color: '#dc3545', marginBottom: '16px' }}>
                  Plugin Error
                </h3>
                <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                  Failed to load component: <strong>{route.component}</strong>
                </p>
                <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                  Plugin: <strong>{route.pluginId}</strong>
                </p>
                <p style={{ color: '#6c757d', fontSize: '14px' }}>
                  {error.message}
                </p>
              </div>
            ),
          };
        }),
    );

    return (
      <Route
        key={`${route.pluginId}-${route.path}`}
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

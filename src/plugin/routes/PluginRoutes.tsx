/**
 * Dynamic Plugin Routes Component
 *
 * This component dynamically renders routes from loaded plugins based on their manifests.
 * Routes are filtered by permissions and admin access levels.
 */

import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { usePluginRoutes } from '../hooks';
import type { IRouteExtension } from '../types';
import { t } from 'i18next';

interface IPluginRoutesProps {
  userPermissions?: string[];
  isAdmin?: boolean;
  fallback?: React.ReactElement;
}

/**
 * Component that renders plugin routes dynamically
 */
const PluginRoutes: React.FC<IPluginRoutesProps> = ({
  isAdmin = false,
  fallback = <div>{t('Loading plugin...')}</div>,
}) => {
  const routes = usePluginRoutes(isAdmin);
  const safeRoutes = Array.isArray(routes) ? routes : [];

  const renderPluginRoute = (route: IRouteExtension) => {
    // Dynamically import the plugin's main entry point and get the specific component
    const PluginComponent = lazy(() =>
      import(/* @vite-ignore */ `/plugins/${route.pluginId}/index.ts`)
        .then((module) => {
          // Try to get the named export first, then default export
          const Component = module[route.component] || module.default;
          if (!Component) {
            throw new Error(
              `Component '${route.component}' not found in plugin '${route.pluginId}'`,
            );
          }
          return { default: Component };
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
                  {t('Plugin Error')}
                </h3>
                <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                  {t('Failed to load component:')}{' '}
                  <strong>{route.component}</strong>
                </p>
                <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                  {t('Plugin:')} <strong>{route.pluginId}</strong>
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

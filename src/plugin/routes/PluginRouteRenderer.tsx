/**
 * Plugin Route Renderer Component
 *
 * This component handles the rendering of plugin components using the plugin registry.
 * Components are imported statically for better TypeScript support and performance.
 */

import React, { Suspense } from 'react';
import type { IRouteExtension } from '../types';
import { getPluginComponents, isPluginRegistered } from '../registry';

interface IPluginRouteRendererProps {
  route: IRouteExtension;
  fallback?: React.ReactElement;
}

/**
 * Component to render plugin routes using the plugin registry
 */
const PluginRouteRenderer: React.FC<IPluginRouteRendererProps> = ({
  route,
  fallback = <div>Loading plugin...</div>,
}) => {
  // Check if pluginId is provided
  if (!route.pluginId) {
    console.error(`Plugin ID is missing from route`);
    return (
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
          Plugin ID Missing
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
          Component: <strong>{route.component}</strong>
        </p>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          This route does not have a valid plugin ID
        </p>
      </div>
    );
  }

  // Check if plugin is registered
  if (!isPluginRegistered(route.pluginId)) {
    console.error(`Plugin '${route.pluginId}' not found in plugin registry`);
    return (
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
          Plugin Not Registered
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
          Plugin: <strong>{route.pluginId}</strong>
        </p>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Please add this plugin to the plugin registry in{' '}
          <code>src/plugin/registry.ts</code>
        </p>
      </div>
    );
  }

  // Get the plugin components
  const pluginComponents = getPluginComponents(route.pluginId);

  if (!pluginComponents) {
    console.error(`No components found for plugin '${route.pluginId}'`);
    return (
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
          No Components Found
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
          Plugin: <strong>{route.pluginId}</strong>
        </p>
      </div>
    );
  }

  // Get the specific component for this route
  const PluginComponent = pluginComponents[route.component];

  if (!PluginComponent) {
    console.error(
      `Component '${route.component}' not found in plugin '${route.pluginId}'`,
    );
    return (
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
          Component Not Found
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
          Component: <strong>{route.component}</strong>
        </p>
        <p style={{ color: '#6c757d', marginBottom: '8px' }}>
          Plugin: <strong>{route.pluginId}</strong>
        </p>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Available components: {Object.keys(pluginComponents).join(', ')}
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <PluginComponent />
    </Suspense>
  );
};

export default PluginRouteRenderer;

/**
 * Plugin Route Renderer Component
 *
 * This component handles the rendering of plugin components using the plugin registry.
 * Components are imported statically for better TypeScript support and performance.
 */

import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { getPluginComponents, isPluginRegistered } from '../registry';
import styles from './PluginRouteRenderer.module.css';

import type { InterfacePluginRouteRendererProps } from '../../types/shared-components/PluginRouteRenderer/interface';

/**
 * Component to render plugin routes using the plugin registry.
 *
 * @param props - InterfacePluginRouteRendererProps
 * @returns JSX.Element
 */
const PluginRouteRenderer: React.FC<InterfacePluginRouteRendererProps> = ({
  route,
  fallback,
}) => {
  const { t } = useTranslation();
  const loadingFallback = fallback ?? <div>{t('plugins.loading')}</div>;

  // Check if pluginId is provided
  if (!route.pluginId) {
    console.error(`Plugin ID is missing from route`);
    return (
      <div
        className={styles.errorContainer}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3 className={styles.errorTitle}>
          {t('plugins.errors.missingPluginId.title')}
        </h3>
        <p className={styles.errorText}>
          {t('plugins.component')}: <strong>{route.component}</strong>
        </p>
        <p className={styles.errorDescription}>
          {t('plugins.errors.missingPluginId.description')}
        </p>
      </div>
    );
  }

  // Check if plugin is registered
  if (!isPluginRegistered(route.pluginId)) {
    console.error(`Plugin '${route.pluginId}' not found in plugin registry`);
    return (
      <div
        className={styles.errorContainer}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3 className={styles.errorTitle}>
          {t('plugins.errors.notRegistered.title')}
        </h3>
        <p className={styles.errorText}>
          {t('plugins.plugin')}: <strong>{route.pluginId}</strong>
        </p>
        <p className={styles.errorDescription}>
          {t('plugins.errors.notRegistered.description', {
            registryPath: 'src/plugin/registry.ts',
          })}
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
        className={styles.errorContainer}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3 className={styles.errorTitle}>
          {t('plugins.errors.noComponents.title')}
        </h3>
        <p className={styles.errorText}>
          {t('plugins.plugin')}: <strong>{route.pluginId}</strong>
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
        className={styles.errorContainer}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3 className={styles.errorTitle}>
          {t('plugins.errors.componentNotFound.title')}
        </h3>
        <p className={styles.errorText}>
          {t('plugins.component')}: <strong>{route.component}</strong>
        </p>
        <p className={styles.errorText}>
          {t('plugins.plugin')}: <strong>{route.pluginId}</strong>
        </p>
        <p className={styles.errorDescription}>
          {t('plugins.errors.componentNotFound.availableComponents', {
            components: Object.keys(pluginComponents).join(', '),
          })}
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={loadingFallback}>
      <PluginComponent />
    </Suspense>
  );
};

export default PluginRouteRenderer;

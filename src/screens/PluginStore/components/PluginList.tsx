/**
 * Plugin list component that handles rendering plugins and empty states
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PluginCard from './PluginCard';
import type { IPluginMeta } from 'plugin';
import styles from './Plugin.module.css';
interface IPluginListProps {
  plugins: IPluginMeta[];
  searchTerm: string;
  filterOption: string;
  onManagePlugin: (plugin: IPluginMeta) => void;
}

export default function PluginList({
  plugins,
  searchTerm,
  filterOption,
  onManagePlugin,
}: IPluginListProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });

  if (plugins.length === 0) {
    return (
      <div className={styles.emptyState} data-testid="plugin-list-empty">
        <div className={styles.emptyTitle}>
          {plugins.length === 0 && searchTerm
            ? t('noPluginsFound')
            : filterOption === 'installed'
              ? t('noInstalledPlugins')
              : t('noPluginsAvailable')}
        </div>
        <div className={styles.emptyDescription}>
          {filterOption === 'installed'
            ? t('installPluginsToSeeHere')
            : t('checkBackLater')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer} data-testid="plugin-list-container">
      {plugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} onManage={onManagePlugin} />
      ))}
    </div>
  );
}

/**
 * Plugin list component that handles rendering plugins and empty states
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExtensionOutlined } from '@mui/icons-material';
import EmptyState from 'shared-components/EmptyState/EmptyState';
import PluginCard from './PluginCard';
import type { IPluginMeta } from 'plugin';
import styles from './PluginList.module.css';

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

  const getEmptyMessage = (): string => {
    if (searchTerm) return t('noPluginsFound');
    if (filterOption === 'installed') return t('noInstalledPlugins');
    return t('noPluginsAvailable');
  };

  const getEmptyDescription = (): string | undefined => {
    if (searchTerm) return t('tryDifferentSearch');
    if (filterOption === 'installed') return t('installPluginsToSeeHere');
    return t('explorePluginStore');
  };

  if (plugins.length === 0) {
    return (
      <EmptyState
        icon={<ExtensionOutlined />}
        message={getEmptyMessage()}
        description={getEmptyDescription()}
        dataTestId="plugins-empty-state"
      />
    );
  }

  return (
    <div
      className={styles.pluginListContainer}
      data-testid="plugin-list-container"
    >
      {plugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} onManage={onManagePlugin} />
      ))}
    </div>
  );
}

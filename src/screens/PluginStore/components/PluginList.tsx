/**
 * Plugin list component that handles rendering plugins and empty states
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import PluginCard from './PluginCard';
import type { IPluginMeta } from 'plugin';

interface PluginListProps {
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
}: PluginListProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });

  if (plugins.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e7e7e7',
        }}
        data-testid="plugin-list-empty"
      >
        <div style={{ fontSize: 18, color: '#666', marginBottom: 8 }}>
          {plugins.length === 0 && searchTerm
            ? t('noPluginsFound')
            : filterOption === 'installed'
              ? t('noInstalledPlugins')
              : t('noPluginsAvailable')}
        </div>
        <div style={{ fontSize: 14, color: '#888' }}>
          {filterOption === 'installed'
            ? t('installPluginsToSeeHere')
            : t('checkBackLater')}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
      data-testid="plugin-list-container"
    >
      {plugins.map((plugin) => (
        <PluginCard key={plugin.id} plugin={plugin} onManage={onManagePlugin} />
      ))}
    </div>
  );
}

/**
 * Individual plugin card component for the plugin store
 */
import React from 'react';
import { Button } from '@mui/material';
import type { IPluginMeta } from 'plugin';
import { useTranslation } from 'react-i18next';
import styles from './PluginList.module.css';

interface IPluginCardProps {
  plugin: IPluginMeta;
  onManage: (plugin: IPluginMeta) => void;
}

export default function PluginCard({ plugin, onManage }: IPluginCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });

  return (
    <div
      className={styles.pluginCard}
      data-testid={`plugin-list-item-${plugin.id}`}
    >
      {/* Icon */}
      <img
        src={plugin.icon}
        alt={t('pluginIcon')}
        className={styles.pluginIcon}
        data-testid={`plugin-icon-${plugin.id}`}
      />
      {/* Name, Description, Author */}
      <div className={styles.pluginInfo}>
        <div
          className={styles.pluginName}
          data-testid={`plugin-name-${plugin.id}`}
        >
          {plugin.name}
        </div>
        <div
          className={styles.pluginDescription}
          data-testid={`plugin-description-${plugin.id}`}
        >
          {plugin.description}
        </div>
        <div
          className={styles.pluginAuthor}
          data-testid={`plugin-author-${plugin.id}`}
        >
          {plugin.author}
        </div>
      </div>
      {/* Manage Button */}
      <div className={styles.pluginActions}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onManage(plugin)}
          className="w-100 mb-2"
          data-testid={`plugin-action-btn-${plugin.id}`}
        >
          {t('manage')}
        </Button>
      </div>
    </div>
  );
}

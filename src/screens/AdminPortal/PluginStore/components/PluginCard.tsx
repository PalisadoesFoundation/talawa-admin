/**
 * Individual plugin card component for the plugin store.
 * Renders as a card with icon, name, description, toggle switch, and configure link.
 */
import React, { useState } from 'react';
import type { IPluginMeta } from 'plugin';
import { useTranslation } from 'react-i18next';
import styles from './PluginCard.module.css';

/** Deterministic emoji fallback when no icon URL is provided */
const PLUGIN_EMOJIS = [
  '\u{1F4AC}',
  '\u{1F4C8}',
  '\u{1F4B0}',
  '\u{1F4C5}',
  '\u{2709}',
  '\u{270B}',
  '\u{1F527}',
  '\u{1F50C}',
  '\u{1F4E6}',
  '\u{2699}',
];

function getPluginEmoji(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PLUGIN_EMOJIS[Math.abs(hash) % PLUGIN_EMOJIS.length];
}

function isImageUrl(icon: string | undefined): boolean {
  if (!icon) return false;
  return (
    icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:')
  );
}

interface IPluginCardProps {
  plugin: IPluginMeta;
  onManage: (plugin: IPluginMeta) => void;
}

export default function PluginCard({ plugin, onManage }: IPluginCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const [enabled, setEnabled] = useState(false);

  const iconContent = isImageUrl(plugin.icon) ? (
    <img src={plugin.icon} alt={plugin.name} />
  ) : (
    <span>{plugin.icon || getPluginEmoji(plugin.name)}</span>
  );

  return (
    <div className={styles.card} data-testid={`plugin-list-item-${plugin.id}`}>
      <div
        className={styles.iconWrapper}
        data-testid={`plugin-icon-${plugin.id}`}
      >
        {iconContent}
      </div>
      <div className={styles.name} data-testid={`plugin-name-${plugin.id}`}>
        {plugin.name}
      </div>
      <div
        className={styles.description}
        data-testid={`plugin-description-${plugin.id}`}
      >
        {plugin.description}
      </div>
      <div className={styles.footer}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            aria-label={`${t('enable')} ${plugin.name}`}
            data-testid={`plugin-toggle-${plugin.id}`}
          />
          <span className={styles.track} />
          <span className={styles.knob} />
        </label>
        <span
          className={styles.configureLink}
          onClick={() => onManage(plugin)}
          data-testid={`plugin-action-btn-${plugin.id}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onManage(plugin);
          }}
        >
          {t('configure')}
        </span>
      </div>
    </div>
  );
}

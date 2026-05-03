/**
 * Individual plugin card component for the plugin store.
 * Renders as a card with icon, name, description, toggle switch, and configure link.
 */
import React, { useState } from 'react';
import type { IPluginMeta } from 'plugin';
import { useTranslation } from 'react-i18next';

interface IPluginCardProps {
  plugin: IPluginMeta;
  onManage: (plugin: IPluginMeta) => void;
}

export default function PluginCard({ plugin, onManage }: IPluginCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const [enabled, setEnabled] = useState(false);

  return (
    <div
      className="plugin-card"
      data-testid={`plugin-list-item-${plugin.id}`}
    >
      <div
        className="plugin-icon"
        data-testid={`plugin-icon-${plugin.id}`}
      >
        {plugin.icon}
      </div>
      <div
        className="plugin-name"
        data-testid={`plugin-name-${plugin.id}`}
      >
        {plugin.name}
      </div>
      <div
        className="plugin-desc"
        data-testid={`plugin-description-${plugin.id}`}
      >
        {plugin.description}
      </div>
      <div className="plugin-footer">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            aria-label={`${t('enable')} ${plugin.name}`}
            data-testid={`plugin-toggle-${plugin.id}`}
          />
          <span className="toggle-track"></span>
          <span className="toggle-knob"></span>
        </label>
        <span
          className="configure-link"
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

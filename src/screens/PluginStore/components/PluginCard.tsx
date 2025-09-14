/**
 * Individual plugin card component for the plugin store
 */
import React from 'react';
import { Button } from '@mui/material';
import type { IPluginMeta } from 'plugin';

interface PluginCardProps {
  plugin: IPluginMeta;
  onManage: (plugin: IPluginMeta) => void;
}

export default function PluginCard({ plugin, onManage }: PluginCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(60,64,67,0.07)',
        border: '1px solid #e7e7e7',
        padding: '16px 24px',
        minHeight: 80,
        transition: 'box-shadow 0.2s',
      }}
      data-testid={`plugin-list-item-${plugin.id}`}
    >
      {/* Icon */}
      <img
        src={plugin.icon}
        alt="Plugin Icon"
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          objectFit: 'cover',
          background: '#f5f5f5',
          marginRight: 24,
        }}
        data-testid={`plugin-icon-${plugin.id}`}
      />
      {/* Name, Description, Author */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          data-testid={`plugin-name-${plugin.id}`}
        >
          {plugin.name}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#555',
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          data-testid={`plugin-description-${plugin.id}`}
        >
          {plugin.description}
        </div>
        <div
          style={{ fontSize: 13, color: '#888' }}
          data-testid={`plugin-author-${plugin.id}`}
        >
          {plugin.author}
        </div>
      </div>
      {/* Manage Button */}
      <div style={{ marginLeft: 24, minWidth: 120 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onManage(plugin)}
          className="w-100 mb-2"
          data-testid={`plugin-action-btn-${plugin.id}`}
        >
          Manage
        </Button>
      </div>
    </div>
  );
}

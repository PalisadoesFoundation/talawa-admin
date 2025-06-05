import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import PluginModal from './PluginModal';
import i18nForTest from 'utils/i18nForTest';

describe('PluginModal Component', () => {
  const mockPlugin = {
    id: 'calendar',
    name: 'Calendar',
    description: 'A plugin to add calendar functionality to your community.',
    author: 'Talawa Team',
    icon: '/images/logo512.png',
  };

  const defaultProps = {
    show: true,
    onHide: vi.fn(),
    pluginId: 'calendar',
    meta: mockPlugin,
    loading: false,
    isInstalled: vi.fn(),
    getInstalledPlugin: vi.fn(),
    installPlugin: vi.fn(),
    togglePluginStatus: vi.fn(),
    uninstallPlugin: vi.fn(),
  };

  it('renders modal with plugin details', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PluginModal {...defaultProps} />
      </I18nextProvider>,
    );

    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Talawa Team')).toBeInTheDocument();
  });

  it('shows install button for uninstalled plugins', () => {
    defaultProps.isInstalled.mockReturnValue(false);

    render(
      <I18nextProvider i18n={i18nForTest}>
        <PluginModal {...defaultProps} />
      </I18nextProvider>,
    );

    expect(screen.getByText('Install')).toBeInTheDocument();
  });

  it('shows manage buttons for installed plugins', () => {
    defaultProps.isInstalled.mockReturnValue(true);
    defaultProps.getInstalledPlugin.mockReturnValue({
      ...mockPlugin,
      status: 'active',
    });

    render(
      <I18nextProvider i18n={i18nForTest}>
        <PluginModal {...defaultProps} />
      </I18nextProvider>,
    );

    expect(screen.getByText('Deactivate')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <PluginModal {...defaultProps} loading={true} />
      </I18nextProvider>,
    );

    // Check for loading text
    expect(screen.getByText('Loading details...')).toBeInTheDocument();

    // Check that action buttons are disabled
    const actionButtonTexts = [
      'Install',
      'Uninstall',
      'Activate',
      'Deactivate',
    ];
    actionButtonTexts.forEach((text) => {
      const button = screen.queryByText(text);
      if (button) {
        expect(button).toBeDisabled();
      }
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import PluginStore from './PluginStore';
import i18nForTest from 'utils/i18nForTest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('PluginStore Component', () => {
  beforeEach(() => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the plugin store', () => {
    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <PluginStore />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByTestId('searchPlugins')).toBeInTheDocument();
  });

  it('displays available plugins', async () => {
    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <PluginStore />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Polls')).toBeInTheDocument();
  });

  it('shows plugin details', () => {
    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <PluginStore />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(
      screen.getByText(
        'A plugin to add calendar functionality to your community.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('A plugin to create and manage polls.'),
    ).toBeInTheDocument();
  });

  it('shows plugin actions', () => {
    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <PluginStore />
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getAllByText('View')).toBeTruthy();
  });
});

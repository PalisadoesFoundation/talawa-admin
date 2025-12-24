import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import OrganizationTransactions from './OrganizationTransactions';
import i18nForTest from '../../utils/i18nForTest';

const sharedMocks = vi.hoisted(() => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
  BreadcrumbsComponent: vi.fn(({ items }) => (
    <nav data-testid="breadcrumbs">
      {items?.map((item: { translationKey: string }, index: number) => (
        <span key={index}>{item.translationKey}</span>
      ))}
    </nav>
  )),
}));

vi.mock('plugin', () => ({ PluginInjector: sharedMocks.PluginInjector }));
vi.mock('shared-components/BreadcrumbsComponent', () => ({
  BreadcrumbsComponent: sharedMocks.BreadcrumbsComponent,
}));

describe('OrganizationTransactions', () => {
  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderWithRouter = (initialEntry = '/orgtransactions/123') => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route
              path="/orgtransactions/:orgId"
              element={<OrganizationTransactions />}
            />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    );
  };

  it('renders the plugin injector', () => {
    renderWithRouter();

    expect(screen.getByTestId('plugin-injector')).toBeInTheDocument();
  });

  it('renders breadcrumbs navigation', async () => {
    renderWithRouter();

    // Verify breadcrumbs navigation is present
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('sets the document title from i18n', () => {
    renderWithRouter();

    expect(document.title).toBe('Transactions');
  });
});

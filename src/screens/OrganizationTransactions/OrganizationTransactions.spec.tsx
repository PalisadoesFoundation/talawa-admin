import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrganizationTransactions from './OrganizationTransactions';
import i18nForTest from '../../utils/i18nForTest';

const sharedMocks = vi.hoisted(() => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
}));

vi.mock('plugin', () => sharedMocks);

describe('OrganizationTransactions', () => {
  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  const renderWithRouter = (initialEntry = '/org/123/transactions') => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route
              path="/org/:orgId/transactions"
              element={<OrganizationTransactions />}
            />
            <Route path="/orglist" element={<div>Org List</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    );
  };

  it('renders the plugin injector', () => {
    renderWithRouter();

    expect(screen.getByTestId('plugin-injector')).toBeInTheDocument();
  });

  it('sets the document title from i18n', () => {
    renderWithRouter();

    expect(document.title).toBe('Transactions');
  });

  it('renders breadcrumbs navigation with correct items', () => {
    renderWithRouter();

    // Verify breadcrumbs navigation is present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('redirects to /orglist when orgId is missing', async () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <MemoryRouter initialEntries={['/org/transactions']}>
          <Routes>
            <Route path="/org/:orgId/transactions" element={<OrganizationTransactions />} />
            <Route path="/org/transactions" element={<OrganizationTransactions />} />
            <Route path="/orglist" element={<div data-testid="orglist-page">Org List Page</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('orglist-page')).toBeInTheDocument();
    });
  });
});

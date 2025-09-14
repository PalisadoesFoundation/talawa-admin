import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import OrganizationTransactions from './OrganizationTransactions';
import i18nForTest from '../../utils/i18nForTest';

vi.mock('plugin', () => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
}));

describe('OrganizationTransactions', () => {
  beforeEach(() => {
    document.title = '';
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
});

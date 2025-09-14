import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import Transactions from './Transactions';
import i18nForTest from '../../../utils/i18nForTest';

vi.mock('plugin', () => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
}));

vi.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  useLocalStorage: () => ({
    getItem: (_key: string) => 'test-user-id',
    setItem: (_key: string, _value: string) => undefined,
    removeItem: (_key: string) => undefined,
  }),
}));

describe('UserPortal Transactions', () => {
  beforeEach(() => {
    document.title = '';
  });

  const renderWithRouter = (initialEntry = '/user/transactions/123') => {
    return render(
      <I18nextProvider i18n={i18nForTest}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route
              path="/user/transactions/:orgId"
              element={<Transactions />}
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

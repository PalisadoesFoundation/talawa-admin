import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import Transactions from './Transactions';
import i18nForTest from '../../../utils/i18nForTest';

const sharedMocks = vi.hoisted(() => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
  localStorage: {
    getItem: () => 'test-user-id',
    setItem: () => undefined,
    removeItem: () => undefined,
  },
}));

vi.mock('plugin', () => ({
  PluginInjector: sharedMocks.PluginInjector,
}));

vi.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  useLocalStorage: () => sharedMocks.localStorage,
}));

describe('UserPortal Transactions', () => {
  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
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

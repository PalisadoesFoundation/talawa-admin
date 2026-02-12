import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import OrganizationTransactions from './OrganizationTransactions';
import i18nForTest from 'utils/i18nForTest';

const sharedMocks = vi.hoisted(() => ({
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector">Mock Plugin Injector</div>
  )),
}));

vi.mock('plugin', () => sharedMocks);

vi.mock('shared-components/BreadcrumbsComponent/SafeBreadcrumbs', () => ({
  default: ({
    items,
  }: {
    items: Array<{ translationKey?: string; label?: string; to?: string }>;
  }) => (
    <nav aria-label="breadcrumbs">
      <ol>
        {items.map((item) => (
          <li key={item.translationKey || item.label}>
            {item.to ? (
              <a href={item.to}>{item.translationKey}</a>
            ) : (
              <span aria-current="page">{item.translationKey}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ),
}));

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

  it('renders breadcrumbs correctly', () => {
    renderWithRouter();

    // Verify breadcrumb navigation is present
    expect(
      screen.getByRole('navigation', { name: /breadcrumbs/i }),
    ).toBeInTheDocument();

    // Verify breadcrumb items
    const breadcrumbLinks = screen.getAllByRole('link');
    expect(breadcrumbLinks).toHaveLength(1); // Only "organization" is a link

    // Verify current page breadcrumb (Transactions) has aria-current
    expect(screen.getByText(/transactions/i)).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

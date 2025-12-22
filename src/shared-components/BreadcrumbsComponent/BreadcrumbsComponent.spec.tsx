/**
 * BreadcrumbsComponent Tests
 *
 * Test suite for the reusable BreadcrumbsComponent.
 * Ensures correct rendering, navigation behavior, i18n support,
 * accessibility attributes, and graceful handling of edge cases.
 *
 * Mirrors the testing style and structure used in BaseModal.spec.tsx
 * for consistency across shared components.
 */

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import BreadcrumbsComponent from './BreadcrumbsComponent';
import type { IBreadcrumbItem } from 'types/shared-components/BreadcrumbsComponent/interface';

/**
 * Mock i18next
 *
 * Matches the mocking strategy used in BaseModal tests.
 * Provides predictable translated strings for assertions.
 */
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'breadcrumbs') return 'Breadcrumbs';
      if (key === 'common.events') return 'Events';
      return key;
    },
  }),
}));

describe('BreadcrumbsComponent', () => {
  /**
   * Default breadcrumb items used across most tests
   */
  const defaultItems: IBreadcrumbItem[] = [
    { label: 'Home', to: '/' },
    { translationKey: 'common.events', to: '/events' },
    { label: 'Current Page', isCurrent: true },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Helper render function
   * Wraps component in BrowserRouter since links use React Router
   */
  const renderComponent = (items?: IBreadcrumbItem[]) =>
    render(
      <BrowserRouter>
        <BreadcrumbsComponent items={items ?? defaultItems} />
      </BrowserRouter>,
    );

  /**
   * Rendering Tests
   */
  describe('Rendering Tests', () => {
    it('renders breadcrumb labels including translated and fallback labels', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });

    it('does not render anything when items array is empty', () => {
      renderComponent([]);

      // Component returns null → navigation landmark should not exist
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('renders a single breadcrumb item correctly', () => {
      renderComponent([{ label: 'Only Item', isCurrent: true }]);

      expect(screen.getByText('Only Item')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders non-current breadcrumb without link as plain text', () => {
      renderComponent([
        { label: 'Parent' },
        { label: 'Current', isCurrent: true },
      ]);

      const parent = screen.getByText('Parent');

      expect(parent).toBeInTheDocument();
      expect(parent.closest('a')).toBeNull();
    });
  });

  /**
   * Edge Case Tests
   */
  describe('Edge Case Tests', () => {
    it('handles breadcrumb item with no label and no translationKey gracefully', () => {
      renderComponent([{ to: '/' }, { label: 'Current', isCurrent: true }]);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      const listItems = nav.querySelectorAll('li');
      expect(listItems[0]).toHaveTextContent('');
    });
  });

  /**
   * Navigation Tests
   */
  describe('Navigation Tests', () => {
    it('renders links for non-current breadcrumb items', () => {
      renderComponent();

      const homeLink = screen.getByRole('link', { name: 'Home' });
      const eventsLink = screen.getByRole('link', { name: 'Events' });

      expect(homeLink).toHaveAttribute('href', '/');
      expect(eventsLink).toHaveAttribute('href', '/events');
    });

    it('does not render a link for the current breadcrumb item', () => {
      renderComponent();

      expect(
        screen.queryByRole('link', { name: 'Current Page' }),
      ).not.toBeInTheDocument();
    });
  });

  /**
   * Accessibility Tests
   */
  describe('Accessibility Tests', () => {
    it('applies aria-current="page" to the current breadcrumb item', () => {
      renderComponent();

      const current = screen.getByText('Current Page');
      expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('renders a nav landmark with translated aria-label', () => {
      renderComponent();

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumbs');
    });
  });

  /**
   * i18n Behavior Tests
   */
  describe('i18n Tests', () => {
    it('uses translationKey when provided', () => {
      renderComponent();

      expect(screen.getByText('Events')).toBeInTheDocument();
    });

    it('falls back to label when translationKey is not provided', () => {
      renderComponent();

      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  /**
   * Error / Warning Safety Tests
   */
  describe('Error / Warning Tests', () => {
    it('does not log console errors or warnings', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      renderComponent();

      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });
});

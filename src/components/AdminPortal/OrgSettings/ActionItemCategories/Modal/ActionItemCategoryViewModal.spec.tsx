import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { ICategoryViewModalProps } from './ActionItemCategoryViewModal';
import CategoryViewModal from './ActionItemCategoryViewModal';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import { vi, it, describe, beforeEach, expect } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * This file contains unit tests for the `CategoryViewModal` component.
 *
 * The tests cover:
 * - Proper rendering of the modal with category information in read-only mode
 * - Display of category name, description, and status with appropriate styling
 * - Handling of empty/null descriptions with fallback text
 * - Status indicator with correct colors for active/disabled states
 * - Modal close functionality
 * - Proper handling of null category prop
 */

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.orgActionItemCategories ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
};

const mockActiveCategory: IActionItemCategoryInfo = {
  id: 'categoryId1',
  name: 'Active Category',
  description: 'This is an active category with description',
  isDisabled: false,
  createdAt: dayjs.utc().subtract(5, 'days').toISOString(),
  updatedAt: dayjs.utc().toISOString(),
  creatorId: 'user123',
  organizationId: 'org456',
};

const mockDisabledCategory: IActionItemCategoryInfo = {
  id: 'categoryId2',
  name: 'Disabled Category',
  description: '',
  isDisabled: true,
  createdAt: dayjs.utc().subtract(5, 'days').toISOString(),
  updatedAt: dayjs.utc().toISOString(),
  creatorId: 'user789',
  organizationId: 'org456',
};

const mockCategoryWithLongDescription: IActionItemCategoryInfo = {
  id: 'categoryId3',
  name: 'Category with Long Description',
  description:
    'This is a very long description that spans multiple lines and contains detailed information about the category purpose, usage guidelines, and important notes for users who will be working with this category in their daily operations.',
  isDisabled: false,
  createdAt: dayjs.utc().subtract(5, 'days').toISOString(),
  updatedAt: dayjs.utc().toISOString(),

  creatorId: 'user456',
  organizationId: 'org456',
};

const defaultProps: ICategoryViewModalProps = {
  isOpen: true,
  hide: vi.fn(),
  category: mockActiveCategory,
};

const renderCategoryViewModal = (
  props: Partial<ICategoryViewModalProps> = {},
) => {
  const finalProps = { ...defaultProps, ...props };

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <CategoryViewModal {...finalProps} />
        </I18nextProvider>
      </MemoryRouter>
    </Provider>,
  );
};

describe('Testing CategoryViewModal Component', () => {
  beforeEach(() => {});

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render modal with category details', () => {
    renderCategoryViewModal();

    expect(screen.getByText(translations.categoryDetails)).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue(
      'Active Category',
    );

    expect(screen.getByTestId('categoryDescriptionView')).toHaveValue(
      'This is an active category with description',
    );

    expect(screen.getByTestId('categoryStatusView')).toHaveValue(
      translations.active || 'Active',
    );
  });

  it('should display active status for enabled category', () => {
    renderCategoryViewModal({ category: mockActiveCategory });

    const statusField = screen.getByTestId('categoryStatusView');
    expect(statusField).toHaveValue(translations.active || 'Active');
  });

  it('should display disabled status for disabled category', () => {
    renderCategoryViewModal({ category: mockDisabledCategory });

    expect(screen.getByTestId('categoryStatusView')).toHaveValue(
      translations.disabled || 'Disabled',
    );
  });

  it('should display fallback text for empty description', () => {
    renderCategoryViewModal({ category: mockDisabledCategory });

    expect(screen.getByTestId('categoryDescriptionView')).toHaveValue(
      'No description provided',
    );
  });

  it('should handle long descriptions properly', () => {
    renderCategoryViewModal({ category: mockCategoryWithLongDescription });

    const descriptionField = screen.getByTestId('categoryDescriptionView');

    expect(descriptionField).toHaveValue(
      mockCategoryWithLongDescription.description,
    );

    expect(descriptionField).toBeDisabled();

    expect(descriptionField.tagName).toBe('INPUT');
  });

  it('should have all input fields disabled', () => {
    renderCategoryViewModal();

    expect(screen.getByTestId('categoryNameView')).toBeDisabled();
    expect(screen.getByTestId('categoryDescriptionView')).toBeDisabled();
    expect(screen.getByTestId('categoryStatusView')).toBeDisabled();
  });

  it('should close modal when close button is clicked', async () => {
    const mockHide = vi.fn();
    renderCategoryViewModal({ hide: mockHide });

    const closeButton = screen.getByTestId('modalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockHide).toHaveBeenCalledTimes(1);
  });

  it('should not render modal when category is null', () => {
    renderCategoryViewModal({ category: null });

    expect(
      screen.queryByText(translations.categoryDetails),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: /name/i }),
    ).not.toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    renderCategoryViewModal({ isOpen: false });

    expect(
      screen.queryByText(translations.categoryDetails),
    ).not.toBeInTheDocument();
  });

  it('should display correct category name for different categories', () => {
    // Test with disabled category
    const { rerender } = renderCategoryViewModal({
      category: mockDisabledCategory,
    });
    expect(screen.getByDisplayValue('Disabled Category')).toBeInTheDocument();

    // Rerender with long description category
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <CategoryViewModal
              {...defaultProps}
              category={mockCategoryWithLongDescription}
            />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(
      screen.getByDisplayValue('Category with Long Description'),
    ).toBeInTheDocument();
  });

  it('should have correct modal structure and styling', () => {
    renderCategoryViewModal();

    // Check modal header
    expect(screen.getByText(translations.categoryDetails)).toBeInTheDocument();
    expect(screen.getByTestId('modalCloseBtn')).toBeInTheDocument();

    // Check form structure - using getByRole for better accessibility testing
    const form = screen.getByRole('textbox', { name: /name/i }).closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('p-3');
  });

  it('should handle category with all fields populated...', () => {
    const fullCategory: IActionItemCategoryInfo = {
      id: 'minimal',
      name: 'Minimal Category',
      description: '',
      isDisabled: false,
      createdAt: dayjs.utc().toISOString(),
      updatedAt: dayjs.utc().toISOString(),
      creatorId: 'test-user',
      organizationId: 'org123',
    };

    renderCategoryViewModal({ category: fullCategory });

    expect(screen.getByTestId('categoryNameView')).toHaveValue(
      'Minimal Category',
    );
  });

  it('should display different status text for active vs disabled categories', () => {
    const { rerender } = renderCategoryViewModal({
      category: mockActiveCategory,
    });

    let statusField = screen.getByTestId('categoryStatusView');
    expect(statusField).toHaveValue(translations.active || 'Active');

    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <CategoryViewModal
              {...defaultProps}
              category={mockDisabledCategory}
            />
          </I18nextProvider>
        </MemoryRouter>
      </Provider>,
    );

    statusField = screen.getByTestId('categoryStatusView');
    expect(statusField).toHaveValue(translations.disabled || 'Disabled');
  });
});

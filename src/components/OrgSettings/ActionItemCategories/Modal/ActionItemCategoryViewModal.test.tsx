import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { ICategoryViewModalProps } from './ActionItemCategoryViewModal';
import CategoryViewModal from './ActionItemCategoryViewModal';
import type { IActionItemCategoryInfo } from 'types/Actions/interface';
import { vi, it, describe, beforeEach, expect } from 'vitest';

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
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  creatorId: 'user123',
  organizationId: 'org456',
};

const mockDisabledCategory: IActionItemCategoryInfo = {
  id: 'categoryId2',
  name: 'Disabled Category',
  description: '',
  isDisabled: true,
  createdAt: '2024-01-10T08:00:00Z',
  updatedAt: '2024-01-25T12:00:00Z',
  creatorId: 'user789',
  organizationId: 'org456',
};

const mockCategoryWithLongDescription: IActionItemCategoryInfo = {
  id: 'categoryId3',
  name: 'Category with Long Description',
  description:
    'This is a very long description that spans multiple lines and contains detailed information about the category purpose, usage guidelines, and important notes for users who will be working with this category in their daily operations.',
  isDisabled: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-30T23:59:59Z',
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
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <CategoryViewModal {...finalProps} />
        </I18nextProvider>
      </BrowserRouter>
    </Provider>,
  );
};

describe('Testing CategoryViewModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with category details', () => {
    renderCategoryViewModal();

    expect(screen.getByText(translations.categoryDetails)).toBeInTheDocument();
    expect(screen.getByTestId('categoryNameView')).toHaveValue(
      'Active Category',
    );
    expect(screen.getByTestId('categoryDescriptionView')).toHaveValue(
      'This is an active category with description',
    );
    expect(screen.getByTestId('categoryStatusView')).toHaveValue(
      translations.active || 'Active',
    );
  });

  it('should display active status with green color for enabled category', () => {
    renderCategoryViewModal({ category: mockActiveCategory });

    const statusField = screen.getByTestId('categoryStatusView');
    expect(statusField).toHaveValue(translations.active || 'Active');

    // Check if the input has the correct styling for active status
    const input = statusField.querySelector('input');
    expect(input).toHaveStyle({ 'webkit-text-fill-color': '#4caf50' });
  });

  it('should display disabled status with red color for disabled category', () => {
    renderCategoryViewModal({ category: mockDisabledCategory });

    const statusField = screen.getByTestId('categoryStatusView');
    expect(statusField).toHaveValue(translations.disabled || 'Disabled');

    // Check if the input has the correct styling for disabled status
    const input = statusField.querySelector('input');
    expect(input).toHaveStyle({ 'webkit-text-fill-color': '#ff5252' });
  });

  it('should display fallback text for empty description', () => {
    renderCategoryViewModal({ category: mockDisabledCategory });

    const descriptionField = screen.getByTestId('categoryDescriptionView');
    expect(descriptionField).toHaveValue('No description provided');
  });

  it('should handle long descriptions properly', () => {
    renderCategoryViewModal({ category: mockCategoryWithLongDescription });

    const descriptionField = screen.getByTestId('categoryDescriptionView');
    expect(descriptionField).toHaveValue(
      mockCategoryWithLongDescription.description,
    );

    // Verify it's a multiline field
    expect(descriptionField.querySelector('textarea')).toBeInTheDocument();
  });

  it('should have all input fields disabled', () => {
    renderCategoryViewModal();

    const nameField = screen.getByTestId('categoryNameView');
    const descriptionField = screen.getByTestId('categoryDescriptionView');
    const statusField = screen.getByTestId('categoryStatusView');

    expect(nameField.querySelector('input')).toBeDisabled();
    expect(descriptionField.querySelector('textarea')).toBeDisabled();
    expect(statusField.querySelector('input')).toBeDisabled();
  });

  it('should close modal when close button is clicked', async () => {
    const mockHide = vi.fn();
    renderCategoryViewModal({ hide: mockHide });

    const closeButton = screen.getByTestId('categoryViewModalCloseBtn');
    await userEvent.click(closeButton);

    expect(mockHide).toHaveBeenCalledTimes(1);
  });

  it('should not render modal when category is null', () => {
    renderCategoryViewModal({ category: null });

    expect(
      screen.queryByText(translations.categoryDetails),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('categoryNameView')).not.toBeInTheDocument();
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
    expect(screen.getByTestId('categoryNameView')).toHaveValue(
      'Disabled Category',
    );

    // Test with long description category
    rerender(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CategoryViewModal
              isOpen={true}
              hide={vi.fn()}
              category={mockCategoryWithLongDescription}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
    expect(screen.getByTestId('categoryNameView')).toHaveValue(
      'Category with Long Description',
    );
  });

  it('should have correct modal structure and styling', () => {
    renderCategoryViewModal();

    // Check modal header
    expect(screen.getByText(translations.categoryDetails)).toBeInTheDocument();
    expect(screen.getByTestId('categoryViewModalCloseBtn')).toBeInTheDocument();

    // Check form structure
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('p-3');
  });

  it('should handle category with minimal required fields', () => {
    const minimalCategory: IActionItemCategoryInfo = {
      id: 'minimal',
      name: 'Minimal Category',
      description: '',
      isDisabled: false,
      createdAt: '2024-01-01T00:00:00Z',
      organizationId: 'org123',
    };

    renderCategoryViewModal({ category: minimalCategory });

    expect(screen.getByTestId('categoryNameView')).toHaveValue(
      'Minimal Category',
    );
    expect(screen.getByTestId('categoryDescriptionView')).toHaveValue(
      'No description provided',
    );
    expect(screen.getByTestId('categoryStatusView')).toHaveValue(
      translations.active || 'Active',
    );
  });

  it('should maintain consistent styling across different category states', () => {
    // Test active category styling
    renderCategoryViewModal({ category: mockActiveCategory });
    let statusField = screen.getByTestId('categoryStatusView');
    let circleIcon = statusField.querySelector('svg');
    expect(circleIcon).toHaveStyle({ color: '#4caf50' });

    // Re-render with disabled category
    renderCategoryViewModal({ category: mockDisabledCategory });
    statusField = screen.getByTestId('categoryStatusView');
    circleIcon = statusField.querySelector('svg');
    expect(circleIcon).toHaveStyle({ color: '#ff5252' });
  });
});

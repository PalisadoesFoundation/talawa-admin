import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_ERROR } from '../OrgActionItemCategoryMocks';
import type { IActionItemCategoryModal } from './ActionItemCategoryModal';
import CategoryModal from './ActionItemCategoryModal';
import { toast } from 'react-toastify';
import { it, vi, describe, beforeEach } from 'vitest';

/**
 * This file contains unit tests for the `CategoryModal` component.
 *
 * The tests cover:
 * - Proper rendering of the component in various scenarios, including `create` and `edit` modes, mock data, and error states.
 * - Handling user interactions with form fields, such as updating the category name and toggling the `isDisabled` switch.
 * - Ensuring form submissions trigger appropriate callbacks (e.g., `refetchCategories` and `hide`) and display correct toast notifications.
 * - Simulating GraphQL query and mutation operations with mocked data to validate behavior in success and error cases.
 * - Testing edge cases, such as submitting without changes, invalid inputs, and handling API errors gracefully.
 * - Verifying proper integration of internationalization, Redux state, routing, and toast notifications for success and error feedback.
 * - 100% code coverage including all conditional branches
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link3 = new StaticMockLink(MOCKS_ERROR);

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.orgActionItemCategories ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const categoryProps: IActionItemCategoryModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchCategories: vi.fn(),
    orgId: 'orgId',
    mode: 'create',
    category: {
      id: 'categoryId',
      name: 'Category 1',
      description: 'This is a test category',
      isDisabled: false,
      createdAt: '2044-01-01',
      updatedAt: '2044-01-01',
      creatorId: 'userId',
      organizationId: 'orgId',
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    refetchCategories: vi.fn(),
    orgId: 'orgId',
    mode: 'edit',
    category: {
      id: 'categoryId',
      name: 'Category 1',
      description: 'This is a test category',
      isDisabled: false,
      createdAt: '2044-01-01',
      updatedAt: '2044-01-01',
      creatorId: 'userId',
      organizationId: 'orgId',
    },
  },
];

const renderCategoryModal = (
  link: ApolloLink,
  props: IActionItemCategoryModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <CategoryModal {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

const fillFormAndSubmit = async (
  name: string,
  description: string,
  isDisabled: boolean,
): Promise<void> => {
  const nameInput = screen.getByLabelText('Name *');
  const descriptionInput = screen.getByLabelText('Description');
  const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
  const submitBtn = screen.getByTestId('formSubmitButton');

  fireEvent.change(nameInput, { target: { value: name } });
  fireEvent.change(descriptionInput, { target: { value: description } });

  // Only click switch if we need to change its state
  const currentlyChecked = isDisabledSwitch.getAttribute('checked') !== null;
  if (currentlyChecked !== isDisabled) {
    await userEvent.click(isDisabledSwitch);
  }

  await userEvent.click(submitBtn);
};

describe('Testing Action Item Category Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering and Initialization', () => {
    it('should populate form fields with correct values in edit mode', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      await waitFor(() =>
        expect(
          screen.getByText(translations.categoryDetails),
        ).toBeInTheDocument(),
      );

      expect(screen.getByLabelText('Name *')).toHaveValue('Category 1');
      expect(screen.getByLabelText('Description')).toHaveValue(
        'This is a test category',
      );
      expect(screen.getByTestId('isDisabledSwitch')).not.toBeChecked();
    });

    it('should initialize form with null category', () => {
      const propsWithNullCategory = {
        ...categoryProps[0],
        category: null,
      };
      renderCategoryModal(link1, propsWithNullCategory);

      expect(screen.getByLabelText('Name *')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByTestId('isDisabledSwitch')).not.toBeChecked();
    });

    it('should initialize form with disabled category', () => {
      // Validate test data setup - category should be non-null
      const category = categoryProps[1].category;
      if (!category) {
        throw new Error('Test setup error: category should be defined');
      }

      const propsWithDisabledCategory = {
        ...categoryProps[1],
        category: {
          ...category,
          isDisabled: true,
        },
      };
      renderCategoryModal(link1, propsWithDisabledCategory);

      expect(screen.getByTestId('isDisabledSwitch')).toBeChecked();
    });

    it('should initialize form with empty description category', () => {
      // Validate test data setup - category should be non-null
      const category = categoryProps[1].category;
      if (!category) {
        throw new Error('Test setup error: category should be defined');
      }

      const propsWithEmptyDescription = {
        ...categoryProps[1],
        category: {
          ...category,
          description: '',
        },
      };
      renderCategoryModal(link1, propsWithEmptyDescription);

      expect(screen.getByLabelText('Description')).toHaveValue('');
    });
  });

  describe('Form Input Changes', () => {
    it('should update name when input value changes', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      expect(nameInput).toHaveValue('Category 1');
      fireEvent.change(nameInput, { target: { value: 'Category 2' } });
      expect(nameInput).toHaveValue('Category 2');
    });

    it('should update description when input value changes', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      expect(descriptionInput).toHaveValue('This is a test category');
      fireEvent.change(descriptionInput, {
        target: { value: 'Updated description' },
      });
      expect(descriptionInput).toHaveValue('Updated description');
    });

    it('should update isDisabled when switch is toggled', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
      expect(isDisabledSwitch).not.toBeChecked();
      await userEvent.click(isDisabledSwitch);
      expect(isDisabledSwitch).toBeChecked();
    });
  });

  describe('Create Mode Tests', () => {
    it('should create category with all fields', async () => {
      renderCategoryModal(link1, categoryProps[0]);
      await fillFormAndSubmit('New Category', 'New description', true);

      await waitFor(() => {
        expect(categoryProps[0].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[0].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulCreation,
        );
      });
    });

    it('should create category with empty description', async () => {
      renderCategoryModal(link1, categoryProps[0]);
      await fillFormAndSubmit('New Category', '', false);

      await waitFor(() => {
        expect(categoryProps[0].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[0].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulCreation,
        );
      });
    });

    it('should create category with only name filled', async () => {
      renderCategoryModal(link1, categoryProps[0]);
      const nameInput = screen.getByLabelText('Name *');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(nameInput, { target: { value: 'Minimal Category' } });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[0].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[0].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulCreation,
        );
      });
    });

    it('should handle error when creating category', async () => {
      renderCategoryModal(link3, categoryProps[0]);
      await fillFormAndSubmit('New Category', 'New description', true);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });
  });

  describe('Edit Mode Tests - Single Field Changes', () => {
    it('should edit category changing only name', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(nameInput, { target: { value: 'Category 2' } });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should edit category changing only description', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(descriptionInput, {
        target: { value: 'New description only' },
      });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should edit category changing only isDisabled', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
      const submitBtn = screen.getByTestId('formSubmitButton');

      await userEvent.click(isDisabledSwitch);
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should handle empty description in edit mode', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(descriptionInput, { target: { value: '' } });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });
  });

  describe('Edit Mode Tests - Multiple Field Changes', () => {
    it('should edit category changing name and description', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'Updated description' },
      });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should edit category changing name and isDisabled', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      await userEvent.click(isDisabledSwitch);
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should edit category changing description and isDisabled', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(descriptionInput, {
        target: { value: 'Updated description' },
      });
      await userEvent.click(isDisabledSwitch);
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should edit category with all fields changed', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      await fillFormAndSubmit(
        'Completely New Name',
        'Completely new description',
        true,
      );

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });
  });

  describe('Edit Mode - Error Handling', () => {
    it('should show error when trying to edit without changing any field', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(translations.sameNameConflict);
      });
    });

    it('should handle error when updating category', async () => {
      renderCategoryModal(link3, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      const submitBtn = screen.getByTestId('formSubmitButton');

      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });

    it('should handle error when updating with multiple field changes', async () => {
      renderCategoryModal(link3, categoryProps[1]);
      await fillFormAndSubmit('Updated Name', 'Updated description', true);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });
  });

  describe('Delete Functionality', () => {
    it('should delete category successfully', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const deleteBtn = screen.getByTestId('deleteCategoryButton');
      await userEvent.click(deleteBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.categoryDeleted,
        );
      });
    });

    it('should handle error when deleting category', async () => {
      renderCategoryModal(link3, categoryProps[1]);
      const deleteBtn = screen.getByTestId('deleteCategoryButton');
      await userEvent.click(deleteBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });

    it('should return early when category is null', async () => {
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      const propsWithNullCategory = {
        ...categoryProps[1],
        category: null,
        refetchCategories: mockRefetch,
        hide: mockHide,
      };
      renderCategoryModal(link1, propsWithNullCategory);

      const deleteBtn = screen.getByTestId('deleteCategoryButton');
      await userEvent.click(deleteBtn);

      // Should not call any functions since category is null
      await waitFor(() => {
        expect(mockRefetch).not.toHaveBeenCalled();
        expect(mockHide).not.toHaveBeenCalled();
      });
    });

    it('should return early when category id is empty', async () => {
      const mockRefetch = vi.fn();
      const mockHide = vi.fn();
      const propsWithEmptyId = {
        ...categoryProps[1],
        category: {
          id: '',
          name: 'Category 1',
          description: 'This is a test category',
          isDisabled: false,
          createdAt: '2044-01-01',
          updatedAt: '2044-01-01',
          creatorId: 'userId',
          organizationId: 'orgId',
        },
        refetchCategories: mockRefetch,
        hide: mockHide,
      };
      renderCategoryModal(link1, propsWithEmptyId);
      const deleteBtn = screen.getByTestId('deleteCategoryButton');
      await userEvent.click(deleteBtn);

      // Should not call any functions since id is empty
      await waitFor(() => {
        expect(mockRefetch).not.toHaveBeenCalled();
        expect(mockHide).not.toHaveBeenCalled();
      });
    });

    it('should not show delete button in create mode', () => {
      renderCategoryModal(link1, categoryProps[0]);
      expect(
        screen.queryByTestId('deleteCategoryButton'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Modal Functionality', () => {
    it('should close modal when close button is clicked', async () => {
      const mockHide = vi.fn();
      const propsWithMockHide = {
        ...categoryProps[0],
        hide: mockHide,
      };
      renderCategoryModal(link1, propsWithMockHide);

      const closeBtn = screen.getByTestId('actionItemCategoryModalCloseBtn');
      await userEvent.click(closeBtn);

      expect(mockHide).toHaveBeenCalled();
    });

    it('should display correct modal title', () => {
      renderCategoryModal(link1, categoryProps[0]);
      expect(
        screen.getByText(translations.categoryDetails),
      ).toBeInTheDocument();
    });
  });

  describe('Button Text and Labels', () => {
    it('should display create button text in create mode', () => {
      renderCategoryModal(link1, categoryProps[0]);
      expect(screen.getByText(translations.create)).toBeInTheDocument();
    });

    it('should display update button text in edit mode', () => {
      renderCategoryModal(link1, categoryProps[1]);
      expect(
        screen.getByText(translations.updateActionItemCategory),
      ).toBeInTheDocument();
    });

    it('should display delete button text in edit mode', () => {
      renderCategoryModal(link1, categoryProps[1]);
      expect(screen.getByText(translations.delete)).toBeInTheDocument();
    });
  });

  describe('useEffect Hook Behavior', () => {
    it('should update form state when category prop changes', async () => {
      const { rerender } = renderCategoryModal(link1, categoryProps[1]);

      expect(screen.getByLabelText('Name *')).toHaveValue('Category 1');

      const updatedProps = {
        ...categoryProps[1],
        category: {
          id: 'categoryId',
          name: 'Updated Category',
          description: 'Updated description',
          isDisabled: true,
          createdAt: '2044-01-01',
          updatedAt: '2044-01-01',
          creatorId: 'userId',
          organizationId: 'orgId',
        },
      };

      rerender(
        <MockedProvider link={link1}>
          <Provider store={store}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <CategoryModal {...updatedProps} />
              </I18nextProvider>
            </BrowserRouter>
          </Provider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Name *')).toHaveValue('Updated Category');
        expect(screen.getByLabelText('Description')).toHaveValue(
          'Updated description',
        );
        expect(screen.getByTestId('isDisabledSwitch')).toBeChecked();
      });
    });
  });
});

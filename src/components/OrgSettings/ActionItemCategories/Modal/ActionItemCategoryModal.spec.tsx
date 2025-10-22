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
import { it, vi } from 'vitest';
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
    <MockedProvider addTypename={false} link={link}>
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
  isDisabled: boolean,
): Promise<void> => {
  const nameInput = screen.getByLabelText('Name *');
  const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
  const submitBtn = screen.getByTestId('formSubmitButton');

  fireEvent.change(nameInput, { target: { value: name } });
  if (isDisabled) {
    await userEvent.click(isDisabledSwitch);
  }
  await userEvent.click(submitBtn);
};

describe('Testing Action Item Category Modal', () => {
  it('should populate form fields with correct values in edit mode', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    await waitFor(() =>
      expect(
        screen.getByText(translations.categoryDetails),
      ).toBeInTheDocument(),
    );

    expect(screen.getByLabelText('Name *')).toHaveValue('Category 1');
    expect(screen.getByTestId('isDisabledSwitch')).not.toBeChecked();
  });

  it('should update name when input value changes', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    const nameInput = screen.getByLabelText('Name *');
    expect(nameInput).toHaveValue('Category 1');
    fireEvent.change(nameInput, { target: { value: 'Category 2' } });
    expect(nameInput).toHaveValue('Category 2');
  });

  it('should update isDisabled when switch is toggled', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');
    expect(isDisabledSwitch).not.toBeChecked();
    await userEvent.click(isDisabledSwitch);
    expect(isDisabledSwitch).toBeChecked();
  });

  it('should edit category', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    await fillFormAndSubmit('Category 1', true);

    await waitFor(() => {
      expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
      expect(categoryProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfulUpdation,
      );
    });
  });

  it('Edit only Name', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    await fillFormAndSubmit('Category 2', false);

    await waitFor(() => {
      expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
      expect(categoryProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfulUpdation,
      );
    });
  });

  it('Edit only isDisabled', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    await fillFormAndSubmit('Category 1', true);

    await waitFor(() => {
      expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
      expect(categoryProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfulUpdation,
      );
    });
  });

  it('Error in updating category', async () => {
    renderCategoryModal(link3, categoryProps[1]);
    await fillFormAndSubmit('Category 2', true);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });

  it('should create category', async () => {
    renderCategoryModal(link1, categoryProps[0]);
    await fillFormAndSubmit('Category 2', true);

    await waitFor(() => {
      expect(categoryProps[0].refetchCategories).toHaveBeenCalled();
      expect(categoryProps[0].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfulCreation,
      );
    });
  });

  it('Error in creating category', async () => {
    renderCategoryModal(link3, categoryProps[0]);
    await fillFormAndSubmit('Category 2', true);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
    });
  });

  it('Try to edit without changing any field', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    const submitBtn = screen.getByTestId('formSubmitButton');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.sameNameConflict);
    });
  });

  it('should delete category successfully', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    const deleteBtn = screen.getByTestId('deleteCategoryButton');
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
      expect(categoryProps[1].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(translations.categoryDeleted);
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

    // Delete button should be visible in edit mode even with null category
    const deleteBtn = screen.getByTestId('deleteCategoryButton');
    await userEvent.click(deleteBtn);

    // Should not call any functions since category is null
    expect(mockRefetch).not.toHaveBeenCalled();
    expect(mockHide).not.toHaveBeenCalled();
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
    expect(mockRefetch).not.toHaveBeenCalled();
    expect(mockHide).not.toHaveBeenCalled();
  });

  it('should not show delete button in create mode', () => {
    renderCategoryModal(link1, categoryProps[0]);
    expect(
      screen.queryByTestId('deleteCategoryButton'),
    ).not.toBeInTheDocument();
  });

  describe('Description field handling', () => {
    it('should update description when input value changes', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      expect(descriptionInput).toHaveValue('This is a test category');
      fireEvent.change(descriptionInput, {
        target: { value: 'Updated description' },
      });
      expect(descriptionInput).toHaveValue('Updated description');
    });

    it('should handle empty description in create mode', async () => {
      const propsWithEmptyDescription = {
        ...categoryProps[0],
        category: {
          ...categoryProps[0].category!,
          description: '',
        },
      };
      renderCategoryModal(link1, propsWithEmptyDescription);
      const descriptionInput = screen.getByLabelText('Description');
      expect(descriptionInput).toHaveValue('');
      fireEvent.change(descriptionInput, {
        target: { value: 'New description' },
      });
      expect(descriptionInput).toHaveValue('New description');
    });

    it('should handle description changes in edit mode', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      fireEvent.change(descriptionInput, {
        target: { value: 'Updated description' },
      });
      const submitBtn = screen.getByTestId('formSubmitButton');
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
      fireEvent.change(descriptionInput, { target: { value: '' } });
      const submitBtn = screen.getByTestId('formSubmitButton');
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

  describe('Form state initialization and useEffect', () => {
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

    it('should initialize form with undefined category', () => {
      const propsWithUndefinedCategory = {
        ...categoryProps[0],
        category: null,
      };
      renderCategoryModal(link1, propsWithUndefinedCategory);

      expect(screen.getByLabelText('Name *')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByTestId('isDisabledSwitch')).not.toBeChecked();
    });

    it('should initialize form with disabled category', () => {
      const propsWithDisabledCategory = {
        ...categoryProps[1],
        category: {
          ...categoryProps[1].category!,
          isDisabled: true,
        },
      };
      renderCategoryModal(link1, propsWithDisabledCategory);

      expect(screen.getByTestId('isDisabledSwitch')).toBeChecked();
    });

    it('should initialize form with empty description category', () => {
      const propsWithEmptyDescription = {
        ...categoryProps[1],
        category: {
          ...categoryProps[1].category!,
          description: '',
        },
      };
      renderCategoryModal(link1, propsWithEmptyDescription);

      expect(screen.getByLabelText('Description')).toHaveValue('');
    });
  });

  describe('Modal functionality', () => {
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

  describe('Form validation and edge cases', () => {
    it('should handle form submission with only name change', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      fireEvent.change(nameInput, { target: { value: 'New Category Name' } });
      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should handle form submission with only description change', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const descriptionInput = screen.getByLabelText('Description');
      fireEvent.change(descriptionInput, {
        target: { value: 'New description only' },
      });
      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should handle form submission with all fields changed', async () => {
      renderCategoryModal(link1, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description');
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');

      fireEvent.change(nameInput, { target: { value: 'Completely New Name' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'Completely new description' },
      });
      await userEvent.click(isDisabledSwitch);

      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[1].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[1].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulUpdation,
        );
      });
    });

    it('should handle create mode with all fields filled', async () => {
      renderCategoryModal(link1, categoryProps[0]);
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description');
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');

      fireEvent.change(nameInput, { target: { value: 'New Category' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'New description' },
      });
      await userEvent.click(isDisabledSwitch);

      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(categoryProps[0].refetchCategories).toHaveBeenCalled();
        expect(categoryProps[0].hide).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith(
          translations.successfulCreation,
        );
      });
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle create error with all fields', async () => {
      renderCategoryModal(link3, categoryProps[0]);
      const nameInput = screen.getByLabelText('Name *');
      const descriptionInput = screen.getByLabelText('Description');
      const isDisabledSwitch = screen.getByTestId('isDisabledSwitch');

      fireEvent.change(nameInput, { target: { value: 'New Category' } });
      fireEvent.change(descriptionInput, {
        target: { value: 'New description' },
      });
      await userEvent.click(isDisabledSwitch);

      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });

    it('should handle update error with partial changes', async () => {
      renderCategoryModal(link3, categoryProps[1]);
      const nameInput = screen.getByLabelText('Name *');
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      const submitBtn = screen.getByTestId('formSubmitButton');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Mock Graphql Error');
      });
    });
  });

  describe('Button text and labels', () => {
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
});

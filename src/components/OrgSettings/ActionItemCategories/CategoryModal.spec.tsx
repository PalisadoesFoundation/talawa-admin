import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, MOCKS_ERROR } from './OrgActionItemCategoryMocks';
import type { InterfaceActionItemCategoryModal } from './CategoryModal';
import CategoryModal from './CategoryModal';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
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

const categoryProps: InterfaceActionItemCategoryModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchCategories: vi.fn(),
    orgId: 'orgId',
    mode: 'create',
    category: {
      _id: 'categoryId',
      name: 'Category 1',
      isDisabled: false,
      createdAt: '2044-01-01',
      creator: { _id: 'userId', firstName: 'John', lastName: 'Doe' },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    refetchCategories: vi.fn(),
    orgId: 'orgId',
    mode: 'edit',
    category: {
      _id: 'categoryId',
      name: 'Category 1',
      isDisabled: false,
      createdAt: '2044-01-01',
      creator: { _id: 'userId', firstName: 'John', lastName: 'Doe' },
    },
  },
];

const renderCategoryModal = (
  link: ApolloLink,
  props: InterfaceActionItemCategoryModal,
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
    userEvent.click(isDisabledSwitch);
  }
  userEvent.click(submitBtn);
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
    userEvent.click(isDisabledSwitch);
    expect(isDisabledSwitch).toBeChecked();
  });

  it('should edit category', async () => {
    renderCategoryModal(link1, categoryProps[1]);
    await fillFormAndSubmit('Category 2', true);

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
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(translations.sameNameConflict);
    });
  });
});

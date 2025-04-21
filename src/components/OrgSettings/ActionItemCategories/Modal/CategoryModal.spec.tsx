import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InterfaceActionItemCategory } from './CategoryModal';
import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CategoryModal from './CategoryModal';

import { toast } from 'react-toastify';

vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string, options?: { keyPrefix?: string }) => {
    const prefix = options?.keyPrefix ? `${options.keyPrefix}.` : '';
    return {
      t: (key: string) => prefix + key,
      i18n: { language: 'en' },
    };
  },
}));

// Mock react-toastify so we can track calls to toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CategoryModal Component', () => {
  // Reset mock calls before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to render the modal
  function renderCategoryModal(
    props?: Partial<React.ComponentProps<typeof CategoryModal>>,
    apolloMocks?: MockedResponse[],
  ) {
    const defaultCategory: InterfaceActionItemCategory = {
      id: 'cat-1',
      name: 'Some Category',
      organizationId: 'org-1',
      creatorId: 'user-1',
      isDisabled: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    };

    return render(
      <MockedProvider mocks={apolloMocks || []} addTypename={false}>
        <CategoryModal
          isOpen={true}
          hide={vi.fn()}
          refetchCategories={vi.fn()}
          orgId="org-1"
          category={defaultCategory}
          mode="create"
          {...props}
        />
      </MockedProvider>,
    );
  }

  it('does not render modal if isOpen = false', () => {
    // Even with no GraphQL calls, if isOpen=false, modal content is not rendered
    renderCategoryModal({ isOpen: false });
    expect(
      screen.queryByText('orgActionItemCategories.categoryDetails'),
    ).toBeNull();
  });

  it('toggles isDisabled field when switch is clicked', () => {
    renderCategoryModal();
    const switchEl = screen.getByTestId('isDisabledSwitch') as HTMLInputElement;
    expect(switchEl).toBeInTheDocument();
    // Initially false
    expect(switchEl).not.toBeChecked();

    fireEvent.click(switchEl);
    // Now it's true
    expect(switchEl).toBeChecked();
    fireEvent.click(switchEl);
    // Now it's false again
    expect(switchEl).not.toBeChecked();
  });

  it('calls createActionItemCategory mutation on submit when in create mode', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
          variables: {
            input: {
              name: 'New Category',
              isDisabled: false,
              organizationId: 'org-1',
            },
          },
        },
        result: {
          data: {
            createActionItemCategory: {
              id: 'new-cat-id',
              name: 'New Category',
              organizationId: 'org-1',
              creatorId: 'user-1',
              isDisabled: false,
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-01T00:00:00.000Z',
            },
          },
        },
      },
    ];

    // Mocks for user function calls
    const hideFn = vi.fn();
    const refetchFn = vi.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryModal
          isOpen
          hide={hideFn}
          refetchCategories={refetchFn}
          orgId="org-1"
          category={null}
          mode="create"
        />
      </MockedProvider>,
    );

    const nameField = screen.getByTestId(
      'categoryNameInput',
    ) as HTMLInputElement;
    expect(nameField).toBeInTheDocument();
    // Type a new name
    fireEvent.change(nameField, { target: { value: 'New Category' } });

    // Submit the form
    const submitBtn = screen.getByTestId('formSubmitButton');
    fireEvent.click(submitBtn);

    // Wait for success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'orgActionItemCategories.successfulCreation',
      );
      expect(refetchFn).toHaveBeenCalled();
      expect(hideFn).toHaveBeenCalled();
    });
  });

  it('shows error toast if createActionItemCategory mutation fails', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
          variables: {
            input: {
              name: 'Fail Category',
              isDisabled: false,
              organizationId: 'org-1',
            },
          },
        },
        error: new Error('Create Error'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryModal
          isOpen
          hide={vi.fn()}
          refetchCategories={vi.fn()}
          orgId="org-1"
          category={null}
          mode="create"
        />
      </MockedProvider>,
    );
    const nameField = screen.getByTestId(
      'categoryNameInput',
    ) as HTMLInputElement;
    fireEvent.change(nameField, { target: { value: 'Fail Category' } });
    fireEvent.click(screen.getByTestId('formSubmitButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Create Error');
    });
  });

  it('calls updateActionItemCategory mutation on submit when in edit mode', async () => {
    const categoryToEdit = {
      id: 'cat-123',
      name: 'My Old Name',
      organizationId: 'org-1',
      creatorId: 'user-123',
      isDisabled: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    } as InterfaceActionItemCategory;

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
          variables: {
            input: {
              categoryId: 'cat-123',
              name: 'My New Name', // changed from old name
            },
          },
        },
        result: {
          data: {
            updateActionItemCategory: {
              id: 'cat-123',
              name: 'My New Name',
              organizationId: 'org-1',
              creatorId: 'user-123',
              isDisabled: false,
              createdAt: '2025-01-01T00:00:00.000Z',
              updatedAt: '2025-01-02T00:00:00.000Z',
            },
          },
        },
      },
    ];

    const hideFn = vi.fn();
    const refetchFn = vi.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryModal
          isOpen
          hide={hideFn}
          refetchCategories={refetchFn}
          orgId="org-1"
          category={categoryToEdit}
          mode="edit"
        />
      </MockedProvider>,
    );

    // Confirm we're in edit mode
    expect(screen.getByTestId('formSubmitButton').textContent).toMatch(
      /updateActionItemCategory/i,
    );

    const nameField = screen.getByTestId(
      'categoryNameInput',
    ) as HTMLInputElement;

    fireEvent.change(nameField, { target: { value: 'My New Name' } });
    // Submit
    fireEvent.click(screen.getByTestId('formSubmitButton'));

    // Wait for success
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'orgActionItemCategories.successfulUpdation',
      );
      expect(refetchFn).toHaveBeenCalled();
      expect(hideFn).toHaveBeenCalled();
    });
  });

  it('shows error toast if updateActionItemCategory mutation fails', async () => {
    const categoryToEdit: InterfaceActionItemCategory = {
      id: 'cat-123',
      name: 'Old Name',
      organizationId: 'org-1',
      creatorId: 'user-123',
      isDisabled: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
          variables: {
            input: {
              categoryId: 'cat-123',
              name: 'New Name',
            },
          },
        },
        error: new Error('Update Error'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CategoryModal
          isOpen
          hide={vi.fn()}
          refetchCategories={vi.fn()}
          orgId="org-1"
          category={categoryToEdit}
          mode="edit"
        />
      </MockedProvider>,
    );
    const nameField = screen.getByTestId(
      'categoryNameInput',
    ) as HTMLInputElement;

    fireEvent.change(nameField, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByTestId('formSubmitButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Update Error');
    });
  });

  it('shows "sameNameConflict" toast if no fields are changed in edit mode', async () => {
    const categoryToEdit: InterfaceActionItemCategory = {
      id: 'cat-123',
      name: 'No Change',
      organizationId: 'org-1',
      creatorId: 'user-123',
      isDisabled: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    };

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CategoryModal
          isOpen
          hide={vi.fn()}
          refetchCategories={vi.fn()}
          orgId="org-1"
          category={categoryToEdit}
          mode="edit"
        />
      </MockedProvider>,
    );

    // We won't change anything
    fireEvent.click(screen.getByTestId('formSubmitButton'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'orgActionItemCategories.sameNameConflict',
      );
    });
  });
});

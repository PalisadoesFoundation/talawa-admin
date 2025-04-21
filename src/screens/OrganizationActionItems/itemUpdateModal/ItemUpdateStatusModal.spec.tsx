// src/screens/OrganizationActionItems/ItemUpdateStatusModal.spec.tsx

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ItemUpdateStatusModal from './ItemUpdateStatusModal';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING,
} from 'GraphQl/Mutations/ActionItemMutations';
import { toast } from 'react-toastify';
import {
  GET_USERS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
// Global mocks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

// Sample action item (not completed)
const sampleActionItemNotCompleted = {
  id: '1',
  isCompleted: false,
  assignedAt: '2023-01-01T00:00:00.000Z',
  completionAt: '',
  createdAt: '2022-12-31T00:00:00.000Z',
  updatedAt: '2022-12-31T00:00:00.000Z',
  preCompletionNotes: 'Pre notes',
  postCompletionNotes: null,
  organizationId: 'org1',
  categoryId: 'cat1',
  eventId: 'event1',
  assigneeId: 'user1',
  creatorId: 'user2',
  updaterId: 'user2',
  actionItemCategory: {
    id: 'cat1',
    name: 'Category 1',
  },
};

const sampleActionItemCompleted = {
  ...{
    id: '1',
    isCompleted: true,
    assignedAt: '2023-01-01T00:00:00.000Z',
    completionAt: '2023-01-02T00:00:00.000Z',
    createdAt: '2022-12-31T00:00:00.000Z',
    updatedAt: '2022-12-31T00:00:00.000Z',
    preCompletionNotes: 'Pre notes',
    postCompletionNotes: 'Some notes',
    organizationId: 'org1',
    categoryId: 'cat1',
    eventId: 'event1',
    assigneeId: 'user1',
    creatorId: 'user2',
    updaterId: 'user2',
  },
};

const sampleActionItemMissingId = {
  ...sampleActionItemCompleted,
  id: '',
};

const usersMock: MockedResponse<{
  usersByIds: { id: string; name: string }[];
}> = {
  request: {
    query: GET_USERS_BY_IDS,
    variables: { input: { ids: ['user1', 'user2'] } },
  },
  result: {
    data: {
      usersByIds: [
        { id: 'user1', name: 'User One' },
        { id: 'user2', name: 'User Two' },
      ],
    },
  },
};

const categoriesMock: MockedResponse<{
  categoriesByIds: { id: string; name: string }[];
}> = {
  request: {
    query: GET_CATEGORIES_BY_IDS,
    variables: { ids: ['cat1'] },
  },
  result: {
    data: {
      categoriesByIds: [{ id: 'cat1', name: 'Category 1' }],
    },
  },
};

const updateMockNotCompleted: MockedResponse = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        assigneeId: 'user1',
        postCompletionNotes: 'Updated notes',
        isCompleted: true, // toggled from false to true
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: true,
        preCompletionNotes: 'Pre notes',
        postCompletionNotes: 'Updated notes',
        categoryId: 'cat1',
        assigneeId: 'user1',
        updaterId: 'user2',
      },
    },
  },
};

const updateMockError: MockedResponse = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        assigneeId: 'user1',
        postCompletionNotes: 'Updated notes',
        isCompleted: true,
      },
    },
  },
  error: new Error('Mutation failed'),
};

const pendingMockSuccess: MockedResponse = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING,
    variables: { id: '1' },
  },
  result: {
    data: {
      markActionItemAsPending: { id: '1', isCompleted: false },
    },
  },
};

// Error case for the pending mutation
const pendingMockError: MockedResponse = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING,
    variables: { id: '1' },
  },
  error: new Error('Pending mutation failed'),
};

// Global callback mocks
let hideMock = vi.fn();
let refetchMock = vi.fn();

beforeEach(() => {
  hideMock = vi.fn();
  refetchMock = vi.fn();
  toast.success = vi.fn();
  toast.warning = vi.fn();
  toast.error = vi.fn();
});

describe('ItemUpdateStatusModal Component', () => {
  it('renders in update mode (not completed) and submits updated action item', async () => {
    render(
      <MockedProvider mocks={[updateMockNotCompleted]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemNotCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const notesField = screen.getByLabelText('postCompletionNotes');
    expect(notesField).toBeInTheDocument();

    fireEvent.change(notesField, { target: { value: 'Updated notes' } });

    const submitBtn = screen.getByTestId('createBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
    });

    expect(hideMock).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  it('calls hide when the close button is clicked', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemNotCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('modalCloseBtn');
    fireEvent.click(closeButton);
    expect(hideMock).toHaveBeenCalled();
  });

  it('calls toast.error on mutation failure', async () => {
    render(
      <MockedProvider mocks={[updateMockError]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemNotCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const notesField = screen.getByLabelText('postCompletionNotes');
    fireEvent.change(notesField, { target: { value: 'Updated notes' } });

    const submitBtn = screen.getByTestId('createBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mutation failed');
    });
  });

  it('displays correct category and assignee values using helper functions', async () => {
    render(
      <MockedProvider mocks={[usersMock, categoriesMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemNotCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait for the category TextField to display its value.
    const categoryField = await screen.findByLabelText('category');
    expect(categoryField).toHaveValue('Category 1');

    // Wait for the assignee TextField to display its value.
    const assigneeField = await screen.findByLabelText('assignee');
    expect(assigneeField).toHaveValue('User One');
  });
  it('handles successful pending mutation', async () => {
    render(
      <MockedProvider
        mocks={[pendingMockSuccess, usersMock, categoriesMock]}
        addTypename={false}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // The "yes" button is rendered only when isCompleted is true.
    const yesButton = screen.getByTestId('yesBtn');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
    });
    expect(hideMock).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  it('handles error during pending mutation', async () => {
    render(
      <MockedProvider
        mocks={[pendingMockError, usersMock, categoriesMock]}
        addTypename={false}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemCompleted}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const yesButton = screen.getByTestId('yesBtn');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Pending mutation failed');
    });
  });

  it('displays error when action item ID is missing for pending update', async () => {
    render(
      <MockedProvider mocks={[usersMock, categoriesMock]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemUpdateStatusModal
            isOpen={true}
            hide={hideMock}
            actionItemsRefetch={refetchMock}
            actionItem={sampleActionItemMissingId}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const yesButton = screen.getByTestId('yesBtn');
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Action item ID is missing.');
    });
  });
});

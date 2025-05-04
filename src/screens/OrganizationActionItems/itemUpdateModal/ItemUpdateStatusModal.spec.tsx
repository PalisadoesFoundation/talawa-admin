// src/screens/OrganizationActionItems/ItemUpdateStatusModal.spec.tsx

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ItemUpdateStatusModal from './ItemUpdateStatusModal';
import { UPDATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/ActionItemMutations';
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

const sampleActionItemCompleted = {
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
  allottedHours: 5,
};

const sampleActionItemNotCompleted = {
  ...sampleActionItemCompleted,
  isCompleted: false,
  postCompletionNotes: null,
};

const sampleActionItemMissingId = {
  ...sampleActionItemCompleted,
  id: '',
};

const usersMock: MockedResponse = {
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

const categoriesMock: MockedResponse = {
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
        isCompleted: true,
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: true,
        postCompletionNotes: 'Updated notes',
        assignee: { id: 'user1' },
      },
    },
  },
};

const updateMockPendingSuccess: MockedResponse = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        isCompleted: false,
        postCompletionNotes: '',
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: false,
        postCompletionNotes: '',
        assignee: { id: 'user1' },
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
    fireEvent.change(notesField, { target: { value: 'Updated notes' } });

    const submitBtn = screen.getByTestId('createBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('calls hide when the close button is clicked', () => {
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

    expect(await screen.findByLabelText('category')).toHaveValue('Category 1');
    expect(await screen.findByLabelText('assignee')).toHaveValue('User One');
  });

  it('handles marking completed item as pending using updateActionItem mutation', async () => {
    render(
      <MockedProvider mocks={[updateMockPendingSuccess]} addTypename={false}>
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
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('shows error when action item ID is missing for pending update', async () => {
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

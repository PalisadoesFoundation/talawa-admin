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

// Sample action item (completed)
const sampleActionItemCompleted = {
  ...sampleActionItemNotCompleted,
  isCompleted: true,
  postCompletionNotes: 'Some post notes',
};

// Global GraphQL mocks
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

const updateMockCompleted: MockedResponse = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        assigneeId: 'user1',
        postCompletionNotes: '',
        isCompleted: false, // toggled from true to false
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: false,
        preCompletionNotes: 'Pre notes',
        postCompletionNotes: '',
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

  it('renders in update mode (completed) and submits updated action item', async () => {
    render(
      <MockedProvider mocks={[updateMockCompleted]} addTypename={false}>
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

    expect(screen.queryByLabelText('postCompletionNotes')).toBeNull();
    expect(screen.getByText('updateStatusMsg')).toBeInTheDocument();

    const yesBtn = screen.getByTestId('yesBtn');
    fireEvent.click(yesBtn);

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
});

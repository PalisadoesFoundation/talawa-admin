// ItemModal.spec.tsx
import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ItemModal from './ItemModal';

import {
  POSTGRES_CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';

import { ACTION_ITEM_CATEGORIES_BY_ORGANIZATION } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  USERS_BY_ORGANIZATION_ID,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

import { toast } from 'react-toastify';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    tCommon: (k: string) => k,
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

beforeAll(() => vi.setSystemTime(new Date('2025-04-25T00:00:00Z')));
afterAll(() => vi.useRealTimers());

const orgId = 'org1';
const eventId = 'ev1';
const categoryId = 'cat1';
const categoryName = 'Category 1';
const userId = 'user1';
const userName = 'Assignee User';
const memberId = 'member1';
const memberName = 'Member User';
const volunteerId = 'vol1';
const volunteerName = 'Volunteer User';

async function pickOption(rootTestId: string, optionText: string) {
  const root = await screen.findByTestId(rootTestId);
  const combo = within(root).getByRole('combobox');
  fireEvent.mouseDown(combo);
  const option = await screen.findByText(optionText);
  fireEvent.click(option);
}

/* queryMocks (extend the arrays) */
const queryMocks: MockedResponse[] = [
  {
    request: {
      query: ACTION_ITEM_CATEGORIES_BY_ORGANIZATION,
      variables: { input: { organizationId: 'org1' } },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [
          { id: 'cat1', name: 'Category 1', __typename: 'Category' },
          { id: 'cat2', name: 'Category 2', __typename: 'Category' }, // ✨ add
        ],
      },
    },
  },
  {
    request: {
      query: USERS_BY_ORGANIZATION_ID,
      variables: { organizationId: 'org1' },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'user1',
            name: 'Assignee User',
            emailAddress: 'a@b.c',
            createdAt: '',
            __typename: 'User',
          },
          {
            id: 'user2', // ✨ a
            name: 'Another User',
            emailAddress: 'u2@b.c',
            createdAt: '',
            __typename: 'User',
          },
        ],
      },
    },
  },
  /* …the rest stay the same … */
];

const populatedItem = {
  id: 'itemX',
  isCompleted: false,
  assignedAt: '2025-04-25',
  completionAt: null,
  createdAt: '',
  updatedAt: '',
  preCompletionNotes: 'hello',
  postCompletionNotes: null,
  organizationId: 'org1',
  category: { id: 'cat1', name: 'Category 1' },
  assigneeId: 'user1',
  allottedHours: 3,
};

const existingItem = {
  id: 'item1',
  isCompleted: false,
  assignedAt: '2025-04-25',
  completionAt: null,
  createdAt: '',
  updatedAt: '',
  preCompletionNotes: '',
  postCompletionNotes: null,
  organizationId: 'org1',
  category: { id: 'cat1', name: 'Category 1' },
  assigneeId: 'user1',
  allottedHours: 2,
};

const completedItem = {
  ...existingItem,
  id: 'item2',
  isCompleted: true,
  completionAt: '2025-04-24',
  postCompletionNotes: 'This task is complete',
};

const hideMock = vi.fn();
const refetchMock = vi.fn();
beforeEach(() => {
  hideMock.mockReset();
  refetchMock.mockReset();
  toast.success = vi.fn();
  toast.warning = vi.fn();
  toast.error = vi.fn();
});

const renderItemModal = (
  ui: React.ReactElement,
  extra: MockedResponse[] = [],
) =>
  render(
    <MockedProvider mocks={[...queryMocks, ...extra]} addTypename={false}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {ui}
      </LocalizationProvider>
    </MockedProvider>,
  );

describe('ItemModal component', () => {
  it('warns & skips update when nothing changed', async () => {
    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId="org1"
        eventId="ev1"
        actionItem={existingItem as any}
        editMode
        actionItemsRefetch={refetchMock}
      />,
      [], // no mutation mock needed – we expect none
    );

    fireEvent.click(await screen.findByTestId('submitBtn'));

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('noneUpdated'),
    );
    expect(refetchMock).not.toHaveBeenCalled();
  });

  it('invokes hide() when close button pressed', async () => {
    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId="org1"
        eventId="ev1"
        actionItem={null}
        editMode={false}
        actionItemsRefetch={refetchMock}
      />,
    );

    fireEvent.click(await screen.findByTestId('modalCloseBtn'));
    expect(hideMock).toHaveBeenCalled();
  });

  /* ------------------------------------------------------------------ */
  it('toggles assigneeType radio buttons', async () => {
    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId="org1"
        eventId="ev1"
        actionItem={null}
        editMode={false}
        actionItemsRefetch={refetchMock}
      />,
    );

    const groupsRadio = await screen.findByLabelText('groups');
    fireEvent.click(groupsRadio); // switch to “groups”
    expect(
      (screen.getByRole('radio', { name: 'groups' }) as HTMLInputElement)
        .checked,
    ).toBe(true);

    const indivRadio = screen.getByLabelText('individuals');
    fireEvent.click(indivRadio); // back to “individuals”
    expect(
      (screen.getByRole('radio', { name: 'individuals' }) as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  it('shows post-completion notes field when item is completed', async () => {
    const completedItem = {
      ...populatedItem,
      isCompleted: true,
      postCompletionNotes: 'done',
    };

    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId="org1"
        eventId="ev1"
        actionItem={completedItem as any}
        editMode
        actionItemsRefetch={refetchMock}
      />,
    );

    expect(
      await screen.findByLabelText('postCompletionNotes'),
    ).toBeInTheDocument();
    /* pre-completion notes field should be absent */
    expect(
      screen.queryByLabelText('preCompletionNotes'),
    ).not.toBeInTheDocument();
  });

  it('updates an item when a field changes (edit mode)', async () => {
    const updateSuccessMock: MockedResponse = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: existingItem.id,
            preCompletionNotes: 'foo',
            isCompleted: existingItem.isCompleted,
          },
        },
      },
      result: { data: { updateActionItem: { id: existingItem.id } } },
    };

    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId="org1"
        eventId="ev1"
        actionItem={existingItem as any}
        editMode
        actionItemsRefetch={refetchMock}
      />,
      [updateSuccessMock],
    );

    // change just the preCompletionNotes
    const notesInput = await screen.findByLabelText('preCompletionNotes');
    fireEvent.change(notesInput, { target: { value: 'foo' } });

    fireEvent.click(screen.getByTestId('submitBtn'));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation'),
    );
  });

  describe('Rendering Tests', () => {
    it('renders in create mode with correct title', async () => {
      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={null}
          editMode={false}
          actionItemsRefetch={refetchMock}
        />,
      );

      expect(await screen.findByTestId('modalTitle')).toHaveTextContent(
        'createActionItem',
      );
      expect(screen.getByTestId('submitBtn')).toHaveTextContent(
        'createActionItem',
      );
    });

    it('renders in edit mode with correct title', async () => {
      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={existingItem as any}
          editMode={true}
          actionItemsRefetch={refetchMock}
        />,
      );

      expect(await screen.findByTestId('modalTitle')).toHaveTextContent(
        'updateActionItem',
      );
      expect(screen.getByTestId('submitBtn')).toHaveTextContent(
        'updateActionItem',
      );
    });

    it('displays only post-completion notes field for completed items', async () => {
      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={completedItem as any}
          editMode={true}
          actionItemsRefetch={refetchMock}
        />,
      );

      // Verify post-completion notes field is present
      await screen.findByLabelText('postCompletionNotes');

      // Other fields should not be present
      expect(
        screen.queryByLabelText('preCompletionNotes'),
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText('dueDate')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('allottedHours')).not.toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={null}
          editMode={false}
          actionItemsRefetch={refetchMock}
        />,
      );

      const closeButton = await screen.findByTestId('modalCloseBtn');
      fireEvent.click(closeButton);
      expect(hideMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mutation Tests', () => {
    it('handles update action item failure', async () => {
      // Mock mutation with error
      const updateErrorMock: MockedResponse = {
        request: {
          query: UPDATE_ACTION_ITEM_MUTATION,
          variables: {
            input: {
              id: existingItem.id,
              preCompletionNotes: 'Will fail',
              isCompleted: false,
            },
          },
        },
        error: new Error('Failed to update action item'),
      };

      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={existingItem as any}
          editMode={true}
          actionItemsRefetch={refetchMock}
        />,
        [updateErrorMock],
      );

      // Update preCompletionNotes
      const notesField = await screen.findByLabelText('preCompletionNotes');
      fireEvent.change(notesField, { target: { value: 'Will fail' } });

      // Submit the form
      fireEvent.click(screen.getByTestId('submitBtn'));

      // Wait for toast error message
      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to update action item',
        ),
      );
      expect(hideMock).not.toHaveBeenCalled();
      expect(refetchMock).not.toHaveBeenCalled();
    });

    it('warns when no fields are changed in update mode', async () => {
      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={existingItem as any}
          editMode={true}
          actionItemsRefetch={refetchMock}
        />,
      );

      // Submit without changing anything
      fireEvent.click(await screen.findByTestId('submitBtn'));

      await waitFor(() =>
        expect(toast.warning).toHaveBeenCalledWith('noneUpdated'),
      );
      expect(hideMock).not.toHaveBeenCalled();
      expect(refetchMock).not.toHaveBeenCalled();
    });

    it('updates post-completion notes for completed items', async () => {
      // Define update mutation mock for completed item
      const updateCompletedMock: MockedResponse = {
        request: {
          query: UPDATE_ACTION_ITEM_MUTATION,
          variables: {
            input: {
              id: completedItem.id,
              postCompletionNotes: 'Updated completion notes',
              isCompleted: true,
            },
          },
        },
        result: {
          data: {
            updateActionItem: {
              id: completedItem.id,
              isCompleted: true,
              preCompletionNotes: completedItem.preCompletionNotes,
              postCompletionNotes: 'Updated completion notes',
              updatedAt: '2025-04-25T12:00:00Z',
              allottedHours: completedItem.allottedHours,
              category: { id: categoryId },
              assignee: { id: userId },
              updater: { id: 'updater1' },
            },
          },
        },
      };

      renderItemModal(
        <ItemModal
          isOpen
          hide={hideMock}
          orgId={orgId}
          eventId={eventId}
          actionItem={completedItem as any}
          editMode={true}
          actionItemsRefetch={refetchMock}
        />,
        [updateCompletedMock],
      );

      // Update postCompletionNotes
      const notesField = await screen.findByLabelText('postCompletionNotes');
      fireEvent.change(notesField, {
        target: { value: 'Updated completion notes' },
      });

      // Submit the form
      fireEvent.click(screen.getByTestId('submitBtn'));

      // Wait for toast success message
      await waitFor(() =>
        expect(toast.success).toHaveBeenCalledWith('successfulUpdation'),
      );
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('handles undefined event ID', async () => {
    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId={orgId}
        eventId={undefined}
        actionItem={null}
        editMode={false}
        actionItemsRefetch={refetchMock}
      />,
    );

    // Verify the component renders without errors
    await screen.findByTestId('modalTitle');

    // Verify the assignTo section isn't rendered when eventId is undefined
    expect(screen.queryByLabelText('assignTo')).not.toBeInTheDocument();
  });
  it('successfully updates an action item with changed values', async () => {
    const updateMutationMock: MockedResponse = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: existingItem.id,
            preCompletionNotes: 'Updated notes',
            allottedHours: 4,
            isCompleted: false,
          },
        },
      },
      result: {
        data: {
          updateActionItem: {
            id: existingItem.id,
            isCompleted: false,
            preCompletionNotes: 'Updated notes',
            postCompletionNotes: null,
            updatedAt: '2025-04-25T12:00:00Z',
            allottedHours: 4,
            category: { id: categoryId },
            assignee: { id: userId },
            updater: { id: 'updater1' },
          },
        },
      },
    };

    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId={orgId}
        eventId={eventId}
        actionItem={existingItem as any}
        editMode={true}
        actionItemsRefetch={refetchMock}
      />,
      [updateMutationMock],
    );

    // 1) Change the notes
    const notesInput = screen.getByLabelText(/preCompletionNotes/i);
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    // 2) Change the allotted hours
    const hoursInputContainer = screen.getByTestId('allottedHoursInput');
    // the `!` tells TS this will never be null at runtime
    const hoursInput =
      hoursInputContainer.querySelector<HTMLInputElement>('input')!;
    fireEvent.change(hoursInput, { target: { value: '4' } });

    // 3) Submit
    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // 4) Assert the toast, hide and refetch were called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('warns when no fields have changed', async () => {
    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId={orgId}
        eventId={eventId}
        actionItem={existingItem as any}
        editMode={true}
        actionItemsRefetch={refetchMock}
      />,
    );

    // Submit the form without changing any fields
    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('noneUpdated');
      expect(hideMock).not.toHaveBeenCalled();
      expect(refetchMock).not.toHaveBeenCalled();
    });
  });

  it('handles errors when updating an action item', async () => {
    const errorMock = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: existingItem.id,
            preCompletionNotes: 'Updated notes',
            isCompleted: false,
          },
        },
      },
      error: new Error('Failed to update action item'),
    };

    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId={orgId}
        eventId={eventId}
        actionItem={existingItem as any}
        editMode={true}
        actionItemsRefetch={refetchMock}
      />,
      [errorMock],
    );

    // Update pre-completion notes
    const notesInput = screen.getByLabelText(/preCompletionNotes/i);
    fireEvent.change(notesInput, { target: { value: 'Updated notes' } });

    // Submit the form
    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update action item');
      expect(hideMock).not.toHaveBeenCalled();
      expect(refetchMock).not.toHaveBeenCalled();
    });
  });

  it('handles updating post-completion notes for completed items', async () => {
    const updateMutationMock = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: completedItem.id,
            postCompletionNotes: 'Updated completion notes',
            isCompleted: true,
          },
        },
      },
      result: {
        data: {
          updateActionItem: {
            id: completedItem.id,
            isCompleted: true,
            preCompletionNotes: '',
            postCompletionNotes: 'Updated completion notes',
            updatedAt: '2025-04-25T12:00:00Z',
            allottedHours: 2,
            category: { id: categoryId },
            assignee: { id: userId },
            updater: { id: 'updater1' },
          },
        },
      },
    };

    renderItemModal(
      <ItemModal
        isOpen
        hide={hideMock}
        orgId={orgId}
        eventId={eventId}
        actionItem={completedItem as any}
        editMode={true}
        actionItemsRefetch={refetchMock}
      />,
      [updateMutationMock],
    );

    // Update post-completion notes
    const notesInput = screen.getByLabelText(/postCompletionNotes/i);
    fireEvent.change(notesInput, {
      target: { value: 'Updated completion notes' },
    });

    // Submit the form
    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // Wait for async operations to complete
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });
});

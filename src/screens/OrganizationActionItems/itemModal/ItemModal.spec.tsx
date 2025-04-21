import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ItemModal from './ItemModal';
import {
  POSTGRES_CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  POSTGRES_EVENTS_BY_ORGANIZATION_ID,
} from 'GraphQl/Mutations/ActionItemMutations';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemQueries';
import {
  USERS_BY_ORGANIZATION_ID,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { act } from 'react-dom/test-utils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers', async () => {
  const actual = await vi.importActual('@mui/x-date-pickers');
  return {
    ...actual,
    DatePicker: ({
      label,
      value,
      onChange,
    }: {
      label: string;
      value: dayjs.Dayjs | null;
      onChange: (value: dayjs.Dayjs | null) => void;
    }) => {
      return (
        <input
          aria-label={label}
          value={value ? value.format('DD/MM/YYYY') : ''}
          onChange={(e) => {
            const parts = e.target.value.split('/');
            if (parts.length === 3) {
              const [day, month, year] = parts.map((part) =>
                parseInt(part, 10),
              );
              onChange(dayjs(new Date(year, month - 1, day)));
            }
          }}
        />
      );
    },
  };
});

const sampleEventsData = {
  eventsByOrganizationId: [
    { id: 'event1', name: 'Test Event 1' },
    { id: 'event2', name: 'Test Event 2' },
  ],
};

// Create a mock for the events query
const eventsMock: MockedResponse[] = [
  {
    request: {
      query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
      variables: { input: { organizationId: 'org1' } },
    },
    result: {
      data: sampleEventsData,
    },
  },
];

// --- Sample data ---
const sampleActionItem = {
  id: '1',
  isCompleted: false,
  assignedAt: '2023-01-01T00:00:00.000Z',
  completionAt: '',
  createdAt: '2022-12-31T00:00:00.000Z',
  updatedAt: '2022-12-31T00:00:00.000Z',
  preCompletionNotes: 'Initial notes',
  postCompletionNotes: null,
  organizationId: 'org1',
  categoryId: 'cat1',
  eventId: 'event1',
  assigneeId: 'user1',
  creatorId: 'user2',
  updaterId: 'user2',
  allottedHours: 5, // Added allottedHours property
  actionItemCategory: {
    id: 'cat1',
    name: 'Category 1',
  },
};

const updateAssigneeMock: MockedResponse = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: sampleActionItem.id,
        preCompletionNotes: sampleActionItem.preCompletionNotes,
        // Here we expect the assigneeId to be updated from 'user1' to 'user2'
        assigneeId: 'user2',
        isCompleted: sampleActionItem.isCompleted,
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        ...sampleActionItem,
        assigneeId: 'user2',
      },
    },
  },
};

const combinedMocks: MockedResponse[] = [
  // ... other required mocks for categories, users, etc.
  updateAssigneeMock,
];

const sampleCategoryData = {
  actionItemCategoriesByOrganization: [
    {
      id: 'cat1',
      name: 'Category 1',
      organizationId: 'org1',
      creatorId: 'user2',
      isDisabled: false,
      createdAt: '2022-12-31T00:00:00.000Z',
      updatedAt: '2022-12-31T00:00:00.000Z',
    },
    {
      id: 'cat2',
      name: 'Category 2',
      organizationId: 'org1',
      creatorId: 'user2',
      isDisabled: false,
      createdAt: '2022-12-31T00:00:00.000Z',
      updatedAt: '2022-12-31T00:00:00.000Z',
    },
  ],
};

const sampleActionCategoryData = {
  actionCategoriesByOrganization: [
    {
      id: 'cat1',
      name: 'Category 1',
      organizationId: 'org1',
      creatorId: 'user2',
      isDisabled: false,
      createdAt: '2022-12-31T00:00:00.000Z',
      updatedAt: '2022-12-31T00:00:00.000Z',
    },
    {
      id: 'cat2',
      name: 'Category 2',
      organizationId: 'org1',
      creatorId: 'user2',
      isDisabled: false,
      createdAt: '2022-12-31T00:00:00.000Z',
      updatedAt: '2022-12-31T00:00:00.000Z',
    },
  ],
};

const sampleUsersData = {
  usersByOrganizationId: [
    {
      id: 'user1',
      name: 'User One',
      emailAddress: 'user1@example.com',
      createdAt: '2022-12-31T00:00:00.000Z',
      __typename: 'User',
    },
    {
      id: 'user2',
      name: 'User Two',
      emailAddress: 'user2@example.com',
      createdAt: '2022-12-31T00:00:00.000Z',
      __typename: 'User',
    },
  ],
};

const sampleVolunteersData = {
  getEventVolunteers: [{ _id: 'user1', name: 'User One' }],
};

const sampleMembersData = {
  organizations: [
    {
      members: [
        {
          _id: 'user1',
          firstName: 'User',
          lastName: 'One',
          email: 'user1@example.com',
          createdAt: '2022-12-31T00:00:00.000Z',
        },
      ],
    },
  ],
};

// Create completed action item with initial postCompletionNotes
const completedActionItem = {
  ...sampleActionItem,
  isCompleted: true,
  postCompletionNotes: 'Initial completion notes',
};

// Mock for post completion notes update
const updateNotesMock = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        postCompletionNotes: 'Updated completion notes',
        isCompleted: true,
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: true,
        preCompletionNotes: 'Initial notes',
        postCompletionNotes: 'Updated completion notes',
        categoryId: 'cat1',
        assigneeId: 'user1',
        updaterId: 'user2',
      },
    },
  },
};

const mocks2 = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: 'org1', where: { is_disabled: false } },
    },
    result: { data: sampleCategoryData },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY,
      variables: { input: { organizationId: 'org1' } },
    },
    result: { data: sampleActionCategoryData },
  },
  {
    request: {
      query: USERS_BY_ORGANIZATION_ID,
      variables: { organizationId: 'org1' },
    },
    result: { data: sampleUsersData },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { eventId: 'event1', hasAccepted: true } },
    },
    result: { data: sampleVolunteersData },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org1' },
    },
    result: { data: sampleMembersData },
  },
  updateNotesMock,
];

const today = dayjs(new Date()).format('YYYY-MM-DD');

// Mock for category selection update
const updateCategoryMock = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: '1',
        categoryId: 'cat2',
        isCompleted: false,
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: '1',
        isCompleted: false,
        preCompletionNotes: 'Initial notes',
        postCompletionNotes: null,
        categoryId: 'cat2',
        assigneeId: 'user1',
        updaterId: 'user2',
      },
    },
  },
};

const mocks4 = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: 'org1', where: { is_disabled: false } },
    },
    result: { data: sampleCategoryData },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY,
      variables: { input: { organizationId: 'org1' } },
    },
    result: { data: sampleActionCategoryData },
  },
  {
    request: {
      query: USERS_BY_ORGANIZATION_ID,
      variables: { organizationId: 'org1' },
    },
    result: { data: sampleUsersData },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { eventId: 'event1', hasAccepted: true } },
    },
    result: { data: sampleVolunteersData },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org1' },
    },
    result: { data: sampleMembersData },
  },
  updateCategoryMock,
];

// --- GraphQL mocks ---
const mocks: MockedResponse[] = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: 'org1', where: { is_disabled: false } },
    },
    result: { data: sampleCategoryData },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY,
      variables: { input: { organizationId: 'org1' } },
    },
    result: { data: sampleActionCategoryData },
  },
  {
    request: {
      query: USERS_BY_ORGANIZATION_ID,
      variables: { organizationId: 'org1' },
    },
    result: { data: sampleUsersData },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { eventId: 'event1', hasAccepted: true } },
    },
    result: { data: sampleVolunteersData },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: 'org1' },
    },
    result: { data: sampleMembersData },
  },
  // Create mutation mock for create mode.
  {
    request: {
      query: POSTGRES_CREATE_ACTION_ITEM_MUTATION,
      variables: {
        input: {
          categoryId: '', // because actionItem is null and initializeFormState returns '' for categoryId
          assigneeId: '', // likewise
          preCompletionNotes: 'Initial notes',
          organizationId: 'org1',
          eventId: 'event1',
          assignedAt: today,
        },
      },
    },
    result: {
      data: {
        createActionItem: {
          id: 'new1',
          isCompleted: false,
          preCompletionNotes: 'Initial notes',
          postCompletionNotes: null,
          categoryId: '',
          assigneeId: '',
          updaterId: 'user2',
        },
      },
    },
  },
  // Update mutation mock for update mode.
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        input: {
          id: '1',
          preCompletionNotes: 'Updated notes',
          isCompleted: false,
        },
      },
    },
    result: {
      data: {
        updateActionItem: {
          id: '1',
          isCompleted: false,
          preCompletionNotes: 'Updated notes',
          postCompletionNotes: null,
          categoryId: 'cat1',
          assigneeId: 'user1',
          updaterId: 'user2',
        },
      },
    },
  },
];

let hideMock = vi.fn();
let refetchMock = vi.fn();

beforeEach(() => {
  hideMock = vi.fn();
  refetchMock = vi.fn();
  toast.success = vi.fn();
  toast.warning = vi.fn();
  toast.error = vi.fn();
});

describe('ItemModal Component', () => {
  it('renders in create mode and submits a new action item', async () => {
    // Render component in create mode: actionItem is null and editMode false.
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Simulate user entering preCompletionNotes.
    const preCompletionField = screen.getByLabelText('preCompletionNotes');
    fireEvent.change(preCompletionField, {
      target: { value: 'Initial notes' },
    });

    // Simulate form submission by clicking the submit button.
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    // Wait for the success toast to be called.
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulCreation');
    });

    // Verify that the modal is closed and refetch is called.
    expect(hideMock).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  it('shows a warning toast if no fields are updated in update mode', async () => {
    // Render component in update mode without changing any fields.
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('noneUpdated');
    });
  });

  it('calls hide when the close button is clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const closeButton = screen.getByTestId('modalCloseBtn');
    fireEvent.click(closeButton);

    expect(hideMock).toHaveBeenCalled();
  });

  it('calls toast.error if createActionItemHandler fails', async () => {
    const errorMessage = 'Create failed';
    // Override create mutation to reject.
    const errorMock: MockedResponse = {
      request: {
        query: POSTGRES_CREATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            categoryId: '',
            assigneeId: '',
            preCompletionNotes: 'Initial notes',
            organizationId: 'org1',
            eventId: 'event1',
            assignedAt: today,
          },
        },
      },
      error: new Error(errorMessage),
    };

    render(
      <MockedProvider mocks={[errorMock, ...mocks]} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Fill the preCompletionNotes field.
    const preCompletionField = screen.getByLabelText('preCompletionNotes');
    fireEvent.change(preCompletionField, {
      target: { value: 'Initial notes' },
    });
    // Submit the form.
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('updates assigneeType when radio buttons are clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Render in create mode with an eventId so that radios are visible */}
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Get the radio buttons by their id or label.
    const individualRadio = screen.getByRole('radio', { name: /individuals/i });
    const groupsRadio = screen.getByRole('radio', { name: /groups/i });

    // Click the individual radio and expect it to be checked.
    fireEvent.click(individualRadio);
    expect(individualRadio).toBeChecked();

    // Click the groups radio.
    fireEvent.click(groupsRadio);
    expect(groupsRadio).toBeChecked();
  });

  it('updates dueDate when a new date is selected', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const dateInput = screen.getByLabelText('dueDate');
    // Simulate entering a new date in DD/MM/YYYY format.
    fireEvent.change(dateInput, { target: { value: '01/04/2025' } });
    // Expect the input to reflect the new date.
    expect(dateInput).toHaveValue('01/04/2025');
  });

  it('updates postCompletionNotes when text is entered', async () => {
    // Create an action item with isCompleted true.
    const completedActionItem = {
      ...sampleActionItem,
      isCompleted: true,
      postCompletionNotes: '',
    };

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={completedActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // The postCompletionNotes field should be rendered.
    const postNotesField = screen.getByLabelText('postCompletionNotes');
    fireEvent.change(postNotesField, { target: { value: 'New post note' } });
    expect(postNotesField).toHaveValue('New post note');
  });

  it('updates preCompletionNotes when changed and submitted', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={vi.fn()}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={vi.fn()}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const input = screen.getByLabelText(/preCompletionNotes/i);
    fireEvent.change(input, { target: { value: 'Updated notes' } });
    fireEvent.blur(input);
    fireEvent.submit(screen.getByTestId('submitBtn'));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation'),
    );
  });

  it('fetches event data correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={vi.fn()}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={vi.fn()}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('submitBtn')).toBeInTheDocument(),
    );
  });

  it('should update categoryId when a different category is selected', async () => {
    await act(async () => {
      render(
        <MockedProvider mocks={mocks4} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal
              isOpen={true}
              hide={hideMock}
              orgId="org1"
              eventId="event1"
              actionItem={sampleActionItem}
              editMode={true}
              actionItemsRefetch={refetchMock}
            />
          </LocalizationProvider>
        </MockedProvider>,
      );
    });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('categorySelect')).toBeInTheDocument();
    });

    // Open the category dropdown
    const categorySelect = screen.getByTestId('categorySelect');
    const autocomplete = categorySelect.querySelector('input');
    if (!autocomplete) {
      throw new Error('Autocomplete input not found in categorySelect');
    }

    // Click to open dropdown
    await act(async () => {
      fireEvent.mouseDown(autocomplete);
    });

    // Wait for the dropdown options to appear
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);

      // Find and click on "Category 2"
      const category2Option = options.find(
        (option) => option.textContent?.trim() === 'Category 2',
      );
      if (!category2Option) {
        throw new Error('Category 2 option not found');
      }
      fireEvent.click(category2Option);
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId('submitBtn'));
    });
  });

  it('should update postCompletionNotes when changed for a completed action item', async () => {
    // Render with edit mode true and completed action item
    await act(async () => {
      render(
        <MockedProvider mocks={mocks2} addTypename={false}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ItemModal
              isOpen={true}
              hide={hideMock}
              orgId="org1"
              eventId="event1"
              actionItem={completedActionItem}
              editMode={true}
              actionItemsRefetch={refetchMock}
            />
          </LocalizationProvider>
        </MockedProvider>,
      );
    });

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByLabelText('postCompletionNotes')).toBeInTheDocument();
    });

    // Update the post completion notes
    const postCompletionField = screen.getByLabelText('postCompletionNotes');
    await act(async () => {
      fireEvent.change(postCompletionField, {
        target: { value: 'Updated completion notes' },
      });
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId('submitBtn'));
    });

    // Verify update was called and succeeded
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
      expect(hideMock).toHaveBeenCalled();
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('renders event options when events data is provided', async () => {
    render(
      <MockedProvider mocks={eventsMock} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // The Autocomplete for events has data-testid "eventSelect"
    // Since Material-UI's Autocomplete doesn't immediately render options,
    // we simulate a mouseDown on the input inside the Autocomplete to open the dropdown.

    const eventSelect = screen.getByTestId('eventSelect');
    const eventInput = eventSelect.querySelector('input');
    if (!eventInput) {
      throw new Error('Autocomplete input not found in eventSelect');
    }
    fireEvent.mouseDown(eventInput);

    // Wait for options to appear.
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]).toHaveTextContent('Test Event 1');
    });
  });

  it('renders event options when events data is provided', async () => {
    render(
      <MockedProvider mocks={eventsMock} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait until the Autocomplete for events is rendered.
    const eventSelect = screen.getByTestId('eventSelect');

    const eventInput = within(eventSelect).getByRole('combobox');

    // Simulate opening the dropdown.
    userEvent.click(eventInput);

    // Wait for the options to appear.
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
      expect(options[0]).toHaveTextContent('Test Event 1');
    });
  });

  it('renders no event options when events data is empty', async () => {
    // Create a mock that returns an empty events array.
    const emptyEventsMock: MockedResponse[] = [
      {
        request: {
          query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
          variables: { input: { organizationId: 'org1' } },
        },
        result: {
          data: { eventsByOrganizationId: [] },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyEventsMock} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    const eventSelect = screen.getByTestId('eventSelect');
    const eventInput = within(eventSelect).getByRole('combobox');
    userEvent.click(eventInput);

    await waitFor(() => {
      const options = screen.queryAllByRole('option');
      expect(options.length).toBe(0);
    });
  });

  it('handles both defined and undefined events data', async () => {
    // First test with valid events data
    render(
      <MockedProvider mocks={eventsMock} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait for the modal header to appear with the expected text.
    await waitFor(() => {
      expect(screen.getByTestId('modalTitle')).toHaveTextContent(
        'createActionItem',
      );
    });

    // Now test with undefined events data.
    const emptyEventsMock: MockedResponse[] = [
      {
        request: {
          query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
          variables: { input: { organizationId: 'org1' } },
        },
        result: {
          data: { eventsByOrganizationId: undefined },
        },
      },
      // Include the other necessary mocks that ItemModal requires.
      ...mocks.filter(
        (mock) => mock.request.query !== POSTGRES_EVENTS_BY_ORGANIZATION_ID,
      ),
    ];

    // Render the component again with empty events data.
    render(
      <MockedProvider mocks={emptyEventsMock} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={null}
            editMode={false}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      const modalTitles = screen.getAllByTestId('modalTitle');
      expect(modalTitles[0]).toHaveTextContent('createActionItem');
    });
  });
  // Test for error handling in updateActionItem
  it('handles errors when updating action item', async () => {
    const errorMessage = 'Update failed';
    const updateErrorMock = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: '1',
            preCompletionNotes: 'Updated notes',
            isCompleted: false,
          },
        },
      },
      error: new Error(errorMessage),
    };

    const errorMocks = [
      ...mocks.filter(
        (mock) => mock.request.query !== UPDATE_ACTION_ITEM_MUTATION,
      ),
      updateErrorMock,
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Update preCompletionNotes to trigger a change
    const preCompletionField = screen.getByLabelText('preCompletionNotes');
    fireEvent.change(preCompletionField, {
      target: { value: 'Updated notes' },
    });

    // Submit the form
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    // Wait for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('correctly compares option values in assignee dropdown using isOptionEqualToValue', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: { organizationId: 'org1', where: { is_disabled: false } },
        },
        result: { data: sampleCategoryData },
      },
      {
        request: {
          query: ACTION_ITEM_CATEGORY,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleActionCategoryData },
      },
      {
        request: {
          query: USERS_BY_ORGANIZATION_ID,
          variables: { organizationId: 'org1' },
        },
        result: { data: sampleUsersData },
      },
      {
        request: {
          query: EVENT_VOLUNTEER_LIST,
          variables: { where: { eventId: 'event1', hasAccepted: true } },
        },
        result: { data: sampleVolunteersData },
      },
      {
        request: {
          query: MEMBERS_LIST,
          variables: { id: 'org1' },
        },
        result: { data: sampleMembersData },
      },
      {
        request: {
          query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleEventsData },
      },
    ];

    // Render component with the existing action item to test value comparison
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait for the component to load data
    await waitFor(() => {
      expect(screen.getByTestId('memberSelect')).toBeInTheDocument();
    });

    // Check if the current assignee is correctly selected in the dropdown
    const assigneeInput = screen.getByTestId('assignee-input');
    await waitFor(() => {
      expect(assigneeInput).toHaveValue('User One');
    });
  });

  // Testing if no update is made when assignee isn't changed
  it('does not update assignee when it is not changed', async () => {
    // Mock for warning about no changes
    const mocks: MockedResponse[] = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: { organizationId: 'org1', where: { is_disabled: false } },
        },
        result: { data: sampleCategoryData },
      },
      {
        request: {
          query: ACTION_ITEM_CATEGORY,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleActionCategoryData },
      },
      {
        request: {
          query: USERS_BY_ORGANIZATION_ID,
          variables: { organizationId: 'org1' },
        },
        result: { data: sampleUsersData },
      },
      {
        request: {
          query: EVENT_VOLUNTEER_LIST,
          variables: { where: { eventId: 'event1', hasAccepted: true } },
        },
        result: { data: sampleVolunteersData },
      },
      {
        request: {
          query: MEMBERS_LIST,
          variables: { id: 'org1' },
        },
        result: { data: sampleMembersData },
      },
      {
        request: {
          query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleEventsData },
      },
    ];

    // Render component in edit mode without changing the assignee
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('submitBtn')).toBeInTheDocument();
    });

    // Submit form without changing assignee
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    // Should show warning about no changes
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('noneUpdated');
    });
  });
  // Testing null/undefined handling in Autocomplete onChange
  it('handles null assignee selection correctly', async () => {
    // Create a mock for the update mutation with empty assigneeId
    const updateEmptyAssigneeMock: MockedResponse = {
      request: {
        query: UPDATE_ACTION_ITEM_MUTATION,
        variables: {
          input: {
            id: '1',
            assigneeId: '',
            isCompleted: false,
          },
        },
      },
      result: {
        data: {
          updateActionItem: {
            ...sampleActionItem,
            assigneeId: '',
          },
        },
      },
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: ACTION_ITEM_CATEGORY_LIST,
          variables: { organizationId: 'org1', where: { is_disabled: false } },
        },
        result: { data: sampleCategoryData },
      },
      {
        request: {
          query: ACTION_ITEM_CATEGORY,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleActionCategoryData },
      },
      {
        request: {
          query: USERS_BY_ORGANIZATION_ID,
          variables: { organizationId: 'org1' },
        },
        result: { data: sampleUsersData },
      },
      {
        request: {
          query: EVENT_VOLUNTEER_LIST,
          variables: { where: { eventId: 'event1', hasAccepted: true } },
        },
        result: { data: sampleVolunteersData },
      },
      {
        request: {
          query: MEMBERS_LIST,
          variables: { id: 'org1' },
        },
        result: { data: sampleMembersData },
      },
      {
        request: {
          query: POSTGRES_EVENTS_BY_ORGANIZATION_ID,
          variables: { input: { organizationId: 'org1' } },
        },
        result: { data: sampleEventsData },
      },
      updateEmptyAssigneeMock,
    ];

    // Render component
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ItemModal
            isOpen={true}
            hide={hideMock}
            orgId="org1"
            eventId="event1"
            actionItem={sampleActionItem}
            editMode={true}
            actionItemsRefetch={refetchMock}
          />
        </LocalizationProvider>
      </MockedProvider>,
    );

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId('memberSelect')).toBeInTheDocument();
    });

    // Find and clear the assignee field
    const assigneeField = screen.getByTestId('memberSelect');
    const clearButton = within(assigneeField).getByTitle('Clear');
    fireEvent.click(clearButton);

    // Submit form
    const submitBtn = screen.getByTestId('submitBtn');
    fireEvent.click(submitBtn);

    // Verify that the mutation was called and success toast was shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('successfulUpdation');
    });
  });
});

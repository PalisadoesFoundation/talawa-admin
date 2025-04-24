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

async function pickFirstOption(testId: string) {
  const combo = within(await screen.findByTestId(testId)).getByRole('combobox');
  fireEvent.keyDown(combo, { key: 'ArrowDown' }); // highlight first item
  fireEvent.keyDown(combo, { key: 'Enter' }); // choose it
}

/* Fix system date so create-mutation variables are predictable */
beforeAll(() => vi.setSystemTime(new Date('2025-04-25T00:00:00Z')));
afterAll(() => vi.useRealTimers());

const createItemInput = {
  categoryId: 'cat1',
  assigneeId: 'user1',
  preCompletionNotes: '',
  organizationId: 'org1',
  eventId: 'ev1',
  assignedAt: '2025-04-25',
  allottedHours: null,
};

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
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { eventId: 'ev1', hasAccepted: true } },
    },
    result: { data: { getEventVolunteers: [] } },
  },
  {
    request: { query: MEMBERS_LIST, variables: { id: 'org1' } },
    result: { data: { organizations: [{ members: [] }] } },
  },
];

/* An “already-filled” item to verify useEffect pre-populates fields  */
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

/* Existing (editable) action item */
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

/* Helpers */
const hideMock = vi.fn();
const refetchMock = vi.fn();
beforeEach(() => {
  hideMock.mockReset();
  refetchMock.mockReset();
  toast.success = vi.fn();
  toast.warning = vi.fn();
  toast.error = vi.fn();
});

/* Render helper */
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

/* ────────────────────────────────────────────────────── */
/* 🧪  Tests                                              */
/* ────────────────────────────────────────────────────── */
describe('ItemModal component', () => {
  // it('renders create mode & submits new item', async () => {
  //   renderItemModal(
  //     <ItemModal
  //       isOpen
  //       hide={hideMock}
  //       orgId="org1"
  //       eventId="ev1"
  //       actionItem={null}
  //       editMode={false}
  //       actionItemsRefetch={refetchMock}
  //     />,
  //     [createMutationMock],
  //   );

  //   /* pick category */
  //   const catInput = within(await screen.findByTestId('eventSelect')).getByRole('combobox');
  //   fireEvent.change(catInput, { target: { value: 'Category 1' } });
  //   fireEvent.keyDown(catInput, { key: 'ArrowDown' });
  //   fireEvent.keyDown(catInput, { key: 'Enter' });

  //   /* pick assignee */
  //   const assigneeInput = within(await screen.findByTestId('memberSelect')).getByRole(
  //     'combobox',
  //   );
  //   fireEvent.change(assigneeInput, { target: { value: 'Assignee User' } });
  //   fireEvent.keyDown(assigneeInput, { key: 'ArrowDown' });
  //   fireEvent.keyDown(assigneeInput, { key: 'Enter' });

  //   fireEvent.click(screen.getByTestId('submitBtn'));

  //   await waitFor(() => expect(toast.success).toHaveBeenCalledWith('successfulCreation'));
  //   expect(hideMock).toHaveBeenCalled();
  //   expect(refetchMock).toHaveBeenCalled();
  // });

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
});

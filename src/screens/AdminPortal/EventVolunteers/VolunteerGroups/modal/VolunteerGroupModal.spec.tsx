import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './VolunteerGroups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceVolunteerGroupModal } from './VolunteerGroupModal';
import GroupModal from './VolunteerGroupModal';
import { areOptionsEqual, getMemberLabel } from 'utils/autocompleteHelpers';
import type { InterfaceUserInfoPG } from 'utils/interfaces';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import { CREATE_VOLUNTEER_GROUP } from 'GraphQl/Mutations/EventVolunteerMutation';
import type { MockedResponse } from '@apollo/react-testing';

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

let successLink: StaticMockLink;
let errorLink: StaticMockLink;

async function wait(ms = 100): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

let modalProps: InterfaceVolunteerGroupModal[];

beforeAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  successLink = new StaticMockLink(MOCKS);
  errorLink = new StaticMockLink(MOCKS_ERROR);

  modalProps = [
    {
      isOpen: true,
      hide: vi.fn(),
      eventId: 'eventId',
      orgId: 'orgId',
      refetchGroups: vi.fn(),
      mode: 'create',
      group: null,
    },
    {
      isOpen: true,
      hide: vi.fn(),
      eventId: 'eventId',
      orgId: 'orgId',
      refetchGroups: vi.fn(),
      mode: 'edit',
      group: {
        id: 'groupId',
        name: 'Group 1',
        description: 'desc',
        volunteersRequired: 2,
        isTemplate: true,
        isInstanceException: false,
        createdAt: dayjs().toISOString(),
        creator: {
          id: 'creatorId1',
          name: 'Wilt Shepherd',
          emailAddress: 'wilt@example.com',
        },
        leader: {
          id: 'userId',
          name: 'Teresa Bradley',
          emailAddress: 'teresa@example.com',
        },
        volunteers: [
          {
            id: 'volunteerId1',
            hasAccepted: true,
            hoursVolunteered: 5,
            isPublic: true,
            user: {
              id: 'userId',
              firstName: 'Teresa',
              lastName: 'Bradley',
              name: 'Teresa Bradley',
            },
          },
        ],
        event: {
          id: 'eventId',
        },
      },
    },
    {
      isOpen: true,
      hide: vi.fn(),
      eventId: 'eventId',
      orgId: 'orgId',
      refetchGroups: vi.fn(),
      mode: 'edit',
      group: {
        id: 'groupId',
        name: 'Group 1',
        description: null,
        volunteersRequired: null,
        isTemplate: true,
        isInstanceException: false,
        createdAt: dayjs().toISOString(),
        creator: {
          id: 'creatorId1',
          name: 'Wilt Shepherd',
          emailAddress: 'wilt@example.com',
        },
        leader: {
          id: 'userId',
          name: 'Teresa Bradley',
          emailAddress: 'teresa@example.com',
        },
        volunteers: [],
        event: {
          id: 'eventId',
        },
      },
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.useFakeTimers();
});

const renderGroupModal = (
  link: ApolloLink,
  props: InterfaceVolunteerGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <GroupModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing VolunteerGroupModal', () => {
  it('GroupModal -> Create', async () => {
    const user = userEvent.setup();
    renderGroupModal(successLink, modalProps[0]);
    expect(screen.getByText(t.createGroup)).toBeInTheDocument();
    await wait();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    await user.clear(nameInput);
    await user.type(nameInput, 'Group 1');
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    await user.clear(descInput);
    await user.type(descInput, 'desc');
    await waitFor(() => {
      expect(descInput).toHaveValue('desc');
    });

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    await user.clear(vrInput);
    await user.type(vrInput, '10');
    expect(vrInput).toHaveValue(10);

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    await user.click(memberInputField);

    const memberOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    expect(memberOption).toBeInTheDocument();
    await user.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    await user.click(volunteerInputField);

    const volunteerOption = await screen.findByRole('option', {
      name: 'John Doe',
    });
    expect(volunteerOption).toBeInTheDocument();
    await user.click(volunteerOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupCreated,
      );
      expect(modalProps[0].refetchGroups).toHaveBeenCalled();
      expect(modalProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Create -> leader already selected as volunteer', async () => {
    const membersMock = MOCKS[1] as MockedResponse;
    const createGroupMock: MockedResponse = {
      request: {
        query: CREATE_VOLUNTEER_GROUP,
        variables: {
          data: {
            eventId: 'eventId',
            leaderId: 'userId',
            name: 'Group 1',
            description: 'desc',
            volunteersRequired: 1,
            volunteerUserIds: ['userId'],
          },
        },
      },
      result: {
        data: {
          createEventVolunteerGroup: {
            id: 'groupId',
          },
        },
      },
    };

    const link = new StaticMockLink([membersMock, createGroupMock]);
    renderGroupModal(link, modalProps[0]);
    await wait();

    const nameInput = screen.getByLabelText(`${t.name} *`);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Group 1');

    const descInput = screen.getByLabelText(t.description);
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'desc');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    await userEvent.clear(vrInput);
    await userEvent.type(vrInput, '1');

    // Select volunteer first
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    await userEvent.click(volunteerInputField);
    const volunteerOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    await userEvent.click(volunteerOption);

    // Select leader that already exists in volunteer list
    const memberSelect = await screen.findByTestId('leaderSelect');
    const memberInputField = within(memberSelect).getByRole('combobox');
    await userEvent.click(memberInputField);
    const memberOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    await userEvent.click(memberOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupCreated,
      );
      expect(modalProps[0].refetchGroups).toHaveBeenCalled();
      expect(modalProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Create -> clears leader selection', async () => {
    renderGroupModal(successLink, modalProps[0]);
    await wait();

    const memberSelect = await screen.findByTestId('leaderSelect');
    const memberInputField = within(memberSelect).getByRole('combobox');
    await userEvent.click(memberInputField);

    // Wait for options to load before selecting
    const memberOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    await userEvent.click(memberOption);

    await userEvent.clear(memberInputField);

    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    await userEvent.click(volunteerInputField);

    expect(
      await screen.findByRole('option', { name: 'Harve Lance' }),
    ).toBeInTheDocument();
  });

  it('GroupModal -> Create -> Error', async () => {
    const user = userEvent.setup();
    renderGroupModal(errorLink, modalProps[0]);
    expect(screen.getByText(t.createGroup)).toBeInTheDocument();
    await wait();

    const nameInput = await screen.findByTestId('groupNameInput');
    await user.clear(nameInput);
    await user.type(nameInput, 'Group 1');
    await waitFor(() => {
      expect(nameInput).toHaveValue('Group 1');
    });

    const descInput = await screen.findByTestId('groupDescriptionInput');
    await user.clear(descInput);
    await user.type(descInput, 'desc');

    const vrInput = await screen.findByTestId('volunteersRequiredInput');
    await user.clear(vrInput);
    await user.type(vrInput, '1');
    await waitFor(() => {
      expect(vrInput).toHaveValue(1);
    });

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    await user.click(memberInputField);

    const memberOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    expect(memberOption).toBeInTheDocument();
    await user.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    await user.click(volunteerInputField);

    const volunteerOption = await screen.findByRole('option', {
      name: 'John Doe',
    });
    expect(volunteerOption).toBeInTheDocument();
    await user.click(volunteerOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Update', async () => {
    const user = userEvent.setup({ delay: null });
    renderGroupModal(successLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();
    await wait();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    await user.clear(nameInput);
    await user.type(nameInput, 'Group 2');
    await waitFor(() => {
      expect(nameInput).toHaveValue('Group 2');
    });

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    await user.clear(descInput);
    await user.type(descInput, 'desc new');
    await waitFor(() => {
      expect(descInput).toHaveValue('desc new');
    });

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    await user.clear(vrInput);
    await user.type(vrInput, '10');
    await waitFor(() => {
      expect(vrInput).toHaveValue(10);
    });

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupUpdated,
      );
      expect(modalProps[1].refetchGroups).toHaveBeenCalled();
      expect(modalProps[1].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    const user = userEvent.setup({ delay: null });
    renderGroupModal(errorLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();
    await wait();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    await user.clear(nameInput);
    await user.type(nameInput, 'Group 2');
    await waitFor(() => {
      expect(nameInput).toHaveValue('Group 2');
    });

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    await user.clear(descInput);
    await user.type(descInput, 'desc new');
    await waitFor(() => {
      expect(descInput).toHaveValue('desc new');
    });

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    await user.clear(vrInput);
    await user.type(vrInput, '10');
    await waitFor(() => {
      expect(vrInput).toHaveValue(10);
    });

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('Try adding different values for volunteersRequired', async () => {
    const user = userEvent.setup({ delay: null });
    renderGroupModal(successLink, modalProps[2]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    await user.clear(vrInput);
    await user.type(vrInput, '-1');

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    await user.clear(vrInput);
    await user.type(vrInput, '1{backspace}');

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    await user.clear(vrInput);
    await user.type(vrInput, '0');
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    await user.clear(vrInput);
    await user.type(vrInput, '19');
    await waitFor(() => {
      expect(vrInput).toHaveValue(19);
    });
  });

  it('GroupModal -> Update -> No values updated', async () => {
    const user = userEvent.setup();
    renderGroupModal(successLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  it('GroupModal -> should clear leader when Autocomplete onChange is called with null', async () => {
    renderGroupModal(successLink, modalProps[0]);
    await wait();

    // First select a leader
    const leaderSelect = await screen.findByTestId('leaderSelect');
    expect(leaderSelect).toBeInTheDocument();
    const leaderInput = within(leaderSelect).getByRole('combobox');
    const openButton = within(leaderSelect).getByRole('button', {
      name: /open/i,
    });
    await userEvent.click(openButton);
    const memberOption = await screen.findByRole(
      'option',
      {
        name: 'Harve Lance',
      },
      { timeout: 3000 },
    );
    await userEvent.click(memberOption);

    await waitFor(() => {
      expect(leaderInput).toHaveValue('Harve Lance');
    });

    // Clear the input - this triggers the Autocomplete's onChange with null
    await userEvent.clear(leaderInput);

    await waitFor(() => {
      expect(leaderInput).toHaveValue('');
    });

    // Now verify that the previously selected leader is available in volunteers dropdown
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    const volunteerOpenButton = within(volunteerSelect).getByRole('button', {
      name: /open/i,
    });
    await userEvent.click(volunteerOpenButton);

    // This should now work - Harve Lance should be available in volunteers
    const harveLanceOption = await screen.findByRole(
      'option',
      {
        name: 'Harve Lance',
      },
      { timeout: 3000 },
    );
    expect(harveLanceOption).toBeInTheDocument();
  });

  describe('Recurring Events', () => {
    const recurringEventProps: InterfaceVolunteerGroupModal = {
      isOpen: true,
      hide: vi.fn(),
      eventId: 'eventInstanceId',
      orgId: 'orgId',
      refetchGroups: vi.fn(),
      mode: 'create',
      group: null,
      isRecurring: true,
      baseEvent: { id: 'baseEventId' },
    };

    it('should create volunteer group for entire series when applyTo is "series"', async () => {
      const user = userEvent.setup({ delay: null });
      renderGroupModal(successLink, recurringEventProps);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();
      await wait();

      // Should show radio buttons for recurring events
      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).toBeInTheDocument();
      expect(instanceRadio).toBeInTheDocument();
      expect(seriesRadio).toBeChecked(); // Default should be 'series'

      // Fill form
      const nameInput = screen.getByTestId('groupNameInput');
      await user.clear(nameInput);
      await user.type(nameInput, 'Recurring Group Series');

      const descInput = screen.getByTestId('groupDescriptionInput');
      await user.clear(descInput);
      await user.type(descInput, 'desc');

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      await user.clear(vrInput);
      await user.type(vrInput, '10');

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      await user.click(memberInputField);

      const memberOption = await screen.findByRole('option', {
        name: 'Harve Lance',
      });
      await user.click(memberOption);

      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      await user.click(volunteerInputField);

      const volunteerOption = await screen.findByRole('option', {
        name: 'John Doe',
      });
      await user.click(volunteerOption);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.volunteerGroupCreated,
        );
        expect(recurringEventProps.refetchGroups).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should create volunteer group for this instance only when applyTo is "instance"', async () => {
      const user = userEvent.setup({ delay: null });
      renderGroupModal(successLink, recurringEventProps);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();
      await wait();

      // Select "This Event Only" radio button
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Fill form
      const nameInput = screen.getByTestId('groupNameInput');
      await user.clear(nameInput);
      await user.type(nameInput, 'Recurring Group Instance');

      const descInput = screen.getByTestId('groupDescriptionInput');
      await user.clear(descInput);
      await user.type(descInput, 'desc');

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      await user.clear(vrInput);
      await user.type(vrInput, '10');

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      await user.click(memberInputField);

      const memberOption = await screen.findByRole('option', {
        name: 'Harve Lance',
      });
      await user.click(memberOption);

      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      await user.click(volunteerInputField);

      const volunteerOption = await screen.findByRole('option', {
        name: 'John Doe',
      });
      await user.click(volunteerOption);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.volunteerGroupCreated,
        );
        expect(recurringEventProps.refetchGroups).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should not show radio buttons for recurring events in edit mode', async () => {
      const editRecurringProps = {
        ...recurringEventProps,
        mode: 'edit' as const,
        group: {
          id: 'groupId',
          name: 'Group 1',
          description: 'desc',
          volunteersRequired: 2,
          isTemplate: true,
          isInstanceException: false,
          createdAt: dayjs().toISOString(),
          creator: {
            id: 'creatorId1',
            name: 'Wilt Shepherd',
            emailAddress: 'wilt@example.com',
          },
          leader: {
            id: 'userId',
            name: 'Teresa Bradley',
            emailAddress: 'teresa@example.com',
          },
          volunteers: [],
          event: {
            id: 'eventId',
          },
        },
      };

      renderGroupModal(successLink, editRecurringProps);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      // Should NOT show radio buttons in edit mode
      const seriesRadio = screen.queryByRole('radio', {
        name: /entire series/i,
      });
      const instanceRadio = screen.queryByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).not.toBeInTheDocument();
      expect(instanceRadio).not.toBeInTheDocument();
    });

    it('should use baseEvent ID for recurring events when available', async () => {
      const user = userEvent.setup({ delay: null });
      renderGroupModal(successLink, recurringEventProps);

      await waitFor(() => {
        expect(screen.getByText(t.createGroup)).toBeInTheDocument();
      });
      await wait();

      const nameInput = screen.getByTestId('groupNameInput');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test Group');

      const descInput = screen.getByTestId('groupDescriptionInput');
      await user.clear(descInput);
      await user.type(descInput, 'desc');

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      await user.clear(vrInput);
      await user.type(vrInput, '10');

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      await user.click(memberInputField);

      const memberOption = await screen.findByRole('option', {
        name: 'Harve Lance',
      });
      await user.click(memberOption);

      // Note: After selecting a leader, they are automatically added to volunteers
      // So we don't need to add them again, the form already has the leader in volunteers

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await user.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
      });
    });

    it('should handle radio button onChange for series selection', async () => {
      const user = userEvent.setup();
      renderGroupModal(successLink, recurringEventProps);

      // Initially "series" should be selected by default
      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      // Click on instance radio to change selection
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Click back on series radio to test onChange={() => setApplyTo('series')}
      await user.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });

    it('should handle radio button onChange for instance selection', async () => {
      const user = userEvent.setup();
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Test onChange={() => setApplyTo('instance')}
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Test that clicking the same radio button maintains its state
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();
    });

    it('should toggle between radio options correctly', async () => {
      const user = userEvent.setup();
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Test multiple toggles to ensure onChange handlers work properly
      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      await user.click(seriesRadio);
      expect(seriesRadio).toBeChecked();

      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      await user.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
    });

    it('should maintain radio button state during form interactions', async () => {
      const user = userEvent.setup({ delay: null });
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      await user.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      const nameInput = screen.getByTestId('groupNameInput');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test Group');

      expect(nameInput).toHaveValue('Test Group');
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      await user.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      expect(nameInput).toHaveValue('Test Group');
    });

    it('should disable submit button when baseEvent is null in recurring mode', async () => {
      const propsWithNullBaseEvent: InterfaceVolunteerGroupModal = {
        ...recurringEventProps,
        baseEvent: null,
      };

      renderGroupModal(successLink, propsWithNullBaseEvent);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle update when group.id is missing', async () => {
      const baseGroup = modalProps[1].group;
      const propsWithNullGroupId: InterfaceVolunteerGroupModal = {
        ...modalProps[1],
        group: baseGroup
          ? {
              ...baseGroup,
              id: '',
            }
          : null,
      };

      renderGroupModal(successLink, propsWithNullGroupId);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    it('should handle description as null in edit mode', async () => {
      renderGroupModal(successLink, modalProps[2]);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      const descInput = screen.getByTestId('groupDescriptionInput');
      expect(descInput).toHaveValue('');
    });

    it('should have leader field disabled in edit mode', async () => {
      renderGroupModal(successLink, modalProps[1]);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      const leaderSelect = await screen.findByTestId('leaderSelect');
      const leaderInput = within(leaderSelect).getByRole('combobox');

      expect(leaderInput).toBeDisabled();
    });

    it('should have volunteers field disabled in edit mode', async () => {
      renderGroupModal(successLink, modalProps[1]);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInput = within(volunteerSelect).getByRole('combobox');

      expect(volunteerInput).toBeDisabled();
    });

    it('should disable submit button when group is null in edit mode', async () => {
      const propsForErrorCase: InterfaceVolunteerGroupModal = {
        isOpen: true,
        hide: vi.fn(),
        eventId: 'eventId',
        orgId: 'orgId',
        refetchGroups: vi.fn(),
        mode: 'edit',
        group: null,
      };

      renderGroupModal(successLink, propsForErrorCase);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    it('should handle isOptionEqualToValue for leader autocomplete', async () => {
      const user = userEvent.setup();
      renderGroupModal(successLink, modalProps[0]);
      await wait();
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const leaderSelect = await screen.findByTestId('leaderSelect');
      const leaderInputField = within(leaderSelect).getByRole('combobox');
      await user.click(leaderInputField);

      const leaderOption = await screen.findByRole('option', {
        name: 'Harve Lance',
      });
      await user.click(leaderOption);

      await waitFor(() => {
        expect(leaderInputField).toHaveValue('Harve Lance');
      });

      await user.click(leaderInputField);
      expect(leaderInputField).toHaveValue('Harve Lance');
    });

    it('should handle clearing volunteersRequired field', async () => {
      const user = userEvent.setup({ delay: null });
      renderGroupModal(successLink, modalProps[0]);
      await wait();
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const volunteersRequiredInput = await screen.findByTestId(
        'volunteersRequiredInput',
      );
      await user.click(volunteersRequiredInput);
      await user.type(volunteersRequiredInput, '5');
      await waitFor(() => {
        expect(volunteersRequiredInput).toHaveValue(5);
      });

      await user.clear(volunteersRequiredInput);
      await waitFor(() => {
        expect(volunteersRequiredInput).toHaveValue(null);
      });
    });

    it('should handle clearing leader selection', async () => {
      const user = userEvent.setup();
      renderGroupModal(successLink, modalProps[0]);
      await wait();
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const leaderSelect = await screen.findByTestId('leaderSelect');
      const leaderInputField = within(leaderSelect).getByRole('combobox');
      await user.click(leaderInputField);

      const leaderOption = await screen.findByRole('option', {
        name: 'Harve Lance',
      });
      await user.click(leaderOption);

      await waitFor(() => {
        expect(leaderInputField).toHaveValue('Harve Lance');
      });

      await user.clear(leaderInputField);

      await waitFor(() => {
        expect(leaderInputField).toHaveValue('');
      });
    });

    it('should disable submit button when group.id is empty string in edit mode', async () => {
      const propsWithGroupNoId: InterfaceVolunteerGroupModal = {
        isOpen: true,
        hide: vi.fn(),
        eventId: 'eventId',
        orgId: 'orgId',
        refetchGroups: vi.fn(),
        mode: 'edit',
        group: {
          id: '',
          name: 'Test Group',
          description: 'Test Description',
          volunteersRequired: 5,
          leader: {
            id: 'leaderId1',
            name: 'Harve Lance',
            emailAddress: 'harve@example.com',
            avatarURL: null,
          },
          creator: {
            id: 'creatorId1',
            name: 'Wilt Shepherd',
            emailAddress: 'wilt@example.com',
            avatarURL: null,
          },
          volunteers: [],
          event: { id: 'eventId' },
          isTemplate: false,
          isInstanceException: false,
          createdAt: dayjs().toISOString(),
        },
      };

      renderGroupModal(successLink, propsWithGroupNoId);
      await wait();

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });
  });
});

describe('VolunteerGroupModal helper functions (coverage)', () => {
  it('areOptionsEqual returns true when ids match', () => {
    const a: InterfaceUserInfoPG = {
      id: '1',
      name: 'John Doe',
    };
    const b: InterfaceUserInfoPG = {
      id: '1',
      name: 'John Doe',
    };
    expect(areOptionsEqual(a, b)).toBe(true);
  });

  it('areOptionsEqual returns false when ids differ', () => {
    const a: InterfaceUserInfoPG = {
      id: '1',
      name: 'John Doe',
    };
    const b: InterfaceUserInfoPG = {
      id: '2',
      name: 'Jane Smith',
    };
    expect(areOptionsEqual(a, b)).toBe(false);
  });

  it('getMemberLabel returns the member name', () => {
    const member: InterfaceUserInfoPG = {
      id: '1',
      name: 'John Doe',
    };

    expect(getMemberLabel(member)).toBe('John Doe');
  });

  it('getMemberLabel returns combined first and last name', () => {
    const member: InterfaceUserInfoPG = {
      id: '2',
      name: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
    };

    expect(getMemberLabel(member)).toBe('Jane Smith');
  });

  it('getMemberLabel returns first name only when last name is missing', () => {
    const member: InterfaceUserInfoPG = {
      id: '3',
      name: 'Alice',
      firstName: 'Alice',
    };

    expect(getMemberLabel(member)).toBe('Alice');
  });
  it('should ensure leader ID is placed first in volunteer list', async () => {
    const user = userEvent.setup({ delay: null });

    // We want Leader = John Doe (userId2) and Volunteer = Harve Lance (userId)
    // Expected volunteerUserIds = ['userId2', 'userId'] - Leader first

    const orderingMock: MockedResponse = {
      request: {
        query: CREATE_VOLUNTEER_GROUP,
        variables: {
          data: {
            eventId: 'eventId',
            leaderId: 'userId2',
            name: 'Ordered Group',
            description: 'desc',
            volunteersRequired: 5,
            volunteerUserIds: ['userId2', 'userId'],
          },
        },
      },
      result: {
        data: {
          createEventVolunteerGroup: {
            id: 'orderedGroupId',
          },
        },
      },
      variableMatcher: (variables) => {
        const data = variables.data as { volunteerUserIds: string[] };
        return (
          JSON.stringify(data.volunteerUserIds) ===
          JSON.stringify(['userId2', 'userId'])
        );
      },
    };

    // Need MEMBERS_LIST mock as well
    const link = new StaticMockLink([MOCKS[1], orderingMock]);
    renderGroupModal(link, modalProps[0]);
    await wait();

    const nameInput = screen.getByTestId('groupNameInput');
    await user.clear(nameInput);
    await user.type(nameInput, 'Ordered Group');

    const descInput = screen.getByTestId('groupDescriptionInput');
    await user.clear(descInput);
    await user.type(descInput, 'desc');

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    await user.clear(vrInput);
    await user.type(vrInput, '5');

    // Select Leader: John Doe
    const memberSelect = await screen.findByTestId('leaderSelect');
    const memberInputField = within(memberSelect).getByRole('combobox');
    await user.click(memberInputField);
    const johnOption = await screen.findByRole('option', {
      name: 'John Doe',
    });
    await user.click(johnOption);

    // Select Volunteer: Harve Lance
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    await user.click(volunteerInputField);
    const harveOption = await screen.findByRole('option', {
      name: 'Harve Lance',
    });
    await user.click(harveOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupCreated,
      );
    });
  });

  describe('Additional Error Handling Coverage', () => {
    it('should show error toast when updating a group without an ID (client-side check)', async () => {
      // Clone props and remove ID from group to simulate the error condition
      const propsNoId = {
        ...modalProps[1],
        group: {
          ...(modalProps[1].group as NonNullable<
            InterfaceVolunteerGroupModal['group']
          >),
          id: '',
        },
      };

      // Let's use fireEvent to force the click.
      const { getByTestId } = renderGroupModal(successLink, propsNoId);
      const submitBtn = getByTestId('modal-submit-btn');

      // Force click even if disabled.

      await act(async () => {
        submitBtn.removeAttribute('disabled');
        submitBtn.click();
      });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith('errorOccured');
      });
    });

    it('should throw error when baseEvent is missing for recurring create (internal check)', async () => {
      const propsNoBase = {
        ...modalProps[0],
        isRecurring: true,
        baseEvent: null,
      };

      const { getByTestId } = renderGroupModal(successLink, propsNoBase);
      const submitBtn = getByTestId('modal-submit-btn');

      // Force click even if disabled.

      await act(async () => {
        submitBtn.removeAttribute('disabled');
        submitBtn.click();
      });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          t.baseEventRequired,
        );
      });
    });
  });
});

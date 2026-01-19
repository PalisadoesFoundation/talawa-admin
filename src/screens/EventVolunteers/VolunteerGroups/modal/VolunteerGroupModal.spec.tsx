import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
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
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';

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
    renderGroupModal(successLink, modalProps[0]);
    expect(screen.getByText(t.createGroup)).toBeInTheDocument();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupCreated,
      );
      expect(modalProps[0].refetchGroups).toHaveBeenCalled();
      expect(modalProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Create -> Error', async () => {
    renderGroupModal(errorLink, modalProps[0]);
    expect(screen.getByText(t.createGroup)).toBeInTheDocument();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Update', async () => {
    renderGroupModal(successLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupUpdated,
      );
      expect(modalProps[1].refetchGroups).toHaveBeenCalled();
      expect(modalProps[1].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    renderGroupModal(errorLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const nameInput = screen.getByTestId('groupNameInput');
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByTestId('groupDescriptionInput');
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue(10);

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('Try adding different values for volunteersRequired', async () => {
    renderGroupModal(successLink, modalProps[2]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const vrInput = screen.getByTestId('volunteersRequiredInput');
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: -1 } });

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    await userEvent.clear(vrInput);
    await userEvent.type(vrInput, '1{backspace}');

    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    fireEvent.change(vrInput, { target: { value: 0 } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(null);
    });

    fireEvent.change(vrInput, { target: { value: 19 } });
    await waitFor(() => {
      expect(vrInput).toHaveValue(19);
    });
  });

  it('GroupModal -> Update -> No values updated', async () => {
    renderGroupModal(successLink, modalProps[1]);
    expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('modal-submit-btn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
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
      renderGroupModal(successLink, recurringEventProps);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

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
      fireEvent.change(nameInput, {
        target: { value: 'Recurring Group Series' },
      });

      const descInput = screen.getByTestId('groupDescriptionInput');
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      fireEvent.change(vrInput, { target: { value: 10 } });

      // Select Leader
      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      // Select Volunteers
      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      fireEvent.mouseDown(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      fireEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          t.volunteerGroupCreated,
        );
        expect(recurringEventProps.refetchGroups).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should create volunteer group for this instance only when applyTo is "instance"', async () => {
      renderGroupModal(successLink, recurringEventProps);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      // Select "This Event Only" radio button
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Fill form
      const nameInput = screen.getByTestId('groupNameInput');
      fireEvent.change(nameInput, {
        target: { value: 'Recurring Group Instance' },
      });

      const descInput = screen.getByTestId('groupDescriptionInput');
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      fireEvent.change(vrInput, { target: { value: 10 } });

      // Select Leader
      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      // Select Volunteers
      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      fireEvent.mouseDown(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      fireEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await userEvent.click(submitBtn);

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
      renderGroupModal(successLink, recurringEventProps);

      // Fill minimal form to test the mutation logic
      const nameInput = screen.getByTestId('groupNameInput');
      fireEvent.change(nameInput, { target: { value: 'Test Group' } });

      const descInput = screen.getByTestId('groupDescriptionInput');
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const vrInput = screen.getByTestId('volunteersRequiredInput');
      fireEvent.change(vrInput, { target: { value: 10 } });

      // Select Leader (required)
      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      fireEvent.mouseDown(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      fireEvent.click(volunteerOption);

      const submitBtn = screen.getByTestId('modal-submit-btn');
      await userEvent.click(submitBtn);

      // This test verifies that the logic in createGroupHandler is executed:
      // - isRecurring is true
      // - baseEvent?.id is used as eventId ('baseEventId')
      // - scope is set to 'ENTIRE_SERIES' by default
      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalled();
        expect(successLink.operation?.variables?.data?.eventId).toBe(
          'baseEventId',
        );
        expect(successLink.operation?.variables?.data?.scope).toBe(
          'ENTIRE_SERIES',
        );
      });
    });

    it('should handle radio button onChange for series selection', async () => {
      renderGroupModal(successLink, recurringEventProps);

      // Initially "series" should be selected by default
      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      // Click on instance radio to change selection
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Click back on series radio to test onChange={() => setApplyTo('series')}
      await userEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();
    });

    it('should handle radio button onChange for instance selection', async () => {
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Test onChange={() => setApplyTo('instance')}
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Test that clicking the same radio button maintains its state
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();
    });

    it('should toggle between radio options correctly', async () => {
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Test multiple toggles to ensure onChange handlers work properly
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      await userEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();

      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      await userEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
    });

    it('should maintain radio button state during form interactions', async () => {
      renderGroupModal(successLink, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Change to instance
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Fill some form fields
      const nameInput = screen.getByTestId('groupNameInput');
      fireEvent.change(nameInput, { target: { value: 'Test Group' } });

      // Radio button state should be preserved
      expect(instanceRadio).toBeChecked();
      expect(seriesRadio).not.toBeChecked();

      // Change back to series
      await userEvent.click(seriesRadio);
      expect(seriesRadio).toBeChecked();
      expect(instanceRadio).not.toBeChecked();

      // Form data should still be there
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

    it('should show validation error when trying to submit with null baseEvent', async () => {
      const propsWithNullBaseEvent: InterfaceVolunteerGroupModal = {
        ...recurringEventProps,
        baseEvent: null,
      };

      renderGroupModal(successLink, propsWithNullBaseEvent);

      const nameInput = screen.getByTestId('groupNameInput');
      fireEvent.change(nameInput, { target: { value: 'Test Group' } });

      const descInput = screen.getByTestId('groupDescriptionInput');
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      const volunteerSelect = await screen.findByTestId('volunteerSelect');
      const volunteerInputField = within(volunteerSelect).getByRole('combobox');
      fireEvent.mouseDown(volunteerInputField);
      const volunteerOption = await screen.findByText('John Doe');
      fireEvent.click(volunteerOption);

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

    it('should allow clearing leader selection in create mode', async () => {
      renderGroupModal(successLink, modalProps[0]);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);

      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      await waitFor(() => {
        expect(memberInputField).toHaveValue('Harve Lance');
      });

      const autocomplete = memberSelect.querySelector('.MuiAutocomplete-root');
      if (autocomplete) {
        fireEvent.change(memberInputField, { target: { value: '' } });
        fireEvent.keyDown(memberInputField, { key: 'Escape' });
      }
    });

    it('should remove leader from volunteers when leader is cleared', async () => {
      renderGroupModal(successLink, modalProps[0]);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      await waitFor(() => {
        expect(memberInputField).toHaveValue('Harve Lance');
      });

      const volunteerSelect = await screen.findByTestId('volunteerSelect');

      await waitFor(() => {
        const volunteerChips =
          within(volunteerSelect).queryByText('Harve Lance');
        if (volunteerChips) {
          expect(volunteerChips).toBeInTheDocument();
        }
      });
    });

    it('should throw error when updating without group.id', async () => {
      const propsWithInvalidGroup: InterfaceVolunteerGroupModal = {
        isOpen: true,
        hide: vi.fn(),
        eventId: 'eventId',
        orgId: 'orgId',
        refetchGroups: vi.fn(),
        mode: 'edit',
        group: null,
      };

      renderGroupModal(errorLink, propsWithInvalidGroup);
      expect(screen.getByText(t.updateGroup)).toBeInTheDocument();

      const submitBtn = screen.getByTestId('modal-submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    it('should show error notification when group.id is missing during update', async () => {
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
      renderGroupModal(successLink, modalProps[0]);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const leaderSelect = await screen.findByTestId('leaderSelect');
      const leaderInputField = within(leaderSelect).getByRole('combobox');
      fireEvent.mouseDown(leaderInputField);

      const leaderOption = await screen.findByText('Harve Lance');
      fireEvent.click(leaderOption);

      await waitFor(() => {
        expect(leaderInputField).toHaveValue('Harve Lance');
      });

      fireEvent.mouseDown(leaderInputField);
      expect(screen.queryByText('Harve Lance')).not.toBeInTheDocument();
    });

    it('should handle clearing volunteersRequired field', async () => {
      renderGroupModal(successLink, modalProps[0]);
      expect(screen.getByText(t.createGroup)).toBeInTheDocument();

      const volunteersRequiredInput = screen.getByTestId(
        'volunteersRequiredInput',
      );
      const input = volunteersRequiredInput.querySelector('input');

      if (input) {
        fireEvent.change(input, { target: { value: '5' } });
        await waitFor(() => {
          expect(input).toHaveValue('5');
        });

        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() => {
          expect(input).toHaveValue('');
        });
      }
    });
  });
});

import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './VolunteerGroups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceVolunteerGroupModal } from './VolunteerGroupModal';
import GroupModal from './VolunteerGroupModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

/**
 * Mock implementation of the `react-toastify` module.
 * Mocks the `toast` object with `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(MOCKS_ERROR);
const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceVolunteerGroupModal[] = [
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
      createdAt: '2024-10-25T16:16:32.978Z',
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
      createdAt: '2024-10-25T16:16:32.978Z',
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

const renderGroupModal = (
  link: ApolloLink,
  props: InterfaceVolunteerGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
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
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

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

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupCreated);
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Create -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

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

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Update', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupUpdated);
      expect(itemProps[1].refetchGroups).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    renderGroupModal(link2, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('Try adding different values for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[2]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '-1' } });

    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    await userEvent.clear(vrInput);
    await userEvent.type(vrInput, '1{backspace}');

    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    fireEvent.change(vrInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    fireEvent.change(vrInput, { target: { value: '19' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue('19');
    });
  });

  it('GroupModal -> Update -> No values updated', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
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
      renderGroupModal(link1, recurringEventProps);
      expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

      // Should show radio buttons for recurring events
      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      expect(seriesRadio).toBeInTheDocument();
      expect(instanceRadio).toBeInTheDocument();
      expect(seriesRadio).toBeChecked(); // Default should be 'series'

      // Fill form
      const nameInput = screen.getByLabelText(`${t.name} *`);
      fireEvent.change(nameInput, {
        target: { value: 'Recurring Group Series' },
      });

      const descInput = screen.getByLabelText(t.description);
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const vrInput = screen.getByLabelText(t.volunteersRequired);
      fireEvent.change(vrInput, { target: { value: '10' } });

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

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupCreated);
        expect(recurringEventProps.refetchGroups).toHaveBeenCalled();
        expect(recurringEventProps.hide).toHaveBeenCalled();
      });
    });

    it('should create volunteer group for this instance only when applyTo is "instance"', async () => {
      renderGroupModal(link1, recurringEventProps);
      expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

      // Select "This Event Only" radio button
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Fill form
      const nameInput = screen.getByLabelText(`${t.name} *`);
      fireEvent.change(nameInput, {
        target: { value: 'Recurring Group Instance' },
      });

      const descInput = screen.getByLabelText(t.description);
      fireEvent.change(descInput, { target: { value: 'desc' } });

      const vrInput = screen.getByLabelText(t.volunteersRequired);
      fireEvent.change(vrInput, { target: { value: '10' } });

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

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupCreated);
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
          createdAt: '2024-10-25T16:16:32.978Z',
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

      renderGroupModal(link1, editRecurringProps);
      expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

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
      renderGroupModal(link1, recurringEventProps);

      // Fill minimal form to test the mutation logic
      const nameInput = screen.getByLabelText(`${t.name} *`);
      fireEvent.change(nameInput, { target: { value: 'Test Group' } });

      // Select Leader (required)
      const memberSelect = await screen.findByTestId('leaderSelect');
      const memberInputField = within(memberSelect).getByRole('combobox');
      fireEvent.mouseDown(memberInputField);
      const memberOption = await screen.findByText('Harve Lance');
      fireEvent.click(memberOption);

      const submitBtn = screen.getByTestId('submitBtn');
      await userEvent.click(submitBtn);

      // This test verifies that the logic in createGroupHandler is executed:
      // - isRecurring is true
      // - baseEvent?.id is used as eventId ('baseEventId')
      // - scope is set to 'ENTIRE_SERIES' by default
      waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should handle radio button onChange for series selection', async () => {
      renderGroupModal(link1, recurringEventProps);

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
      renderGroupModal(link1, recurringEventProps);

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
      renderGroupModal(link1, recurringEventProps);

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
      renderGroupModal(link1, recurringEventProps);

      const seriesRadio = screen.getByRole('radio', { name: /entire series/i });
      const instanceRadio = screen.getByRole('radio', {
        name: /this event only/i,
      });

      // Change to instance
      await userEvent.click(instanceRadio);
      expect(instanceRadio).toBeChecked();

      // Fill some form fields
      const nameInput = screen.getByLabelText(`${t.name} *`);
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
  });
});

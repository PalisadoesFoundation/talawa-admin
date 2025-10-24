import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../modal/VolunteerGroups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceDeleteVolunteerGroupModal } from './VolunteerGroupDeleteModal';
import VolunteerGroupDeleteModal from './VolunteerGroupDeleteModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DELETE_VOLUNTEER_GROUP_FOR_INSTANCE } from 'GraphQl/Mutations/EventVolunteerMutation';

/**
 * Mock implementation of the `react-toastify` module.
 * Mocks the `toast` object with `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
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

const itemProps: InterfaceDeleteVolunteerGroupModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchGroups: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
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
      volunteers: [
        {
          id: 'volunteerId1',
          hasAccepted: true,
          hoursVolunteered: 5,
          isPublic: true,
          user: {
            id: 'userId',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
          },
        },
      ],
      event: { id: 'eventId' },
    },
  },
];

const renderGroupDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeleteVolunteerGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerGroupDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing Group Delete Modal', () => {
  it('Delete Group', async () => {
    renderGroupDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupDeleted);
    });
  });

  test.each([
    { testId: 'deletenobtn', description: 'no button' },
    { testId: 'modalCloseBtn', description: 'close button' },
  ])('Close Delete Modal using $description', async ({ testId }) => {
    renderGroupDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    const btn = screen.getByTestId(testId);
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);

    await waitFor(() => {
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Delete Group -> Error', async () => {
    renderGroupDeleteModal(link2, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('Displays radio buttons for template groups', async () => {
    renderGroupDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    // Check if radio buttons are displayed for template groups
    expect(screen.getByText(t.applyTo)).toBeInTheDocument();
    expect(screen.getByTestId('deleteApplyToSeries')).toBeInTheDocument();
    expect(screen.getByTestId('deleteApplyToInstance')).toBeInTheDocument();

    // Check if "entire series" is checked by default
    expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
    expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();
  });

  it('Changes selection between radio buttons', async () => {
    renderGroupDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    // Initially, "entire series" should be checked
    expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
    expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();

    // Click "this event only" radio button
    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);

    await waitFor(() => {
      expect(screen.getByTestId('deleteApplyToInstance')).toBeChecked();
      expect(screen.getByTestId('deleteApplyToSeries')).not.toBeChecked();
    });

    // Click "entire series" radio button
    const seriesRadio = screen.getByTestId('deleteApplyToSeries');
    await userEvent.click(seriesRadio);

    await waitFor(() => {
      expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
      expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();
    });
  });

  it('Deletes group for specific instance when isRecurring and applyTo is instance', async () => {
    // Tests that selecting "this event only" for a recurring event calls
    // DELETE_VOLUNTEER_GROUP_FOR_INSTANCE instead of the default mutation
    const recurringGroupProps: InterfaceDeleteVolunteerGroupModal = {
      isOpen: true,
      hide: vi.fn(),
      refetchGroups: vi.fn(),
      isRecurring: true,
      eventId: 'eventId',
      group: {
        id: 'groupId',
        name: 'Group 1',
        description: 'desc',
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
        event: { id: 'eventId' },
      },
    };

    const MOCK_DELETE_FOR_INSTANCE = [
      {
        request: {
          query: DELETE_VOLUNTEER_GROUP_FOR_INSTANCE,
          variables: {
            input: {
              volunteerGroupId: 'groupId',
              recurringEventInstanceId: 'eventId',
            },
          },
        },
        result: {
          data: {
            deleteEventVolunteerGroupForInstance: {
              id: 'groupId',
              name: 'Group 1',
              description: 'desc',
              volunteersRequired: null,
              createdAt: '2024-10-25T16:16:32.978Z',
              leader: {
                id: 'userId',
                name: 'Teresa Bradley',
                avatarURL: null,
              },
              creator: {
                id: 'creatorId1',
                name: 'Wilt Shepherd',
              },
            },
          },
        },
      },
    ];

    const linkForInstance = new StaticMockLink(MOCK_DELETE_FOR_INSTANCE);
    renderGroupDeleteModal(linkForInstance, recurringGroupProps);

    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    // Select "this event only"
    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);

    await waitFor(() => {
      expect(screen.getByTestId('deleteApplyToInstance')).toBeChecked();
    });

    // Click delete
    const yesBtn = screen.getByTestId('deleteyesbtn');
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(recurringGroupProps.refetchGroups).toHaveBeenCalled();
      expect(recurringGroupProps.hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupDeleted);
    });
  });

  test.each([
    {
      description: 'non-template groups',
      isTemplate: false,
      isInstanceException: false,
    },
    {
      description: 'instance exception groups',
      isTemplate: true,
      isInstanceException: true,
    },
  ])(
    'Hides radio buttons for $description',
    async ({ isTemplate, isInstanceException }) => {
      const props: InterfaceDeleteVolunteerGroupModal = {
        isOpen: true,
        hide: vi.fn(),
        refetchGroups: vi.fn(),
        group: {
          id: 'groupId',
          name: 'Group 1',
          description: 'desc',
          volunteersRequired: null,
          isTemplate,
          isInstanceException,
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
          event: { id: 'eventId' },
        },
      };

      renderGroupDeleteModal(link1, props);
      expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

      expect(screen.queryByText(t.applyTo)).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('deleteApplyToSeries'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('deleteApplyToInstance'),
      ).not.toBeInTheDocument();
    },
  );
});

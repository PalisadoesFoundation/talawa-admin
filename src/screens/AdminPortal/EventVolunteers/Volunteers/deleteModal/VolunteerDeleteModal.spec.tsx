import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from '../Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import type { InterfaceVolunteerDeleteModalProps } from 'types/AdminPortal/VolunteerDeleteModal/interface';
import VolunteerDeleteModal from './VolunteerDeleteModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DELETE_VOLUNTEER_FOR_INSTANCE } from 'GraphQl/Mutations/EventVolunteerMutation';
import dayjs from 'dayjs';

/**
 * Mock implementation of the `NotificationToast` module.
 * Mocks the `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
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

const itemProps: InterfaceVolunteerDeleteModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchVolunteers: vi.fn(),
    volunteer: {
      id: 'volunteerId1',
      hasAccepted: true,
      volunteerStatus: 'accepted',
      hoursVolunteered: 10,
      isPublic: true,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      user: {
        id: 'userId1',
        firstName: 'Teresa',
        lastName: 'Bradley',
        name: 'Teresa Bradley',
        avatarURL: null,
      },
      event: {
        id: 'eventId',
        name: 'Test Event',
      },
      creator: {
        id: 'creatorId',
        firstName: 'Creator',
        lastName: 'User',
        name: 'Creator User',
        avatarURL: null,
      },
      updater: {
        id: 'updaterId',
        firstName: 'Updater',
        lastName: 'Updater',
        name: 'Updater User',
        avatarURL: null,
      },
      groups: [
        {
          id: 'groupId1',
          name: 'group1',
          description: 'Test group',
          volunteers: [{ id: 'volunteerId1' }],
        },
      ],
      isTemplate: true,
      isInstanceException: false,
    },
  },
];

const renderVolunteerDeleteModal = (
  link: ApolloLink,
  props: InterfaceVolunteerDeleteModalProps,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerDeleteModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing Volunteer Delete Modal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Delete Volunteer', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('modal-delete-btn');
    expect(deleteBtn).toBeInTheDocument();
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(itemProps[0].refetchVolunteers).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerRemoved,
      );
    });
  });

  test.each([
    { testId: 'modal-cancel-btn', description: 'cancel button' },
    { testId: 'modalCloseBtn', description: 'close button' },
  ])('Close Delete Modal using $description', async ({ testId }) => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const btn = screen.getByTestId(testId);
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);

    await waitFor(() => {
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Delete Volunteer -> Error', async () => {
    renderVolunteerDeleteModal(link2, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('modal-delete-btn');
    expect(deleteBtn).toBeInTheDocument();
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('Displays radio buttons for template volunteers', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    // Check if radio buttons are displayed for template volunteers
    expect(screen.getByText(t.applyTo)).toBeInTheDocument();
    expect(screen.getByTestId('deleteApplyToSeries')).toBeInTheDocument();
    expect(screen.getByTestId('deleteApplyToInstance')).toBeInTheDocument();

    // Check if "entire series" is checked by default
    expect(screen.getByTestId('deleteApplyToSeries')).toBeChecked();
    expect(screen.getByTestId('deleteApplyToInstance')).not.toBeChecked();
  });

  it('Changes selection between radio buttons', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

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

  it('Deletes volunteer for specific instance when isRecurring and applyTo is instance', async () => {
    const recurringVolunteerProps: InterfaceVolunteerDeleteModalProps = {
      isOpen: true,
      hide: vi.fn(),
      refetchVolunteers: vi.fn(),
      isRecurring: true,
      eventId: 'recurringEventId1',
      volunteer: {
        ...itemProps[0].volunteer,
      },
    };

    const MOCK_DELETE_FOR_INSTANCE = [
      {
        request: {
          query: DELETE_VOLUNTEER_FOR_INSTANCE,
          variables: {
            input: {
              volunteerId: itemProps[0].volunteer.id,
              recurringEventInstanceId: 'recurringEventId1',
            },
          },
        },
        result: {
          data: {
            deleteEventVolunteerForInstance: {
              id: itemProps[0].volunteer.id,
            },
          },
        },
      },
    ];

    const linkForInstance = new StaticMockLink(MOCK_DELETE_FOR_INSTANCE);
    renderVolunteerDeleteModal(linkForInstance, recurringVolunteerProps);

    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    // Select "this event only"
    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);

    await waitFor(() => {
      expect(screen.getByTestId('deleteApplyToInstance')).toBeChecked();
    });

    // Click delete
    const deleteBtn = screen.getByTestId('modal-delete-btn');
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(recurringVolunteerProps.refetchVolunteers).toHaveBeenCalled();
      expect(recurringVolunteerProps.hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerRemoved,
      );
    });
  });

  it('Delete Volunteer for a recurring event instance -> Error', async () => {
    const recurringVolunteerProps: InterfaceVolunteerDeleteModalProps = {
      isOpen: true,
      hide: vi.fn(),
      refetchVolunteers: vi.fn(),
      isRecurring: true,
      eventId: 'recurringEventId1',
      volunteer: {
        ...itemProps[0].volunteer,
      },
    };

    const mockDeleteForInstanceError = [
      {
        request: {
          query: DELETE_VOLUNTEER_FOR_INSTANCE,
          variables: {
            input: {
              volunteerId: recurringVolunteerProps.volunteer.id,
              recurringEventInstanceId: recurringVolunteerProps.eventId,
            },
          },
        },
        error: new Error('Failed to delete volunteer for instance'),
      },
    ];
    const linkInstanceDeleteError = new StaticMockLink(
      mockDeleteForInstanceError,
    );

    renderVolunteerDeleteModal(
      linkInstanceDeleteError,
      recurringVolunteerProps,
    );

    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);

    const deleteBtn = screen.getByTestId('modal-delete-btn');
    await userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to delete volunteer for instance',
      );
    });
  });

  test.each([
    {
      description: 'non-template volunteers',
      isTemplate: false,
      isInstanceException: false,
    },
    {
      description: 'instance exception volunteers',
      isTemplate: true,
      isInstanceException: true,
    },
  ])(
    'Hides radio buttons for $description',
    async ({ isTemplate, isInstanceException }) => {
      const props: InterfaceVolunteerDeleteModalProps = {
        isOpen: true,
        hide: vi.fn(),
        refetchVolunteers: vi.fn(),
        volunteer: {
          ...itemProps[0].volunteer,
          isTemplate,
          isInstanceException,
        },
      };

      renderVolunteerDeleteModal(link1, props);
      expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

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

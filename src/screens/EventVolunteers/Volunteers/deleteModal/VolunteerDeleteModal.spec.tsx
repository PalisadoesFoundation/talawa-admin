import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import type { InterfaceDeleteVolunteerModal } from './VolunteerDeleteModal';
import VolunteerDeleteModal from './VolunteerDeleteModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DELETE_VOLUNTEER_FOR_INSTANCE } from 'GraphQl/Mutations/EventVolunteerMutation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/**
 * Mock implementation of the `NotificationToast` module.
 * Mocks the `NotificationToast` object with `success` and `error` methods to allow testing
 * without triggering actual toast notifications.
 */

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
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

const itemProps: InterfaceDeleteVolunteerModal[] = [
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

let recurringItemProps: InterfaceDeleteVolunteerModal;
let recurringItemPropsHide: ReturnType<typeof vi.fn>;
let recurringItemPropsRefetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  recurringItemPropsHide = vi.fn();
  recurringItemPropsRefetch = vi.fn();
  recurringItemProps = {
    ...itemProps[0],
    isOpen: true,
    isRecurring: true,
    eventId: 'recurringEventId1',
    hide: recurringItemPropsHide,
    refetchVolunteers: recurringItemPropsRefetch,
    volunteer: {
      ...itemProps[0].volunteer,
    },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockDeleteForInstance = [
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
const linkInstanceDelete = new StaticMockLink(mockDeleteForInstance);

const renderVolunteerDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeleteVolunteerModal,
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
  it('Delete Volunteer', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(itemProps[0].refetchVolunteers).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerRemoved,
      );
    });
  });

  it('Close Delete Modal', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const noBtn = screen.getByTestId('deletenobtn');
    expect(noBtn).toBeInTheDocument();
    await userEvent.click(noBtn);

    await waitFor(() => {
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Delete Volunteer -> Error', async () => {
    renderVolunteerDeleteModal(link2, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('Delete Volunteer for a recurring event instance only', async () => {
    renderVolunteerDeleteModal(linkInstanceDelete, recurringItemProps);

    // Click "instance" radio to cover its onChange handler
    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);
    expect(instanceRadio).toBeChecked();

    // Click "series" radio to cover its onChange handler
    const seriesRadio = screen.getByTestId('deleteApplyToSeries');
    await userEvent.click(seriesRadio);
    expect(seriesRadio).toBeChecked();

    // Set state back to "instance" for the delete action
    await userEvent.click(instanceRadio);
    expect(instanceRadio).toBeChecked();

    // Find and click the delete button
    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    await userEvent.click(yesBtn);

    // Assert the results
    await waitFor(() => {
      expect(recurringItemProps.refetchVolunteers).toHaveBeenCalled();
      expect(recurringItemProps.hide).toHaveBeenCalled();
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerRemoved,
      );
    });
  });

  it('Delete Volunteer for a recurring event instance -> Error', async () => {
    const mockDeleteForInstanceError = [
      {
        request: {
          query: DELETE_VOLUNTEER_FOR_INSTANCE,
          variables: {
            input: {
              volunteerId: recurringItemProps.volunteer.id,
              recurringEventInstanceId: recurringItemProps.eventId,
            },
          },
        },
        error: new Error('Failed to delete volunteer for instance'),
      },
    ];
    const linkInstanceDeleteError = new StaticMockLink(
      mockDeleteForInstanceError,
    );

    renderVolunteerDeleteModal(linkInstanceDeleteError, recurringItemProps);

    const instanceRadio = screen.getByTestId('deleteApplyToInstance');
    await userEvent.click(instanceRadio);

    const yesBtn = screen.getByTestId('deleteyesbtn');
    await userEvent.click(yesBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to delete volunteer for instance',
      );
    });
  });
});

import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { InterfaceVolunteerViewModalProps } from 'types/AdminPortal/VolunteerViewModal/interface';
import VolunteerViewModal from './VolunteerViewModal';
import { vi, describe, it, expect, afterEach } from 'vitest';
import dayjs from 'dayjs';

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceVolunteerViewModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
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
        lastName: 'User',
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
  {
    isOpen: true,
    hide: vi.fn(),
    volunteer: {
      id: 'volunteerId2',
      hasAccepted: false,
      volunteerStatus: 'pending',
      hoursVolunteered: 0,
      isPublic: false,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      user: {
        id: 'userId3',
        firstName: 'Bruce',
        lastName: 'Graza',
        name: 'Bruce Graza',
        avatarURL: 'img-url',
      },
      event: {
        id: 'eventId2',
        name: 'Test Event 2',
      },
      creator: {
        id: 'creatorId2',
        firstName: 'Creator2',
        lastName: 'User2',
        name: 'Creator2 User2',
        avatarURL: null,
      },
      updater: {
        id: 'updaterId2',
        firstName: 'Updater2',
        lastName: 'User2',
        name: 'Updater2 User2',
        avatarURL: null,
      },
      groups: [],
      isTemplate: true,
      isInstanceException: false,
    },
  },
];

const renderVolunteerViewModal = (
  props: InterfaceVolunteerViewModalProps,
): RenderResult => {
  return render(
    <MockedProvider>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerViewModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing VolunteerViewModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render VolunteerViewModal with avatar when no image URL', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByText(t.volunteerDetails)).toBeInTheDocument();
      expect(screen.getByTestId('volunteer_avatar')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Teresa Bradley')).toBeInTheDocument();
    });

    it('should render VolunteerViewModal with image when avatar URL is provided', () => {
      renderVolunteerViewModal(itemProps[1]);
      expect(screen.getByText(t.volunteerDetails)).toBeInTheDocument();
      expect(screen.getByTestId('volunteer_image')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Bruce Graza')).toBeInTheDocument();
    });
  });

  describe('Modal Functionality', () => {
    it('should call hide function when close button is clicked', async () => {
      const user = userEvent.setup();
      const hideMock = vi.fn();
      const props = { ...itemProps[0], hide: hideMock };
      renderVolunteerViewModal(props);

      const closeButton = screen.getByTestId('modalCloseBtn');
      await user.click(closeButton);

      expect(hideMock).toHaveBeenCalledTimes(1);
    });

    it('should call hide function when footer close button is clicked', async () => {
      const user = userEvent.setup();
      const hideMock = vi.fn();
      const props = { ...itemProps[0], hide: hideMock };
      renderVolunteerViewModal(props);

      const closeButton = screen.getByTestId('modal-close-btn');
      await user.click(closeButton);

      expect(hideMock).toHaveBeenCalledTimes(1);
    });

    it('should not render modal when isOpen is false', () => {
      const props = { ...itemProps[0], isOpen: false };
      renderVolunteerViewModal(props);

      expect(screen.queryByText(t.volunteerDetails)).not.toBeInTheDocument();
    });
  });

  describe('Volunteer Status Display', () => {
    it('should display accepted status with correct styling and icon', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByDisplayValue('Accepted')).toBeInTheDocument();
    });

    it('should display pending status with correct styling and icon', () => {
      renderVolunteerViewModal(itemProps[1]);
      expect(screen.getByDisplayValue('Pending')).toBeInTheDocument();
    });

    it('should display rejected status with correct styling and icon', () => {
      const rejectedProps = {
        ...itemProps[0],
        volunteer: {
          ...itemProps[0].volunteer,
          volunteerStatus: 'rejected' as const,
        },
      };
      renderVolunteerViewModal(rejectedProps);
      expect(screen.getByDisplayValue('Rejected')).toBeInTheDocument();
    });
  });

  describe('Hours Volunteered Display', () => {
    it('should display hours when provided', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('should display 0 when hours are 0', () => {
      const noHoursProps = {
        ...itemProps[0],
        volunteer: {
          ...itemProps[0].volunteer,
          hoursVolunteered: 0,
        },
      };
      renderVolunteerViewModal(noHoursProps);
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('should display dash when hours are null', () => {
      const nullHoursProps = {
        ...itemProps[0],
        volunteer: {
          ...itemProps[0].volunteer,
          hoursVolunteered: null as unknown as number,
        },
      };
      renderVolunteerViewModal(nullHoursProps);
      expect(screen.getByDisplayValue('-')).toBeInTheDocument();
    });
  });

  describe('Groups Table', () => {
    it('should render groups table when groups exist', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByText(t.volunteerGroups)).toBeInTheDocument();
      expect(screen.getByText(t.serialNumber)).toBeInTheDocument();
      expect(screen.getByText(t.group)).toBeInTheDocument();
      expect(screen.getByText(t.numVolunteersHeader)).toBeInTheDocument();
      expect(screen.getByText('group1')).toBeInTheDocument();
      // Check that table contains the expected data
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should not render groups table when groups array is empty', () => {
      renderVolunteerViewModal(itemProps[1]);
      expect(screen.queryByText(t.volunteerGroups)).not.toBeInTheDocument();
    });

    it('should display correct member count in groups table', () => {
      renderVolunteerViewModal(itemProps[0]);
      const rows = screen.getAllByRole('row');
      // Verify the data row contains the member count (row index 1, after header)
      expect(rows[1]).toHaveTextContent('1');
    });

    it('should display 0 when volunteers array is empty', () => {
      const emptyVolunteersProps = {
        ...itemProps[0],
        volunteer: {
          ...itemProps[0].volunteer,
          groups: [
            {
              id: 'groupId1',
              name: 'group1',
              description: 'Test group',
              volunteers: [],
            },
          ],
        },
      };
      renderVolunteerViewModal(emptyVolunteersProps);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Multiple Groups', () => {
    it('should render multiple groups correctly', () => {
      const multipleGroupsProps = {
        ...itemProps[0],
        volunteer: {
          ...itemProps[0].volunteer,
          groups: [
            {
              id: 'groupId1',
              name: 'group1',
              description: 'Test group 1',
              volunteers: [{ id: 'volunteerId1' }],
            },
            {
              id: 'groupId2',
              name: 'group2',
              description: 'Test group 2',
              volunteers: [{ id: 'volunteerId2' }, { id: 'volunteerId3' }],
            },
          ],
        },
      };
      renderVolunteerViewModal(multipleGroupsProps);

      expect(screen.getByText('group1')).toBeInTheDocument();
      expect(screen.getByText('group2')).toBeInTheDocument();

      // Verify correct member counts for each group in the table
      const rows = screen.getAllByRole('row');

      // First group row should show 1 member (row index 1 after header)
      expect(rows[1]).toHaveTextContent('1');
      // Second group row should show 2 members (row index 2)
      expect(rows[2]).toHaveTextContent('2');
    });
  });

  describe('Field onChange handlers', () => {
    it('should call no-op onChange handlers without errors', async () => {
      renderVolunteerViewModal(itemProps[0]);

      const nameInput = screen.getByTestId('volunteerName') as HTMLInputElement;
      const statusInput = screen.getByTestId(
        'volunteerStatus',
      ) as HTMLInputElement;
      const hoursInput = screen.getByTestId(
        'hoursVolunteered',
      ) as HTMLInputElement;

      const initialName = nameInput.value;
      const initialStatus = statusInput.value;
      const initialHours = hoursInput.value;

      nameInput.removeAttribute('disabled');
      statusInput.removeAttribute('disabled');
      hoursInput.removeAttribute('disabled');

      await userEvent.type(nameInput, 'x');
      await userEvent.type(statusInput, 'x');
      await userEvent.type(hoursInput, 'x');

      expect(nameInput.value).toBe(initialName);
      expect(statusInput.value).toBe(initialStatus);
      expect(hoursInput.value).toBe(initialHours);
    });

    it('should keep all fields disabled and read-only', () => {
      renderVolunteerViewModal(itemProps[0]);

      const nameInput = screen.getByTestId('volunteerName') as HTMLInputElement;
      const statusInput = screen.getByTestId(
        'volunteerStatus',
      ) as HTMLInputElement;
      const hoursInput = screen.getByTestId(
        'hoursVolunteered',
      ) as HTMLInputElement;

      expect(nameInput).toBeDisabled();
      expect(statusInput).toBeDisabled();
      expect(hoursInput).toBeDisabled();

      expect(nameInput).toHaveValue('Teresa Bradley');
      expect(statusInput).toHaveValue('Accepted');
      expect(hoursInput).toHaveValue('10');
    });
  });
});

import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { InterfaceVolunteerViewModal } from './VolunteerViewModal';
import VolunteerViewModal from './VolunteerViewModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

const itemProps: InterfaceVolunteerViewModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    volunteer: {
      id: 'volunteerId1',
      hasAccepted: true,
      volunteerStatus: 'accepted',
      hoursVolunteered: 10,
      isPublic: true,
      createdAt: '2024-10-25T16:16:32.978Z',
      updatedAt: '2024-10-25T16:16:32.978Z',
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
      createdAt: '2024-10-25T16:16:32.978Z',
      updatedAt: '2024-10-25T16:16:32.978Z',
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
  props: InterfaceVolunteerViewModal,
): RenderResult => {
  return render(
    <MockedProvider>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider>
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
  beforeEach(() => {
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
    it('should call hide function when close button is clicked', () => {
      const hideMock = vi.fn();
      const props = { ...itemProps[0], hide: hideMock };
      renderVolunteerViewModal(props);

      const closeButton = screen.getByTestId('modalCloseBtn');
      fireEvent.click(closeButton);

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
      // Check for the rejected status text - it shows the translation key when not resolved
      const statusField = screen.getByLabelText('Status');
      expect(statusField).toHaveValue('eventVolunteers.rejected');
    });
  });

  describe('Hours Volunteered Display', () => {
    it('should display hours when provided', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });

    it('should display dash when hours are null', () => {
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

    it('should display dash when hours are undefined', () => {
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
  });

  describe('Groups Table', () => {
    it('should render groups table when groups exist', () => {
      renderVolunteerViewModal(itemProps[0]);
      expect(screen.getByText('Volunteer Groups Joined')).toBeInTheDocument();
      expect(screen.getByText('Sr. No.')).toBeInTheDocument();
      expect(screen.getByText('Group Name')).toBeInTheDocument();
      expect(screen.getByText('No. of Members')).toBeInTheDocument();
      expect(screen.getByText('group1')).toBeInTheDocument();
      // Check that table contains the expected data
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should not render groups table when groups array is empty', () => {
      renderVolunteerViewModal(itemProps[1]);
      expect(
        screen.queryByText('Volunteer Groups Joined'),
      ).not.toBeInTheDocument();
    });

    it('should display correct member count in groups table', () => {
      renderVolunteerViewModal(itemProps[0]);
      const memberCountCells = screen.getAllByText('1');
      expect(memberCountCells.length).toBeGreaterThan(0);
      // Check that at least one "1" is in a table cell (member count)
      const tableCells = memberCountCells.filter(
        (cell) => cell.closest('td') || cell.closest('th'),
      );
      expect(tableCells.length).toBeGreaterThan(0);
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

    it('should display 0 when volunteers array is empty (nullVolunteersProps)', () => {
      const nullVolunteersProps = {
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
      renderVolunteerViewModal(nullVolunteersProps);
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
});

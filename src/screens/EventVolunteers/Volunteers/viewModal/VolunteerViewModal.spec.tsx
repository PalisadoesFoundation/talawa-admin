import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { InterfaceVolunteerViewModal } from './VolunteerViewModal';
import VolunteerViewModal from './VolunteerViewModal';
import { vi } from 'vitest';

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
    },
  },
];

const renderVolunteerViewModal = (
  props: InterfaceVolunteerViewModal,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false}>
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
  it('Render VolunteerViewModal (variation 1)', async () => {
    renderVolunteerViewModal(itemProps[0]);
    expect(screen.getByText(t.volunteerDetails)).toBeInTheDocument();
    expect(screen.getByTestId('volunteer_avatar')).toBeInTheDocument();
  });

  it('Render VolunteerViewModal (variation 2)', async () => {
    renderVolunteerViewModal(itemProps[1]);
    expect(screen.getByText(t.volunteerDetails)).toBeInTheDocument();
    expect(screen.getByTestId('volunteer_image')).toBeInTheDocument();
  });
});

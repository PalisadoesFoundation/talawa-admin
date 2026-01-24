import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DatePicker';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import type { InterfaceVolunteerGroupViewModalProps } from 'types/AdminPortal/VolunteerGroupViewModal/interface';
import VolunteerGroupViewModal from './VolunteerGroupViewModal';
import { vi } from 'vitest';
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

const itemProps: InterfaceVolunteerGroupViewModalProps[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: null,
      isTemplate: true,
      isInstanceException: false,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: 'img-url',
      },
      leader: {
        id: 'userId',
        name: 'Teresa Bradley',
        emailAddress: 'teresa@example.com',
        avatarURL: 'img-url',
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
            avatarURL: null,
          },
        },
      ],
      event: { id: 'eventId' },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: null,
      volunteersRequired: 10,
      isTemplate: true,
      isInstanceException: false,
      createdAt: dayjs().toISOString(),
      creator: {
        id: 'creatorId1',
        name: 'Wilt Shepherd',
        emailAddress: 'wilt@example.com',
        avatarURL: null,
      },
      leader: {
        id: 'userId',
        name: 'Teresa Bradley',
        emailAddress: 'teresa@example.com',
        avatarURL: null,
      },
      volunteers: [],
      event: { id: 'eventId' },
    },
  },
];

const renderGroupViewModal = (
  props: InterfaceVolunteerGroupViewModalProps,
): RenderResult => {
  return render(
    <MockedProvider>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <VolunteerGroupViewModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing VolunteerGroupViewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Render VolunteerGroupViewModal (variation 1)', async () => {
    renderGroupViewModal(itemProps[0]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_image')).toBeInTheDocument();
    expect(screen.getByTestId('creator_image')).toBeInTheDocument();
  });

  it('Render VolunteerGroupViewModal (variation 2)', async () => {
    renderGroupViewModal(itemProps[1]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('creator_avatar')).toBeInTheDocument();
  });
});

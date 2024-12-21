import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import type { InterfaceVolunteerGroupViewModal } from './VolunteerGroupViewModal';
import VolunteerGroupViewModal from './VolunteerGroupViewModal';
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

const itemProps: InterfaceVolunteerGroupViewModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      _id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: null,
      createdAt: '2024-10-25T16:16:32.978Z',
      creator: {
        _id: 'creatorId1',
        firstName: 'Wilt',
        lastName: 'Shepherd',
        image: null,
      },
      leader: {
        _id: 'userId',
        firstName: 'Teresa',
        lastName: 'Bradley',
        image: null,
      },
      volunteers: [
        {
          _id: 'volunteerId1',
          user: {
            _id: 'userId',
            firstName: 'Teresa',
            lastName: 'Bradley',
            image: null,
          },
        },
      ],
      assignments: [],
      event: {
        _id: 'eventId',
      },
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    group: {
      _id: 'groupId',
      name: 'Group 1',
      description: null,
      volunteersRequired: 10,
      createdAt: '2024-10-25T16:16:32.978Z',
      creator: {
        _id: 'creatorId1',
        firstName: 'Wilt',
        lastName: 'Shepherd',
        image: 'img--url',
      },
      leader: {
        _id: 'userId',
        firstName: 'Teresa',
        lastName: 'Bradley',
        image: 'img-url',
      },
      volunteers: [],
      assignments: [],
      event: {
        _id: 'eventId',
      },
    },
  },
];

const renderGroupViewModal = (
  props: InterfaceVolunteerGroupViewModal,
): RenderResult => {
  return render(
    <MockedProvider addTypename={false}>
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
  it('Render VolunteerGroupViewModal (variation 1)', async () => {
    renderGroupViewModal(itemProps[0]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_avatar')).toBeInTheDocument();
    expect(screen.getByTestId('creator_avatar')).toBeInTheDocument();
  });

  it('Render VolunteerGroupViewModal (variation 2)', async () => {
    renderGroupViewModal(itemProps[1]);
    expect(screen.getByText(t.groupDetails)).toBeInTheDocument();
    expect(screen.getByTestId('leader_image')).toBeInTheDocument();
    expect(screen.getByTestId('creator_image')).toBeInTheDocument();
  });
});

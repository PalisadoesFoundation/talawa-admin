import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
      _id: 'volunteerId1',
      hasAccepted: true,
      hoursVolunteered: 10,
      user: {
        _id: 'userId1',
        firstName: 'Teresa',
        lastName: 'Bradley',
        image: null,
      },
      assignments: [],
      groups: [
        {
          _id: 'groupId1',
          name: 'group1',
          volunteers: [
            {
              _id: 'volunteerId1',
            },
          ],
        },
      ],
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    volunteer: {
      _id: 'volunteerId2',
      hasAccepted: false,
      hoursVolunteered: null,
      user: {
        _id: 'userId3',
        firstName: 'Bruce',
        lastName: 'Graza',
        image: 'img-url',
      },
      assignments: [],
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

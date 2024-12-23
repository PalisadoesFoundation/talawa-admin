import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceDeleteVolunteerModal } from './VolunteerDeleteModal';
import VolunteerDeleteModal from './VolunteerDeleteModal';
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

const itemProps: InterfaceDeleteVolunteerModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchVolunteers: vi.fn(),
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
];

const renderVolunteerDeleteModal = (
  link: ApolloLink,
  props: InterfaceDeleteVolunteerModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider>
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
    userEvent.click(yesBtn);

    await waitFor(() => {
      expect(itemProps[0].refetchVolunteers).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.volunteerRemoved);
    });
  });

  it('Close Delete Modal', async () => {
    renderVolunteerDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const noBtn = screen.getByTestId('deletenobtn');
    expect(noBtn).toBeInTheDocument();
    userEvent.click(noBtn);

    await waitFor(() => {
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Delete Volunteer -> Error', async () => {
    renderVolunteerDeleteModal(link2, itemProps[0]);
    expect(screen.getByText(t.removeVolunteer)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    userEvent.click(yesBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './VolunteerGroups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceDeleteVolunteerGroupModal } from './VolunteerGroupDeleteModal';
import VolunteerGroupDeleteModal from './VolunteerGroupDeleteModal';
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

const itemProps: InterfaceDeleteVolunteerGroupModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    refetchGroups: vi.fn(),
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
        image: 'img-url',
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
    userEvent.click(yesBtn);

    await waitFor(() => {
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupDeleted);
    });
  });

  it('Close Delete Modal', async () => {
    renderGroupDeleteModal(link1, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    const noBtn = screen.getByTestId('deletenobtn');
    expect(noBtn).toBeInTheDocument();
    userEvent.click(noBtn);

    await waitFor(() => {
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('Delete Group -> Error', async () => {
    renderGroupDeleteModal(link2, itemProps[0]);
    expect(screen.getByText(t.deleteGroup)).toBeInTheDocument();

    const yesBtn = screen.getByTestId('deleteyesbtn');
    expect(yesBtn).toBeInTheDocument();
    userEvent.click(yesBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

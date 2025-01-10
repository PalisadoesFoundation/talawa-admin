import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, UPDATE_ERROR_MOCKS } from './Groups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceGroupModal } from './GroupModal';
import GroupModal from './GroupModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(UPDATE_ERROR_MOCKS);

/**
 * Translations for test cases
 */

const t = {
  ...JSON.parse(
    JSON.stringify(
      i18n.getDataByLanguage('en')?.translation.eventVolunteers ?? {},
    ),
  ),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.common ?? {})),
  ...JSON.parse(JSON.stringify(i18n.getDataByLanguage('en')?.errors ?? {})),
};

/**
 * Props for `GroupModal` component used in tests
 */

const itemProps: InterfaceGroupModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
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
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    refetchGroups: vi.fn(),
    group: {
      _id: 'groupId',
      name: 'Group 1',
      description: null,
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
      volunteers: [],
      assignments: [],
      event: {
        _id: 'eventId',
      },
    },
  },
];

const renderGroupModal = (
  link: ApolloLink,
  props: InterfaceGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <GroupModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('Testing GroupModal', () => {
  it('GroupModal -> Requests -> Accept', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsBtn = screen.getByText(t.requests);
    expect(requestsBtn).toBeInTheDocument();
    userEvent.click(requestsBtn);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.requestAccepted);
    });
  });

  it('GroupModal -> Requests -> Reject', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsBtn = screen.getByText(t.requests);
    expect(requestsBtn).toBeInTheDocument();
    userEvent.click(requestsBtn);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const rejectBtn = screen.getAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);
    userEvent.click(rejectBtn[0]);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.requestRejected);
    });
  });

  it('GroupModal -> Click Requests -> Click Details', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsBtn = screen.getByText(t.requests);
    expect(requestsBtn).toBeInTheDocument();
    userEvent.click(requestsBtn);

    const detailsBtn = await screen.findByText(t.details);
    expect(detailsBtn).toBeInTheDocument();
    userEvent.click(detailsBtn);
  });

  it('GroupModal -> Details -> Update', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupUpdated);
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 2' } });
    expect(nameInput).toHaveValue('Group 2');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc new' } });
    expect(descInput).toHaveValue('desc new');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Requests -> Accept -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsBtn = screen.getByText(t.requests);
    expect(requestsBtn).toBeInTheDocument();
    userEvent.click(requestsBtn);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('Try adding different values for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '-1' } });

    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    userEvent.clear(vrInput);
    userEvent.type(vrInput, '1{backspace}');

    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    fireEvent.change(vrInput, { target: { value: '0' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue('');
    });

    fireEvent.change(vrInput, { target: { value: '19' } });
    await waitFor(() => {
      expect(vrInput).toHaveValue('19');
    });
  });

  it('GroupModal -> Details -> No values updated', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

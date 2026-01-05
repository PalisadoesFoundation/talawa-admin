import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18n from 'utils/i18nForTest';
import { MOCKS, UPDATE_ERROR_MOCKS } from './Groups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { InterfaceGroupModal } from './GroupModal';
import GroupModal from './GroupModal';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';

const sharedMocks = vi.hoisted(() => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.NotificationToast,
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
      id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: null,
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
      event: {
        id: 'eventId',
      },
      isTemplate: true,
      isInstanceException: false,
    },
  },
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    refetchGroups: vi.fn(),
    group: {
      id: 'groupId',
      name: 'Group 1',
      description: null,
      volunteersRequired: null,
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
        avatarURL: 'img-url',
      },
      volunteers: [],
      event: {
        id: 'eventId',
      },
      isTemplate: true,
      isInstanceException: false,
    },
  },
];

const renderGroupModal = (
  link: ApolloLink,
  props: InterfaceGroupModal,
): RenderResult => {
  return render(
    <MockedProvider link={link}>
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
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('GroupModal -> Requests -> Accept', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    await userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestAccepted);
    });
  });

  it('GroupModal -> Requests -> Reject', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userName = await screen.findAllByTestId('userName');
    expect(userName).toHaveLength(2);
    expect(userName[0]).toHaveTextContent('John Doe');
    expect(userName[1]).toHaveTextContent('Teresa Bradley');

    const rejectBtn = screen.getAllByTestId('rejectBtn');
    expect(rejectBtn).toHaveLength(2);
    await userEvent.click(rejectBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(t.requestRejected);
    });
  });

  it('GroupModal -> Click Requests -> Click Details', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const detailsRadio = screen.getByLabelText(t.details);
    expect(detailsRadio).toBeInTheDocument();
    await userEvent.click(detailsRadio);
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
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        t.volunteerGroupUpdated,
      );
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
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Requests -> Accept -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getByText(t.manageGroup)).toBeInTheDocument();

    const requestsRadio = screen.getByLabelText(t.requests);
    expect(requestsRadio).toBeInTheDocument();
    await userEvent.click(requestsRadio);

    const userNameElements = await screen.findAllByTestId('userName');
    expect(userNameElements).toHaveLength(2);
    expect(userNameElements[0]).toHaveTextContent('John Doe');
    expect(userNameElements[1]).toHaveTextContent('Teresa Bradley');

    const acceptBtn = screen.getAllByTestId('acceptBtn');
    expect(acceptBtn).toHaveLength(2);
    await userEvent.click(acceptBtn[0]);
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
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

    await userEvent.clear(vrInput);
    await userEvent.type(vrInput, '1{backspace}');

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
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });
});

import React from 'react';
import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18n from 'utils/i18nForTest';
import { MOCKS, MOCKS_ERROR } from './VolunteerGroups.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfaceVolunteerGroupModal } from './VolunteerGroupModal';
import GroupModal from './VolunteerGroupModal';
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

const itemProps: InterfaceVolunteerGroupModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    orgId: 'orgId',
    refetchGroups: vi.fn(),
    mode: 'create',
    group: null,
  },
  {
    isOpen: true,
    hide: vi.fn(),
    eventId: 'eventId',
    orgId: 'orgId',
    refetchGroups: vi.fn(),
    mode: 'edit',
    group: {
      _id: 'groupId',
      name: 'Group 1',
      description: 'desc',
      volunteersRequired: 2,
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
    orgId: 'orgId',
    refetchGroups: vi.fn(),
    mode: 'edit',
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
  props: InterfaceVolunteerGroupModal,
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

describe('Testing VolunteerGroupModal', () => {
  it('GroupModal -> Create', async () => {
    renderGroupModal(link1, itemProps[0]);
    expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(t.volunteerGroupCreated);
      expect(itemProps[0].refetchGroups).toHaveBeenCalled();
      expect(itemProps[0].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Create -> Error', async () => {
    renderGroupModal(link2, itemProps[0]);
    expect(screen.getAllByText(t.createGroup)).toHaveLength(2);

    const nameInput = screen.getByLabelText(`${t.name} *`);
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: 'Group 1' } });
    expect(nameInput).toHaveValue('Group 1');

    const descInput = screen.getByLabelText(t.description);
    expect(descInput).toBeInTheDocument();
    fireEvent.change(descInput, { target: { value: 'desc' } });
    expect(descInput).toHaveValue('desc');

    const vrInput = screen.getByLabelText(t.volunteersRequired);
    expect(vrInput).toBeInTheDocument();
    fireEvent.change(vrInput, { target: { value: '10' } });
    expect(vrInput).toHaveValue('10');

    // Select Leader
    const memberSelect = await screen.findByTestId('leaderSelect');
    expect(memberSelect).toBeInTheDocument();
    const memberInputField = within(memberSelect).getByRole('combobox');
    fireEvent.mouseDown(memberInputField);

    const memberOption = await screen.findByText('Harve Lance');
    expect(memberOption).toBeInTheDocument();
    fireEvent.click(memberOption);

    // Select Volunteers
    const volunteerSelect = await screen.findByTestId('volunteerSelect');
    expect(volunteerSelect).toBeInTheDocument();
    const volunteerInputField = within(volunteerSelect).getByRole('combobox');
    fireEvent.mouseDown(volunteerInputField);

    const volunteerOption = await screen.findByText('John Doe');
    expect(volunteerOption).toBeInTheDocument();
    fireEvent.click(volunteerOption);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Update', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

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
      expect(itemProps[1].refetchGroups).toHaveBeenCalled();
      expect(itemProps[1].hide).toHaveBeenCalled();
    });
  });

  it('GroupModal -> Details -> Update -> Error', async () => {
    renderGroupModal(link2, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

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

  it('Try adding different values for volunteersRequired', async () => {
    renderGroupModal(link1, itemProps[2]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

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

  it('GroupModal -> Update -> No values updated', async () => {
    renderGroupModal(link1, itemProps[1]);
    expect(screen.getAllByText(t.updateGroup)).toHaveLength(2);

    const submitBtn = screen.getByTestId('submitBtn');
    expect(submitBtn).toBeInTheDocument();
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

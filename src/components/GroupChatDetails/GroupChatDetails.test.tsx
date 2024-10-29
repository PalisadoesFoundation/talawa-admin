import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GroupChatDetails from './GroupChatDetails';
import { MockedProvider } from '@apollo/client/testing';
import {
  ADD_USER_TO_GROUP_CHAT,
  UPDATE_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';

const mockChat = {
  _id: '1',
  isGroup: true,
  name: 'Test Group',
  image: '',
  messages: [],
  admins: [
    {
      _id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
    },
  ],
  users: [
    {
      _id: '2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    },
  ],
  unseenMessagesByUsers: JSON.parse('{"1": 0, "2": 0}'),
  description: 'Test Description',
};

const mocks = [
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: { firstName_contains: '', lastName_contains: '' },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: '3',
              firstName: 'New',
              lastName: 'User',
              email: 'newuser@example.com',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_USER_TO_GROUP_CHAT,
      variables: { userId: '3', chatId: '1' },
    },
    result: {
      data: {
        addUserToGroupChat: { success: true },
      },
    },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { _id: '1', image: '', name: 'Updated Group' } },
    },
    result: {
      data: {
        updateChat: { success: true },
      },
    },
  },
];

describe('GroupChatDetails', () => {
  it('renders correctly', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatDetails
          toggleGroupChatDetailsModal={jest.fn()}
          groupChatDetailsModalisOpen={true}
          chat={mockChat}
          chatRefetch={jest.fn()}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('opens and closes modals correctly', () => {
    const toggleGroupChatDetailsModal = jest.fn();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatDetails
          toggleGroupChatDetailsModal={toggleGroupChatDetailsModal}
          groupChatDetailsModalisOpen={true}
          chat={mockChat}
          chatRefetch={jest.fn()}
        />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('createDirectChat'));
    expect(toggleGroupChatDetailsModal).toHaveBeenCalled();
  });

  it('edits chat title', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatDetails
          toggleGroupChatDetailsModal={jest.fn()}
          groupChatDetailsModalisOpen={true}
          chat={mockChat}
          chatRefetch={jest.fn()}
        />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText('Test Group'));
    fireEvent.change(screen.getByDisplayValue('Test Group'), {
      target: { value: 'Updated Group' },
    });
    fireEvent.click(screen.getByText('✔'));

    await waitFor(() => {
      expect(screen.getByText('Updated Group')).toBeInTheDocument();
    });
  });

  it('opens add user modal and adds user', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatDetails
          toggleGroupChatDetailsModal={jest.fn()}
          groupChatDetailsModalisOpen={true}
          chat={mockChat}
          chatRefetch={jest.fn()}
        />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByText('Add Members'));
    expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('searchFullName'), {
      target: { value: 'New User' },
    });
    fireEvent.click(screen.getByTestId('submitBtn'));

    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(screen.queryByText('New User')).not.toBeInTheDocument();
    });
  });
});

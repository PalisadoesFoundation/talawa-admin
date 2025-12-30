import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import GroupChatAddUserModal from './GroupChatAddUserModal';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_CHAT_MEMBERSHIP } from 'GraphQl/Mutations/OrganizationMutations';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock styles
vi.mock('style/app-fixed.module.css', () => ({
  default: {
    modalContent: 'modalContent',
    input: 'input',
    userData: 'userData',
    groupChatTableCellHead: 'groupChatTableCellHead',
    groupChatTableCellBody: 'groupChatTableCellBody',
  },
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Loader
vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

interface InterfaceSearchBarMockProps {
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
  value: string;
  onClear: () => void;
  buttonTestId: string;
  inputTestId: string;
}

// Mock SearchBar
vi.mock('shared-components/SearchBar/SearchBar', () => ({
  default: ({
    onChange,
    onSearch,
    value,
    onClear,
    buttonTestId,
    inputTestId,
  }: InterfaceSearchBarMockProps) => (
    <div>
      <input
        data-testid={inputTestId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        data-testid={buttonTestId}
        onClick={() => onSearch(value)}
      >
        Search
      </button>
      <button type="button" onClick={onClear}>
        Clear
      </button>
    </div>
  ),
}));

const mockToggle = vi.fn();
const mockChatRefetch = vi.fn();

const mockChat = {
  id: 'chat1',
  name: 'Test Chat',
  image: 'test.jpg',
  description: 'Test Description',
  isGroup: true,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  messages: { edges: [] },
  organization: {
    id: 'org1',
    name: 'Test Org',
  },
  members: {
    edges: [
      {
        cursor: 'cursor1',
        node: {
          role: 'member',
          user: {
            id: 'user1',
            name: 'User One',
          },
        },
      },
    ],
  },
};

const mockUsersData = {
  organization: {
    members: {
      edges: [
        {
          node: {
            id: 'user1',
            name: 'User One',
            role: 'admin',
          },
        },
        {
          node: {
            id: 'user2',
            name: 'User Two',
            role: 'member',
          },
        },
      ],
    },
  },
};

const mocks = [
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: {
        input: { id: 'org1' },
        first: 20,
        after: null,
        where: {},
      },
    },
    result: {
      data: mockUsersData,
    },
  },
  {
    request: {
      query: CREATE_CHAT_MEMBERSHIP,
      variables: {
        input: { memberId: 'user2', chatId: 'chat1', role: 'regular' },
      },
    },
    result: {
      data: {
        createChatMembership: {
          id: 'membership1',
          name: 'Membership',
          description: 'Added membership',
        },
      },
    },
  },
];

describe('GroupChatAddUserModal', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('addExistingUserModal')).toBeInTheDocument();
    expect(screen.getByText('chat')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('fetches and displays users (filtering out existing members)', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/User Two/)).toBeInTheDocument();
    });

    // User One should be filtered out because they are already in the chat
    expect(screen.queryByText(/User One/)).not.toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const searchMocks = [
      ...mocks,
      {
        request: {
          query: ORGANIZATION_MEMBERS,
          variables: {
            input: { id: 'org1' },
            first: 20,
            after: null,
            where: { name_contains: 'Two' },
          },
        },
        result: {
          data: {
            organization: {
              members: {
                edges: [
                  {
                    node: {
                      id: 'user2',
                      name: 'User Two',
                      role: 'member',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={searchMocks} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/User Two/)).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchUser');
    fireEvent.change(searchInput, { target: { value: 'Two' } });

    const searchBtn = screen.getByTestId('searchBtn');
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText(/User Two/)).toBeInTheDocument();
    });
  });

  it('adds user to group chat successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText(/User Two/));

    const addBtn = screen.getAllByTestId('addUserBtn')[0];
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('userAddedSuccess');
    });

    expect(mockToggle).toHaveBeenCalled();
    expect(mockChatRefetch).toHaveBeenCalledWith({ input: { id: 'chat1' } });
  });

  it('handles error when adding user', async () => {
    const errorMock = [
      mocks[0],
      {
        request: {
          query: CREATE_CHAT_MEMBERSHIP,
          variables: {
            input: { memberId: 'user2', chatId: 'chat1', role: 'regular' },
          },
        },
        error: new Error('Failed to add'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    await waitFor(() => screen.getByText(/User Two/));

    const addBtn = screen.getAllByTestId('addUserBtn')[0];
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('failedAddUser');
    });
  });

  it('handles query error', async () => {
    const queryErrorMocks = [
      {
        request: {
          query: ORGANIZATION_MEMBERS,
          variables: {
            input: { id: 'org1' },
            first: 20,
            after: null,
            where: {},
          },
        },
        error: new Error('Query failed'),
      },
    ];

    render(
      <MockedProvider mocks={queryErrorMocks} addTypename={false}>
        <GroupChatAddUserModal
          show={true}
          toggle={mockToggle}
          chat={mockChat}
          chatRefetch={mockChatRefetch}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('failedFetchingMembers');
    });
  });
});

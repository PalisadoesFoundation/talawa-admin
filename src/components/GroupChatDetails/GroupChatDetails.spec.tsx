import React from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import type { Chat, DirectMessage } from './GroupChatDetails';
import GroupChatDetails from './GroupChatDetails';
import { MockedProvider } from '@apollo/client/testing';
import {
  ADD_USER_TO_GROUP_CHAT,
  UPDATE_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useLocalStorage } from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        // Add your translations here
      },
    },
  },
});

const MockDirectMessageNR: DirectMessage = {
  _id: 'message1',
  createdAt: new Date('2024-10-27T10:00:00.000Z'),
  sender: {
    _id: 'user2',
    firstName: 'Bob',
    lastName: 'Williams',
    image: 'https://example.com/bob.jpg',
  },
  replyTo: undefined,
  messageContent: 'Just checking in',
  media: 'https://example.com/media/image1.jpg',
};

const MockDirectMessage: DirectMessage = {
  _id: 'message2',
  createdAt: new Date('2024-10-27T10:05:00.000Z'),
  sender: {
    _id: 'user1',
    firstName: 'Alice',
    lastName: 'Johnson',
    image: 'https://example.com/alice.jpg',
  },
  replyTo: {
    _id: 'message1',
    createdAt: new Date('2024-10-27T10:00:00.000Z'),
    sender: {
      _id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      image: 'https://example.com/alice.jpg',
    },
    messageContent: 'Hey Alice!',
    receiver: {
      _id: 'user2',
      firstName: 'Bob',
      lastName: 'Williams',
    },
  },
  messageContent: 'Hi Bob, how are you?',
  media: 'https://example.com/media/image2.jpg',
};

const filledMockChat: Chat = {
  _id: 'chat1',
  isGroup: true,
  name: 'Test Group',
  image: 'https://example.com/group_image.jpg',
  messages: [MockDirectMessageNR, MockDirectMessage],
  admins: [
    {
      _id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
    },
  ],
  users: [
    {
      _id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
    },
    {
      _id: 'user2',
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@example.com',
    },
  ],
  unseenMessagesByUsers: JSON.parse('{"user1": 0, "user2": 1}'),
  description: 'Test Description',
};

const incompleteMockChat: Chat = {
  _id: 'chat1',
  isGroup: true,
  name: '',
  image: '',
  messages: [MockDirectMessageNR, MockDirectMessage],
  admins: [
    {
      _id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
    },
  ],
  users: [
    {
      _id: 'user1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
    },
    {
      _id: 'user2',
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@example.com',
    },
  ],
  unseenMessagesByUsers: '{"user1": 0, "user2": 1}',
  description: 'Test Description',
};

const mocks = [
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: 'user3',
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              email: 'testuser8@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              organizationsBlockedBy: [],
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Queens',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Coffee Street',
                    line2: 'Apartment 501',
                    postalCode: '11427',
                    sortingCode: 'ABC-133',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6637904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Staten Island',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 church Street',
                    line2: 'Apartment 499',
                    postalCode: '10301',
                    sortingCode: 'ABC-122',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6737904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Brooklyn',
                    countryCode: 'US',
                    dependentLocality: 'Sample Dependent Locality',
                    line1: '123 Main Street',
                    line2: 'Apt 456',
                    postalCode: '10004',
                    sortingCode: 'ABC-789',
                    state: 'NY',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6437904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Bronx',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Random Street',
                    line2: 'Apartment 456',
                    postalCode: '10451',
                    sortingCode: 'ABC-123',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
            appUserProfile: {
              _id: '64378abd85308f171cf2993d',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
              __typename: 'AppUserProfile',
            },
            __typename: 'UserData',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        firstName_contains: 'Disha',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: 'user3',
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              email: 'testuser8@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              organizationsBlockedBy: [],
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Queens',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Coffee Street',
                    line2: 'Apartment 501',
                    postalCode: '11427',
                    sortingCode: 'ABC-133',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6637904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Staten Island',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 church Street',
                    line2: 'Apartment 499',
                    postalCode: '10301',
                    sortingCode: 'ABC-122',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6737904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Brooklyn',
                    countryCode: 'US',
                    dependentLocality: 'Sample Dependent Locality',
                    line1: '123 Main Street',
                    line2: 'Apt 456',
                    postalCode: '10004',
                    sortingCode: 'ABC-789',
                    state: 'NY',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6437904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Bronx',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Random Street',
                    line2: 'Apartment 456',
                    postalCode: '10451',
                    sortingCode: 'ABC-123',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
            appUserProfile: {
              _id: 'profile1',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
              __typename: 'AppUserProfile',
            },
            __typename: 'UserData',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: {
        firstName_contains: '',
        lastName_contains: 'Smith',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: 'user3',
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              email: 'testuser8@example.com',
              createdAt: '2023-04-13T04:53:17.742Z',
              organizationsBlockedBy: [],
              joinedOrganizations: [
                {
                  _id: '6537904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Queens',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Coffee Street',
                    line2: 'Apartment 501',
                    postalCode: '11427',
                    sortingCode: 'ABC-133',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6637904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Staten Island',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 church Street',
                    line2: 'Apartment 499',
                    postalCode: '10301',
                    sortingCode: 'ABC-122',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6737904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Brooklyn',
                    countryCode: 'US',
                    dependentLocality: 'Sample Dependent Locality',
                    line1: '123 Main Street',
                    line2: 'Apt 456',
                    postalCode: '10004',
                    sortingCode: 'ABC-789',
                    state: 'NY',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
                {
                  _id: '6437904485008f171cf29924',
                  name: 'Unity Foundation',
                  image: null,
                  address: {
                    city: 'Bronx',
                    countryCode: 'US',
                    dependentLocality: 'Some Dependent Locality',
                    line1: '123 Random Street',
                    line2: 'Apartment 456',
                    postalCode: '10451',
                    sortingCode: 'ABC-123',
                    state: 'NYC',
                    __typename: 'Address',
                  },
                  createdAt: '2023-04-13T05:16:52.827Z',
                  creator: {
                    _id: '64378abd85008f171cf2990d',
                    firstName: 'Wilt',
                    lastName: 'Shepherd',
                    image: null,
                    email: 'testsuperadmin@example.com',
                    createdAt: '2023-04-13T04:53:17.742Z',
                    __typename: 'User',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
            },
            appUserProfile: {
              _id: 'profile1',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
              __typename: 'AppUserProfile',
            },
            __typename: 'UserData',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_USER_TO_GROUP_CHAT,
      variables: { userId: 'user3', chatId: 'chat1' },
    },
    result: {
      data: {
        addUserToGroupChat: {
          _id: 'chat1',
          success: true,
        },
      },
    },
  },

  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { _id: 'chat1', image: '', name: 'Group name' } },
    },
    result: {
      data: {
        updateChat: {
          _id: 'chat1',
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: {
        input: {
          _id: 'chat1',
          image: 'https://example.com/group_image.jpg',
          name: 'New Group name',
        },
      },
    },
    result: {
      data: {
        updateChat: {
          _id: 'chat2',
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: {},
    },
    result: {
      data: {
        updateChat: {
          _id: 'chat3',
          success: true,
        },
      },
    },
  },
];

describe('GroupChatDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders Error modal if userId is not in localStorage', () => {
    const toastSpy = vi.spyOn(toast, 'error');

    useLocalStorage().setItem('userId', null);

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('userChat.Error')).toBeInTheDocument();
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith('userChat.userNotFound');
  });

  it('renders correctly without name and image', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('userChat.groupInfo')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('renders correctly', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('cancelling editing chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('cancelEditBtn')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('cancelEditBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('edit chat title without photo', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('chatNameInput')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('chatNameInput'), {
        target: { value: 'Group name' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('edit chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('chatNameInput')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('chatNameInput'), {
        target: { value: 'New Group name' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('add user to group chat using first name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();
    await act(async () => {
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: 'Disha' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('addUserBtn'));
    });
  });

  it('add user to group chat using last name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();
    await act(async () => {
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: ' Smith' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('addUserBtn'));
    });
  });

  it('handling invalid image type', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await act(async () => {
      fireEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput');

    Object.defineProperty(fileInput, 'files', {
      value: null,
    });

    fireEvent.change(fileInput);
  });

  it('update group chat image', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await act(async () => {
      fireEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput');
    const smallFile = new File(['small-file-content'], 'small-file.jpg'); // Small file

    Object.defineProperty(fileInput, 'files', {
      value: [smallFile],
    });

    fireEvent.change(fileInput);

    await wait();
  });
});

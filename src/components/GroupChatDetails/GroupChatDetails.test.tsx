import React from 'react';
import {
  render,
  screen,
  // fireEvent,
  // waitFor,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
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

const { setItem } = useLocalStorage();

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

const mockChat = {
  _id: '1',
  isGroup: true,
  name: 'Test Group',
  image: '',
  messages: [],
  admins: [
    {
      _id: 'hbjguyt7y9890i9otyugttiyuh',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
    },
  ],
  users: [
    {
      _id: 'hbjguyt7y9890i9otyugttiyuh',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
    },
    {
      _id: 'gjhnbbjku68979089ujhvserty',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    },
  ],
  unseenMessagesByUsers: JSON.parse(
    '{"hbjguyt7y9890i9otyugttiyuh": 0, "gjhnbbjku68979089ujhvserty": 0}',
  ),
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
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              _id: '6589389d2caa9d8d69087487',
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
              firstName: 'Deanne',
              lastName: 'Marks',
              image: null,
              _id: '6589389d2caa9d8d69087487',
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
      query: ADD_USER_TO_GROUP_CHAT,
      variables: { userId: '6589389d2caa9d8d69087487', chatId: '1' },
    },
    result: {
      data: {
        addUserToGroupChat: {
          _id: '1',
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { _id: '1', image: '', name: 'New Group name' } },
    },
    result: {
      data: {
        updateChat: {
          _id: '1',
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
          _id: '1',
          success: true,
        },
      },
    },
  },
];

describe('GroupChatDetails', () => {
  it('renders correctly', async () => {
    const chat = {
      _id: '1',
      isGroup: true,
      name: 'Test Group',
      image: '',
      messages: [],
      admins: [],
      users: [],
      unseenMessagesByUsers: JSON.parse(
        '{"hbjguyt7y9890i9otyugttiyuh": 0, "gjhnbbjku68979089ujhvserty": 0}',
      ),
      description: 'Test Description',
    };
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={jest.fn()}
            groupChatDetailsModalisOpen={true}
            chat={chat}
            chatRefetch={jest.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('edit chat title', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={jest.fn()}
            groupChatDetailsModalisOpen={true}
            chat={mockChat}
            chatRefetch={jest.fn()}
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

  it('add user to group chat', async () => {
    setItem('userId', 'hbjguyt7y9890i9otyugttiyuh');
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={jest.fn()}
            groupChatDetailsModalisOpen={true}
            chat={mockChat}
            chatRefetch={jest.fn()}
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

    await wait(10000);
  });
  // test case for updating group chat image
  it('update group chat image', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={jest.fn()}
            groupChatDetailsModalisOpen={true}
            chat={mockChat}
            chatRefetch={jest.fn()}
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

    await wait(10000);
  });
});

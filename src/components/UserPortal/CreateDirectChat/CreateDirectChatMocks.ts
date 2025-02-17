import type { DocumentNode } from 'graphql';
import {
  CREATE_CHAT,
  MARK_CHAT_MESSAGES_AS_READ,
  MESSAGE_SENT_TO_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import {
  CHATS_LIST,
  CHAT_BY_ID,
  GROUP_CHAT_LIST,
  UNREAD_CHAT_LIST,
} from 'GraphQl/Queries/PlugInQueries';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';

interface InterfaceGQLMock {
  request: {
    query: DocumentNode;
    variables: Record<string, unknown>;
  };
  result: {
    data: Record<string, unknown>;
  };
}
const userWiltShepherd = {
  _id: '64378abd85008f171cf2990d',
  firstName: 'Wilt',
  lastName: 'Shepherd',
  image: null,
  email: 'testsuperadmin@example.com',
  createdAt: '2023-04-13T04:53:17.742Z',
  __typename: 'User',
};

const addressBronx = {
  city: 'Bronx',
  countryCode: 'US',
  dependentLocality: 'Some Dependent Locality',
  line1: '123 Random Street',
  line2: 'Apartment 456',
  postalCode: '10451',
  sortingCode: 'ABC-123',
  state: 'NYC',
  __typename: 'Address',
};

const addressQueens = {
  city: 'Queens',
  countryCode: 'US',
  dependentLocality: 'Some Dependent Locality',
  line1: '123 Coffee Street',
  line2: 'Apartment 501',
  postalCode: '11427',
  sortingCode: 'ABC-133',
  state: 'NYC',
  __typename: 'Address',
};

const addressStaten = {
  city: 'Staten Island',
  countryCode: 'US',
  dependentLocality: 'Some Dependent Locality',
  line1: '123 church Street',
  line2: 'Apartment 499',
  postalCode: '10301',
  sortingCode: 'ABC-122',
  state: 'NYC',
  __typename: 'Address',
};

const addressBrooklyn = {
  city: 'Brooklyn',
  countryCode: 'US',
  dependentLocality: 'Sample Dependent Locality',
  line1: '123 Main Street',
  line2: 'Apt 456',
  postalCode: '10004',
  sortingCode: 'ABC-789',
  state: 'NY',
  __typename: 'Address',
};

const orgBronx = {
  _id: '6437904485008f171cf29924',
  name: 'Unity Foundation',
  image: null,
  address: addressBronx,
  createdAt: '2023-04-13T05:16:52.827Z',
  creator: userWiltShepherd,
  __typename: 'Organization',
};

const orgQueens = {
  _id: '6537904485008f171cf29924',
  name: 'Unity Foundation',
  image: null,
  address: addressQueens,
  createdAt: '2023-04-13T05:16:52.827Z',
  creator: userWiltShepherd,
  __typename: 'Organization',
};

const orgStaten = {
  _id: '6637904485008f171cf29924',
  name: 'Unity Foundation',
  image: null,
  address: addressStaten,
  createdAt: '2023-04-13T05:16:52.827Z',
  creator: userWiltShepherd,
  __typename: 'Organization',
};

const orgBrooklyn = {
  _id: '6737904485008f171cf29924',
  name: 'Unity Foundation',
  image: null,
  address: addressBrooklyn,
  createdAt: '2023-04-13T05:16:52.827Z',
  creator: userWiltShepherd,
  __typename: 'Organization',
};

const userDeanneMarks = {
  firstName: 'Deanne',
  lastName: 'Marks',
  image: null,
  _id: '6589389d2caa9d8d69087487',
  email: 'testuser8@example.com',
  createdAt: '2023-04-13T04:53:17.742Z',
  organizationsBlockedBy: [],
  joinedOrganizations: [orgQueens, orgStaten, orgBrooklyn, orgBronx],
  __typename: 'User',
};

const appUserProfile = {
  _id: '64378abd85308f171cf2993d',
  adminFor: [],
  isSuperAdmin: false,
  createdOrganizations: [],
  createdEvents: [],
  eventAdmin: [],
  __typename: 'AppUserProfile',
};

const singleChat = {
  _id: '1',
  createdAt: '2345678903456',
  isGroup: false,
  creator: userWiltShepherd,
  organization: null,
  name: '',
  messages: [
    {
      _id: '345678',
      createdAt: '345678908765',
      messageContent: 'Hello',
      replyTo: null,
      media: null,
      type: 'STRING',
      sender: {
        _id: '2',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        image: '',
      },
    },
  ],
  users: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
    {
      _id: '2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      image: '',
    },
  ],
  admins: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
  ],
  unseenMessagesByUsers: JSON.stringify({ '1': 0, '2': 0 }),
};

// --------------------------------------------------------------------
// 1) UserConnectionListMock
// --------------------------------------------------------------------
export const UserConnectionListMock: InterfaceGQLMock[] = [
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: { firstName_contains: '', lastName_contains: '' },
    },
    result: {
      data: {
        users: [
          {
            user: userDeanneMarks,
            appUserProfile,
            __typename: 'UserData',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USERS_CONNECTION_LIST,
      variables: { firstName_contains: 'Disha', lastName_contains: '' },
    },
    result: {
      data: {
        users: [
          {
            user: userDeanneMarks,
            appUserProfile,
            __typename: 'UserData',
          },
        ],
      },
    },
  },
];

// --------------------------------------------------------------------
// 2) MESSAGE_SENT_TO_CHAT_MOCK
// --------------------------------------------------------------------
function makeMessageSentResult(_id: string): {
  data: {
    messageSentToChat: {
      _id: string;
      chatMessageBelongsTo: { _id: string };
      createdAt: string;
      messageContent: string;
      type: string;
      replyTo: null;
      sender: {
        _id: string;
        firstName: string;
        lastName: string;
        image: string;
      };
      updatedAt: string;
    };
  };
} {
  return {
    data: {
      messageSentToChat: {
        _id,
        chatMessageBelongsTo: { _id: '1' },
        createdAt: '2024-07-10T17:16:33.248Z',
        messageContent: 'Test ',
        type: 'STRING',
        replyTo: null,
        sender: {
          _id: '64378abd85008f171cf2990d',
          firstName: 'Wilt',
          lastName: 'Shepherd',
          image: '',
        },
        updatedAt: '2024-07-10',
      },
    },
  };
}

export const MESSAGE_SENT_TO_CHAT_MOCK: InterfaceGQLMock[] = [
  {
    request: { query: MESSAGE_SENT_TO_CHAT, variables: { userId: null } },
    result: makeMessageSentResult('668ec1f1364e03ac47a151'),
  },
  {
    request: { query: MESSAGE_SENT_TO_CHAT, variables: { userId: '2' } },
    result: makeMessageSentResult('668ec1f1df364e03ac47a151'),
  },
  {
    request: { query: MESSAGE_SENT_TO_CHAT, variables: { userId: '1' } },
    result: makeMessageSentResult('668ec1f13603ac4697a151'),
  },
];

// --------------------------------------------------------------------
// 3) CHAT_BY_ID_QUERY_MOCK
// --------------------------------------------------------------------
export const CHAT_BY_ID_QUERY_MOCK: InterfaceGQLMock[] = [
  {
    request: { query: CHAT_BY_ID, variables: { id: '1' } },
    result: { data: { chatById: singleChat } },
  },
  {
    request: { query: CHAT_BY_ID, variables: { id: '1' } },
    result: { data: { chatById: singleChat } },
  },
  {
    request: { query: CHAT_BY_ID, variables: { id: '' } },
    result: { data: { chatById: singleChat } },
  },
];

// --------------------------------------------------------------------
// 4) UNREAD_CHAT_LIST_QUERY_MOCK
// --------------------------------------------------------------------
const singleUnreadChat = { ...singleChat }; // same shape used repeatedly

export const UNREAD_CHAT_LIST_QUERY_MOCK: InterfaceGQLMock[] = [
  // No variables:
  {
    request: { query: UNREAD_CHAT_LIST, variables: {} },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: {} },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: {} },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: {} },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  // { id: '1' }
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: '1' } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: '1' } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: '1' } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: '1' } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  // { id: null }
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: null } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
  {
    request: { query: UNREAD_CHAT_LIST, variables: { id: null } },
    result: { data: { getUnreadChatsByUserId: singleUnreadChat } },
  },
];

// --------------------------------------------------------------------
// 5) GROUP_CHAT_BY_USER_ID_QUERY_MOCK
// --------------------------------------------------------------------
const singleGroupChat = {
  _id: '1',
  createdAt: '2345678903456',
  isGroup: false,
  creator: userWiltShepherd,
  organization: null,
  name: '',
  messages: [
    {
      _id: '345678',
      createdAt: '345678908765',
      messageContent: 'Hello',
      replyTo: null,
      media: null,
      type: 'STRING',
      sender: {
        _id: '2',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        image: '',
      },
    },
  ],
  users: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
    {
      _id: '2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      image: '',
    },
  ],
  admins: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
  ],
  unseenMessagesByUsers: JSON.stringify({ '1': 0, '2': 0 }),
};

export const GROUP_CHAT_BY_USER_ID_QUERY_MOCK: InterfaceGQLMock[] = [
  {
    request: { query: GROUP_CHAT_LIST, variables: {} },
    result: { data: { getGroupChatsByUserId: singleGroupChat } },
  },
  {
    request: { query: GROUP_CHAT_LIST, variables: {} },
    result: { data: { getGroupChatsByUserId: singleGroupChat } },
  },
  {
    request: { query: GROUP_CHAT_LIST, variables: {} },
    result: { data: { getGroupChatsByUserId: singleGroupChat } },
  },
];

// --------------------------------------------------------------------
// 6) CHATS_LIST_MOCK
//    We'll define a helper for repeated "group chat" objects
// --------------------------------------------------------------------
function makeTestGroupChat(
  idSuffix: string,
  isAdminsEmpty?: boolean,
): {
  _id: string;
  isGroup: boolean;
  image: string | null;
  creator: typeof userWiltShepherd;
  organization: { _id: string; name: string };
  createdAt: string;
  name: string;
  messages: {
    _id: string;
    createdAt: string;
    messageContent: string;
    replyTo: null;
    media: null;
    type: string;
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
    };
  }[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  }[];
  admins: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  }[];
  unseenMessagesByUsers: string;
} {
  return {
    _id: `65844efc${idSuffix}`,
    isGroup: true,
    image: null,
    creator: userWiltShepherd,
    organization: { _id: 'pw3ertyuiophgfre45678', name: 'rtyu' },
    createdAt: '2345678903456',
    name: 'Test Group Chat',
    messages: [
      {
        _id: '345678',
        createdAt: '345678908765',
        messageContent: 'Hello',
        replyTo: null,
        media: null,
        type: 'STRING',
        sender: {
          _id: '2',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          image: '',
        },
      },
    ],
    users: [
      {
        _id: '1',
        firstName: 'Disha',
        lastName: 'Talreja',
        email: 'disha@example.com',
        image: '',
      },
      {
        _id: '2',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        image: '',
      },
      {
        _id: '3',
        firstName: 'Test',
        lastName: 'User1',
        email: 'test1@example.com',
        image: '',
      },
      {
        _id: '4',
        firstName: 'Test',
        lastName: 'User2',
        email: 'test2@example.com',
        image: '',
      },
      {
        _id: '5',
        firstName: 'Test',
        lastName: 'User4',
        email: 'test4@example.com',
        image: '',
      },
    ],
    admins: isAdminsEmpty
      ? []
      : [
          {
            _id: '1',
            firstName: 'Disha',
            lastName: 'Talreja',
            email: 'disha@example.com',
            image: '',
          },
        ],
    unseenMessagesByUsers: JSON.stringify({
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
    }),
  };
}

export const CHATS_LIST_MOCK: InterfaceGQLMock[] = [
  // Variation 1: { id: null }, with second chat having empty admins
  {
    request: { query: CHATS_LIST, variables: { id: null } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dd40fgh03db811c4'), // normal
          makeTestGroupChat('814ddgh4003db811c4', true), // empty admins
        ],
      },
    },
  },
  // Variation 2: repeat
  {
    request: { query: CHATS_LIST, variables: { id: null } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dd40fgh03db811c4'),
          makeTestGroupChat('814ddgh4003db811c4', true),
        ],
      },
    },
  },
  // Variation 3: repeat
  {
    request: { query: CHATS_LIST, variables: { id: null } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dd40fgh03db811c4'),
          makeTestGroupChat('814ddgh4003db811c4', true),
        ],
      },
    },
  },
  // Variation 4: { id: '' } has different second chat ID
  {
    request: { query: CHATS_LIST, variables: { id: '' } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dd4003db811c4'),
          makeTestGroupChat('ujhgtrdtyuiop'),
        ],
      },
    },
  },
  // Variation 5: { id: '1' } -> different suffixes
  {
    request: { query: CHATS_LIST, variables: { id: '1' } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dhjmkdftyd4003db811c4'),
          makeTestGroupChat('814dd4003db811c4'),
        ],
      },
    },
  },
  // Variation 6: repeat
  {
    request: { query: CHATS_LIST, variables: { id: '1' } },
    result: {
      data: {
        chatsByUserId: [
          makeTestGroupChat('814dhjmkdftyd4003db811c4'),
          makeTestGroupChat('814dd4003db811c4'),
        ],
      },
    },
  },
];

// --------------------------------------------------------------------
// 7) GROUP_CHAT_BY_ID_QUERY_MOCK
// --------------------------------------------------------------------
const groupChatByIdObj = {
  _id: '65844efc814dd4003db811c4',
  isGroup: true,
  image: null,
  creator: userWiltShepherd,
  organization: { _id: 'pw3ertyuiophgfre45678', name: 'rtyu' },
  createdAt: '2345678903456',
  name: 'Test Group Chat',
  messages: [
    {
      _id: '345678',
      createdAt: '345678908765',
      messageContent: 'Hello',
      replyTo: null,
      media: null,
      type: 'STRING',
      sender: {
        _id: '2',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        image: '',
      },
    },
  ],
  users: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
    {
      _id: '2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      image: '',
    },
    {
      _id: '3',
      firstName: 'Test',
      lastName: 'User1',
      email: 'test1@example.com',
      image: '',
    },
    {
      _id: '4',
      firstName: 'Test',
      lastName: 'User2',
      email: 'test2@example.com',
      image: '',
    },
    {
      _id: '5',
      firstName: 'Test',
      lastName: 'User4',
      email: 'test4@example.com',
      image: '',
    },
  ],
  admins: [
    {
      _id: '1',
      firstName: 'Disha',
      lastName: 'Talreja',
      email: 'disha@example.com',
      image: '',
    },
  ],
  unseenMessagesByUsers: JSON.stringify({
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
  }),
};

export const GROUP_CHAT_BY_ID_QUERY_MOCK: InterfaceGQLMock[] = [
  {
    request: { query: CHAT_BY_ID, variables: { id: '' } },
    result: { data: { chatById: groupChatByIdObj } },
  },
];

// --------------------------------------------------------------------
// 8) CREATE_CHAT_MUTATION_MOCK
// --------------------------------------------------------------------
export const CREATE_CHAT_MUTATION_MOCK: InterfaceGQLMock[] = [
  {
    request: {
      query: CREATE_CHAT,
      variables: {
        organizationId: undefined,
        userIds: ['1', '6589389d2caa9d8d69087487'],
        isGroup: false,
      },
    },
    result: {
      data: {
        createChat: {
          _id: '1',
          createdAt: '2345678903456',
          isGroup: false,
          creator: userWiltShepherd,
          organization: null,
          name: '',
          messages: [
            {
              _id: '345678',
              createdAt: '345678908765',
              messageContent: 'Hello',
              replyTo: null,
              type: 'STRING',
              media: null,
              sender: {
                _id: '2',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: '',
              },
            },
          ],
          users: [
            {
              _id: '1',
              firstName: 'Disha',
              lastName: 'Talreja',
              email: 'disha@example.com',
              image: '',
            },
            {
              _id: '2',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              image: '',
            },
          ],
          unseenMessagesByUsers: JSON.stringify({ '1': 1, '2': 1 }),
        },
      },
    },
  },
];

// --------------------------------------------------------------------
// 9) MARK_CHAT_MESSAGES_AS_READ_MOCK
// --------------------------------------------------------------------
function makeMarkAsReadMock(
  userId: string | null,
  chatId: string,
): InterfaceGQLMock {
  return {
    request: {
      query: MARK_CHAT_MESSAGES_AS_READ,
      variables: { userId, chatId },
    },
    result: { data: { markChatMessagesAsRead: { _id: '1' } } },
  };
}

export const MARK_CHAT_MESSAGES_AS_READ_MOCK: InterfaceGQLMock[] = [
  makeMarkAsReadMock(null, ''),
  makeMarkAsReadMock(null, ''),
  makeMarkAsReadMock(null, ''),
  makeMarkAsReadMock(null, ''),
  makeMarkAsReadMock('1', ''),
  makeMarkAsReadMock('1', ''),
];

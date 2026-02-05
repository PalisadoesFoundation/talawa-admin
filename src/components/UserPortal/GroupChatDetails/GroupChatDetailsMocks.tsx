import type {
  Chat as ChatType,
  InterfaceChatUser,
  InterfaceMockMessage,
} from 'types/UserPortal/Chat/interface';
import {
  CREATE_CHAT_MEMBERSHIP,
  UPDATE_CHAT,
  UPDATE_CHAT_MEMBERSHIP,
  DELETE_CHAT_MEMBERSHIP,
  DELETE_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_MEMBERS } from 'GraphQl/Queries/OrganizationQueries';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';

/**
 * Mocks for the GroupChatDetails component
 */

const createMemberSearchMock = (searchTerm: string) => ({
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'org123' },
      first: 20,
      after: null,
      where: { name_contains: searchTerm },
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  },
});

const createMemberSearchMockWithResult = (searchTerm: string) => ({
  request: {
    query: ORGANIZATION_MEMBERS,
    variables: {
      input: { id: 'org123' },
      first: 20,
      after: null,
      where: { name_contains: searchTerm },
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            {
              cursor: 'cursor-1',
              node: {
                id: 'user3',
                name: 'Disha Smith',
                avatarURL: undefined,
                role: 'Member',
              },
            },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    },
  },
});

function createUser(
  id: string,
  firstName: string,
  lastName: string,
  email: string,
): InterfaceChatUser {
  return {
    _id: id,
    firstName,
    lastName,
    email,
    createdAt: dayjs().toDate(),
  };
}

function createMessage(
  id: string,
  sender: InterfaceChatUser,
  content: string,
  replyTo?: InterfaceMockMessage,
  media?: string,
): InterfaceMockMessage {
  return {
    _id: id,
    createdAt: dayjs().toDate(),
    sender,
    messageContent: content,
    replyTo,
    updatedAt: dayjs().toDate(),
    media,
  };
}

const alice = createUser(
  'user1',
  'Alice',
  'Johnson',
  'alice.johnson@example.com',
);
const bob = createUser('user2', 'Bob', 'Williams', 'bob.williams@example.com');

const MockDirectMessageNR = createMessage(
  'message1',
  bob,
  'Just checking in',
  undefined,
  'https://example.com/media/image1.jpg',
);
const MockDirectMessage = createMessage(
  'message2',
  alice,
  'Hi Bob, how are you?',
  MockDirectMessageNR,
  'https://example.com/media/image2.jpg',
);

const createGroupChat = (
  id: string,
  name: string,
  image: string,
  users: InterfaceChatUser[],
  messages: InterfaceMockMessage[],
): ChatType => {
  const admins = users.filter((u) => u._id === 'user1'); // Alice is admin

  return {
    id: id,
    name: name,
    description: 'Test Description',
    avatarURL: image || undefined,
    avatarMimeType: undefined,
    isGroup: true,
    createdAt: dayjs().toDate().toISOString(),
    updatedAt: undefined,
    members: {
      edges: users.map((user) => ({
        node: {
          user: {
            id: user._id,
            name: user.firstName + (user.lastName ? ' ' + user.lastName : ''),
            avatarURL: undefined,
            avatarMimeType: undefined,
          },
          role: admins.some((a) => a._id === user._id)
            ? 'administrator'
            : 'regular',
        },
      })),
    },
    messages: {
      edges: messages.map((msg) => ({
        node: {
          id: msg._id,
          body: msg.messageContent,
          createdAt: msg.createdAt.toISOString(),
          updatedAt: msg.updatedAt.toISOString(),
          creator: {
            id: msg.sender._id,
            name: msg.sender.firstName,
            avatarURL: undefined,
            avatarMimeType: undefined,
          },
          parentMessage: msg.replyTo
            ? {
                id: msg.replyTo._id,
                body: msg.replyTo.messageContent,
                createdAt: msg.replyTo.createdAt.toISOString(),
                creator: {
                  id: msg.replyTo.sender._id,
                  name: msg.replyTo.sender.firstName,
                },
              }
            : null,
        },
      })),
    },
    unreadMessagesCount: 0,
    lastMessage: undefined,
    organization: { id: 'org123', name: 'Test Org' },
  };
};

export const filledMockChat = createGroupChat(
  'chat1',
  'Test Group',
  'https://example.com/group_image.jpg',
  [alice, bob],
  [MockDirectMessageNR, MockDirectMessage],
);
export const incompleteMockChat = createGroupChat(
  'chat1',
  '',
  '',
  [alice, bob],
  [MockDirectMessageNR, MockDirectMessage],
);

export const mocks = [
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
            user: createUser('user3', 'Disha', 'Smith', 'disha@example.com'),
            appUserProfile: {
              _id: 'profile1',
              adminFor: [],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
            },
          },
        ],
      },
    },
  },
  // Intermediate mocks for 'Disha'
  createMemberSearchMock('D'),
  createMemberSearchMock('Di'),
  createMemberSearchMock('Dis'),
  createMemberSearchMock('Dish'),
  createMemberSearchMockWithResult('Disha'),

  // Organization members mock for name search 'Disha'
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: {
        input: { id: 'org123' },
        first: 20,
        after: null,
        where: { name_contains: 'Disha' },
      },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Intermediate mocks for 'Smith'
  createMemberSearchMock('S'),
  createMemberSearchMock('Sm'),
  createMemberSearchMock('Smi'),
  createMemberSearchMock('Smit'),
  createMemberSearchMockWithResult('Smith'),

  // Organization members mock for name search 'Disha' - duplicate for multiple calls
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: {
        input: { id: 'org123' },
        first: 20,
        after: null,
        where: { name_contains: 'Disha' },
      },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Organization members mock for name search 'Smith' - duplicate for multiple calls
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: {
        input: { id: 'org123' },
        first: 20,
        after: null,
        where: { name_contains: 'Smith' },
      },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Organization members mock for name search 'Smith'
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: {
        input: { id: 'org123' },
        first: 20,
        after: null,
        where: { name_contains: 'Smith' },
      },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Mock for ORGANIZATION_MEMBERS used by GroupChatDetails when opening the add-user modal
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: { input: { id: 'org123' }, first: 20, after: null, where: {} },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Mock for ORGANIZATION_MEMBERS used by GroupChatDetails for clearing search (duplicate)
  {
    request: {
      query: ORGANIZATION_MEMBERS,
      variables: { input: { id: 'org123' }, first: 20, after: null, where: {} },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                cursor: 'cursor-1',
                node: {
                  id: 'user3',
                  name: 'Disha Smith',
                  avatarURL: undefined,
                  role: 'Member',
                },
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  // Mock for creating chat membership (adding a user)
  {
    request: {
      query: CREATE_CHAT_MEMBERSHIP,
      variables: {
        input: { memberId: 'user3', chatId: 'chat1', role: 'regular' },
      },
    },
    result: { data: { createChatMembership: { id: 'chat1', success: true } } },
  },
  // Mock for update triggered by MinIO upload (object1)
  {
    request: {
      query: UPDATE_CHAT,
      variables: {
        input: { id: 'chat1', avatar: { uri: 'object1' }, name: 'Test Group' },
      },
    },
    result: { data: { updateChat: { id: 'chat1', success: true } } },
  },
  // Mock for updating chat membership (role change)
  {
    request: {
      query: UPDATE_CHAT_MEMBERSHIP,
      variables: {
        input: { memberId: 'user2', chatId: 'chat1', role: 'administrator' },
      },
    },
    result: { data: { updateChatMembership: { id: 'chat1', success: true } } },
  },
  // Fallback mock for updating chat membership
  {
    request: { query: UPDATE_CHAT_MEMBERSHIP },
    result: { data: { updateChatMembership: { id: 'chat1', success: true } } },
  },
  // Mock for deleting chat membership (remove member)
  {
    request: {
      query: DELETE_CHAT_MEMBERSHIP,
      variables: { input: { memberId: 'user2', chatId: 'chat1' } },
    },
    result: { data: { deleteChatMembership: { id: 'chat1', success: true } } },
  },
  // Accept updateChat with id instead of _id to match component usage
  {
    request: {
      query: UPDATE_CHAT,
      variables: {
        input: { id: 'chat1', avatar: { uri: '' }, name: 'Group name' },
      },
    },
    result: { data: { updateChat: { id: 'chat1', success: true } } },
  },
  // Specific mock for name-only update triggered by editTitle flow
  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { id: 'chat1', name: 'New Group name' } },
    },
    result: { data: { updateChat: { id: 'chat1', success: true } } },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: {
        input: {
          id: 'chat1',
          avatar: { uri: 'https://example.com/group_image.jpg' },
          name: 'New Group name',
        },
      },
    },
    result: { data: { updateChat: { id: 'chat1', success: true } } },
  },
  // Fallback mock for any other UPDATE_CHAT variables (no variables -> matches any)
  {
    request: { query: UPDATE_CHAT },
    result: { data: { updateChat: { id: 'chat3', success: true } } },
  },
  // Mock for deleting chat
  {
    request: {
      query: DELETE_CHAT,
      variables: { input: { id: 'chat1' } },
    },
    result: { data: { deleteChat: { id: 'chat1', success: true } } },
  },
];

export const failingMocks = [
  // Mock for role update failure
  {
    request: {
      query: UPDATE_CHAT_MEMBERSHIP,
      variables: {
        input: { memberId: 'user2', chatId: 'chat1', role: 'administrator' },
      },
    },
    error: new Error('Failed to update role'),
  },
  // Mock for member removal failure
  {
    request: {
      query: DELETE_CHAT_MEMBERSHIP,
      variables: { input: { memberId: 'user2', chatId: 'chat1' } },
    },
    error: new Error('Failed to remove member'),
  },
  // Mock for chat deletion failure
  {
    request: {
      query: DELETE_CHAT,
      variables: { input: { id: 'chat1' } },
    },
    error: new Error('Failed to delete chat'),
  },
  // Mock for title update failure
  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { id: 'chat1', name: 'New Name' } },
    },
    error: new Error('Failed to update chat name'),
  },
  // Mock for image update failure
  {
    request: {
      query: UPDATE_CHAT,
      variables: {
        input: { id: 'chat1', avatar: { uri: 'object1' }, name: 'Test Group' },
      },
    },
    error: new Error('Failed to update chat image'),
  },
  // Mock for adding user failure
  {
    request: {
      query: CREATE_CHAT_MEMBERSHIP,
      variables: {
        input: { memberId: 'user3', chatId: 'chat1', role: 'regular' },
      },
    },
    error: new Error('Failed to add user'),
  },
];

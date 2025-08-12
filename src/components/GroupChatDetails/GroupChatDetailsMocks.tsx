import type { GroupChat, DirectMessage } from 'types/Chat/type';
import {
  ADD_USER_TO_GROUP_CHAT,
  UPDATE_CHAT,
} from 'GraphQl/Mutations/OrganizationMutations';
import { USERS_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
/**
 * Mocks for the GroupChatDetails component
 */

interface InterfaceChatUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

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
    createdAt: new Date('2024-10-27T10:00:00.000Z'),
  };
}

function createMessage(
  id: string,
  sender: InterfaceChatUser,
  content: string,
  replyTo?: DirectMessage,
  media?: string,
): DirectMessage {
  return {
    _id: id,
    createdAt: new Date('2024-10-27T10:00:00.000Z'),
    sender,
    messageContent: content,
    replyTo,
    updatedAt: new Date('2024-10-27T10:00:00.000Z'),
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
  messages: DirectMessage[],
): GroupChat => ({
  _id: id,
  isGroup: true,
  name,
  image,
  messages,
  admins: [alice],
  users,
  unseenMessagesByUsers: JSON.parse('{"user1": 0, "user2": 1}'),
  description: 'Test Description',
  createdAt: new Date('2024-10-27T10:00:00.000Z'),
});

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
  {
    request: {
      query: ADD_USER_TO_GROUP_CHAT,
      variables: { chatId: 'chat1' }, // Match test variables
    },
    result: { data: { addUserToGroupChat: { _id: 'chat1', success: true } } },
  },
  {
    request: {
      query: UPDATE_CHAT,
      variables: { input: { _id: 'chat1', image: '', name: 'Group name' } },
    },
    result: { data: { updateChat: { _id: 'chat1', success: true } } },
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
    result: { data: { updateChat: { _id: 'chat2', success: true } } },
  },
  {
    request: { query: UPDATE_CHAT, variables: {} },
    result: { data: { updateChat: { _id: 'chat3', success: true } } },
  },
];

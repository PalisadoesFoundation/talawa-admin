import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_SPAM_NOTIFICATION_MUTATION } from 'GraphQl/Mutations/mutations';

// Has no placeholder image
export const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            location: 'New Delhi',
            apiUrl: 'www.dummyWebsite.com',
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: {
              _id: '789',
              firstName: 'Steve',
              lastName: 'Smith',
              email: 'stevesmith@gmail.com',
            },
            isPublic: true,
            visibleInSearch: false,
            spamCount: [
              {
                _id: '6954',
                user: {
                  _id: '878',
                  firstName: 'Joe',
                  lastName: 'Root',
                  email: 'joeroot@gmail.com',
                },
                isReaded: false,
                groupchat: {
                  _id: '321',
                  title: 'Dummy',
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_SPAM_NOTIFICATION_MUTATION,
      variables: { orgId: undefined, spamId: '6954', isReaded: true },
    },
    result: {
      data: {
        updateSpamNotification: {
          _id: '900',
        },
      },
    },
  },
];

// Has a placeholder image
export const MOCKS_WITH_IMAGE = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 1,
            image: 'https://via.placeholder.com/45x45',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            location: 'New Delhi',
            apiUrl: 'www.dummyWebsite.com',
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: {
              _id: '789',
              firstName: 'Steve',
              lastName: 'Smith',
              email: 'stevesmith@gmail.com',
            },
            isPublic: true,
            visibleInSearch: false,
            spamCount: [
              {
                _id: '6954',
                user: {
                  _id: '878',
                  firstName: 'Joe',
                  lastName: 'Root',
                  email: 'joeroot@gmail.com',
                },
                isReaded: false,
                groupchat: {
                  _id: '321',
                  title: 'Dummy',
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_SPAM_NOTIFICATION_MUTATION,
      variables: { orgId: undefined, spamId: '6954', isReaded: true },
    },
    result: {
      data: {
        updateSpamNotification: {
          _id: '900',
        },
      },
    },
  },
];

import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            name: 'Palisadoes',
            description: 'Equitable Access to STEM Education Jobs',
            address: {
              city: 'Kingston',
              countryCode: 'JM',
              dependentLocality: 'Sample Dependent Locality',
              line1: '123 Jamaica Street',
              line2: 'Apartment 456',
              postalCode: 'JM12345',
              sortingCode: 'ABC-123',
              state: 'Kingston Parish',
            },
            userRegistrationRequired: true,
            visibleInSearch: false,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@example.com',
            },
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
                createdAt: '12-03-2024',
              },
            ],
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variables: {
        id: '123',
        name: 'Updated Organization',
        description: 'This is an updated test organization',
        address: {
          city: 'Kingston',
          countryCode: 'JM',
          dependentLocality: 'Sample Dependent Locality',
          line1: '123 Jamaica Street',
          line2: 'Apartment 456',
          postalCode: 'JM12345',
          sortingCode: 'ABC-123',
          state: 'Kingston Parish',
        },
        image: new File(['hello'], 'hello.png', { type: 'image/png' }),
        userRegistrationRequired: true,
        visibleInSearch: false,
      },
    },
    result: {
      data: {
        updateOrganization: {
          _id: '123',
          name: 'Updated Organization',
          description: 'This is an updated test organization',
          address: {
            city: 'Kingston',
            countryCode: 'JM',
            dependentLocality: 'Sample Dependent Locality',
            line1: '123 Jamaica Street',
            line2: 'Apartment 456',
            postalCode: 'JM12345',
            sortingCode: 'ABC-123',
            state: 'Kingston Parish',
          },
          userRegistrationRequired: true,
          visibleInSearch: false,
        },
      },
    },
  },
];

export const MOCKS_ERROR_ORGLIST = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_UPDATE_ORGLIST = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            image: null,
            name: 'Palisadoes',
            description: 'Equitable Access to STEM Education Jobs',
            address: {
              city: 'Kingston',
              countryCode: 'JM',
              dependentLocality: 'Sample Dependent Locality',
              line1: '123 Jamaica Street',
              line2: 'Apartment 456',
              postalCode: 'JM12345',
              sortingCode: 'ABC-123',
              state: 'Kingston Parish',
            },
            userRegistrationRequired: true,
            visibleInSearch: false,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@example.com',
            },
            members: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            admins: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
                createdAt: '12-03-2024',
              },
            ],
            membershipRequests: {
              _id: '456',
              user: {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'samsmith@gmail.com',
              },
            },
            blockedUsers: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variables: {
        id: '123',
        name: 'Updated Organization',
        description: 'This is an updated test organization',
        address: {
          city: 'Kingston',
          countryCode: 'JM',
          dependentLocality: 'Sample Dependent Locality',
          line1: '123 Jamaica Street',
          line2: 'Apartment 456',
          postalCode: 'JM12345',
          sortingCode: 'ABC-123',
          state: 'Kingston Parish',
        },
        image: new File(['hello'], 'hello.png', { type: 'image/png' }),
        userRegistrationRequired: true,
        visibleInSearch: false,
      },
    },
    erorr: new Error('Mock Graphql Updating Organization Error'),
  },
];

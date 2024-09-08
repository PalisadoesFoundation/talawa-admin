import {
  ACTION_ITEM_CATEGORY_LIST,
  AGENDA_ITEM_CATEGORY_LIST,
  IS_SAMPLE_ORGANIZATION_QUERY,
  ORGANIZATION_CUSTOM_FIELDS,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            image: null,
            creator: {
              firstName: 'Wilt',
              lastName: 'Shepherd',
              email: 'testsuperadmin@example.com',
              __typename: 'User',
            },
            name: 'Unity Foundation',
            description:
              'A foundation aimed at uniting the world and making it a better place for all.',
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
            userRegistrationRequired: false,
            visibleInSearch: true,
            members: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                __typename: 'User',
              },
            ],
            admins: [
              {
                _id: '64378abd85008f171cf2990d',
                firstName: 'Wilt',
                lastName: 'Shepherd',
                email: 'testsuperadmin@example.com',
                createdAt: '2023-04-13T04:53:17.742Z',
                __typename: 'User',
              },
            ],
            membershipRequests: [],
            blockedUsers: [],
            __typename: 'Organization',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CUSTOM_FIELDS,
      variables: { customFieldsByOrganizationId: 'orgId' },
    },
    result: {
      data: {
        customFieldsByOrganization: [
          {
            _id: 'adsdasdsa334343yiu423434',
            type: 'fieldType',
            name: 'fieldName',
          },
        ],
      },
    },
  },
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
      variables: { isSampleOrganizationId: 'orgId' },
    },
    result: {
      data: {
        isSampleOrganization: false,
      },
    },
  },

  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: 'orgId' },
    },
    result: {
      data: {
        agendaItemCategoriesByOrganization: [],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: {
          name_contains: '',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'actionItemCategoryId1',
            name: 'Test 3',
            isDisabled: false,
            createdAt: '2024-08-25',
            creator: {
              _id: '64378abd85008f171cf2990d',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              __typename: 'User',
            },
            __typename: 'ActionItemCategory',
          },
        ],
      },
    },
  },
];

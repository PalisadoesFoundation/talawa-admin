import dayjs from 'dayjs';
import {
  ACTION_ITEM_CATEGORY_LIST,
  AGENDA_ITEM_CATEGORY_LIST,
  IS_SAMPLE_ORGANIZATION_QUERY,
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
                createdAt: dayjs().subtract(1, 'year').toISOString(),
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
            createdAt: dayjs()
              .subtract(1, 'year')
              .month(7)
              .date(25)
              .format('YYYY-MM-DD'),
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

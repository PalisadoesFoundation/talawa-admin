import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/AgendaCategoryMutations';

import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';

export const MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: '123',
        where: {
          name_contains: '',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_MUTATION = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: '123',
        where: {
          name_contains: '',
        },
      },
    },
    result: {
      data: {
        agendaItemCategoriesByOrganization: [
          {
            _id: 'agendaItemCategory1',
            name: 'Category',
            description: 'Test Description',
            createdBy: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          organizationId: '123',
          name: 'Category',
          description: 'Test Description',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

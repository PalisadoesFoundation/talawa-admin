import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/AgendaCategoryMutations';

import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';

export const MOCKS = [
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
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: '123',
        where: {
          name_contains: 'Category',
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
    result: {
      data: {
        createAgendaCategory: {
          _id: 'agendaItemCategory1',
        },
      },
    },
  },
];

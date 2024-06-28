import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/AgendaItemMutations';

import { AgendaItemByEvent } from 'GraphQl/Queries/AgendaItemQueries';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';
export const MOCKS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '111' },
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
      query: AgendaItemByEvent,
      variables: { relatedEventId: '123' },
    },
    result: {
      data: {
        agendaItemByEvent: [
          {
            _id: 'agendaItem1',
            title: 'AgendaItem 1',
            description: 'AgendaItem 1 Description',
            duration: '2h',
            attachments: ['attachment1'],
            createdBy: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            urls: [],
            users: [],
            sequence: 1,
            categories: [
              {
                _id: 'category1',
                name: 'Category 1',
              },
            ],
            organization: {
              _id: 'org1',
              name: 'Unity Foundation',
            },
            relatedEvent: {
              _id: 'event1',
              title: 'Aerobics for Everyone',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          title: 'item',
          description: 'test description',
          duration: '30',
          relatedEventId: '123',
          organizationId: '111',
          sequence: 2, // Ensure sequence is included in the input
          categories: ['category'],
          attachments: [],
          urls: [],
        },
      },
    },
    result: {
      data: {
        createAgendaItem: {
          _id: 'agendaItem2',
        },
      },
    },
  },
];

export const MOCKS_ERROR_MUTATION = [
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          title: 'AgendaItem 1',
          description: 'AgendaItem 1 Description',
          duration: '2h',
          attachments: ['attachment1'],
          relatedEvent: 'event1',
          urls: [],
          users: [],
          categories: ['category1'],
          sequence: 1,
          organizationId: 'org1',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_QUERY = [
  {
    request: {
      query: AgendaItemByEvent,
      variables: { relatedEventId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '111' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

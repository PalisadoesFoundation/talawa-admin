import { CREATE_AGENDA_ITEM_MUTATION } from 'GraphQl/Mutations/AgendaItemMutations';

import { AgendaItemByEvent } from 'GraphQl/Queries/AgendaItemQueries';
import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';

const baseCategoryList = [
  {
    _id: 'agendaItemCategory1',
    name: 'Category 1',
    description: 'Test Description',
    createdBy: {
      _id: 'user0',
      firstName: 'Wilt',
      lastName: 'Shepherd',
    },
  },
];

const baseAgendaItems = [
  {
    _id: 'agendaItem1',
    title: 'AgendaItem 1',
    description: 'AgendaItem 1 Description',
    duration: '30',
    attachments: [],
    createdBy: {
      _id: 'user0',
      firstName: 'Wilt',
      lastName: 'Shepherd',
    },
    urls: [],
    users: [],
    sequence: 1,
    categories: baseCategoryList.map((category) => ({
      ...category,
    })),
    organization: {
      _id: '111',
      name: 'Unity Foundation',
    },
    relatedEvent: {
      _id: '123',
      title: 'Aerobics for Everyone',
    },
  },
];

export const MOCKS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '111' },
    },
    result: {
      data: {
        agendaItemCategoriesByOrganization: baseCategoryList,
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
        agendaItemByEvent: baseAgendaItems,
      },
    },
  },
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          title: 'AgendaItem 1',
          description: 'AgendaItem 1 Description',
          duration: '30',
          relatedEventId: '123',
          organizationId: '111',
          sequence: 2,
          categories: ['agendaItemCategory1'],
          attachments: [],
          urls: [],
        },
      },
    },
    result: {
      data: {
        createAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
];

export const MOCKS_ERROR_QUERY = [
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
            name: 'Category 1',
            description: 'Test Description',
            createdBy: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
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
    error: new Error('Mock Agenda Item Error'),
  },
];

export const MOCKS_EMPTY_AGENDA_ITEMS = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '111' },
    },
    result: {
      data: {
        agendaItemCategoriesByOrganization: baseCategoryList,
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
        agendaItemByEvent: [],
      },
    },
  },
];

export const MOCKS_CATEGORY_ERROR = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '111' },
    },
    error: new Error('Mock Agenda Category Error'),
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
            duration: '30',
            attachments: [],
            createdBy: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            urls: [],
            users: [],
            sequence: 1,
            categories: baseCategoryList,
            organization: {
              _id: '111',
              name: 'Unity Foundation',
            },
            relatedEvent: {
              _id: '123',
              title: 'Aerobics for Everyone',
            },
          },
        ],
      },
    },
  },
];

export const MOCKS_MUTATION_ERROR = [
  ...MOCKS.slice(0, 2),
  {
    request: {
      query: CREATE_AGENDA_ITEM_MUTATION,
      variables: {
        input: {
          title: 'AgendaItem 1',
          description: 'AgendaItem 1 Description',
          duration: '30',
          relatedEventId: '123',
          organizationId: '111',
          sequence: 2,
          categories: ['agendaItemCategory1'],
          attachments: [],
          urls: [],
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

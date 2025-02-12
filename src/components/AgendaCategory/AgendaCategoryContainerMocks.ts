import { vi } from 'vitest';
import {
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
  DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/AgendaCategoryMutations';

type AgendaCategoryConnectionType = 'Organization';

export const props = {
  agendaCategoryConnection: 'Organization' as AgendaCategoryConnectionType,
  agendaCategoryData: [
    {
      _id: 'agendaCategory1',
      name: 'AgendaCategory 1',
      description: 'AgendaCategory 1 Description',
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
    {
      _id: 'agendaCategory2',
      name: 'AgendaCategory 2',
      description: 'AgendaCategory 2 Description',
      createdBy: {
        _id: 'user0',
        firstName: 'Wilt',
        lastName: 'Shepherd',
      },
    },
  ],
  agendaCategoryRefetch: vi.fn(),
};

export const props2 = {
  agendaCategoryConnection: 'Organization' as AgendaCategoryConnectionType,
  agendaCategoryData: [],
  agendaCategoryRefetch: vi.fn(),
};

export const MOCKS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        updateAgendaCategoryId: 'agendaCategory1',
        input: {
          name: 'AgendaCategory 1 Edited',
          description: 'AgendaCategory 1 Description Edited',
        },
      },
    },
    result: {
      data: {
        updateAgendaCategory: {
          _id: 'agendaCategory1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        updateAgendaCategoryId: 'agendaCategory1',
        input: {
          name: 'AgendaCategory 1',
          description: 'AgendaCategory 1 Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaCategory: {
          _id: 'agendaCategory1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        updateAgendaCategoryId: 'agendaCategory2',
        input: {
          name: 'AgendaCategory 2 edited',
          description: 'AgendaCategory 2 Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaCategory: {
          _id: 'agendaCategory2',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        deleteAgendaCategoryId: 'agendaCategory1',
      },
    },
    result: {
      data: {
        deleteAgendaCategory: {
          _id: 'agendaCategory1',
        },
      },
    },
  },
];

export const MOCKS_ERROR_MUTATIONS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        updateAgendaCategoryId: 'agendaCategory1',
        input: {
          name: 'AgendaCategory 1 Edited',
          description: 'AgendaCategory 1 Description Edited',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        deleteAgendaCategoryId: 'agendaCategory1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

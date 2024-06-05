import {
  UPDATE_AGENDA_ITEM_CATEGORY_MUTATION,
  DELETE_AGENDA_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/AgendaCategoryMutations';

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
          name: 'AgendaCategory 2',
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

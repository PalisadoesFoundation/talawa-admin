import {
  UPDATE_AGENDA_ITEM_MUTATION,
  DELETE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/AgendaItemMutations';

export const MOCKS = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1 Edited',
          description: 'AgendaItem 1 Description Edited',
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1',
          description: 'AgendaItem 1 Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem2',
        input: {
          title: 'AgendaItem 2 edited',
          description: 'AgendaItem 2 Description',
        },
      },
    },
    result: {
      data: {
        updateAgendaItem: {
          _id: 'agendaItem2',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem1',
      },
    },
    result: {
      data: {
        removeAgendaItem: {
          _id: 'agendaItem1',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem2',
      },
    },
    result: {
      data: {
        removeAgendaItem: {
          _id: 'agendaItem2',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: UPDATE_AGENDA_ITEM_MUTATION,
      variables: {
        updateAgendaItemId: 'agendaItem1',
        input: {
          title: 'AgendaItem 1 Edited',
          description: 'AgendaItem 1 Description Edited',
        },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: DELETE_AGENDA_ITEM_MUTATION,
      variables: {
        removeAgendaItemId: 'agendaItem1',
      },
    },
    error: new Error('An error occurred'),
  },
];

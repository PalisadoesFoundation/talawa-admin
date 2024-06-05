import { CREATE_AGENDA_ITEM_CATEGORY_MUTATION } from 'GraphQl/Mutations/AgendaCategoryMutations';

import { AGENDA_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/AgendaCategoryQueries';

export const MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY = [
  {
    request: {
      query: AGENDA_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_MUTATION = [
  {
    request: {
      query: CREATE_AGENDA_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Test Name',
        description: 'Test Description',
        organizationId: '123',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

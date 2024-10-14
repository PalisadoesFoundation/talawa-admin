import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';

import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: '1',
            name: 'ActionItemCategory 1',
            isDisabled: false,
          },
          {
            _id: '2',
            name: 'ActionItemCategory 2',
            isDisabled: true,
          },
          {
            _id: '3',
            name: 'ActionItemCategory 3',
            isDisabled: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        name: 'ActionItemCategory 4',
        organizationId: '123',
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          _id: '4',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'ActionItemCategory 1 updated',
        actionItemCategoryId: '1',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: true,
        actionItemCategoryId: '1',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        actionItemCategoryId: '2',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: '2',
        },
      },
    },
  },
];

export const MOCKS_ERROR_QUERY = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_MUTATIONS = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: '1',
            name: 'ActionItemCategory 1',
            isDisabled: false,
          },
          {
            _id: '2',
            name: 'ActionItemCategory 2',
            isDisabled: true,
          },
          {
            _id: '3',
            name: 'ActionItemCategory 3',
            isDisabled: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        name: 'ActionItemCategory 4',
        organizationId: '123',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'ActionItemCategory 1 updated',
        actionItemCategoryId: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: true,
        actionItemCategoryId: '1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        isDisabled: false,
        actionItemCategoryId: '2',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

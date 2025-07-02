import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
  DELETE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/ActionItemCategoryMutations';

import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [
          {
            id: 'categoryId1',
            name: 'Category 1',
            isDisabled: false,
            creatorId: 'creatorId1',
            createdAt: '2024-08-26',
            updatedAt: '2024-08-26',
          },
          {
            id: 'categoryId2',
            name: 'Category 2',
            isDisabled: true,
            creatorId: 'creatorId2',
            createdAt: '2024-08-25',
            updatedAt: '2024-08-25',
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          name: 'Category 2',
          description: 'This is a test category',
          isDisabled: true,
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          id: 'categoryId3',
          name: 'Category 2',
          description: 'This is a test category',
          isDisabled: true,
          createdAt: '2044-01-01',
          creator: {
            id: 'userId',
          },
          organization: {
            id: 'orgId',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
          name: 'Category 2',
          isDisabled: true,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          id: 'categoryId',
          name: 'Category 2',
          isDisabled: true,
          updatedAt: '2044-01-01',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
          name: 'Category 2',
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          id: 'categoryId',
          name: 'Category 2',
          isDisabled: false,
          updatedAt: '2044-01-01',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
          isDisabled: true,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          id: 'categoryId',
          name: 'Category 1',
          isDisabled: true,
          updatedAt: '2044-01-01',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
        },
      },
    },
    result: {
      data: {
        deleteActionItemCategory: {
          id: 'categoryId',
          name: 'Category 1',
        },
      },
    },
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        actionCategoriesByOrganization: [],
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          name: 'Category 2',
          description: 'This is a test category',
          isDisabled: true,
          organizationId: 'orgId',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
          name: 'Category 2',
          isDisabled: true,
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

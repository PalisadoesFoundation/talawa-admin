import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
            __typename: 'ActionItemCategory',
            id: 'categoryId1',
            name: 'Category 1',
            description: 'Test description for category 1',
            isDisabled: false,
            creatorId: 'creatorId1',
            createdAt: dayjs.utc().toISOString(),
            updatedAt: dayjs.utc().toISOString(),
          },
          {
            __typename: 'ActionItemCategory',
            id: 'categoryId2',
            name: 'Category 2',
            description: null,
            isDisabled: true,
            creatorId: 'creatorId2',
            createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'day').toISOString(),
          },
        ],
      },
    },
  },
  // CREATE mutations for tests
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          name: 'New Category',
          description: 'New description',
          isDisabled: true,
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'newCategoryId1',
          name: 'New Category',
          description: 'New description',
          isDisabled: true,
          createdAt: dayjs.utc().toISOString(),
          creator: {
            __typename: 'User',
            id: 'userId',
          },
          organization: {
            __typename: 'Organization',
            id: 'orgId',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          name: 'New Category',
          description: null,
          isDisabled: false,
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'newCategoryId2',
          name: 'New Category',
          description: null,
          isDisabled: false,
          createdAt: dayjs.utc().toISOString(),
          creator: {
            __typename: 'User',
            id: 'userId',
          },
          organization: {
            __typename: 'Organization',
            id: 'orgId',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          name: 'Minimal Category',
          description: null,
          isDisabled: false,
          organizationId: 'orgId',
        },
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'newCategoryId3',
          name: 'Minimal Category',
          description: null,
          isDisabled: false,
          createdAt: dayjs.utc().toISOString(),
          creator: {
            __typename: 'User',
            id: 'userId',
          },
          organization: {
            __typename: 'Organization',
            id: 'orgId',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  // UPDATE mutations for single field changes
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
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Category 2',
          isDisabled: false,
          updatedAt: dayjs.utc().toISOString(),
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
          description: 'New description only',
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Category 1',
          isDisabled: false,
          updatedAt: dayjs.utc().toISOString(),
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
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Category 1',
          isDisabled: true,
          updatedAt: dayjs.utc().toISOString(),
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
          description: null,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Category 1',
          description: null,
          updatedAt: dayjs.utc().toISOString(),
        },
      },
    },
  },
  // UPDATE mutations for multiple field changes
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        input: {
          id: 'categoryId',
          name: 'Updated Name',
          description: 'Updated description',
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Updated Name',
          isDisabled: false,
          updatedAt: dayjs.utc().toISOString(),
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
          name: 'Updated Name',
          isDisabled: true,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Updated Name',
          isDisabled: true,
          updatedAt: dayjs.utc().toISOString(),
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
          description: 'Updated description',
          isDisabled: true,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Category 1',
          isDisabled: true,
          updatedAt: dayjs.utc().toISOString(),
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
          name: 'Completely New Name',
          description: 'Completely new description',
          isDisabled: true,
        },
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          __typename: 'ActionItemCategory',
          id: 'categoryId',
          name: 'Completely New Name',
          isDisabled: true,
          updatedAt: dayjs.utc().toISOString(),
        },
      },
    },
  },
  // DELETE mutation
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
          __typename: 'ActionItemCategory',
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
          name: 'New Category',
          description: 'New description',
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
          name: 'Updated Name',
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
          name: 'Updated Name',
          description: 'Updated description',
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

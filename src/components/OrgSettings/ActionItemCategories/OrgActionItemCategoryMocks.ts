import {
  CREATE_ACTION_ITEM_CATEGORY_MUTATION,
  UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
} from 'GraphQl/Mutations/mutations';

import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: '' },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'categoryId1',
            name: 'Category 1',
            isDisabled: false,
            createdAt: '2024-08-26',
            creator: {
              _id: 'creatorId1',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'categoryId2',
            name: 'Category 2',
            isDisabled: true,
            createdAt: '2024-08-25',
            creator: {
              _id: 'creatorId2',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: '' },
        orderBy: 'createdAt_ASC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'categoryId2',
            name: 'Category 2',
            isDisabled: true,
            createdAt: '2024-08-25',
            creator: {
              _id: 'creatorId2',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: 'categoryId1',
            name: 'Category 1',
            isDisabled: false,
            createdAt: '2024-08-26',
            creator: {
              _id: 'creatorId1',
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
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: '', is_disabled: false },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'categoryId1',
            name: 'Category 1',
            isDisabled: false,
            createdAt: '2024-08-26',
            creator: {
              _id: 'creatorId1',
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
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: '', is_disabled: true },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'categoryId2',
            name: 'Category 2',
            isDisabled: true,
            createdAt: '2024-08-25',
            creator: {
              _id: 'creatorId2',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: 'Category 1' },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'categoryId1',
            name: 'Category 1',
            isDisabled: false,
            createdAt: '2024-08-26',
            creator: {
              _id: 'creatorId1',
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
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 2',
        isDisabled: true,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createActionItemCategory: {
          _id: 'categoryId3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 2',
        isDisabled: true,
        actionItemCategoryId: 'categoryId',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: 'categoryId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 2',
        isDisabled: false,
        actionItemCategoryId: 'categoryId',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: 'categoryId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 1',
        isDisabled: true,
        actionItemCategoryId: 'categoryId',
      },
    },
    result: {
      data: {
        updateActionItemCategory: {
          _id: 'categoryId',
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
        organizationId: 'orgId',
        where: { name_contains: '' },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [],
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: {
        organizationId: 'orgId',
        where: { name_contains: '' },
        orderBy: 'createdAt_DESC',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 2',
        isDisabled: true,
        organizationId: 'orgId',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_CATEGORY_MUTATION,
      variables: {
        name: 'Category 2',
        isDisabled: true,
        actionItemCategoryId: 'categoryId',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

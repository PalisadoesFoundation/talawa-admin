import {
  CREATE_FUND_MUTATION,
  REMOVE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { ORGANIZATION_FUNDS } from 'GraphQl/Queries/OrganizationQueries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Test Fund',
        refrenceNumber: '1',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
        organizationId: undefined,
      },
    },
    result: {
      data: {
        createFund: {
          _id: '3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: '1',
        name: 'Fund 1Test Fund Updated',
      },
    },
    result: {
      data: {
        updateFund: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FUND_MUTATION,
      variables: {
        id: '1',
      },
    },
    result: {
      data: {
        removeFund: {
          _id: '1',
        },
      },
    },
  },
];
export const MOCKS_ERROR_ORGANIZATIONS_FUNDS = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        organizationId: '1',
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_ERROR_CREATE_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 3',
        refrenceNumber: '789',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
        organizationId: undefined,
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_ERROR_UPDATE_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 3',
        refrenceNumber: '789',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
        organizationId: undefined,
      },
    },
    result: {
      data: {
        createFund: {
          _id: '3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: undefined,
        name: 'Fund 1',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_ARCHIVED_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: '1',
        isArchived: true,
      },
    },
    result: {
      data: {
        updateFund: {
          _id: '1',
        },
      },
    },
  },
];
export const MOCKS_ERROR_ARCHIVED_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: '1',
        isArchived: true,
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_UNARCHIVED_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: true,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: '1',
        isArchived: false,
      },
    },
    result: {
      data: {
        updateFund: {
          _id: '1',
        },
      },
    },
  },
];
export const MOCKS_ERROR_UNARCHIVED_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '1',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: true,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: '1',
        isArchived: false,
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_ERROR_REMOVE_FUND = [
  {
    request: {
      query: ORGANIZATION_FUNDS,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            funds: [
              {
                _id: '3',
                name: 'Fund 1',
                refrenceNumber: '123',
                taxDeductible: true,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
              {
                _id: '2',
                name: 'Fund 2',
                refrenceNumber: '456',
                taxDeductible: false,
                isArchived: false,
                isDefault: false,
                createdAt: '2021-07-01T00:00:00.000Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 3',
        refrenceNumber: '789',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
        organizationId: undefined,
      },
    },
    result: {
      data: {
        createFund: {
          _id: '3',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: undefined,
        name: 'Fund 1',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
      },
    },
    result: {
      data: {
        updateFund: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FUND_MUTATION,
      variables: {
        id: undefined,
      },
    },
    error: new Error('Mock graphql error'),
  },
];

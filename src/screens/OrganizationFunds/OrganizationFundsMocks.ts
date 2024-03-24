import {
  CREATE_FUND_MUTATION,
  REMOVE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: '1',
            name: 'Fund 1',
            refrenceNumber: '123',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId1',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: '99',
            name: 'Funndds',
            refrenceNumber: '1234',
            taxDeductible: true,
            isArchived: true,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId1',
            creator: {
              _id: 'creatorId1',
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
        name: 'Test Fund',
        refrenceNumber: '1',
        taxDeductible: false,
        isArchived: true,
        isDefault: true,
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
export const NO_FUNDS = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        fundsByOrganization: [],
      },
    },
  },
];
export const MOCKS_ERROR_ORGANIZATIONS_FUNDS = [
  {
    request: {
      query: FUND_LIST,
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
      query: FUND_LIST,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: '1',
            name: 'Fund 1',
            refrenceNumber: '123',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId1',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: '2',
            name: 'Fund 2',
            refrenceNumber: '456',
            taxDeductible: false,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId2',
            creator: {
              _id: 'creatorId2',
              firstName: 'Jane',
              lastName: 'Doe',
            },
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
      query: FUND_LIST,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: '1',
            name: 'Fund 1',
            refrenceNumber: '123',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId1',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: '2',
            name: 'Fund 2',
            refrenceNumber: '456',
            taxDeductible: false,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId2',
            creator: {
              _id: 'creatorId2',
              firstName: 'Jane',
              lastName: 'Doe',
            },
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
        refrenceNumber: '789',
        taxDeductible: true,
        isArchived: false,
        isDefault: false,
      },
    },
    error: new Error('Mock graphql error'),
  },
];
export const MOCKS_ERROR_REMOVE_FUND = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        id: undefined,
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: '3',
            name: 'Fund 1',
            refrenceNumber: '123',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId1',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: '2',
            name: 'Fund 2',
            refrenceNumber: '456',
            taxDeductible: false,
            isArchived: false,
            isDefault: false,
            createdAt: '2021-07-01T00:00:00.000Z',
            organizationId: 'organizationId2',
            creator: {
              _id: 'creatorId2',
              firstName: 'Jane',
              lastName: 'Doe',
            },
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

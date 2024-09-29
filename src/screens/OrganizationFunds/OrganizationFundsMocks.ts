import {
  CREATE_FUND_MUTATION,
  UPDATE_FUND_MUTATION,
} from 'GraphQl/Mutations/FundMutation';
import { FUND_LIST } from 'GraphQl/Queries/fundQueries';

export const MOCKS = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: 'fundId',
            name: 'Fund 1',
            refrenceNumber: '1111',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2024-06-22',
            organizationId: 'orgId',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: 'fundId2',
            name: 'Fund 2',
            refrenceNumber: '2222',
            taxDeductible: true,
            isArchived: true,
            isDefault: false,
            createdAt: '2024-06-21',
            organizationId: 'orgId',
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
      query: FUND_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'createdAt_ASC',
        filter: '',
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: 'fundId',
            name: 'Fund 2',
            refrenceNumber: '2222',
            taxDeductible: true,
            isArchived: true,
            isDefault: false,
            createdAt: '2024-06-21',
            organizationId: 'orgId',
            creator: {
              _id: 'creatorId1',
              firstName: 'John',
              lastName: 'Doe',
            },
          },
          {
            _id: 'fundId2',
            name: 'Fund 1',
            refrenceNumber: '1111',
            taxDeductible: true,
            isArchived: false,
            isDefault: false,
            createdAt: '2024-06-22',
            organizationId: 'orgId',
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
      query: FUND_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'createdAt_DESC',
        filter: '2',
      },
    },
    result: {
      data: {
        fundsByOrganization: [
          {
            _id: 'fundId',
            name: 'Fund 2',
            refrenceNumber: '2222',
            taxDeductible: true,
            isArchived: true,
            isDefault: false,
            createdAt: '2024-06-21',
            organizationId: 'orgId',
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
        name: 'Fund 2',
        refrenceNumber: '2222',
        taxDeductible: false,
        isArchived: false,
        isDefault: true,
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        createFund: {
          _id: '2222',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: 'fundId',
        name: 'Fund 2',
        refrenceNumber: '2222',
        taxDeductible: false,
        isArchived: true,
        isDefault: true,
      },
    },
    result: {
      data: {
        updateFund: {
          _id: 'fundId',
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
        organizationId: 'orgId',
        orderBy: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        fundsByOrganization: [],
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'createdAt_DESC',
        filter: '',
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 2',
        refrenceNumber: '2222',
        taxDeductible: false,
        isArchived: false,
        isDefault: true,
        organizationId: 'orgId',
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        id: 'fundId',
        name: 'Fund 2',
        refrenceNumber: '2222',
        taxDeductible: false,
        isArchived: true,
        isDefault: true,
      },
    },
    error: new Error('Mock graphql error'),
  },
];

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
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  creator: { name: 'John Doe' },
                  id: '1',
                  isTaxDeductible: false,
                  name: 'Fund 1',
                  organization: { name: 'Org 1' },
                  updater: null,
                  createdAt: '2024-06-22T00:00:00Z', // Later date
                },
              },
              {
                node: {
                  creator: { name: 'Jane Doe' },
                  id: '2',
                  isTaxDeductible: true,
                  name: 'Fund 2',
                  organization: { name: 'Org 1' },
                  updater: null,
                  createdAt: '2024-06-21T00:00:00Z', // Earlier date
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: FUND_LIST,
      variables: {
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [
              {
                node: {
                  creator: { name: 'John Doe' },
                  id: '2',
                  isTaxDeductible: true,
                  name: 'Fund 2',
                  organization: { name: 'Org 1' },
                  updater: null,
                  createdAt: '2024-06-21T00:00:00Z', // Earlier date
                },
              },
              {
                node: {
                  creator: { name: 'Jane Doe' },
                  id: '1',
                  isTaxDeductible: false,
                  name: 'Fund 1',
                  organization: { name: 'Org 1' },
                  updater: null,
                  createdAt: '2024-06-22T00:00:00Z', // Later date
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 2',
        organizationId: 'orgId',
        isTaxDeductible: false,
        isArchived: false,
        isDefault: true,
      },
    },
    result: {
      data: {
        createFund: {
          id: '01959665-9bda-7d65-906d-e37c4a821f39',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        input: {
          id: 'fundId',
          name: 'Fund 2',
          isTaxDeductible: false,
        },
      },
    },
    result: {
      data: {
        updateFund: {
          id: 'fundId',
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
        input: { id: 'orgId' },
      },
    },
    result: {
      data: {
        organization: {
          funds: {
            edges: [],
          },
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: FUND_LIST,
      variables: {
        input: { id: 'orgId' },
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: CREATE_FUND_MUTATION,
      variables: {
        name: 'Fund 2',
        organizationId: 'orgId',
        isTaxDeductible: false,
        isArchived: false,
        isDefault: true,
      },
    },
    error: new Error('Mock graphql error'),
  },
  {
    request: {
      query: UPDATE_FUND_MUTATION,
      variables: {
        input: {
          id: 'fundId',
          name: 'Fund 2',
          isTaxDeductible: false,
        },
      },
    },
    error: new Error('Mock graphql error'),
  },
];

import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import React from 'react';

import { useDashboardData } from './useDashboardData';
import i18nForTest from 'utils/i18nForTest';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_VENUES_PG,
} from 'GraphQl/Queries/Queries';

const createWrapper = (mocks: MockedResponse[]) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      MockedProvider,
      { mocks, addTypename: false },
      React.createElement(
        BrowserRouter,
        {},
        React.createElement(I18nextProvider, { i18n: i18nForTest }, children),
      ),
    );
  return Wrapper;
};

describe('useDashboardData', () => {
  it('should fetch members and venues data correctly', async () => {
    const mocks = [
      {
        request: {
          query: GET_ORGANIZATION_MEMBERS_PG,
          variables: {
            id: 'org123',
            first: 32,
            after: null,
          },
        },
        result: {
          data: {
            organization: {
              members: {
                edges: [
                  {
                    node: {
                      id: 'member1',
                      name: 'John Doe',
                      emailAddress: 'john@example.com',
                      role: 'administrator',
                    },
                    cursor: 'cursor1',
                  },
                  {
                    node: {
                      id: 'member2',
                      name: 'Jane Smith',
                      emailAddress: 'jane@example.com',
                      role: 'member',
                    },
                    cursor: 'cursor2',
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: 'cursor2',
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_ORGANIZATION_VENUES_PG,
          variables: {
            id: 'org123',
            first: 32,
            after: null,
          },
        },
        result: {
          data: {
            organization: {
              venues: {
                edges: [
                  {
                    node: {
                      id: 'venue1',
                      name: 'Main Hall',
                      capacity: 100,
                    },
                    cursor: 'cursor1',
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: 'cursor1',
                },
              },
            },
          },
        },
      },
    ];

    const wrapper = createWrapper(mocks);
    const { result } = renderHook(
      () =>
        useDashboardData({ orgId: 'org123', tErrors: (key: string) => key }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.memberCount).toBe(2);
      expect(result.current.adminCount).toBe(1);
      expect(result.current.venueCount).toBe(1);
    });
  });

  it('should handle undefined orgId', () => {
    const wrapper = createWrapper([]);
    const { result } = renderHook(
      () =>
        useDashboardData({ orgId: undefined, tErrors: (key: string) => key }),
      {
        wrapper,
      },
    );

    expect(result.current.memberCount).toBe(0);
    expect(result.current.adminCount).toBe(0);
    expect(result.current.venueCount).toBe(0);
  });
});

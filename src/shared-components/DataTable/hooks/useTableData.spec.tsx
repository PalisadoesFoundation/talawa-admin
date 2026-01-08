import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { useTableData } from './useTableData';
import type { QueryResult } from '@apollo/client';
import { NetworkStatus, ApolloError } from '@apollo/client';
import type { Connection } from '../../../types/shared-components/DataTable/interface';

type Node = { id: string; name: string };
type Row = { key: string; label: string };

/**
 * Type for mock functions that return QueryResult promises.
 * Generic type variable allows flexibility for different data shapes.
 */
type MockQueryResultFn<T = unknown> = () => Promise<QueryResult<T>>;

/**
 * Test data shape for function path with array indexing via property access.
 * Represents a structure with an array of items, where specific items
 * contain a connection with edges and pageInfo.
 */
interface IItemsData {
  items?: Array<
    | {
        connection?: {
          edges?: Array<{ node: Node }> | null;
          pageInfo?: { hasNextPage: boolean; hasPreviousPage: boolean } | null;
        } | null;
      }
    | undefined
  >;
}

/**
 * Test data shape for function path with selective array access based on state.
 * Represents a structure with datasets array, where each dataset contains items.
 */
interface IDatasetsData {
  datasets?: Array<
    | {
        items?: {
          edges?: Array<{ node: Node }> | null;
          pageInfo?: { hasNextPage: boolean; hasPreviousPage: boolean } | null;
        } | null;
      }
    | undefined
  >;
}

function Consumer<TData = unknown, TNode = Node, TRow = Row>({
  result,
  path,
  transform,
  deps,
  testId = 'out',
  onRows,
}: {
  result: Partial<QueryResult<TData>>;
  path: (string | number)[] | ((data: TData) => Connection<TNode> | undefined);
  transform?: (n: TNode) => TRow | null | undefined;
  deps?: ReadonlyArray<unknown>;
  testId?: string;
  onRows?: (rows: TRow[]) => void;
}) {
  // Create strongly-typed mock functions returning QueryResult promises
  const mockRefetch: MockQueryResultFn<TData> = () =>
    Promise.resolve({} as QueryResult<TData>);
  const mockFetchMore: MockQueryResultFn<TData> = () =>
    Promise.resolve({} as QueryResult<TData>);

  const r = {
    data: result.data ?? {},
    loading: result.loading ?? false,
    error: result.error ?? null,
    refetch: result.refetch ?? mockRefetch,
    fetchMore: result.fetchMore ?? mockFetchMore,
    networkStatus: result.networkStatus ?? NetworkStatus.ready,
  } as unknown as QueryResult<TData>;

  const { rows, loading, loadingMore, pageInfo, error } = useTableData<
    TNode,
    TRow,
    TData
  >(r, {
    path,
    transformNode: transform,
    deps,
  });

  onRows?.(rows);

  return (
    <pre data-testid={testId}>
      {JSON.stringify({
        rows,
        loading,
        loadingMore,
        pageInfo,
        error: error?.message ?? null,
      })}
    </pre>
  );
}

describe('useTableData', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('flattens edges[].node via string[] path', () => {
    const data = {
      users: {
        edges: [
          { node: { id: '1', name: 'Ada' } },
          { node: { id: '2', name: 'Linus' } },
        ],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: false, networkStatus: NetworkStatus.ready }}
        path={['users']}
        transform={(n) => ({ key: n.id, label: n.name.toUpperCase() })}
      />,
    );

    const out = screen.getByTestId('out').textContent ?? '';
    const parsed = JSON.parse(out);
    expect(parsed.rows).toEqual([
      { key: '1', label: 'ADA' },
      { key: '2', label: 'LINUS' },
    ]);
    expect(parsed.loading).toBe(false);
    expect(parsed.loadingMore).toBe(false);
    expect(parsed.pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
    });
    expect(parsed.error).toBe(null);
  });

  it('supports selector function path and loadingMore state', () => {
    const data = {
      org: {
        members: {
          edges: [{ node: { id: '7', name: 'Grace' } }],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            endCursor: 'CUR',
          },
        },
      },
    };

    render(
      <Consumer
        result={{
          data,
          loading: false,
          networkStatus: NetworkStatus.fetchMore,
        }}
        path={(d) => d.org?.members}
        transform={(n) => ({ key: n.id, label: n.name })}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([{ key: '7', label: 'Grace' }]);
    expect(parsed.loadingMore).toBe(true);
    expect(parsed.pageInfo.hasNextPage).toBe(true);
  });

  it('handles null/empty edges gracefully', () => {
    const data = { things: { edges: [null, { node: null }], pageInfo: null } };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={['things']}
        transform={(n: unknown) => ({
          key: String((n as Node)?.id),
          label: String((n as Node)?.name),
        })}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]); // no valid nodes
    expect(parsed.pageInfo).toBe(null);
  });

  it('handles loading state correctly', () => {
    const data = {
      users: {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: true, networkStatus: NetworkStatus.loading }}
        path={['users']}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.loading).toBe(true);
    expect(parsed.loadingMore).toBe(false);
  });

  it('handles error state correctly', () => {
    const error = new ApolloError({
      errorMessage: 'Network error',
    });
    const data = {};

    render(
      <Consumer
        result={{
          data,
          loading: false,
          error,
          networkStatus: NetworkStatus.error,
        }}
        path={['users']}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.error).toBe('Network error');
    expect(parsed.rows).toEqual([]);
  });

  it('handles nested path correctly', () => {
    const data = {
      organization: {
        teams: {
          members: {
            edges: [
              { node: { id: '1', name: 'Alice' } },
              { node: { id: '2', name: 'Bob' } },
            ],
            pageInfo: { hasNextPage: true, hasPreviousPage: false },
          },
        },
      },
    };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={['organization', 'teams', 'members']}
        transform={(n) => ({ key: n.id, label: n.name })}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([
      { key: '1', label: 'Alice' },
      { key: '2', label: 'Bob' },
    ]);
  });

  it('handles missing data path gracefully', () => {
    const data = {
      users: null,
    };

    render(<Consumer result={{ data, loading: false }} path={['users']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]);
    expect(parsed.pageInfo).toBe(null);
  });

  it('handles identity transform when no transformNode provided', () => {
    const data = {
      items: {
        edges: [
          { node: { id: '1', name: 'Item 1' } },
          { node: { id: '2', name: 'Item 2' } },
        ],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(<Consumer result={{ data, loading: false }} path={['items']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ]);
  });

  it('handles empty edges array', () => {
    const data = {
      users: {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(<Consumer result={{ data, loading: false }} path={['users']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]);
  });

  it('handles undefined edges', () => {
    const data = {
      users: {
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(<Consumer result={{ data, loading: false }} path={['users']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]);
  });

  it('passes through refetch and fetchMore functions', () => {
    const mockRefetch = vi.fn<MockQueryResultFn<unknown>>(() =>
      Promise.resolve({} as QueryResult<unknown>),
    );
    const mockFetchMore = vi.fn<MockQueryResultFn<unknown>>(() =>
      Promise.resolve({} as QueryResult<unknown>),
    );

    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Test' } }],
        pageInfo: { hasNextPage: true, hasPreviousPage: false },
      },
    };

    const result1 = {
      data,
      loading: false,
      error: null,
      refetch: mockRefetch,
      fetchMore: mockFetchMore,
      networkStatus: NetworkStatus.ready,
    } as unknown as QueryResult<unknown>;

    const { getByText } = render(
      React.createElement(() => {
        const { refetch, fetchMore } = useTableData(result1, {
          path: ['users'],
        });
        return (
          <div>
            <button onClick={() => refetch()}>Refetch</button>
            <button onClick={() => fetchMore({})}>FetchMore</button>
          </div>
        );
      }),
    );

    getByText('Refetch').click();
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    getByText('FetchMore').click();
    expect(mockFetchMore).toHaveBeenCalledTimes(1);
  });

  it('handles NetworkStatus.setVariables correctly', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Test' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{
          data,
          loading: true,
          networkStatus: NetworkStatus.setVariables,
        }}
        path={['users']}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.loading).toBe(true);
    expect(parsed.loadingMore).toBe(false);
  });

  it('returns empty rows and null pageInfo when edges is not an array', () => {
    const data = {
      users: {
        edges: 'not-an-array',
        pageInfo: { hasNextPage: true, hasPreviousPage: false },
      },
    };

    render(<Consumer result={{ data, loading: false }} path={['users']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]);
    expect(parsed.pageInfo).toBe(null);
  });

  it('handles NetworkStatus.poll correctly', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Poll' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: true, networkStatus: NetworkStatus.poll }}
        path={['users']}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.loading).toBe(true);
    expect(parsed.loadingMore).toBe(false);
  });

  it('handles NetworkStatus.refetch correctly', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Refetch' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: true, networkStatus: NetworkStatus.refetch }}
        path={['users']}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.loading).toBe(true);
    expect(parsed.loadingMore).toBe(false);
  });

  it('handles all pageInfo fields', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Test' } }],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: true,
          startCursor: 'START',
          endCursor: 'END',
        },
      },
    };

    render(<Consumer result={{ data, loading: false }} path={['users']} />);

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: true,
      startCursor: 'START',
      endCursor: 'END',
    });
  });

  it('handles selector function returning undefined', () => {
    const data = {
      something: null,
    };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={(d: unknown) =>
          (d as { nonexistent?: { users?: Connection<Node> } }).nonexistent
            ?.users
        }
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([]);
    expect(parsed.pageInfo).toBe(null);
  });

  it('handles complex transformation', () => {
    const data = {
      users: {
        edges: [
          { node: { id: '1', name: 'John Doe' } },
          { node: { id: '2', name: 'Jane Smith' } },
        ],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        transform={(n) => ({
          key: `user-${n.id}`,
          label: `${n.name} (ID: ${n.id})`,
        })}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([
      { key: 'user-1', label: 'John Doe (ID: 1)' },
      { key: 'user-2', label: 'Jane Smith (ID: 2)' },
    ]);
  });

  it('drops rows when transform returns undefined/null', () => {
    const data = {
      users: {
        edges: [
          { node: { id: '1', name: 'Keep' } },
          { node: { id: '2', name: 'Drop' } },
          { node: { id: '3', name: 'AlsoKeep' } },
        ],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        transform={(n) => {
          if (n.id === '2') return undefined;
          if (n.id === '1') return null;
          return { key: n.id, label: n.name };
        }}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([{ key: '3', label: 'AlsoKeep' }]);
  });

  it('drops only invalid rows when transform returns mixed results', () => {
    const data = {
      users: {
        edges: [
          { node: { id: '1', name: 'Valid' } },
          { node: { id: '2', name: 'Invalid' } },
        ],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    render(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        transform={(n) =>
          n.id === '2' ? undefined : { key: n.id, label: n.name }
        }
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? 'null');
    expect(parsed.rows).toEqual([{ key: '1', label: 'Valid' }]);
  });

  it('propagates errors when transform throws', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Boom' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    const throwing = () =>
      render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={() => {
            throw new Error('explode');
          }}
        />,
      );

    expect(throwing).toThrow('explode');
  });

  it('memoizes rows correctly', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Test' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    const transform = vi.fn((n: Node) => ({ key: n.id, label: n.name }));

    const { rerender } = render(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        transform={transform}
      />,
    );

    expect(transform).toHaveBeenCalledTimes(1);
    const firstOutput = screen.getByTestId('out').textContent ?? '';

    // Rerender with same data
    rerender(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        transform={transform}
      />,
    );

    const secondOutput = screen.getByTestId('out').textContent ?? '';
    expect(transform).toHaveBeenCalledTimes(1);
    expect(firstOutput).toBe(secondOutput);
  });

  it('handles deps parameter for re-computation', () => {
    const data = {
      users: {
        edges: [{ node: { id: '1', name: 'Test' } }],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    let externalDep = 'v1';
    const transform = vi.fn((n: Node) => ({ key: n.id, label: n.name }));
    let firstRows: Row[] | undefined;
    let secondRows: Row[] | undefined;

    const { rerender } = render(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        deps={[externalDep]}
        transform={transform}
        onRows={(rows) => {
          if (!firstRows) firstRows = rows;
        }}
      />,
    );

    externalDep = 'v2';

    // Rerender with different deps should recompute rows and rerun transform
    rerender(
      <Consumer
        result={{ data, loading: false }}
        path={['users']}
        deps={[externalDep]}
        transform={transform}
        onRows={(rows) => {
          secondRows = rows;
        }}
      />,
    );

    expect(transform).toHaveBeenCalledTimes(2);
    expect(firstRows).toBeDefined();
    expect(secondRows).toBeDefined();
    expect(firstRows).not.toBe(secondRows);
    expect(firstRows).toEqual(secondRows);
  });
  it('exposes networkStatus correctly', () => {
    const data = {
      users: {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
      },
    };

    const result = {
      data,
      loading: false,
      error: null,
      refetch: vi.fn(),
      fetchMore: vi.fn(),
      networkStatus: NetworkStatus.ready,
    } as unknown as QueryResult<unknown>;

    render(
      React.createElement(() => {
        const { networkStatus } = useTableData(result, {
          path: ['users'],
        });
        return <div data-testid="status">{networkStatus}</div>;
      }),
    );
    expect(screen.getByTestId('status').textContent).toBe(
      String(NetworkStatus.ready),
    );
  });

  describe('Numeric Path Segments', () => {
    it('handles array index access with numeric segment', () => {
      const data = {
        items: [
          {
            connection: {
              edges: [
                { node: { id: '1', name: 'First' } },
                { node: { id: '2', name: 'Second' } },
              ],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
          {
            connection: {
              edges: [{ node: { id: '3', name: 'Third' } }],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items', 0, 'connection']}
          transform={(n) => ({ key: n.id, label: n.name })}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'First' },
        { key: '2', label: 'Second' },
      ]);
    });

    it('handles multiple numeric indices in path', () => {
      const data = {
        organizations: [
          {
            id: 'org1',
            details: {
              teams: [
                {
                  id: 'team1',
                  members: {
                    edges: [
                      { node: { id: '1', name: 'Alice' } },
                      { node: { id: '2', name: 'Bob' } },
                    ],
                    pageInfo: { hasNextPage: false, hasPreviousPage: false },
                  },
                },
              ],
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['organizations', 0, 'details', 'teams', 0, 'members']}
          transform={(n) => ({ key: n.id, label: n.name })}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Alice' },
        { key: '2', label: 'Bob' },
      ]);
    });

    it('handles out-of-bounds numeric index gracefully', () => {
      const data = {
        items: [
          {
            connection: {
              edges: [{ node: { id: '1', name: 'Item 1' } }],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items', 5, 'connection']} // Index out of bounds
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      // Should return empty rows when path resolves to undefined
      expect(parsed.rows).toEqual([]);
      expect(parsed.pageInfo).toBe(null);
    });

    it('handles array with mixed string and numeric access', () => {
      const data = {
        results: [
          {
            data: {
              users: [
                {
                  id: 'g1',
                  groups: {
                    edges: [
                      { node: { id: 'group1', name: 'Admin' } },
                      { node: { id: 'group2', name: 'Editors' } },
                    ],
                    pageInfo: { hasNextPage: true, hasPreviousPage: false },
                  },
                },
              ],
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['results', 0, 'data', 'users', 0, 'groups']}
          transform={(n) => ({ key: n.id, label: n.name })}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: 'group1', label: 'Admin' },
        { key: 'group2', label: 'Editors' },
      ]);
      expect(parsed.pageInfo.hasNextPage).toBe(true);
    });

    it('handles function path with array indexing via property access', () => {
      const data = {
        items: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          {
            connection: {
              edges: [{ node: { id: '1', name: 'Item at index 5' } }],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer<IItemsData>
          result={{ data, loading: false }}
          path={(d: IItemsData) => d?.items?.[5]?.connection}
          transform={(n) => ({ key: n.id, label: n.name })}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([{ key: '1', label: 'Item at index 5' }]);
    });

    it('handles function path with selective array access based on state', () => {
      const selectedIndex = 1;
      const data = {
        datasets: [
          {
            items: {
              edges: [{ node: { id: 'x1', name: 'Dataset 0' } }],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
          {
            items: {
              edges: [
                { node: { id: 'y1', name: 'Dataset 1 - First' } },
                { node: { id: 'y2', name: 'Dataset 1 - Second' } },
              ],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer<IDatasetsData>
          result={{ data, loading: false }}
          path={(d: IDatasetsData) => d?.datasets?.[selectedIndex]?.items}
          transform={(n) => ({ key: n.id, label: n.name })}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: 'y1', label: 'Dataset 1 - First' },
        { key: 'y2', label: 'Dataset 1 - Second' },
      ]);
    });

    it('handles numeric path with null/undefined edges array', () => {
      /**
       * Test case: Connection with null edges (valid Connection shape)
       *
       * When connection has an 'edges' property that is explicitly null,
       * the connection is considered VALID (edges property exists, even if falsy).
       * Result: rows = [], but pageInfo is PRESERVED.
       *
       * Contrast with: "handles numeric path leading to invalid connection shape"
       * where missing edges property makes it an invalid connection.
       */
      const data = {
        items: [
          {
            connection: {
              edges: null, // Property exists, value is null
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items', 0, 'connection']}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([]);
      expect(parsed.pageInfo).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it('handles numeric path leading to invalid connection shape', () => {
      /**
       * Test case: Missing edges property (invalid Connection shape)
       *
       * When connection object is missing the 'edges' property entirely,
       * it fails validation (getConnection returns undefined).
       * Result: rows = [] AND pageInfo = null (connection was invalid).
       *
       * Contrast with: "handles numeric path with null/undefined edges array"
       * where edges: null is VALID (property exists, is falsy but present).
       *
       * **Implementation Detail:**
       * getConnection validates: if (!('edges' in candidate)) return undefined;
       * So missing edges to connection = undefined to pageInfo becomes null
       */
      const data = {
        items: [
          {
            connection: {
              // Missing edges property entirely
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items', 0, 'connection']}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([]);
      expect(parsed.pageInfo).toBe(null);
    });

    it('applies transformNode to nodes accessed via numeric path', () => {
      const transform = vi.fn((n: Node) => ({
        key: n.id,
        label: n.name.toUpperCase(),
      }));

      const data = {
        items: [
          null, // Should be skipped
          {
            connection: {
              edges: [
                { node: { id: '1', name: 'alice' } },
                { node: { id: '2', name: 'bob' } },
              ],
              pageInfo: { hasNextPage: false, hasPreviousPage: false },
            },
          },
        ],
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items', 1, 'connection']}
          transform={transform}
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(transform).toHaveBeenCalledTimes(2);
      expect(transform).toHaveBeenCalledWith({ id: '1', name: 'alice' });
      expect(transform).toHaveBeenCalledWith({ id: '2', name: 'bob' });
      expect(parsed.rows).toEqual([
        { key: '1', label: 'ALICE' },
        { key: '2', label: 'BOB' },
      ]);
    });
  });

  describe('transformNode Application and Type Safety', () => {
    /**
     * Tests verifying that the transformNode property is correctly applied
     * to each extracted node from edges, with proper handling of null/undefined nodes
     * and compile-time type-safety for TNode to TRow conversions.
     *
     * These tests ensure:
     * - transformNode is invoked for every non-null node in the edges array
     * - Default behavior (undefined transformNode) returns original TNode passthrough
     * - Null/undefined nodes are safely handled (filtered out)
     * - Type conversions from TNode to TRow are correct
     * - transformNode is memoized and only re-run on dependency change
     */

    it('invokes transformNode for each non-null node in edges', () => {
      /**
       * Test: transformNode callback invocation count
       *
       * Verifies that transformNode(node) is called exactly once per node
       * in the edges array (after null filtering).
       *
       * Setup:
       * - 3 edges with valid nodes
       * - transform function tracked with vi.fn()
       *
       * Expected:
       * - transform called 3 times (once per node)
       * - Each call receives the correct node object
       */
      const transform = vi.fn((n: Node) => ({ key: n.id, label: n.name }));

      const data = {
        users: {
          edges: [
            { node: { id: '1', name: 'Alice' } },
            { node: { id: '2', name: 'Bob' } },
            { node: { id: '3', name: 'Charlie' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
        />,
      );

      // Verify transformNode was called once per node
      expect(transform).toHaveBeenCalledTimes(3);
      expect(transform).toHaveBeenNthCalledWith(1, { id: '1', name: 'Alice' });
      expect(transform).toHaveBeenNthCalledWith(2, { id: '2', name: 'Bob' });
      expect(transform).toHaveBeenNthCalledWith(3, {
        id: '3',
        name: 'Charlie',
      });

      // Verify output rows match transformed data
      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Alice' },
        { key: '2', label: 'Bob' },
        { key: '3', label: 'Charlie' },
      ]);
    });

    it('returns original node as passthrough when transformNode is undefined', () => {
      /**
       * Test: Default identity transformation
       *
       * Verifies that when transformNode is NOT provided (undefined),
       * the hook returns the original TNode unchanged as TRow
       * (identity transformation: TNode to TRow where TRow === TNode).
       *
       * This tests the default behavior (identity transform):
       * No explicit transformNode function, falls back to:
       * `(node) => node as unknown as TRow`
       *
       * Setup:
       * - No transformNode provided (undefined)
       * - Edges contain nodes with id and name properties
       *
       * Expected:
       * - rows contain original node objects unchanged
       * - No transformation applied
       */
      const data = {
        items: {
          edges: [
            { node: { id: '1', name: 'Item 1' } },
            { node: { id: '2', name: 'Item 2' } },
            { node: { id: '3', name: 'Item 3' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const TestConsumer1: typeof Consumer = Consumer;
      render(
        <TestConsumer1
          result={{ data, loading: false }}
          path={['items']}
          transform={undefined} // Explicitly undefined (default)
        />,
      );

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );

      // Original nodes returned unchanged
      expect(parsed.rows).toEqual([
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ]);
    });

    it('safely handles null nodes by filtering them out before transformNode', () => {
      /**
       * Test: Null node filtering
       *
       * Verifies that null nodes are filtered BEFORE transformNode is called,
       * preventing errors and ensuring transformNode only receives non-null values.
       *
       * GraphQL edges can contain null nodes (edge.node: TNode | null).
       * This pattern tests filtering nulls from the edge list:
       * `(node): node is TNode => Boolean(node)`
       * removes null nodes before transformation.
       *
       * Setup:
       * - 5 edges: 2 with nodes, null node, 2 more with nodes
       * - transform tracks which nodes it receives
       *
       * Expected:
       * - transform called 4 times (null node skipped)
       * - Null node never passed to transformNode
       * - Only non-null transformed nodes in output
       */
      const transform = vi.fn((n: Node) => ({
        key: n.id,
        label: n.name.toUpperCase(),
      }));

      const data = {
        users: {
          edges: [
            { node: { id: '1', name: 'alice' } },
            { node: { id: '2', name: 'bob' } },
            { node: null }, // Null node
            { node: { id: '3', name: 'charlie' } },
            { node: { id: '4', name: 'diana' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
        />,
      );

      // transformNode called only for non-null nodes (4 times, not 5)
      expect(transform).toHaveBeenCalledTimes(4);

      // Null node never passed to transformNode
      expect(transform).not.toHaveBeenCalledWith({ id: null, name: null });

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'ALICE' },
        { key: '2', label: 'BOB' },
        { key: '3', label: 'CHARLIE' },
        { key: '4', label: 'DIANA' },
      ]);
    });

    it('handles undefined nodes by filtering them out', () => {
      /**
       * Test: Undefined node filtering
       *
       * Similar to null handling but tests edge case where edge.node is undefined
       * (though GraphQL typically uses null, not undefined).
       *
       * Verifies the null/undefined filter catches both values:
       * `(node): node is TNode => Boolean(node)`
       * catches both null and undefined values.
       */
      const transform = vi.fn((n: Node) => ({ key: n.id, label: n.name }));

      const data = {
        items: {
          edges: [
            { node: { id: '1', name: 'Item 1' } },
            { node: undefined }, // Undefined node
            { node: { id: '2', name: 'Item 2' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items']}
          transform={transform}
        />,
      );

      // transformNode called only for valid nodes (2 times)
      expect(transform).toHaveBeenCalledTimes(2);

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Item 1' },
        { key: '2', label: 'Item 2' },
      ]);
    });

    it('filters out transformation results that are null or undefined', () => {
      /**
       * Test: Null/undefined transformation result filtering
       *
       * Verifies that if transformNode returns null or undefined,
       * those results are filtered out from the final rows array.
       *
       * This tests the final filter step for transformation results:
       * `(row): row is TRow => row !== null && row !== undefined`
       *
       * Setup:
       * - 3 nodes
       * - transformNode returns null for node with id='2'
       *
       * Expected:
       * - Only 2 rows (node 2's null result filtered out)
       * - transformNode still called 3 times (full execution)
       * - Final rows exclude null transformation result
       */
      const transform = vi.fn((n: Node) => {
        // Return null for specific node
        if (n.id === '2') return null;
        return { key: n.id, label: n.name };
      });

      const data = {
        users: {
          edges: [
            { node: { id: '1', name: 'Alice' } },
            { node: { id: '2', name: 'Bob' } }, // Will be filtered by transform
            { node: { id: '3', name: 'Charlie' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
        />,
      );

      // transformNode called 3 times (before filtering)
      expect(transform).toHaveBeenCalledTimes(3);

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      // Only 2 rows (null result filtered out)
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Alice' },
        { key: '3', label: 'Charlie' },
      ]);
      expect(parsed.rows.length).toBe(2);
    });

    it('handles transformNode that returns undefined values', () => {
      /**
       * Test: Undefined transformation result filtering
       *
       * Tests the same filtering behavior when transformNode returns undefined
       * instead of null.
       */
      const transform = vi.fn((n: Node) => {
        if (n.id === '2') return undefined;
        return { key: n.id, label: n.name };
      });

      const data = {
        items: {
          edges: [
            { node: { id: '1', name: 'Item 1' } },
            { node: { id: '2', name: 'Item 2' } },
            { node: { id: '3', name: 'Item 3' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items']}
          transform={transform}
        />,
      );

      expect(transform).toHaveBeenCalledTimes(3);

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Item 1' },
        { key: '3', label: 'Item 3' },
      ]);
    });

    it('applies transformNode only when connection changes or dependency updates', () => {
      /**
       * Test: transformNode memoization
       *
       * Verifies that transformNode is not re-executed unnecessarily.
       * The rows are memoized based on [connection, transformNode],
       * so transformation only happens when:
       * - The connection object changes
       * - The transformNode function reference changes
       * - Custom dependencies in options.deps change
       *
       * Setup:
       * - Initial render with transformNode
       * - Rerender WITHOUT changing data or transformNode
       * - Should not re-call transform
       *
       * Rerender WITH new transformNode
       * - Should call transform again with new function
       */
      const data = {
        users: {
          edges: [
            { node: { id: '1', name: 'Alice' } },
            { node: { id: '2', name: 'Bob' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const transform1 = vi.fn((n: Node) => ({
        key: n.id,
        label: n.name.toUpperCase(),
      }));

      let callCount = 0;
      const { rerender } = render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform1}
        />,
      );

      expect(transform1).toHaveBeenCalledTimes(2); // Called once per node
      callCount = transform1.mock.calls.length;

      // Rerender with SAME transformNode reference
      rerender(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform1}
        />,
      );

      // Should NOT re-call transform (memoized)
      expect(transform1).toHaveBeenCalledTimes(callCount);

      // Rerender with NEW transformNode reference
      const transform2 = vi.fn((n: Node) => ({
        key: n.id,
        label: `[${n.name}]`,
      }));

      rerender(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform2}
        />,
      );

      // New transformNode should be called 2 times (once per node)
      expect(transform2).toHaveBeenCalledTimes(2);

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );
      expect(parsed.rows).toEqual([
        { key: '1', label: '[Alice]' },
        { key: '2', label: '[Bob]' },
      ]);
    });

    it('handles complex type conversions from TNode to TRow', () => {
      /**
       * Test: Complex type conversions from TNode to TRow
       *
       * Verifies compile-time type-safety and runtime correctness of
       * transformations where TNode and TRow are significantly different types.
       *
       * Demonstrates:
       * - Extracting subset of fields
       * - Adding computed fields
       * - Changing data structure shape
       * - Type-safe conversion ensuring TRow type contract
       *
       * TNode type:
       * - id, name (string fields)
       * - createdAt (date string)
       *
       * TRow type:
       * - id, displayName (derived)
       * - isRecent (computed boolean)
       * - ageInDays (computed number)
       */
      type ComplexNode = {
        id: string;
        name: string;
        createdAt: string; // ISO date string
        email?: string;
      };

      type ComplexRow = {
        id: string;
        displayName: string;
        isRecent: boolean;
        ageInDays: number;
      };

      const transform = vi.fn((node: ComplexNode): ComplexRow => {
        const createdDate = new Date(node.createdAt);
        const now = new Date();
        const ageInMs = now.getTime() - createdDate.getTime();
        const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
        const isRecent = ageInDays < 30;

        return {
          id: node.id,
          displayName: node.name.toUpperCase(),
          isRecent,
          ageInDays,
        };
      });

      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 10); // 10 days ago
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 50); // 50 days ago

      const data = {
        users: {
          edges: [
            {
              node: {
                id: '1',
                name: 'alice',
                createdAt: baseDate.toISOString(),
                email: 'alice@example.com',
              },
            },
            {
              node: {
                id: '2',
                name: 'bob',
                createdAt: oldDate.toISOString(),
              },
            },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const TestComponentEl: typeof Consumer = Consumer;
      render(
        <TestComponentEl<typeof data, ComplexNode, ComplexRow>
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
        />,
      );

      expect(transform).toHaveBeenCalledTimes(2);

      // Verify first call extracted all fields from node
      expect(transform).toHaveBeenNthCalledWith(1, {
        id: '1',
        name: 'alice',
        createdAt: expect.any(String),
        email: 'alice@example.com',
      });

      // Verify second call (email not required)
      expect(transform).toHaveBeenNthCalledWith(2, {
        id: '2',
        name: 'bob',
        createdAt: expect.any(String),
      });

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );

      // Verify transformed structure
      expect(parsed.rows).toHaveLength(2);
      expect(parsed.rows[0]).toEqual({
        id: '1',
        displayName: 'ALICE',
        isRecent: true, // 10 days old < 30
        ageInDays: 10,
      });

      expect(parsed.rows[1]).toEqual({
        id: '2',
        displayName: 'BOB',
        isRecent: false, // 50 days old >= 30
        ageInDays: 50,
      });
    });

    it('handles robustness when transformNode throws or returns invalid data', () => {
      /**
       * Test: Robustness when transformNode throws or returns invalid data
       *
       * Verifies that the transformation pipeline is resilient:
       * - Applies transformNode to each node
       * - Filters results: `(row): row is TRow => row !== null && row !== undefined`
       *   ensures only valid TRow results are kept
       *
       * If transform throws, it propagates (not caught),
       * but filtering handles null/undefined returns gracefully.
       *
       * Note: This test verifies the happy path where
       * transformNode returns falsy values that are filtered.
       */
      const transform = vi.fn((n: Node) => {
        // Return falsy values for some nodes
        if (n.id === '2') return null;
        if (n.id === '3') return undefined;
        return { key: n.id, label: n.name };
      });

      const data = {
        items: {
          edges: [
            { node: { id: '1', name: 'Item 1' } },
            { node: { id: '2', name: 'Item 2' } },
            { node: { id: '3', name: 'Item 3' } },
            { node: { id: '4', name: 'Item 4' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      render(
        <Consumer
          result={{ data, loading: false }}
          path={['items']}
          transform={transform}
        />,
      );

      // transformNode called 4 times (all nodes)
      expect(transform).toHaveBeenCalledTimes(4);

      const parsed = JSON.parse(
        screen.getByTestId('out').textContent ?? 'null',
      );

      // Only valid (non-null/undefined) transformation results kept
      expect(parsed.rows).toEqual([
        { key: '1', label: 'Item 1' },
        { key: '4', label: 'Item 4' },
      ]);
    });

    it('memoizes transformed rows correctly', () => {
      /**
       * Test: Memoization of transformed rows
       *
       * Verifies that when the connection and transformNode don't change,
       * the returned rows array maintains the same reference (identity),
       * not just equality.
       *
       * This is important for performance: prevents unnecessary re-renders
       * of consumer components that depend on rows reference stability.
       *
       * Memoization uses: `useMemo` with deps: `[connection, transformNode, ...deps]`
       */
      let firstRows: Row[] | undefined;
      let secondRows: Row[] | undefined;

      const data = {
        users: {
          edges: [{ node: { id: '1', name: 'Alice' } }],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const transform = (n: Node) => ({ key: n.id, label: n.name });

      const { rerender } = render(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
          onRows={(rows) => {
            firstRows = rows;
          }}
        />,
      );

      // Rerender with SAME data and transformNode
      rerender(
        <Consumer
          result={{ data, loading: false }}
          path={['users']}
          transform={transform}
          onRows={(rows) => {
            secondRows = rows;
          }}
        />,
      );

      // Rows should be the same reference (memoized)
      expect(firstRows).toBe(secondRows);
      expect(firstRows).toEqual([{ key: '1', label: 'Alice' }]);
    });

    it('updates transformed rows when connection changes but transformNode remains same', () => {
      /**
       * Test: Memoization dependency on connection changes
       *
       * Verifies that when the connection (extracted via path) changes,
       * even with the same transformNode function, rows are recomputed.
       *
       * Memoization deps: [connection, transformNode]
       * This test changes the connection (via data update) while keeping
       * transformNode constant.
       */
      let firstRows: Row[] | undefined;
      let secondRows: Row[] | undefined;

      const transform = (n: Node) => ({ key: n.id, label: n.name });

      const data1 = {
        users: {
          edges: [
            { node: { id: '1', name: 'Alice' } },
            { node: { id: '2', name: 'Bob' } },
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const data2 = {
        users: {
          edges: [
            { node: { id: '1', name: 'Alice' } },
            { node: { id: '2', name: 'Bob' } },
            { node: { id: '3', name: 'Charlie' } }, // Added node
          ],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        },
      };

      const { rerender } = render(
        <Consumer
          result={{ data: data1, loading: false }}
          path={['users']}
          transform={transform}
          onRows={(rows) => {
            firstRows = rows;
          }}
        />,
      );

      expect(firstRows).toEqual([
        { key: '1', label: 'Alice' },
        { key: '2', label: 'Bob' },
      ]);

      // Rerender with different data (new connection)
      rerender(
        <Consumer
          result={{ data: data2, loading: false }}
          path={['users']}
          transform={transform}
          onRows={(rows) => {
            secondRows = rows;
          }}
        />,
      );

      // Rows should be different (new connection triggered recompute)
      expect(firstRows).not.toBe(secondRows);

      // But contents should have new node
      expect(secondRows).toEqual([
        { key: '1', label: 'Alice' },
        { key: '2', label: 'Bob' },
        { key: '3', label: 'Charlie' },
      ]);
    });
  });

  describe('path resolution edge cases', () => {
    it('should return undefined when data is undefined', () => {
      type TestData = { users?: Connection<{ id: string }> };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: undefined,
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
      expect(result.current.pageInfo).toBeNull();
    });

    it('should return undefined when path points to null', () => {
      type TestData = { users: Connection<{ id: string }> | null };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { users: null },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
      expect(result.current.pageInfo).toBeNull();
    });

    it('should return undefined when intermediate path value is not an object', () => {
      type TestData = { users: string };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { users: 'invalid' },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users', 'edges'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
    });

    it('should return undefined when path points to non-object value', () => {
      type TestData = { count: number };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { count: 42 },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['count'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
    });

    it('should return undefined when result has no edges property', () => {
      type TestData = {
        users: { pageInfo: { hasNextPage: boolean } | null };
      };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { users: { pageInfo: null } },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
    });

    it('should return undefined when edges is not an array', () => {
      type TestData = { users: { edges: string } };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { users: { edges: 'not-an-array' } },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([]);
    });

    it('should handle function path that returns undefined', () => {
      type TestData = { users: Connection<{ id: string }> | null };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { users: null },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: (d: TestData) => d.users ?? undefined },
        ),
      );

      expect(result.current.rows).toEqual([]);
    });

    it('should handle numeric keys in path array', () => {
      type TestData = {
        items: Array<Connection<{ id: string }>>;
      };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: { items: [{ edges: [], pageInfo: null }] },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['items', 0] },
        ),
      );

      expect(result.current.rows).toEqual([]);
      expect(result.current.pageInfo).toBeNull();
    });

    it('should handle edges with null values', () => {
      type TestData = {
        users: Connection<{ id: string }>;
      };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: {
              users: {
                edges: [null, { node: { id: '1' } }, undefined],
                pageInfo: null,
              },
            },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([{ id: '1' }]);
    });

    it('should filter out edges with null nodes', () => {
      type TestData = {
        users: Connection<{ id: string }>;
      };

      const { result } = renderHook(() =>
        useTableData<{ id: string }, { id: string }, TestData>(
          {
            data: {
              users: {
                edges: [
                  { node: { id: '1' } },
                  { node: null },
                  { node: { id: '2' } },
                ],
                pageInfo: null,
              },
            },
            loading: false,
            error: undefined,
            networkStatus: NetworkStatus.ready,
          } as unknown as QueryResult<TestData>,
          { path: ['users'] },
        ),
      );

      expect(result.current.rows).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  // ...existing code...
});

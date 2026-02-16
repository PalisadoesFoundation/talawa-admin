import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { useSimpleTableData } from './useSimpleTableData';
import type { QueryResult } from '@apollo/client';
import { NetworkStatus, ApolloError } from '@apollo/client';

type Item = { id: string; name: string };

type MockQueryResultFn<T = unknown> = () => Promise<QueryResult<T>>;

interface IItemsData {
  items?: Item[] | null;
}

function makeResult<TData>(
  overrides: Partial<{
    data: TData;
    loading: boolean;
    error: ApolloError;
    refetch: QueryResult<TData>['refetch'];
  }> = {},
): QueryResult<TData> {
  const mockRefetch: MockQueryResultFn<TData> = () =>
    Promise.resolve({} as QueryResult<TData>);

  return {
    data: 'data' in overrides ? (overrides.data as TData) : ({} as TData),
    loading: overrides.loading ?? false,
    error: overrides.error ?? undefined,
    refetch:
      overrides.refetch ??
      (mockRefetch as unknown as QueryResult<TData>['refetch']),
    fetchMore: vi.fn(),
    networkStatus: NetworkStatus.ready,
    called: true,
    client: {} as never,
    observable: {} as never,
    previousData: undefined,
    startPolling: vi.fn(),
    stopPolling: vi.fn(),
    subscribeToMore: vi.fn(),
    updateQuery: vi.fn(),
    variables: undefined,
  } as unknown as QueryResult<TData>;
}

function Consumer<TRow, TData>({
  result,
  path,
  testId = 'out',
}: {
  result: QueryResult<TData>;
  path: (data: TData) => TRow[] | undefined | null;
  testId?: string;
}) {
  const { rows, loading, error, refetch } = useSimpleTableData<TRow, TData>(
    result,
    { path },
  );

  return (
    <pre data-testid={testId}>
      {JSON.stringify({
        rows,
        loading,
        error: error?.message ?? null,
        hasRefetch: typeof refetch === 'function',
      })}
    </pre>
  );
}

describe('useSimpleTableData', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts rows via path function', () => {
    const data: IItemsData = {
      items: [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ],
    };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ]);
  });

  it('returns empty rows when data is undefined', () => {
    render(
      <Consumer<Item, IItemsData>
        result={makeResult<IItemsData>({ data: undefined })}
        path={(d) => d?.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([]);
  });

  it('returns empty rows when path returns undefined', () => {
    const data: IItemsData = { items: undefined };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([]);
  });

  it('returns empty rows when path returns null', () => {
    const data: IItemsData = { items: null };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([]);
  });

  it('handles empty array from path', () => {
    const data: IItemsData = { items: [] };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([]);
  });

  it('passes through loading state', () => {
    const data: IItemsData = { items: [] };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data, loading: true })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.loading).toBe(true);
    expect(parsed.rows).toEqual([]);
  });

  it('passes through error state', () => {
    const error = new ApolloError({ errorMessage: 'Something went wrong' });
    const data: IItemsData = {};

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data, error })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.error).toBe('Something went wrong');
    expect(parsed.rows).toEqual([]);
  });

  it('passes through undefined error as null', () => {
    const data: IItemsData = {
      items: [{ id: '1', name: 'X' }],
    };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.error).toBe(null);
  });

  it('passes through refetch function', () => {
    const mockRefetch = vi.fn<MockQueryResultFn<IItemsData>>(() =>
      Promise.resolve({} as QueryResult<IItemsData>),
    );
    const data: IItemsData = { items: [] };

    const result = makeResult<IItemsData>({
      data,
      refetch: mockRefetch as unknown as QueryResult<IItemsData>['refetch'],
    });

    render(
      React.createElement(() => {
        const { refetch } = useSimpleTableData<Item, IItemsData>(result, {
          path: (d) => d.items ?? [],
        });
        return (
          <div>
            <button onClick={() => refetch()}>Refetch</button>
          </div>
        );
      }),
    );

    screen.getByText('Refetch').click();
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('exposes refetch as a function in the Consumer', () => {
    const data: IItemsData = { items: [] };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.hasRefetch).toBe(true);
  });

  it('returns empty rows and logs error when path throws', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const data: IItemsData = { items: [{ id: '1', name: 'Test' }] };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data })}
        path={() => {
          throw new Error('path explosion');
        }}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(
      '[useSimpleTableData] Error extracting rows from data',
    );
  });

  it('memoizes rows when data and path stay the same', () => {
    const data: IItemsData = {
      items: [{ id: '1', name: 'Stable' }],
    };
    const pathFn = (d: IItemsData): Item[] => d.items ?? [];
    const queryResult = makeResult({ data });

    const { result, rerender } = renderHook(() =>
      useSimpleTableData<Item, IItemsData>(queryResult, { path: pathFn }),
    );

    const firstRows = result.current.rows;
    rerender();
    const secondRows = result.current.rows;

    expect(firstRows).toBeDefined();
    expect(secondRows).toBeDefined();
    expect(firstRows).toBe(secondRows);
  });

  it('recomputes rows when data changes', () => {
    const data1: IItemsData = {
      items: [{ id: '1', name: 'First' }],
    };
    const data2: IItemsData = {
      items: [{ id: '2', name: 'Second' }],
    };

    const pathFn = (d: IItemsData): Item[] => d.items ?? [];

    const { rerender } = render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data: data1 })}
        path={pathFn}
      />,
    );

    const first = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(first.rows).toEqual([{ id: '1', name: 'First' }]);

    rerender(
      <Consumer<Item, IItemsData>
        result={makeResult({ data: data2 })}
        path={pathFn}
      />,
    );

    const second = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(second.rows).toEqual([{ id: '2', name: 'Second' }]);
  });

  describe('dev-mode warning for unstable path reference', () => {
    let originalNodeEnv: string | undefined;

    beforeEach(() => {
      originalNodeEnv = process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('warns when path reference changes between renders', () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data: IItemsData = { items: [] };

      const { rerender } = render(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      rerender(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain(
        '[useSimpleTableData] The path function reference changed between renders',
      );
    });

    it('does not warn when path reference is stable (memoized)', () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data: IItemsData = { items: [] };
      const stablePath = (d: IItemsData): Item[] => d.items ?? [];

      const { rerender } = render(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={stablePath}
        />,
      );

      rerender(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={stablePath}
        />,
      );

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('only warns once for repeated unstable references', () => {
      process.env.NODE_ENV = 'development';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data: IItemsData = { items: [] };

      const { rerender } = render(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      rerender(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      rerender(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('does not warn in production mode', () => {
      process.env.NODE_ENV = 'production';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const data: IItemsData = { items: [] };

      const { rerender } = render(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      rerender(
        <Consumer<Item, IItemsData>
          result={makeResult({ data })}
          path={(d) => d.items ?? []}
        />,
      );

      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  it('handles deeply nested data structures', () => {
    interface INestedData {
      organization?: {
        members?: {
          requests?: Item[];
        };
      };
    }

    const data: INestedData = {
      organization: {
        members: {
          requests: [
            { id: '10', name: 'Request A' },
            { id: '20', name: 'Request B' },
          ],
        },
      },
    };

    render(
      <Consumer<Item, INestedData>
        result={makeResult({ data })}
        path={(d) => d.organization?.members?.requests ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.rows).toEqual([
      { id: '10', name: 'Request A' },
      { id: '20', name: 'Request B' },
    ]);
  });

  it('returns existing rows when loading is true but data exists', () => {
    const data: IItemsData = {
      items: [{ id: '1', name: 'Cached' }],
    };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data, loading: true })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.loading).toBe(true);
    expect(parsed.rows).toEqual([{ id: '1', name: 'Cached' }]);
  });

  it('returns rows even when error is present alongside data', () => {
    const error = new ApolloError({ errorMessage: 'Partial failure' });
    const data: IItemsData = {
      items: [{ id: '1', name: 'Partial' }],
    };

    render(
      <Consumer<Item, IItemsData>
        result={makeResult({ data, error })}
        path={(d) => d.items ?? []}
      />,
    );

    const parsed = JSON.parse(screen.getByTestId('out').textContent ?? '');
    expect(parsed.error).toBe('Partial failure');
    expect(parsed.rows).toEqual([{ id: '1', name: 'Partial' }]);
  });

  it('works with renderHook API directly', () => {
    const data: IItemsData = {
      items: [{ id: '1', name: 'Hook' }],
    };

    const { result } = renderHook(() =>
      useSimpleTableData<Item, IItemsData>(makeResult({ data }), {
        path: (d) => d.items ?? [],
      }),
    );

    expect(result.current.rows).toEqual([{ id: '1', name: 'Hook' }]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(typeof result.current.refetch).toBe('function');
  });
});

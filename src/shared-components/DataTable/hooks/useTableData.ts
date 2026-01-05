import { useMemo } from 'react';
import { NetworkStatus } from '@apollo/client';
import type { QueryResult } from '@apollo/client';
import type {
  Connection,
  Edge,
  IUseTableDataOptions,
  IUseTableDataResult,
} from '../../../types/shared-components/DataTable/interface';

/** Extract GraphQL connection data into table rows with optional node transform; filters null nodes. */
export function useTableData<TNode = unknown, TRow = TNode, TData = unknown>(
  result: QueryResult<TData>,
  options: IUseTableDataOptions<TNode, TRow, TData>,
): IUseTableDataResult<TRow, TData> {
  const { data, loading, error, refetch, fetchMore, networkStatus } = result;
  const { path, transformNode, deps = [] } = options;

  // Resolve a Connection<TNode> via path (array or selector) and validate edges shape.
  const getConnection = (
    d: TData | undefined,
  ): Connection<TNode> | undefined => {
    if (!d) return undefined;

    if (typeof path === 'function')
      return path(d) as Connection<TNode> | undefined;

    const result = path.reduce<unknown>((acc, key) => {
      if (acc == null) return undefined;
      if (typeof acc !== 'object') return undefined;
      const propKey = String(key);
      return (acc as Record<string | number, unknown>)[propKey];
    }, d as unknown);

    if (result == null) return undefined;
    if (typeof result !== 'object') return undefined;

    const candidate = result as Record<string, unknown>;
    if (!('edges' in candidate)) return undefined;

    const edges = candidate.edges;
    if (edges !== null && edges !== undefined && !Array.isArray(edges)) {
      return undefined;
    }

    return result as Connection<TNode>;
  };

  const connection = useMemo(() => getConnection(data), [data, path, ...deps]);

  // Memoize rows derived from the connection and optional transform.
  const rows = useMemo<TRow[]>(() => {
    const edges = (connection?.edges ?? []) as Array<Edge<TNode>>;
    const nodes = edges
      .filter(
        (edge): edge is { node: TNode | null } =>
          edge !== null && edge !== undefined,
      )
      .map((edge) => edge.node)
      .filter((node): node is TNode => Boolean(node));

    const identity = (n: TNode): TRow => n as unknown as TRow; // Cast keeps generic defaults working when transformNode is omitted.
    const map = transformNode ?? identity;
    return nodes
      .map((node) => map(node))
      .filter((row): row is TRow => row !== null && row !== undefined);
  }, [connection, transformNode, ...deps]);

  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  return {
    rows,
    loading,
    loadingMore,
    error: (error as Error) ?? null,
    pageInfo: connection?.pageInfo ?? null,
    refetch,
    fetchMore,
    networkStatus,
  };
}

// Re-export hook types from the centralized interface file for convenience
export type {
  IUseTableDataOptions,
  IUseTableDataResult,
} from '../../../types/shared-components/DataTable/interface';

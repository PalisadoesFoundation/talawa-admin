import { useMemo, useRef, useEffect } from 'react';
import type { QueryResult, ApolloError } from '@apollo/client';

/**
 * Options for useSimpleTableData hook
 */
export interface IUseSimpleTableDataOptions<TRow, TData> {
  /**
   * Path function to extract array data from GraphQL response.
   * IMPORTANT: Must be memoized with useCallback for stable reference.
   */
  path: (data: TData) => TRow[] | undefined | null;
}

/**
 * Result returned by useSimpleTableData hook
 */
export interface IUseSimpleTableDataResult<TRow, TData> {
  /**
   * Extracted rows from the query data
   */
  rows: TRow[];
  /**
   * Loading state from the query
   */
  loading: boolean;
  /**
   * Error from the query, if any.
   * Preserves ApolloError properties (graphQLErrors, networkError, etc.)
   */
  error: ApolloError | undefined;
  /**
   * Function to refetch the query.
   * Returns a Promise that resolves with Apollo query result.
   * Matches Apollo's refetch signature: can accept variables and returns Promise.
   */
  refetch: QueryResult<TData>['refetch'];
}

/**
 * Hook for integrating simple array-based GraphQL queries with DataTable.
 * Use this for queries that return arrays directly, not connection format.
 *
 * For connection-based queries (with edges/pageInfo), use useTableData instead.
 *
 * @example
 * ```tsx
 * const queryResult = useQuery(MEMBERSHIP_REQUEST_PG, {
 *   variables: { input: { id: orgId }, first: 10 }
 * });
 *
 * // Path function MUST be memoized with useCallback
 * const extractRequests = useCallback(
 *   (data: InterfaceMembershipRequestsQueryData) =>
 *     data?.organization?.membershipRequests ?? [],
 *   []
 * );
 *
 * const { rows, loading, error, refetch } = useSimpleTableData<
 *   InterfaceRequestsListItem,
 *   InterfaceMembershipRequestsQueryData
 * >(queryResult, {
 *   path: extractRequests
 * });
 * ```
 */
export function useSimpleTableData<TRow = unknown, TData = unknown>(
  result: QueryResult<TData>,
  options: IUseSimpleTableDataOptions<TRow, TData>,
): IUseSimpleTableDataResult<TRow, TData> {
  const { data, loading, error, refetch } = result;
  const { path } = options;

  // Dev-only warning for unstable path references
  const prevPathRef = useRef<typeof path | undefined>(undefined);
  const warningShownRef = useRef<boolean>(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (
        prevPathRef.current &&
        prevPathRef.current !== path &&
        !warningShownRef.current
      ) {
        console.warn(
          '[useSimpleTableData] The path function reference changed between renders. ' +
            'This may cause unnecessary re-renders. Please memoize the path function with useCallback. ' +
            'Example: const pathFn = useCallback((data) => data?.items ?? [], []);',
        );
        warningShownRef.current = true;
      }
    }
    prevPathRef.current = path;
  }, [path]);

  // Extract rows using the path function
  // Note: path must be memoized by caller (useCallback) for stable reference
  const rows = useMemo<TRow[]>(() => {
    if (!data) return [];

    try {
      const extracted = path(data);
      return extracted ?? [];
    } catch (err) {
      // Log error with context for debugging and monitoring
      console.error(
        '[useSimpleTableData] Error extracting rows from data. ' +
          'This indicates the path function threw an exception. ' +
          'Error:',
        err,
        'Data:',
        data,
      );

      // TODO: Report to error monitoring service (e.g., Sentry)
      // if (typeof Sentry !== 'undefined' && Sentry.captureException) {
      //   Sentry.captureException(err, {
      //     extra: { hookName: 'useSimpleTableData', data },
      //   });
      // }

      // Return empty array as fallback to prevent component crash
      return [];
    }
  }, [data, path]);

  return {
    rows,
    loading,
    error,
    refetch,
  };
}

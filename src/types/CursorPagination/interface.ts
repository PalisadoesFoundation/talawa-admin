/**
 * TypeScript interfaces for cursor-based pagination.
 *
 * This module defines the interfaces used by the CursorPaginationManager component
 * to handle cursor-based pagination in both forward and backward directions.
 */

import type { DocumentNode } from '@apollo/client';

/**
 * Page information from a cursor-based pagination query.
 *
 * This follows the Relay Cursor Connections Specification.
 */
export interface InterfacePageInfo {
  /**
   * Indicates if there are more items available after the current page.
   * Used for forward pagination.
   */
  hasNextPage: boolean;

  /**
   * Indicates if there are more items available before the current page.
   * Used for backward pagination.
   */
  hasPreviousPage: boolean;

  /**
   * Cursor pointing to the start of the current page.
   * Used as the `before` parameter for backward pagination.
   */
  startCursor: string | null;

  /**
   * Cursor pointing to the end of the current page.
   * Used as the `after` parameter for forward pagination.
   */
  endCursor: string | null;
}

/**
 * Generic edge type for cursor-based pagination.
 *
 * @typeParam T - The type of the node contained in this edge.
 */
export interface InterfaceEdge<T> {
  /**
   * Cursor for this specific edge.
   */
  cursor: string;

  /**
   * The actual data node.
   */
  node: T;
}

/**
 * Generic connection type for cursor-based pagination.
 *
 * @typeParam T - The type of the items in the edges.
 */
export interface InterfaceConnection<T> {
  /**
   * Array of edges containing the data and cursors.
   */
  edges: InterfaceEdge<T>[];

  /**
   * Information about the current page.
   */
  pageInfo: InterfacePageInfo;
}

/**
 * Render props passed to the children function of CursorPaginationManager.
 *
 * @typeParam T - The type of the items being paginated.
 */
export interface InterfaceCursorPaginationRenderProps<T> {
  /**
   * Array of items to render.
   */
  items: T[];

  /**
   * Indicates if more items are currently being loaded.
   */
  loading: boolean;

  /**
   * Indicates if there are more items available to load.
   * - For forward pagination: equals `hasNextPage`
   * - For backward pagination: equals `hasPreviousPage`
   */
  hasMore: boolean;

  /**
   * Function to trigger loading more items.
   * Typically called when user scrolls or clicks a "load more" button.
   */
  loadMore: () => Promise<void>;

  /**
   * Error that occurred during loading, if any.
   */
  error?: Error;
}

/**
 * Props for the CursorPaginationManager component.
 *
 * @typeParam TData - The type of data returned by the query.
 * @typeParam TNode - The type of individual items being paginated.
 *
 * @example
 * Forward pagination (loading next page):
 * ```tsx
 * <CursorPaginationManager
 *   paginationDirection="forward"
 *   data={queryData?.posts}
 *   queryVariables={{ first: 10, after: null }}
 *   onLoadMore={(variables) => refetch(variables)}
 *   getConnection={(data) => data}
 * >
 *   {({ items, loading, hasMore, loadMore }) => (
 *     <div>
 *       {items.map(item => <PostCard key={item.id} post={item} />)}
 *       {hasMore && <button onClick={loadMore}>Load More</button>}
 *     </div>
 *   )}
 * </CursorPaginationManager>
 * ```
 *
 * @example
 * Backward pagination (loading previous page, e.g., for chat messages):
 * ```tsx
 * <CursorPaginationManager
 *   paginationDirection="backward"
 *   data={queryData?.chat?.messages}
 *   queryVariables={{ last: 10, before: null }}
 *   onLoadMore={(variables) => refetch(variables)}
 *   getConnection={(data) => data}
 *   scrollContainerRef={messagesContainerRef}
 * >
 *   {({ items, loading, hasMore, loadMore }) => (
 *     <div ref={messagesContainerRef}>
 *       {hasMore && <button onClick={loadMore}>Load Older</button>}
 *       {items.map(msg => <Message key={msg.id} message={msg} />)}
 *     </div>
 *   )}
 * </CursorPaginationManager>
 * ```
 */
export interface InterfaceCursorPaginationProps<TData, TNode> {
  /**
   * Direction of pagination.
   *
   * - `'forward'`: Load next page using `first` and `after` parameters.
   *   New items are appended to the end of the list.
   * - `'backward'`: Load previous page using `last` and `before` parameters.
   *   New items are prepended to the beginning of the list.
   *
   * @defaultValue 'forward'
   */
  paginationDirection?: 'forward' | 'backward';

  /**
   * The data returned from the GraphQL query containing the connection.
   */
  data?: TData | null;

  /**
   * Function to extract the connection from the query data.
   * Required for Controlled Mode.
   *
   * @param data - The query data.
   * @returns The connection object containing edges and pageInfo.
   */
  getConnection?: (
    data: TData,
  ) => InterfaceConnection<TNode> | null | undefined; // i18n-ignore-line

  /**
   * Current query variables.
   * Used to determine pagination state.
   * Required for Controlled Mode.
   */
  queryVariables?: {
    first?: number | null;
    after?: string | null;
    last?: number | null;
    before?: string | null;
    [key: string]: unknown;
  };

  /**
   * Number of items to fetch per page.
   */
  itemsPerPage: number;

  /**
   * Callback function to load more items.
   * Required for Controlled Mode.
   *
   * @param variables - The new query variables to fetch the next/previous page.
   * @returns A promise that resolves when the data is loaded.
   */
  onLoadMore?: (variables: Record<string, unknown>) => Promise<unknown>;

  /**
   * Render function that receives pagination state and renders the UI.
   * Required for Controlled Mode (unless renderItem is used in Smart Mode).
   *
   * @param props - The render props containing items, loading state, and loadMore function.
   */
  children?: (
    props: InterfaceCursorPaginationRenderProps<TNode>,
  ) => React.ReactNode;

  /**
   * Optional ref to the scroll container.
   * Required for backward pagination to maintain scroll position.
   */
  scrollContainerRef?: React.RefObject<HTMLElement>;

  /**
   * Optional callback fired when items change.
   * Useful for side effects like scroll position management.
   */
  onItemsChange?: (items: TNode[]) => void;

  // --- Smart Mode Props (Optional) ---

  /**
   * GraphQL query to fetch data.
   * If provided, the component will manage data fetching.
   */
  query?: DocumentNode;

  /**
   * Path to extract the connection from the query result.
   * e.g., "chat.messages" or "organizations.0.userTags"
   */
  dataPath?: string;

  /**
   * Render function for individual items (alternative to children render props).
   */
  renderItem?: (item: TNode) => React.ReactNode;

  /**
   * Function to extract unique key from an item.
   */
  keyExtractor?: (item: TNode) => string;

  /**
   * Component to display while loading.
   */
  loadingComponent?: React.ReactNode;

  /**
   * Component to display when list is empty.
   */
  emptyStateComponent?: React.ReactNode;

  /**
   * Trigger to force refetch (for Smart Mode).
   */
  refetchTrigger?: number;

  /**
   * Callback when data is changed (Smart Mode).
   */
  onDataChange?: (items: TNode[]) => void;
}
